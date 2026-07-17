-- Sample tenants for tenant/course visibility validation.
-- Safe to run more than once.

insert into public.tenants (
  id,
  slug,
  name,
  display_name,
  logo_url,
  primary_color,
  status,
  plan_id,
  enabled_course_ids,
  included_learners,
  overage_price,
  monthly_ai_quota_per_learner,
  monthly_pdf_quota_per_learner,
  billing_cycle,
  updated_at
) values
  (
    'academy-a',
    'academy-a',
    '아카데미 A',
    '아카데미 A AI 클래스',
    '/assets/brand/logo.svg',
    '#3156D3',
    'active',
    'starter',
    array['dataAnalysisReport', 'hotelPromo', 'careerRecordActivity', 'scienceCsPrep', 'cardNews'],
    50,
    3000,
    10,
    3,
    'monthly',
    now()
  ),
  (
    'academy-b',
    'academy-b',
    '아카데미 B',
    '아카데미 B 융합 교육관',
    '/assets/brand/logo.svg',
    '#7C3AED',
    'active',
    'business',
    array['*'],
    150,
    2500,
    15,
    5,
    'monthly',
    now()
  )
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  display_name = excluded.display_name,
  logo_url = excluded.logo_url,
  primary_color = excluded.primary_color,
  status = excluded.status,
  plan_id = excluded.plan_id,
  enabled_course_ids = excluded.enabled_course_ids,
  included_learners = excluded.included_learners,
  overage_price = excluded.overage_price,
  monthly_ai_quota_per_learner = excluded.monthly_ai_quota_per_learner,
  monthly_pdf_quota_per_learner = excluded.monthly_pdf_quota_per_learner,
  billing_cycle = excluded.billing_cycle,
  updated_at = now();

insert into public.tenant_course_access (tenant_id, course_id, is_enabled, enabled_at, updated_at)
select 'academy-a', course_id, true, now(), now()
from unnest(array['dataAnalysisReport', 'hotelPromo', 'careerRecordActivity', 'scienceCsPrep', 'cardNews']) as course_id
on conflict (tenant_id, course_id) do update set
  is_enabled = excluded.is_enabled,
  updated_at = now();

insert into public.tenant_course_access (tenant_id, course_id, is_enabled, enabled_at, updated_at)
select 'academy-b', course_id, true, now(), now()
from unnest(array[
  'dataAnalysisReport',
  'droneExpert',
  'careerRecordActivity',
  'youtubeCreator',
  'financeCoaching',
  'cardNews',
  'shortsVideo',
  'emoticonCreator',
  'hotelPromo',
  'localBrandCampaign',
  'scienceCsPrep'
]) as course_id
on conflict (tenant_id, course_id) do update set
  is_enabled = excluded.is_enabled,
  updated_at = now();

-- Ensure usage summary RPC can be called through the serverless API with anon key.
create or replace function public.calculate_monthly_active_learners(
  target_tenant_id text,
  target_billing_month text
)
returns integer
language sql
stable
security definer
set search_path = public
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
security definer
set search_path = public
as $$
  with plan_row as (
    select
      coalesce(p.monthly_base_fee, 0) as monthly_base_fee,
      coalesce(t.included_learners, p.included_learners, 0) as included_learners,
      coalesce(t.overage_price, p.overage_price, 0) as overage_price
    from public.tenants t
    left join public.plans p on p.id = t.plan_id
    where t.id = target_tenant_id
      and t.status = 'active'
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

grant execute on function public.calculate_monthly_active_learners(text, text) to anon, authenticated;
grant execute on function public.calculate_monthly_usage(text, text) to anon, authenticated;
