import { SignInForm } from "@/components/auth/sign-in-form";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function ConnexionPage() {
  return (
    <main className="flex min-h-screen flex-col" style={{ background: "var(--color-ink)" }}>
      <PublicHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <p
            className="mb-3 font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-gold)" }}
          >
            Connexion
          </p>
          <h1 className="mb-1 font-display text-2xl" style={{ color: "var(--color-text)" }}>
            Accéder à votre espace
          </h1>
          <p className="mb-8 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Connectez-vous pour gérer vos documents certifiés.
          </p>
          <SignInForm />
        </div>
      </div>
      <PublicFooter />
    </main>
  );
}
