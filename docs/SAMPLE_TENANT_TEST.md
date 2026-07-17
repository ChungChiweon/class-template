# Sample Tenant Test

This document describes how to validate sample tenant isolation and monthly usage aggregation.

## 1. Run SQL

Run these files in the Supabase SQL Editor in order. If `/api/tenant-usage` returns
`Could not find the table 'public.usage_events'`, run the foundation migration first.

1. `supabase/migrations/20260717_tenant_usage_foundation.sql` if it has not already been run
2. `supabase/migrations/20260717_sample_tenants.sql`
3. `supabase/seed/sample_usage_events.sql`

Both files are safe to run more than once. Tenant rows are upserted and sample usage rows use deterministic `event_key` values.

## 2. Sample Tenants

### academy-a

- Display name: 아카데미 A AI 클래스
- Plan: Starter
- Included learners: 50
- Overage price: 3,000 KRW
- Allowed courses:
  - `dataAnalysisReport`
  - `hotelPromo`
  - `careerRecordActivity`
  - `scienceCsPrep`
  - `cardNews`

### academy-b

- Display name: 아카데미 B 융합 교육관
- Plan: Business
- Included learners: 150
- Overage price: 2,500 KRW
- Allowed courses: all active courses

## 3. Tenant URLs

- `https://class-template.vercel.app/?tenant=academy-a`
- `https://class-template.vercel.app/?tenant=academy-b`
- `https://class-template.vercel.app/tenant-admin/usage.html?tenant=academy-a&month=2026-07`
- `https://class-template.vercel.app/tenant-admin/usage.html?tenant=academy-b&month=2026-07`

The selected tenant is stored in `localStorage` as `loreax:tenantId` and is preserved in student/report links through the `tenant` query parameter.

## 4. Expected Usage Summary

Run:

```sql
select * from public.calculate_monthly_usage('academy-a', '2026-07');
select * from public.calculate_monthly_usage('academy-b', '2026-07');
```

Expected:

| Tenant | Active learners | Overage learners | Estimated total |
| --- | ---: | ---: | ---: |
| academy-a | 8 | 0 | 150000 |
| academy-b | 12 | 0 | 290000 |

## 5. Visibility Checks

- `academy-a` landing should show only the five allowed courses.
- `academy-b` landing should show all active courses.
- `default` should continue to behave like the existing public portal.
- Direct access to a disallowed course under `academy-a` should render an access-denied page and a link back to the tenant home.
- Tenant query should be preserved when entering student/report pages.

## 6. Data Isolation Checks

- `/api/tenant-usage?tenant=academy-a&month=2026-07` should not include academy-b events.
- `/api/tenant-usage?tenant=academy-b&month=2026-07` should not include academy-a events.
- Unknown tenant ids should return an unknown/inactive tenant response.

## 7. Security Notes

- Browser code must not contain a `service_role` key.
- The usage admin screen calls `/api/tenant-usage`; it does not query Supabase directly from the browser.
- Current tenant admin access is for MVP diagnostics only. Production sales usage requires admin authentication and stricter tenant authorization.
