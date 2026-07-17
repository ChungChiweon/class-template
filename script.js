const LESSON_STORAGE_KEY = "selectedLessonId";
const PAGE_SIZE = 12;
const SLIDE_INTERVAL_MS = 4000;
const SLIDE_TRANSITION_MS = 620;
const MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");
const ALLOWED_CATEGORIES = ["전체", "AI 기초", "보고서·탐구", "이미지", "영상", "데이터", "진로", "홍보·마케팅", "기타"];
const ALLOWED_STATUS = ["active", "draft", "hidden"];
const COURSE_DEFAULTS = {
  id: "",
  title: "수업명 미정",
  shortTitle: "수업",
  description: "수업 설명을 준비 중입니다.",
  category: "기타",
  tags: [],
  tools: [],
  lessons: 0,
  duration: "",
  type: "실습형",
  resultType: "결과물 제작",
  thumbnail: "assets/empty/no-report.webp",
  studentUrl: "",
  reportUrl: "",
  featured: false,
  isToday: false,
  createdAt: "",
  sortOrder: 999,
  target: [],
  status: "active",
};

const sourceData = typeof erpData !== "undefined" ? erpData : { todayClassId: "dataAnalysisReport", categories: ALLOWED_CATEGORIES, courses: [] };
const data = {
  ...sourceData,
  categories: Array.isArray(sourceData.categories) && sourceData.categories.length ? sourceData.categories : ALLOWED_CATEGORIES,
  courses: Array.isArray(sourceData.courses) ? sourceData.courses.map(normalizeCourse) : [],
};

let activeCategory = "전체";
let visibleCount = PAGE_SIZE;
let sliderIndex = 0;
let sliderTimer = null;
let sliderPaused = false;

const dom = {
  menuButton: document.querySelector("#menuButton"),
  search: document.querySelector("#courseSearch"),
  sort: document.querySelector("#courseSort"),
  categoryChips: document.querySelector("#categoryChips"),
  todayStartButton: document.querySelector("#todayStartButton"),
  navStartButton: document.querySelector("#navStartButton"),
  navReportLink: document.querySelector("#navReportLink"),
  quickToday: document.querySelector("#quickToday"),
  quickContinue: document.querySelector("#quickContinue"),
  quickReport: document.querySelector("#quickReport"),
  bottomContinueLink: document.querySelector("#bottomContinueLink"),
  todayCourse: document.querySelector("#todayCourse"),
  continueList: document.querySelector("#continueList"),
  featuredCourses: document.querySelector("#featuredCourses"),
  recentCourses: document.querySelector("#recentCourses"),
  allCourseGrid: document.querySelector("#allCourseGrid"),
  loadMoreButton: document.querySelector("#loadMoreButton"),
  emptyMessage: document.querySelector("#emptyMessage"),
  courseCountLabel: document.querySelector("#courseCountLabel"),
  heroSlider: document.querySelector("#heroSlider"),
  sliderStage: document.querySelector("#sliderStage"),
  sliderPrev: document.querySelector("#sliderPrev"),
  sliderNext: document.querySelector("#sliderNext"),
  sliderDots: document.querySelector("#sliderDots"),
};

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string" && value.trim()) return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function toBoolean(value) {
  return value === true || value === "true";
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeCourse(course = {}) {
  const normalized = { ...COURSE_DEFAULTS, ...course };
  normalized.id = String(normalized.id || "").trim();
  normalized.title = String(normalized.title || COURSE_DEFAULTS.title).trim();
  normalized.shortTitle = String(normalized.shortTitle || normalized.title || COURSE_DEFAULTS.shortTitle).trim();
  normalized.description = String(normalized.description || COURSE_DEFAULTS.description).trim();
  normalized.category = ALLOWED_CATEGORIES.includes(normalized.category) ? normalized.category : "기타";
  normalized.tags = toArray(normalized.tags);
  normalized.tools = toArray(normalized.tools);
  normalized.lessons = toNumber(normalized.lessons, 0);
  normalized.duration = String(normalized.duration || (normalized.lessons ? `${normalized.lessons}차시` : "")).trim();
  normalized.type = String(normalized.type || COURSE_DEFAULTS.type).trim();
  normalized.resultType = String(normalized.resultType || normalized.result || COURSE_DEFAULTS.resultType).trim();
  normalized.thumbnail = String(normalized.thumbnail || COURSE_DEFAULTS.thumbnail).trim();
  normalized.studentUrl = String(normalized.studentUrl || "").trim();
  normalized.reportUrl = String(normalized.reportUrl || "").trim();
  normalized.featured = toBoolean(normalized.featured);
  normalized.isToday = toBoolean(normalized.isToday);
  normalized.createdAt = String(normalized.createdAt || "").trim();
  normalized.sortOrder = toNumber(normalized.sortOrder, 999);
  normalized.target = toArray(normalized.target);
  normalized.status = ALLOWED_STATUS.includes(normalized.status) ? normalized.status : "active";
  return normalized;
}

