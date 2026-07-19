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
    <main className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <PublicHeader />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 lg:pt-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p
              className="mb-6 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-accent)" }}
            >
              Infrastructure de preuve documentaire
            </p>
            <h1
              className="font-display-hero text-6xl leading-[0.95] sm:text-7xl"
              style={{ color: "var(--color-text)" }}
            >
              La preuve
              <br />
              qui ne bouge pas.
            </h1>
            <p
              className="mt-7 max-w-md text-base leading-relaxed"
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
                style={{ background: "var(--color-text)", color: "var(--color-bg)" }}
              >
                Certifier un document
              </Link>
              <Link
                href="/verifier"
                className="rounded-lg border px-6 py-3 text-sm font-medium transition"
                style={{ borderColor: "var(--color-border-strong)", color: "var(--color-text)" }}
              >
                Vérifier un document
              </Link>
            </div>
          </div>

          <CertificationStory />
        </div>
      </section>

      {/* Ce que KARA Secure établit — et ce qu'elle n'établit pas */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Reveal>
            <p
              className="mb-8 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-accent)" }}
            >
              Portée du service
            </p>
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="border-l-2 pl-6" style={{ borderColor: "var(--color-text)" }}>
                <h3 className="mb-2 font-display text-xl" style={{ color: "var(--color-text)" }}>
                  Ce que KARA Secure établit
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  Qu&apos;un fichier déterminé existait à une date donnée, et qu&apos;il n&apos;a
                  subi aucune altération depuis son enregistrement sur la plateforme.
                </p>
              </div>
              <div className="border-l-2 pl-6" style={{ borderColor: "var(--color-border-strong)" }}>
                <h3 className="mb-2 font-display text-xl" style={{ color: "var(--color-text)" }}>
                  Ce que KARA Secure n&apos;établit pas
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  L&apos;exactitude des informations contenues dans le document. Le service
                  atteste l&apos;intégrité d&apos;un fichier, non la véracité de son contenu.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-t" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-alt)" }}>
        <div className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <p
              className="mb-3 font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-accent)" }}
            >
              Procédure
            </p>
            <h2 className="mb-16 font-display text-2xl sm:text-3xl" style={{ color: "var(--color-text)" }}>
              Trois étapes, de l&apos;enregistrement à la vérification
            </h2>
          </Reveal>

          <div className="relative grid gap-12 sm:grid-cols-3 sm:gap-6">
            <div
              className="absolute left-0 right-0 top-[18px] hidden h-px sm:block"
              style={{ background: "var(--color-border-strong)" }}
            />
            {steps.map((step, i) => (
              <Reveal key={step.number} delay={i * 150}>
                <div className="relative">
                  <div
                    className="mb-5 flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs"
                    style={{
                      background: "var(--color-surface)",
                      border: `1px solid ${i === 0 ? "var(--color-accent)" : "var(--color-border-strong)"}`,
                      color: i === 0 ? "var(--color-accent)" : "var(--color-text-dim)",
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

      {/* Niveaux */}
      <section className="border-t" style={{ borderColor: "var(--color-border)" }}>
        <div className="mx-auto max-w-5xl px-6 py-24">
          <Reveal>
            <p
              className="mb-3 text-center font-mono text-xs uppercase tracking-[0.2em]"
              style={{ color: "var(--color-accent)" }}
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
          <div className="grid gap-4 sm:grid-cols-3">
            {levels.map((level, i) => (
              <Reveal key={level.name} delay={i * 120}>
                <div
                  className="h-full rounded-xl border p-6"
                  style={{
                    borderColor: level.active ? "var(--color-text)" : "var(--color-border)",
                    background: "var(--color-surface)",
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
                        background: level.active ? "var(--color-verified-soft)" : "var(--color-bg-alt)",
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
      <section className="border-t" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-alt)" }}>
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
              style={{ background: "var(--color-text)", color: "var(--color-bg)" }}
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
