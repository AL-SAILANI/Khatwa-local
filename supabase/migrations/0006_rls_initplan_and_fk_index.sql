-- Performance: evaluate auth.uid() once per query instead of once per row in
-- RLS policies, and index the questions.passage_id foreign key.
do $$
declare r record; stmt text; q text; w text;
begin
  for r in
    select tablename, policyname, qual, with_check
    from pg_policies
    where schemaname = 'public'
      and (coalesce(qual, '') like '%auth.uid()%' or coalesce(with_check, '') like '%auth.uid()%')
      and not (coalesce(qual, '') || coalesce(with_check, '')) ilike '%select auth.uid()%'
  loop
    q := replace(coalesce(r.qual, ''), 'auth.uid()', '(select auth.uid())');
    w := replace(coalesce(r.with_check, ''), 'auth.uid()', '(select auth.uid())');
    stmt := format('alter policy %I on public.%I', r.policyname, r.tablename);
    if r.qual is not null then stmt := stmt || format(' using (%s)', q); end if;
    if r.with_check is not null then stmt := stmt || format(' with check (%s)', w); end if;
    execute stmt;
  end loop;
end $$;

create index if not exists questions_passage_id_idx on public.questions (passage_id);
