-- ============================================================
-- PHASE 3 — Documents, Certifications, Versions, Storage
-- ============================================================

create type public.certification_level as enum ('standard', 'renforce', 'professionnel');
create type public.certification_status as enum ('active', 'revoked');

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  file_name text not null,
  file_size_bytes bigint not null,
  mime_type text not null,
  storage_path text not null unique,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint documents_single_owner check (
    (owner_id is not null and organization_id is null) or
    (owner_id is null and organization_id is not null)
  )
);

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  public_code text not null unique default replace(gen_random_uuid()::text, '-', ''),
  file_hash text not null,
  hash_algorithm text not null default 'sha256',
  level public.certification_level not null default 'standard',
  status public.certification_status not null default 'active',
  certified_at timestamptz not null default now(),
  certified_by uuid not null references public.profiles(id),
  revoked_at timestamptz,
  revoked_reason text,
  created_at timestamptz not null default now()
);

create table public.versions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  version_number integer not null,
  storage_path text not null unique,
  file_hash text not null,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (document_id, version_number)
);

create index idx_documents_owner on public.documents(owner_id);
create index idx_documents_org on public.documents(organization_id);
create index idx_certifications_document on public.certifications(document_id);
create index idx_certifications_public_code on public.certifications(public_code);
create index idx_versions_document on public.versions(document_id);

alter table public.documents enable row level security;
alter table public.certifications enable row level security;
alter table public.versions enable row level security;

create policy "documents_select_owner" on public.documents for select using (auth.uid() = owner_id);
create policy "documents_insert_owner" on public.documents for insert with check (auth.uid() = owner_id and organization_id is null);
create policy "documents_update_owner" on public.documents for update using (auth.uid() = owner_id);
create policy "documents_delete_owner" on public.documents for delete using (auth.uid() = owner_id);

create policy "documents_select_org_member" on public.documents for select using (
  organization_id in (
    select ur.organization_id from public.user_roles ur where ur.user_id = auth.uid()
    union
    select o.id from public.organizations o where o.owner_id = auth.uid()
  )
);

create policy "documents_insert_org_member" on public.documents for insert with check (
  owner_id is null and organization_id in (
    select ur.organization_id from public.user_roles ur where ur.user_id = auth.uid()
    union
    select o.id from public.organizations o where o.owner_id = auth.uid()
  )
);

create policy "certifications_select_via_document" on public.certifications for select using (
  document_id in (
    select id from public.documents
    where owner_id = auth.uid()
       or organization_id in (
            select ur.organization_id from public.user_roles ur where ur.user_id = auth.uid()
            union
            select o.id from public.organizations o where o.owner_id = auth.uid()
          )
  )
);

create policy "versions_select_via_document" on public.versions for select using (
  document_id in (
    select id from public.documents
    where owner_id = auth.uid()
       or organization_id in (
            select ur.organization_id from public.user_roles ur where ur.user_id = auth.uid()
            union
            select o.id from public.organizations o where o.owner_id = auth.uid()
          )
  )
);

-- Storage bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 26214400, array['application/pdf', 'image/png', 'image/jpeg', 'image/webp']);

create policy "storage_documents_select_owner" on storage.objects for select using (
  bucket_id = 'documents' and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (storage.foldername(name))[1] in (
      select organization_id::text from public.user_roles where user_id = auth.uid()
      union
      select id::text from public.organizations where owner_id = auth.uid()
    )
  )
);

create policy "storage_documents_insert_owner" on storage.objects for insert with check (
  bucket_id = 'documents' and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (storage.foldername(name))[1] in (
      select organization_id::text from public.user_roles where user_id = auth.uid()
      union
      select id::text from public.organizations where owner_id = auth.uid()
    )
  )
);

create policy "storage_documents_delete_owner" on storage.objects for delete using (
  bucket_id = 'documents' and (
    (storage.foldername(name))[1] = auth.uid()::text
    or (storage.foldername(name))[1] in (
      select organization_id::text from public.user_roles where user_id = auth.uid()
      union
      select id::text from public.organizations where owner_id = auth.uid()
    )
  )
);

revoke execute on function public.handle_new_user() from anon, authenticated;
