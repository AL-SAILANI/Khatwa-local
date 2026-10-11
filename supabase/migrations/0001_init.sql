-- Khatwa: Supabase schema mirroring the Firestore model (src/types/*, firestore.rules).
-- Draft: not applied anywhere yet. Firebase remains the live backend.

-- ---------- helpers ----------
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'admin')::boolean, false)
$$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- catalog (read: signed-in, write: admin) ----------
create table public.courses (
  id text primary key,
  track text not null check (track in
    ('grammar','reading','listening','writingAnalysis','vocabulary','tips','strategies','revision')),
  title text not null,
  description text not null default '',
  "order" int not null default 0,
  lesson_count int not null default 0,
  estimated_minutes int not null default 0,
  cover_image text
);

create table public.lessons (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  "order" int not null default 0,
  resources jsonb not null default '[]',   -- [{type: video|pdf|audio, url, title, durationSeconds?}]
  notes text not null default '',
  question_ids text[] not null default '{}'
);
create index on public.lessons (course_id, "order");

create table public.reading_passages (
  id text primary key,
  title text not null,
  body text not null,
  question_ids text[] not null default '{}'
);

create table public.questions (
  id text primary key,
  section text not null check (section in ('reading','grammar','listening','writingAnalysis')),
  course_id text references public.courses(id) on delete set null,
  passage_id text references public.reading_passages(id) on delete set null,
  audio_url text,
  transcript text,
  prompt text not null,
  options jsonb not null,                  -- [{id, text}]
  correct_option_id text not null,
  explanation text not null default '',
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  tags text[] not null default '{}'
);
create index on public.questions (section);
create index on public.questions (course_id);

create table public.mock_exams (
  id text primary key,
  title text not null,
  total_questions int not null,
  duration_minutes int not null,
  section_question_ids jsonb not null      -- {reading: [...], grammar: [...], ...}
);

create table public.vocab_words (
  id text primary key,
  word text not null,
  meaning_ar text not null,
  meaning_en text,
  example text not null default '',
  audio_url text,
  level text check (level in ('easy','medium','hard')),
  tags text[] not null default '{}'
);

create table public.achievements (
  id text primary key,
  title text not null,
  description text not null default '',
  icon text not null default '',
  xp_reward int not null default 0,
  category text
);

-- ---------- users ----------
create table public.profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null,
  photo_url text,
  avatar_emoji text,
  age int,
  gender text check (gender in ('male','female')),
  goal int check (goal in (60,70,80,90,95)),
  level text check (level in ('beginner','intermediate','advanced')),
  xp int not null default 0,
  coins int not null default 0,
  streak int not null default 0,
  last_active_at timestamptz,
  recent_activity_days text[] not null default '{}',
  plan_tier text not null default 'free' check (plan_tier in ('free','pro','premium')),
  active_study_plan_id uuid,
  notifications_enabled boolean not null default false,
  last_daily_challenge_date date,
  daily_challenges_completed int not null default 0,
  exam_date date,
  fcm_tokens text[] not null default '{}',
  stripe_customer_id text,
  study_hours numeric not null default 0,
  tests_taken int not null default 0,
  last_score numeric,
  completion_percent numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Firestore allowed owners to edit only an allowlist of fields. Here the
-- complement is protected: only admins/service role may change these.
create or replace function public.protect_profile_fields() returns trigger
language plpgsql as $$
begin
  if public.is_admin() or auth.role() = 'service_role' then
    return new;
  end if;
  if new.uid is distinct from old.uid
     or new.email is distinct from old.email
     or new.plan_tier is distinct from old.plan_tier
     or new.stripe_customer_id is distinct from old.stripe_customer_id
     or new.created_at is distinct from old.created_at then
    raise exception 'protected profile field';
  end if;
  return new;
end $$;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.protect_profile_fields();

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tier text not null check (tier in ('free','pro','premium')),
  status text not null check (status in ('active','canceled','past_due')),
  current_period_end timestamptz
);

-- Leaderboard projection. Maintained by trigger from profiles, so clients
-- can never write it (replaces the profileMatchesUser() rule).
-- TODO: confirm exact fields against src/lib/firestore/leaderboard code.
create table public.public_profiles (
  uid uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  avatar_emoji text,
  photo_url text,
  xp int not null default 0,
  streak int not null default 0,
  level text,
  updated_at timestamptz not null default now()
);

create or replace function public.sync_public_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.public_profiles (uid, name, avatar_emoji, photo_url, xp, streak, level)
  values (new.uid, new.name, new.avatar_emoji, new.photo_url, new.xp, new.streak, new.level)
  on conflict (uid) do update set
    name = excluded.name, avatar_emoji = excluded.avatar_emoji,
    photo_url = excluded.photo_url, xp = excluded.xp, streak = excluded.streak,
    level = excluded.level, updated_at = now();
  return new;
end $$;
create trigger profiles_sync_public after insert or update on public.profiles
  for each row execute function public.sync_public_profile();

-- ---------- per-user data ----------
create table public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  duration_days int not null,
  goal int not null,
  weekly_hours numeric not null,
  started_at timestamptz not null,
  target_end_at timestamptz not null,
  weekly_schedule jsonb not null default '[]'   -- [{dayIndex, courseId, lessonIds, completed}]
);
create index on public.study_plans (user_id);

create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  course_id text not null,
  completed boolean not null default false,
  quiz_score numeric,
  last_position numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index on public.lesson_progress (user_id, course_id);

create table public.vocab_review_state (
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null,
  ease_factor numeric not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  due_at timestamptz not null,
  bookmarked boolean not null default false,
  last_reviewed_at timestamptz,
  lapses int not null default 0,
  review_count int not null default 0,
  primary key (user_id, word_id)
);
create index on public.vocab_review_state (user_id, due_at);

create table public.vocab_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  word_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index on public.vocab_sets (user_id);

create table public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_id text not null,
  kind text not null check (kind in ('placement','mock')),
  status text not null check (status in ('in_progress','submitted')),
  answers jsonb not null default '{}',          -- {questionId: optionId}
  flagged text[] not null default '{}',
  started_at timestamptz not null,
  submitted_at timestamptz,
  score numeric,
  section_results jsonb not null default '[]',  -- [{section, correct, total, timeSpentSeconds}]
  weak_skills text[] not null default '{}',
  new_words text[] not null default '{}',
  recommendations text[] not null default '{}'
);
create index on public.exam_attempts (user_id, started_at desc);

create table public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- ---------- RLS ----------
do $$
declare t text;
begin
  foreach t in array array['courses','lessons','reading_passages','questions','mock_exams',
    'vocab_words','achievements']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for select to authenticated using (true)',
      t || '_read', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
      t || '_admin_write', t);
  end loop;

  -- owner-or-admin tables keyed by user_id
  foreach t in array array['study_plans','lesson_progress','vocab_review_state','vocab_sets','exam_attempts']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy %I on public.%I for all to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin())',
      t || '_owner', t);
  end loop;
end $$;

-- user_achievements: owner read/insert/delete, admin update (as in Firestore)
alter table public.user_achievements enable row level security;
create policy ua_read on public.user_achievements for select to authenticated using (user_id = auth.uid());
create policy ua_insert on public.user_achievements for insert to authenticated with check (user_id = auth.uid());
create policy ua_delete on public.user_achievements for delete to authenticated using (user_id = auth.uid() or public.is_admin());
create policy ua_admin_update on public.user_achievements for update to authenticated using (public.is_admin());

-- profiles: owner read/insert(defaults only)/update/delete, admin all
alter table public.profiles enable row level security;
create policy profiles_read on public.profiles for select to authenticated using (uid = auth.uid() or public.is_admin());
create policy profiles_insert on public.profiles for insert to authenticated with check (
  uid = auth.uid() and plan_tier = 'free' and xp = 0 and coins = 0 and streak = 0
  and tests_taken = 0 and study_hours = 0);
create policy profiles_update on public.profiles for update to authenticated
  using (uid = auth.uid() or public.is_admin()) with check (uid = auth.uid() or public.is_admin());
create policy profiles_delete on public.profiles for delete to authenticated using (uid = auth.uid() or public.is_admin());

-- subscriptions: owner read, admin write (Stripe webhook uses service role)
alter table public.subscriptions enable row level security;
create policy subs_read on public.subscriptions for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy subs_admin_write on public.subscriptions for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- public_profiles: everyone signed-in reads; writes only via trigger
alter table public.public_profiles enable row level security;
create policy pp_read on public.public_profiles for select to authenticated using (true);
