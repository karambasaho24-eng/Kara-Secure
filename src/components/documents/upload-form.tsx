"use client";

import { useActionState } from "react";
import { uploadDocument, type DocumentActionState } from "@/app/documents/actions";

const initialState: DocumentActionState = { error: null };

export function UploadDocumentForm() {
  const [state, formAction, pending] = useActionState(uploadDocument, initialState);

  return (
    <form action={formAction} className="space-y-5">
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

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-white py-2.5 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {pending ? "Envoi en cours…" : "Envoyer le document"}
      </button>
    </form>
  );
}
