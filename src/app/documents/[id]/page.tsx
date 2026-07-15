import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CertifyButton } from "@/components/documents/certify-button";

const levelLabels: Record<string, string> = {
  standard: "Standard",
  renforce: "Renforcé",
  professionnel: "Professionnel",
};

export default async function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: document } = await supabase
    .from("documents")
    .select("id, file_name, file_size_bytes, mime_type, created_at")
    .eq("id", id)
    .single();

  if (!document) {
    notFound();
  }

  const { data: certifications } = await supabase
    .from("certifications")
    .select("id, public_code, file_hash, level, status, certified_at")
    .eq("document_id", id)
    .order("certified_at", { ascending: false });

  const activeCertification = certifications?.find((c) => c.status === "active");

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{document.file_name}</h1>
          <p className="text-sm text-neutral-500">
            {(document.file_size_bytes / 1024).toFixed(0)} Ko · {document.mime_type} · ajouté le{" "}
            {new Date(document.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>

        {activeCertification ? (
          <div className="space-y-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6">
            <p className="text-sm font-medium text-emerald-400">
              ✓ Certifié — Niveau {levelLabels[activeCertification.level]}
            </p>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Identifiant public
                </dt>
                <dd className="font-mono text-neutral-300">{activeCertification.public_code}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">
                  Empreinte SHA-256
                </dt>
                <dd className="break-all font-mono text-xs text-neutral-400">
                  {activeCertification.file_hash}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-neutral-500">Date</dt>
                <dd className="text-neutral-300">
                  {new Date(activeCertification.certified_at).toLocaleString("fr-FR")}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <CertifyButton documentId={document.id} />
        )}
      </div>
    </main>
  );
}
