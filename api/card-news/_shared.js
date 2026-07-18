const COURSE_ID = "cardNews";
const PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhneHVtand2ZmVxdWpxd2l4bWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4MDMyMTMsImV4cCI6MjA5OTM3OTIxM30.7SOhCZnzpjpqIqfoCZD9J6_Y8fiZc4_qfZ2ybsVg9fc";
const MAX_BODY_BYTES = 2_000_000;
const LIMIT_MESSAGE = "\uc774 \uc0dd\uc131 \ubc29\uc2dd\uc740 \uc774\ubbf8 \uc0ac\uc6a9\ud588\uc2b5\ub2c8\ub2e4.";

const ACTIVE_TENANTS = new Set(["default", "academy-a", "academy-b"]);
const memorySuccess = new Set();
const memoryProjects = new Map();
const memorySubmits = new Set();

function setCors(res, methods = "GET, POST, OPTIONS") {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Idempotency-Key");
}

function endJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function methodNotAllowed(res) {
  return endJson(res, 405, { success: false, message: "Method not allowed" });
}

function readBody(req) {
  if (req.body && typeof req.body === "object") {
    const json = JSON.stringify(req.body);
    if (Buffer.byteLength(json, "utf8") > MAX_BODY_BYTES) {
      const error = new Error("Request body is too large");
      error.statusCode = 413;
      throw error;
    }
    return req.body;
  }

  const raw = String(req.body || "{}");
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    const error = new Error("Request body is too large");
    error.statusCode = 413;
    throw error;
  }
  try {
    return JSON.parse(raw || "{}");
  } catch {
    const error = new Error("Invalid JSON");
    error.statusCode = 400;
    throw error;
  }
}

function requestJson(req) {
  try {
    return readBody(req);
  } catch (error) {
    return { __error: true, statusCode: error.statusCode || 400, message: error.message || "Bad request" };
  }
}

function contextFrom(body = {}, req = {}) {
  const query = req.query || {};
  const tenantId = safeString(body.tenantId || body.tenant_id || query.tenantId || query.tenant_id || "default", 80);
  const anonymousStudentId = safeString(body.anonymousStudentId || body.anonymous_student_id || query.anonymousStudentId || query.anonymous_student_id, 160);
  const projectId = safeString(body.projectId || body.project_id || query.projectId || query.project_id, 100);
  const idempotencyKey = safeString(body.idempotencyKey || body.idempotency_key || req.headers?.["x-idempotency-key"], 260);

  if (!ACTIVE_TENANTS.has(tenantId)) {
    return { ok: false, statusCode: 403, error: "Tenant is not active" };
  }
  if (!anonymousStudentId) {
    return { ok: false, statusCode: 400, error: "anonymousStudentId is required" };
  }
  if (!/^[a-zA-Z0-9_-]{8,100}$/.test(projectId)) {
    return { ok: false, statusCode: 400, error: "Invalid projectId" };
  }

  return {
    ok: true,
    tenantId,
    anonymousStudentId,
    projectId,
    idempotencyKey,
    memoryKey: `${tenantId}:${anonymousStudentId}:${projectId}`,
  };
}

