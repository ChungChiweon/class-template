-- Sample usage events for 2026-07.
-- Safe to run more than once because event_key is deterministic and unique.

with academy_a_students as (
  select 'sample-a-' || lpad(n::text, 2, '0') as student_id
  from generate_series(1, 8) as n
),
academy_b_students as (
  select 'sample-b-' || lpad(n::text, 2, '0') as student_id
  from generate_series(1, 12) as n
),
events as (
  -- academy-a: 8 active learners, activity_save 8
  select
    'academy-a'::text as tenant_id,
    student_id as anonymous_student_id,
    'dataAnalysisReport'::text as course_id,
    'activity_save'::text as event_type,
    1 as quantity,
    jsonb_build_object('sample', true, 'tenant', 'academy-a') as metadata,
    '2026-07'::text as billing_month,
    format('sample:academy-a:%s:activity_save:01', student_id) as event_key,
    '2026-07-17 09:00:00+09'::timestamptz as occurred_at
  from academy_a_students

  union all
  -- academy-a: ai_generate 20
  select
    'academy-a',
    'sample-a-' || lpad((((n - 1) % 8) + 1)::text, 2, '0'),
    'dataAnalysisReport',
    'ai_generate',
    1,
    jsonb_build_object('sample', true, 'task', 'generate_period1_topic'),
    '2026-07',
    'sample:academy-a:ai_generate:' || lpad(n::text, 2, '0'),
    '2026-07-17 09:10:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 20) as n

  union all
  -- academy-a: ai_success 18
  select
    'academy-a',
    'sample-a-' || lpad((((n - 1) % 8) + 1)::text, 2, '0'),
    'dataAnalysisReport',
    'ai_generate_success',
    1,
    jsonb_build_object('sample', true),
    '2026-07',
    'sample:academy-a:ai_success:' || lpad(n::text, 2, '0'),
    '2026-07-17 09:40:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 18) as n

  union all
  -- academy-a: ai_failed 2
  select
    'academy-a',
    'sample-a-' || lpad(n::text, 2, '0'),
    'dataAnalysisReport',
    'ai_generate_failed',
    1,
    jsonb_build_object('sample', true, 'reason', 'rate_limit_test'),
    '2026-07',
    'sample:academy-a:ai_failed:' || lpad(n::text, 2, '0'),
    '2026-07-17 10:20:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 2) as n

  union all
  -- academy-a: pdf_generate 5
  select
    'academy-a',
    'sample-a-' || lpad(n::text, 2, '0'),
    'dataAnalysisReport',
    'pdf_generate',
    1,
    jsonb_build_object('sample', true),
    '2026-07',
    'sample:academy-a:pdf_generate:' || lpad(n::text, 2, '0'),
    '2026-07-17 11:00:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 5) as n

  union all
  -- academy-a: pdf_download 4
  select
    'academy-a',
    'sample-a-' || lpad(n::text, 2, '0'),
    'dataAnalysisReport',
    'pdf_download',
    1,
    jsonb_build_object('sample', true),
    '2026-07',
    'sample:academy-a:pdf_download:' || lpad(n::text, 2, '0'),
    '2026-07-17 11:20:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 4) as n

  union all
  -- academy-a: report_submit 3
  select
    'academy-a',
    'sample-a-' || lpad(n::text, 2, '0'),
    'dataAnalysisReport',
    'report_submit',
    1,
    jsonb_build_object('sample', true),
    '2026-07',
    'sample:academy-a:report_submit:' || lpad(n::text, 2, '0'),
    '2026-07-17 11:40:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 3) as n

  union all
  -- academy-b: 12 active learners, activity_save 12
  select
    'academy-b',
    student_id,
    'hotelPromo',
    'activity_save',
    1,
    jsonb_build_object('sample', true, 'tenant', 'academy-b'),
    '2026-07',
    format('sample:academy-b:%s:activity_save:01', student_id),
    '2026-07-18 09:00:00+09'::timestamptz
  from academy_b_students

  union all
  -- academy-b: ai_generate 35
  select
    'academy-b',
    'sample-b-' || lpad((((n - 1) % 12) + 1)::text, 2, '0'),
    case when n % 2 = 0 then 'hotelPromo' else 'dataAnalysisReport' end,
    'ai_generate',
    1,
    jsonb_build_object('sample', true),
    '2026-07',
    'sample:academy-b:ai_generate:' || lpad(n::text, 2, '0'),
    '2026-07-18 09:10:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 35) as n

  union all
  -- academy-b: ai_success 33
  select
    'academy-b',
    'sample-b-' || lpad((((n - 1) % 12) + 1)::text, 2, '0'),
    case when n % 2 = 0 then 'hotelPromo' else 'dataAnalysisReport' end,
    'ai_generate_success',
    1,
    jsonb_build_object('sample', true),
    '2026-07',
    'sample:academy-b:ai_success:' || lpad(n::text, 2, '0'),
    '2026-07-18 09:50:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 33) as n

  union all
  -- academy-b: ai_failed 2
  select
    'academy-b',
    'sample-b-' || lpad(n::text, 2, '0'),
    'hotelPromo',
    'ai_generate_failed',
    1,
    jsonb_build_object('sample', true, 'reason', 'rate_limit_test'),
    '2026-07',
    'sample:academy-b:ai_failed:' || lpad(n::text, 2, '0'),
    '2026-07-18 10:40:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 2) as n

  union all
  -- academy-b: pdf_generate 8
  select
    'academy-b',
    'sample-b-' || lpad(n::text, 2, '0'),
    'dataAnalysisReport',
    'pdf_generate',
    1,
    jsonb_build_object('sample', true),
    '2026-07',
    'sample:academy-b:pdf_generate:' || lpad(n::text, 2, '0'),
    '2026-07-18 11:00:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 8) as n

  union all
  -- academy-b: pdf_download 7
  select
    'academy-b',
    'sample-b-' || lpad(n::text, 2, '0'),
    'dataAnalysisReport',
    'pdf_download',
    1,
    jsonb_build_object('sample', true),
    '2026-07',
    'sample:academy-b:pdf_download:' || lpad(n::text, 2, '0'),
    '2026-07-18 11:20:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 7) as n

  union all
  -- academy-b: report_submit 6
  select
    'academy-b',
    'sample-b-' || lpad(n::text, 2, '0'),
    'dataAnalysisReport',
    'report_submit',
    1,
    jsonb_build_object('sample', true),
    '2026-07',
    'sample:academy-b:report_submit:' || lpad(n::text, 2, '0'),
    '2026-07-18 11:40:00+09'::timestamptz + (n || ' minutes')::interval
  from generate_series(1, 6) as n
)
insert into public.usage_events (
  tenant_id,
  anonymous_student_id,
  course_id,
  session_id,
  event_type,
  quantity,
  metadata,
  occurred_at,
  billing_month,
  event_key,
  request_id
)
select
  tenant_id,
  anonymous_student_id,
  course_id,
  tenant_id || ':' || course_id || ':2026-07',
  event_type,
  quantity,
  metadata,
  occurred_at,
  billing_month,
  event_key,
  event_key
from events
on conflict (event_key) do nothing;

select * from public.calculate_monthly_usage('academy-a', '2026-07');
select * from public.calculate_monthly_usage('academy-b', '2026-07');
