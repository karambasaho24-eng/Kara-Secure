"use client";

import { useState } from "react";
import Link from "next/link";

export function MenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 text-white"
        aria-expanded={open}
      >
        <span className="flex flex-col gap-[3px]">
          <span className="h-[2px] w-5 bg-white" />
          <span className="h-[2px] w-5 bg-white" />
          <span className="h-[2px] w-5 bg-white" />
        </span>
        <span className="font-display text-xs tracking-[0.1em]">MENU</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-full z-50 mt-4 w-56 rounded-lg border py-2 shadow-xl"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <Link
              href="/verifier"
              className="block px-4 py-2.5 text-sm"
              style={{ color: "var(--color-text)" }}
              onClick={() => setOpen(false)}
            >
              Vérifier un document
            </Link>
            <Link
              href="/connexion"
              className="block px-4 py-2.5 text-sm"
              style={{ color: "var(--color-text)" }}
              onClick={() => setOpen(false)}
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="block px-4 py-2.5 text-sm"
              style={{ color: "var(--color-text)" }}
              onClick={() => setOpen(false)}
            >
              Créer un compte
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
