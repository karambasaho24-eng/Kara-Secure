-- ============================================================
-- PHASE 4 — Carte d'identite numerique du document
-- ============================================================

alter table public.documents
  add column kara_id text unique default (
    'KS-' || extract(year from now())::text || '-' ||
    lpad(floor(random() * 999999)::text, 6, '0')
  );

update public.documents set kara_id = (
  'KS-' || extract(year from created_at)::text || '-' ||
  lpad(floor(random() * 999999)::text, 6, '0')
) where kara_id is null;

alter table public.documents alter column kara_id set not null;

alter table public.versions
  add column modification_reason text;

alter table public.versions
  add constraint versions_reason_required_after_v1
  check (version_number = 1 or modification_reason is not null);

create index idx_documents_kara_id on public.documents(kara_id);

insert into public.versions (document_id, version_number, storage_path, file_hash, created_by, modification_reason)
select d.id, 1, d.storage_path, c.file_hash, d.created_by, null
from public.documents d
join public.certifications c on c.document_id = d.id and c.status = 'active'
where not exists (select 1 from public.versions v where v.document_id = d.id);
