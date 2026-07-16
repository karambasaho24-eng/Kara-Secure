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

  // Version 1 = création initiale. Le hash est calculé ici aussi (pas de
  // hash client) pour que l'historique de versions soit complet dès le départ.
  const initialHash = computeSha256(buffer);
  await supabase.from("versions").insert({
    document_id: doc.id,
    version_number: 1,
    storage_path: storagePath,
    file_hash: initialHash,
    created_by: user.id,
    modification_reason: null,
  });

  revalidatePath("/documents");
  redirect(`/documents/${doc.id}`);
}

/**
 * Nouvelle version d'un document existant. Le motif de modification est
 * obligatoire (imposé aussi en base par une contrainte CHECK) : chaque
 * évolution du document doit être justifiée pour garder la valeur de preuve
 * de l'historique.
 */
export async function addNewVersion(
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

  const documentId = formData.get("documentId") as string;
  const file = formData.get("file") as File | null;
  const modificationReason = (formData.get("modificationReason") as string)?.trim();

  if (!file) {
    return { error: "Aucun fichier sélectionné." };
  }
  if (!modificationReason || modificationReason.length < 3) {
    return { error: "Le motif de modification est obligatoire (3 caractères minimum)." };
  }

  try {
    assertValidFile(file);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Fichier invalide." };
  }

  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("id, owner_id, organization_id")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    return { error: "Document introuvable ou accès refusé." };
  }

  const { data: existingVersions } = await supabase
    .from("versions")
    .select("version_number")
    .eq("document_id", documentId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersionNumber = (existingVersions?.[0]?.version_number ?? 0) + 1;

  const folderKey = document.organization_id ?? document.owner_id!;
  const ext = file.name.split(".").pop() ?? "bin";
  const storagePath = `${folderKey}/${randomUUID()}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileHash = computeSha256(buffer);

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: "Échec de l'envoi du fichier. Réessayez." };
  }

  const { error: versionError } = await supabase.from("versions").insert({
    document_id: documentId,
    version_number: nextVersionNumber,
    storage_path: storagePath,
    file_hash: fileHash,
    created_by: user.id,
    modification_reason: modificationReason,
  });

  if (versionError) {
    await supabase.storage.from("documents").remove([storagePath]);
    return { error: "Échec de l'enregistrement de la nouvelle version." };
  }

  // Le document pointe maintenant vers la dernière version.
  await supabase
    .from("documents")
    .update({
      storage_path: storagePath,
      file_name: file.name,
      file_size_bytes: file.size,
      mime_type: file.type,
      updated_at: new Date().toISOString(),
    })
    .eq("id", documentId);

  revalidatePath(`/documents/${documentId}`);
  redirect(`/documents/${documentId}`);
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
