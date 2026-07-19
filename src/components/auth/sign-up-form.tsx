"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp, type ActionState } from "@/app/(auth)/actions";

const initialState: ActionState = { error: null };

const accountTypeOptions = [
  { value: "individual", label: "Particulier" },
  { value: "professional", label: "Professionnel" },
  { value: "business", label: "Entreprise" },
] as const;

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [accountType, setAccountType] = useState<string>("individual");

  return (
    <form action={formAction} className="space-y-5">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-neutral-700">Type de compte</legend>
        <div className="grid grid-cols-3 gap-2">
          {accountTypeOptions.map((opt) => (
            <label
              key={opt.value}
              className={`cursor-pointer rounded-lg border px-3 py-2 text-center text-sm transition ${
                accountType === opt.value
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-300 text-neutral-600 hover:border-neutral-500"
              }`}
            >
              <input
                type="radio"
                name="accountType"
                value={opt.value}
                checked={accountType === opt.value}
                onChange={(e) => setAccountType(e.target.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
        {state.fieldErrors?.accountType && (
          <p className="text-xs text-red-600">{state.fieldErrors.accountType[0]}</p>
        )}
      </fieldset>

      {accountType === "business" && (
        <div className="space-y-1">
          <label htmlFor="organizationName" className="text-sm font-medium text-neutral-700">
            Nom de l&apos;entreprise
          </label>
          <input
            id="organizationName"
            name="organizationName"
            type="text"
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
          />
          {state.fieldErrors?.organizationName && (
            <p className="text-xs text-red-600">{state.fieldErrors.organizationName[0]}</p>
          )}
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="fullName" className="text-sm font-medium text-neutral-700">
          Nom complet
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
        />
        {state.fieldErrors?.fullName && (
          <p className="text-xs text-red-600">{state.fieldErrors.fullName[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-neutral-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
        />
        {state.fieldErrors?.email && (
          <p className="text-xs text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-neutral-700">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
        />
        <p className="text-xs text-neutral-500">
          12 caractères min., majuscule, minuscule, chiffre et caractère spécial.
        </p>
        {state.fieldErrors?.password && (
          <p className="text-xs text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-neutral-900"
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="text-xs text-red-600">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-neutral-900 py-2.5 font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50"
      >
        {pending ? "Création en cours…" : "Créer mon compte"}
      </button>

      <p className="text-center text-sm text-neutral-500">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-neutral-900 underline underline-offset-2">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
