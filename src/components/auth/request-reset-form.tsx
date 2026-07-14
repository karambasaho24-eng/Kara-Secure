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

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-white py-2.5 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Envoyer le lien de réinitialisation"}
      </button>

      {/* Message identique qu'un compte existe ou non (anti-énumération) */}
      {state.error === null && pending === false && state !== initialState && (
        <p className="text-sm text-neutral-300">
          Si un compte existe avec cet email, un lien de réinitialisation vient d&apos;être envoyé.
        </p>
      )}
    </form>
  );
}
