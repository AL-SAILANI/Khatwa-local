-- Server-side pieces for running the user backend on Supabase Auth.

-- Profile row is created from sign-up metadata (email form or Google), so it
-- works even when email confirmation delays the first session.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (uid, email, name, photo_url, avatar_emoji, age, gender, goal, exam_date)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(m->>'name', ''), nullif(m->>'full_name', ''), ''),
    coalesce(nullif(m->>'photo_url', ''), nullif(m->>'avatar_url', ''), nullif(m->>'picture', '')),
    nullif(m->>'avatar_emoji', ''),
    case when m->>'age' ~ '^\d{1,3}$' then (m->>'age')::int end,
    case when m->>'gender' in ('male','female') then m->>'gender' end,
    case when m->>'goal' in ('60','70','80','90','95') then (m->>'goal')::int end,
    case when m->>'exam_date' ~ '^\d{4}-\d{2}-\d{2}$' then (m->>'exam_date')::date end
  )
  on conflict (uid) do nothing;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atomic counters (Firestore's increment()). SECURITY INVOKER: RLS and the
-- protect_profile_fields trigger still apply to the caller.
create or replace function public.bump_profile(
  p_xp int default 0, p_coins int default 0, p_study_hours numeric default 0,
  p_tests_taken int default 0, p_daily_challenges int default 0
) returns void language sql as $$
  update public.profiles set
    xp = xp + p_xp,
    coins = coins + p_coins,
    study_hours = study_hours + p_study_hours,
    tests_taken = tests_taken + p_tests_taken,
    daily_challenges_completed = daily_challenges_completed + p_daily_challenges
  where uid = auth.uid();
$$;

-- Self-service account deletion; every per-user table cascades from auth.users.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- Live profile updates for the dashboard (replaces Firestore onSnapshot).
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.profiles;
  end if;
end $$;
