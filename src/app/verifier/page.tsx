import { VerifyForm } from "@/components/verify/verify-form";

export default async function VerifierPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-2 text-2xl font-semibold">Vérifier un document</h1>
        <p className="mb-8 text-sm text-neutral-400">
          Entrez l&apos;identifiant KARA (ou scannez le QR code fourni) pour vérifier l&apos;existence
          et l&apos;intégrité d&apos;un document certifié. Aucune connexion requise.
        </p>
        <VerifyForm initialCode={code} />
      </div>
    </main>
  );
}
