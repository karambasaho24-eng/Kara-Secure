import Link from "next/link";
import { Wordmark } from "@/components/layout/wordmark";

export function PublicHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ borderColor: "var(--color-border)", background: "rgba(10,10,10,0.85)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Wordmark />
        <nav className="hidden items-center gap-8 sm:flex">
          <Link
            href="/verifier"
            className="font-mono text-xs uppercase tracking-[0.1em] transition"
            style={{ color: "var(--color-text-muted)" }}
          >
            Vérifier un document
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="font-mono text-xs uppercase tracking-[0.1em]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="rounded-md px-4 py-2 text-xs font-medium"
            style={{ background: "var(--color-text)", color: "var(--color-ink)" }}
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </header>
  );
}
