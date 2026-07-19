import Link from "next/link";
import { Mark } from "@/components/layout/wordmark";
import { MenuButton } from "@/components/layout/menu-button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50" style={{ background: "#0a0a0a" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-3 items-center px-6 py-5">
        <div>
          <MenuButton />
        </div>

        <div className="flex justify-center">
          <Mark tone="light" />
        </div>

        <div className="flex items-center justify-end gap-5">
          <Link href="/verifier" aria-label="Vérifier un document" className="text-white">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M20 20l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </Link>
          <Link href="/connexion" aria-label="Connexion" className="text-white">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
              <path
                d="M4.5 20c1.4-3.6 4.4-5.6 7.5-5.6s6.1 2 7.5 5.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
