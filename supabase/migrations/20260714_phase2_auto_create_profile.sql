-- ============================================================
-- PHASE 2 — Auto-création du profil à l'inscription
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_account_type public.account_type;
begin
  begin
    requested_account_type := (new.raw_user_meta_data->>'account_type')::public.account_type;
  exception when others then
    requested_account_type := 'individual';
  end;

  if requested_account_type = 'internal_staff' then
    requested_account_type := 'individual';
  end if;

  insert into public.profiles (id, email, full_name, account_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    coalesce(requested_account_type, 'individual')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
