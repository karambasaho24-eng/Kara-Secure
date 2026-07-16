create policy "versions_insert_via_document" on public.versions
  for insert with check (
    document_id in (
      select id from public.documents
      where owner_id = auth.uid()
         or organization_id in (select public.my_organization_ids())
    )
  );
