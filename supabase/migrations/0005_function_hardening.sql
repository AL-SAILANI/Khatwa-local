-- Pin search_path on all helper/trigger functions and stop anon/authenticated
-- from calling trigger-only SECURITY DEFINER functions through /rest/v1/rpc.
do $$
declare r record;
begin
  for r in select p.oid::regprocedure as sig, p.proname from pg_proc p
           join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'public' and p.proname in
             ('bump_profile','is_admin','touch_updated_at','protect_profile_fields','handle_new_user','sync_public_profile') loop
    execute format('alter function %s set search_path = public, pg_temp', r.sig);
    if r.proname in ('handle_new_user','sync_public_profile','touch_updated_at','protect_profile_fields') then
      execute format('revoke execute on function %s from public, anon, authenticated', r.sig);
    end if;
  end loop;
end $$;
