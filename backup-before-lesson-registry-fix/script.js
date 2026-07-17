const LESSON_STORAGE_KEY = "selectedLessonId";
const MODE_STORAGE_KEY = "aiClassTemplateMode";
const DEFAULT_SESSION_URL = "sessions/ai-practice/index.html";

const fallbackErpData = {
  instructor: {
    name: "강사",
    modeLabel: "강사 모드",
    systemName: "LoreAX Class ERP",
  },
  todayClass: {
    courseId: "ai-video",
    sessionId: "hotel-promo",
    courseTitle: "AI 영상 제작 실습",
    sessionTitle: "AI 호텔 홍보영상 제작",
    moduleType: "AI 실습형 수업",
    status: "준비 완료",
    duration: "4교시",
    recommendedScenes: "4장면",
    finalOutput: "30~40초 호텔 홍보영상",
    thumbnail: "assets/hotel-ai-video-class-hero.png",
    launchUrl: DEFAULT_SESSION_URL,
  },
  dashboardCards: [],
  courses: [],
};

const rootData = typeof erpData !== "undefined" ? erpData : fallbackErpData;
const sessionLessonIdMap = {
  "hotel-promo": "hotelPromo",
  "tourism-promo": "tourismPromo",
  "product-ad": "productAd",
  dataAnalysisReport: "dataAnalysisReport",
};
const lessonSessionIdMap = Object.fromEntries(
  Object.entries(sessionLessonIdMap).map(([sessionId, lessonId]) => [lessonId, sessionId])
);

let currentSessionId = getStoredSessionId();
let currentMode = getStoredMode();

const dom = {
  brandLabel: document.querySelector("#brandLabel"),
  sidebarModeLabel: document.querySelector("#sidebarModeLabel"),
  lessonSelect: document.querySelector("#lessonSelect"),
  modeButtons: document.querySelectorAll("button[data-mode]"),
  heroSystemTitle: document.querySelector("#heroSystemTitle"),
  heroModuleType: document.querySelector("#heroModuleType"),
  heroBackgroundImage: document.querySelector("#heroBackgroundImage"),
  heroCardThumbnail: document.querySelector("#heroCardThumbnail"),
  heroModuleTitle: document.querySelector("#heroModuleTitle"),
  heroStatus: document.querySelector("#heroStatus"),
  heroRecommendedScenes: document.querySelector("#heroRecommendedScenes"),
  heroDuration: document.querySelector("#heroDuration"),
  heroFinalOutput: document.querySelector("#heroFinalOutput"),
  heroLaunchButton: document.querySelector("#heroLaunchButton"),
  heroCardLaunchButton: document.querySelector("#heroCardLaunchButton"),
  chipDuration: document.querySelector("#chipDuration"),
  courseCards: document.querySelector("#courseCards"),
  moduleCourseTitle: document.querySelector("#moduleCourseTitle"),
  moduleLessonTitle: document.querySelector("#moduleLessonTitle"),
  moduleType: document.querySelector("#moduleType"),
  moduleDuration: document.querySelector("#moduleDuration"),
  moduleFinalOutput: document.querySelector("#moduleFinalOutput"),
  moduleLaunchButton: document.querySelector("#moduleLaunchButton"),
  recentLessonTitle: document.querySelector("#recentLessonTitle"),
  recentLaunchPath: document.querySelector("#recentLaunchPath"),
  courseListContainer: document.querySelector("#courseListContainer"),
};

function safeText(value, fallback = "준비 중") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getAllSessions() {
  const courses = Array.isArray(rootData.courses) ? rootData.courses : [];
  return courses.flatMap((course) =>
    (Array.isArray(course.sessions) ? course.sessions : []).map((session) => ({
      ...session,
      courseId: session.courseId || course.courseId,
      courseTitle: session.courseTitle || course.courseTitle,
      courseDescription: course.description || "",
    }))
  );
}

