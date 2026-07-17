const REPORT_STORAGE_PREFIX = "loreaxReport:";
const LESSON_STORAGE_KEY = "selectedLessonId";
const PRESENCE_STORAGE_PREFIX = "loreaxPresence:";
const PRESENCE_DEVICE_KEY = "loreaxPresenceDeviceId";

const LOREAX_CONTACT = {
  kakaoChannelUrl: "",
  kakaoChannelName: "LoreAX 수업지원",
  inquiryUrl: "",
  qrImageUrl: "",
};

const dom = {
  summaryStudentName: document.querySelector("#summaryStudentName"),
  summaryReportTitle: document.querySelector("#summaryReportTitle"),
  summaryProgress: document.querySelector("#summaryProgress"),
  summaryUpdatedAt: document.querySelector("#summaryUpdatedAt"),
  missingList: document.querySelector("#missingList"),
  reportPreview: document.querySelector("#reportPreview"),
  refreshPreviewButton: document.querySelector("#refreshPreviewButton"),
  generatePdfButton: document.querySelector("#generatePdfButton"),
  downloadPdfButton: document.querySelector("#downloadPdfButton"),
  completeDownloadButton: document.querySelector("#completeDownloadButton"),
  parentViewButton: document.querySelector("#parentViewButton"),
  completeParentViewButton: document.querySelector("#completeParentViewButton"),
  pdfCompletePanel: document.querySelector("#pdfCompletePanel"),
  inquiryButton: document.querySelector("#inquiryButton"),
};

function createDefaultReportData() {
  const now = new Date().toISOString();
  return {
    student: {
      name: "",
      studentNumber: "",
      className: "",
    },
    report: {
      title: "",
      researchQuestion: "",
      independentVariable: "",
      dependentVariable: "",
      researchScope: "",
      introduction: {
        background: "",
        purpose: "",
        necessity: "",
      },
      methodology: {
        dataSource: "",
        collectionMethod: "",
        analysisMethod: "",
      },
      results: {
        summary: "",
        chartTitle: "",
        xAxisDescription: "",
        yAxisDescription: "",
        interpretation: "",
      },
      conclusion: {
        answer: "",
        limitations: "",
        futureResearch: "",
      },
      references: [],
      aiUsageLogs: [],
      peerFeedback: "",
      feedbackReflection: "",
    },
    chartImage: null,
    metadata: {
      createdAt: now,
      updatedAt: now,
      pdfGenerated: false,
      pdfGeneratedAt: "",
    },
  };
}

function getCurrentLessonId() {
  try {
    const queryLessonId = new URLSearchParams(window.location.search).get("lesson");
    if (queryLessonId) {
      window.localStorage.setItem(LESSON_STORAGE_KEY, queryLessonId);
      return queryLessonId;
    }
    return window.localStorage.getItem(LESSON_STORAGE_KEY) || "hotelPromo";
  } catch {
    return "hotelPromo";
  }
}

function getReportStorageKey() {
  return `${REPORT_STORAGE_PREFIX}${getCurrentLessonId()}`;
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/\n+/).map((item) => item.trim()).filter(Boolean);
  return [];
}

function normalizeReportData(data) {
  const base = createDefaultReportData();
  return {
    ...base,
    ...(data || {}),
    student: { ...base.student, ...(data?.student || {}) },
    report: {
      ...base.report,
      ...(data?.report || {}),
      introduction: { ...base.report.introduction, ...(data?.report?.introduction || {}) },
      methodology: { ...base.report.methodology, ...(data?.report?.methodology || {}) },
      results: { ...base.report.results, ...(data?.report?.results || {}) },
      conclusion: { ...base.report.conclusion, ...(data?.report?.conclusion || {}) },
      references: normalizeList(data?.report?.references),
      aiUsageLogs: normalizeList(data?.report?.aiUsageLogs),
    },
    chartImage: data?.chartImage || null,
    metadata: { ...base.metadata, ...(data?.metadata || {}) },
  };
}

function loadReportData() {
  try {
    const stored = window.localStorage.getItem(getReportStorageKey());
    return stored ? normalizeReportData(JSON.parse(stored)) : createDefaultReportData();
  } catch {
    return createDefaultReportData();
  }
}

function saveReportData(reportData) {
  const normalized = normalizeReportData(reportData);
  normalized.metadata.updatedAt = new Date().toISOString();
  window.localStorage.setItem(getReportStorageKey(), JSON.stringify(normalized));
  return normalized;
}

