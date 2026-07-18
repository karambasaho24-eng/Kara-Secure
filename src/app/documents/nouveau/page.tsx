import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UploadDocumentForm } from "@/components/documents/upload-form";
import { AppHeader } from "@/components/layout/app-header";

export default async function NouveauDocumentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--color-ink)" }}>
      <AppHeader email={user.email} />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <p
            className="mb-3 font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-gold)" }}
          >
            Nouveau document
          </p>
          <h1 className="mb-1 font-display text-2xl" style={{ color: "var(--color-text)" }}>
            Enregistrer un document
          </h1>
          <p className="mb-8 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Le fichier est stocké de façon chiffrée et privée avant certification.
          </p>
          <UploadDocumentForm />
        </div>
      </div>
    </main>
  );
}
