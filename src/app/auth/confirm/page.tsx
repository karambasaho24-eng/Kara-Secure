export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ envoye?: string }>;
}) {
  const { envoye } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12 text-center">
      <div className="max-w-md">
        <h1 className="mb-3 text-2xl font-semibold text-white">
          {envoye ? "Vérifiez votre boîte mail" : "Confirmation"}
        </h1>
        <p className="text-sm text-neutral-400">
          {envoye
            ? "Un email de confirmation vient de vous être envoyé. Cliquez sur le lien qu'il contient pour activer votre compte."
            : "Votre email a bien été confirmé."}
        </p>
      </div>
    </main>
  );
}