function getTodayClass() {
  return rootData.todayClass || fallbackErpData.todayClass;
}

function toLessonStorageId(sessionId) {
  return sessionLessonIdMap[sessionId] || sessionId || "hotelPromo";
}

function toSessionId(lessonId) {
  return lessonSessionIdMap[lessonId] || lessonId || getTodayClass().sessionId || "hotel-promo";
}

function getStoredSessionId() {
  const sessions = getAllSessions();
  const todaySessionId = getTodayClass().sessionId || "hotel-promo";

  try {
    const storedLessonId = window.localStorage.getItem(LESSON_STORAGE_KEY);
    const storedSessionId = toSessionId(storedLessonId);
    return sessions.some((session) => session.sessionId === storedSessionId) ? storedSessionId : todaySessionId;
  } catch {
    return todaySessionId;
  }
}

function saveSessionId(sessionId) {
  try {
    window.localStorage.setItem(LESSON_STORAGE_KEY, toLessonStorageId(sessionId));
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
}

function getStoredMode() {
  try {
    const storedMode = window.localStorage.getItem(MODE_STORAGE_KEY);
    return storedMode === "teacher" ? "teacher" : "student";
  } catch {
    return "student";
  }
}

function saveMode(mode) {
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, mode);
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
}

function getSelectedSession() {
  const sessions = getAllSessions();
  const selected = sessions.find((session) => session.sessionId === currentSessionId);
  const today = getTodayClass();
  return selected || {
    ...today,
    type: today.moduleType,
  };
}

function isReady(item) {
  const status = safeText(item?.status, "");
  return status.includes("준비 완료") || status.includes("실행 가능") || status.includes("以鍮??꾨즺") || status.includes("?ㅽ뻾 媛??");
}

function getLaunchUrl(item) {
  const rawUrl = safeText(item?.launchUrl || item?.url, DEFAULT_SESSION_URL);
  const lessonId = item?.lessonId || toLessonStorageId(item?.sessionId);
  if (!lessonId || rawUrl.includes("lesson=") || !rawUrl.includes("sessions/ai-practice")) return rawUrl;
  const separator = rawUrl.includes("?") ? "&" : "?";
  return `${rawUrl}${separator}lesson=${encodeURIComponent(lessonId)}`;
}

function statusClass(item) {
  return isReady(item) ? "is-ready" : "is-muted";
}

function renderInstructor() {
  const instructor = rootData.instructor || fallbackErpData.instructor;
  const systemName = safeText(instructor.systemName, "LoreAX Class ERP");
  document.title = systemName;
  if (dom.brandLabel) dom.brandLabel.textContent = systemName;
  if (dom.heroSystemTitle) dom.heroSystemTitle.textContent = systemName;
  if (dom.sidebarModeLabel) dom.sidebarModeLabel.textContent = safeText(instructor.modeLabel, "강사 모드");
}

function renderLessonSelector() {
  const sessions = getAllSessions();
  if (!dom.lessonSelect) return;

  if (!sessions.length) {
    dom.lessonSelect.innerHTML = `<option value="${escapeHtml(getTodayClass().sessionId)}">${escapeHtml(getTodayClass().sessionTitle)}</option>`;
    currentSessionId = getTodayClass().sessionId;
    return;
  }

  dom.lessonSelect.innerHTML = sessions
    .map((session) => `<option value="${escapeHtml(session.sessionId)}">${escapeHtml(session.sessionTitle)}</option>`)
    .join("");

  if (!sessions.some((session) => session.sessionId === currentSessionId)) {
    currentSessionId = sessions[0].sessionId;
  }
  dom.lessonSelect.value = currentSessionId;
}

function setImageSource(image, path) {
  if (!image) return;
  if (!path) {
    image.hidden = true;
    image.removeAttribute("src");
    return;
  }
  image.hidden = false;
  image.src = path.startsWith("./") || path.startsWith("/") ? path : `./${path}`;
}

