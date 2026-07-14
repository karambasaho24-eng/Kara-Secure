-- ============================================================
-- PHASE 1 — Fondations : profiles, organizations, roles
-- Appliqué sur le projet Supabase KaraSecure (emxaswrxckjqxtozlqqo)
-- ============================================================

create type public.account_type as enum (
  'individual',
  'professional',
  'business',
  'internal_staff'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  account_type public.account_type not null default 'individual',
  full_name text,
  email text not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  siret text,
  is_verified boolean not null default false,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  scope text not null check (scope in ('internal', 'organization')),
  created_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete restrict,
  organization_id uuid references public.organizations(id) on delete cascade,
  granted_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (user_id, role_id, organization_id)
);

create index idx_user_roles_user on public.user_roles(user_id);
create index idx_user_roles_org on public.user_roles(organization_id);
create index idx_organizations_owner on public.organizations(owner_id);

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

create policy "roles_select_authenticated" on public.roles for select using (auth.role() = 'authenticated');

create policy "organizations_select_owner" on public.organizations for select using (auth.uid() = owner_id);
create policy "organizations_update_owner" on public.organizations for update using (auth.uid() = owner_id);
create policy "organizations_insert_own" on public.organizations for insert with check (auth.uid() = owner_id);
create policy "organizations_select_member" on public.organizations for select using (
  exists (select 1 from public.user_roles ur where ur.organization_id = organizations.id and ur.user_id = auth.uid())
);

create policy "user_roles_select_own" on public.user_roles for select using (auth.uid() = user_id);
create policy "user_roles_select_org_owner" on public.user_roles for select using (
  organization_id in (select id from public.organizations where owner_id = auth.uid())
);

insert into public.roles (key, label, scope) values
  ('super_admin', 'Super Administrateur', 'internal'),
  ('admin_content', 'Administrateur contenu', 'internal'),
  ('admin_security', 'Administrateur sécurité', 'internal'),
  ('support', 'Support', 'internal'),
  ('admin_technical', 'Administrateur technique', 'internal'),
  ('org_admin', 'Administrateur entreprise', 'organization'),
  ('employee', 'Employé', 'organization'),
  ('compliance_officer', 'Responsable conformité', 'organization');

revoke execute on function public.rls_auto_enable() from anon, authenticated;
