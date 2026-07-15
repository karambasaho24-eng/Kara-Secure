import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Mes documents</h1>
          <Link
            href="/documents/nouveau"
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            + Nouveau document
          </Link>
        </div>

        {!documents || documents.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Aucun document pour le moment.{" "}
            <Link href="/documents/nouveau" className="underline">
              Envoyez votre premier document
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-neutral-800 rounded-lg border border-neutral-800">
            {documents.map((doc) => {
              const cert = Array.isArray(doc.certifications)
                ? doc.certifications[0]
                : doc.certifications;
              return (
                <li key={doc.id}>
                  <Link
                    href={`/documents/${doc.id}`}
                    className="flex items-center justify-between px-4 py-3 transition hover:bg-neutral-900"
                  >
                    <span className="text-sm">{doc.file_name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        cert
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-neutral-800 text-neutral-400"
                      }`}
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