function text(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function paragraphHtml(value) {
  const content = text(value);
  if (!content) return "";
  return escapeHtml(content)
    .split(/\n+/)
    .map((line) => `<p>${line}</p>`)
    .join("");
}

function listHtml(items) {
  const list = normalizeList(items);
  if (!list.length) return "";
  return `<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function formatDate(value, fallback = "작성일 미정") {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function formatDateTime(value) {
  if (!value) return "저장 기록 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "저장 기록 없음";
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function hasAny(...values) {
  return values.some((value) => {
    if (Array.isArray(value)) return normalizeList(value).length > 0;
    return Boolean(text(value));
  });
}

function getRequiredStatus(data) {
  const report = data.report;
  return [
    { label: "탐구 질문", complete: hasAny(report.researchQuestion) },
    { label: "독립변수", complete: hasAny(report.independentVariable) },
    { label: "종속변수", complete: hasAny(report.dependentVariable) },
    {
      label: "서론",
      complete: hasAny(report.introduction.background, report.introduction.purpose, report.introduction.necessity),
    },
    {
      label: "연구 방법",
      complete: hasAny(report.methodology.dataSource, report.methodology.collectionMethod, report.methodology.analysisMethod),
    },
    {
      label: "분석 결과",
      complete: hasAny(report.results.summary, report.results.interpretation),
    },
    { label: "그래프", complete: Boolean(data.chartImage) },
    { label: "결론", complete: hasAny(report.conclusion.answer) },
    { label: "참고문헌", complete: normalizeList(report.references).length > 0 },
    { label: "AI 활용 기록", complete: normalizeList(report.aiUsageLogs).length > 0 },
  ];
}

function calculateCompletion(statusItems) {
  if (!statusItems.length) return 0;
  return Math.round((statusItems.filter((item) => item.complete).length / statusItems.length) * 100);
}

function section(title, body, className = "") {
  if (!body) return "";
  return `
    <section class="report-section avoid-break ${className}">
      <h2>${escapeHtml(title)}</h2>
      ${body}
    </section>
  `;
}

function renderPreview(data) {
  const report = data.report;
  const student = data.student;
  const title = text(report.title) || "AI 데이터 분석 기반 주제탐구보고서";
  const introBody = [
    section("연구 배경", paragraphHtml(report.introduction.background)),
    section("연구 목적", paragraphHtml(report.introduction.purpose)),
    section("연구 필요성", paragraphHtml(report.introduction.necessity)),
  ].join("");
  const methodRows = [
    ["데이터 출처", report.methodology.dataSource],
    ["수집 방법", report.methodology.collectionMethod],
    ["분석 방법", report.methodology.analysisMethod],
  ].filter(([, value]) => text(value));
  const resultMeta = [
    ["그래프 제목", report.results.chartTitle],
    ["X축 설명", report.results.xAxisDescription],
    ["Y축 설명", report.results.yAxisDescription],
  ].filter(([, value]) => text(value));
  const contactVisible = Boolean(LOREAX_CONTACT.kakaoChannelUrl || LOREAX_CONTACT.inquiryUrl || LOREAX_CONTACT.qrImageUrl);

  dom.reportPreview.innerHTML = `
    <section class="cover-page avoid-break">
      <p class="document-type">AI 데이터 분석 기반 주제탐구보고서</p>
      <h1>${escapeHtml(title)}</h1>
      <dl>
        ${text(student.name) ? `<div><dt>학생 이름</dt><dd>${escapeHtml(student.name)}</dd></div>` : ""}
        ${text(student.studentNumber) ? `<div><dt>학번</dt><dd>${escapeHtml(student.studentNumber)}</dd></div>` : ""}
        ${text(student.className) ? `<div><dt>반</dt><dd>${escapeHtml(student.className)}</dd></div>` : ""}
        <div><dt>작성일</dt><dd>${formatDate(data.metadata.updatedAt || data.metadata.createdAt)}</dd></div>
      </dl>
    </section>
    ${section("1. 탐구 질문", paragraphHtml(report.researchQuestion))}
    ${section("2. 연구 배경 및 목적", introBody, "nested-section")}
    ${section(
      "3. 연구 방법",
      methodRows.length
        ? `<table class="method-table"><tbody>${methodRows
            .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
            .join("")}</tbody></table>${paragraphHtml(report.researchScope)}`
        : paragraphHtml(report.researchScope)
    )}
    ${section("4. 데이터 분석 결과", `${paragraphHtml(report.results.summary)}${resultMeta.length ? listHtml(resultMeta.map(([label, value]) => `${label}: ${value}`)) : ""}`)}
    ${
      data.chartImage
        ? section(
            "5. 시각화 그래프",
            `<figure class="chart-figure"><img src="${data.chartImage}" alt="학생이 등록한 그래프 이미지" /></figure>`,
            "chart-section"
          )
        : ""
    }
    ${section("6. 그래프 해석", paragraphHtml(report.results.interpretation))}
    ${section("7. 결론", paragraphHtml(report.conclusion.answer))}
    ${section(
      "8. 연구의 한계 및 향후 탐구",
      `${paragraphHtml(report.conclusion.limitations)}${paragraphHtml(report.conclusion.futureResearch)}`
    )}
    ${section("9. 참고문헌", listHtml(report.references))}
    ${section("10. AI 활용 기록", listHtml(report.aiUsageLogs))}
    ${section(
      "11. 동료 피드백 및 반영 내용",
      `${paragraphHtml(report.peerFeedback)}${paragraphHtml(report.feedbackReflection)}`
    )}
    ${
      contactVisible
        ? section(
            "LoreAX 수업지원 안내",
            `
              <p>이 보고서는 LoreAX Class 수업을 통해 제작되었습니다.</p>
              <p>보고서 보완, AI 활용 교육 및 탐구 활동 관련 문의는 LoreAX 수업지원 채널을 이용할 수 있습니다.</p>
              <dl class="contact-list">
                <div><dt>채널명</dt><dd>${escapeHtml(LOREAX_CONTACT.kakaoChannelName)}</dd></div>
                ${LOREAX_CONTACT.kakaoChannelUrl ? `<div><dt>카카오톡 채널</dt><dd>${escapeHtml(LOREAX_CONTACT.kakaoChannelUrl)}</dd></div>` : ""}
                ${LOREAX_CONTACT.inquiryUrl ? `<div><dt>문의 페이지</dt><dd>${escapeHtml(LOREAX_CONTACT.inquiryUrl)}</dd></div>` : ""}
              </dl>
              ${LOREAX_CONTACT.qrImageUrl ? `<img class="contact-qr" src="${LOREAX_CONTACT.qrImageUrl}" alt="LoreAX 수업지원 채널 QR" />` : ""}
            `,
            "contact-section"
          )
        : ""
    }
  `;
}

function renderMissingList(statusItems) {
  dom.missingList.innerHTML = statusItems
    .map(
      (item) => `
        <li class="${item.complete ? "is-complete" : "is-missing"}">
          <span>${escapeHtml(item.label)}</span>
          <strong>${item.complete ? "작성됨" : "확인 필요"}</strong>
        </li>
      `
    )
    .join("");
}

function renderSummary(data, statusItems) {
  dom.summaryStudentName.textContent = text(data.student.name) || "미입력";
  dom.summaryReportTitle.textContent = text(data.report.title) || "제목 미입력";
  dom.summaryProgress.textContent = `${calculateCompletion(statusItems)}%`;
  dom.summaryUpdatedAt.textContent = formatDateTime(data.metadata.updatedAt);
}

function renderInquiryButton() {
  const url = LOREAX_CONTACT.kakaoChannelUrl || LOREAX_CONTACT.inquiryUrl;
  if (!url) {
    dom.inquiryButton.hidden = true;
    return;
  }
  dom.inquiryButton.hidden = false;
  dom.inquiryButton.href = url;
}

function refreshPreview() {
  const data = loadReportData();
  const statusItems = getRequiredStatus(data);
  renderSummary(data, statusItems);
  renderMissingList(statusItems);
  renderPreview(data);
  renderInquiryButton();
  return { data, statusItems };
}

function sanitizeFilePart(value, fallback) {
  return (text(value) || fallback)
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 40);
}

function buildPdfFileName(data) {
  const number = sanitizeFilePart(data.student.studentNumber, "학번미입력");
  const name = sanitizeFilePart(data.student.name, "이름미입력");
  const title = sanitizeFilePart(data.report.title, "탐구주제");
  return `${number}_${name}_${title}_주제탐구보고서.pdf`;
}

function getPresenceDeviceId() {
  const existing = window.localStorage.getItem(PRESENCE_DEVICE_KEY);
  if (existing) return existing;
  const newId = `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(PRESENCE_DEVICE_KEY, newId);
  return newId;
}

function updatePresencePdfStatus(data) {
  const deviceId = getPresenceDeviceId();
  const key = `${PRESENCE_STORAGE_PREFIX}${deviceId}`;
  let payload = {};
  try {
    payload = JSON.parse(window.localStorage.getItem(key) || "{}");
  } catch {
    payload = {};
  }
  const statusItems = getRequiredStatus(data);
  const updatedPayload = {
    ...payload,
    studentId: deviceId,
    studentName: text(data.student.name) || payload.studentName || "학생 기기",
    studentNumber: text(data.student.studentNumber) || payload.studentNumber || "",
    className: text(data.student.className) || payload.className || "",
    lessonId: getCurrentLessonId(),
    currentStep: "최종 탐구보고서 PDF 생성",
    progress: Math.max(Number(payload.progress || 0), calculateCompletion(statusItems)),
    pdfGenerated: true,
    pdfUrl: data.metadata?.pdfUrl || payload.pdfUrl || "",
    lastSeenAt: Date.now(),
  };
  window.localStorage.setItem(key, JSON.stringify(updatedPayload));
  return updatedPayload;
}

function markPdfGenerated(pdfUrl = "") {
  const data = loadReportData();
  data.metadata.pdfGenerated = true;
  data.metadata.pdfGeneratedAt = new Date().toISOString();
  if (pdfUrl) data.metadata.pdfUrl = pdfUrl;
  const saved = saveReportData(data);
  updatePresencePdfStatus(saved);
  dom.pdfCompletePanel.hidden = false;
  refreshPreview();
  return saved;
}

function buildReportPresencePayload(data, pdfUrl = "") {
  const deviceId = getPresenceDeviceId();
  const statusItems = getRequiredStatus(data);
  return {
    studentId: deviceId,
    studentName: text(data.student.name) || "학생 기기",
    studentNumber: text(data.student.studentNumber),
    className: text(data.student.className),
    lessonId: getCurrentLessonId(),
    currentStep: "최종 탐구보고서 PDF 생성",
    progress: calculateCompletion(statusItems),
    pdfGenerated: Boolean(data.metadata?.pdfGenerated || pdfUrl),
    pdfUrl,
    lastSeenAt: Date.now(),
  };
}

async function generatePdf() {
  if (typeof html2pdf !== "function") {
    throw new Error("html2pdf 라이브러리를 불러오지 못했습니다.");
  }
  const { data, statusItems } = refreshPreview();
  const missingItems = statusItems.filter((item) => !item.complete);
  if (missingItems.length) {
    const ok = window.confirm("필수 항목이 일부 비어 있습니다. 그래도 생성하시겠습니까?");
    if (!ok) return;
  }

  const filename = buildPdfFileName(data);
  const options = {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: "jpeg", quality: 0.9 },
    html2canvas: {
      scale: 1.2,
      useCORS: true,
      letterRendering: false,
      backgroundColor: "#ffffff",
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"], avoid: [".avoid-break", "h2"] },
  };

  const pdfButtons = [dom.generatePdfButton, dom.downloadPdfButton, dom.completeDownloadButton];
  pdfButtons.forEach((button) => {
    if (!button) return;
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "PDF 생성 중...";
  });

  try {
    const blob = await html2pdf().set(options).from(dom.reportPreview).toPdf().outputPdf("blob");
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.rel = "noopener";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 30000);
    let uploadedUrl = "";
    if (window.LoreAXSupabase?.isEnabled?.()) {
      const uploadResult = await window.LoreAXSupabase.uploadPdf({
        blob,
        filename,
        lessonId: getCurrentLessonId(),
        reportData: data,
        presence: buildReportPresencePayload(data),
      });
      uploadedUrl = uploadResult.url || "";
    }
    const saved = markPdfGenerated(uploadedUrl);
    if (window.LoreAXSupabase?.isEnabled?.()) {
      await window.LoreAXSupabase.syncPresence(buildReportPresencePayload(saved, uploadedUrl));
    }
  } finally {
    pdfButtons.forEach((button) => {
      if (!button) return;
      button.disabled = false;
      button.textContent = button.dataset.originalText || "PDF 다운로드";
    });
  }
}

function openParentView() {
  const url = new URL(window.location.href);
  url.searchParams.set("view", "parent");
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}

function applyParentMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") !== "parent") return;
  document.body.classList.add("parent-mode");
  document.title = "탐구보고서 보기 | LoreAX Class ERP";
}

dom.refreshPreviewButton?.addEventListener("click", refreshPreview);
dom.generatePdfButton?.addEventListener("click", () => {
  generatePdf().catch((error) => {
    console.warn(error);
    window.alert("PDF 생성 중 문제가 발생했습니다. 미리보기를 새로고침한 뒤 다시 시도하세요.");
  });
});
dom.downloadPdfButton?.addEventListener("click", () => dom.generatePdfButton.click());
dom.completeDownloadButton?.addEventListener("click", () => dom.generatePdfButton.click());
dom.parentViewButton?.addEventListener("click", openParentView);
dom.completeParentViewButton?.addEventListener("click", openParentView);

applyParentMode();
refreshPreview();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("../../../sw.js").catch((error) => {
      console.warn("Service Worker registration failed:", error);
    });
  });
}

window.LoreAXReport = {
  refreshPreview,
  generatePdf,
  loadReportData,
  markPdfGenerated,
  getReportStorageKey,
};
