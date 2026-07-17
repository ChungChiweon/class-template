module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "GET") return endJson(res, 405, { ok: false, error: "GET only" });

  const url = new URL(req.url, "https://class-template.vercel.app");
  const tenantId = safeString(url.searchParams.get("tenantId") || url.searchParams.get("tenant") || "default", 80);
  const month = safeBillingMonth(url.searchParams.get("month") || new Date().toISOString().slice(0, 7));
  const supabase = supabaseEnv();

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
    const events = await response.json();
    const summary = calculateSummary(tenantId, month, events || []);
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

function calculateSummary(tenantId, month, events) {
  const activeEvents = new Set(["activity_save", "ai_generate", "pdf_generate", "report_submit"]);
  const activeLearners = new Set();
  const count = (type) => events.filter((event) => event.event_type === type).reduce((sum, event) => sum + Number(event.quantity || 1), 0);
  events.forEach((event) => {
    if (activeEvents.has(event.event_type)) activeLearners.add(event.anonymous_student_id || event.user_id || event.event_key);
  });
  const plan = starterPlan();
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

function starterPlan() {
  return { monthlyBaseFee: 150000, includedLearners: 50, overagePrice: 3000 };
}

function supabaseEnv() {
  return {
    url: String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hgxumjwvfequjqwixmit.supabase.co").trim().replace(/\/$/, ""),
    key: String(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim(),
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
