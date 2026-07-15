"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeSha256, assertValidFile } from "@/lib/documents/hash";

export type DocumentActionState = { error: string | null };

/**
 * Upload d'un document. Le fichier est stocké dans un chemin imprévisible
 * ({owner_id_ou_org_id}/{uuid}.{ext}) pour empêcher toute devinette d'URL.
 */
export async function uploadDocument(
  _prevState: DocumentActionState,
  formData: FormData
): Promise<DocumentActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const file = formData.get("file") as File | null;
  const organizationId = (formData.get("organizationId") as string) || null;

  if (!file) {
    return { error: "Aucun fichier sélectionné." };
  }

  try {
    assertValidFile(file);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Fichier invalide." };
  }

  // folderKey détermine qui a accès au fichier via les policies RLS du bucket
  // (voir migration phase3_storage_bucket) : soit l'utilisateur, soit son organisation.
  const folderKey = organizationId ?? user.id;
  const ext = file.name.split(".").pop() ?? "bin";
  const storagePath = `${folderKey}/${randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: "Échec de l'envoi du fichier. Réessayez." };
  }

  const { data: doc, error: insertError } = await supabase
    .from("documents")
    .insert({
      owner_id: organizationId ? null : user.id,
      organization_id: organizationId,
      file_name: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      storage_path: storagePath,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (insertError || !doc) {
    // Nettoyage : si l'insertion en base échoue, ne pas laisser un fichier orphelin.
    await supabase.storage.from("documents").remove([storagePath]);
    return { error: "Échec de l'enregistrement du document." };
  }

  revalidatePath("/documents");
  redirect(`/documents/${doc.id}`);
}

/**
 * Certification d'un document : calcule le hash côté serveur à partir du
 * fichier réellement stocké (jamais d'un hash fourni par le client), puis
 * crée l'enregistrement de certification. Utilise le client admin car aucune
 * policy INSERT publique n'existe sur `certifications` (protection par défaut).
 */
export async function certifyDocument(
  documentId: string,
  level: "standard" | "renforce" | "professionnel"
): Promise<DocumentActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  // Vérifie que l'utilisateur a bien accès à ce document (RLS applique déjà
  // cette règle, mais on veut un message d'erreur clair si l'accès échoue).
  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id, storage_path")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    return { error: "Document introuvable ou accès refusé." };
  }

  const { data: fileBlob, error: downloadError } = await supabase.storage
    .from("documents")
    .download(document.storage_path);

  if (downloadError || !fileBlob) {
    return { error: "Impossible de lire le fichier pour le certifier." };
  }

  const buffer = Buffer.from(await fileBlob.arrayBuffer());
  const fileHash = computeSha256(buffer);

  const admin = createAdminClient();
  const { error: certError } = await admin.from("certifications").insert({
    document_id: documentId,
    file_hash: fileHash,
    level,
    certified_by: user.id,
  });

  if (certError) {
    return { error: "Échec de la certification. Réessayez." };
  }

  revalidatePath(`/documents/${documentId}`);
  return { error: null };
}
