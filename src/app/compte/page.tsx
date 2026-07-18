import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/layout/app-header";

const accountTypeLabels: Record<string, string> = {
  individual: "Particulier",
  professional: "Professionnel",
  business: "Entreprise",
  internal_staff: "Employé interne",
};

export default async function ComptePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, account_type, created_at")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen" style={{ background: "var(--color-ink)" }}>
      <AppHeader email={user.email} />
      <div className="mx-auto max-w-xl px-6 py-12">
        <p
          className="mb-1 font-mono text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-gold)" }}
        >
          Espace personnel
        </p>
        <h1 className="mb-8 font-display text-2xl" style={{ color: "var(--color-text)" }}>
          Mon compte
        </h1>

        <dl
          className="space-y-5 rounded-xl border p-6"
          style={{ borderColor: "var(--color-border)", background: "var(--color-ink-soft)" }}
        >
          <div>
            <dt
              className="font-mono text-[10px] uppercase tracking-[0.15em]"
              style={{ color: "var(--color-text-dim)" }}
            >
              Nom
            </dt>
            <dd className="mt-1 text-sm" style={{ color: "var(--color-text)" }}>
              {profile?.full_name ?? "—"}
            </dd>
          </div>
          <div>
            <dt
              className="font-mono text-[10px] uppercase tracking-[0.15em]"
              style={{ color: "var(--color-text-dim)" }}
            >
              Email
            </dt>
            <dd className="mt-1 text-sm" style={{ color: "var(--color-text)" }}>
              {profile?.email}
            </dd>
          </div>
          <div>
            <dt
              className="font-mono text-[10px] uppercase tracking-[0.15em]"
              style={{ color: "var(--color-text-dim)" }}
            >
              Type de compte
            </dt>
            <dd className="mt-1 text-sm" style={{ color: "var(--color-text)" }}>
              {profile?.account_type ? accountTypeLabels[profile.account_type] : "—"}
            </dd>
          </div>
          <div>
            <dt
              className="font-mono text-[10px] uppercase tracking-[0.15em]"
              style={{ color: "var(--color-text-dim)" }}
            >
              Membre depuis
            </dt>
            <dd className="mt-1 text-sm" style={{ color: "var(--color-text)" }}>
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString("fr-FR")
                : "—"}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
