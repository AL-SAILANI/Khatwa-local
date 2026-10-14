-- Skill graph: curriculum skills, question-to-skill links, per-user mastery and review cards.
-- Skill definitions live in src/data/skills.ts and are synced into public.skills.

create table if not exists public.skills (
  id text primary key,
  section text not null,
  domain text not null,
  title text not null,
  title_ar text not null,
  cefr text not null,
  frequency smallint not null check (frequency between 1 and 5),
  prerequisites text[] not null default '{}'
);

create table if not exists public.question_skills (
  question_id text not null references public.questions(id) on delete cascade,
  skill_id text not null references public.skills(id) on delete cascade,
  primary key (question_id, skill_id)
);
create index if not exists question_skills_skill_idx on public.question_skills (skill_id);

create table if not exists public.user_skill_mastery (
  user_id uuid not null references public.profiles(uid) on delete cascade,
  skill_id text not null references public.skills(id) on delete cascade,
  attempts integer not null default 0,
  correct integer not null default 0,
  mastery numeric(4,3) not null default 0 check (mastery between 0 and 1),
  avg_seconds numeric(6,1),
  updated_at timestamptz not null default now(),
  primary key (user_id, skill_id)
);

create table if not exists public.review_cards (
  user_id uuid not null references public.profiles(uid) on delete cascade,
  item_type text not null check (item_type in ('question', 'word')),
  item_id text not null,
  skill_id text references public.skills(id) on delete set null,
  ease numeric(3,2) not null default 2.5,
  interval_days integer not null default 0,
  due_at timestamptz not null default now(),
  lapses integer not null default 0,
  primary key (user_id, item_type, item_id)
);
create index if not exists review_cards_due_idx on public.review_cards (user_id, due_at);

alter table public.skills enable row level security;
alter table public.question_skills enable row level security;
alter table public.user_skill_mastery enable row level security;
alter table public.review_cards enable row level security;

create policy skills_read on public.skills for select to anon, authenticated using (true);
create policy skills_admin on public.skills for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy question_skills_read on public.question_skills for select to anon, authenticated using (true);
create policy question_skills_admin on public.question_skills for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy mastery_own on public.user_skill_mastery for all to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()))
  with check (user_id = (select auth.uid()) or (select public.is_admin()));
create policy review_cards_own on public.review_cards for all to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()))
  with check (user_id = (select auth.uid()) or (select public.is_admin()));
