const HEARTBEAT_INTERVAL_MS = 180000;
const ONLINE_WINDOW_MS = 360000;
const POLL_INTERVAL_MS = 5000;

const lessonRuntimeData = window.LoreAXLessonRuntimeData || {};

function getActiveLessonId() {
  const params = new URLSearchParams(window.location.search);
  const queryLessonId = params.get("lesson");
  const storedLessonId = (() => {
    try {
      return window.localStorage.getItem("selectedLessonId");
    } catch {
      return "";
    }
  })();
  const lessonId = queryLessonId || storedLessonId || "hotelPromo";
  const resolvedLessonId = lessonRuntimeData[lessonId] ? lessonId : "hotelPromo";
  try {
    window.localStorage.setItem("selectedLessonId", resolvedLessonId);
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
  return resolvedLessonId;
}

const activeLessonId = getActiveLessonId();
const activeLesson = lessonRuntimeData[activeLessonId] || lessonRuntimeData.hotelPromo || { title: "AI 실습형 수업", periods: [] };
const lessonSteps = (activeLesson.periods || []).map((period, index) => ({
  period: `${index + 1}교시`,
  title: period.title || `${index + 1}교시`,
  goal: period.objectives || "수업 목표를 확인합니다.",
  activities: Array.isArray(period.activities) ? period.activities : [],
  guide: period.studentGuide || "강사의 안내에 따라 단계별 실습을 진행하세요.",
  prompt: period.prompt || "이 차시에서 사용할 프롬프트가 아직 준비되지 않았습니다.",
  sampleTitle: period.example?.title || "예시 결과물",
  sampleDescription: period.example?.description || period.warning || "예시 결과물을 확인합니다.",
  sampleImage: period.example?.image || "../assets/hotel-ai-video-class-hero.png",
  timerMinutes: period.timerMinutes || 12,
  warning: period.warning || "",
}));

if (!lessonSteps.length) {
  lessonSteps.push({
    period: "1교시",
    title: activeLesson.title || "AI 실습형 수업",
    goal: "수업 데이터를 불러오지 못했습니다.",
    activities: ["수업 선택 상태 확인", "ERP 메인에서 다시 진입"],
    guide: "수업 데이터가 비어 있습니다. ERP 메인에서 수업을 다시 선택하세요.",
    prompt: "수업 데이터가 준비되지 않았습니다.",
    sampleTitle: "예시 결과물",
    sampleDescription: "수업 데이터 상태를 확인합니다.",
    sampleImage: "../assets/hotel-ai-video-class-hero.png",
    timerMinutes: 10,
  });
}
const mockStudents = [
  { id: "s01", name: "김민서", step: "1교시 · 캐릭터 생성", requiredInputs: 3, completedInputs: 3, checklistTotal: 5, checklistDone: 4, lastSeenOffset: 12000, pdfGenerated: false },
  { id: "s02", name: "이도윤", step: "2교시 · 레퍼런스샷", requiredInputs: 4, completedInputs: 3, checklistTotal: 6, checklistDone: 4, lastSeenOffset: 28000, pdfGenerated: false },
  { id: "s03", name: "박서연", step: "3교시 · Flow 장면 생성", requiredInputs: 5, completedInputs: 4, checklistTotal: 8, checklistDone: 6, lastSeenOffset: 73000, pdfGenerated: false },
  { id: "s04", name: "최지우", step: "4교시 · 최종 점검", requiredInputs: 6, completedInputs: 6, checklistTotal: 9, checklistDone: 9, lastSeenOffset: 18000, pdfGenerated: true },
  { id: "s05", name: "정하준", step: "2교시 · 프롬프트 작성", requiredInputs: 4, completedInputs: 2, checklistTotal: 6, checklistDone: 2, lastSeenOffset: 95000, pdfGenerated: false },
];

const dom = {
  shell: document.querySelector(".present-shell"),
  stageTitle: document.querySelector(".stage-topline h1"),
  periodBadge: document.querySelector("#currentPeriodBadge"),
  lessonTitle: document.querySelector("#currentLessonTitle"),
  lessonGoal: document.querySelector("#lessonGoal"),
  stepCounter: document.querySelector("#stepCounter"),
  activityList: document.querySelector("#activityList"),
  studentGuide: document.querySelector("#studentGuide"),
  prompt: document.querySelector("#currentPrompt"),
  copyPromptButton: document.querySelector("#copyPromptButton"),
  sampleTitle: document.querySelector("#sampleTitle"),
  sampleDescription: document.querySelector("#sampleDescription"),
  sampleImage: document.querySelector("#sampleImage"),
  timerDisplay: document.querySelector("#timerDisplay"),
  timerStartButton: document.querySelector("#timerStartButton"),
  timerPauseButton: document.querySelector("#timerPauseButton"),
  timerResetButton: document.querySelector("#timerResetButton"),
  prevStepButton: document.querySelector("#prevStepButton"),
  nextStepButton: document.querySelector("#nextStepButton"),
  fullscreenButton: document.querySelector("#fullscreenButton"),
  presencePanel: document.querySelector("#presencePanel"),
  togglePresenceButton: document.querySelector("#togglePresenceButton"),
  showPresenceButton: document.querySelector("#showPresenceButton"),
  presenceUpdatedAt: document.querySelector("#presenceUpdatedAt"),
  presenceConnectionStatus: document.querySelector("#presenceConnectionStatus"),
  totalStudents: document.querySelector("#totalStudents"),
  onlineStudents: document.querySelector("#onlineStudents"),
  offlineStudents: document.querySelector("#offlineStudents"),
  pdfStudents: document.querySelector("#pdfStudents"),
  studentRows: document.querySelector("#studentStatusRows"),
  filterButtons: [...document.querySelectorAll("[data-presence-filter]")],
};

let currentStepIndex = 0;
let timerRemaining = lessonSteps[0].timerMinutes * 60;
let timerId = null;
let presenceRows = [];
let presenceMode = "mock";
let activePresenceFilter = "all";

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(timestamp));
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function calculateProgress(student) {
  const inputRatio = student.requiredInputs ? student.completedInputs / student.requiredInputs : 0;
  const checklistRatio = student.checklistTotal ? student.checklistDone / student.checklistTotal : 0;
  return Math.round(((inputRatio + checklistRatio) / 2) * 100);
}

