import Link from "next/link";
import { CertificationStory } from "@/components/marketing/certification-story";
import { Reveal } from "@/components/marketing/reveal";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

const steps = [
  {
    number: "01",
    title: "Enregistrement du document",
    description:
      "Le fichier (PDF, photo ou scan) est transmis de façon chiffrée et stocké dans un espace strictement privé.",
  },
  {
    number: "02",
    title: "Calcul de l'empreinte",
    description:
      "Une empreinte cryptographique SHA-256 est générée côté serveur et associée à un identifiant KARA-ID unique et permanent.",
  },
  {
    number: "03",
    title: "Vérification indépendante",
    description:
      "Toute personne, sans compte, peut confirmer par QR code ou identifiant que le document présenté correspond à la version enregistrée.",
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
    status: "À venir",
    active: false,
    description: "Identité du titulaire confirmée par un tiers vérificateur.",
  },
  {
    name: "Professionnel",
    status: "À venir",
    active: false,
    description: "Document validé directement par l'organisme émetteur.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "var(--color-ink)" }}>
      <PublicHeader />

      {/* Hero — scène d'ouverture animée */}
      <section className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-16 px-6 pb-24 pt-16 lg:flex-row lg:pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="flex-1">
          <p
            className="mb-5 font-mono text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-gold)" }}
          >
            Infrastructure de preuve documentaire
          </p>
          <h1
            className="font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl"
            style={{ color: "var(--color-text)" }}
          >
            Établissez, de façon vérifiable, qu&apos;un document n&apos;a pas été modifié depuis
            son enregistrement.
          </h1>
          <p
            className="mt-6 max-w-lg text-base leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            KARA Secure calcule et conserve l&apos;empreinte cryptographique de chaque document
            certifié, afin d&apos;en garantir l&apos;intégrité et de permettre une vérification
            indépendante, à tout moment.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/inscription"
              className="rounded-lg px-6 py-3 text-sm font-medium transition hover:opacity-90"
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
        </div>

        <div className="flex flex-1 justify-center lg:justify-end">
          <CertificationStory />
        </div>
      </section>

      {/* Ce que KARA Secure établit — et ce qu'elle n'établit pas */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Reveal>
            <div
              className="rounded-2xl border p-8"
              style={{ borderColor: "var(--color-border)", background: "var(--color-ink-soft)" }}
            >
              <p
                className="mb-4 font-mono text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--color-gold)" }}
              >
                Portée du service
              </p>
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-display text-lg" style={{ color: "var(--color-text)" }}>
                    Ce que KARA Secure établit
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    Qu&apos;un fichier déterminé existait à une date donnée, et qu&apos;il n&apos;a
                    subi aucune altération depuis son enregistrement sur la plateforme.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 font-display text-lg" style={{ color: "var(--color-text)" }}>
                    Ce que KARA Secure n&apos;établit pas
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    L&apos;exactitude des informations contenues dans le document. Le service
                    atteste l&apos;intégrité d&apos;un fichier, non la véracité de son contenu.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <p
              className="mb-3 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-gold)" }}
            >
              Procédure
            </p>
            <h2 className="mb-12 font-display text-2xl sm:text-3xl" style={{ color: "var(--color-text)" }}>
              Trois étapes, de l&apos;enregistrement à la vérification
            </h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 120}>
                <div>
                  <span className="font-display text-3xl" style={{ color: "var(--color-gold)" }}>
                    {step.number}
                  </span>
                  <h3 className="mt-3 mb-2 text-base font-medium" style={{ color: "var(--color-text)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Niveaux */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <p
              className="mb-3 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-gold)" }}
            >
              Niveaux
            </p>
            <h2 className="mb-12 font-display text-2xl sm:text-3xl" style={{ color: "var(--color-text)" }}>
              Niveaux de certification
            </h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {levels.map((level, i) => (
              <Reveal key={level.name} delay={i * 120}>
                <div
                  className="h-full rounded-xl border p-6 transition-transform duration-300 hover:-translate-y-1"
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
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Reveal>
            <h2 className="mb-4 font-display text-2xl sm:text-3xl" style={{ color: "var(--color-text)" }}>
              Enregistrez votre premier document.
            </h2>
            <p className="mb-8 text-sm" style={{ color: "var(--color-text-muted)" }}>
              La certification de niveau Standard est disponible sans engagement.
            </p>
            <Link
              href="/inscription"
              className="inline-block rounded-lg px-8 py-3 text-sm font-medium transition hover:opacity-90"
              style={{ background: "var(--color-text)", color: "var(--color-ink)" }}
            >
              Créer un compte
            </Link>
          </Reveal>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
