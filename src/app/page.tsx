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

      {/* Ce que KARA Secure établit — rupture visuelle claire, pas une carte de plus */}
      <section style={{ background: "var(--color-paper)" }}>
        <div className="mx-auto max-w-4xl px-6 py-20">
          <Reveal>
            <p
              className="mb-8 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "#8a6a3d" }}
            >
              Portée du service
            </p>
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="border-l-2 pl-6" style={{ borderColor: "#8a6a3d" }}>
                <h3 className="mb-2 font-display text-xl" style={{ color: "#141414" }}>
                  Ce que KARA Secure établit
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4a4a4a" }}>
                  Qu&apos;un fichier déterminé existait à une date donnée, et qu&apos;il n&apos;a
                  subi aucune altération depuis son enregistrement sur la plateforme.
                </p>
              </div>
              <div className="border-l-2 pl-6" style={{ borderColor: "#c4c4c4" }}>
                <h3 className="mb-2 font-display text-xl" style={{ color: "#141414" }}>
                  Ce que KARA Secure n&apos;établit pas
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4a4a4a" }}>
                  L&apos;exactitude des informations contenues dans le document. Le service
                  atteste l&apos;intégrité d&apos;un fichier, non la véracité de son contenu.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comment ça marche — frise connectée, pas des cartes répétées */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <p
              className="mb-3 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-gold)" }}
            >
              Procédure
            </p>
            <h2 className="mb-16 font-display text-2xl sm:text-3xl" style={{ color: "var(--color-text)" }}>
              Trois étapes, de l&apos;enregistrement à la vérification
            </h2>
          </Reveal>

          <div className="relative grid gap-12 sm:grid-cols-3 sm:gap-6">
            {/* ligne de connexion (desktop uniquement) */}
            <div
              className="absolute left-0 right-0 top-[18px] hidden h-px sm:block"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-border), var(--color-gold-dim), var(--color-border))",
              }}
            />
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 150}>
                <div className="relative">
                  <div
                    className="mb-5 flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs"
                    style={{
                      background: "var(--color-ink)",
                      border: `1px solid ${i === 0 ? "var(--color-gold)" : "var(--color-border)"}`,
                      color: i === 0 ? "var(--color-gold-bright)" : "var(--color-text-dim)",
                    }}
                  >
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-base font-medium" style={{ color: "var(--color-text)" }}>
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

      {/* Niveaux — médaillons métalliques, pas des cartes bordées */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-24">
          <Reveal>
            <p
              className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-gold)" }}
            >
              Niveaux
            </p>
            <h2
              className="mb-16 text-center font-display text-2xl sm:text-3xl"
              style={{ color: "var(--color-text)" }}
            >
              Niveaux de certification
            </h2>
          </Reveal>
          <div className="grid gap-10 sm:grid-cols-3">
            {levels.map((level, i) => (
              <Reveal key={level.name} delay={i * 150}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className="relative flex h-24 w-24 items-center justify-center rounded-full"
                    style={{
                      background: level.active ? "var(--gradient-gold)" : "var(--gradient-steel)",
                      boxShadow: level.active
                        ? "0 8px 24px -8px rgba(184,147,90,0.5), inset 0 1px 1px rgba(255,255,255,0.4)"
                        : "0 4px 16px -8px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.25)",
                      opacity: level.active ? 1 : 0.75,
                    }}
                  >
                    <div
                      className="flex h-[76px] w-[76px] items-center justify-center rounded-full"
                      style={{
                        background: "var(--color-ink)",
                        border: `1px solid ${level.active ? "rgba(217,189,134,0.4)" : "rgba(200,200,204,0.25)"}`,
                      }}
                    >
                      <span
                        className="font-display text-xs tracking-wide"
                        style={{ color: level.active ? "var(--color-gold-bright)" : "var(--color-steel-300)" }}
                      >
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-5 font-display text-lg" style={{ color: "var(--color-text)" }}>
                    {level.name}
                  </h3>
                  <span
                    className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em]"
                    style={{ color: level.active ? "var(--color-verified)" : "var(--color-text-dim)" }}
                  >
                    {level.status}
                  </span>
                  <p
                    className="mt-3 max-w-[220px] text-sm leading-relaxed"
                    style={{ color: "var(--color-text-muted)" }}
                  >
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
