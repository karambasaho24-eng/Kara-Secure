import Link from "next/link";
import { Wordmark } from "@/components/layout/wordmark";
import { signOut } from "@/app/(auth)/actions";

export function AppHeader({ email }: { email?: string }) {
  return (
    <header className="border-b" style={{ borderColor: "var(--color-border)" }}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-10">
          <Wordmark href="/documents" />
          <nav className="hidden items-center gap-6 sm:flex">
            <Link
              href="/documents"
              className="font-mono text-xs uppercase tracking-[0.1em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Mes documents
            </Link>
            <Link
              href="/compte"
              className="font-mono text-xs uppercase tracking-[0.1em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Mon compte
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {email && (
            <span className="hidden font-mono text-xs sm:inline" style={{ color: "var(--color-text-dim)" }}>
              {email}
            </span>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] transition hover:border-neutral-500"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
