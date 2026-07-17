import Link from "next/link";
import { FingerprintCard } from "@/components/marketing/fingerprint-card";

const steps = [
  {
    number: "01",
    title: "Envoyer le document",
    description:
      "PDF, photo ou scan — le fichier est stocké de façon chiffrée et privée, jamais accessible publiquement.",
  },
  {
    number: "02",
    title: "Créer l'empreinte",
    description:
      "Une empreinte SHA-256 est calculée côté serveur et associée à un identifiant KARA-ID unique et permanent.",
  },
  {
    number: "03",
    title: "Vérifier à tout moment",
    description:
      "N'importe qui, sans compte, peut scanner le QR code ou entrer l'identifiant pour confirmer que le document n'a pas changé.",
  },
];

const levels = [
  {
    name: "Standard",
    status: "Disponible",
    active: true,
    description: "Empreinte numérique, horodatage, identifiant KARA-ID, QR code de vérification.",
  },
  {
    name: "Renforcé",
    status: "Bientôt",
    active: false,
    description: "Identité du propriétaire confirmée par un tiers vérificateur.",
  },
  {
    name: "Professionnel",
    status: "Bientôt",
    active: false,
    description: "Document validé directement par l'organisme émetteur (entreprise, école…).",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "var(--color-ink)" }}>
      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-16 px-6 pb-24 pt-20 lg:flex-row lg:pt-32">
        <div className="flex-1">
          <p
            className="mb-5 font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-gold)" }}
          >
            Preuve d&apos;intégrité documentaire
          </p>
          <h1
            className="font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl"
            style={{ color: "var(--color-text)" }}
          >
            Prouvez qu&apos;un document n&apos;a pas changé depuis le jour où vous l&apos;avez
            enregistré.
          </h1>
          <p
            className="mt-6 max-w-lg text-base leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            KARA Secure enregistre l&apos;empreinte numérique de vos documents et vous donne un
            moyen simple de vérifier, à tout moment, qu&apos;une copie correspond exactement à la
            version d&apos;origine.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/inscription"
              className="rounded-lg px-6 py-3 text-sm font-medium transition"
              style={{ background: "var(--color-text)", color: "var(--color-ink)" }}
            >
              Certifier un document
            </Link>
            <Link
              href="/verifier"
              className="rounded-lg border px-6 py-3 text-sm font-medium transition hover:border-neutral-500"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
            >
              Vérifier un document
            </Link>
          </div>

          <p className="mt-6 text-xs" style={{ color: "var(--color-text-dim)" }}>
            Aucune carte bancaire requise pour commencer.
          </p>
        </div>

        <div className="flex flex-1 justify-center lg:justify-end">
          <FingerprintCard />
        </div>
      </section>

      {/* Ce que KARA Secure fait — et ne fait pas */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div
            className="rounded-2xl border p-8"
            style={{ borderColor: "var(--color-border)", background: "var(--color-ink-soft)" }}
          >
            <p
              className="mb-4 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-gold)" }}
            >
              À propos, sans détour
            </p>
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-2 font-display text-lg" style={{ color: "var(--color-text)" }}>
                  Ce que ça prouve
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  Qu&apos;un fichier précis existait à une date donnée, et qu&apos;il n&apos;a
                  subi aucune modification depuis son enregistrement sur la plateforme.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-display text-lg" style={{ color: "var(--color-text)" }}>
                  Ce que ça ne prouve pas
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  Que les informations contenues dans le document sont vraies. KARA Secure
                  n&apos;est pas un juge — c&apos;est une preuve d&apos;intégrité, pas une
                  enquête.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2
            className="mb-12 font-display text-2xl sm:text-3xl"
            style={{ color: "var(--color-text)" }}
          >
            Comment ça marche
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number}>
                <span
                  className="font-display text-3xl"
                  style={{ color: "var(--color-gold)" }}
                >
                  {step.number}
                </span>
                <h3
                  className="mt-3 mb-2 text-base font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Niveaux */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2
            className="mb-12 font-display text-2xl sm:text-3xl"
            style={{ color: "var(--color-text)" }}
          >
            Niveaux de certification
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {levels.map((level) => (
              <div
                key={level.name}
                className="rounded-xl border p-6"
                style={{
                  borderColor: level.active ? "var(--color-gold)" : "var(--color-border)",
                  opacity: level.active ? 1 : 0.6,
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-lg" style={{ color: "var(--color-text)" }}>
                    {level.name}
                  </h3>
                  <span
                    className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                    style={{
                      color: level.active ? "var(--color-verified)" : "var(--color-text-dim)",
                      background: level.active ? "rgba(52,211,153,0.1)" : "var(--color-ink-soft)",
                    }}
                  >
                    {level.status}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {level.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2
            className="mb-4 font-display text-2xl sm:text-3xl"
            style={{ color: "var(--color-text)" }}
          >
            Votre premier document, certifié en quelques minutes.
          </h2>
          <p className="mb-8 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Gratuit pour commencer.
          </p>
          <Link
            href="/inscription"
            className="inline-block rounded-lg px-8 py-3 text-sm font-medium transition"
            style={{ background: "var(--color-text)", color: "var(--color-ink)" }}
          >
            Créer mon compte
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div
          className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs sm:flex-row"
          style={{ color: "var(--color-text-dim)" }}
        >
          <span className="font-display" style={{ color: "var(--color-text-muted)" }}>
            KARA Secure
          </span>
          <div className="flex gap-6">
            <Link href="/verifier" className="hover:underline">
              Vérifier un document
            </Link>
            <Link href="/connexion" className="hover:underline">
              Connexion
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
