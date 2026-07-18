import { VerifyForm } from "@/components/verify/verify-form";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default async function VerifierPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="flex min-h-screen flex-col" style={{ background: "var(--color-ink)" }}>
      <PublicHeader />
      <div className="flex-1 px-6 py-16">
        <div className="mx-auto max-w-lg">
          <p
            className="mb-3 font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-gold)" }}
          >
            Vérification indépendante
          </p>
          <h1 className="mb-2 font-display text-2xl sm:text-3xl" style={{ color: "var(--color-text)" }}>
            Vérifier un document
          </h1>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Entrez l&apos;identifiant KARA du document, ou scannez le QR code fourni sur le
            certificat. Cette vérification ne nécessite aucune connexion.
          </p>
          <VerifyForm initialCode={code} />
        </div>
      </div>
      <PublicFooter />
    </main>
  );
}
