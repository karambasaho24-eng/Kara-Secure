import { RequestResetForm } from "@/components/auth/request-reset-form";

export default function MotDePasseOubliePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-2xl font-semibold text-white">Mot de passe oublié</h1>
        <p className="mb-8 text-sm text-neutral-400">
          Entrez votre email, nous vous enverrons un lien de réinitialisation.
        </p>
        <RequestResetForm />
      </div>
    </main>
  );
}