function getOnlineState(lastSeenAt) {
  return Date.now() - lastSeenAt <= ONLINE_WINDOW_MS ? "online" : "offline";
}

function loadLocalPresence() {
  const rows = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith("loreaxPresence:")) continue;
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (!value?.lessonId || value.lessonId === activeLessonId) rows.push(value);
    } catch {
      // Ignore malformed mock presence entries.
    }
  }
  return rows;
}

function normalizeStudent(student, now = Date.now()) {
  const lastSeenAt = student.lastSeenAt || student.last_seen_at || now;
  const pdfUrl = student.pdfUrl || student.pdf_url || "";
  return {
    ...student,
    id: student.id || student.studentId || student.deviceId || "local-device",
    name: student.name || student.studentName || student.student_name || "학생 기기",
    number: student.number || student.studentNumber || student.student_number || "",
    className: student.className || student.class_name || "",
    step: student.step || student.currentStep || student.current_step || "학생 화면 활동",
    lastSeenAt: typeof lastSeenAt === "number" ? lastSeenAt : new Date(lastSeenAt).getTime(),
    progress: Math.max(0, Math.min(100, Number(student.progress || 0))),
    pdfGenerated: Boolean(student.pdfGenerated || student.is_pdf_generated),
    pdfUrl,
    pdfStatus: pdfUrl ? "ready" : student.pdfStatus || (student.pdfGenerated || student.is_pdf_generated ? "generated" : "pending"),
  };
}

function getStudents() {
  const now = Date.now();
  const mockRows = mockStudents.map((student) => ({
    ...student,
    lastSeenAt: now - student.lastSeenOffset,
    progress: calculateProgress(student),
  }));

  const localRows = loadLocalPresence().map((student) => ({
    id: student.studentId || "local-device",
    name: student.studentName || "이 기기",
    number: student.studentNumber || "",
    className: student.className || "",
    step: student.currentStep || "학생 화면 활동",
    lastSeenAt: student.lastSeenAt || now,
    progress: student.progress || 0,
    pdfGenerated: Boolean(student.pdfGenerated),
    pdfUrl: student.pdfUrl || "",
  }));

  return [...mockRows, ...localRows].map((student) => normalizeStudent(student, now));
}

