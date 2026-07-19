import Link from "next/link";
import { Mark } from "@/components/layout/wordmark";

export function PublicFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--color-border)" }}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Mark tone="dark" />
            <p className="mt-3 max-w-xs text-xs leading-relaxed" style={{ color: "var(--color-text-dim)" }}>
              Preuve d&apos;intégrité documentaire. KARA Secure enregistre l&apos;empreinte
              numérique d&apos;un document et permet d&apos;en vérifier l&apos;intégrité dans le
              temps.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em]"
                style={{ color: "var(--color-text-dim)" }}
              >
                Produit
              </p>
              <ul className="space-y-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                <li>
                  <Link href="/verifier" className="hover:underline">
                    Vérifier un document
                  </Link>
                </li>
                <li>
                  <Link href="/inscription" className="hover:underline">
                    Créer un compte
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p
                className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em]"
                style={{ color: "var(--color-text-dim)" }}
              >
                Compte
              </p>
              <ul className="space-y-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                <li>
                  <Link href="/connexion" className="hover:underline">
                    Connexion
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col gap-2 border-t pt-6 text-[11px] sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-dim)" }}
        >
          <span>© 2026 KARA Secure. Tous droits réservés.</span>
          <span>Les documents sont chiffrés et stockés de façon strictement privée.</span>
        </div>
      </div>
    </footer>
  );
}
