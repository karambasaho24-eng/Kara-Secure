"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { prepareNewVersionUpload, finalizeNewVersion } from "@/app/documents/actions";

export function NewVersionForm({ documentId }: { documentId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const reasonInput = form.elements.namedItem("modificationReason") as HTMLTextAreaElement;
    const file = fileInput.files?.[0];
    const modificationReason = reasonInput.value.trim();

    if (!file) {
      setError("Aucun fichier sélectionné.");
      return;
    }
    if (modificationReason.length < 3) {
      setError("Le motif de modification est obligatoire (3 caractères minimum).");
      return;
    }

    startTransition(async () => {
      setProgress("Préparation de l'envoi…");

      const prepared = await prepareNewVersionUpload(documentId, file.name);
      if ("error" in prepared) {
        setError(prepared.error);
        setProgress(null);
        return;
      }

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

      setProgress("Finalisation…");
      const finalizeForm = new FormData();
      finalizeForm.set("documentId", documentId);
      finalizeForm.set("storagePath", prepared.storagePath);
      finalizeForm.set("fileName", file.name);
      finalizeForm.set("fileSize", String(file.size));
      finalizeForm.set("mimeType", file.type);
      finalizeForm.set("modificationReason", modificationReason);

      const result = await finalizeNewVersion(finalizeForm);
      if (result?.error) {
        setError(result.error);
        setProgress(null);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-neutral-200 p-6">
      <div className="space-y-1">
        <label htmlFor="file" className="text-sm font-medium text-neutral-700">
          Nouveau fichier
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/webp"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="modificationReason" className="text-sm font-medium text-neutral-700">
          Motif de la modification <span className="text-red-600">*</span>
        </label>
        <textarea
          id="modificationReason"
          name="modificationReason"
          required
          minLength={3}
          rows={2}
          placeholder="Ex : correction d'une erreur administrative, mise à jour d'une information…"
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-900"
        />
        <p className="text-xs text-neutral-500">
          Obligatoire — chaque évolution du document est enregistrée dans son historique.
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {progress && !error && <p className="text-sm text-neutral-500">{progress}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-neutral-900 py-2.5 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
      >
        {isPending ? (progress ?? "Enregistrement…") : "Enregistrer la nouvelle version"}
      </button>
    </form>
  );
}