function supabaseEnv() {
  return {
    url: safeString(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hgxumjwvfequjqwixmit.supabase.co", 260).replace(/\/$/, ""),
    key: safeString(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_ANON_KEY, 1600),
  };
}

async function supabaseFetch(path, options = {}) {
  const env = supabaseEnv();
  if (!env.url || !env.key) return { ok: false, status: 0, data: null, text: "Supabase env is not configured" };
  const response = await fetch(`${env.url}${path}`, {
    ...options,
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await response.text().catch(() => "");
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  return { ok: response.ok, status: response.status, data, text };
}

function projectQuery(context) {
  const params = new URLSearchParams({
    tenant_id: `eq.${context.tenantId}`,
    anonymous_student_id: `eq.${context.anonymousStudentId}`,
    project_id: `eq.${context.projectId}`,
    select: "*",
    limit: "1",
  });
  return `/rest/v1/card_news_projects?${params}`;
}

async function getProject(context) {
  const response = await supabaseFetch(projectQuery(context), { method: "GET" });
  if (response.ok && Array.isArray(response.data) && response.data[0]) return { ok: true, project: response.data[0], source: "supabase" };
  const cached = memoryProjects.get(context.memoryKey);
  if (cached) return { ok: true, project: cached, source: "memory" };
  return { ok: false, project: null, source: response.status ? "supabase" : "memory", error: safeDbError(response.text) };
}

async function upsertProject(context, data = {}, options = {}) {
  const now = new Date().toISOString();
  const row = {
    tenant_id: context.tenantId,
    anonymous_student_id: context.anonymousStudentId,
    project_id: context.projectId,
    current_step: clampNumber(data.currentStep ?? data.current_step, 0, 0, 4),
    project_data: sanitizeProjectData(data),
    status: options.status || data.status || "draft",
    submitted_at: options.submittedAt || data.submittedAt || null,
    updated_at: now,
  };

  const response = await supabaseFetch("/rest/v1/card_news_projects?on_conflict=tenant_id,anonymous_student_id,project_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(row),
  });

  const memoryRow = {
    id: `${context.memoryKey}:memory`,
    ...row,
    created_at: now,
  };
  memoryProjects.set(context.memoryKey, memoryRow);

  if (response.ok) {
    const saved = Array.isArray(response.data) ? response.data[0] : response.data;
    return { ok: true, project: saved || memoryRow, source: "supabase" };
  }
  return { ok: false, project: memoryRow, source: "memory", error: safeDbError(response.text) };
}

async function hasGenerationSuccess(context, feature) {
  const memoryKey = generationKey(context, feature);
  if (memorySuccess.has(memoryKey)) return true;

  const params = new URLSearchParams({
    tenant_id: `eq.${context.tenantId}`,
    anonymous_student_id: `eq.${context.anonymousStudentId}`,
    course_id: `eq.${COURSE_ID}`,
    event_type: "eq.ai_generate_success",
    select: "event_key",
    limit: "1",
  });
  params.set("metadata->>feature", `eq.${feature}`);
  params.set("metadata->>projectId", `eq.${context.projectId}`);
  const usageResponse = await supabaseFetch(`/rest/v1/usage_events?${params}`, { method: "GET" });
  if (usageResponse.ok && Array.isArray(usageResponse.data) && usageResponse.data.length) {
    memorySuccess.add(memoryKey);
    return true;
  }

  const existing = await getProject(context);
  const data = existing.project?.project_data || {};
  const used = feature === "flux_generation" ? Boolean(data.flux?.used) : Boolean(data.gpt?.used);
  if (used) memorySuccess.add(memoryKey);
  return used;
}

async function recordGenerationSuccess(context, feature, provider, projectData = {}) {
  const eventKey = generationKey(context, feature);
  memorySuccess.add(eventKey);

  const existing = await getProject(context);
  const merged = mergeProjectData(existing.project?.project_data || {}, projectData);
  if (feature === "flux_generation") merged.flux = { ...(merged.flux || {}), used: true, generationUsed: true };
  if (feature === "gpt_integrated_generation") merged.gpt = { ...(merged.gpt || {}), used: true, generationUsed: true };

  const saveResult = await upsertProject(context, merged);
  await recordUsageEvent(context, "ai_generate_success", {
    courseId: COURSE_ID,
    feature,
    provider,
    projectId: context.projectId,
  }, eventKey);
  return saveResult;
}

async function recordSubmit(context, projectData = {}) {
  const eventKey = `${COURSE_ID}:${context.tenantId}:${context.anonymousStudentId}:${context.projectId}:submit`;
  const submittedAt = projectData.final?.submittedAt || new Date().toISOString();
  const saveResult = await upsertProject(context, { ...projectData, final: { ...(projectData.final || {}), submittedAt }, status: "submitted", submittedAt }, {
    status: "submitted",
    submittedAt,
  });

  if (!memorySubmits.has(eventKey)) {
    memorySubmits.add(eventKey);
    await recordUsageEvent(context, "report_submit", {
      courseId: COURSE_ID,
      projectId: context.projectId,
      selectedMethod: safeString(projectData.final?.selected || projectData.final?.selectedMethod, 40),
    }, eventKey);
  }
  return saveResult;
}

async function recordUsageEvent(context, eventType, metadata, eventKey) {
  const now = new Date().toISOString();
  const event = {
    tenant_id: context.tenantId,
    anonymous_student_id: context.anonymousStudentId,
    course_id: COURSE_ID,
    session_id: `${context.tenantId}:${COURSE_ID}`,
    event_type: eventType,
    quantity: 1,
    metadata,
    occurred_at: now,
    billing_month: now.slice(0, 7),
    event_key: eventKey,
    request_id: eventKey,
  };
  return supabaseFetch("/rest/v1/usage_events", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify(event),
  });
}

function generationKey(context, feature) {
  return `${COURSE_ID}:${context.tenantId}:${context.anonymousStudentId}:${context.projectId}:${feature}:success`;
}

function sanitizeProjectData(source = {}) {
  const out = {
    projectId: safeString(source.projectId || source.project_id, 100),
    tenantId: safeString(source.tenantId || source.tenant_id, 80),
    anonymousStudentId: safeString(source.anonymousStudentId || source.anonymous_student_id, 160),
    currentStep: clampNumber(source.currentStep, 0, 0, 4),
    updatedAt: safeString(source.updatedAt || new Date().toISOString(), 40),
    planning: pickStrings(source.planning, ["topic", "audience", "purpose", "message", "facts", "mood"], 2000),
    prompt: pickStrings(source.prompt, ["role", "task", "style", "rules"], 4000),
    copy: pickStrings(source.copy, ["title", "subtitle", "cta", "fluxPrompt", "gptPrompt"], 5000),
    flux: {
      ...pickStrings(source.flux, ["imageUrl", "finalImage"], 1_200_000),
      used: Boolean(source.flux?.used),
      generationUsed: Boolean(source.flux?.generationUsed),
      layers: Array.isArray(source.flux?.layers) ? source.flux.layers.slice(0, 8).map((layer) => ({
        id: safeString(layer.id, 30),
        text: safeString(layer.text, 500),
        x: clampNumber(layer.x, 80, 0, 1080),
        y: clampNumber(layer.y, 120, 0, 1080),
        size: clampNumber(layer.size, 40, 12, 120),
        color: /^#[0-9a-fA-F]{6}$/.test(String(layer.color || "")) ? layer.color : "#0f172a",
      })) : [],
    },
    gpt: {
      ...pickStrings(source.gpt, ["imageUrl"], 1_200_000),
      used: Boolean(source.gpt?.used),
      generationUsed: Boolean(source.gpt?.generationUsed),
    },
    final: {
      ...pickStrings(source.final, ["selected", "selectedMethod", "finalImageUrl", "reflection", "submittedAt"], 1_200_000),
    },
    status: ["draft", "submitted"].includes(source.status) ? source.status : "draft",
    submittedAt: safeString(source.submittedAt, 40),
  };
  return out;
}

function mergeProjectData(base = {}, extra = {}) {
  return {
    ...base,
    ...extra,
    planning: { ...(base.planning || {}), ...(extra.planning || {}) },
    prompt: { ...(base.prompt || {}), ...(extra.prompt || {}) },
    copy: { ...(base.copy || {}), ...(extra.copy || {}) },
    flux: { ...(base.flux || {}), ...(extra.flux || {}) },
    gpt: { ...(base.gpt || {}), ...(extra.gpt || {}) },
    final: { ...(base.final || {}), ...(extra.final || {}) },
  };
}

function pickStrings(source = {}, keys, maxLength) {
  return keys.reduce((out, key) => {
    out[key] = safeString(source?.[key], maxLength);
    return out;
  }, {});
}

function cleanText(value, maxLength = 500) {
  return safeString(value, maxLength).replace(/\s+/g, " ");
}

function safeString(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

function clampNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function safeDbError(value) {
  return String(value || "Database request failed")
    .replace(/eyJ[\w.-]+/g, "[token hidden]")
    .replace(/service_role[\w.-]*/gi, "[service role hidden]")
    .slice(0, 240);
}

function limitResponse(res) {
  return endJson(res, 429, { success: false, code: "CARDNEWS_GENERATION_LIMIT", message: LIMIT_MESSAGE });
}

module.exports = {
  COURSE_ID,
  cleanText,
  contextFrom,
  endJson,
  getProject,
  hasGenerationSuccess,
  limitResponse,
  methodNotAllowed,
  readBody,
  recordGenerationSuccess,
  recordSubmit,
  requestJson,
  safeDbError,
  sanitizeProjectData,
  setCors,
  upsertProject,
};
