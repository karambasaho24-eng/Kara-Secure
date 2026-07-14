import { SignInForm } from "@/components/auth/sign-in-form";

export default function ConnexionPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-1 text-2xl font-semibold text-white">Connexion</h1>
        <p className="mb-8 text-sm text-neutral-400">
          Accédez à votre espace KARA Secure.
        </p>
        <SignInForm />
      </div>
    </main>
  );
}
