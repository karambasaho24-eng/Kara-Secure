import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function NouveauMotDePassePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-2xl font-semibold text-white">Nouveau mot de passe</h1>
        <p className="mb-8 text-sm text-neutral-400">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
        <UpdatePasswordForm />
      </div>
    </main>
  );
}
