"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeSha256, assertValidFile } from "@/lib/documents/hash";

export type DocumentActionState = { error: string | null };

/**
 * Génère un chemin de stockage sécurisé pour un upload direct navigateur ->
 * Supabase Storage. Le fichier ne transite JAMAIS par une fonction serveur
 * Netlify (qui a ses propres limites de taille de requête, indépendantes de
 * la config Next.js) — seul ce chemin (texte, quelques octets) est généré ici.
 */
export async function prepareUpload(
  organizationId: string | null,
  fileName: string
): Promise<{ storagePath: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non connecté." };
  }

  const folderKey = organizationId ?? user.id;
  const ext = fileName.split(".").pop() ?? "bin";
  const storagePath = `${folderKey}/${randomUUID()}.${ext}`;

  return { storagePath };
}

/**
 * Finalise un upload de document après que le fichier ait été envoyé
 * directement du navigateur vers Supabase Storage. Ne reçoit que des
 * métadonnées (jamais le fichier) — le hash est recalculé ici en
 * re-téléchargeant le fichier depuis Storage côté serveur (donc toujours
 * digne de confiance, jamais fourni par le client).
 */
export async function finalizeDocumentUpload(formData: FormData): Promise<DocumentActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const storagePath = formData.get("storagePath") as string;
  const fileName = formData.get("fileName") as string;
  const fileSize = Number(formData.get("fileSize"));
  const mimeType = formData.get("mimeType") as string;
  const organizationId = (formData.get("organizationId") as string) || null;

  if (!storagePath || !fileName || !mimeType || !fileSize) {
    return { error: "Informations manquantes." };
  }

  // Re-télécharge le fichier fraîchement uploadé pour calculer son empreinte
  // côté serveur (jamais confiée au client) et vérifier qu'il est valide.
  const { data: fileBlob, error: downloadError } = await supabase.storage
    .from("documents")
    .download(storagePath);

  if (downloadError || !fileBlob) {
    return { error: "Fichier introuvable après envoi. Réessayez." };
  }

  const buffer = Buffer.from(await fileBlob.arrayBuffer());

  try {
    assertValidFile(new File([buffer], fileName, { type: mimeType }));
  } catch (e) {
    await supabase.storage.from("documents").remove([storagePath]);
    return { error: e instanceof Error ? e.message : "Fichier invalide." };
  }

  const { data: doc, error: insertError } = await supabase
    .from("documents")
    .insert({
      owner_id: organizationId ? null : user.id,
      organization_id: organizationId,
      file_name: fileName,
      file_size_bytes: fileSize,
      mime_type: mimeType,
      storage_path: storagePath,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (insertError || !doc) {
    await supabase.storage.from("documents").remove([storagePath]);
    return { error: "Échec de l'enregistrement du document." };
  }

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
 * Prépare le chemin de stockage pour une nouvelle version (upload direct
 * navigateur -> Storage, même logique anti-limite-Netlify que prepareUpload).
 */
export async function prepareNewVersionUpload(
  documentId: string,
  fileName: string
): Promise<{ storagePath: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non connecté." };
  }

  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("owner_id, organization_id")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    return { error: "Document introuvable ou accès refusé." };
  }

  const folderKey = document.organization_id ?? document.owner_id!;
  const ext = fileName.split(".").pop() ?? "bin";
  const storagePath = `${folderKey}/${randomUUID()}.${ext}`;

  return { storagePath };
}

/**
 * Finalise l'ajout d'une nouvelle version après upload direct navigateur ->
 * Storage. Motif de modification obligatoire (imposé aussi en base).
 */
export async function finalizeNewVersion(formData: FormData): Promise<DocumentActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const documentId = formData.get("documentId") as string;
  const storagePath = formData.get("storagePath") as string;
  const fileName = formData.get("fileName") as string;
  const fileSize = Number(formData.get("fileSize"));
  const mimeType = formData.get("mimeType") as string;
  const modificationReason = (formData.get("modificationReason") as string)?.trim();

  if (!modificationReason || modificationReason.length < 3) {
    return { error: "Le motif de modification est obligatoire (3 caractères minimum)." };
  }
  if (!storagePath || !fileName || !mimeType || !fileSize) {
    return { error: "Informations manquantes." };
  }

  const { data: fileBlob, error: downloadError } = await supabase.storage
    .from("documents")
    .download(storagePath);

  if (downloadError || !fileBlob) {
    return { error: "Fichier introuvable après envoi. Réessayez." };
  }

  const buffer = Buffer.from(await fileBlob.arrayBuffer());

  try {
    assertValidFile(new File([buffer], fileName, { type: mimeType }));
  } catch (e) {
    await supabase.storage.from("documents").remove([storagePath]);
    return { error: e instanceof Error ? e.message : "Fichier invalide." };
  }

  const { data: existingVersions } = await supabase
    .from("versions")
    .select("version_number")
    .eq("document_id", documentId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersionNumber = (existingVersions?.[0]?.version_number ?? 0) + 1;
  const fileHash = computeSha256(buffer);

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

  await supabase
    .from("documents")
    .update({
      storage_path: storagePath,
      file_name: fileName,
      file_size_bytes: fileSize,
      mime_type: mimeType,
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
