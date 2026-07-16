-- ============================================================
-- FIX - Recursion infinie RLS entre organizations et user_roles
-- ============================================================

create or replace function public.my_organization_ids()
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select id from public.organizations where owner_id = auth.uid()
  union
  select organization_id from public.user_roles
  where user_id = auth.uid() and organization_id is not null;
$$;

revoke execute on function public.my_organization_ids() from public, anon;
grant execute on function public.my_organization_ids() to authenticated;

drop policy if exists "organizations_select_member" on public.organizations;
create policy "organizations_select_member" on public.organizations
  for select using (id in (select public.my_organization_ids()));

drop policy if exists "user_roles_select_org_owner" on public.user_roles;
create policy "user_roles_select_org_owner" on public.user_roles
  for select using (organization_id in (select public.my_organization_ids()));

drop policy if exists "documents_select_org_member" on public.documents;
create policy "documents_select_org_member" on public.documents
  for select using (organization_id in (select public.my_organization_ids()));

drop policy if exists "documents_insert_org_member" on public.documents;
create policy "documents_insert_org_member" on public.documents
  for insert with check (
    owner_id is null and organization_id in (select public.my_organization_ids())
  );

drop policy if exists "certifications_select_via_document" on public.certifications;
create policy "certifications_select_via_document" on public.certifications
  for select using (
    document_id in (
      select id from public.documents
      where owner_id = auth.uid()
         or organization_id in (select public.my_organization_ids())
    )
  );

drop policy if exists "versions_select_via_document" on public.versions;
create policy "versions_select_via_document" on public.versions
  for select using (
    document_id in (
      select id from public.documents
      where owner_id = auth.uid()
         or organization_id in (select public.my_organization_ids())
    )
  );

drop policy if exists "storage_documents_select_owner" on storage.objects;
create policy "storage_documents_select_owner" on storage.objects
  for select using (
    bucket_id = 'documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or (storage.foldername(name))[1] in (select public.my_organization_ids()::text)
    )
  );

drop policy if exists "storage_documents_insert_owner" on storage.objects;
create policy "storage_documents_insert_owner" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or (storage.foldername(name))[1] in (select public.my_organization_ids()::text)
    )
  );

drop policy if exists "storage_documents_delete_owner" on storage.objects;
create policy "storage_documents_delete_owner" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or (storage.foldername(name))[1] in (select public.my_organization_ids()::text)
    )
  );
