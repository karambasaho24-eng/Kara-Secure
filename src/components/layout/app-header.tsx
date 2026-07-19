import Link from "next/link";
import { Mark } from "@/components/layout/wordmark";
import { signOut } from "@/app/(auth)/actions";

export function AppHeader({ email }: { email?: string }) {
  return (
    <header style={{ background: "#0a0a0a" }}>
      <div className="mx-auto grid max-w-5xl grid-cols-3 items-center px-6 py-5">
        <nav className="flex items-center gap-6">
          <Link href="/documents" className="font-display text-xs tracking-[0.1em] text-white">
            MES DOCUMENTS
          </Link>
          <Link href="/compte" className="font-display text-xs tracking-[0.1em] text-white/70">
            MON COMPTE
          </Link>
        </nav>

        <div className="flex justify-center">
          <Mark href="/documents" tone="light" />
        </div>

        <div className="flex items-center justify-end gap-4">
          {email && <span className="hidden font-mono text-xs text-white/50 sm:inline">{email}</span>}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md border border-white/20 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.1em] text-white/80"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
