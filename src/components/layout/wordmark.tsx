import Link from "next/link";

/**
 * Marque KARA Secure — icône seule, sans texte ni cercle+texte.
 * Symbole : un document scellé (coin plié + sceau), lisible en petit format.
 */
export function Mark({ href = "/", tone = "light" }: { href?: string; tone?: "light" | "dark" }) {
  const stroke = tone === "light" ? "#ffffff" : "#0a0a0a";
  return (
    <Link href={href} aria-label="KARA Secure — Accueil" className="inline-flex items-center">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M9 4h10l6 6v18a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
          stroke={stroke}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M19 4v6h6" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
        <path
          d="M12 18.5l2.6 2.6L20 15.5"
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
