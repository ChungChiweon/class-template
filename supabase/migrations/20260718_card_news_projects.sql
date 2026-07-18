-- Card news project storage for LoreAX Class.
-- Safe to paste into Supabase SQL Editor more than once.
-- Existing report/session/usage tables are not modified.

create extension if not exists pgcrypto;

create table if not exists public.card_news_projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null default 'default',
  anonymous_student_id text not null,
  project_id text not null,
  current_step integer not null default 0,
  project_data jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.card_news_projects
add column if not exists project_id text;

update public.card_news_projects
set project_id = id::text
where project_id is null or project_id = '';

alter table public.card_news_projects
alter column project_id set not null;

alter table public.card_news_projects
add column if not exists current_step integer not null default 0;

alter table public.card_news_projects
add column if not exists project_data jsonb not null default '{}'::jsonb;

alter table public.card_news_projects
add column if not exists status text not null default 'draft';

alter table public.card_news_projects
add column if not exists submitted_at timestamptz;

alter table public.card_news_projects
add column if not exists created_at timestamptz not null default now();

alter table public.card_news_projects
add column if not exists updated_at timestamptz not null default now();

create unique index if not exists card_news_projects_owner_project_uidx
on public.card_news_projects (tenant_id, anonymous_student_id, project_id);

create index if not exists card_news_projects_tenant_idx
on public.card_news_projects (tenant_id);

create index if not exists card_news_projects_student_idx
on public.card_news_projects (anonymous_student_id);

create index if not exists card_news_projects_project_idx
on public.card_news_projects (project_id);

create index if not exists card_news_projects_status_idx
on public.card_news_projects (status);

create index if not exists card_news_projects_updated_at_idx
on public.card_news_projects (updated_at desc);

create or replace function public.set_card_news_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_card_news_projects_updated_at on public.card_news_projects;
create trigger trg_card_news_projects_updated_at
before update on public.card_news_projects
for each row
execute function public.set_card_news_projects_updated_at();

alter table public.card_news_projects enable row level security;

drop policy if exists "card_news_projects_insert_anon" on public.card_news_projects;
create policy "card_news_projects_insert_anon"
on public.card_news_projects for insert
to anon, authenticated
with check (
  tenant_id is not null
  and anonymous_student_id is not null
  and project_id is not null
);

drop policy if exists "card_news_projects_update_own_anon" on public.card_news_projects;
create policy "card_news_projects_update_own_anon"
on public.card_news_projects for update
to anon, authenticated
using (
  tenant_id is not null
  and anonymous_student_id is not null
  and project_id is not null
)
with check (
  tenant_id is not null
  and anonymous_student_id is not null
  and project_id is not null
);

drop policy if exists "card_news_projects_no_public_select" on public.card_news_projects;
create policy "card_news_projects_no_public_select"
on public.card_news_projects for select
to anon, authenticated
using (false);

-- Serverless APIs should use SUPABASE_SERVICE_ROLE_KEY for read/upsert.
-- Do not expose service_role keys in browser code.
