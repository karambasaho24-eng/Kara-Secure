import Link from "next/link";

export default function EmailEnvoyePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-center">
      <div className="max-w-md">
        <div className="mb-4 text-4xl">📧</div>
        <h1 className="mb-3 text-2xl font-semibold text-neutral-900">Vérifiez votre boîte mail</h1>
        <p className="mb-6 text-sm text-neutral-500">
          Si un compte existe avec cette adresse, un email vient de vous être envoyé avec un
          lien pour réinitialiser votre mot de passe. Pensez à vérifier vos spams si vous ne le
          voyez pas dans les prochaines minutes.
        </p>
        <Link href="/connexion" className="text-sm text-neutral-900 underline underline-offset-2">
          Retour à la connexion
        </Link>
      </div>
    </main>
  );
}