function setButtonLink(anchor, url, label) {
  if (!anchor) return;
  const hasUrl = Boolean(url);
  anchor.textContent = label;
  anchor.href = hasUrl ? url : "#";
  anchor.classList.toggle("is-disabled", !hasUrl);
  anchor.setAttribute("aria-disabled", hasUrl ? "false" : "true");
}

function renderHeroAndModule() {
  const today = getTodayClass();
  const selected = getSelectedSession();
  const thumbnail = safeText(today.thumbnail, "");
  const launchUrl = getLaunchUrl(selected);
  const moduleType = safeText(selected.type || selected.moduleType || today.moduleType, "AI 실습형 수업");

  if (dom.heroModuleType) dom.heroModuleType.textContent = `현재 실행 모듈: ${moduleType} 운영 모듈`;
  setImageSource(dom.heroBackgroundImage, thumbnail);
  setImageSource(dom.heroCardThumbnail, thumbnail);
  if (dom.heroModuleTitle) dom.heroModuleTitle.textContent = safeText(selected.sessionTitle || today.sessionTitle, "AI 실습형 수업");
  if (dom.heroStatus) {
    dom.heroStatus.textContent = safeText(selected.status || today.status, "준비 중");
    dom.heroStatus.className = `status-pill ${statusClass(selected)}`;
  }
  if (dom.heroRecommendedScenes) dom.heroRecommendedScenes.textContent = safeText(today.recommendedScenes, "4장면");
  if (dom.heroDuration) dom.heroDuration.textContent = safeText(selected.duration || today.duration, "4교시");
  if (dom.heroFinalOutput) dom.heroFinalOutput.textContent = safeText(selected.finalOutput || today.finalOutput, "결과물 준비 중");
  if (dom.chipDuration) dom.chipDuration.textContent = safeText(selected.duration || today.duration, "4교시");
  setButtonLink(dom.heroLaunchButton, launchUrl, "AI 실습형 수업 실행하기");
  setButtonLink(dom.heroCardLaunchButton, launchUrl, "현재 수업 실행하기");

  if (dom.moduleCourseTitle) dom.moduleCourseTitle.textContent = safeText(selected.courseTitle || today.courseTitle, "AI 영상 제작 실습");
  if (dom.moduleLessonTitle) dom.moduleLessonTitle.textContent = safeText(selected.sessionTitle || today.sessionTitle, "AI 실습형 수업");
  if (dom.moduleType) dom.moduleType.textContent = moduleType;
  if (dom.moduleDuration) dom.moduleDuration.textContent = safeText(selected.duration || today.duration, "4교시");
  if (dom.moduleFinalOutput) dom.moduleFinalOutput.textContent = safeText(selected.finalOutput || today.finalOutput, "결과물 준비 중");
  setButtonLink(dom.moduleLaunchButton, launchUrl, "현재 수업 실행하기");

  if (dom.recentLessonTitle) dom.recentLessonTitle.textContent = safeText(selected.sessionTitle || today.sessionTitle, "AI 실습형 수업");
  if (dom.recentLaunchPath) dom.recentLaunchPath.textContent = launchUrl;
}

function renderDashboardCards() {
  if (!dom.courseCards) return;
  const cards = Array.isArray(rootData.dashboardCards) && rootData.dashboardCards.length
    ? rootData.dashboardCards
    : fallbackErpData.dashboardCards;

  dom.courseCards.innerHTML = cards
    .map((card, index) => {
      const ready = isReady(card);
      const icon = ["▣", "□", "▤", "◇"][index] || "□";
      const action = ready && card.url
        ? `<a class="primary-action" href="${escapeHtml(card.url)}">${escapeHtml(safeText(card.buttonLabel, "열기"))}</a>`
        : `<button class="secondary-dashboard-button" type="button" disabled>${escapeHtml(safeText(card.buttonLabel, "준비 중"))}</button>`;

      return `
        <article class="erp-main-card ${index === 0 ? "is-primary" : ""}">
          <span class="erp-card-icon">${icon}</span>
          <h2>${escapeHtml(safeText(card.title, "ERP 카드"))}</h2>
          <p>${escapeHtml(safeText(card.description, "정보를 준비 중입니다."))}</p>
          <span class="status-pill ${statusClass(card)}">${escapeHtml(safeText(card.status, "준비 중"))}</span>
          ${action}
        </article>
      `;
    })
    .join("");
}

