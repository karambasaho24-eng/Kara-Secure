"use client";

import { useActionState } from "react";
import { addNewVersion, type DocumentActionState } from "@/app/documents/actions";

const initialState: DocumentActionState = { error: null };

export function NewVersionForm({ documentId }: { documentId: string }) {
  const [state, formAction, pending] = useActionState(addNewVersion, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-neutral-800 p-6">
      <input type="hidden" name="documentId" value={documentId} />

      <div className="space-y-1">
        <label htmlFor="file" className="text-sm font-medium text-neutral-200">
          Nouveau fichier
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf,image/png,image/jpeg,image/webp"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-black"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="modificationReason" className="text-sm font-medium text-neutral-200">
          Motif de la modification <span className="text-red-400">*</span>
        </label>
        <textarea
          id="modificationReason"
          name="modificationReason"
          required
          minLength={3}
          rows={2}
          placeholder="Ex : correction d'une erreur administrative, mise à jour d'une information…"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-white"
        />
        <p className="text-xs text-neutral-500">
          Obligatoire — chaque évolution du document est enregistrée dans son historique.
        </p>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-white py-2.5 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {pending ? "Enregistrement…" : "Enregistrer la nouvelle version"}
      </button>
    </form>
  );
}
