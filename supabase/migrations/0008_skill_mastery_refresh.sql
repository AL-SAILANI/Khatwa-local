-- Recomputes a learner's per-skill mastery from the source of truth (submitted exam answers and
-- completed lessons' exit-card scores), mirroring src/lib/skill-mastery.ts. Idempotent: it can be
-- called after every submission without double counting. Also adds a per-question statistics view.

create or replace function public.refresh_skill_mastery(p_user uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if (select auth.uid()) is not null
     and p_user is distinct from (select auth.uid())
     and not (select public.is_admin()) then
    raise exception 'not allowed';
  end if;

  with recent as (
    select id, answers, row_number() over (order by submitted_at desc nulls last) as rn
    from public.exam_attempts
    where user_id = p_user and status = 'submitted'
  ),
  exam_ev as (
    select qs.skill_id,
           sum(case when r.rn = 1 then 2 else 1 end)::numeric as total,
           sum(case when (a.value #>> '{}') = q.correct_option_id
                    then (case when r.rn = 1 then 2 else 1 end) else 0 end)::numeric as correct
    from recent r
    cross join lateral jsonb_each(r.answers) as a
    join public.questions q on q.id = a.key
    join public.question_skills qs on qs.question_id = q.id
    where r.rn <= 5
    group by qs.skill_id
  ),
  lesson_skills as (
    select lp.lesson_id, lp.quiz_score, qs.skill_id
    from public.lesson_progress lp
    join public.lessons l on l.id = lp.lesson_id
    cross join lateral unnest(l.question_ids) as qid
    join public.question_skills qs on qs.question_id = qid
    where lp.user_id = p_user and lp.completed and lp.quiz_score is not null
    group by lp.lesson_id, lp.quiz_score, qs.skill_id
  ),
  lesson_ev as (
    select skill_id, (3 * count(*))::numeric as total, sum(3 * quiz_score / 100)::numeric as correct
    from lesson_skills
    group by skill_id
  ),
  ev as (
    select skill_id, sum(total) as total, sum(correct) as correct
    from (select * from exam_ev union all select * from lesson_ev) u
    group by skill_id
  ),
  upserted as (
    insert into public.user_skill_mastery (user_id, skill_id, attempts, correct, mastery, updated_at)
    select p_user, skill_id, round(total)::int, round(correct)::int,
           round(((correct + 1) / (total + 2))::numeric, 3), now()
    from ev
    on conflict (user_id, skill_id) do update
      set attempts = excluded.attempts, correct = excluded.correct,
          mastery = excluded.mastery, updated_at = excluded.updated_at
    returning skill_id
  )
  delete from public.user_skill_mastery m
  where m.user_id = p_user and m.skill_id not in (select skill_id from ev);
end;
$$;

revoke all on function public.refresh_skill_mastery(uuid) from public, anon;
grant execute on function public.refresh_skill_mastery(uuid) to authenticated;

-- Per-question difficulty from submitted exams. Runs with the caller's rights, so a learner sees
-- only their own answers and an admin sees everyone's.
create or replace view public.question_stats with (security_invoker = true) as
select q.id as question_id,
       q.section,
       q.difficulty,
       count(*) as answered,
       round(avg(((a.value #>> '{}') = q.correct_option_id)::int)::numeric, 3) as pct_correct
from public.exam_attempts e
cross join lateral jsonb_each(e.answers) as a
join public.questions q on q.id = a.key
where e.status = 'submitted'
group by q.id, q.section, q.difficulty;