function renderCourseList() {
  if (!dom.courseListContainer) return;
  const courses = Array.isArray(rootData.courses) ? rootData.courses : [];

  if (!courses.length) {
    dom.courseListContainer.innerHTML = `<article class="course-panel"><h3>과목 데이터가 없습니다.</h3><p>data-courses.js에 과목과 차시 정보를 추가하세요.</p></article>`;
    return;
  }

  dom.courseListContainer.innerHTML = courses
    .map((course) => {
      const sessions = Array.isArray(course.sessions) ? course.sessions : [];
      const sessionRows = sessions.length
        ? sessions
            .map((session) => {
              const ready = isReady(session);
              const launchUrl = getLaunchUrl(session);
              const action = ready
                ? `<a class="session-action primary-action" href="${escapeHtml(launchUrl)}">실행하기</a>`
                : `<button class="session-action secondary-dashboard-button" type="button" disabled>준비 중</button>`;

              return `
                <li class="session-row">
                  <div>
                    <strong>${escapeHtml(safeText(session.sessionTitle, "차시명 미정"))}</strong>
                    <div class="session-meta">
                      <span>${escapeHtml(safeText(session.type, "수업 유형 미정"))}</span>
                      <span>${escapeHtml(safeText(session.duration, "시간 미정"))}</span>
                      <span>${escapeHtml(safeText(session.finalOutput, "산출물 미정"))}</span>
                    </div>
                  </div>
                  <span class="status-pill ${statusClass(session)}">${escapeHtml(safeText(session.status, "준비 중"))}</span>
                  ${action}
                </li>
              `;
            })
            .join("")
        : `<li class="session-row"><div><strong>등록된 차시가 없습니다.</strong></div></li>`;

      return `
        <article class="course-panel">
          <div class="course-panel-head">
            <div>
              <p class="eyebrow">Course</p>
              <h3>${escapeHtml(safeText(course.courseTitle, "과목명 미정"))}</h3>
              <p>${escapeHtml(safeText(course.description, "과목 설명을 준비 중입니다."))}</p>
            </div>
          </div>
          <ul class="session-list">${sessionRows}</ul>
        </article>
      `;
    })
    .join("");
}

function renderMode() {
  document.body.dataset.mode = currentMode;
  dom.modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === currentMode);
  });
}

function initDashboard() {
  renderInstructor();
  renderLessonSelector();
  renderHeroAndModule();
  renderDashboardCards();
  renderCourseList();
  renderMode();

  dom.lessonSelect?.addEventListener("change", () => {
    currentSessionId = dom.lessonSelect.value || getTodayClass().sessionId;
    saveSessionId(currentSessionId);
    renderHeroAndModule();
  });

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href*='sessions/ai-practice']");
    if (!link) return;
    try {
      const url = new URL(link.getAttribute("href"), window.location.href);
      const lessonId = url.searchParams.get("lesson");
      if (lessonId) window.localStorage.setItem(LESSON_STORAGE_KEY, lessonId);
    } catch {
      // Navigation should continue even when URL parsing or localStorage fails.
    }
  });

  dom.modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentMode = button.dataset.mode === "teacher" ? "teacher" : "student";
      saveMode(currentMode);
      renderMode();
    });
  });
}

initDashboard();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => console.log("Service Worker registered"))
      .catch((error) => console.warn("Service Worker registration failed:", error));
  });
}
