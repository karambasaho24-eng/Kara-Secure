import { SignUpForm } from "@/components/auth/sign-up-form";

export default function InscriptionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-2xl font-semibold text-white">Créer un compte</h1>
        <p className="mb-8 text-sm text-neutral-400">
          Rejoignez KARA Secure pour certifier vos documents.
        </p>
        <SignUpForm />
      </div>
    </main>
  );
}
