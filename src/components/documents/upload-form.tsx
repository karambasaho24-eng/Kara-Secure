"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { prepareUpload, finalizeDocumentUpload } from "@/app/documents/actions";

export function UploadDocumentForm() {
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      setError("Aucun fichier sélectionné.");
      return;
    }

    startTransition(async () => {
      setProgress("Préparation de l'envoi…");

      // 1. Demande un chemin de stockage sécurisé au serveur (juste du texte,
      // aucune limite de taille possible ici).
      const prepared = await prepareUpload(null, file.name);
      if ("error" in prepared) {
        setError(prepared.error);
        setProgress(null);
        return;
      }

      // 2. Upload DIRECT du navigateur vers Supabase Storage — ne passe
      // jamais par une fonction serveur Netlify, donc aucune limite de
      // taille de requête ne s'applique (seule la limite du bucket : 25 Mo).
      setProgress("Envoi du fichier…");
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(prepared.storagePath, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        setError(`Échec de l'envoi : ${uploadError.message}`);
        setProgress(null);
        return;
      }

      // 3. Finalise côté serveur : juste des métadonnées (petite requête),
      // le hash est recalculé côté serveur pour rester digne de confiance.
      setProgress("Finalisation…");
      const finalizeForm = new FormData();
      finalizeForm.set("storagePath", prepared.storagePath);
      finalizeForm.set("fileName", file.name);
      finalizeForm.set("fileSize", String(file.size));
      finalizeForm.set("mimeType", file.type);

      const result = await finalizeDocumentUpload(finalizeForm);
      if (result?.error) {
        setError(result.error);
        setProgress(null);
      }
      // Sinon : la Server Action redirige elle-même vers la page du document.
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label htmlFor="file" className="text-sm font-medium text-neutral-200">
          Fichier
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/webp"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
        />
        <p className="text-xs text-neutral-500">PDF, PNG, JPEG ou WEBP. 25 Mo maximum.</p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {progress && !error && <p className="text-sm text-neutral-400">{progress}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-white py-2.5 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {isPending ? (progress ?? "Envoi en cours…") : "Envoyer le document"}
      </button>
    </form>
  );
}