function getActiveCourses() {
  return data.courses.filter((course) => course.status === "active");
}

function getFeaturedCourses() {
  return getActiveCourses().filter((course) => course.featured);
}

function getTodayCourse() {
  const todayCourses = getActiveCourses().filter((course) => course.isToday);
  if (todayCourses.length) return [...todayCourses].sort((a, b) => a.sortOrder - b.sortOrder)[0];
  return getActiveCourses().find((course) => course.id === data.todayClassId) || getActiveCourses()[0];
}

function getCoursesByCategory(category) {
  const base = getActiveCourses();
  if (!category || category === "전체") return base;
  return base.filter((course) => course.category === category);
}

function courseText(course) {
  return [course.title, course.shortTitle, course.description, course.category, course.type, course.resultType, ...(course.tags || []), ...(course.tools || []), ...(course.target || [])]
    .join(" ")
    .toLowerCase();
}

function searchCourses(query) {
  const keyword = String(query || "").trim().toLowerCase();
  const base = getCoursesByCategory(activeCategory);
  return keyword ? base.filter((course) => courseText(course).includes(keyword)) : base;
}

function sortCourses(coursesToSort, mode = "recommended") {
  return [...coursesToSort].sort((a, b) => {
    if (mode === "newest") return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    if (mode === "name") return String(a.title || "").localeCompare(String(b.title || ""), "ko");
    if (mode === "short") return Number(a.lessons || 99) - Number(b.lessons || 99);
    return Number(a.sortOrder || 999) - Number(b.sortOrder || 999);
  });
}

