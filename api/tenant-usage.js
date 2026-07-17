module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "GET") return endJson(res, 405, { ok: false, error: "GET only" });

  const url = new URL(req.url, "https://class-template.vercel.app");
  const tenantId = safeString(url.searchParams.get("tenantId") || url.searchParams.get("tenant") || "default", 80);
  const month = safeBillingMonth(url.searchParams.get("month") || new Date().toISOString().slice(0, 7));
  const supabase = supabaseEnv();
  const tenant = tenantMeta(tenantId);

  if (!tenant) {
    return endJson(res, 404, {
      ok: false,
      error: "Unknown or inactive tenant",
      tenantId,
      month,
      summary: emptySummary("default", month),
      events: [],
    });
  }

  if (!supabase.url || !supabase.key) {
    return endJson(res, 200, {
      ok: true,
      mode: "local",
      tenantId,
      month,
      summary: emptySummary(tenantId, month),
      events: [],
      warning: "Supabase server env is not configured.",
    });
  }

  try {
    const rpcResult = await fetchMonthlyUsageRpc(supabase, tenantId, month);
    if (rpcResult.summary) {
      const events = await fetchRecentEvents(supabase, tenantId, month).catch(() => []);
      return endJson(res, 200, { ok: true, mode: "supabase-rpc", tenantId, month, summary: rpcResult.summary, events });
    }

    const events = await fetchRecentEvents(supabase, tenantId, month);
    const summary = calculateSummary(tenantId, month, events || [], planForTenant(tenantId));
    return endJson(res, 200, { ok: true, mode: "supabase", tenantId, month, summary, events: events || [] });
  } catch (error) {
    return endJson(res, 200, {
      ok: false,
      mode: "local",
      tenantId,
      month,
      summary: emptySummary(tenantId, month),
      events: [],
      warning: safeDbError(error?.message),
    });
  }
};

async function fetchMonthlyUsageRpc(supabase, tenantId, month) {
  const response = await fetch(`${supabase.url}/rest/v1/rpc/calculate_monthly_usage`, {
    method: "POST",
    headers: {
      apikey: supabase.key,
      Authorization: `Bearer ${supabase.key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      target_tenant_id: tenantId,
      target_billing_month: month,
    }),
  });
  if (!response.ok) return { summary: null };
  const rows = await response.json();
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row) return { summary: null };
  return {
    summary: {
      tenantId: row.tenant_id || tenantId,
      billingMonth: row.billing_month || month,
      activeLearners: Number(row.active_learners || 0),
      courseOpens: Number(row.course_opens || 0),
      activitySaves: Number(row.activity_saves || 0),
      aiGenerateCount: Number(row.ai_generate_count || 0),
      aiSuccessCount: Number(row.ai_success_count || 0),
      aiFailureCount: Number(row.ai_failure_count || 0),
      pdfGenerateCount: Number(row.pdf_generate_count || 0),
      pdfDownloadCount: Number(row.pdf_download_count || 0),
      submittedReports: Number(row.submitted_reports || 0),
      estimatedBaseFee: Number(row.estimated_base_fee || 0),
      estimatedOverageFee: Number(row.estimated_overage_fee || 0),
      estimatedTotalFee: Number(row.estimated_total_fee || 0),
      ...derivePlanFields(tenantId, Number(row.active_learners || 0)),
      updatedAt: new Date().toISOString(),
    },
  };
}

async function fetchRecentEvents(supabase, tenantId, month) {
    const params = new URLSearchParams({
      tenant_id: `eq.${tenantId}`,
      billing_month: `eq.${month}`,
      order: "occurred_at.desc",
      limit: "100",
    });
    const response = await fetch(`${supabase.url}/rest/v1/usage_events?${params}`, {
      headers: {
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
      },
    });
    if (!response.ok) throw new Error(await response.text().catch(() => response.statusText));
  return response.json();
}

function calculateSummary(tenantId, month, events, plan = planForTenant(tenantId)) {
  const activeEvents = new Set(["activity_save", "ai_generate", "pdf_generate", "report_submit"]);
  const activeLearners = new Set();
  const count = (type) => events.filter((event) => event.event_type === type).reduce((sum, event) => sum + Number(event.quantity || 1), 0);
  events.forEach((event) => {
    if (activeEvents.has(event.event_type)) activeLearners.add(event.anonymous_student_id || event.user_id || event.event_key);
  });
  const overageLearners = Math.max(0, activeLearners.size - plan.includedLearners);
  const estimatedOverageFee = overageLearners * plan.overagePrice;
  return {
    tenantId,
    billingMonth: month,
    activeLearners: activeLearners.size,
    courseOpens: count("course_open"),
    activitySaves: count("activity_save"),
    aiGenerateCount: count("ai_generate"),
    aiSuccessCount: count("ai_generate_success"),
    aiFailureCount: count("ai_generate_failed"),
    pdfGenerateCount: count("pdf_generate"),
    pdfDownloadCount: count("pdf_download"),
    submittedReports: count("report_submit"),
    estimatedBaseFee: plan.monthlyBaseFee,
    estimatedOverageFee,
    estimatedTotalFee: plan.monthlyBaseFee + estimatedOverageFee,
    includedLearners: plan.includedLearners,
    overageLearners,
    overagePrice: plan.overagePrice,
    updatedAt: new Date().toISOString(),
  };
}

function emptySummary(tenantId, month) {
  return calculateSummary(tenantId, month, []);
}

function planForTenant(tenantId) {
  if (tenantId === "academy-b") return { monthlyBaseFee: 290000, includedLearners: 150, overagePrice: 2500 };
  return { monthlyBaseFee: 150000, includedLearners: 50, overagePrice: 3000 };
}

function tenantMeta(tenantId) {
  const tenants = new Map([
    ["default", { id: "default", status: "active", planId: "starter" }],
    ["academy-a", { id: "academy-a", status: "active", planId: "starter" }],
    ["academy-b", { id: "academy-b", status: "active", planId: "business" }],
  ]);
  const tenant = tenants.get(tenantId);
  return tenant?.status === "active" ? tenant : null;
}

function derivePlanFields(tenantId, activeLearners) {
  const plan = planForTenant(tenantId);
  const overageLearners = Math.max(0, Number(activeLearners || 0) - plan.includedLearners);
  return {
    includedLearners: plan.includedLearners,
    overageLearners,
    overagePrice: plan.overagePrice,
  };
}

function supabaseEnv() {
  return {
    url: String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hgxumjwvfequjqwixmit.supabase.co").trim().replace(/\/$/, ""),
    key: String(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhneHVtand2ZmVxdWpxd2l4bWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MDMyMTMsImV4cCI6MjA5OTM3OTIxM30.7SOhCZnzpjpqIqfoCZD9J6_Y8fiZc4_qfZ2ybsVg9fc").trim(),
  };
}

function safeString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function safeBillingMonth(value) {
  const raw = safeString(value, 10);
  return /^\d{4}-\d{2}$/.test(raw) ? raw : new Date().toISOString().slice(0, 7);
}

function safeDbError(value) {
  return String(value || "Usage query failed").replace(/eyJ[\w.-]+/g, "[token hidden]").slice(0, 240);
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function endJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
