"use client";

import { useActionState } from "react";
import { requestPasswordReset, type ActionState } from "@/app/(auth)/actions";

const initialState: ActionState = { error: null };

export function RequestResetForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-neutral-200">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-white outline-none focus:border-white"
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-white py-2.5 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Envoyer le lien de réinitialisation"}
      </button>
    </form>
  );
}