function sortStudents(students) {
  return [...students].sort((a, b) => {
    const aOnline = getOnlineState(a.lastSeenAt) === "online" ? 0 : 1;
    const bOnline = getOnlineState(b.lastSeenAt) === "online" ? 0 : 1;
    if (aOnline !== bOnline) return aOnline - bOnline;
    if ((a.progress || 0) !== (b.progress || 0)) return (a.progress || 0) - (b.progress || 0);
    return String(a.name || "").localeCompare(String(b.name || ""), "ko-KR");
  });
}

function filterStudents(students) {
  return students.filter((student) => {
    const state = getOnlineState(student.lastSeenAt);
    if (activePresenceFilter === "online") return state === "online";
    if (activePresenceFilter === "offline") return state === "offline";
    if (activePresenceFilter === "pdf") return student.pdfGenerated || student.pdfUrl;
    return true;
  });
}

function renderConnectionStatus(mode = presenceMode) {
  presenceMode = mode;
  if (!dom.presenceConnectionStatus) return;
  const labelMap = {
    realtime: "실시간 연결",
    polling: "polling 연결",
    supabase: "실시간 연결",
    local: "mock 모드",
    mock: "mock 모드",
  };
  dom.presenceConnectionStatus.textContent = labelMap[mode] || "mock 모드";
  dom.presenceConnectionStatus.dataset.mode = mode;
}

function renderPdfCell(student) {
  const pdfUrl = safeUrl(student.pdfUrl);
  if (pdfUrl) {
    return `
      <div class="pdf-actions">
        <a class="pdf-badge is-ready" href="${pdfUrl}" target="_blank" rel="noreferrer">PDF 보기</a>
        <a class="pdf-download" href="${pdfUrl}" download>다운로드</a>
      </div>
    `;
  }
  if (student.pdfStatus === "uploading") {
    return `<span class="pdf-badge is-pending">업로드 중</span>`;
  }
  if (student.pdfStatus === "failed") {
    return `<span class="pdf-badge is-failed">업로드 실패</span>`;
  }
  if (student.pdfGenerated) {
    return `<span class="pdf-badge is-ready">생성됨</span>`;
  }
  return `<span class="pdf-badge is-pending">미생성</span>`;
}

function renderLessonStep() {
  const step = lessonSteps[currentStepIndex];
  document.title = `${activeLesson.title || "AI 실습형 수업"} | LoreAX Class ERP`;
  if (dom.stageTitle) dom.stageTitle.textContent = activeLesson.title || "AI 실습형 수업";
  dom.periodBadge.textContent = step.period;
  dom.lessonTitle.textContent = step.title;
  dom.lessonGoal.textContent = step.goal;
  dom.stepCounter.textContent = `${currentStepIndex + 1} / ${lessonSteps.length}`;
  dom.studentGuide.textContent = step.guide;
  dom.prompt.textContent = step.prompt;
  dom.sampleTitle.textContent = step.sampleTitle;
  dom.sampleDescription.textContent = step.sampleDescription;
  dom.sampleImage.src = step.sampleImage;
  dom.activityList.innerHTML = step.activities
    .map((activity, index) => `<li class="${index === 0 ? "is-active" : ""}">${activity}</li>`)
    .join("");
  timerRemaining = step.timerMinutes * 60;
  renderTimer();
}

function renderTimer() {
  dom.timerDisplay.textContent = formatTimer(timerRemaining);
}

function startTimer() {
  if (timerId) return;
  timerId = window.setInterval(() => {
    timerRemaining = Math.max(0, timerRemaining - 1);
    renderTimer();
    if (timerRemaining === 0) pauseTimer();
  }, 1000);
}

function pauseTimer() {
  window.clearInterval(timerId);
  timerId = null;
}

function resetTimer() {
  pauseTimer();
  timerRemaining = lessonSteps[currentStepIndex].timerMinutes * 60;
  renderTimer();
}

