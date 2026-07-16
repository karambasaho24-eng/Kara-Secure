import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CertifyButton } from "@/components/documents/certify-button";
import { NewVersionForm } from "@/components/documents/new-version-form";
import { generateVerificationQrCode } from "@/lib/documents/qrcode";

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
    .select("id, kara_id, file_name, file_size_bytes, mime_type, storage_path, created_at, updated_at")
    .eq("id", id)
    .single();

  if (!document) {
    notFound();
  }

  const [{ data: certifications }, { data: versions }] = await Promise.all([
    supabase
      .from("certifications")
      .select("id, public_code, file_hash, level, status, certified_at")
      .eq("document_id", id)
      .order("certified_at", { ascending: false }),
    supabase
      .from("versions")
      .select("id, version_number, file_hash, modification_reason, created_at")
      .eq("document_id", id)
      .order("version_number", { ascending: false }),
  ]);

  const activeCertification = certifications?.find((c) => c.status === "active");
  const latestVersion = versions?.[0];
  const qrCodeDataUrl = activeCertification
    ? await generateVerificationQrCode(activeCertification.public_code)
    : null;

  // Statut : compare l'empreinte de la dernière version au hash de la
  // certification active pour savoir si le document a bougé depuis.
  let status: "valide" | "modifie" | "non_certifie" = "non_certifie";
  if (activeCertification && latestVersion) {
    status = activeCertification.file_hash === latestVersion.file_hash ? "valide" : "modifie";
  }

  const statusConfig = {
    valide: { emoji: "🟢", label: "Document valide", color: "text-emerald-400" },
    modifie: { emoji: "🟠", label: "Document modifié depuis la certification", color: "text-orange-400" },
    non_certifie: { emoji: "⚪", label: "Non certifié", color: "text-neutral-400" },
  }[status];

  return (
    <main className="min-h-screen bg-black px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Carte d'identité du document */}
        <div className="rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-black p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Carte d&apos;identité KARA</p>
              <h1 className="text-xl font-semibold">{document.file_name}</h1>
            </div>
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.emoji} {statusConfig.label}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">KARA-ID</dt>
              <dd className="font-mono text-neutral-200">{document.kara_id}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">Type</dt>
              <dd className="text-neutral-200">{document.mime_type}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">Créé le</dt>
              <dd className="text-neutral-200">
                {new Date(document.created_at).toLocaleDateString("fr-FR")}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-neutral-500">Version actuelle</dt>
              <dd className="text-neutral-200">v{latestVersion?.version_number ?? 1}</dd>
            </div>
          </dl>
        </div>

        {/* Certification */}
        {activeCertification ? (
          <div className="space-y-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-sm font-medium text-emerald-400">
                  ✓ Certifié — Niveau {levelLabels[activeCertification.level]}
                </p>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-neutral-500">
                      Identifiant de certification
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
              {qrCodeDataUrl && (
                <div className="shrink-0 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeDataUrl} alt="QR code de vérification" className="h-28 w-28" />
                  <p className="mt-1 text-[10px] text-neutral-500">Scanner pour vérifier</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <CertifyButton documentId={document.id} />
        )}

        {/* Historique / timeline */}
        {versions && versions.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-neutral-200">Historique</h2>
            <ol className="space-y-3 border-l border-neutral-800 pl-4">
              {versions.map((v) => (
                <li key={v.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-neutral-600" />
                  <p className="text-sm text-neutral-300">
                    Version {v.version_number}
                    {v.version_number === 1 ? " — Création initiale" : ""}
                  </p>
                  {v.modification_reason && (
                    <p className="text-xs text-neutral-500">{v.modification_reason}</p>
                  )}
                  <p className="text-xs text-neutral-600">
                    {new Date(v.created_at).toLocaleString("fr-FR")}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Nouvelle version */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-neutral-200">Ajouter une nouvelle version</h2>
          <NewVersionForm documentId={document.id} />
        </div>
      </div>
    </main>
  );
}
