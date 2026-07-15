import "server-only";
import { createHash } from "node:crypto";

/**
 * Calcule le SHA-256 d'un fichier. Appelé exclusivement côté serveur.
 * Ne JAMAIS accepter un hash envoyé par le client : ça permettrait à un
 * utilisateur malveillant de falsifier l'empreinte d'un document trafiqué.
 */
export function computeSha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 Mo, aligné sur le bucket Storage

export function assertValidFile(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error("Type de fichier non autorisé. Formats acceptés : PDF, PNG, JPEG, WEBP.");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Fichier trop volumineux (25 Mo maximum).");
  }
  if (file.size === 0) {
    throw new Error("Fichier vide.");
  }
}