function renderPresence(studentsSource = presenceRows.length ? presenceRows : getStudents()) {
  const students = sortStudents(studentsSource.map((student) => normalizeStudent(student)));
  const visibleStudents = filterStudents(students);
  const online = students.filter((student) => getOnlineState(student.lastSeenAt) === "online");
  const pdfReady = students.filter((student) => student.pdfGenerated || student.pdfUrl);

  dom.totalStudents.textContent = students.length;
  dom.onlineStudents.textContent = online.length;
  dom.offlineStudents.textContent = students.length - online.length;
  dom.pdfStudents.textContent = pdfReady.length;
  dom.presenceUpdatedAt.textContent = `마지막 갱신: ${formatTime(Date.now())}`;
  renderConnectionStatus();

  dom.studentRows.innerHTML = visibleStudents
    .map((student) => {
      const state = getOnlineState(student.lastSeenAt);
      const progress = Math.max(0, Math.min(100, student.progress ?? calculateProgress(student)));
      return `
        <tr>
          <td>
            <div class="student-name">
              <strong>${escapeHtml(student.name)}</strong>
              <small><span class="student-state is-${state}">${state === "online" ? "online" : "offline"}</span></small>
            </div>
          </td>
          <td>${escapeHtml([student.className, student.number].filter(Boolean).join(" / ") || "-")}</td>
          <td>${escapeHtml(student.step)}</td>
          <td>
            <div class="progress-bar">
              <span><i style="width: ${progress}%"></i></span>
              <strong>${progress}%</strong>
            </div>
          </td>
          <td>${formatTime(student.lastSeenAt)}</td>
          <td>${renderPdfCell(student)}</td>
        </tr>
      `;
    })
    .join("") || `<tr><td colspan="6" class="empty-row">표시할 학생 현황이 없습니다.</td></tr>`;
}

function moveStep(delta) {
  currentStepIndex = Math.max(0, Math.min(lessonSteps.length - 1, currentStepIndex + delta));
  resetTimer();
  renderLessonStep();
}

dom.copyPromptButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(dom.prompt.textContent);
    dom.copyPromptButton.textContent = "복사됨";
    window.setTimeout(() => {
      dom.copyPromptButton.textContent = "복사";
    }, 1400);
  } catch {
    dom.copyPromptButton.textContent = "복사 실패";
  }
});

dom.timerStartButton.addEventListener("click", startTimer);
dom.timerPauseButton.addEventListener("click", pauseTimer);
dom.timerResetButton.addEventListener("click", resetTimer);
dom.prevStepButton.addEventListener("click", () => moveStep(-1));
dom.nextStepButton.addEventListener("click", () => moveStep(1));
dom.fullscreenButton.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    return;
  }
  document.documentElement.requestFullscreen?.();
});

dom.togglePresenceButton.addEventListener("click", () => {
  dom.shell.classList.add("is-presence-collapsed");
  dom.showPresenceButton.hidden = false;
});

dom.showPresenceButton.addEventListener("click", () => {
  dom.shell.classList.remove("is-presence-collapsed");
  dom.showPresenceButton.hidden = true;
});

dom.filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activePresenceFilter = button.dataset.presenceFilter || "all";
    dom.filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderPresence();
  });
});

async function refreshSupabasePresence() {
  if (!window.LoreAXSupabase?.isEnabled?.()) {
    presenceRows = getStudents();
    renderConnectionStatus("mock");
    renderPresence(presenceRows);
    return;
  }
  const result = await window.LoreAXSupabase.fetchPresence({ lessonId: activeLessonId });
  if (result.mode === "supabase") {
    presenceRows = result.students;
    renderConnectionStatus("polling");
  } else {
    presenceRows = getStudents();
    renderConnectionStatus("mock");
  }
  renderPresence(presenceRows);
}

async function startPresenceSync() {
  if (!window.LoreAXSupabase?.isEnabled?.()) {
    presenceRows = getStudents();
    renderConnectionStatus("mock");
    renderPresence(presenceRows);
    window.setInterval(() => {
      presenceRows = getStudents();
      renderPresence(presenceRows);
    }, POLL_INTERVAL_MS);
    return;
  }

  const subscription = await window.LoreAXSupabase.subscribePresence({
    lessonId: activeLessonId,
    onStatus(status) {
      renderConnectionStatus(status);
    },
    onChange(students) {
      presenceRows = students;
      renderPresence(presenceRows);
    },
  });

  if (subscription.mode !== "supabase") {
    await refreshSupabasePresence();
  }

  window.setInterval(refreshSupabasePresence, 10000);
}

renderLessonStep();
startPresenceSync();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../sw.js")
      .catch((error) => console.warn("Service Worker registration failed:", error));
  });
}
