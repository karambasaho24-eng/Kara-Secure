-- ============================================================
-- Consentement a la certification + delai d'observation
-- ============================================================

alter table public.certifications
  add column consent_given_at timestamptz not null default now();

alter table public.versions
  add column pending_until timestamptz;
