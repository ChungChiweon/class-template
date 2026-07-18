(function () {
  const COURSE_ID = "cardNews";
  const STEPS = [
    { id: "plan", title: "\uc8fc\uc81c\u00b7\uae30\ud68d" },
    { id: "prompt", title: "\ud504\ub86c\ud504\ud2b8 \uc124\uacc4" },
    { id: "flux", title: "Flux \uc81c\uc791" },
    { id: "gpt", title: "GPT \ud1b5\ud569 \uc81c\uc791" },
    { id: "final", title: "\ube44\uad50\u00b7\uc644\uc131" },
  ];
  const GIMPO_TOPIC_EXAMPLES = [
    {
      "id": "gimpo-culture-calendar",
      "label": "김포 문화행사",
      "sourceLabel": "김포시 문화행사일정",
      "sourceUrl": "https://www.gimpo.go.kr/culture/schdulCalendar.do?key=6814&schdulDiv=CULTURE",
      "description": "김포시 문화행사 안내",
      "planning": {
        "topic": "김포시 문화행사 안내",
        "audience": "김포시의 전시·공연·축제 정보를 찾는 시민",
        "purpose": "김포시에서 열리는 문화행사를 알리고 참여를 유도한다.",
        "message": "김포에서 열리는 다양한 문화행사를 확인해 보세요.",
        "mood": "문화적이고 밝으며 정보가 명확한 분위기",
        "facts": "행사명\n행사 날짜와 시간\n행사 장소\n참여 또는 관람 방법",
        "requiredFacts": [
          "행사명",
          "행사 날짜와 시간",
          "행사 장소",
          "참여 또는 관람 방법"
        ]
      }
    },
    {
      "id": "gimpo-art-program",
      "label": "김포 예술체험",
      "sourceLabel": "김포문화재단 교육·체험",
      "sourceUrl": "https://www.gcf.or.kr/gclass/edu/list.do",
      "description": "김포문화재단 예술교육·체험 프로그램 안내",
      "planning": {
        "topic": "김포문화재단 예술교육·체험 프로그램 안내",
        "audience": "김포시의 문화예술 체험에 관심 있는 시민과 가족",
        "purpose": "김포문화재단의 교육·체험 프로그램을 소개하고 신청을 유도한다.",
        "message": "김포에서 다양한 문화예술 프로그램을 직접 체험해 보세요.",
        "mood": "창의적이고 친근하며 즐거운 분위기",
        "facts": "프로그램명\n운영 기간\n운영 장소\n참여 대상\n신청 방법",
        "requiredFacts": [
          "프로그램명",
          "운영 기간",
          "운영 장소",
          "참여 대상",
          "신청 방법"
        ]
      }
    },
    {
      "id": "gimpo-museum-event",
      "label": "김포 전시·행사",
      "sourceLabel": "김포문화재단",
      "sourceUrl": "https://www.gcf.or.kr/",
      "description": "김포문화재단 전시·행사 소개",
      "planning": {
        "topic": "김포문화재단 전시·행사 소개",
        "audience": "김포시의 전시와 지역 문화행사에 관심 있는 시민",
        "purpose": "현재 진행하거나 예정된 김포의 전시·행사를 알린다.",
        "message": "김포 곳곳에서 열리는 전시와 문화행사를 만나보세요.",
        "mood": "세련되고 문화적이며 신뢰감 있는 분위기",
        "facts": "전시 또는 행사명\n운영 기간\n운영 장소\n관람 또는 참여 방법",
        "requiredFacts": [
          "전시 또는 행사명",
          "운영 기간",
          "운영 장소",
          "관람 또는 참여 방법"
        ]
      }
    },
    {
      "id": "gimpo-performance",
      "label": "김포 공연",
      "sourceLabel": "김포문화재단 공연 안내",
      "sourceUrl": "https://www.gcf.or.kr/main/exh/view.do?exh_sn=1823&mthd=SHOW",
      "description": "김포아트홀 공연 안내",
      "planning": {
        "topic": "김포아트홀 공연 안내",
        "audience": "가족과 함께 공연을 관람하려는 김포시민",
        "purpose": "김포아트홀 공연 정보를 전달하고 관람을 유도한다.",
        "message": "가족과 함께 김포에서 즐거운 공연을 만나보세요.",
        "mood": "밝고 즐거우며 가족 친화적인 분위기",
        "facts": "공연명\n공연 날짜와 시간\n공연 장소\n관람 연령\n예매 방법",
        "requiredFacts": [
          "공연명",
          "공연 날짜와 시간",
          "공연 장소",
          "관람 연령",
          "예매 방법"
        ]
      }
    },
    {
      "id": "gimpo-reservation",
      "label": "김포 모집·체험",
      "sourceLabel": "김포시 통합예약",
      "sourceUrl": "https://www.gimpo.go.kr/reserve/index.do",
      "description": "김포시 모집·교육·체험 프로그램 안내",
      "planning": {
        "topic": "김포시 모집·교육·체험 프로그램 안내",
        "audience": "김포시의 교육과 체험 프로그램에 참여하려는 시민",
        "purpose": "김포시 통합예약에서 신청 가능한 프로그램을 소개하고 참여를 유도한다.",
        "message": "김포시에서 운영하는 다양한 교육과 체험에 참여해 보세요.",
        "mood": "공공 안내에 적합한 깔끔하고 신뢰감 있는 분위기",
        "facts": "프로그램명\n신청 기간\n운영 일시\n운영 장소\n신청 대상과 방법",
        "requiredFacts": [
          "프로그램명",
          "신청 기간",
          "운영 일시",
          "운영 장소",
          "신청 대상과 방법"
        ]
      }
    },
    {
      "id": "custom",
      "label": "직접 주제 입력",
      "sourceLabel": "",
      "sourceUrl": "",
      "description": "직접 주제 입력",
      "planning": null
    }
  ];
  const LABELS = {
    savedLocal: "\ub85c\uceec \uc800\uc7a5\ub428",
    savedServer: "\uc11c\ubc84 \uc800\uc7a5\ub428",
    saving: "\uc800\uc7a5 \uc911...",
    serverFallback: "\uc11c\ubc84 \uc800\uc7a5 \ub300\uae30",
    steps: "\ub2e8\uacc4",
    submit: "\uc81c\ucd9c\ud558\uae30",
    saveContinue: "\uc800\uc7a5\ud558\uace0 \ub2e4\uc74c \ub2e8\uacc4",
    mockNotice: "\ud604\uc7ac \uc774\ubbf8\uc9c0 \uc0dd\uc131\uc740 \ud14c\uc2a4\ud2b8 \ubaa8\ub4dc\uc785\ub2c8\ub2e4.",
    limit: "\uc774 \uc0dd\uc131 \ubc29\uc2dd\uc740 \uc774\ubbf8 \uc0ac\uc6a9\ud588\uc2b5\ub2c8\ub2e4.",
  };
  const DEFAULT_PROJECT = {
    projectId: "",
    currentStep: 0,
    planning: { selectedExampleId: "", sourceLabel: "", sourceUrl: "", topic: "", audience: "", purpose: "", message: "", coreMessage: "", facts: "", requiredFacts: [], mood: "" },
    prompt: { role: "\ub274\uc2a4\uce74\ub4dc \ub514\uc790\uc774\ub108", task: "\uc815\uc0ac\uac01\ud615 \ub274\uc2a4\uce74\ub4dc 1\uc7a5 \uc81c\uc791", style: "\ud559\uc0dd\uc774 \uc77d\uae30 \uc26c\uc6b4 \uae54\ub054\ud55c \uc2a4\ud0c0\uc77c", rules: "\ud655\uc778\ud55c \uc0ac\uc2e4\ub9cc \uc0ac\uc6a9" },
    copy: { title: "", subtitle: "", cta: "", fluxPrompt: "", gptPrompt: "" },
    flux: { used: false, imageUrl: "", finalImage: "", layers: [{ id: "title", text: "", x: 80, y: 120, size: 58, color: "#0f172a" }, { id: "subtitle", text: "", x: 80, y: 420, size: 36, color: "#1e293b" }, { id: "cta", text: "", x: 80, y: 820, size: 30, color: "#ffffff" }] },
    gpt: { used: false, imageUrl: "" },
    final: { selected: "", reflection: "", submittedAt: "" },
  };
  const dom = {
    stepper: document.querySelector("#stepper"),
    main: document.querySelector("#mainStep"),
    prev: document.querySelector("#prevButton"),
    save: document.querySelector("#saveButton"),
    next: document.querySelector("#nextButton"),
    saveStatus: document.querySelector("#saveStatus"),
    stepStatus: document.querySelector("#stepStatus"),
  };
  if (window.LoreAXTenant?.guardCourseAccess?.(COURSE_ID, { homeUrl: "../../index.html" })?.blocked) return;

  const project = load();
  let saveTimer = null;
  let isRemoteLoaded = false;

  function tenantId() {
    return window.LoreAXTenant?.resolveTenantId?.() || "default";
  }

  function studentId() {
    return window.LoreAXUsage?.getAnonymousStudentId?.() || "anonymous";
  }

  function projectIdKey() {
    return `loreax:cardNewsProjectId:${tenantId()}:${studentId()}`;
  }

  function storageKey() {
    return `loreax:cardNewsProject:${tenantId()}:${studentId()}:${project.projectId || readProjectId()}`;
  }

  function legacyStorageKey() {
    return `loreax:cardNewsProject:${tenantId()}:${studentId()}`;
  }

  function readProjectId() {
    const existing = localStorage.getItem(projectIdKey());
    if (existing && /^[a-zA-Z0-9_-]{8,100}$/.test(existing)) return existing;
    const id = crypto.randomUUID ? crypto.randomUUID() : `cardnews_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(projectIdKey(), id);
    return id;
  }

  function load() {
    const projectId = readProjectId();
    try {
      const scopedKey = `loreax:cardNewsProject:${window.LoreAXTenant?.resolveTenantId?.() || "default"}:${window.LoreAXUsage?.getAnonymousStudentId?.() || "anonymous"}:${projectId}`;
      const legacyKey = `loreax:cardNewsProject:${window.LoreAXTenant?.resolveTenantId?.() || "default"}:${window.LoreAXUsage?.getAnonymousStudentId?.() || "anonymous"}`;
      const raw = localStorage.getItem(scopedKey) || localStorage.getItem(legacyKey);
      if (!raw) return { ...structuredClone(DEFAULT_PROJECT), projectId };
      return merge(structuredClone(DEFAULT_PROJECT), { ...JSON.parse(raw), projectId });
    } catch {
      return { ...structuredClone(DEFAULT_PROJECT), projectId };
    }
  }

  function merge(base, data) {
    const out = { ...base, ...data };
    ["planning", "prompt", "copy", "flux", "gpt", "final"].forEach((key) => {
      out[key] = { ...base[key], ...(data?.[key] || {}) };
    });
    if (!Array.isArray(out.flux.layers)) out.flux.layers = base.flux.layers;
    out.projectId = out.projectId || readProjectId();
    return out;
  }

  function save(remote = true) {
    project.projectId = project.projectId || readProjectId();
    project.updatedAt = new Date().toISOString();
    project.tenantId = tenantId();
    project.anonymousStudentId = studentId();
    localStorage.setItem(storageKey(), JSON.stringify(project));
    dom.saveStatus.textContent = LABELS.savedLocal;
    window.LoreAXUsage?.trackActivitySave?.(COURSE_ID, { step: STEPS[project.currentStep].id });
    if (remote) {
      fetch("/api/card-news/save-project", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) })
        .then((response) => response.json())
        .then((data) => {
          dom.saveStatus.textContent = data.ok ? LABELS.savedServer : LABELS.serverFallback;
        })
        .catch(() => {
          dom.saveStatus.textContent = LABELS.savedLocal;
        });
    }
  }

  function debounceSave() {
    dom.saveStatus.textContent = LABELS.saving;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 400);
  }

  function esc(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function field(group, key, label, long = false) {
    const value = project[group][key] || "";
    if (long) return `<label>${label}<textarea data-field="${group}.${key}">${esc(value)}</textarea></label>`;
    return `<label>${label}<input data-field="${group}.${key}" value="${esc(value)}" /></label>`;
  }

  function render() {
    dom.stepStatus.textContent = `${project.currentStep + 1} / 5 ${LABELS.steps}`;
    dom.prev.disabled = project.currentStep === 0;
    dom.next.textContent = project.currentStep === 4 ? LABELS.submit : LABELS.saveContinue;
    dom.stepper.innerHTML = STEPS.map((step, index) => `<button class="step-chip ${index === project.currentStep ? "is-active" : ""} ${complete(index) ? "is-done" : ""}" data-step="${index}" type="button"><span>${index + 1}</span><strong>${esc(step.title)}</strong></button>`).join("");
    dom.main.innerHTML = [planView, promptView, fluxView, gptView, finalView][project.currentStep]();
    bind();
    if (project.currentStep === 2) requestAnimationFrame(drawCanvas);
  }

  function complete(index) {
    if (index === 0) return project.planning.topic && project.planning.audience && project.planning.purpose && project.planning.message;
    if (index === 1) return project.copy.title && project.copy.fluxPrompt && project.copy.gptPrompt;
    if (index === 2) return project.flux.finalImage || project.flux.imageUrl;
    if (index === 3) return project.gpt.imageUrl;
    return project.final.selected && project.final.reflection;
  }

  function planView() {
    return `<div class="step-title"><div><span class="badge">1\ub2e8\uacc4</span><h2>\uc8fc\uc81c\uc640 \uae30\ud68d</h2></div><button id="resetProject" class="reset-project-button" type="button">\ucc98\uc74c\ubd80\ud130 \ub2e4\uc2dc</button></div>
    <div class="layout"><section class="card field-grid">
      ${topicExamplesView()}
      ${field("planning", "topic", "\uc8fc\uc81c")}
      <div class="field-grid two">${field("planning", "audience", "\ub300\uc0c1")}${field("planning", "purpose", "\ubaa9\uc801")}</div>
      ${field("planning", "message", "\ud575\uc2ec \uba54\uc2dc\uc9c0")}
      ${field("planning", "facts", "\ubc18\ub4dc\uc2dc \ub123\uc744 \ud655\uc778\ub41c \uc0ac\uc2e4", true)}
      ${field("planning", "mood", "\ubd84\uc704\uae30")}
      ${planningTheoryView()}
    </section><aside class="preview-card"><h3>\uae30\ud68d \uc694\uc57d</h3><div class="preview-box">${esc(summary())}</div><p class="notice">\ud655\uc778\ud55c \uc0ac\uc2e4\ub9cc \uc0ac\uc6a9\ud558\uc138\uc694. \ub0a0\uc9dc, \uc7a5\uc18c, \uac00\uaca9, \uc774\ub984\uc744 \uc784\uc758\ub85c \ub9cc\ub4e4\uba74 \uc548 \ub429\ub2c8\ub2e4.</p></aside></div>`;
  }

  function planningTheoryView() {
    const items = [
      {
        title: "\uc8fc\uc81c \uc120\uc815\uc740 \ubb38\uc81c \uc815\uc758(Problem Definition) \uacfc\uc815\uc774\ub2e4",
        body: [
          "\uc0dd\uc131\ud615 AI \uc2dc\ub300\uc5d0\ub294 \ub2e8\uc21c\ud788 \uacb0\uacfc\ubb3c\uc744 \ube68\ub9ac \ub9cc\ub4dc\ub294 \uac83\ubcf4\ub2e4, \uc5b4\ub5a4 \ubb38\uc81c\ub97c \ud574\uacb0\ud560\uc9c0 \uc815\ud655\ud788 \uc815\uc758\ud558\ub294 \ub2a5\ub825\uc774 \uc911\uc694\ud569\ub2c8\ub2e4.",
          "Design Thinking\uc5d0\uc11c Define \ub2e8\uacc4\ub294 \uc0ac\ub78c\uc744 \uc774\ud574\ud558\ub294 Empathize \uc774\ud6c4, \ud574\uacb0\ud574\uc57c \ud560 \ubb38\uc81c\ub97c \uc120\uba85\ud558\uac8c \uc815\ub9ac\ud558\ub294 \uacfc\uc815\uc785\ub2c8\ub2e4.",
          "\uc804\uccb4 \ud750\ub984\uc740 Empathize \u2192 Define \u2192 Ideate \u2192 Prototype \u2192 Test\ub85c \uc124\uba85\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
          "\uce74\ub4dc\ub274\uc2a4\uc5d0\uc11c\ub3c4 \uc8fc\uc81c\uc640 \ubaa9\uc801\uc744 \uba3c\uc800 \uc815\ud574\uc57c AI\uac00 \ud544\uc694\ud55c \uc815\ubcf4\ub97c \uc5b4\ub5a4 \ubc29\ud5a5\uc73c\ub85c \uc815\ub9ac\ud574\uc57c \ud558\ub294\uc9c0 \ud310\ub2e8\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        ],
        source: "Brown, T. (2008). Design Thinking. Harvard Business Review. / Stanford d.school Design Thinking Process.",
      },
      {
        title: "\uc88b\uc740 \ucf58\ud150\uce20\ub294 \ud0c0\uae43 \uc624\ub514\uc5b8\uc2a4(Target Audience)\uc5d0\uc11c \uc2dc\uc791\ud55c\ub2e4",
        body: [
          "\uac19\uc740 \uc815\ubcf4\ub77c\ub3c4 \ub204\uad6c\uc5d0\uac8c \uc804\ub2ec\ud558\ub294\uc9c0\uc5d0 \ub530\ub77c \uc81c\ubaa9, \uc5b4\ud718, \uc774\ubbf8\uc9c0, \uc124\uba85 \ubc29\uc2dd\uc774 \ub2ec\ub77c\uc838\uc57c \ud569\ub2c8\ub2e4.",
          "STP Marketing\uc740 \uc2dc\uc7a5\uc744 \ub098\ub204\ub294 Segmentation, \ud575\uc2ec \ub300\uc0c1\uc744 \uc815\ud558\ub294 Targeting, \uadf8 \ub300\uc0c1\uc5d0\uac8c \uc5b4\ub5bb\uac8c \uc778\uc2dd\ub420\uc9c0 \uc815\ud558\ub294 Positioning\uc73c\ub85c \uc774\ud574\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
          "\uce74\ub4dc\ub274\uc2a4\uc5d0\uc11c \ub300\uc0c1\uc744 \uc815\ud558\ub294 \uc77c\uc740 \ub2e8\uc21c \ud615\uc2dd\uc774 \uc544\ub2c8\ub77c, \uc815\ubcf4\uc758 \uae4a\uc774\uc640 \ud45c\ud604 \uc218\uc900\uc744 \uc815\ud558\ub294 \uae30\ud68d \ud310\ub2e8\uc785\ub2c8\ub2e4.",
        ],
        source: "Kotler & Keller, Marketing Management.",
      },
      {
        title: "\uce74\ub4dc\ub274\uc2a4\ub294 \uc815\ubcf4 \uc804\ub2ec \uad6c\uc870\ub97c \uac00\uc9c4 \ucee4\ubba4\ub2c8\ucf00\uc774\uc158 \ucf58\ud150\uce20\ub2e4",
        body: [
          "\uce74\ub4dc\ub274\uc2a4\ub294 \uc608\uc05c \uc774\ubbf8\uc9c0 \ud558\ub098\uac00 \uc544\ub2c8\ub77c, \uc0ac\ub78c\uc758 \uc8fc\uc758\ub97c \ub04c\uace0 \ud544\uc694\ud55c \uc815\ubcf4\ub97c \uc804\ub2ec\ud558\uba70 \ud589\ub3d9\uc744 \uc720\ub3c4\ud558\ub294 \ubbf8\ub514\uc5b4\uc785\ub2c8\ub2e4.",
          "AIDA \ubaa8\ub378\uc740 Attention, Interest, Desire, Action\uc758 \uad6c\uc870\ub85c \uc124\uba85\ub429\ub2c8\ub2e4.",
          "\uc81c\ubaa9\uc740 Attention\uc744, \uc9e7\uc740 \ubcf8\ubb38\uc740 Interest\uc640 Desire\ub97c, \ud589\ub3d9 \uc720\ub3c4 \ubb38\uad6c\ub294 Action\uc744 \ub9e1\uc2b5\ub2c8\ub2e4.",
          "\ub530\ub77c\uc11c 1\ub2e8\uacc4\uc5d0\uc11c \ud575\uc2ec \uba54\uc2dc\uc9c0\uc640 \ud544\uc218 \uc815\ubcf4\ub97c \uc815\ub9ac\ud558\ub294 \uc77c\uc740 \ub2e4\uc74c \ub2e8\uacc4\uc758 \ud504\ub86c\ud504\ud2b8 \uc124\uacc4\uc640 \uc9c1\uc811 \uc5f0\uacb0\ub429\ub2c8\ub2e4.",
        ],
        source: "Strong, E. K. (1925). Theories of Selling.",
      },
    ];
    return `<details class="planning-theory-panel" aria-label="\ucf58\ud150\uce20 \uae30\ud68d \uc774\ub860">
      <summary class="planning-theory-title"><span aria-hidden="true">\ud83d\udcd8</span><h3>\ubc30\uc6b0\uae30 | AI \uc2dc\ub300 \ucf58\ud150\uce20 \uae30\ud68d\uc758 \uc2dc\uc791: \uc88b\uc740 \uc8fc\uc81c \ub9cc\ub4e4\uae30</h3><i aria-hidden="true">\u203a</i></summary>
      <div class="planning-theory-list">${items.map(theoryAccordion).join("")}</div>
      <div class="planning-checklist"><strong>\uae30\ud68d \uccb4\ud06c\ub9ac\uc2a4\ud2b8</strong><ul><li>\ub300\uc0c1(Target Audience)</li><li>\ubaa9\uc801(Objective)</li><li>\ud575\uc2ec \uba54\uc2dc\uc9c0(Core Message)</li><li>\ud544\uc218 \uc815\ubcf4(Facts)</li></ul></div>
    </details>`;
  }

  function theoryAccordion(item) {
    return `<details class="planning-theory-item">
      <summary>${esc(item.title)}<span aria-hidden="true">\u203a</span></summary>
      <div class="planning-theory-body">${item.body.map((line) => `<p>${esc(line)}</p>`).join("")}<p class="theory-source">\ucd9c\ucc98: ${esc(item.source)}</p></div>
    </details>`;
  }

  function topicExamplesView() {
    return `<section class="topic-example-panel" aria-label="\uae40\ud3ec\uc2dc \ud589\uc0ac\u00b7\uc804\uc2dc \ucd94\ucc9c\uc8fc\uc81c">
      <div class="topic-example-head">
        <div>
          <h3>\uae40\ud3ec\uc2dc \ud589\uc0ac\u00b7\uc804\uc2dc \ucd94\ucc9c\uc8fc\uc81c</h3>
          <p>\ucd94\ucc9c\uc8fc\uc81c\ub97c \uc120\ud0dd\ud558\uace0 \uacf5\uc2dd \ud398\uc774\uc9c0\uc5d0\uc11c \ucd5c\uc2e0 \uc77c\uc815\uacfc \uc7a5\uc18c\ub97c \ud655\uc778\ud558\uc138\uc694.</p>
        </div>
      </div>
      <div class="topic-example-grid">${GIMPO_TOPIC_EXAMPLES.map(topicExampleCard).join("")}</div>
      ${topicSelectionNotice()}
    </section>`;
  }

  function topicSelectionNotice() {
    if (!project.planning.selectedExampleId) return "";
    if (project.planning.selectedExampleId === "custom") {
      return `<p class="topic-example-selected">\uc9c1\uc811 \uc8fc\uc81c\ub97c \uc791\uc131\ud558\uc138\uc694. \uae30\uc874 \uc785\ub825 \ub0b4\uc6a9\uc740 \uc720\uc9c0\ub429\ub2c8\ub2e4.</p>`;
    }
    return `<p class="topic-example-selected">\uae30\ubcf8 \uae30\ud68d\uc744 \ubd88\ub7ec\uc654\uc2b5\ub2c8\ub2e4. \uacf5\uc2dd \ud398\uc774\uc9c0\ub97c \ud655\uc778\ud558\uace0 \uc2e4\uc81c \ud589\uc0ac\uba85\u00b7\ub0a0\uc9dc\u00b7\uc7a5\uc18c\ub97c \uc218\uc815\ud558\uc138\uc694.</p>`;
  }

  function topicExampleCard(example) {
    const selected = project.planning.selectedExampleId === example.id;
    const link = example.sourceUrl
      ? `<a class="topic-source-link" href="${esc(example.sourceUrl)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(example.sourceLabel)} \uacf5\uc2dd \uc815\ubcf4 \ubcf4\uae30">\uacf5\uc2dd \uc815\ubcf4 \ubcf4\uae30 \u2197</a>`
      : "";
    return `<details class="topic-example-card ${selected ? "is-selected" : ""}">
      <summary class="topic-example-summary">
        <span>${esc(example.label)}</span>
        <span class="topic-example-chevron" aria-hidden="true">\u203a</span>
      </summary>
      <div class="topic-example-body">
        <p>${esc(example.description || example.sourceLabel || "")}</p>
        <div class="topic-example-actions">
          <button class="preset-button" data-example-select="${esc(example.id)}" type="button">${example.id === "custom" ? "\uc9c1\uc811 \uc791\uc131\ud558\uae30" : "\uc8fc\uc81c\ub85c \uc120\ud0dd"}</button>
          ${link}
        </div>
      </div>
    </details>`;
  }

  function selectTopicExample(id) {
    const example = GIMPO_TOPIC_EXAMPLES.find((item) => item.id === id);
    if (!example) return;
    project.planning.selectedExampleId = example.id;
    project.planning.sourceLabel = example.sourceLabel || "";
    project.planning.sourceUrl = example.sourceUrl || "";
    if (example.planning) {
      project.planning.topic = example.planning.topic || "";
      project.planning.audience = example.planning.audience || "";
      project.planning.purpose = example.planning.purpose || "";
      project.planning.message = example.planning.message || "";
      project.planning.coreMessage = example.planning.message || "";
      project.planning.facts = example.planning.facts || "";
      project.planning.requiredFacts = Array.isArray(example.planning.requiredFacts) ? example.planning.requiredFacts : [];
      project.planning.mood = example.planning.mood || "";
      dom.saveStatus.textContent = "\uae30\ubcf8 \uae30\ud68d\uc744 \ubd88\ub7ec\uc654\uc2b5\ub2c8\ub2e4. \uacf5\uc2dd \ud398\uc774\uc9c0\ub97c \ud655\uc778\ud558\uace0 \uc2e4\uc81c \ud589\uc0ac\uba85\u00b7\ub0a0\uc9dc\u00b7\uc7a5\uc18c\ub97c \uc218\uc815\ud558\uc138\uc694.";
    } else {
      dom.saveStatus.textContent = "\uc9c1\uc811 \uc8fc\uc81c\ub97c \uc791\uc131\ud558\uc138\uc694. \uae30\uc874 \uc785\ub825 \ub0b4\uc6a9\uc740 \uc720\uc9c0\ub429\ub2c8\ub2e4.";
    }
    save(false);
    render();
  }

  function promptView() {
    return `<div class="step-title"><div><span class="badge">2\ub2e8\uacc4</span><h2>\ud504\ub86c\ud504\ud2b8 \uc124\uacc4</h2></div><button id="generateCopy" class="primary-button" type="button">\ubb38\uad6c\uc640 \ud504\ub86c\ud504\ud2b8 \ub9cc\ub4e4\uae30</button></div>
    <div class="layout"><section class="card field-grid">
      <div class="field-grid two">${field("prompt", "role", "\uc5ed\ud560")}${field("prompt", "task", "\uc791\uc5c5")}</div>
      ${field("prompt", "style", "\uc2dc\uac01 \uc2a4\ud0c0\uc77c")}
      ${field("prompt", "rules", "\uc0dd\uc131 \uaddc\uce59", true)}
    </section><aside class="preview-card field-grid">
      ${field("copy", "title", "\uc81c\ubaa9")}
      ${field("copy", "subtitle", "\ubcf4\uc870 \ubb38\uad6c")}
      ${field("copy", "cta", "\ud589\ub3d9 \uc720\ub3c4 \ubb38\uad6c")}
      <h3>Flux \ud504\ub86c\ud504\ud2b8</h3><div class="prompt-box">${esc(project.copy.fluxPrompt || "\uc544\uc9c1 \uc0dd\uc131\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4.")}</div>
      <h3>GPT \ud504\ub86c\ud504\ud2b8</h3><div class="prompt-box">${esc(project.copy.gptPrompt || "\uc544\uc9c1 \uc0dd\uc131\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4.")}</div>
    </aside></div>`;
  }

  function fluxView() {
    return `<div class="step-title"><div><span class="badge">3\ub2e8\uacc4</span><h2>Flux \uc81c\uc791</h2></div><div class="button-row"><button id="generateFlux" class="primary-button" ${project.flux.used ? "disabled" : ""} type="button">\ubc30\uacbd \uc0dd\uc131</button><button id="downloadFlux" class="ghost-button" type="button">PNG \ub2e4\uc6b4\ub85c\ub4dc</button></div></div>
    <div class="canvas-workspace"><div class="canvas-wrap"><canvas id="cardCanvas" width="1080" height="1080"></canvas></div><aside class="card"><p class="notice">\uc774 \ubc29\uc2dd\uc740 \uae00\uc790 \uc5c6\ub294 \ubc30\uacbd\uc744 \uba3c\uc800 \ub9cc\ub4e0 \ub4a4, \ud3b8\uc9d1 \uac00\ub2a5\ud55c \ubb38\uad6c\ub97c \uc62c\ub824 \uc644\uc131\ud569\ub2c8\ub2e4.</p><div class="layer-list">${project.flux.layers.map(layerView).join("")}</div><div class="button-row"><button id="loadCopy" class="ghost-button" type="button">\ubb38\uad6c \ubd88\ub7ec\uc624\uae30</button><button id="resetLayout" class="ghost-button" type="button">\ub808\uc774\uc544\uc6c3 \ucd08\uae30\ud654</button></div></aside></div>`;
  }

  function layerView(layer) {
    return `<div class="layer-item" data-layer="${layer.id}"><label>${layer.id}<textarea data-layer-field="text">${esc(layer.text)}</textarea></label><div class="field-grid two"><label>X<input type="range" min="20" max="900" value="${layer.x}" data-layer-field="x" /></label><label>Y<input type="range" min="20" max="960" value="${layer.y}" data-layer-field="y" /></label><label>Size<input type="range" min="20" max="90" value="${layer.size}" data-layer-field="size" /></label><label>Color<input type="color" value="${layer.color}" data-layer-field="color" /></label></div></div>`;
  }

  function gptView() {
    return `<div class="step-title"><div><span class="badge">4\ub2e8\uacc4</span><h2>GPT \ud1b5\ud569 \uc81c\uc791</h2></div><button id="generateGpt" class="primary-button" ${project.gpt.used ? "disabled" : ""} type="button">GPT \uce74\ub4dc \uc0dd\uc131</button></div>
    <div class="layout"><section class="card"><h3>\ud655\uc815\ub41c \uae30\ud68d</h3><div class="preview-box">${esc(summary())}</div><h3>\ud1b5\ud569 \ud504\ub86c\ud504\ud2b8</h3><div class="prompt-box">${esc(project.copy.gptPrompt || buildGptPrompt())}</div></section><aside class="preview-card">${project.gpt.imageUrl ? `<img class="result-image" src="${esc(project.gpt.imageUrl)}" alt="GPT \uc0dd\uc131 \uacb0\uacfc" />` : `<div class="preview-box">\uc544\uc9c1 \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.</div>`}</aside></div>`;
  }

  function finalView() {
    return `<div class="step-title"><div><span class="badge">5\ub2e8\uacc4</span><h2>\ube44\uad50\ud558\uace0 \uc644\uc131</h2></div></div><div class="compare-grid">${resultCard("flux", "Flux + \ubb38\uad6c \ud3b8\uc9d1", project.flux.finalImage || project.flux.imageUrl)}${resultCard("gpt", "GPT \ud1b5\ud569 \uc81c\uc791", project.gpt.imageUrl)}</div><section class="card" style="margin-top:18px">${field("final", "reflection", "\uc65c \uc774 \uacb0\uacfc\ubb3c\uc744 \uc120\ud0dd\ud588\ub098\uc694?", true)}<div class="button-row"><button id="downloadFinal" class="primary-button" type="button">\ucd5c\uc885 PNG \ub2e4\uc6b4\ub85c\ub4dc</button><button id="submitProject" class="ghost-button" type="button">\uacb0\uacfc\ubb3c \uc81c\ucd9c</button></div></section>`;
  }

  function resultCard(method, title, image) {
    return `<article class="result-card ${project.final.selected === method ? "is-selected" : ""}"><h3>${title}</h3>${image ? `<img src="${esc(image)}" alt="${title}" />` : `<div class="preview-box">\uacb0\uacfc \uc5c6\uc74c</div>`}<button class="ghost-button" data-select="${method}" ${image ? "" : "disabled"} type="button">\uc774 \uacb0\uacfc \uc120\ud0dd</button></article>`;
  }

  function bind() {
    dom.main.querySelectorAll("[data-field]").forEach((input) => input.addEventListener("input", () => {
      const [group, key] = input.dataset.field.split(".");
      project[group][key] = input.value;
      debounceSave();
    }));
    dom.main.querySelectorAll("[data-example-select]").forEach((button) => button.addEventListener("click", () => selectTopicExample(button.dataset.exampleSelect)));
    dom.main.querySelector("#generateCopy")?.addEventListener("click", generateCopy);
    dom.main.querySelector("#resetProject")?.addEventListener("click", resetProject);
    dom.main.querySelector("#generateFlux")?.addEventListener("click", generateFlux);
    dom.main.querySelector("#generateGpt")?.addEventListener("click", generateGpt);
    dom.main.querySelector("#loadCopy")?.addEventListener("click", loadCopy);
    dom.main.querySelector("#resetLayout")?.addEventListener("click", resetLayout);
    dom.main.querySelector("#downloadFlux")?.addEventListener("click", () => download(project.flux.finalImage || canvasData(), "flux-card-news.png"));
    dom.main.querySelector("#downloadFinal")?.addEventListener("click", downloadFinal);
    dom.main.querySelector("#submitProject")?.addEventListener("click", submit);
    dom.main.querySelectorAll("[data-select]").forEach((button) => button.addEventListener("click", () => {
      project.final.selected = button.dataset.select;
      save();
      render();
    }));
    dom.main.querySelectorAll("[data-layer-field]").forEach((input) => input.addEventListener("input", () => {
      const layer = project.flux.layers.find((item) => item.id === input.closest("[data-layer]").dataset.layer);
      layer[input.dataset.layerField] = input.type === "range" ? Number(input.value) : input.value;
      debounceSave();
      drawCanvas();
    }));
  }

  async function generateCopy() {
    const data = await post("/api/card-news/generate-copy", { ...project, planning: project.planning, promptDesign: project.prompt });
    if (!data) return;
    project.copy = { ...project.copy, ...data.copy };
    loadCopy();
    save();
    render();
  }

  async function generateFlux() {
    if (project.flux.used) return;
    window.LoreAXUsage?.trackAiGenerate?.(COURSE_ID, "flux_generation", { provider: "flux" });
    const data = await post("/api/card-news/generate-flux", { ...project, planning: project.planning, prompt: project.copy.fluxPrompt, idempotencyKey: `${project.projectId}:flux_generation` });
    if (!data) return window.LoreAXUsage?.trackAiGenerateResult?.(COURSE_ID, false, { provider: "flux" });
    project.flux.imageUrl = data.imageUrl;
    project.flux.used = true;
    window.LoreAXUsage?.trackAiGenerateResult?.(COURSE_ID, true, { provider: "flux" });
    save();
    render();
  }

  async function generateGpt() {
    if (project.gpt.used) return;
    window.LoreAXUsage?.trackAiGenerate?.(COURSE_ID, "gpt_integrated_generation", { provider: "gpt" });
    const data = await post("/api/card-news/generate-gpt", { ...project, planning: project.planning, copy: project.copy, prompt: project.copy.gptPrompt, idempotencyKey: `${project.projectId}:gpt_integrated_generation` });
    if (!data) return window.LoreAXUsage?.trackAiGenerateResult?.(COURSE_ID, false, { provider: "gpt" });
    project.gpt.imageUrl = data.imageUrl;
    project.gpt.used = true;
    window.LoreAXUsage?.trackAiGenerateResult?.(COURSE_ID, true, { provider: "gpt" });
    save();
    render();
  }

  async function post(url, body) {
    try {
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, projectId: project.projectId || readProjectId(), tenantId: tenantId(), anonymousStudentId: studentId(), currentStep: project.currentStep }) });
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error(data.message || (data.code === "CARDNEWS_GENERATION_LIMIT" ? LABELS.limit : "\uc694\uccad\uc744 \ucc98\ub9ac\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4."));
      return data;
    } catch (error) {
      alert(error.message || "\uc694\uccad\uc744 \ucc98\ub9ac\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4.");
      return null;
    }
  }

  function loadCopy() {
    project.flux.layers[0].text = project.copy.title || project.planning.topic;
    project.flux.layers[1].text = project.copy.subtitle || project.planning.message;
    project.flux.layers[2].text = project.copy.cta || "\uc790\uc138\ud788 \ubcf4\uae30";
  }

  function resetLayout() {
    project.flux.layers = structuredClone(DEFAULT_PROJECT.flux.layers);
    loadCopy();
    save(false);
    render();
  }

  function resetProject() {
    localStorage.removeItem(storageKey());
    localStorage.removeItem(legacyStorageKey());
    const projectId = crypto.randomUUID ? crypto.randomUUID() : `cardnews_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(projectIdKey(), projectId);
    Object.assign(project, merge(structuredClone(DEFAULT_PROJECT), { projectId, currentStep: 0 }));
    save();
    render();
  }

  function buildGptPrompt() {
    return `Make one 1080x1080 news card. Title: ${project.copy.title}. Subtitle: ${project.copy.subtitle}. CTA: ${project.copy.cta}. Use only these facts: ${project.planning.facts}.`;
  }

  function summary() {
    return `\uc120\ud0dd \ucd94\ucc9c\uc8fc\uc81c: ${project.planning.selectedExampleId || "-"}\n\uacf5\uc2dd \ucd9c\ucc98: ${project.planning.sourceLabel || "-"}\n\uacf5\uc2dd \ub9c1\ud06c: ${project.planning.sourceUrl || "-"}\n\uc8fc\uc81c: ${project.planning.topic || "-"}\n\ub300\uc0c1: ${project.planning.audience || "-"}\n\ubaa9\uc801: ${project.planning.purpose || "-"}\n\ud575\uc2ec \uba54\uc2dc\uc9c0: ${project.planning.message || "-"}\n\ud655\uc778\ub41c \uc0ac\uc2e4: ${project.planning.facts || "-"}\n\ubd84\uc704\uae30: ${project.planning.mood || "-"}`;
  }

  function drawCanvas() {
    const canvas = document.querySelector("#cardCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 1080, 1080);
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, "#eaf3ff");
    gradient.addColorStop(0.6, "#ffffff");
    gradient.addColorStop(1, "#dffbf2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "rgba(36,87,214,.18)";
    ctx.beginPath();
    ctx.arc(860, 200, 260, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#102a66";
    ctx.fillRect(0, 850, 1080, 230);
    project.flux.layers.forEach((layer) => {
      if (!layer.text) return;
      ctx.font = `900 ${layer.size}px Arial`;
      ctx.fillStyle = layer.color;
      wrap(ctx, layer.text, layer.x, layer.y, 820, layer.size * 1.25);
    });
    project.flux.finalImage = canvas.toDataURL("image/png");
  }

  function wrap(ctx, text, x, y, max, lineHeight) {
    const words = String(text).split(/\s+/);
    let line = "";
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > max && line) {
        ctx.fillText(line, x, y);
        y += lineHeight;
        line = word;
      } else {
        line = test;
      }
    });
    if (line) ctx.fillText(line, x, y);
  }

  function canvasData() {
    drawCanvas();
    return document.querySelector("#cardCanvas")?.toDataURL("image/png") || "";
  }

  function downloadFinal() {
    const image = project.final.selected === "gpt" ? project.gpt.imageUrl : project.flux.finalImage || canvasData();
    if (!image) return alert("\ucd5c\uc885 \uacb0\uacfc\ubb3c\uc744 \uba3c\uc800 \uc120\ud0dd\ud558\uc138\uc694.");
    download(image, "loreax-card-news-final.png");
  }

  function download(dataUrl, filename) {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  function submit() {
    if (!project.final.selected) return alert("\ucd5c\uc885 \uacb0\uacfc\ubb3c\uc744 \uba3c\uc800 \uc120\ud0dd\ud558\uc138\uc694.");
    if (!project.final.reflection) return alert("\uc120\ud0dd \uc774\uc720\ub97c \uc9e7\uac8c \uc791\uc131\ud558\uc138\uc694.");
    project.final.submittedAt = new Date().toISOString();
    save();
    window.LoreAXUsage?.trackReportSubmit?.(COURSE_ID, { selectedMethod: project.final.selected });
    fetch("/api/card-news/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) }).catch(() => {});
    alert("\uc81c\ucd9c\ub418\uc5c8\uc2b5\ub2c8\ub2e4.");
  }

  function localizeShell() {
    document.title = "AI \ub274\uc2a4\uce74\ub4dc \uc81c\uc791 \ud504\ub85c\uc81d\ud2b8 | LoreAX Class";
    const back = document.querySelector(".back-link");
    if (back) back.textContent = "\uc218\uc5c5 \ud3ec\ud138\ub85c \ub3cc\uc544\uac00\uae30";
    const eyebrow = document.querySelector(".eyebrow");
    if (eyebrow) eyebrow.textContent = "90\ubd84 \uc218\uc5c5 \ud504\ub85c\uc81d\ud2b8";
    const title = document.querySelector(".hero h1");
    if (title) title.textContent = "AI \ub274\uc2a4\uce74\ub4dc \uc81c\uc791";
    const desc = document.querySelector(".hero p");
    if (desc) desc.textContent = "\ud558\ub098\uc758 \uba54\uc2dc\uc9c0\ub97c \uae30\ud68d\ud558\uace0, \ud504\ub86c\ud504\ud2b8\ub97c \uc124\uacc4\ud55c \ub4a4 Flux \ubc29\uc2dd\uacfc GPT \ud1b5\ud569 \ubc29\uc2dd\uc744 \ube44\uad50\ud574 \ucd5c\uc885 \ub274\uc2a4\uce74\ub4dc PNG 1\uc7a5\uc744 \uc81c\ucd9c\ud569\ub2c8\ub2e4.";
    const small = document.querySelector(".status-card small");
    if (small) small.textContent = "Flux 1\ud68c \u00b7 GPT 1\ud68c";
    if (dom.saveStatus) dom.saveStatus.textContent = LABELS.savedLocal;
    if (dom.stepper) dom.stepper.setAttribute("aria-label", "\ub274\uc2a4\uce74\ub4dc \uc81c\uc791 \ub2e8\uacc4");
    if (dom.prev) dom.prev.textContent = "\uc774\uc804";
    if (dom.save) dom.save.textContent = "\uc784\uc2dc \uc800\uc7a5";
  }

  async function restoreFromServer() {
    if (isRemoteLoaded) return;
    isRemoteLoaded = true;
    try {
      const params = new URLSearchParams({ tenantId: tenantId(), anonymousStudentId: studentId(), projectId: project.projectId || readProjectId() });
      const response = await fetch(`/api/card-news/save-project?${params}`);
      if (!response.ok) return;
      const data = await response.json();
      const remote = data.project?.project_data;
      if (!remote) return;
      const localTime = new Date(project.updatedAt || 0).getTime();
      const remoteTime = new Date(data.project?.updated_at || remote.updatedAt || 0).getTime();
      if (remoteTime >= localTime) {
        Object.assign(project, merge(structuredClone(DEFAULT_PROJECT), { ...remote, projectId: project.projectId }));
        localStorage.setItem(storageKey(), JSON.stringify(project));
        render();
      }
    } catch {
      // localStorage fallback stays active.
    }
  }

  dom.stepper.addEventListener("click", (event) => {
    const button = event.target.closest("[data-step]");
    if (!button) return;
    project.currentStep = Number(button.dataset.step);
    save(false);
    render();
  });
  dom.prev.addEventListener("click", () => {
    project.currentStep = Math.max(0, project.currentStep - 1);
    save();
    render();
  });
  dom.save.addEventListener("click", () => save());
  dom.next.addEventListener("click", () => {
    if (project.currentStep === 4) return submit();
    project.currentStep = Math.min(STEPS.length - 1, project.currentStep + 1);
    save();
    render();
  });

  localizeShell();
  window.LoreAXTenant?.applyTenantBranding?.();
  window.LoreAXTenant?.applyTenantLinks?.();
  window.LoreAXUsage?.trackCourseOpen?.(COURSE_ID, { page: "card-news" });
  render();
  restoreFromServer();
})();
