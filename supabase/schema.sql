-- LoreAX Class ERP Supabase schema
-- Run this file in the Supabase SQL editor.
-- Create a public Storage bucket named: student-reports

create extension if not exists "pgcrypto";

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null,
  session_date date not null default current_date,
  title text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (lesson_id, session_date)
);

create table if not exists public.student_sessions (
  id uuid primary key default gen_random_uuid(),
  class_session_id uuid references public.class_sessions(id) on delete cascade,
  device_id text not null,
  student_name text,
  student_number text,
  class_name text,
  current_step text,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  last_seen_at timestamptz,
  is_pdf_generated boolean default false,
  pdf_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (class_session_id, device_id)
);

create table if not exists public.student_reports (
  id uuid primary key default gen_random_uuid(),
  class_session_id uuid references public.class_sessions(id) on delete cascade,
  student_session_id uuid references public.student_sessions(id) on delete cascade,
  lesson_id text not null,
  report_data jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (class_session_id, student_session_id, lesson_id)
);

create index if not exists idx_class_sessions_lesson_date
  on public.class_sessions (lesson_id, session_date);

create index if not exists idx_student_sessions_class_seen
  on public.student_sessions (class_session_id, last_seen_at desc);

create index if not exists idx_student_sessions_class_progress
  on public.student_sessions (class_session_id, progress asc);

create index if not exists idx_student_reports_student
  on public.student_reports (student_session_id, lesson_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_class_sessions_updated_at on public.class_sessions;
create trigger trg_class_sessions_updated_at
before update on public.class_sessions
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_sessions_updated_at on public.student_sessions;
create trigger trg_student_sessions_updated_at
before update on public.student_sessions
for each row execute function public.set_updated_at();

drop trigger if exists trg_student_reports_updated_at on public.student_reports;
create trigger trg_student_reports_updated_at
before update on public.student_reports
for each row execute function public.set_updated_at();

alter table public.class_sessions enable row level security;
alter table public.student_sessions enable row level security;
alter table public.student_reports enable row level security;

-- MVP policy for anonymous classroom devices.
-- This is intentionally permissive enough for a no-login classroom PWA.
-- Before public production use, replace this with authenticated roles or a class/session token.
drop policy if exists "anon can read class sessions" on public.class_sessions;
create policy "anon can read class sessions"
on public.class_sessions for select
to anon
using (true);

drop policy if exists "anon can create class sessions" on public.class_sessions;
create policy "anon can create class sessions"
on public.class_sessions for insert
to anon
with check (true);

drop policy if exists "anon can update active class sessions" on public.class_sessions;
create policy "anon can update active class sessions"
on public.class_sessions for update
to anon
using (status = 'active')
with check (status = 'active');

drop policy if exists "anon can delete diagnostic class sessions" on public.class_sessions;
create policy "anon can delete diagnostic class sessions"
on public.class_sessions for delete
to anon
using (lesson_id = '__diagnostic_lesson__');

drop policy if exists "anon can read student sessions" on public.student_sessions;
create policy "anon can read student sessions"
on public.student_sessions for select
to anon
using (true);

drop policy if exists "anon can create student sessions" on public.student_sessions;
create policy "anon can create student sessions"
on public.student_sessions for insert
to anon
with check (device_id is not null and class_session_id is not null);

drop policy if exists "anon can update student sessions by device" on public.student_sessions;
create policy "anon can update student sessions by device"
on public.student_sessions for update
to anon
using (device_id is not null and class_session_id is not null)
with check (device_id is not null and class_session_id is not null);

drop policy if exists "anon can delete diagnostic student sessions" on public.student_sessions;
create policy "anon can delete diagnostic student sessions"
on public.student_sessions for delete
to anon
using (device_id = '__diagnostic_device__' or student_name = '__LOREAX_TEST__');

drop policy if exists "anon can read reports" on public.student_reports;
create policy "anon can read reports"
on public.student_reports for select
to anon
using (true);

drop policy if exists "anon can create reports" on public.student_reports;
create policy "anon can create reports"
on public.student_reports for insert
to anon
with check (class_session_id is not null and student_session_id is not null);

drop policy if exists "anon can update reports" on public.student_reports;
create policy "anon can update reports"
on public.student_reports for update
to anon
using (class_session_id is not null and student_session_id is not null)
with check (class_session_id is not null and student_session_id is not null);

drop policy if exists "anon can delete diagnostic reports" on public.student_reports;
create policy "anon can delete diagnostic reports"
on public.student_reports for delete
to anon
using (lesson_id = '__diagnostic_lesson__');

-- Storage policy example for the public bucket student-reports.
-- The insert below creates the bucket when it does not exist and keeps the
-- operation idempotent when this SQL is executed more than once.
-- If the bucket is public, pdf_url can be opened directly by the teacher screen.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'student-reports',
  'student-reports',
  true,
  52428800,
  array['application/pdf']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "anon can upload report pdfs" on storage.objects;
create policy "anon can upload report pdfs"
on storage.objects for insert
to anon
with check (bucket_id = 'student-reports');

drop policy if exists "anon can update report pdfs" on storage.objects;
create policy "anon can update report pdfs"
on storage.objects for update
to anon
using (bucket_id = 'student-reports')
with check (bucket_id = 'student-reports');

drop policy if exists "anon can read report pdfs" on storage.objects;
create policy "anon can read report pdfs"
on storage.objects for select
to anon
using (bucket_id = 'student-reports');

drop policy if exists "anon can delete diagnostic report pdfs" on storage.objects;
create policy "anon can delete diagnostic report pdfs"
on storage.objects for delete
to anon
using (bucket_id = 'student-reports' and name like '%/diagnostic-%');