function courses() {
  return getActiveCourses();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function saveLessonId(id) {
  try {
    if (id) localStorage.setItem(LESSON_STORAGE_KEY, id);
  } catch {}
}

function readJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function progressForCourse(course) {
  if (!course) return null;
  if (course.id === "dataAnalysisReport") {
    const report = readJson("loreaxReport:dataAnalysisReport");
    const generated = report?.report?.generated || {};
    const done = ["period1", "period2", "period3", "period4"].filter((key) => {
      const value = generated[key];
      return value && JSON.stringify(value).length > 80;
    }).length;
    if (report?.metadata?.updatedAt || done) {
      return { label: `${done} / 4 차시 기록`, percent: Math.max(10, Math.round((done / 4) * 100)), updatedAt: report?.metadata?.updatedAt || "" };
    }
  }
  const progress = readJson(`lessonProgress:${course.id}`);
  if (progress && Object.keys(progress).length) return { label: `${Object.keys(progress).length}개 활동 기록`, percent: 35, updatedAt: "" };
  return null;
}

function continueCourses() {
  return courses()
    .map((course) => ({ course, progress: progressForCourse(course) }))
    .filter((item) => item.progress)
    .slice(0, 3);
}

function sliderCourses() {
  const featured = getFeaturedCourses();
  const base = featured.length ? featured : sortCourses(courses(), "recommended");
  return base.slice(0, 5);
}

function filteredCourses() {
  return sortCourses(searchCourses(dom.search?.value || ""), dom.sort?.value || "recommended");
}

function setLink(anchor, course, fallbackUrl) {
  if (!anchor) return;
  anchor.href = `./${course?.studentUrl || fallbackUrl || ""}`;
  if (course?.id) anchor.dataset.lessonId = course.id;
}

function imageUrl(course) {
  return `./${course?.thumbnail || COURSE_DEFAULTS.thumbnail}`;
}

function normalizeDuration(course) {
  const raw = course?.duration || course?.lessons || "";
  const value = String(raw).trim();
  if (!value) return { label: "차시 정보", title: "차시 정보" };
  const match = value.match(/\d+/);
  if (match) return { label: `${match[0]}차시`, title: value };
  return { label: value.replace(/\s+/g, ""), title: value };
}

function normalizeCourseType(course) {
  const raw = String(course?.type || course?.courseType || "").trim();
  const map = {
    "프로젝트 기반 실습형": "프로젝트형",
    "AI 활용 실습형": "실습형",
    "이론 및 실습": "이론·실습",
  };
  const label = map[raw] || raw || "실습형";
  return { label, title: raw || label };
}

function compactResultType(course) {
  const raw = String(course?.resultType || course?.result || "").trim();
  if (!raw) return { label: "결과물 제작", title: "결과물 제작" };
  const exact = new Map([
    ["주제탐구보고서 PDF", "보고서 PDF"],
    ["AI 데이터 분석 기반 주제탐구보고서 PDF", "보고서 PDF"],
    ["30~60초 AI 홍보영상", "AI 홍보영상"],
    ["30~40초 홍보영상", "AI 홍보영상"],
    ["카드뉴스 이미지 세트", "카드뉴스"],
    ["홍보용 뉴스카드 세트", "뉴스카드"],
    ["진로탐구 결과물", "진로탐구"],
    ["생기부·세특 정리 자료", "세특 자료"],
    ["개인 금융 계획서", "금융 계획서"],
    ["이모티콘 콘셉트 세트", "이모티콘"],
    ["AI 음악 및 CM송 결과물", "AI 음악"],
    ["데이터 시각화 결과물", "데이터 시각화"],
  ]);
  let label = exact.get(raw);
  if (!label) {
    if (raw.includes("보고서") && raw.includes("PDF")) label = "보고서 PDF";
    else if (raw.includes("홍보영상")) label = "AI 홍보영상";
    else if (raw.includes("카드뉴스")) label = "카드뉴스";
    else if (raw.includes("뉴스카드")) label = "뉴스카드";
    else if (raw.includes("이모티콘")) label = "이모티콘";
    else if (raw.includes("진로탐구")) label = "진로탐구";
    else if (raw.includes("데이터") && raw.includes("시각화")) label = "데이터 시각화";
    else label = raw;
  }
  return { label, title: raw };
}

function sliderMetaItems(course) {
  const items = [normalizeDuration(course), normalizeCourseType(course), compactResultType(course)];
  return items.map((item, index) => {
    const fallback = ["차시 정보", "실습형", "결과물 제작"][index];
    return {
      label: item.label || fallback,
      title: item.title || item.label || fallback,
      className: ["slider-meta-duration", "slider-meta-type", "slider-meta-result"][index],
    };
  });
}

function renderCategories() {
  const categories = Array.isArray(data.categories) ? data.categories : ALLOWED_CATEGORIES;
  if (!dom.categoryChips) return;
  dom.categoryChips.innerHTML = categories
    .map((category) => `<button class="${category === activeCategory ? "is-active" : ""}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`)
    .join("");
}

function progressHtml(progress) {
  if (!progress) return `<div class="progress-row"><span>진행률</span><strong>새 수업</strong></div>`;
  return `<div class="progress-row"><span>${escapeHtml(progress.label)}</span><strong>${progress.percent}%</strong></div><div class="progress-bar"><span style="width:${Math.min(100, progress.percent)}%"></span></div>`;
}

function courseCard(course, mode = "default") {
  const progress = progressForCourse(course);
  const tools = (course.tools || []).slice(0, 3).join(", ");
  const classes = mode === "mini" ? "course-card is-mini" : "course-card";
  const action = course.studentUrl
    ? `<a class="primary-button course-action" href="./${escapeHtml(course.studentUrl)}" data-lesson-id="${escapeHtml(course.id || "")}">${progress ? "이어서 하기" : "수업 시작"}</a>`
    : `<span class="primary-button course-action is-disabled-action" aria-disabled="true">준비 중</span>`;
  return `<article class="${classes}"><img src="${imageUrl(course)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='./assets/empty/no-report.webp';" /><div class="course-body"><span class="category-badge">${escapeHtml(course.category)}</span><h3>${escapeHtml(course.title)}</h3><p>${escapeHtml(course.description)}</p><dl><div><dt>차시</dt><dd>${escapeHtml(course.duration || `${course.lessons || "-"}차시`)}</dd></div><div><dt>도구</dt><dd>${escapeHtml(tools || "수업 도구")}</dd></div><div><dt>결과물</dt><dd>${escapeHtml(course.resultType)}</dd></div></dl>${progressHtml(progress)}${action}</div></article>`;
}

function sliderMarkup(course) {
  const action = course.studentUrl
    ? `<a class="primary-button slider-action" href="./${escapeHtml(course.studentUrl)}" data-lesson-id="${escapeHtml(course.id || "")}">수업 보기</a>`
    : `<span class="primary-button slider-action is-disabled-action" aria-disabled="true">준비 중</span>`;
  const meta = sliderMetaItems(course)
    .map((item) => `<span class="slider-meta-item ${item.className}" title="${escapeHtml(item.title)}">${escapeHtml(item.label)}</span>`)
    .join("");
  return `<article class="slider-card"><div class="slider-image-wrap"><img src="${imageUrl(course)}" alt="${escapeHtml(course.title)}" onerror="this.onerror=null;this.src='./assets/empty/no-report.webp';" /></div><div class="slider-info"><span class="category-badge">${escapeHtml(course.category)}</span><h2>${escapeHtml(course.title)}</h2><p>${escapeHtml(course.description)}</p><div class="slider-meta" aria-label="수업 핵심 정보">${meta}</div>${action}</div></article>`;
}

function renderSlider(nextIndex = sliderIndex, direction = 1) {
  const slides = sliderCourses();
  if (!dom.sliderStage || !slides.length) return;
  sliderIndex = (nextIndex + slides.length) % slides.length;
  const card = document.createElement("div");
  card.className = `slider-card-frame is-entering ${direction < 0 ? "from-left" : "from-right"}`;
  card.innerHTML = sliderMarkup(slides[sliderIndex]);
  const previous = dom.sliderStage.querySelector(".slider-card-frame");
  dom.sliderStage.appendChild(card);
  requestAnimationFrame(() => card.classList.remove("is-entering"));
  if (previous) {
    previous.classList.add(direction < 0 ? "is-leaving-right" : "is-leaving-left");
    window.setTimeout(() => previous.remove(), SLIDE_TRANSITION_MS);
  }
  renderSliderControls(slides);
}

function renderSliderControls(slides) {
  const single = slides.length <= 1;
  [dom.sliderPrev, dom.sliderNext, dom.sliderDots].forEach((el) => {
    if (el) el.hidden = single;
  });
  if (!dom.sliderDots || single) return;
  dom.sliderDots.innerHTML = slides
    .map((course, index) => `<button class="${index === sliderIndex ? "is-active" : ""}" type="button" data-slide-index="${index}" aria-label="${escapeHtml(course.shortTitle || course.title)} 보기"></button>`)
    .join("");
}

function stopSlider() {
  if (sliderTimer) window.clearInterval(sliderTimer);
  sliderTimer = null;
}

function startSlider() {
  stopSlider();
  const slides = sliderCourses();
  if (slides.length <= 1 || MOTION_QUERY.matches || sliderPaused || document.hidden) return;
  sliderTimer = window.setInterval(() => renderSlider(sliderIndex + 1, 1), SLIDE_INTERVAL_MS);
}

function pauseSlider() {
  sliderPaused = true;
  stopSlider();
}

function resumeSlider() {
  sliderPaused = false;
  startSlider();
}

function initSlider() {
  renderSlider(0, 1);
  startSlider();
  dom.sliderPrev?.addEventListener("click", () => {
    pauseSlider();
    renderSlider(sliderIndex - 1, -1);
  });
  dom.sliderNext?.addEventListener("click", () => {
    pauseSlider();
    renderSlider(sliderIndex + 1, 1);
  });
  dom.sliderDots?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-slide-index]");
    if (!button) return;
    pauseSlider();
    renderSlider(Number(button.dataset.slideIndex), Number(button.dataset.slideIndex) > sliderIndex ? 1 : -1);
  });
  dom.heroSlider?.addEventListener("mouseenter", pauseSlider);
  dom.heroSlider?.addEventListener("mouseleave", resumeSlider);
  dom.heroSlider?.addEventListener("focusin", pauseSlider);
  dom.heroSlider?.addEventListener("focusout", resumeSlider);
  dom.heroSlider?.addEventListener("touchstart", pauseSlider, { passive: true });
  dom.heroSlider?.addEventListener("touchend", () => window.setTimeout(resumeSlider, 1200), { passive: true });
  dom.heroSlider?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      pauseSlider();
      renderSlider(sliderIndex - 1, -1);
    }
    if (event.key === "ArrowRight") {
      pauseSlider();
      renderSlider(sliderIndex + 1, 1);
    }
  });
  document.addEventListener("visibilitychange", () => (document.hidden ? stopSlider() : startSlider()));
  MOTION_QUERY.addEventListener?.("change", startSlider);
}

