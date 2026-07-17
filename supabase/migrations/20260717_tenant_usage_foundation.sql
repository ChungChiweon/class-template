-- LoreAX tenant/package/usage foundation.
-- This migration only adds new tables and policies. Existing class/report tables are not modified.

create extension if not exists pgcrypto;

create table if not exists public.plans (
  id text primary key,
  name text not null,
  setup_fee integer not null default 0,
  monthly_base_fee integer not null default 0,
  included_learners integer not null default 0,
  overage_price integer not null default 0,
  included_course_count integer not null default 0,
  max_teacher_count integer not null default 0,
  monthly_ai_quota_per_learner integer not null default 0,
  monthly_pdf_quota_per_learner integer not null default 0,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenants (
  id text primary key,
  slug text unique not null,
  name text not null,
  display_name text not null,
  logo_url text,
  primary_color text,
  status text not null default 'active',
  plan_id text references public.plans(id),
  enabled_course_ids text[] not null default '{}',
  included_learners integer not null default 0,
  overage_price integer not null default 0,
  monthly_ai_quota_per_learner integer not null default 0,
  monthly_pdf_quota_per_learner integer not null default 0,
  billing_cycle text not null default 'monthly',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_course_access (
  tenant_id text not null references public.tenants(id) on delete cascade,
  course_id text not null,
  is_enabled boolean not null default true,
  enabled_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tenant_id, course_id)
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id text not null references public.tenants(id) on delete cascade,
  user_id text,
  anonymous_student_id text,
  course_id text not null,
  session_id text,
  event_type text not null check (
    event_type in (
      'course_open',
      'activity_save',
      'ai_generate',
      'ai_generate_success',
      'ai_generate_failed',
      'pdf_generate',
      'pdf_download',
      'report_submit',
      'student_active'
    )
  ),
  quantity integer not null default 1 check (quantity >= 1 and quantity <= 1000),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  billing_month text not null check (billing_month ~ '^\d{4}-\d{2}$'),
  event_key text not null,
  request_id text,
  created_at timestamptz not null default now(),
  unique (event_key)
);

create table if not exists public.monthly_usage_summaries (
  tenant_id text not null references public.tenants(id) on delete cascade,
  billing_month text not null check (billing_month ~ '^\d{4}-\d{2}$'),
  active_learners integer not null default 0,
  course_opens integer not null default 0,
  activity_saves integer not null default 0,
  ai_generate_count integer not null default 0,
  ai_success_count integer not null default 0,
  ai_failure_count integer not null default 0,
  pdf_generate_count integer not null default 0,
  pdf_download_count integer not null default 0,
  submitted_reports integer not null default 0,
  estimated_base_fee integer not null default 0,
  estimated_overage_fee integer not null default 0,
  estimated_total_fee integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (tenant_id, billing_month)
);

create index if not exists usage_events_tenant_id_idx on public.usage_events (tenant_id);
create index if not exists usage_events_billing_month_idx on public.usage_events (billing_month);
create index if not exists usage_events_tenant_month_idx on public.usage_events (tenant_id, billing_month);
create index if not exists usage_events_student_month_idx on public.usage_events (anonymous_student_id, billing_month);
create index if not exists usage_events_event_type_idx on public.usage_events (event_type);
create index if not exists tenant_course_access_tenant_idx on public.tenant_course_access (tenant_id);
create index if not exists monthly_usage_tenant_month_idx on public.monthly_usage_summaries (tenant_id, billing_month);

insert into public.plans (
  id, name, setup_fee, monthly_base_fee, included_learners, overage_price,
  included_course_count, max_teacher_count, monthly_ai_quota_per_learner,
  monthly_pdf_quota_per_learner, features
) values
  ('starter', 'Starter', 990000, 150000, 50, 3000, 5, 3, 10, 3, '["기본 수업 포털", "학생 보고서 PDF", "기본 사용량 집계"]'::jsonb),
  ('business', 'Business', 1990000, 290000, 150, 2500, 999, 10, 15, 5, '["전체 수업 패키지", "확장 사용량 집계", "강사 계정 확장"]'::jsonb),
  ('institution', 'Institution', 3000000, 600000, 300, 2000, 999, 50, 20, 10, '["기관형 전체 패키지", "대규모 강사 운영", "기관별 운영 리포트"]'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  setup_fee = excluded.setup_fee,
  monthly_base_fee = excluded.monthly_base_fee,
  included_learners = excluded.included_learners,
  overage_price = excluded.overage_price,
  included_course_count = excluded.included_course_count,
  max_teacher_count = excluded.max_teacher_count,
  monthly_ai_quota_per_learner = excluded.monthly_ai_quota_per_learner,
  monthly_pdf_quota_per_learner = excluded.monthly_pdf_quota_per_learner,
  features = excluded.features,
  updated_at = now();

insert into public.tenants (
  id, slug, name, display_name, logo_url, primary_color, status, plan_id,
  enabled_course_ids, included_learners, overage_price, monthly_ai_quota_per_learner,
  monthly_pdf_quota_per_learner, billing_cycle
) values (
  'default',
  'default',
  'LoreAX Class',
  'LoreAX Class',
  '/assets/brand/logo.svg',
  '#2348d8',
  'active',
  'starter',
  '{}',
  50,
  3000,
  10,
  3,
  'monthly'
) on conflict (id) do update set
  display_name = excluded.display_name,
  logo_url = excluded.logo_url,
  primary_color = excluded.primary_color,
  status = excluded.status,
  plan_id = excluded.plan_id,
  updated_at = now();

alter table public.plans enable row level security;
alter table public.tenants enable row level security;
alter table public.tenant_course_access enable row level security;
alter table public.usage_events enable row level security;
alter table public.monthly_usage_summaries enable row level security;

drop policy if exists "plans_read_public_active" on public.plans;
create policy "plans_read_public_active"
on public.plans for select
to anon, authenticated
using (true);

drop policy if exists "tenants_read_public_active" on public.tenants;
create policy "tenants_read_public_active"
on public.tenants for select
to anon, authenticated
using (status = 'active');

drop policy if exists "tenant_course_access_read_public" on public.tenant_course_access;
create policy "tenant_course_access_read_public"
on public.tenant_course_access for select
to anon, authenticated
using (true);

drop policy if exists "usage_events_insert_anon" on public.usage_events;
create policy "usage_events_insert_anon"
on public.usage_events for insert
to anon, authenticated
with check (
  tenant_id is not null
  and event_type in (
    'course_open',
    'activity_save',
    'ai_generate',
    'ai_generate_success',
    'ai_generate_failed',
    'pdf_generate',
    'pdf_download',
    'report_submit',
    'student_active'
  )
);

drop policy if exists "usage_events_no_public_select" on public.usage_events;
create policy "usage_events_no_public_select"
on public.usage_events for select
to anon, authenticated
using (false);

drop policy if exists "monthly_usage_no_public_select" on public.monthly_usage_summaries;
create policy "monthly_usage_no_public_select"
on public.monthly_usage_summaries for select
to anon, authenticated
using (false);

create or replace function public.calculate_monthly_active_learners(
  target_tenant_id text,
  target_billing_month text
)
returns integer
language sql
stable
as $$
  select count(distinct coalesce(nullif(user_id, ''), anonymous_student_id, event_key))::integer
  from public.usage_events
  where tenant_id = target_tenant_id
    and billing_month = target_billing_month
    and event_type in ('activity_save', 'ai_generate', 'pdf_generate', 'report_submit');
$$;

create or replace function public.calculate_monthly_usage(
  target_tenant_id text,
  target_billing_month text
)
returns table (
  tenant_id text,
  billing_month text,
  active_learners integer,
  course_opens integer,
  activity_saves integer,
  ai_generate_count integer,
  ai_success_count integer,
  ai_failure_count integer,
  pdf_generate_count integer,
  pdf_download_count integer,
  submitted_reports integer,
  estimated_base_fee integer,
  estimated_overage_fee integer,
  estimated_total_fee integer
)
language sql
stable
as $$
  with plan_row as (
    select
      coalesce(p.monthly_base_fee, 0) as monthly_base_fee,
      coalesce(t.included_learners, p.included_learners, 0) as included_learners,
      coalesce(t.overage_price, p.overage_price, 0) as overage_price
    from public.tenants t
    left join public.plans p on p.id = t.plan_id
    where t.id = target_tenant_id
  ),
  event_counts as (
    select
      count(*) filter (where event_type = 'course_open')::integer as course_opens,
      count(*) filter (where event_type = 'activity_save')::integer as activity_saves,
      count(*) filter (where event_type = 'ai_generate')::integer as ai_generate_count,
      count(*) filter (where event_type = 'ai_generate_success')::integer as ai_success_count,
      count(*) filter (where event_type = 'ai_generate_failed')::integer as ai_failure_count,
      count(*) filter (where event_type = 'pdf_generate')::integer as pdf_generate_count,
      count(*) filter (where event_type = 'pdf_download')::integer as pdf_download_count,
      count(*) filter (where event_type = 'report_submit')::integer as submitted_reports
    from public.usage_events
    where usage_events.tenant_id = target_tenant_id
      and usage_events.billing_month = target_billing_month
  ),
  learner_count as (
    select public.calculate_monthly_active_learners(target_tenant_id, target_billing_month) as active_learners
  )
  select
    target_tenant_id,
    target_billing_month,
    learner_count.active_learners,
    event_counts.course_opens,
    event_counts.activity_saves,
    event_counts.ai_generate_count,
    event_counts.ai_success_count,
    event_counts.ai_failure_count,
    event_counts.pdf_generate_count,
    event_counts.pdf_download_count,
    event_counts.submitted_reports,
    plan_row.monthly_base_fee,
    greatest(0, learner_count.active_learners - plan_row.included_learners) * plan_row.overage_price,
    plan_row.monthly_base_fee + greatest(0, learner_count.active_learners - plan_row.included_learners) * plan_row.overage_price
  from plan_row, event_counts, learner_count;
$$;
