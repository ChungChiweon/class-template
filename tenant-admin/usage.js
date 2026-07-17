const dom = {
  form: document.querySelector("#usageForm"),
  tenantSelect: document.querySelector("#tenantSelect"),
  tenantInput: document.querySelector("#tenantInput"),
  monthInput: document.querySelector("#monthInput"),
  loadStatus: document.querySelector("#loadStatus"),
  eventStatus: document.querySelector("#eventStatus"),
  eventTableBody: document.querySelector("#eventTableBody"),
};

const fields = [
  "tenantName",
  "planName",
  "includedLearners",
  "activeLearners",
  "overageLearners",
  "courseOpens",
  "activitySaves",
  "aiGenerateCount",
  "aiSuccessCount",
  "aiFailureCount",
  "pdfGenerateCount",
  "pdfDownloadCount",
  "submittedReports",
  "estimatedTotalFee",
  "estimatedBaseFee",
  "estimatedOverageFee",
  "overagePrice",
].reduce((acc, id) => {
  acc[id] = document.querySelector(`#${id}`);
  return acc;
}, {});

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function initInputs() {
  const params = new URLSearchParams(window.location.search);
  const tenant = params.get("tenant") || params.get("tenantId") || "default";
  dom.tenantInput.value = tenant;
  dom.tenantSelect.value = ["default", "academy-a", "academy-b"].includes(tenant) ? tenant : "default";
  dom.monthInput.value = params.get("month") || currentMonth();
}

function money(value) {
  return `${Number(value || 0).toLocaleString("ko-KR")}원`;
}

function count(value, suffix) {
  return `${Number(value || 0).toLocaleString("ko-KR")}${suffix}`;
}

function setText(key, value) {
  if (fields[key]) fields[key].textContent = value;
}

function renderSummary(summary = {}) {
  const tenant = window.LoreAXTenant?.getCurrentTenant?.(dom.tenantInput.value);
  const plan = window.LoreAXTenant?.getPlan?.(tenant?.planId || "starter");
  setText("tenantName", tenant?.displayName || tenant?.name || dom.tenantInput.value || "default");
  setText("planName", `${plan?.name || "Starter"} (${tenant?.planId || "starter"})`);
  setText("includedLearners", count(summary.includedLearners ?? tenant?.includedLearners ?? plan?.includedLearners, "명"));
  setText("activeLearners", count(summary.activeLearners, "명"));
  setText("overageLearners", count(summary.overageLearners, "명"));
  setText("courseOpens", count(summary.courseOpens, "회"));
  setText("activitySaves", count(summary.activitySaves, "회"));
  setText("aiGenerateCount", count(summary.aiGenerateCount, "회"));
  setText("aiSuccessCount", count(summary.aiSuccessCount, "회"));
  setText("aiFailureCount", count(summary.aiFailureCount, "회"));
  setText("pdfGenerateCount", count(summary.pdfGenerateCount, "회"));
  setText("pdfDownloadCount", count(summary.pdfDownloadCount, "회"));
  setText("submittedReports", count(summary.submittedReports, "건"));
  setText("estimatedTotalFee", money(summary.estimatedTotalFee));
  setText("estimatedBaseFee", money(summary.estimatedBaseFee ?? plan?.monthlyBaseFee));
  setText("estimatedOverageFee", money(summary.estimatedOverageFee));
  setText("overagePrice", money(summary.overagePrice ?? tenant?.overagePrice ?? plan?.overagePrice));
}

function renderEvents(events = []) {
  if (!events.length) {
    dom.eventTableBody.innerHTML = `<tr><td colspan="5">아직 표시할 사용 이벤트가 없습니다.</td></tr>`;
    dom.eventStatus.textContent = "0건";
    return;
  }
  dom.eventStatus.textContent = `${events.length.toLocaleString("ko-KR")}건`;
  dom.eventTableBody.innerHTML = events
    .slice(0, 100)
    .map((event) => {
      const occurredAt = event.occurred_at || event.occurredAt || "";
      return `<tr>
        <td>${escapeHtml(occurredAt ? new Date(occurredAt).toLocaleString("ko-KR") : "-")}</td>
        <td>${escapeHtml(event.event_type || event.eventType || "-")}</td>
        <td>${escapeHtml(event.course_id || event.courseId || "-")}</td>
        <td>${escapeHtml(event.anonymous_student_id || event.anonymousStudentId || "-")}</td>
        <td>${escapeHtml(event.quantity || 1)}</td>
      </tr>`;
    })
    .join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateUrl(tenant, month) {
  const next = new URL(window.location.href);
  next.searchParams.set("tenant", tenant);
  next.searchParams.set("month", month);
  window.history.replaceState({}, "", next);
}

async function loadUsage() {
  const tenant = dom.tenantInput.value || "default";
  const month = dom.monthInput.value || currentMonth();
  dom.loadStatus.textContent = "조회 중";
  updateUrl(tenant, month);
  const url = `/api/tenant-usage?tenant=${encodeURIComponent(tenant)}&month=${encodeURIComponent(month)}`;
  try {
    const response = await fetch(url);
    const payload = await response.json();
    renderSummary(payload.summary || {});
    renderEvents(payload.events || []);
    dom.loadStatus.textContent = payload.ok ? `조회 완료 · ${payload.mode || "api"}` : "조회 실패 · 0으로 표시";
  } catch (error) {
    renderSummary({});
    renderEvents([]);
    dom.loadStatus.textContent = "조회 실패 · 0으로 표시";
  }
}

dom.tenantSelect?.addEventListener("change", () => {
  dom.tenantInput.value = dom.tenantSelect.value;
  loadUsage();
});

dom.form?.addEventListener("submit", (event) => {
  event.preventDefault();
  loadUsage();
});

initInputs();
loadUsage();
