(function () {
  const DEFAULT_LESSON_ID = "hotelPromo";
  const CLASS_SESSION_KEY_PREFIX = "loreaxSupabaseClassSession:";
  const STUDENT_SESSION_KEY_PREFIX = "loreaxSupabaseStudentSession:";
  const SYNC_STATE_KEY = "loreaxSupabaseSyncState";
  const ONLINE_WINDOW_MS = 360000;
  const BUCKET_NAME = "student-reports";
  const DIAGNOSTIC_LESSON_ID = "__diagnostic_lesson__";
  const DIAGNOSTIC_DEVICE_ID = "__diagnostic_device__";
  const DIAGNOSTIC_STUDENT_NAME = "__LOREAX_TEST__";
  const warnedMessages = new Set();

  function config() {
    const cfg = window.LOREAX_SUPABASE_CONFIG || {};
    const url = String(cfg.url || "").trim();
    const anonKey = String(cfg.anonKey || "").trim();
    const auth = cfg.auth || {};
    return {
      ...cfg,
      url,
      anonKey,
      auth: {
        provider: auth.provider || "kakao",
        redirectTo: String(auth.redirectTo || "").trim(),
      },
      enabled: Boolean(cfg.enabled && url && anonKey),
    };
  }

  function setSyncState(state, detail = "") {
    const payload = {
      state,
      detail,
      updatedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(payload));
    } catch {
      // Sync status is optional UI state.
    }
    window.dispatchEvent(new CustomEvent("loreax:supabase-status", { detail: payload }));
  }

  function warnOnce(message, error) {
    if (warnedMessages.has(message)) return;
    warnedMessages.add(message);
    console.warn(message, error || "");
  }

  function safeErrorMessage(error) {
    const raw = String(error?.message || error?.error_description || error || "알 수 없는 오류");
    const lower = raw.toLowerCase();
    if (lower.includes("relation") && lower.includes("does not exist")) return "테이블이 없습니다. supabase/schema.sql 실행 여부를 확인하세요.";
    if (lower.includes("permission denied")) return "권한이 거부되었습니다. RLS 정책과 anon 권한을 확인하세요.";
    if (lower.includes("row-level security") || lower.includes("violates row-level security")) return "RLS 정책으로 차단되었습니다. schema.sql의 정책을 확인하세요.";
    if (lower.includes("bucket") && lower.includes("not found")) return "Storage bucket student-reports를 찾을 수 없습니다.";
    if (lower.includes("invalid api key") || lower.includes("jwt")) return "anon key가 올바르지 않습니다.";
    if (lower.includes("failed to fetch") || lower.includes("network")) return "네트워크 연결 또는 Supabase URL을 확인하세요.";
    if (lower.includes("realtime")) return "Realtime 연결에 실패했습니다. polling fallback을 사용하세요.";
    const anonKey = config().anonKey;
    return (anonKey ? raw.replace(anonKey, "[anonKey hidden]") : raw).slice(0, 220);
  }

  function success(data = {}) {
    return { ok: true, message: "성공", ...data };
  }

  function failure(error, data = {}) {
    return { ok: false, message: safeErrorMessage(error), ...data };
  }

  function getConfigStatus() {
    const cfg = config();
    if (!cfg.url && !cfg.anonKey) return { state: "missing", label: "설정 없음", hasUrl: false, hasAnonKey: false, enabled: false };
    if (!cfg.url || !cfg.anonKey) return { state: "invalid", label: "연결 실패", hasUrl: Boolean(cfg.url), hasAnonKey: Boolean(cfg.anonKey), enabled: false };
    if (!cfg.enabled) return { state: "disabled", label: "localStorage 모드로 전환", hasUrl: true, hasAnonKey: true, enabled: false };
    if (!window.supabase?.createClient) return { state: "client-missing", label: "연결 실패", hasUrl: true, hasAnonKey: true, enabled: true };
    return { state: "ready", label: "연결 확인 중", hasUrl: true, hasAnonKey: true, enabled: true };
  }

  function isEnabled() {
    return config().enabled && Boolean(window.supabase?.createClient);
  }

  let client = null;
  function getClient() {
    if (!isEnabled()) return null;
    if (client) return client;
    const cfg = config();
    client = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: { eventsPerSecond: 4 },
      },
    });
    return client;
  }

  function getAuthRedirectTo(input) {
    const configured = config().auth?.redirectTo;
    const requested = String(input || configured || "").trim();
    if (requested) return requested;
    return window.location.origin + window.location.pathname;
  }

  async function signInWithKakao({ redirectTo } = {}) {
    const db = getClient();
    if (!db) return failure("Supabase 설정 없음", { mode: "mock" });
    try {
      const { data, error } = await db.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: getAuthRedirectTo(redirectTo),
        },
      });
      if (error) throw error;
      return success({ mode: "supabase", data });
    } catch (error) {
      return failure(error, { mode: "supabase" });
    }
  }

  async function signOut() {
    const db = getClient();
    if (!db) return failure("Supabase 설정 없음", { mode: "mock" });
    try {
      const { error } = await db.auth.signOut();
      if (error) throw error;
      return success({ mode: "supabase" });
    } catch (error) {
      return failure(error, { mode: "supabase" });
    }
  }

  async function getAuthUser() {
    const db = getClient();
    if (!db) return { ok: true, mode: "mock", user: null, session: null };
    try {
      const { data: sessionData } = await db.auth.getSession();
      const { data, error } = await db.auth.getUser();
      if (error && sessionData?.session) throw error;
      return {
        ok: true,
        mode: "supabase",
        user: data?.user || sessionData?.session?.user || null,
        session: sessionData?.session || null,
      };
    } catch (error) {
      return failure(error, { mode: "supabase", user: null, session: null });
    }
  }

  function onAuthStateChange(callback) {
    const db = getClient();
    if (!db) {
      callback?.({ event: "MOCK", session: null, user: null, mode: "mock" });
      return { unsubscribe() {} };
    }
    const { data } = db.auth.onAuthStateChange((event, session) => {
      callback?.({ event, session, user: session?.user || null, mode: "supabase" });
    });
    return data?.subscription || { unsubscribe() {} };
  }

  function todayKoreaDate() {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date());
  }

  function getLessonId(input) {
    return String(input || window.localStorage.getItem("selectedLessonId") || DEFAULT_LESSON_ID);
  }

  function classSessionStorageKey(lessonId, sessionDate) {
    return `${CLASS_SESSION_KEY_PREFIX}${lessonId}:${sessionDate}`;
  }

  function studentSessionStorageKey(lessonId, deviceId, sessionDate) {
    return `${STUDENT_SESSION_KEY_PREFIX}${lessonId}:${sessionDate}:${deviceId}`;
  }

  async function getClassSession({ lessonId, title, sessionDate } = {}) {
    const db = getClient();
    if (!db) return null;
    const resolvedLessonId = getLessonId(lessonId);
    const resolvedSessionDate = sessionDate || todayKoreaDate();
    const cacheKey = classSessionStorageKey(resolvedLessonId, resolvedSessionDate);

    try {
      const cached = JSON.parse(window.localStorage.getItem(cacheKey) || "null");
      if (cached?.id) return cached;
    } catch {
      // Ignore malformed session cache.
    }

    const payload = {
      lesson_id: resolvedLessonId,
      session_date: resolvedSessionDate,
      title: title || resolvedLessonId,
      status: "active",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await db
      .from("class_sessions")
      .upsert(payload, { onConflict: "lesson_id,session_date" })
      .select()
      .single();

    if (error) throw error;
    try {
      window.localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch {
      // Cache is optional.
    }
    return data;
  }

  function normalizeStudentPayload(payload = {}) {
    const progress = Number.isFinite(Number(payload.progress)) ? Math.round(Number(payload.progress)) : 0;
    return {
      deviceId: String(payload.studentId || payload.deviceId || payload.device_id || "local-device"),
      studentName: String(payload.studentName || payload.student_name || "").trim(),
      studentNumber: String(payload.studentNumber || payload.student_number || "").trim(),
      className: String(payload.className || payload.class_name || "").trim(),
      currentStep: String(payload.currentStep || payload.current_step || "AI 실습 진행 중"),
      progress: Math.max(0, Math.min(100, progress)),
      pdfGenerated: Boolean(payload.pdfGenerated || payload.is_pdf_generated),
      pdfUrl: payload.pdfUrl || payload.pdf_url || "",
      lessonId: getLessonId(payload.lessonId || payload.lesson_id),
      lastSeenAt: payload.lastSeenAt || Date.now(),
    };
  }

  async function upsertStudentSession({ classSession, presence }) {
    const db = getClient();
    if (!db || !classSession?.id) return null;
    const normalized = normalizeStudentPayload(presence);
    const row = {
      class_session_id: classSession.id,
      device_id: normalized.deviceId,
      student_name: normalized.studentName || "학생 기기",
      student_number: normalized.studentNumber,
      class_name: normalized.className,
      current_step: normalized.currentStep,
      progress: normalized.progress,
      last_seen_at: new Date(normalized.lastSeenAt).toISOString(),
      is_pdf_generated: normalized.pdfGenerated,
      pdf_url: normalized.pdfUrl || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await db
      .from("student_sessions")
      .upsert(row, { onConflict: "class_session_id,device_id" })
      .select()
      .single();

    if (error) throw error;
    try {
      window.localStorage.setItem(
        studentSessionStorageKey(normalized.lessonId, normalized.deviceId, classSession.session_date),
        JSON.stringify(data)
      );
    } catch {
      // Cache is optional.
    }
    return data;
  }

  async function syncPresence(payload = {}) {
    if (!isEnabled()) {
      setSyncState("mock", "Supabase 설정 없음");
      return { mode: "mock", data: null };
    }
    setSyncState("syncing", "서버 동기화 중");
    try {
      const presence = normalizeStudentPayload(payload);
      const classSession = await getClassSession({
        lessonId: presence.lessonId,
        title: payload.lessonTitle || presence.lessonId,
        sessionDate: payload.sessionDate,
      });
      const studentSession = await upsertStudentSession({ classSession, presence });
      setSyncState("synced", "서버 저장 완료");
      return { mode: "supabase", classSession, studentSession };
    } catch (error) {
      setSyncState("local", "로컬에 안전 저장됨");
      warnOnce("Supabase presence sync failed. Falling back to localStorage.", error);
      return { mode: "local", error };
    }
  }

  async function saveReport({ lessonId, reportData, presence } = {}) {
    if (!isEnabled()) return { mode: "mock", data: null };
    setSyncState("syncing", "보고서 서버 동기화 중");
    try {
      const resolvedLessonId = getLessonId(lessonId);
      const classSession = await getClassSession({
        lessonId: resolvedLessonId,
        title: presence?.lessonTitle || resolvedLessonId,
        sessionDate: presence?.sessionDate,
      });
      const studentSession = await upsertStudentSession({
        classSession,
        presence: { ...(presence || {}), lessonId: resolvedLessonId },
      });
      const row = {
        class_session_id: classSession.id,
        student_session_id: studentSession.id,
        lesson_id: resolvedLessonId,
        report_data: reportData,
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await getClient()
        .from("student_reports")
        .upsert(row, { onConflict: "class_session_id,student_session_id,lesson_id" })
        .select()
        .single();
      if (error) throw error;
      setSyncState("synced", "서버 저장 완료");
      return { mode: "supabase", data, classSession, studentSession };
    } catch (error) {
      setSyncState("local", "로컬에 안전 저장됨");
      warnOnce("Supabase report save failed. Local report data is preserved.", error);
      return { mode: "local", error };
    }
  }

  async function loadReport({ lessonId, presence } = {}) {
    if (!isEnabled()) return { mode: "mock", data: null };
    try {
      const resolvedLessonId = getLessonId(lessonId);
      const classSession = await getClassSession({
        lessonId: resolvedLessonId,
        title: presence?.lessonTitle || resolvedLessonId,
        sessionDate: presence?.sessionDate,
      });
      const studentSession = await upsertStudentSession({
        classSession,
        presence: { ...(presence || {}), lessonId: resolvedLessonId },
      });
      const { data, error } = await getClient()
        .from("student_reports")
        .select("report_data")
        .eq("class_session_id", classSession.id)
        .eq("student_session_id", studentSession.id)
        .eq("lesson_id", resolvedLessonId)
        .maybeSingle();
      if (error) throw error;
      return { mode: "supabase", data: data?.report_data || null };
    } catch (error) {
      warnOnce("Supabase report load failed. Local report data is used.", error);
      return { mode: "local", error };
    }
  }

  function safeFileName(value) {
    const raw = String(value || "report.pdf");
    const extension = raw.toLowerCase().endsWith(".pdf") ? ".pdf" : "";
    const base = raw
      .replace(/\.pdf$/i, "")
      .normalize("NFKD")
      .replace(/[^\w.-]+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 96);
    return `${base || `report_${Date.now()}`}${extension || ".pdf"}`;
  }

  async function uploadPdf({ blob, filename, lessonId, reportData, presence } = {}) {
    if (!isEnabled() || !blob) return { mode: "mock", url: "" };
    setSyncState("syncing", "PDF 업로드 중");
    try {
      const resolvedLessonId = getLessonId(lessonId);
      const classSession = await getClassSession({
        lessonId: resolvedLessonId,
        title: presence?.lessonTitle || resolvedLessonId,
        sessionDate: presence?.sessionDate,
      });
      const studentSession = await upsertStudentSession({
        classSession,
        presence: { ...(presence || {}), lessonId: resolvedLessonId, pdfGenerated: true },
      });
      const filePath = `${classSession.id}/${studentSession.id}/${safeFileName(filename)}`;
      const db = getClient();
      const { error: uploadError } = await db.storage
        .from(BUCKET_NAME)
        .upload(filePath, blob, {
          contentType: "application/pdf",
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { data: publicData } = db.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      const pdfUrl = publicData?.publicUrl || "";
      const { error: updateError } = await db
        .from("student_sessions")
        .update({
          is_pdf_generated: true,
          pdf_url: pdfUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentSession.id);
      if (updateError) throw updateError;

      if (reportData) {
        await saveReport({
          lessonId: resolvedLessonId,
          reportData: {
            ...reportData,
            metadata: {
              ...(reportData.metadata || {}),
              pdfGenerated: true,
              pdfUploadedAt: new Date().toISOString(),
              pdfUrl,
            },
          },
          presence: { ...(presence || {}), pdfGenerated: true, pdfUrl },
        });
      }

      setSyncState("synced", "서버 저장 완료");
      return { mode: "supabase", url: pdfUrl, path: filePath, classSession, studentSession };
    } catch (error) {
      setSyncState("local", "PDF는 다운로드됨, 서버 업로드 실패");
      warnOnce("Supabase PDF upload failed. Browser download still works.", error);
      return { mode: "local", error };
    }
  }

  function mapStudentRow(row) {
    const lastSeen = row.last_seen_at ? new Date(row.last_seen_at).getTime() : 0;
    const online = Date.now() - lastSeen <= ONLINE_WINDOW_MS;
    return {
      id: row.id,
      deviceId: row.device_id,
      name: row.student_name || "학생 기기",
      number: row.student_number || "",
      className: row.class_name || "",
      step: row.current_step || "AI 실습 진행 중",
      progress: Math.max(0, Math.min(100, Number(row.progress || 0))),
      lastSeenAt: lastSeen || Date.now(),
      pdfGenerated: Boolean(row.is_pdf_generated),
      pdfUrl: row.pdf_url || "",
      pdfStatus: row.pdf_url ? "ready" : row.is_pdf_generated ? "generated" : "pending",
      online,
    };
  }

  async function fetchPresence({ lessonId, sessionDate } = {}) {
    if (!isEnabled()) return { mode: "mock", students: [] };
    try {
      const classSession = await getClassSession({ lessonId, sessionDate });
      const { data, error } = await getClient()
        .from("student_sessions")
        .select("*")
        .eq("class_session_id", classSession.id)
        .order("last_seen_at", { ascending: false });
      if (error) throw error;
      return {
        mode: "supabase",
        classSession,
        students: (data || []).map(mapStudentRow),
      };
    } catch (error) {
      warnOnce("Supabase presence fetch failed. Mock/local rows are used.", error);
      return { mode: "local", students: [], error };
    }
  }

  async function subscribePresence({ lessonId, sessionDate, onChange, onStatus } = {}) {
    if (!isEnabled()) {
      onStatus?.("mock");
      return { mode: "mock", unsubscribe() {} };
    }
    const db = getClient();
    try {
      const classSession = await getClassSession({ lessonId, sessionDate });
      const emit = async (status = "realtime") => {
        const result = await fetchPresence({ lessonId, sessionDate });
        onStatus?.(result.mode === "supabase" ? status : "polling");
        onChange?.(result.students, result);
      };
      await emit("realtime");
      const channel = db
        .channel(`student_sessions:${classSession.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "student_sessions",
            filter: `class_session_id=eq.${classSession.id}`,
          },
          () => emit("realtime")
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") onStatus?.("realtime");
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") onStatus?.("polling");
        });
      const pollingId = window.setInterval(() => emit("polling"), 10000);
      return {
        mode: "supabase",
        classSession,
        unsubscribe() {
          window.clearInterval(pollingId);
          db.removeChannel(channel);
        },
      };
    } catch (error) {
      warnOnce("Supabase realtime subscription failed. Polling/mock fallback is used.", error);
      onStatus?.("polling");
      return { mode: "local", error, unsubscribe() {} };
    }
  }

  function diagnosticPresencePayload() {
    return {
      studentId: DIAGNOSTIC_DEVICE_ID,
      studentName: DIAGNOSTIC_STUDENT_NAME,
      studentNumber: "TEST-001",
      className: "진단",
      lessonId: DIAGNOSTIC_LESSON_ID,
      lessonTitle: "LoreAX Supabase 진단",
      currentStep: "진단 테스트",
      progress: 50,
      pdfGenerated: false,
      pdfUrl: "",
      lastSeenAt: Date.now(),
    };
  }

  async function testConnection() {
    const status = getConfigStatus();
    if (status.state !== "ready") return failure(status.label, { status });
    try {
      const db = getClient();
      if (!db) return failure("Supabase client를 생성할 수 없습니다.", { status });
      const { error } = await db.from("class_sessions").select("id").limit(1);
      if (error) throw error;
      setSyncState("synced", "연결 성공");
      return success({ status: { ...status, label: "연결 성공" } });
    } catch (error) {
      setSyncState("local", "연결 실패, localStorage 모드로 전환");
      return failure(error, { status: { ...status, label: "연결 실패" } });
    }
  }

  async function testClassSession() {
    if (!isEnabled()) return failure("Supabase 설정 없음");
    try {
      const classSession = await getClassSession({
        lessonId: DIAGNOSTIC_LESSON_ID,
        title: "LoreAX Supabase 진단",
        sessionDate: todayKoreaDate(),
      });
      return success({ classSession });
    } catch (error) {
      return failure(error);
    }
  }

  async function testPresenceWrite() {
    if (!isEnabled()) return failure("Supabase 설정 없음");
    try {
      const result = await syncPresence(diagnosticPresencePayload());
      if (result.mode !== "supabase") return failure(result.error || "presence 저장 실패");
      const { data, error } = await getClient()
        .from("student_sessions")
        .select("*")
        .eq("id", result.studentSession.id)
        .single();
      if (error) throw error;
      const required = ["class_session_id", "device_id", "student_name", "student_number", "class_name", "current_step", "progress", "last_seen_at", "is_pdf_generated", "pdf_url"];
      const presentFields = required.filter((field) => Object.prototype.hasOwnProperty.call(data, field));
      return success({ studentSession: data, presentFields });
    } catch (error) {
      return failure(error);
    }
  }

  async function testReportWrite() {
    if (!isEnabled()) return failure("Supabase 설정 없음");
    try {
      const reportData = {
        diagnostic: true,
        title: "LoreAX Supabase 진단 보고서",
        savedAt: new Date().toISOString(),
      };
      const result = await saveReport({
        lessonId: DIAGNOSTIC_LESSON_ID,
        reportData,
        presence: diagnosticPresencePayload(),
      });
      if (result.mode !== "supabase") return failure(result.error || "보고서 저장 실패");
      const { data, error } = await getClient()
        .from("student_reports")
        .select("id, class_session_id, student_session_id, lesson_id, report_data")
        .eq("id", result.data.id)
        .single();
      if (error) throw error;
      const matched = JSON.stringify(data.report_data) === JSON.stringify(reportData);
      return matched ? success({ report: data, verified: true }) : failure("저장 후 조회한 report_data가 일치하지 않습니다.", { report: data, verified: false });
    } catch (error) {
      return failure(error);
    }
  }

  async function testStorageAccess() {
    if (!isEnabled()) return failure("Supabase 설정 없음");
    try {
      const classResult = await testClassSession();
      if (!classResult.ok) return classResult;
      const payload = diagnosticPresencePayload();
      const studentSession = await upsertStudentSession({ classSession: classResult.classSession, presence: payload });
      const blob = new Blob(["LoreAX diagnostic PDF placeholder"], { type: "application/pdf" });
      const filename = `diagnostic-${Date.now()}.pdf`;
      const path = `${classResult.classSession.id}/${studentSession.id}/${filename}`;
      const db = getClient();
      const { error: uploadError } = await db.storage.from(BUCKET_NAME).upload(path, blob, {
        contentType: "application/pdf",
        upsert: true,
      });
      if (uploadError) throw uploadError;
      const { data: publicData } = db.storage.from(BUCKET_NAME).getPublicUrl(path);
      let signedUrl = "";
      const signed = await db.storage.from(BUCKET_NAME).createSignedUrl(path, 60).catch((error) => ({ error }));
      if (!signed.error) signedUrl = signed.data?.signedUrl || "";
      return success({ path, publicUrl: publicData?.publicUrl || "", signedUrl });
    } catch (error) {
      return failure(error);
    }
  }

  async function testRealtime({ onEvent } = {}) {
    if (!isEnabled()) return failure("Supabase 설정 없음");
    try {
      const classResult = await testClassSession();
      if (!classResult.ok) return classResult;
      const db = getClient();
      return await new Promise((resolve) => {
        let resolved = false;
        const timeoutId = window.setTimeout(() => {
          if (resolved) return;
          resolved = true;
          db.removeChannel(channel);
          resolve(failure("Realtime 이벤트가 제한 시간 안에 수신되지 않았습니다. polling fallback을 사용하세요."));
        }, 8000);
        const channel = db
          .channel(`diagnostic:${classResult.classSession.id}:${Date.now()}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "student_sessions",
              filter: `class_session_id=eq.${classResult.classSession.id}`,
            },
            (payload) => {
              onEvent?.(payload);
              if (resolved) return;
              resolved = true;
              window.clearTimeout(timeoutId);
              db.removeChannel(channel);
              resolve(success({ event: payload.eventType || "change" }));
            }
          )
          .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
              await syncPresence({ ...diagnosticPresencePayload(), progress: Math.floor(Math.random() * 100) });
            }
            if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
              if (resolved) return;
              resolved = true;
              window.clearTimeout(timeoutId);
              db.removeChannel(channel);
              resolve(failure("Realtime subscription failed"));
            }
          });
      });
    } catch (error) {
      return failure(error);
    }
  }

  async function cleanupDiagnostics() {
    if (!isEnabled()) return failure("Supabase 설정 없음");
    try {
      const db = getClient();
      const { data: sessions, error: sessionError } = await db
        .from("class_sessions")
        .select("id")
        .eq("lesson_id", DIAGNOSTIC_LESSON_ID);
      if (sessionError) throw sessionError;
      const sessionIds = (sessions || []).map((session) => session.id);
      if (!sessionIds.length) return success({ deletedSessions: 0 });

      const { data: students } = await db
        .from("student_sessions")
        .select("id")
        .in("class_session_id", sessionIds)
        .eq("device_id", DIAGNOSTIC_DEVICE_ID);
      for (const sessionId of sessionIds) {
        const listResult = await db.storage.from(BUCKET_NAME).list(sessionId);
        const studentIds = (students || []).map((student) => student.id);
        const files = [];
        for (const studentId of studentIds) {
          const nested = await db.storage.from(BUCKET_NAME).list(`${sessionId}/${studentId}`).catch(() => ({ data: [] }));
          (nested.data || []).forEach((file) => files.push(`${sessionId}/${studentId}/${file.name}`));
        }
        if (listResult.error && !String(listResult.error.message || "").includes("not found")) {
          // Storage cleanup failure should not block database cleanup.
        }
        if (files.length) await db.storage.from(BUCKET_NAME).remove(files);
      }
      await db.from("student_reports").delete().in("class_session_id", sessionIds).eq("lesson_id", DIAGNOSTIC_LESSON_ID);
      await db.from("student_sessions").delete().in("class_session_id", sessionIds).eq("device_id", DIAGNOSTIC_DEVICE_ID);
      await db.from("class_sessions").delete().in("id", sessionIds).eq("lesson_id", DIAGNOSTIC_LESSON_ID);
      return success({ deletedSessions: sessionIds.length });
    } catch (error) {
      return failure(error);
    }
  }

  window.LoreAXSupabase = {
    getConfigStatus,
    safeErrorMessage,
    isEnabled,
    getClient,
    signInWithKakao,
    signOut,
    getAuthUser,
    onAuthStateChange,
    getClassSession,
    syncPresence,
    saveReport,
    loadReport,
    uploadPdf,
    fetchPresence,
    subscribePresence,
    testConnection,
    testClassSession,
    testPresenceWrite,
    testReportWrite,
    testStorageAccess,
    testRealtime,
    cleanupDiagnostics,
    getSyncState() {
      try {
        return JSON.parse(window.localStorage.getItem(SYNC_STATE_KEY) || "null");
      } catch {
        return null;
      }
    },
    todayKoreaDate,
    onlineWindowMs: ONLINE_WINDOW_MS,
  };

  if (!isEnabled()) {
    setSyncState("mock", "Supabase 설정 없음");
  }
})();
