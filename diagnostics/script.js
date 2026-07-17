const statusTargets = {
  config: document.querySelector("#configStatus"),
  client: document.querySelector("#clientStatus"),
  classSession: document.querySelector("#classSessionStatus"),
  presence: document.querySelector("#presenceStatus"),
  report: document.querySelector("#reportStatus"),
  storage: document.querySelector("#storageStatus"),
  realtime: document.querySelector("#realtimeStatus"),
  fallback: document.querySelector("#fallbackStatus"),
  serviceWorker: document.querySelector("#serviceWorkerStatus"),
};

const logBox = document.querySelector("#diagnosticLog");
const buttons = [...document.querySelectorAll("[data-test]")];

function setStatus(key, label, type = "warn") {
  const target = statusTargets[key];
  if (!target) return;
  target.textContent = label;
  target.className = type === "ok" ? "is-ok" : type === "fail" ? "is-fail" : "is-warn";
}

function safeLogPayload(value) {
  return JSON.stringify(value, (key, item) => {
    if (/anon|key|token|jwt/i.test(key)) return item ? "[hidden]" : item;
    return item;
  }, 2);
}

function appendLog(title, result) {
  const time = new Date().toLocaleTimeString("ko-KR");
  logBox.textContent = `[${time}] ${title}\n${safeLogPayload(result)}\n\n${logBox.textContent || ""}`;
}

function classify(result) {
  return result?.ok ? "ok" : "fail";
}

async function checkInitialStatus() {
  const adapter = window.LoreAXSupabase;
  const configStatus = adapter?.getConfigStatus?.() || { label: "설정 없음", state: "missing" };
  setStatus("config", configStatus.label, configStatus.state === "ready" ? "warn" : configStatus.state === "missing" ? "warn" : "fail");
  setStatus("client", adapter?.isEnabled?.() ? "생성 가능" : "localStorage 모드", adapter?.isEnabled?.() ? "ok" : "warn");
  setStatus("fallback", canUseLocalStorage() ? "정상" : "사용 불가", canUseLocalStorage() ? "ok" : "fail");
  await checkServiceWorker();
}

function canUseLocalStorage() {
  try {
    const key = "__loreax_diagnostic_local__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

async function checkServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    setStatus("serviceWorker", "미지원", "warn");
    return;
  }
  try {
    const registration = await navigator.serviceWorker.getRegistration("../sw.js");
    setStatus("serviceWorker", registration ? "등록됨" : "미등록", registration ? "ok" : "warn");
  } catch {
    setStatus("serviceWorker", "확인 실패", "fail");
  }
}

async function runTest(name) {
  const adapter = window.LoreAXSupabase;
  if (!adapter) {
    appendLog("어댑터 확인", { ok: false, message: "LoreAXSupabase 어댑터를 찾을 수 없습니다." });
    return;
  }

  const labels = {
    connection: "연결 다시 확인",
    classSession: "테스트 수업 세션 생성",
    presence: "테스트 presence 전송",
    report: "테스트 보고서 저장",
    storage: "테스트 PDF Blob 업로드",
    realtime: "Realtime 구독 테스트",
    cleanup: "테스트 데이터 정리",
  };

  const statusKey = {
    connection: "client",
    classSession: "classSession",
    presence: "presence",
    report: "report",
    storage: "storage",
    realtime: "realtime",
    cleanup: "classSession",
  }[name];

  if (statusKey) setStatus(statusKey, "확인 중", "warn");

  let result;
  if (name === "connection") result = await adapter.testConnection();
  if (name === "classSession") result = await adapter.testClassSession();
  if (name === "presence") result = await adapter.testPresenceWrite();
  if (name === "report") result = await adapter.testReportWrite();
  if (name === "storage") result = await adapter.testStorageAccess();
  if (name === "realtime") result = await adapter.testRealtime({ onEvent: (event) => appendLog("Realtime 이벤트 수신", { ok: true, event: event.eventType }) });
  if (name === "cleanup") {
    const ok = window.confirm("진단 테스트 데이터만 정리합니다. 계속할까요?");
    if (!ok) return;
    result = await adapter.cleanupDiagnostics();
  }

  if (statusKey) setStatus(statusKey, result.ok ? "성공" : result.message, classify(result));
  if (name === "connection") {
    const configStatus = adapter.getConfigStatus();
    setStatus("config", result.ok ? "연결 성공" : configStatus.label, result.ok ? "ok" : "fail");
  }
  if (name === "cleanup" && result.ok) {
    setStatus("presence", "정리됨", "warn");
    setStatus("report", "정리됨", "warn");
    setStatus("storage", "정리됨", "warn");
  }
  appendLog(labels[name] || name, result);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((item) => (item.disabled = true));
    runTest(button.dataset.test)
      .catch((error) => appendLog("진단 실행 오류", { ok: false, message: window.LoreAXSupabase?.safeErrorMessage?.(error) || String(error) }))
      .finally(() => buttons.forEach((item) => (item.disabled = false)));
  });
});

checkInitialStatus();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("../sw.js").catch(() => {
      setStatus("serviceWorker", "등록 실패", "fail");
    });
  });
}
