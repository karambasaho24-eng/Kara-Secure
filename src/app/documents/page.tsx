import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("id, file_name, created_at, certifications(id, status, level)")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen" style={{ background: "var(--color-ink)" }}>
      <AppHeader email={user.email} />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p
              className="mb-1 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-gold)" }}
            >
              Espace personnel
            </p>
            <h1 className="font-display text-2xl" style={{ color: "var(--color-text)" }}>
              Mes documents
            </h1>
          </div>
          <Link
            href="/documents/nouveau"
            className="rounded-lg px-4 py-2 text-sm font-medium transition hover:opacity-90"
            style={{ background: "var(--color-text)", color: "var(--color-ink)" }}
          >
            + Nouveau document
          </Link>
        </div>

        {!documents || documents.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
            Aucun document enregistré.{" "}
            <Link href="/documents/nouveau" className="underline" style={{ color: "var(--color-text-muted)" }}>
              Enregistrer un premier document
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
            {documents.map((doc) => {
              const cert = Array.isArray(doc.certifications)
                ? doc.certifications[0]
                : doc.certifications;
              return (
                <li key={doc.id} style={{ borderColor: "var(--color-border)" }}>
                  <Link
                    href={`/documents/${doc.id}`}
                    className="flex items-center justify-between px-4 py-3.5 transition"
                    style={{ color: "var(--color-text)" }}
                  >
                    <span className="text-sm">{doc.file_name}</span>
                    <span
                      className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                      style={{
                        color: cert ? "var(--color-verified)" : "var(--color-text-dim)",
                        background: cert ? "rgba(52,211,153,0.1)" : "var(--color-ink-soft)",
                      }}
                    >
                      {cert ? "Certifié" : "Non certifié"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
