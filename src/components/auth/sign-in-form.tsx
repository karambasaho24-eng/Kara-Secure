"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type ActionState } from "@/app/(auth)/actions";

const initialState: ActionState = { error: null };

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

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

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-neutral-200">
            Mot de passe
          </label>
          <Link
            href="/mot-de-passe-oublie"
            className="text-xs text-neutral-400 underline underline-offset-2 hover:text-white"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
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
        {pending ? "Connexion…" : "Se connecter"}
      </button>

      <p className="text-center text-sm text-neutral-400">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-white underline underline-offset-2">
          Créer un compte
        </Link>
      </p>
    </form>
  );
}
