const ALLOWED_EVENT_TYPES = new Set([
  "course_open",
  "activity_save",
  "ai_generate",
  "ai_generate_success",
  "ai_generate_failed",
  "pdf_generate",
  "pdf_download",
  "report_submit",
  "student_active",
]);
const PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhneHVtand2ZmVxdWpxd2l4bWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MDMyMTMsImV4cCI6MjA5OTM3OTIxM30.7SOhCZnzpjpqIqfoCZD9J6_Y8fiZc4_qfZ2ybsVg9fc";

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "POST") return endJson(res, 405, { ok: false, error: "POST only" });

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return endJson(res, 400, { ok: false, error: "Invalid JSON" });
  }

  const event = normalizeEvent(body);
  if (!ALLOWED_EVENT_TYPES.has(event.event_type)) {
    return endJson(res, 400, { ok: false, error: "Invalid event type" });
  }

  const supabase = supabaseEnv();
  if (!supabase.url || !supabase.key) {
    return endJson(res, 202, { ok: false, queued: true, error: "Supabase server env is not configured" });
  }

  try {
    const response = await fetch(`${supabase.url}/rest/v1/usage_events`, {
      method: "POST",
      headers: {
        apikey: supabase.key,
        Authorization: `Bearer ${supabase.key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      if (response.status === 404 || detail.includes("PGRST205") || detail.includes("usage_events")) {
        return endJson(res, 202, {
          ok: false,
          queued: true,
          error: "usage_events table is not available. Run the tenant usage migration.",
        });
      }
      return endJson(res, response.status >= 500 ? 502 : response.status, {
        ok: false,
        error: safeDbError(detail || response.statusText),
      });
    }

    return endJson(res, 200, { ok: true });
  } catch (error) {
    return endJson(res, 202, { ok: false, queued: true, error: safeDbError(error?.message) });
  }
};

function supabaseEnv() {
  return {
    url: String(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hgxumjwvfequjqwixmit.supabase.co").trim().replace(/\/$/, ""),
    key: String(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_ANON_KEY).trim(),
  };
}

function normalizeEvent(source) {
  const tenantId = safeString(source.tenantId || source.tenant_id || "default", 80);
  const eventType = safeString(source.eventType || source.event_type, 60);
  const courseId = safeString(source.courseId || source.course_id || "unknown", 120);
  const occurredAt = source.occurredAt || source.occurred_at || new Date().toISOString();
  const requestId = safeString(source.requestId || source.request_id || source.eventKey || source.event_key || `${Date.now()}`, 180);
  const eventKey = safeString(source.eventKey || source.event_key || [tenantId, source.anonymousStudentId || source.anonymous_student_id || "anonymous", eventType, requestId].join(":"), 260);
  return {
    tenant_id: tenantId,
    user_id: emptyToNull(safeString(source.userId || source.user_id, 120)),
    anonymous_student_id: safeString(source.anonymousStudentId || source.anonymous_student_id || "anonymous", 160),
    course_id: courseId,
    session_id: safeString(source.sessionId || source.session_id || `${tenantId}:${courseId}`, 180),
    event_type: eventType,
    quantity: clampNumber(source.quantity, 1, 1, 1000),
    metadata: shrinkMetadata(source.metadata),
    occurred_at: validIsoDate(occurredAt),
    billing_month: safeBillingMonth(source.billingMonth || source.billing_month || String(occurredAt).slice(0, 7)),
    event_key: eventKey,
    request_id: requestId,
  };
}

function safeString(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function emptyToNull(value) {
  return value || null;
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function shrinkMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") return {};
  const json = JSON.stringify(metadata);
  if (json.length <= 3000) return metadata;
  return { truncated: true };
}

function validIsoDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function safeBillingMonth(value) {
  const raw = safeString(value, 10);
  return /^\d{4}-\d{2}$/.test(raw) ? raw : new Date().toISOString().slice(0, 7);
}

function safeDbError(value) {
  return String(value || "Usage event save failed")
    .replace(/eyJ[\w.-]+/g, "[token hidden]")
    .slice(0, 240);
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function endJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