function renderToday() {
  const today = getTodayCourse();
  if (!today) return;
  setLink(dom.todayStartButton, today);
  setLink(dom.navStartButton, today);
  setLink(dom.quickToday, today);
  if (dom.navReportLink && today.reportUrl) dom.navReportLink.href = `./${today.reportUrl}`;
  if (dom.quickReport && today.reportUrl) dom.quickReport.href = `./${today.reportUrl}`;
  if (dom.todayCourse) dom.todayCourse.innerHTML = courseCard(today, "mini");
}

function renderContinue() {
  const items = continueCourses();
  const target = items[0]?.course;
  if (target) {
    dom.quickContinue?.classList.remove("is-disabled");
    setLink(dom.quickContinue, target);
    setLink(dom.bottomContinueLink, target);
  } else if (dom.quickContinue) {
    dom.quickContinue.classList.add("is-disabled");
    dom.quickContinue.href = "#";
    if (dom.bottomContinueLink) dom.bottomContinueLink.href = "./sessions/topic-research-report/";
  }
  if (!dom.continueList) return;
  if (!items.length) {
    dom.continueList.innerHTML = `<p class="empty-note">아직 저장된 진행 기록이 없습니다. 오늘의 수업을 시작하면 이어서 하기가 표시됩니다.</p>`;
    return;
  }
  dom.continueList.innerHTML = items
    .map(({ course, progress }) => `<a class="continue-item" href="./${escapeHtml(course.studentUrl)}" data-lesson-id="${escapeHtml(course.id)}"><strong>${escapeHtml(course.shortTitle || course.title)}</strong><span>${escapeHtml(progress.label)}</span><em>${progress.percent}%</em></a>`)
    .join("");
}

