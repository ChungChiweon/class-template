const REPORT_STORAGE_PREFIX = "loreaxReport:";
const LESSON_STORAGE_KEY = "selectedLessonId";
const PRESENCE_STORAGE_PREFIX = "loreaxPresence:";
const PRESENCE_DEVICE_KEY = "loreaxPresenceDeviceId";
const FIXED_LESSON_ID = "dataAnalysisReport";

const LOREAX_CONTACT = {
  kakaoChannelUrl: "",
  kakaoChannelName: "LoreAX 수업지원",
  inquiryUrl: "",
  qrImageUrl: "",
};

let generatedPdfCache = null;

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
      topicReason: "",
      researchQuestion: "",
      independentVariable: "",
      dependentVariable: "",
      researchScope: "",
      dataSummary: "",
      cleanedDataNotes: "",
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
        significance: "",
      },
      generated: {},
      references: [],
      aiUsageLogs: [],
      selfDraft: "",
      aiRevisedSentence: "",
      finalRevisedSentence: "",
      peerFeedback: "",
      feedbackReflection: "",
      aiFinalRevisionLog: "",
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
    window.localStorage.setItem(LESSON_STORAGE_KEY, FIXED_LESSON_ID);
    return FIXED_LESSON_ID;
  } catch {
    return FIXED_LESSON_ID;
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
      generated: { ...base.report.generated, ...(data?.report?.generated || {}) },
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

function isUsableUrl(value) {
  const url = text(value);
  if (!url || url === "#") return false;
  try {
    const parsed = new URL(url, window.location.href);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getPrimaryContactUrl() {
  if (isUsableUrl(LOREAX_CONTACT.kakaoChannelUrl)) return LOREAX_CONTACT.kakaoChannelUrl;
  if (isUsableUrl(LOREAX_CONTACT.inquiryUrl)) return LOREAX_CONTACT.inquiryUrl;
  return "";
}

function hasContactInfo() {
  return Boolean(
    isUsableUrl(LOREAX_CONTACT.kakaoChannelUrl) ||
      isUsableUrl(LOREAX_CONTACT.inquiryUrl) ||
      isUsableUrl(LOREAX_CONTACT.qrImageUrl)
  );
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

function getApprovedPeriod1(data) {
  const report = data.report || {};
  const period1 = report.generated?.period1 || {};
  const topic = period1.topicSetting || {};
  const design = period1.researchDesign || {};
  const finalQuestion = text(design.finalResearchQuestion || report.researchQuestion);
  const outline = Array.isArray(design.initialOutlineItems)
    ? normalizeList(design.initialOutlineItems)
    : normalizeList(design.initialOutline || report.initialOutline);

  return {
    topic: text(topic.selectedTopic || report.title),
    topicReason: text(topic.topicReason || topic.selectedReason || report.topicReason),
    finalQuestion,
    researchTarget: text(design.researchTarget || report.researchTarget),
    researchScope: text(design.researchScope || report.researchScope),
    comparisonFactors: Array.isArray(design.comparisonFactors)
      ? normalizeList(design.comparisonFactors)
      : normalizeList(design.comparisonPoint || report.comparisonPoint),
    priorResearchSummary: text(design.priorResearchSummary || design.literatureSummary || report.dataSummary),
    theory: text(design.theory || design.theoryConcept || report.theory),
    theoryApplication: text(design.theoryApplication || report.theoryApplication),
    dataDirection: text(design.dataDirection || design.nextDataDirection || report.methodology?.collectionMethod),
    initialOutline: outline,
    topicApproved: Boolean(topic.approvedAt || topic.selectedTopic || report.title),
    researchApproved: Boolean(design.approvedAt || finalQuestion),
  };
}

function getApprovedPeriod2(data) {
  const report = data.report || {};
  const period2 = report.generated?.period2 || {};
  const pack = period2.selectedDataPack || {};
  const basicChart = period2.visualizations?.basicChart || {};
  const specialChart = period2.visualizations?.specialChart || {};
  const generated = period2.generatedAnalysis || {};
  const approved = Boolean(generated.approvedAt);
  return {
    approved,
    selectedDirection: period2.selectedDirection || {},
    pack,
    basicChart,
    specialChart,
    studentObservation: text(period2.studentObservation),
    tableDescription: approved ? text(generated.tableDescription) : "",
    basicChartDescription: approved ? text(generated.basicChartDescription) : "",
    specialChartDescription: approved ? text(generated.specialChartDescription) : "",
    comparison: approved ? text(generated.comparison) : "",
    keyFindings: approved ? normalizeList(generated.keyFindings) : [],
    theoryConnection: approved ? text(generated.theoryConnection) : "",
    researchQuestionConnection: approved ? text(generated.researchQuestionConnection) : "",
    limitations: approved ? normalizeList(generated.limitations) : [],
    resultDraft: approved ? text(generated.resultDraft) : "",
    updatedOutline: approved ? normalizeList(generated.updatedOutline) : [],
  };
}


function getApprovedPeriod3(data) {
  const report = data.report || {};
  const period3 = report.generated?.period3 || {};
  const draft = period3.generatedDraft || {};
  const approved = Boolean(draft.approvedAt);
  return {
    approved,
    background: approved ? text(draft.background) : "",
    purpose: approved ? text(draft.purpose) : "",
    necessity: approved ? text(draft.necessity) : "",
    researchQuestion: approved ? text(draft.researchQuestion) : "",
    researchScope: approved ? text(draft.researchScope) : "",
    priorResearchSection: approved ? text(draft.priorResearchSection) : "",
    theoreticalBackground: approved ? text(draft.theoreticalBackground) : "",
    dataCollectionMethod: approved ? text(draft.dataCollectionMethod) : "",
    dataSelectionCriteria: approved ? text(draft.dataSelectionCriteria) : "",
    analysisMethod: approved ? text(draft.analysisMethod) : "",
    visualizationMethod: approved ? text(draft.visualizationMethod) : "",
    resultSectionDraft: approved ? text(draft.resultSectionDraft) : "",
    studentVoiceReflection: approved ? text(draft.studentVoiceReflection) : "",
    aiUsageMethod: approved ? text(draft.aiUsageMethod) : "",
    updatedOutline: approved ? normalizeList(draft.updatedOutline) : [],
  };
}

function getApprovedPeriod4(data) {
  const report = data.report || {};
  const period4 = report.generated?.period4 || {};
  const edits = period4.finalEdits || {};
  const inputs = period4.studentInputs || {};
  const approved = Boolean(edits.approvedAt);
  return {
    approved,
    hideEmptySections: edits.hideEmptySections !== false,
    title: approved ? text(edits.title) : "",
    outline: approved ? normalizeList(edits.outline) : [],
    background: approved ? text(edits.background) : "",
    purposeNecessity: approved ? text(edits.purposeNecessity) : "",
    questionScope: approved ? text(edits.questionScope) : "",
    priorTheory: approved ? text(edits.priorTheory) : "",
    methodology: approved ? text(edits.methodology) : "",
    tableGraphDescription: approved ? text(edits.tableGraphDescription) : "",
    analysisResult: approved ? text(edits.analysisResult) : "",
    conclusion: approved ? text(edits.conclusion) : "",
    references: approved ? normalizeList(edits.references) : [],
    aiUsage: approved ? normalizeList(edits.aiUsage) : [],
    finalAnswer: approved ? text(inputs.finalAnswer) : "",
    learningReflection: approved ? text(inputs.learningReflection) : "",
    futureInquiry: approved ? text(inputs.futureInquiry) : "",
  };
}
function period2TableHtml(period2) {
  const pack = period2.pack || {};
  const rows = pack.tableData?.rows || [];
  const columns = pack.tableData?.columns || [];
  if (!period2.approved || !rows.length) return "";
  return `
    <div class="avoid-break">
      <h3>${escapeHtml(pack.title || "분석 데이터")}</h3>
      <p class="source-note">기간: ${escapeHtml(pack.period || "")} · 단위: ${escapeHtml(pack.unit || "")} · 출처: ${escapeHtml(pack.sourceName || "")}</p>
      <table class="method-table data-table"><thead><tr>${columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>
    </div>
  `;
}

function period2VisualizationHtml(period2) {
  if (!period2.approved) return "";
  const blocks = [
    [period2.basicChart?.title, period2.basicChart?.type, period2.basicChartDescription, period2.basicChart],
    [period2.specialChart?.title, period2.specialChart?.type, period2.specialChartDescription, period2.specialChart],
  ].filter(([, , description]) => text(description));
  if (!blocks.length) return "";
  return blocks.map(([title, type, description, chart]) => `
    <figure class="chart-figure avoid-break">
      <figcaption><strong>${escapeHtml(title || "시각화")}</strong> · ${escapeHtml(type || "")}</figcaption>
      ${renderReportSvgChart(type, period2.pack)}
      <p>${escapeHtml(description)}</p>
      <p class="source-note">출처: ${escapeHtml(chart?.sourceName || period2.pack?.sourceName || "")}</p>
    </figure>
  `).join("");
}


function getReportPackValues(pack) {
  return (pack?.tableData?.rows || [])
    .map((row) => ({ label: String(row[0]), value: Number(row[1]) }))
    .filter((item) => Number.isFinite(item.value));
}

function renderReportSvgChart(type, pack) {
  const values = getReportPackValues(pack);
  if (!values.length) return "";
  if (type === "pie") return renderReportPieSvg(values);
  if (type === "heatmap") return renderReportHeatmapSvg(values);
  if (type === "wordcloud") return renderReportWordCloudSvg(pack);
  if (type === "line") return renderReportLineSvg(values);
  return renderReportBarSvg(values);
}

function formatReportChartValue(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value).toFixed(2)).replace(/\.00$/, "").replace(/0$/, "");
}

function getReportChartScale(values) {
  const max = Math.max(...values.map((item) => item.value));
  const min = Math.min(...values.map((item) => item.value));
  const padding = (max - min) * 0.12 || Math.max(1, max * 0.08);
  return { max: max + padding, min: Math.max(0, min - padding), rawMax: max, rawMin: min };
}

function renderReportSvgGrid(width = 620, height = 320) {
  return `
    <rect class="chart-bg" x="0" y="0" width="${width}" height="${height}" rx="18"></rect>
    <line class="chart-axis" x1="78" y1="252" x2="570" y2="252"></line>
    <line class="chart-axis" x1="78" y1="54" x2="78" y2="252"></line>
    ${[0, 1, 2, 3].map((i) => `<line class="chart-grid-line" x1="78" y1="${54 + i * 66}" x2="570" y2="${54 + i * 66}"></line>`).join("")}
  `;
}

function renderReportBarSvg(values) {
  const scale = getReportChartScale(values);
  const plotHeight = 198;
  const startX = 105;
  const step = 430 / Math.max(1, values.length);
  const barWidth = Math.min(48, step * 0.54);
  return `<svg class="chart-svg chart-svg-polished" viewBox="0 0 620 320" role="img" aria-label="bar chart">
    <defs><linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2dd4bf"></stop><stop offset="100%" stop-color="#0f766e"></stop></linearGradient></defs>
    ${renderReportSvgGrid(620, 320)}
    ${values.map((item, index) => {
      const ratio = (item.value - scale.min) / Math.max(1, scale.max - scale.min);
      const height = Math.max(8, ratio * plotHeight);
      const x = startX + index * step + (step - barWidth) / 2;
      const y = 252 - height;
      return `<g><rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${height}" rx="10"></rect><text class="chart-value" x="${x + barWidth / 2}" y="${y - 10}">${formatReportChartValue(item.value)}</text><text class="chart-label" x="${x + barWidth / 2}" y="282">${escapeHtml(item.label)}</text></g>`;
    }).join("")}
  </svg>`;
}

function renderReportLineSvg(values) {
  const scale = getReportChartScale(values);
  const points = values.map((item, index) => {
    const x = 88 + index * (470 / Math.max(1, values.length - 1));
    const y = 252 - ((item.value - scale.min) / Math.max(1, scale.max - scale.min)) * 198;
    return { ...item, x, y };
  });
  const area = `88,252 ${points.map((p) => `${p.x},${p.y}`).join(" ")} 558,252`;
  return `<svg class="chart-svg chart-svg-polished" viewBox="0 0 620 320" role="img" aria-label="line chart">
    <defs><linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(45,212,191,.3)"></stop><stop offset="100%" stop-color="rgba(45,212,191,0)"></stop></linearGradient></defs>
    ${renderReportSvgGrid(620, 320)}
    <polygon class="chart-line-area" points="${area}"></polygon>
    <polyline class="chart-line" points="${points.map((p) => `${p.x},${p.y}`).join(" ")}"></polyline>
    ${points.map((p) => `<g><circle class="chart-point" cx="${p.x}" cy="${p.y}" r="6"></circle><text class="chart-value" x="${p.x}" y="${p.y - 14}">${formatReportChartValue(p.value)}</text><text class="chart-label" x="${p.x}" y="282">${escapeHtml(p.label)}</text></g>`).join("")}
  </svg>`;
}

function renderReportPieSvg(values) {
  const total = values.reduce((sum, item) => sum + item.value, 0) || 1;
  let cumulative = 0;
  const colors = ["#0f766e", "#14b8a6", "#38bdf8", "#6366f1", "#a78bfa", "#f59e0b"];
  const slices = values.map((item, index) => {
    const start = cumulative / total;
    cumulative += item.value;
    const end = cumulative / total;
    const startAngle = start * Math.PI * 2 - Math.PI / 2;
    const endAngle = end * Math.PI * 2 - Math.PI / 2;
    const x1 = 175 + Math.cos(startAngle) * 86;
    const y1 = 154 + Math.sin(startAngle) * 86;
    const x2 = 175 + Math.cos(endAngle) * 86;
    const y2 = 154 + Math.sin(endAngle) * 86;
    const large = end - start > 0.5 ? 1 : 0;
    return `<path d="M175 154 L${x1} ${y1} A86 86 0 ${large} 1 ${x2} ${y2} Z" fill="${colors[index % colors.length]}"></path>`;
  }).join("");
  return `<svg class="chart-svg chart-svg-polished" viewBox="0 0 620 320" role="img" aria-label="pie chart">
    <rect class="chart-bg" x="0" y="0" width="620" height="320" rx="18"></rect>
    ${slices}<circle cx="175" cy="154" r="42" fill="#fff"></circle>
    ${values.map((item, index) => `<g><rect x="350" y="${70 + index * 30}" width="14" height="14" rx="4" fill="${colors[index % colors.length]}"></rect><text class="chart-legend" x="374" y="${82 + index * 30}">${escapeHtml(item.label)} ? ${Math.round((item.value / total) * 100)}%</text></g>`).join("")}
  </svg>`;
}

function renderReportHeatmapSvg(values) {
  const max = Math.max(...values.map((item) => item.value));
  const min = Math.min(...values.map((item) => item.value));
  const spread = max - min || 1;
  return `<svg class="chart-svg heatmap-svg chart-svg-polished" viewBox="0 0 620 340" role="img" aria-label="heatmap">
    <defs><linearGradient id="heatLegend" x1="0" x2="1"><stop offset="0%" stop-color="#ccfbf1"></stop><stop offset="100%" stop-color="#0f766e"></stop></linearGradient></defs>
    <rect class="chart-bg" x="0" y="0" width="620" height="340" rx="18"></rect>
    <text class="heatmap-title" x="310" y="42">값이 진할수록 높은 수준</text>
    ${values.map((item, index) => {
      const ratio = (item.value - min) / spread;
      const lightness = 88 - ratio * 38;
      const x = 68 + (index % 3) * 164;
      const y = 72 + Math.floor(index / 3) * 82;
      const textColor = lightness < 60 ? "#ffffff" : "#0f172a";
      return `<g><rect class="heat-cell" x="${x}" y="${y}" width="138" height="64" rx="16" style="fill:hsl(174, 72%, ${lightness}%);"></rect><text class="heat-label" x="${x + 69}" y="${y + 27}" style="fill:${textColor}">${escapeHtml(item.label)}</text><text class="heat-value" x="${x + 69}" y="${y + 49}" style="fill:${textColor}">${formatReportChartValue(item.value)}</text></g>`;
    }).join("")}
    <rect x="178" y="294" width="264" height="14" rx="7" fill="url(#heatLegend)"></rect><text class="chart-label" x="150" y="306">낮음</text><text class="chart-label" x="470" y="306">높음</text>
  </svg>`;
}

function renderReportWordCloudSvg(pack) {
  const words = (pack?.relatedKeywords || []).slice(0, 10);
  const colors = ["#0f766e", "#0891b2", "#4f46e5", "#7c3aed", "#0f9690"];
  return `<svg class="chart-svg wordcloud-svg chart-svg-polished" viewBox="0 0 620 320" role="img" aria-label="word cloud">
    <rect class="chart-bg" x="0" y="0" width="620" height="320" rx="18"></rect>
    ${words.map((word, index) => {
      const x = 70 + (index % 5) * 102;
      const y = 92 + Math.floor(index / 5) * 86 + (index % 2) * 12;
      const size = 19 + (index % 4) * 5;
      return `<text x="${x}" y="${y}" style="font-size:${size}px;fill:${colors[index % colors.length]}">${escapeHtml(word)}</text>`;
    }).join("")}
  </svg>`;
}

function definitionListHtml(rows) {
  const filtered = rows.filter(([, value]) => hasAny(value));
  if (!filtered.length) return "";
  return `<table class="method-table"><tbody>${filtered
    .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${Array.isArray(value) ? listHtml(value) : paragraphHtml(value)}</td></tr>`)
    .join("")}</tbody></table>`;
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

function getRequiredStatus(data) {
  const report = data.report;
  const period1 = getApprovedPeriod1(data);
  const period2 = getApprovedPeriod2(data);
  const period3 = getApprovedPeriod3(data);
  const period4 = getApprovedPeriod4(data);
  return [
    { label: "탐구 주제", complete: hasAny(period4.title, period1.topic, report.title) },
    { label: "탐구 질문", complete: hasAny(period4.questionScope, period1.finalQuestion, report.researchQuestion) },
    { label: "1차시 승인", complete: Boolean(period1.topicApproved && period1.researchApproved) },
    { label: "2차시 분석 승인", complete: Boolean(period2.approved) },
    { label: "3차시 초안 승인", complete: Boolean(period3.approved) },
    { label: "4차시 최종본 승인", complete: Boolean(period4.approved) },
    { label: "서론", complete: hasAny(period4.background, period3.background, report.introduction.background) },
    { label: "연구 방법", complete: hasAny(period4.methodology, period3.dataCollectionMethod, report.methodology.collectionMethod) },
    { label: "분석 결과", complete: hasAny(period4.analysisResult, period3.resultSectionDraft, period2.resultDraft, report.results.summary) },
    { label: "결론", complete: hasAny(period4.finalAnswer, period4.conclusion, report.conclusion.answer) },
    { label: "참고문헌", complete: period4.references.length > 0 || normalizeList(report.references).length > 0 },
    { label: "AI 활용 기록", complete: period4.aiUsage.length > 0 || normalizeList(report.aiUsageLogs).length > 0 || hasAny(period3.aiUsageMethod) },
  ];
}

function renderPreview(data) {
  const report = data.report;
  const student = data.student;
  const period1 = getApprovedPeriod1(data);
  const period2 = getApprovedPeriod2(data);
  const period3 = getApprovedPeriod3(data);
  const period4 = getApprovedPeriod4(data);
  const title = period4.title || period1.topic || text(report.title) || "AI 데이터 분석 기반 주제탐구보고서";
  const outlineItems = period4.outline.length
    ? period4.outline
    : [...period3.updatedOutline, ...period2.updatedOutline, ...period1.initialOutline].filter(Boolean);
  const references = period4.references.length ? period4.references : normalizeList(report.references);
  const aiUsage = period4.aiUsage.length
    ? period4.aiUsage
    : [period3.aiUsageMethod, ...normalizeList(report.aiUsageLogs), report.aiFinalRevisionLog].filter(Boolean);

  const theoryBody = [
    period4.priorTheory ? section("기존 연구와 이론", paragraphHtml(period4.priorTheory)) : "",
    !period4.priorTheory ? section("기존 연구 요약", paragraphHtml(period3.priorResearchSection || period1.priorResearchSummary)) : "",
    !period4.priorTheory ? section("이론적 배경", paragraphHtml(period3.theoreticalBackground || period1.theory)) : "",
    !period4.priorTheory ? section("탐구 주제에의 적용", paragraphHtml(period1.theoryApplication)) : "",
  ].join("");

  const methodRows = [
    ["연구 대상", period1.researchTarget],
    ["연구 범위", period4.questionScope || period3.researchScope || period1.researchScope],
    ["비교 요소", period1.comparisonFactors],
    ["자료 출처", report.methodology.dataSource],
    ["탐구 방법", period4.methodology],
    ["자료 수집 방법", !period4.methodology ? period3.dataCollectionMethod || report.methodology.collectionMethod : ""],
    ["자료 선택 기준", !period4.methodology ? period3.dataSelectionCriteria : ""],
    ["분석 방법", !period4.methodology ? period3.analysisMethod || report.methodology.analysisMethod : ""],
    ["시각화 방법", !period4.methodology ? period3.visualizationMethod : ""],
  ];

  const introBody = [
    section("탐구 동기", paragraphHtml(period1.topicReason)),
    section("탐구 배경", paragraphHtml(period4.background || period3.background || report.introduction.background)),
    section("탐구 목적과 필요성", paragraphHtml(period4.purposeNecessity)),
    !period4.purposeNecessity ? section("탐구 목적", paragraphHtml(period3.purpose || report.introduction.purpose)) : "",
    !period4.purposeNecessity ? section("탐구 필요성", paragraphHtml(period3.necessity || report.introduction.necessity)) : "",
    section("탐구 질문과 범위", paragraphHtml(period4.questionScope || period3.researchQuestion || period1.finalQuestion || report.researchQuestion)),
  ].join("");

  const period2ResultBody = [
    period2TableHtml(period2),
    section("자료 설명", paragraphHtml(period2.tableDescription)),
    period2VisualizationHtml(period2),
    section("표·그래프 설명", paragraphHtml(period4.tableGraphDescription)),
    section("핵심 결과", period4.analysisResult ? paragraphHtml(period4.analysisResult) : listHtml(period2.keyFindings)),
    !period4.analysisResult ? section("두 시각화 비교", paragraphHtml(period2.comparison)) : "",
  ].join("");

  const interpretationBody = [
    section("이론과의 연결", paragraphHtml(!period4.analysisResult ? period2.theoryConnection : "")),
    section("탐구 질문과의 연결", paragraphHtml(!period4.analysisResult ? period2.researchQuestionConnection : "")),
    section("학생 관찰", paragraphHtml(period2.studentObservation)),
    section("학생 생각 반영", paragraphHtml(period3.studentVoiceReflection)),
  ].join("");

  const contactVisible = hasContactInfo();

  dom.reportPreview.innerHTML = `
    <section class="cover-page avoid-break">
      <p class="document-type">AI 데이터 분석 기반 주제탐구보고서</p>
      <h1>${escapeHtml(title)}</h1>
      <dl>
        ${text(student.name) ? `<div><dt>학생 이름</dt><dd>${escapeHtml(student.name)}</dd></div>` : ""}
        ${text(student.studentNumber) ? `<div><dt>학번</dt><dd>${escapeHtml(student.studentNumber)}</dd></div>` : ""}
        ${text(student.className) ? `<div><dt>반</dt><dd>${escapeHtml(student.className)}</dd></div>` : ""}
        <div><dt>작성일</dt><dd>${formatDate(data.metadata.updatedAt || data.metadata.createdAt, "작성일 미정")}</dd></div>
      </dl>
    </section>
    ${section("1. 탐구 주제와 선택 이유", `${paragraphHtml(period1.topic)}${paragraphHtml(period1.topicReason)}`)}
    ${section("2. 탐구 질문", paragraphHtml(period4.questionScope || period3.researchQuestion || period1.finalQuestion))}
    ${section("3. 연구 배경 및 목적", introBody, "nested-section")}
    ${section("4. 기존 연구 및 이론", theoryBody, "nested-section")}
    ${section("5. 연구 방법", definitionListHtml(methodRows))}
    ${section("6. 데이터 분석 결과", `${period2ResultBody}${paragraphHtml(period4.analysisResult ? "" : period3.resultSectionDraft)}${paragraphHtml(period4.analysisResult ? "" : report.results.summary)}`)}
    ${data.chartImage ? section("7. 추가 그래프 이미지", `<figure class="chart-figure"><img src="${data.chartImage}" alt="학생이 등록한 그래프 이미지" /></figure>`, "chart-section") : ""}
    ${section("8. 그래프 해석", `${interpretationBody}${paragraphHtml(period4.approved ? "" : report.results.interpretation)}`)}
    ${section("9. 목차", listHtml(outlineItems))}
    ${section("10. 결론", `${paragraphHtml(period4.finalAnswer)}${paragraphHtml(period4.conclusion || report.conclusion.answer)}`)}
    ${section("11. 배우고 느낀 점", paragraphHtml(period4.learningReflection || report.feedbackReflection))}
    ${section("12. 연구의 한계 및 향후 탐구", `${listHtml(period2.limitations)}${paragraphHtml(report.conclusion.limitations)}${paragraphHtml(period4.futureInquiry || report.conclusion.futureResearch)}`)}
    ${section("13. 참고문헌", listHtml(references))}
    ${section("14. AI 활용 기록", listHtml(aiUsage))}
    ${contactVisible ? section("LoreAX 수업지원 안내", `<p>이 보고서는 LoreAX Class 수업을 통해 제작되었습니다.</p>`, "contact-section") : ""}
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
  const url = getPrimaryContactUrl();
  if (!url) {
    dom.inquiryButton.hidden = true;
    dom.inquiryButton.removeAttribute("href");
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
  const period4 = getApprovedPeriod4(data);
  const title = sanitizeFilePart(period4.title || data.report.title, "탐구주제");
  return `${number}_${name}_${title}_주제탐구보고서.pdf`;
}

function downloadBlob(blob, filename) {
  if (!blob) return false;
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = filename;
  downloadLink.rel = "noopener";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  return true;
}

function downloadGeneratedPdf() {
  if (!generatedPdfCache?.blob) return false;
  window.LoreAXUsage?.trackPdfDownload?.(getCurrentLessonId(), { source: "report_download" });
  return downloadBlob(generatedPdfCache.blob, generatedPdfCache.filename);
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
    const ok = window.confirm("필수 항목 일부가 비어 있습니다. 그래도 PDF를 생성할까요?");
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
    generatedPdfCache = { blob, filename };
    window.LoreAXUsage?.trackPdfGenerate?.(getCurrentLessonId(), { filename });
    downloadGeneratedPdf();
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
    window.LoreAXUsage?.trackReportSubmit?.(getCurrentLessonId(), { pdfUploaded: Boolean(uploadedUrl) });
    if (window.LoreAXSupabase?.isEnabled?.()) {
      await window.LoreAXSupabase.saveReport({
        lessonId: getCurrentLessonId(),
        reportData: saved,
        presence: buildReportPresencePayload(saved, uploadedUrl),
      });
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
dom.downloadPdfButton?.addEventListener("click", () => {
  if (downloadGeneratedPdf()) return;
  dom.generatePdfButton.click();
});
dom.completeDownloadButton?.addEventListener("click", () => {
  if (downloadGeneratedPdf()) return;
  dom.generatePdfButton.click();
});
dom.parentViewButton?.addEventListener("click", openParentView);
dom.completeParentViewButton?.addEventListener("click", openParentView);

applyParentMode();
refreshPreview();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    window.LoreAXUsage?.trackCourseOpen?.(getCurrentLessonId(), { source: "topic_report_page" });
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











