-- Lesson media (video / pdf / audio) uploaded through the admin CMS.
-- Public bucket: objects are served by URL, like Firebase download URLs were.
-- Paths contain a random folder, so they are not guessable; only admins can write.
insert into storage.buckets (id, name, public, allowed_mime_types)
values ('course-media', 'course-media', true, array['video/*', 'audio/*', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public, allowed_mime_types = excluded.allowed_mime_types;

create policy course_media_admin_write on storage.objects
  for all to authenticated
  using (bucket_id = 'course-media' and public.is_admin())
  with check (bucket_id = 'course-media' and public.is_admin());
