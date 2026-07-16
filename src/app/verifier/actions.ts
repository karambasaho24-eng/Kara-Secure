"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { computeSha256 } from "@/lib/documents/hash";

export type VerificationResult = {
  found: boolean;
  karaId?: string;
  level?: string;
  status?: string;
  certifiedAt?: string;
  documentCreatedAt?: string;
  mimeType?: string;
  integrityOk?: boolean; // true si la version actuelle correspond au hash certifié
  error?: string;
};

/**
 * Vérification publique par identifiant. Accessible sans connexion.
 *
 * IMPORTANT — surface de données volontairement minimale : jamais le nom du
 * fichier (peut contenir des infos personnelles, ex. "fiche_paie_dupont.pdf"),
 * jamais le propriétaire, jamais le fichier lui-même. Uniquement le strict
 * nécessaire pour confirmer l'existence et l'intégrité d'une certification.
 */
export async function verifyByCode(rawCode: string): Promise<VerificationResult> {
  const code = rawCode.trim().replace(/\s+/g, "");
  if (!code) {
    return { found: false, error: "Merci d'entrer un identifiant." };
  }

  const admin = createAdminClient();

  // Le code peut être soit un KARA-ID (document), soit un identifiant de
  // certification (public_code). On cherche dans les deux.
  const { data: certByPublicCode } = await admin
    .from("certifications")
    .select("id, public_code, level, status, certified_at, file_hash, document_id")
    .eq("public_code", code)
    .maybeSingle();

  let certification = certByPublicCode;

  if (!certification) {
    const { data: doc } = await admin
      .from("documents")
      .select("id")
      .eq("kara_id", code)
      .maybeSingle();

    if (doc) {
      const { data: certByDocId } = await admin
        .from("certifications")
        .select("id, public_code, level, status, certified_at, file_hash, document_id")
        .eq("document_id", doc.id)
        .eq("status", "active")
        .order("certified_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      certification = certByDocId;
    }
  }

  if (!certification) {
    return { found: false, error: "Aucun document trouvé avec cet identifiant." };
  }

  const { data: document } = await admin
    .from("documents")
    .select("kara_id, mime_type, created_at")
    .eq("id", certification.document_id)
    .single();

  const { data: latestVersion } = await admin
    .from("versions")
    .select("file_hash")
    .eq("document_id", certification.document_id)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const integrityOk = latestVersion
    ? latestVersion.file_hash === certification.file_hash
    : true;

  return {
    found: true,
    karaId: document?.kara_id,
    level: certification.level,
    status: certification.status,
    certifiedAt: certification.certified_at,
    documentCreatedAt: document?.created_at,
    mimeType: document?.mime_type,
    integrityOk,
  };
}

/**
 * Vérification par comparaison de fichier : la personne qui a reçu un
 * document peut uploader ce qu'elle a reçu pour confirmer qu'il correspond
 * exactement à la version certifiée — sans jamais voir le fichier original.
 */
export async function verifyByFile(
  code: string,
  file: File
): Promise<{ matches: boolean; error?: string }> {
  const admin = createAdminClient();
  const cleanCode = code.trim().replace(/\s+/g, "");

  const { data: certification } = await admin
    .from("certifications")
    .select("file_hash")
    .eq("public_code", cleanCode)
    .eq("status", "active")
    .maybeSingle();

  if (!certification) {
    return { matches: false, error: "Identifiant de certification introuvable." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadedHash = computeSha256(buffer);

  return { matches: uploadedHash === certification.file_hash };
}