function renderMainLists() {
  const list = courses();
  if (dom.featuredCourses) dom.featuredCourses.innerHTML = getFeaturedCourses().slice(0, 4).map((course) => courseCard(course, "mini")).join("");
  if (dom.recentCourses) dom.recentCourses.innerHTML = sortCourses(list, "newest").slice(0, 6).map((course) => courseCard(course, "mini")).join("");
  if (dom.courseCountLabel) dom.courseCountLabel.textContent = `${list.length}수업`;
}

function renderAllCourses() {
  const list = filteredCourses();
  const visible = list.slice(0, visibleCount);
  if (dom.allCourseGrid) dom.allCourseGrid.innerHTML = visible.map((course) => courseCard(course)).join("");
  if (dom.emptyMessage) dom.emptyMessage.hidden = Boolean(list.length);
  if (dom.loadMoreButton) {
    dom.loadMoreButton.hidden = visibleCount >= list.length;
    dom.loadMoreButton.textContent = `더 보기 (${visible.length} / ${list.length})`;
  }
}

function renderAll() {
  renderCategories();
  renderToday();
  renderContinue();
  renderMainLists();
  renderAllCourses();
}

dom.menuButton?.addEventListener("click", () => {
  const open = document.body.classList.toggle("is-menu-open");
  dom.menuButton.setAttribute("aria-expanded", String(open));
});

dom.categoryChips?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category || "전체";
  visibleCount = PAGE_SIZE;
  renderCategories();
  renderAllCourses();
});

dom.search?.addEventListener("input", () => {
  visibleCount = PAGE_SIZE;
  renderAllCourses();
});

dom.sort?.addEventListener("change", () => {
  visibleCount = PAGE_SIZE;
  renderAllCourses();
});

dom.loadMoreButton?.addEventListener("click", () => {
  visibleCount += PAGE_SIZE;
  renderAllCourses();
});

document.addEventListener("click", (event) => {
  const link = event.target.closest?.("[data-lesson-id]");
  if (link) saveLessonId(link.dataset.lessonId);
  if (event.target.closest?.(".main-nav a")) {
    document.body.classList.remove("is-menu-open");
    dom.menuButton?.setAttribute("aria-expanded", "false");
  }
});

renderAll();
initSlider();

window.LoreAXCoursePortal = {
  renderAll,
  filteredCourses,
  normalizeCourse,
  getActiveCourses,
  getFeaturedCourses,
  getTodayCourse,
  getCoursesByCategory,
  searchCourses,
  sortCourses,
  setActiveCategory(category) {
    activeCategory = category || "전체";
    visibleCount = PAGE_SIZE;
    renderAll();
  },
};

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
