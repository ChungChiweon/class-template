(function () {
  const ANONYMOUS_STUDENT_KEY = "loreax:anonymousStudentId";
  const LOCAL_EVENT_QUEUE_KEY = "loreax:usageEventQueue";
  const SESSION_OPEN_PREFIX = "loreax:courseOpen:";
  const ACTIVITY_DEBOUNCE_MS = 30000;
  const VALID_EVENT_TYPES = new Set([
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
  const lastActivityAt = new Map();

  function safeLocalStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeLocalStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Usage tracking must never block class work.
    }
  }

  function getAnonymousStudentId() {
    const existing = safeLocalStorageGet(ANONYMOUS_STUDENT_KEY);
    if (existing) return existing;
    const created =
      window.crypto?.randomUUID?.() ||
      `anon-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    safeLocalStorageSet(ANONYMOUS_STUDENT_KEY, created);
    return created;
  }

  function getTenantId() {
    return window.LoreAXTenant?.resolveTenantId?.() || "default";
  }

  function getBillingMonth(date = new Date()) {
    return window.LoreAXTenant?.billingMonth?.(date) || date.toISOString().slice(0, 7);
  }

  function getSessionId(courseId) {
    const today = new Date().toISOString().slice(0, 10);
    return `${getTenantId()}:${courseId || "unknown"}:${today}`;
  }

  function readQueue() {
    try {
      return JSON.parse(safeLocalStorageGet(LOCAL_EVENT_QUEUE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function writeQueue(events) {
    safeLocalStorageSet(LOCAL_EVENT_QUEUE_KEY, JSON.stringify(events.slice(-200)));
  }

  function enqueueLocalEvent(event) {
    const queue = readQueue();
    queue.push(event);
    writeQueue(queue);
  }

  function eventKeyFor(eventType, payload, requestId) {
    return [
      getTenantId(),
      payload.anonymousStudentId || getAnonymousStudentId(),
      eventType,
      requestId || payload.requestId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ].join(":");
  }

  function normalizeEvent(eventType, payload = {}) {
    const tenantId = String(payload.tenantId || getTenantId());
    const courseId = String(payload.courseId || payload.lessonId || window.localStorage?.getItem?.("selectedLessonId") || "unknown");
    const occurredAt = new Date().toISOString();
    const requestId = payload.requestId || window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
      tenantId,
      userId: payload.userId || "",
      anonymousStudentId: payload.anonymousStudentId || getAnonymousStudentId(),
      courseId,
      sessionId: payload.sessionId || getSessionId(courseId),
      eventType,
      quantity: Number.isFinite(Number(payload.quantity)) ? Number(payload.quantity) : 1,
      metadata: payload.metadata && typeof payload.metadata === "object" ? payload.metadata : {},
      occurredAt,
      billingMonth: payload.billingMonth || getBillingMonth(new Date(occurredAt)),
      eventKey: payload.eventKey || eventKeyFor(eventType, payload, requestId),
      requestId,
    };
  }

  async function postEvent(event) {
    const response = await fetch("/api/usage-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: true,
    });
    if (!response.ok) throw new Error(`usage-event ${response.status}`);
    return response.json().catch(() => ({ ok: true }));
  }

  function trackUsageEvent(eventType, payload = {}) {
    if (!VALID_EVENT_TYPES.has(eventType)) return Promise.resolve({ ok: false, skipped: true });
    const event = normalizeEvent(eventType, payload);
    enqueueLocalEvent(event);
    return postEvent(event).catch((error) => {
      console.warn("Usage event queued locally:", error?.message || error);
      return { ok: false, queued: true };
    });
  }

  function trackCourseOpen(courseId, metadata = {}) {
    const tenantId = getTenantId();
    const key = `${SESSION_OPEN_PREFIX}${tenantId}:${courseId}`;
    const today = new Date().toISOString().slice(0, 10);
    if (safeLocalStorageGet(key) === today) return Promise.resolve({ ok: true, skipped: true });
    safeLocalStorageSet(key, today);
    return trackUsageEvent("course_open", { courseId, metadata });
  }

  function trackActivitySave(courseId, metadata = {}) {
    const key = `${getTenantId()}:${courseId}`;
    const now = Date.now();
    if (now - Number(lastActivityAt.get(key) || 0) < ACTIVITY_DEBOUNCE_MS) return Promise.resolve({ ok: true, skipped: true });
    lastActivityAt.set(key, now);
    return trackUsageEvent("activity_save", { courseId, metadata });
  }

  function trackAiGenerate(courseId, taskName, metadata = {}) {
    return trackUsageEvent("ai_generate", { courseId, metadata: { ...metadata, taskName } });
  }

  function trackAiGenerateResult(courseId, success, metadata = {}) {
    return trackUsageEvent(success ? "ai_generate_success" : "ai_generate_failed", { courseId, metadata });
  }

  function trackPdfGenerate(courseId, metadata = {}) {
    return trackUsageEvent("pdf_generate", { courseId, metadata });
  }

  function trackPdfDownload(courseId, metadata = {}) {
    return trackUsageEvent("pdf_download", { courseId, metadata });
  }

  function trackReportSubmit(courseId, metadata = {}) {
    return trackUsageEvent("report_submit", { courseId, metadata });
  }

  window.LoreAXUsage = {
    getAnonymousStudentId,
    trackUsageEvent,
    trackCourseOpen,
    trackActivitySave,
    trackAiGenerate,
    trackAiGenerateResult,
    trackPdfGenerate,
    trackPdfDownload,
    trackReportSubmit,
    getQueuedEvents: readQueue,
  };
})();
