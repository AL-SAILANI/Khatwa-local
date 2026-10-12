-- TEMPORARY. While login is still Firebase Auth, the browser talks to Supabase
-- with the anon key, so catalog reads must be allowed for `anon`. The catalog
-- is non-sensitive content (it is generated from public src/data files).
-- Drop these policies once auth moves to Supabase and `authenticated` applies.
do $$
declare t text;
begin
  foreach t in array array['courses','lessons','reading_passages','questions','vocab_words','achievements']
  loop
    execute format('create policy %I on public.%I for select to anon using (true)', t || '_anon_read', t);
  end loop;
end $$;
