# KARA Secure

Plateforme professionnelle de certification numérique de documents — preuve d'intégrité, horodatage, vérification publique.

## Stack

- **Frontend** : Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Backend** : Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Paiement** : Stripe (Phase 6)

## État d'avancement

- [x] Phase 1 — Fondations (Next.js + Supabase + tables profiles/organizations/roles + RLS)
- [ ] Phase 2 — Authentification
- [ ] Phase 3 — Base de données (documents, certifications)
- [ ] Phase 4 — Certification documentaire
- [ ] Phase 5 — Vérification publique
- [ ] Phase 6 — Stripe / abonnements
- [ ] Phase 7 — Espace entreprise
- [ ] Phase 8 — Grandes entreprises
- [ ] Phase 9 — Administration interne (CMS, rôles)

## Développement local

```bash
npm install
cp .env.example .env.local   # remplir avec les vraies clés Supabase/Stripe
npm run dev
```

## Base de données

Projet Supabase : `KaraSecure` (région `eu-west-3`, Paris).
Migrations versionnées dans `supabase/migrations/`.
