-- Optional storage table for the AI news card project.
-- Existing report/session tables are not modified.

create table if not exists public.card_news_projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default',
  anonymous_student_id text not null,
  current_step integer not null default 0,
  project_data jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists card_news_projects_tenant_idx
on public.card_news_projects (tenant_id);

create index if not exists card_news_projects_student_idx
on public.card_news_projects (anonymous_student_id);

create index if not exists card_news_projects_status_idx
on public.card_news_projects (status);

alter table public.card_news_projects enable row level security;

drop policy if exists "card_news_projects_insert_anon" on public.card_news_projects;
create policy "card_news_projects_insert_anon"
on public.card_news_projects for insert
to anon, authenticated
with check (
  tenant_id is not null
  and anonymous_student_id is not null
);

drop policy if exists "card_news_projects_update_own_anon" on public.card_news_projects;
create policy "card_news_projects_update_own_anon"
on public.card_news_projects for update
to anon, authenticated
using (true)
with check (
  tenant_id is not null
  and anonymous_student_id is not null
);

drop policy if exists "card_news_projects_no_public_select" on public.card_news_projects;
create policy "card_news_projects_no_public_select"
on public.card_news_projects for select
to anon, authenticated
using (false);
