(function () {
  const COURSE_ID = "cardNews";
  const STEPS = [
    { id: "plan", title: "\uc8fc\uc81c\u00b7\uae30\ud68d" },
    { id: "prompt", title: "\ud504\ub86c\ud504\ud2b8 \uc124\uacc4" },
    { id: "flux", title: "\ubc30\uacbd \uc0dd\uc131+\uae00 \ubc30\uce58" },
    { id: "gpt", title: "\ud55c \ubc88\uc5d0 \uc790\ub3d9 \uc81c\uc791" },
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
  const GIMPO_TOPIC_FIXES = {
    "gimpo-culture-calendar": { label: "\uae40\ud3ec \ubb38\ud654\ud589\uc0ac", sourceLabel: "\uae40\ud3ec\uc2dc \ubb38\ud654\ud589\uc0ac\uc77c\uc815", description: "\uae40\ud3ec\uc2dc \ubb38\ud654\ud589\uc0ac \uc548\ub0b4", planning: { topic: "\uae40\ud3ec\uc2dc \ubb38\ud654\ud589\uc0ac \uc548\ub0b4", audience: "\uae40\ud3ec\uc2dc\uc758 \uc804\uc2dc\u00b7\uacf5\uc5f0\u00b7\ucd95\uc81c \uc815\ubcf4\ub97c \ucc3e\ub294 \uc2dc\ubbfc", purpose: "\uae40\ud3ec\uc2dc\uc5d0\uc11c \uc5f4\ub9ac\ub294 \ubb38\ud654\ud589\uc0ac\ub97c \uc54c\ub9ac\uace0 \ucc38\uc5ec\ub97c \uc720\ub3c4\ud55c\ub2e4.", message: "\uae40\ud3ec\uc5d0\uc11c \uc5f4\ub9ac\ub294 \ub2e4\uc591\ud55c \ubb38\ud654\ud589\uc0ac\ub97c \ud655\uc778\ud574 \ubcf4\uc138\uc694.", mood: "\ubb38\ud654\uc801\uc774\uace0 \ubc1d\uc73c\uba70 \uc815\ubcf4\uac00 \uba85\ud655\ud55c \ubd84\uc704\uae30", facts: "\ud589\uc0ac\uba85\n\ud589\uc0ac \ub0a0\uc9dc\uc640 \uc2dc\uac04\n\ud589\uc0ac \uc7a5\uc18c\n\ucc38\uc5ec \ub610\ub294 \uad00\ub78c \ubc29\ubc95", requiredFacts: ["\ud589\uc0ac\uba85", "\ud589\uc0ac \ub0a0\uc9dc\uc640 \uc2dc\uac04", "\ud589\uc0ac \uc7a5\uc18c", "\ucc38\uc5ec \ub610\ub294 \uad00\ub78c \ubc29\ubc95"] } },
    "gimpo-art-program": { label: "\uae40\ud3ec \uc608\uc220\uccb4\ud5d8", sourceLabel: "\uae40\ud3ec\ubb38\ud654\uc7ac\ub2e8 \uad50\uc721\u00b7\uccb4\ud5d8", description: "\uae40\ud3ec\ubb38\ud654\uc7ac\ub2e8 \uc608\uc220\uad50\uc721\u00b7\uccb4\ud5d8 \ud504\ub85c\uadf8\ub7a8 \uc548\ub0b4", planning: { topic: "\uae40\ud3ec\ubb38\ud654\uc7ac\ub2e8 \uc608\uc220\uad50\uc721\u00b7\uccb4\ud5d8 \ud504\ub85c\uadf8\ub7a8 \uc548\ub0b4", audience: "\uae40\ud3ec\uc2dc\uc758 \ubb38\ud654\uc608\uc220 \uccb4\ud5d8\uc5d0 \uad00\uc2ec \uc788\ub294 \uc2dc\ubbfc\uacfc \uac00\uc871", purpose: "\uae40\ud3ec\ubb38\ud654\uc7ac\ub2e8\uc758 \uad50\uc721\u00b7\uccb4\ud5d8 \ud504\ub85c\uadf8\ub7a8\uc744 \uc18c\uac1c\ud558\uace0 \uc2e0\uccad\uc744 \uc720\ub3c4\ud55c\ub2e4.", message: "\uae40\ud3ec\uc5d0\uc11c \ub2e4\uc591\ud55c \ubb38\ud654\uc608\uc220 \ud504\ub85c\uadf8\ub7a8\uc744 \uc9c1\uc811 \uccb4\ud5d8\ud574 \ubcf4\uc138\uc694.", mood: "\ucc3d\uc758\uc801\uc774\uace0 \uce5c\uadfc\ud558\uba70 \uc990\uac70\uc6b4 \ubd84\uc704\uae30", facts: "\ud504\ub85c\uadf8\ub7a8\uba85\n\uc6b4\uc601 \uae30\uac04\n\uc6b4\uc601 \uc7a5\uc18c\n\ucc38\uc5ec \ub300\uc0c1\n\uc2e0\uccad \ubc29\ubc95", requiredFacts: ["\ud504\ub85c\uadf8\ub7a8\uba85", "\uc6b4\uc601 \uae30\uac04", "\uc6b4\uc601 \uc7a5\uc18c", "\ucc38\uc5ec \ub300\uc0c1", "\uc2e0\uccad \ubc29\ubc95"] } },
    "gimpo-museum-event": { label: "\uae40\ud3ec \uc804\uc2dc\u00b7\ud589\uc0ac", sourceLabel: "\uae40\ud3ec\ubb38\ud654\uc7ac\ub2e8", description: "\uae40\ud3ec\ubb38\ud654\uc7ac\ub2e8 \uc804\uc2dc\u00b7\ud589\uc0ac \uc18c\uac1c", planning: { topic: "\uae40\ud3ec\ubb38\ud654\uc7ac\ub2e8 \uc804\uc2dc\u00b7\ud589\uc0ac \uc18c\uac1c", audience: "\uae40\ud3ec\uc2dc\uc758 \uc804\uc2dc\uc640 \uc9c0\uc5ed \ubb38\ud654\ud589\uc0ac\uc5d0 \uad00\uc2ec \uc788\ub294 \uc2dc\ubbfc", purpose: "\ud604\uc7ac \uc9c4\ud589\ub418\uac70\ub098 \uc608\uc815\ub41c \uae40\ud3ec\uc758 \uc804\uc2dc\u00b7\ud589\uc0ac\ub97c \uc54c\ub9b0\ub2e4.", message: "\uae40\ud3ec \uacf3\uacf3\uc5d0\uc11c \uc5f4\ub9ac\ub294 \uc804\uc2dc\uc640 \ubb38\ud654\ud589\uc0ac\ub97c \ub9cc\ub098\ubcf4\uc138\uc694.", mood: "\uc138\ub828\ub418\uace0 \ubb38\ud654\uc801\uc774\uba70 \uc2e0\ub8b0\uac10 \uc788\ub294 \ubd84\uc704\uae30", facts: "\uc804\uc2dc \ub610\ub294 \ud589\uc0ac\uba85\n\uc6b4\uc601 \uae30\uac04\n\uc6b4\uc601 \uc7a5\uc18c\n\uad00\ub78c \ub610\ub294 \ucc38\uc5ec \ubc29\ubc95", requiredFacts: ["\uc804\uc2dc \ub610\ub294 \ud589\uc0ac\uba85", "\uc6b4\uc601 \uae30\uac04", "\uc6b4\uc601 \uc7a5\uc18c", "\uad00\ub78c \ub610\ub294 \ucc38\uc5ec \ubc29\ubc95"] } },
    "gimpo-performance": { label: "\uae40\ud3ec \uacf5\uc5f0", sourceLabel: "\uae40\ud3ec\ubb38\ud654\uc7ac\ub2e8 \uacf5\uc5f0 \uc548\ub0b4", description: "\uae40\ud3ec\uc544\ud2b8\ud640 \uacf5\uc5f0 \uc548\ub0b4", planning: { topic: "\uae40\ud3ec\uc544\ud2b8\ud640 \uacf5\uc5f0 \uc548\ub0b4", audience: "\uac00\uc871\uacfc \ud568\uaed8 \uacf5\uc5f0\uc744 \uad00\ub78c\ud558\ub824\ub294 \uae40\ud3ec \uc2dc\ubbfc", purpose: "\uae40\ud3ec\uc544\ud2b8\ud640 \uacf5\uc5f0 \uc815\ubcf4\ub97c \uc804\ub2ec\ud558\uace0 \uad00\ub78c\uc744 \uc720\ub3c4\ud55c\ub2e4.", message: "\uac00\uc871\uacfc \ud568\uaed8 \uae40\ud3ec\uc5d0\uc11c \uc990\uac70\uc6b4 \uacf5\uc5f0\uc744 \ub9cc\ub098\ubcf4\uc138\uc694.", mood: "\ubc1d\uace0 \uc990\uac70\uc6b0\uba70 \uac00\uc871 \uce5c\ud654\uc801\uc778 \ubd84\uc704\uae30", facts: "\uacf5\uc5f0\uba85\n\uacf5\uc5f0 \ub0a0\uc9dc\uc640 \uc2dc\uac04\n\uacf5\uc5f0 \uc7a5\uc18c\n\uad00\ub78c \uc5f0\ub839\n\uc608\ub9e4 \ubc29\ubc95", requiredFacts: ["\uacf5\uc5f0\uba85", "\uacf5\uc5f0 \ub0a0\uc9dc\uc640 \uc2dc\uac04", "\uacf5\uc5f0 \uc7a5\uc18c", "\uad00\ub78c \uc5f0\ub839", "\uc608\ub9e4 \ubc29\ubc95"] } },
    "gimpo-reservation": { label: "\uae40\ud3ec \ubaa8\uc9d1\u00b7\uccb4\ud5d8", sourceLabel: "\uae40\ud3ec\uc2dc \ud1b5\ud569\uc608\uc57d", description: "\uae40\ud3ec\uc2dc \ubaa8\uc9d1\u00b7\uad50\uc721\u00b7\uccb4\ud5d8 \ud504\ub85c\uadf8\ub7a8 \uc548\ub0b4", planning: { topic: "\uae40\ud3ec\uc2dc \ubaa8\uc9d1\u00b7\uad50\uc721\u00b7\uccb4\ud5d8 \ud504\ub85c\uadf8\ub7a8 \uc548\ub0b4", audience: "\uae40\ud3ec\uc2dc\uc758 \uad50\uc721\uacfc \uccb4\ud5d8 \ud504\ub85c\uadf8\ub7a8\uc5d0 \ucc38\uc5ec\ud558\ub824\ub294 \uc2dc\ubbfc", purpose: "\uae40\ud3ec\uc2dc \ud1b5\ud569\uc608\uc57d\uc5d0\uc11c \uc2e0\uccad \uac00\ub2a5\ud55c \ud504\ub85c\uadf8\ub7a8\uc744 \uc18c\uac1c\ud558\uace0 \ucc38\uc5ec\ub97c \uc720\ub3c4\ud55c\ub2e4.", message: "\uae40\ud3ec\uc2dc\uc5d0\uc11c \uc6b4\uc601\ud558\ub294 \ub2e4\uc591\ud55c \uad50\uc721\uacfc \uccb4\ud5d8\uc5d0 \ucc38\uc5ec\ud574 \ubcf4\uc138\uc694.", mood: "\uacf5\uacf5 \uc548\ub0b4\uc5d0 \uc801\ud569\ud55c \uae54\ub054\ud558\uace0 \uc2e0\ub8b0\uac10 \uc788\ub294 \ubd84\uc704\uae30", facts: "\ud504\ub85c\uadf8\ub7a8\uba85\n\uc2e0\uccad \uae30\uac04\n\uc6b4\uc601 \uc77c\uc2dc\n\uc6b4\uc601 \uc7a5\uc18c\n\uc2e0\uccad \ub300\uc0c1\uacfc \ubc29\ubc95", requiredFacts: ["\ud504\ub85c\uadf8\ub7a8\uba85", "\uc2e0\uccad \uae30\uac04", "\uc6b4\uc601 \uc77c\uc2dc", "\uc6b4\uc601 \uc7a5\uc18c", "\uc2e0\uccad \ub300\uc0c1\uacfc \ubc29\ubc95"] } },
    custom: { label: "\uc9c1\uc811 \uc8fc\uc81c \uc785\ub825", sourceLabel: "", description: "\uc9c1\uc811 \uc8fc\uc81c \uc785\ub825", planning: null },
  };
  GIMPO_TOPIC_EXAMPLES.forEach((example) => Object.assign(example, GIMPO_TOPIC_FIXES[example.id] || {}));

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
    prompt: { generationMode: "flux", role: "\uce74\ub4dc\ub274\uc2a4 \uae30\ud68d\uc790", task: "\uc9c0\uc5ed \ud589\uc0ac \ud64d\ubcf4\uc6a9 \uc20f\ud3fc \uce74\ub4dc\ub274\uc2a4 \uc81c\uc791", audience: "", context: "", format: "9:16 \uc138\ub85c\ud615 \ubaa8\ubc14\uc77c \uce74\ub4dc\ub274\uc2a4", style: "\uce5c\uadfc\ud558\uace0 \ucc3d\uc758\uc801\uc778 \ud64d\ubcf4 \uc2a4\ud0c0\uc77c", rules: fluxRules() },
    copy: { title: "", subtitle: "", cta: "", fluxPrompt: "", gptPrompt: "", negativePrompt: "", metaPrompt: "", generationMode: "flux", promptStatus: "" },
    flux: { used: false, imageUrl: "", finalImage: "", status: "", message: "", layers: [{ id: "title", text: "", x: 80, y: 120, size: 58, color: "#0f172a" }, { id: "subtitle", text: "", x: 80, y: 420, size: 36, color: "#1e293b" }, { id: "cta", text: "", x: 80, y: 820, size: 30, color: "#ffffff" }] },
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
    if (index === 1) return project.copy.title && (project.prompt.generationMode === "gpt_integrated" ? project.copy.gptPrompt : project.copy.fluxPrompt);
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
          "\ub514\uc790\uc778 \uc0ac\uace0\uc758 \uc815\uc758 \ub2e8\uacc4(Define)\ub294 \uc0ac\ub78c\uc744 \uc774\ud574\ud558\ub294 \uacf5\uac10 \ub2e8\uacc4(Empathize) \uc774\ud6c4, \ud574\uacb0\ud574\uc57c \ud560 \ubb38\uc81c\ub97c \uc120\uba85\ud558\uac8c \uc815\ub9ac\ud558\ub294 \uacfc\uc815\uc785\ub2c8\ub2e4.",
          "\uc804\uccb4 \ud750\ub984\uc740 \uacf5\uac10(Empathize) \u2192 \ubb38\uc81c \uc815\uc758(Define) \u2192 \uc544\uc774\ub514\uc5b4 \ubc1c\uc0c1(Ideate) \u2192 \uc2dc\uc81c\ud488 \uc81c\uc791(Prototype) \u2192 \ud14c\uc2a4\ud2b8(Test)\uc758 \uc21c\uc11c\ub85c \uc774\ud574\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
          "\uce74\ub4dc\ub274\uc2a4\uc5d0\uc11c\ub3c4 \uc8fc\uc81c\uc640 \ubaa9\uc801\uc744 \uba3c\uc800 \uc815\ud574\uc57c AI\uac00 \ud544\uc694\ud55c \uc815\ubcf4\ub97c \uc5b4\ub5a4 \ubc29\ud5a5\uc73c\ub85c \uc815\ub9ac\ud574\uc57c \ud558\ub294\uc9c0 \ud310\ub2e8\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        ],
        source: "Brown, T. (2008). Design Thinking. Harvard Business Review. / Stanford d.school Design Thinking Process.",
      },
      {
        title: "\uc88b\uc740 \ucf58\ud150\uce20\ub294 \ub300\uc0c1(\ud0c0\uae43 \uc624\ub514\uc5b8\uc2a4, Target Audience)\uc5d0\uc11c \uc2dc\uc791\ud55c\ub2e4",
        body: [
          "\uac19\uc740 \uc815\ubcf4\ub77c\ub3c4 \ub204\uad6c\uc5d0\uac8c \uc804\ub2ec\ud558\ub294\uc9c0\uc5d0 \ub530\ub77c \uc81c\ubaa9, \uc5b4\ud718, \uc774\ubbf8\uc9c0, \uc124\uba85 \ubc29\uc2dd\uc774 \ub2ec\ub77c\uc838\uc57c \ud569\ub2c8\ub2e4.",
          "\uc774\ub97c \uc124\uba85\ud558\ub294 \uc2dc\uc7a5 \uc138\ubd84\ud654\u00b7\ud0c0\uae43\ud305\u00b7\ud3ec\uc9c0\uc154\ub2dd \uc804\ub7b5(STP Marketing)\uc740 \uc138\ubd84\ud654(Segmentation), \ud0c0\uae43\ud305(Targeting), \ud3ec\uc9c0\uc154\ub2dd(Positioning)\uc758 \uc21c\uc11c\ub85c \uc774\ud574\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
          "\uce74\ub4dc\ub274\uc2a4\uc5d0\uc11c \ub300\uc0c1\uc744 \uc815\ud558\ub294 \uc77c\uc740 \ub2e8\uc21c \ud615\uc2dd\uc774 \uc544\ub2c8\ub77c, \uc815\ubcf4\uc758 \uae4a\uc774\uc640 \ud45c\ud604 \uc218\uc900\uc744 \uc815\ud558\ub294 \uae30\ud68d \ud310\ub2e8\uc785\ub2c8\ub2e4.",
        ],
        source: "Kotler & Keller, Marketing Management.",
      },
      {
        title: "\uce74\ub4dc\ub274\uc2a4\ub294 \uc815\ubcf4 \uc804\ub2ec \uad6c\uc870\ub97c \uac00\uc9c4 \ucee4\ubba4\ub2c8\ucf00\uc774\uc158 \ucf58\ud150\uce20\ub2e4",
        body: [
          "\uce74\ub4dc\ub274\uc2a4\ub294 \uc608\uc05c \uc774\ubbf8\uc9c0 \ud558\ub098\uac00 \uc544\ub2c8\ub77c, \uc0ac\ub78c\uc758 \uc8fc\uc758\ub97c \ub04c\uace0 \ud544\uc694\ud55c \uc815\ubcf4\ub97c \uc804\ub2ec\ud558\uba70 \ud589\ub3d9\uc744 \uc720\ub3c4\ud558\ub294 \ubbf8\ub514\uc5b4\uc785\ub2c8\ub2e4.",
          "\uc544\uc774\ub2e4(AIDA) \ubaa8\ub378\uc740 \uc8fc\uc758(Attention), \uad00\uc2ec(Interest), \uc695\uad6c(Desire), \ud589\ub3d9(Action)\uc758 \uad6c\uc870\ub85c \uc124\uba85\ub429\ub2c8\ub2e4.",
          "\uc81c\ubaa9\uc740 \uc8fc\uc758(Attention)\ub97c, \uc9e7\uc740 \ubcf8\ubb38\uc740 \uad00\uc2ec(Interest)\uacfc \uc695\uad6c(Desire)\ub97c, \ud589\ub3d9 \uc720\ub3c4 \ubb38\uad6c\ub294 \ud589\ub3d9(Action)\uc744 \ub9e1\uc2b5\ub2c8\ub2e4.",
          "\ub530\ub77c\uc11c 1\ub2e8\uacc4\uc5d0\uc11c \ud575\uc2ec \uba54\uc2dc\uc9c0\uc640 \ud544\uc218 \uc815\ubcf4\ub97c \uc815\ub9ac\ud558\ub294 \uc77c\uc740 \ub2e4\uc74c \ub2e8\uacc4\uc758 \ud504\ub86c\ud504\ud2b8 \uc124\uacc4\uc640 \uc9c1\uc811 \uc5f0\uacb0\ub429\ub2c8\ub2e4.",
        ],
        source: "Strong, E. K. (1925). Theories of Selling.",
      },
    ];
    return `<details class="planning-theory-panel" aria-label="\ucf58\ud150\uce20 \uae30\ud68d \uc774\ub860">
      <summary class="planning-theory-title"><span aria-hidden="true">\ud83d\udcd8</span><h3>\ubc30\uc6b0\uae30 | AI \uc2dc\ub300 \ucf58\ud150\uce20 \uae30\ud68d\uc758 \uc2dc\uc791: \uc88b\uc740 \uc8fc\uc81c \ub9cc\ub4e4\uae30</h3><i aria-hidden="true">\u203a</i></summary>
      <div class="planning-theory-list">${items.map(theoryAccordion).join("")}</div>
      <div class="planning-checklist"><strong>\uae30\ud68d \uccb4\ud06c\ub9ac\uc2a4\ud2b8</strong><ul><li>\ub300\uc0c1(\ud0c0\uae43 \uc624\ub514\uc5b8\uc2a4, Target Audience)</li><li>\ubaa9\uc801(Objective)</li><li>\ud575\uc2ec \uba54\uc2dc\uc9c0(Core Message)</li><li>\ud544\uc218 \uc815\ubcf4(Facts)</li></ul></div>
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
    ensurePromptDefaults();
    const mode = project.prompt.generationMode || "flux";
    return `<div class="step-title"><div><span class="badge">2\ub2e8\uacc4</span><h2>\ud504\ub86c\ud504\ud2b8 \uc124\uacc4</h2></div><button id="generateCopy" class="primary-button" type="button">${promptGenerateButtonLabel()}</button></div>
    <div class="layout"><section class="card field-grid">
      ${generationModeView(mode)}
      <div class="prompt-rule-note">\uc0dd\uc131 \uaddc\uce59\uc740 \uc774\ubbf8\uc9c0 \uc0dd\uc131 AI\uac00 \uc9c0\ucf1c\uc57c \ud560 \uc870\uac74\uc774\uba70, \ub3d9\uc2dc\uc5d0 AI\uc5d0\uac8c \uc804\ub2ec\ud558\ub294 \ud504\ub86c\ud504\ud2b8 \uc124\uacc4 \uae30\uc900\uc785\ub2c8\ub2e4.</div>
      <div class="field-grid two">${field("prompt", "role", "\uc5ed\ud560")}${field("prompt", "task", "\uacfc\uc5c5")}</div>
      <div class="field-grid two">${field("prompt", "audience", "\ub300\uc0c1")}${field("prompt", "context", "\ub9e5\ub77d")}</div>
      <div class="field-grid two">${field("prompt", "format", "\ud615\uc2dd")}${field("prompt", "style", "\uc2a4\ud0c0\uc77c")}</div>
      ${field("prompt", "rules", "\uc0dd\uc131 \uaddc\uce59", true)}
    </section><aside class="preview-card field-grid">
      ${field("copy", "title", "\uc81c\ubaa9")}
      ${field("copy", "subtitle", "\ubcf4\uc870 \ubb38\uad6c")}
      ${field("copy", "cta", "\ud589\ub3d9 \uc720\ub3c4 \ubb38\uad6c")}
      ${promptResultView(mode)}
      <button id="copyPrompt" class="ghost-button" type="button">\uc804\uccb4 \ud504\ub86c\ud504\ud2b8 \ubcf5\uc0ac</button>
      <p class="notice">API\uac00 \uc2e4\ud328\ud558\uba74 \uc704 \ubc84\ud2bc\uc73c\ub85c \ubcf5\uc0ac\ud55c \ub0b4\uc6a9\uc744 ChatGPT\ub098 Gemini\uc5d0 \ubd99\uc5ec\ub123\uc5b4 \uac19\uc740 \uc804\ubb38 \ud504\ub86c\ud504\ud2b8\ub97c \ub9cc\ub4e4 \uc218 \uc788\uc2b5\ub2c8\ub2e4.</p>
    </aside></div>${promptTheoryView()}`;
  }

  function generationModeView(mode) {
    const activeFlux = mode === "flux" ? "is-active" : "";
    const activeGpt = mode === "gpt_integrated" ? "is-active" : "";
    return `<section class="generation-mode-panel" aria-label="AI \uc81c\uc791 \ubc29\uc2dd \uc120\ud0dd">
      <h3>AI \uc81c\uc791 \ubc29\uc2dd \uc120\ud0dd</h3>
      <div class="generation-mode-grid">
        <button class="generation-mode-card ${activeFlux}" data-generation-mode="flux" type="button">
          <strong>Flux \uc774\ubbf8\uc9c0 \uc0dd\uc131 + \ud14d\uc2a4\ud2b8 \uc624\ubc84\ub808\uc774</strong>
          <span>AI\ub294 \ubc30\uacbd \uc774\ubbf8\uc9c0\uc640 \uc2dc\uac01 \uc694\uc18c\ub97c \uc81c\uc791\ud558\uace0, \ud14d\uc2a4\ud2b8\ub294 \uc774\ud6c4 \ud3b8\uc9d1 \ub2e8\uacc4\uc5d0\uc11c \uc0ac\ub78c\uc774 \ucd94\uac00\ud569\ub2c8\ub2e4.</span>
          <em>\uc774\ubbf8\uc9c0 \ud488\uc9c8 \uc911\uc2ec \u00b7 \ud55c\uae00 \ud14d\uc2a4\ud2b8 \uc624\ub958 \uac10\uc18c \u00b7 \uc9c1\uc811 \ud3b8\uc9d1 \uac00\ub2a5</em>
        </button>
        <button class="generation-mode-card ${activeGpt}" data-generation-mode="gpt_integrated" type="button">
          <strong>GPT \ud1b5\ud569 \uce74\ub4dc \uc81c\uc791</strong>
          <span>AI\uac00 \uc774\ubbf8\uc9c0\uc640 \ud14d\uc2a4\ud2b8\uac00 \ud3ec\ud568\ub41c \uc644\uc131\ud615 \uce74\ub4dc\ub274\uc2a4\ub97c \uc81c\uc791\ud569\ub2c8\ub2e4.</span>
          <em>\ube60\ub978 \uc644\uc131\ud615 \uc81c\uc791 \u00b7 \uc544\uc774\ub514\uc5b4 \ud655\uc778 \uc6a9\uc774 \u00b7 \ud14d\uc2a4\ud2b8 \ubc30\uce58\uae4c\uc9c0 AI \uc218\ud589</em>
        </button>
      </div>
    </section>`;
  }

  function promptResultView(mode) {
    const promptKey = mode === "gpt_integrated" ? "gptPrompt" : "fluxPrompt";
    const promptLabel = mode === "gpt_integrated" ? "GPT \ud1b5\ud569 \uc81c\uc791\uc6a9 \ud504\ub86c\ud504\ud2b8" : "Flux \uc774\ubbf8\uc9c0 \uc0dd\uc131\uc6a9 \ud504\ub86c\ud504\ud2b8";
    const defaultNegative = mode === "gpt_integrated" ? gptNegativeDefault() : fluxNegativeDefault();
    const promptValue = project.copy[promptKey] || "";
    const negativeValue = project.copy.negativePrompt || defaultNegative;
    return `<h3>${promptLabel}</h3><textarea class="prompt-editor" data-copy-prompt="${promptKey}" placeholder="\uc544\uc9c1 \uc0dd\uc131\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4.">${esc(promptValue)}</textarea>
      <h3>Negative Prompt</h3><textarea class="prompt-editor prompt-editor-small" data-copy-prompt="negativePrompt">${esc(negativeValue)}</textarea>`;
  }

  function promptGenerateButtonLabel() {
    if (project.copy.promptStatus === "done") return "\u2713 \ud504\ub86c\ud504\ud2b8 \uc0dd\uc131 \uc644\ub8cc";
    if (project.copy.promptStatus === "error") return "\u26a0 \uc0dd\uc131 \uc2e4\ud328";
    return "\u2728 AI \ud504\ub86c\ud504\ud2b8 \uc0dd\uc131";
  }

  function fluxNegativeDefault() {
    return "no text,\nno letters,\nno numbers,\nno logo,\nno watermark,\nno fake information,\nno unreadable characters,\nno cluttered layout";
  }

  function gptNegativeDefault() {
    return "Do not create:\n- incorrect Korean text\n- fake dates or information\n- unnecessary logos\n- unreadable typography\n- excessive decorative elements";
  }

  function oldPromptResultView(mode) {
    if (mode === "gpt_integrated") {
      return `<h3>GPT \ud1b5\ud569 \uc81c\uc791\uc6a9 \ud504\ub86c\ud504\ud2b8</h3><div class="prompt-box">${esc(project.copy.gptPrompt || "\uc544\uc9c1 \uc0dd\uc131\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4.")}</div>`;
    }
    return `<h3>Flux \uc774\ubbf8\uc9c0 \uc0dd\uc131\uc6a9 \ud504\ub86c\ud504\ud2b8</h3><div class="prompt-box">${esc(project.copy.fluxPrompt || "\uc544\uc9c1 \uc0dd\uc131\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4.")}</div>
      <h3>Negative Prompt</h3><div class="prompt-box">${esc(project.copy.negativePrompt || "no text,\nno letters,\nno numbers,\nno logo,\nno watermark")}</div>`;
  }

  function promptTheoryView() {
    const items = [
      {
        title: "프롬프트는 AI에게 전달하는 설계 문서다",
        body: [
          "생성형 AI는 사용자가 준 맥락을 바탕으로 결과를 만듭니다. 그래서 짧게 “카드뉴스 만들어 줘”라고 쓰는 것보다, 필요한 정보와 조건을 구조화해서 전달해야 원하는 결과에 가까워집니다.",
          "인간과 컴퓨터의 상호작용(Human Computer Interaction) 관점에서 프롬프트는 사람이 AI에게 의도, 조건, 제한사항을 설명하는 인터페이스입니다.",
          "카드뉴스 제작에서는 주제, 대상, 목적, 핵심 메시지, 꼭 넣어야 할 사실을 먼저 정리해야 AI가 제목과 문구, 이미지 방향을 안정적으로 제안할 수 있습니다.",
        ],
        source: "Norman, D. A. (1988). The Design of Everyday Things. / Liu, P. et al. (2023). Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in NLP.",
      },
      {
        title: "좋은 프롬프트의 6가지 핵심 요소",
        body: [
          "역할(Persona)은 AI가 어떤 전문가처럼 답해야 하는지 정하는 요소입니다. 예를 들어 “너는 청소년 대상 카드뉴스 디자이너다”처럼 쓸 수 있습니다.",
          "과업(Task)은 AI가 해야 할 일을 분명하게 적는 부분입니다. 카드뉴스에서는 제목 만들기, 짧은 설명 쓰기, 행동 유도 문구 제안하기처럼 구체적으로 나눕니다.",
          "맥락(Context)은 주제와 배경 정보입니다. 행사명, 대상, 목적, 확인된 사실을 넣어야 AI가 임의로 내용을 만들 가능성이 줄어듭니다.",
          "대상(Target Audience)은 누가 읽을지 정하는 요소입니다. 중학생, 학부모, 지역 주민처럼 대상이 달라지면 말투와 정보 수준도 달라집니다.",
          "형식(Format)은 결과를 어떤 모양으로 받을지 정하는 요소입니다. 예를 들어 제목 1개, 보조 문구 1개, 본문 3줄, 행동 유도 문구 1개처럼 요청합니다.",
          "스타일·어조(Tone & Style)는 밝게, 신뢰감 있게, 공식 안내처럼, 친근하게처럼 표현 분위기를 정하는 요소입니다.",
        ],
        source: "White, J. et al. (2023). A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT.",
      },
      {
        title: "구조화된 프롬프트가 좋은 결과를 만드는 이유",
        body: [
          "프롬프트의 기본 흐름은 입력 요청(Prompt) → AI 모델(AI Model) → 결과(Output)로 볼 수 있습니다.",
          "입력 요청이 흐릿하면 AI 결과도 흐릿해집니다. 반대로 역할, 과업, 맥락, 대상, 형식, 어조가 정리되어 있으면 AI가 무엇을 우선해야 하는지 더 잘 판단합니다.",
          "구조화된 요청(Structured Prompting)은 AI에게 생각할 순서와 출력 형식을 알려 주는 방법입니다. 카드뉴스에서는 확인된 사실을 먼저 주고, 그다음 제목과 문구를 만들게 하는 방식이 안전합니다.",
        ],
        source: "Liu, P. et al. (2023). Pre-train, Prompt, and Predict. / OpenAI Prompt Engineering Guide.",
      },
      {
        title: "AI 결과물은 검토와 수정이 필요하다",
        body: [
          "AI는 그럴듯한 문장을 만들 수 있지만, 실제 날짜, 장소, 비용, 신청 방법처럼 확인이 필요한 정보를 틀리게 쓸 수 있습니다.",
          "따라서 생성 결과는 바로 제출하지 않고 생성 → 검토 → 수정 → 완성의 순서로 다뤄야 합니다.",
          "이 수업의 입력 항목도 같은 흐름으로 연결됩니다. 1단계에서 확인된 사실을 정리하고, 2단계에서 프롬프트를 설계한 뒤, 3·4단계에서 결과물을 만들고 마지막에 사실과 표현을 다시 점검합니다.",
        ],
        source: "OpenAI Prompt Engineering Guide.",
      },
    ];
    return `<details class="planning-theory-panel prompt-theory-panel" aria-label="AI 활용 원리와 프롬프트 엔지니어링 이론">
      <summary class="planning-theory-title"><span aria-hidden="true">📘</span><h3>배우기 | AI 활용 원리와 프롬프트 설계</h3><i aria-hidden="true">›</i></summary>
      <div class="planning-theory-list">${items.map(theoryAccordion).join("")}</div>
      <div class="planning-checklist"><strong>프롬프트 설계 체크리스트</strong><ul><li>역할(Persona)</li><li>과업(Task)</li><li>맥락(Context)</li><li>대상(Target Audience)</li><li>형식(Format)</li><li>스타일·어조(Tone & Style)</li></ul></div>
      <p class="theory-source">참고자료: Norman, D. A. (1988). / White, J. et al. (2023). / Liu, P. et al. (2023). / OpenAI Prompt Engineering Guide.</p>
    </details>`;
  }

  function promptTheoryView() {
    const items = [
      {
        title: "\ud504\ub86c\ud504\ud2b8\ub294 AI\uc5d0\uac8c \uc804\ub2ec\ud558\ub294 \uce74\ub4dc\ub274\uc2a4 \uc124\uacc4 \ubb38\uc11c\ub2e4",
        body: [
          "\ud504\ub86c\ud504\ud2b8\ub294 AI\uc5d0\uac8c \u2018\ubb34\uc5c7\uc744, \ub204\uad6c\uc5d0\uac8c, \uc5b4\ub5a4 \ud615\uc2dd\uc73c\ub85c \ubcf4\uc5ec \uc904\uc9c0\u2019\ub97c \uc54c\ub824 \uc8fc\ub294 \uc124\uacc4 \ubb38\uc11c\uc785\ub2c8\ub2e4. \uce74\ub4dc\ub274\uc2a4\uc5d0\uc11c\ub294 \uc8fc\uc81c, \ub300\uc0c1, \ubaa9\uc801, \ud575\uc2ec \uc0ac\uc2e4, \uc6d0\ud558\ub294 \ubd84\uc704\uae30\ub97c \ubd84\uba85\ud788 \uc368\uc57c \ud569\ub2c8\ub2e4.",
          "\uc608\ub97c \ub4e4\uc5b4 \u2018\uce74\ub4dc\ub274\uc2a4 \ub9cc\ub4e4\uc5b4 \uc918\u2019\ub294 \ub108\ubb34 \uc9e7\uc740 \uc694\uccad\uc785\ub2c8\ub2e4. \u2018\uae40\ud3ec \ubb38\ud654\ud589\uc0ac\ub97c \uc911\ud559\uc0dd\uc5d0\uac8c \uc18c\uac1c\ud558\ub294 \uc815\uc0ac\uac01\ud615 \uce74\ub4dc\ub274\uc2a4\ub97c \ub9cc\ub4e4\uace0, \uc81c\ubaa9 1\uac1c\u00b7\ubcf8\ubb38 3\uc904\u00b7\uc2e0\uccad \uc548\ub0b4 \ubb38\uad6c 1\uac1c\ub85c \uc815\ub9ac\ud574 \uc918\u2019\ucc98\ub7fc \uc4f0\uba74 \uacb0\uacfc\uac00 \ud6e8\uc52c \uc548\uc815\uc801\uc785\ub2c8\ub2e4.",
          "\uc778\uac04\uacfc \ucef4\ud4e8\ud130\uc758 \uc0c1\ud638\uc791\uc6a9(Human Computer Interaction) \uad00\uc810\uc5d0\uc11c \ubcf4\uba74, \uc88b\uc740 \ud504\ub86c\ud504\ud2b8\ub294 \uc0ac\ub78c\uc774 AI\uc640 \uc815\ud655\ud788 \uc18c\ud1b5\ud558\uae30 \uc704\ud55c \uc870\uc791 \uc124\uba85\uc11c \uc5ed\ud560\uc744 \ud569\ub2c8\ub2e4.",
        ],
        source: "Norman, D. A. (1988). The Design of Everyday Things. / Liu, P. et al. (2023). Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in NLP.",
      },
      {
        title: "\uc88b\uc740 \uce74\ub4dc\ub274\uc2a4 \ud504\ub86c\ud504\ud2b8\uc758 6\uac00\uc9c0 \ud575\uc2ec \uc694\uc18c",
        body: [
          "\uc5ed\ud560(Persona): AI\uac00 \uc5b4\ub5a4 \uc804\ubb38\uac00\ucc98\ub7fc \ub2f5\ud560\uc9c0 \uc815\ud569\ub2c8\ub2e4. \uc608: \u2018\ub108\ub294 \uccad\uc18c\ub144 \ub300\uc0c1 \uce74\ub4dc\ub274\uc2a4 \uae30\ud68d\uc790\ub2e4.\u2019",
          "\uacfc\uc5c5(Task): AI\uac00 \ud574\uc57c \ud560 \uc77c\uc744 \uad6c\uccb4\uc801\uc73c\ub85c \uc801\uc2b5\ub2c8\ub2e4. \uc608: \u2018\uc81c\ubaa9, \ubcf4\uc870 \ubb38\uad6c, \ubcf8\ubb38 3\uc904, \ud589\ub3d9 \uc720\ub3c4 \ubb38\uad6c\ub97c \ub9cc\ub4e4\uc5b4\ub77c.\u2019",
          "\ub9e5\ub77d(Context): \ud655\uc778\ub41c \uc0ac\uc2e4\uacfc \ubc30\uacbd\uc744 \ub123\uc2b5\ub2c8\ub2e4. \uc608: \ud589\uc0ac\uba85, \ub300\uc0c1, \uc7a5\uc18c, \uae30\uac04, \uc2e0\uccad \ubc29\ubc95\ucc98\ub7fc \uce74\ub4dc\ub274\uc2a4\uc5d0 \uaf2d \ub4e4\uc5b4\uac08 \uc815\ubcf4\ub97c \uc81c\uacf5\ud569\ub2c8\ub2e4.",
          "\ub300\uc0c1(Target Audience): \ub204\uac00 \uc77d\uc744\uc9c0 \uc815\ud569\ub2c8\ub2e4. \uc608: \uc911\ud559\uc0dd, \ud559\ubd80\ubaa8, \uc9c0\uc5ed \uc8fc\ubbfc\uc5d0 \ub530\ub77c \uc5b4\ud718\uc640 \uc124\uba85 \uc218\uc900\uc774 \ub2ec\ub77c\uc9d1\ub2c8\ub2e4.",
          "\ud615\uc2dd(Format): \uacb0\uacfc\ub97c \uc5b4\ub5a4 \uad6c\uc870\ub85c \ubc1b\uc744\uc9c0 \uc815\ud569\ub2c8\ub2e4. \uc608: \u2018\ud45c \ud615\ud0dc\ub85c \uc81c\ubaa9 \ud6c4\ubcf4 3\uac1c\uc640 \uc774\uc720\ub97c \uc81c\uc2dc\ud574 \uc918\u2019\ucc98\ub7fc \uc694\uccad\ud569\ub2c8\ub2e4.",
          "\uc2a4\ud0c0\uc77c\u00b7\uc5b4\uc870(Tone & Style): \ubc1d\uac8c, \uacf5\uc2dd \uc548\ub0b4\ucc98\ub7fc, \uce5c\uadfc\ud558\uac8c, \uc2e0\ub8b0\uac10 \uc788\uac8c \ub4f1 \uce74\ub4dc\ub274\uc2a4\uc758 \ubd84\uc704\uae30\ub97c \uc815\ud569\ub2c8\ub2e4.",
        ],
        source: "White, J. et al. (2023). A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT.",
      },
      {
        title: "\uad6c\uc870\ud654\ub41c \ud504\ub86c\ud504\ud2b8\uac00 \uce74\ub4dc\ub274\uc2a4 \ud488\uc9c8\uc744 \ub192\uc778\ub2e4",
        body: [
          "AI \uacb0\uacfc\ub294 \uc785\ub825 \uc694\uccad(Prompt) \u2192 AI \ubaa8\ub378(AI Model) \u2192 \uacb0\uacfc(Output)\uc758 \ud750\ub984\uc73c\ub85c \ub9cc\ub4e4\uc5b4\uc9d1\ub2c8\ub2e4. \uc785\ub825\uc774 \ud750\ub9ac\uba74 \uacb0\uacfc\ub3c4 \ud750\ub824\uc9d1\ub2c8\ub2e4.",
          "\uce74\ub4dc\ub274\uc2a4 \ud504\ub86c\ud504\ud2b8\ub294 \u2018\uc5ed\ud560 \u2192 \uc8fc\uc81c \u2192 \ub300\uc0c1 \u2192 \ud655\uc778\ub41c \uc0ac\uc2e4 \u2192 \ucd9c\ub825 \ud615\uc2dd \u2192 \uae08\uc9c0\uc0ac\ud56d\u2019 \uc21c\uc11c\ub85c \uc4f0\uba74 \uc88b\uc2b5\ub2c8\ub2e4. \uc774 \uc21c\uc11c\uac00 \uc788\uc73c\uba74 AI\uac00 \uc784\uc758\ub85c \ub0b4\uc6a9\uc744 \ub9cc\ub4e4 \uac00\ub2a5\uc131\uc774 \uc904\uc5b4\ub4ed\ub2c8\ub2e4.",
          "\uc608\uc2dc: \u2018\ub108\ub294 \uce74\ub4dc\ub274\uc2a4 \uae30\ud68d\uc790\ub2e4. \uc8fc\uc81c\ub294 [\ud589\uc0ac\uba85]\uc774\uace0 \ub300\uc0c1\uc740 [\uc911\ud559\uc0dd]\uc774\ub2e4. \ud655\uc778\ub41c \uc0ac\uc2e4\uc740 [\ub0a0\uc9dc/\uc7a5\uc18c/\ucc38\uc5ec\ubc29\ubc95]\uc774\ub2e4. \uc81c\ubaa9 1\uac1c, \ubcf8\ubb38 3\uc904, CTA 1\uac1c\ub97c \ub9cc\ub4e4\uc5b4\ub77c. \ud655\uc778\ub418\uc9c0 \uc54a\uc740 \uc815\ubcf4\ub294 \ub9cc\ub4e4\uc9c0 \ub9c8\ub77c.\u2019",
        ],
        source: "Liu, P. et al. (2023). Pre-train, Prompt, and Predict. / OpenAI Prompt Engineering Guide.",
      },
      {
        title: "AI \uacb0\uacfc\ubb3c\uc740 \uce74\ub4dc\ub274\uc2a4\uc5d0 \ub9de\uac8c \uac80\ud1a0\ud558\uace0 \uace0\uccd0\uc57c \ud55c\ub2e4",
        body: [
          "AI\uac00 \ub9cc\ub4e0 \ubb38\uad6c\ub294 \ubc14\ub85c \uc81c\ucd9c\ud558\uc9c0 \ub9d0\uace0 \uc0ac\uc2e4 \ud655\uc778\uacfc \ud45c\ud604 \uc218\uc815\uc744 \uac70\uccd0\uc57c \ud569\ub2c8\ub2e4. \ud2b9\ud788 \ub0a0\uc9dc, \uc7a5\uc18c, \ube44\uc6a9, \uc2e0\uccad \ubc29\ubc95\uc740 \uacf5\uc2dd \uc790\ub8cc\uc640 \ube44\uad50\ud574\uc57c \ud569\ub2c8\ub2e4.",
          "\uce74\ub4dc\ub274\uc2a4\ub294 \uc9e7\uace0 \uba85\ud655\ud574\uc57c \ud558\ubbc0\ub85c \uae34 \ubb38\uc7a5\uc740 \uc904\uc774\uace0, \ud55c \uc7a5\uc5d0 \ub108\ubb34 \ub9ce\uc740 \uc815\ubcf4\ub97c \ub123\uc9c0 \uc54a\uc544\uc57c \ud569\ub2c8\ub2e4. \uc81c\ubaa9\uc740 \uc2dc\uc120\uc744 \ub04c\uace0, \ubcf8\ubb38\uc740 \ud575\uc2ec\ub9cc \ub2f4\uace0, \ub9c8\uc9c0\ub9c9 \ubb38\uad6c\ub294 \ud589\ub3d9\uc744 \uc548\ub0b4\ud574\uc57c \ud569\ub2c8\ub2e4.",
          "\uc774 \uc218\uc5c5\uc5d0\uc11c\ub294 \uc0dd\uc131 \u2192 \uac80\ud1a0 \u2192 \uc218\uc815 \u2192 \uc644\uc131 \uc21c\uc11c\ub85c \uc9c4\ud589\ud569\ub2c8\ub2e4. 2\ub2e8\uacc4\uc5d0\uc11c \ub9cc\ub4e0 \ud504\ub86c\ud504\ud2b8\ub294 3\ub2e8\uacc4\uc640 4\ub2e8\uacc4 \uc774\ubbf8\uc9c0 \uc81c\uc791\uc758 \uae30\uc900\uc774 \ub429\ub2c8\ub2e4.",
        ],
        source: "OpenAI Prompt Engineering Guide.",
      },
    ];
    return `<details class="planning-theory-panel prompt-theory-panel" aria-label="AI \ud65c\uc6a9 \uc6d0\ub9ac\uc640 \ud504\ub86c\ud504\ud2b8 \uc124\uacc4 \uc774\ub860">
      <summary class="planning-theory-title"><span aria-hidden="true">\ud83d\udcd8</span><h3>\ubc30\uc6b0\uae30 | \uce74\ub4dc\ub274\uc2a4\ub97c \uc704\ud55c AI \ud504\ub86c\ud504\ud2b8 \uc124\uacc4</h3><i aria-hidden="true">\u203a</i></summary>
      <div class="planning-theory-list">${items.map(theoryAccordion).join("")}</div>
      <div class="planning-checklist"><strong>\uce74\ub4dc\ub274\uc2a4 \ud504\ub86c\ud504\ud2b8 \uccb4\ud06c\ub9ac\uc2a4\ud2b8</strong><ul><li>\uc5ed\ud560(Persona): \uce74\ub4dc\ub274\uc2a4 \uae30\ud68d\uc790\u00b7\ub514\uc790\uc774\ub108</li><li>\uacfc\uc5c5(Task): \uc81c\ubaa9\u00b7\ubcf8\ubb38\u00b7CTA \ub9cc\ub4e4\uae30</li><li>\ub9e5\ub77d(Context): \ud655\uc778\ub41c \ud589\uc0ac \uc815\ubcf4</li><li>\ub300\uc0c1(Target Audience): \uc77d\ub294 \uc0ac\ub78c</li><li>\ud615\uc2dd(Format): 1\uc7a5 \uce74\ub4dc\ub274\uc2a4 \uad6c\uc870</li><li>\uc2a4\ud0c0\uc77c\u00b7\uc5b4\uc870(Tone & Style): \ubc1d\uac8c\u00b7\uacf5\uc2dd\uc801\uc73c\ub85c\u00b7\uce5c\uadfc\ud558\uac8c</li></ul></div>
      <p class="theory-source">\ucc38\uace0\uc790\ub8cc: Norman, D. A. (1988). / White, J. et al. (2023). / Liu, P. et al. (2023). / OpenAI Prompt Engineering Guide.</p>
    </details>`;
  }

  function promptTheoryView() {
    const items = [
      {
        title: "\ud504\ub86c\ud504\ud2b8\ub294 AI\uc5d0\uac8c \uc804\ub2ec\ud558\ub294 \uce74\ub4dc\ub274\uc2a4 \uc81c\uc791 \uc124\uacc4\uc11c\ub2e4",
        body: [
          "\uc0dd\uc131\ud615 AI\ub294 \uc0ac\uc6a9\uc790\uc758 \uc785\ub825\uc744 \uae30\ubc18\uc73c\ub85c \uc774\ubbf8\uc9c0\uc640 \ubb38\uc7a5\uc744 \uc0dd\uc131\ud569\ub2c8\ub2e4. \ud558\uc9c0\ub9cc \u2018\uc608\uc05c \uc774\ubbf8\uc9c0 \ub9cc\ub4e4\uc5b4\uc918\u2019\uc640 \uac19\uc740 \uc9e7\uc740 \uc694\uccad\uc740 \ubaa9\uc801\uacfc \ub300\uc0c1\uc774 \ubd80\uc871\ud558\uae30 \ub54c\ubb38\uc5d0 \uc6d0\ud558\ub294 \uacb0\uacfc\ub97c \uc5bb\uae30 \uc5b4\ub835\uc2b5\ub2c8\ub2e4.",
          "\uce74\ub4dc\ub274\uc2a4 \uc81c\uc791\uc5d0\uc11c\ub294 \ub204\uad6c\uc5d0\uac8c \ubcf4\uc5ec\uc8fc\ub294\uac00, \ubb34\uc5c7\uc744 \uc804\ub2ec\ud558\ub294\uac00, \uc5b4\ub5a4 \ud589\ub3d9\uc744 \uc6d0\ud558\ub294\uac00, \uc5b4\ub5a4 \ud654\uba74 \uad6c\uc870\ub85c \ubcf4\uc5ec\uc8fc\ub294\uac00\ub97c \ud568\uaed8 \uc815\ud574\uc57c \ud569\ub2c8\ub2e4.",
          "\uc88b\uc740 \ud504\ub86c\ud504\ud2b8\ub294 AI\uc5d0\uac8c \uba85\ub839\ud558\ub294 \ubb38\uc7a5\uc774 \uc544\ub2c8\ub77c \ucf58\ud150\uce20 \uc81c\uc791 \ubc29\ud5a5\uc744 \uc815\ub9ac\ud55c \uae30\ud68d\uc11c \uc5ed\ud560\uc744 \ud569\ub2c8\ub2e4.",
          "\ub098\uc05c \ud504\ub86c\ud504\ud2b8 \uc608\uc2dc: \u2018\uae40\ud3ec \ud589\uc0ac \uce74\ub4dc\ub274\uc2a4 \ub9cc\ub4e4\uc5b4\uc918\u2019",
          "\uc88b\uc740 \ud504\ub86c\ud504\ud2b8 \uc608\uc2dc: \u2018\uae40\ud3ec \uc2dc\ubbfc \uac00\uc871\uc744 \ub300\uc0c1\uc73c\ub85c \uc9c0\uc5ed \ubb38\ud654 \uccb4\ud5d8 \ucc38\uc5ec\ub97c \uc720\ub3c4\ud558\ub294 \uce5c\uadfc\ud55c 9:16 \uc138\ub85c\ud615 \uce74\ub4dc\ub274\uc2a4\ub97c \uc81c\uc791\ud574\uc918\u2019",
        ],
        source: "Liu, P. et al. (2023). Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in NLP. / Norman, D. A. (1988). The Design of Everyday Things.",
      },
      {
        title: "\uc88b\uc740 \ud504\ub86c\ud504\ud2b8\uc758 6\uac00\uc9c0 \ud575\uc2ec \uc694\uc18c",
        body: [
          "\u2460 \uc5ed\ud560(Persona): AI\uc5d0\uac8c \uc81c\uc791\uc790\uc758 \uad00\uc810\uc744 \uc9c0\uc815\ud569\ub2c8\ub2e4. \uc608: \u2018\uc9c0\uc5ed \ud64d\ubcf4 \ucf58\ud150\uce20 \uc804\ubb38\uac00\ucc98\ub7fc \uc791\uc131\ud574\uc918.\u2019",
          "\u2461 \uacfc\uc5c5(Task): \ub9cc\ub4e4 \uacb0\uacfc\ubb3c\uc744 \uba85\ud655\ud788 \uc9c0\uc815\ud569\ub2c8\ub2e4. \uc608: \u2018\uc9c0\uc5ed \ud589\uc0ac \ud64d\ubcf4\uc6a9 \uc20f\ud3fc \uce74\ub4dc\ub274\uc2a4 \uc81c\uc791.\u2019",
          "\u2462 \ub300\uc0c1(Target Audience): \ub204\uac00 \ubcfc \ucf58\ud150\uce20\uc778\uc9c0 \uacb0\uc815\ud569\ub2c8\ub2e4. \uc608: \u2018\uae40\ud3ec \uc9c0\uc5ed \ubb38\ud654 \uccb4\ud5d8\uc5d0 \uad00\uc2ec \uc788\ub294 \uac00\uc871.\u2019",
          "\u2463 \ub9e5\ub77d(Context): \uc81c\uc791 \ubaa9\uc801\uacfc \uc0c1\ud669\uc744 \uc124\uba85\ud569\ub2c8\ub2e4. \uc608: \u2018\uc9c0\uc5ed \uc8fc\ubbfc\uc758 \ubb38\ud654 \ucc38\uc5ec\ub97c \ub192\uc774\uae30 \uc704\ud55c \ud64d\ubcf4 \ucf58\ud150\uce20.\u2019",
          "\u2464 \ud615\uc2dd(Format): \uacb0\uacfc\ubb3c \ud615\ud0dc\uc640 \ud654\uba74 \uad6c\uc870\ub97c \uc9c0\uc815\ud569\ub2c8\ub2e4. \uc608: \u20181080\u00d71920 \uc138\ub85c\ud615 \ubaa8\ubc14\uc77c \uce74\ub4dc\ub274\uc2a4, \uc81c\ubaa9 \uc601\uc5ed\u00b7\ud575\uc2ec \uc774\ubbf8\uc9c0 \uc601\uc5ed\u00b7\uc124\uba85 \uc601\uc5ed\u00b7\ud589\ub3d9 \uc720\ub3c4 \uc601\uc5ed \ud3ec\ud568.\u2019",
          "\u2465 \uc2a4\ud0c0\uc77c(Tone & Style): \ucf58\ud150\uce20 \ubd84\uc704\uae30\ub97c \uacb0\uc815\ud569\ub2c8\ub2e4. \uc608: \u2018\uce5c\uadfc\ud558\uace0 \ucc3d\uc758\uc801\uc778 \ubb38\ud654 \ud64d\ubcf4 \uc2a4\ud0c0\uc77c.\u2019",
        ],
        source: "White, J. et al. (2023). A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT.",
      },
      {
        title: "\uce74\ub4dc\ub274\uc2a4\ub294 \uc774\ubbf8\uc9c0\uac00 \uc544\ub2c8\ub77c \uba54\uc2dc\uc9c0 \uad6c\uc870\ub97c \uc124\uacc4\ud558\ub294 \ucf58\ud150\uce20\ub2e4",
        body: [
          "\uc88b\uc740 \uce74\ub4dc\ub274\uc2a4\ub294 \ub2e8\uc21c\ud788 \uc608\uc05c \uc774\ubbf8\uc9c0\ub97c \ub9cc\ub4dc\ub294 \uac83\uc774 \uc544\ub2d9\ub2c8\ub2e4. \uc9e7\uc740 \uc2dc\uac04 \uc548\uc5d0 \uc0ac\uc6a9\uc790\uac00 \ub0b4\uc6a9\uc744 \uc774\ud574\ud558\uace0 \ud589\ub3d9\ud558\ub3c4\ub85d \ub9cc\ub4dc\ub294 \uc815\ubcf4 \uc804\ub2ec \ucf58\ud150\uce20\uc785\ub2c8\ub2e4.",
          "\uae30\ubcf8 \uad6c\uc870 \u2460 Hook: \uad00\uc2ec\uc744 \ub044\ub294 \uccab \ubb38\uc7a5\uc785\ub2c8\ub2e4. \uc608: \u2018\uc774\ubc88 \uc8fc\ub9d0, \uae40\ud3ec\uc5d0\uc11c \ud2b9\ubcc4\ud55c \ubb38\ud654 \uccb4\ud5d8\uc744 \ub9cc\ub098\ubcf4\uc138\uc694.\u2019",
          "\uae30\ubcf8 \uad6c\uc870 \u2461 Key Message: \uac00\uc7a5 \uc804\ub2ec\ud558\uace0 \uc2f6\uc740 \ud575\uc2ec \ub0b4\uc6a9\uc785\ub2c8\ub2e4.",
          "\uae30\ubcf8 \uad6c\uc870 \u2462 Visual: \uba54\uc2dc\uc9c0\ub97c \uac15\ud654\ud558\ub294 \uc774\ubbf8\uc9c0\uc785\ub2c8\ub2e4.",
          "\uae30\ubcf8 \uad6c\uc870 \u2463 Call To Action: \uc0ac\uc6a9\uc790\uac00 \ud574\uc57c \ud560 \ud589\ub3d9\uc785\ub2c8\ub2e4. \uc608: \u2018\ud504\ub85c\uadf8\ub7a8 \uc2e0\uccad\ud558\uae30.\u2019",
          "AI\uc5d0\uac8c \uc774\ubbf8\uc9c0\ub9cc \uc694\uccad\ud558\ub294 \uac83\uc774 \uc544\ub2c8\ub77c \uba54\uc2dc\uc9c0 \uad6c\uc870\uae4c\uc9c0 \uc804\ub2ec\ud574\uc57c \uc88b\uc740 \uacb0\uacfc\ub97c \uc5bb\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.",
        ],
        source: "Ware, C. (2013). Information Visualization: Perception for Design. / OpenAI Prompt Engineering Guide.",
      },
      {
        title: "AI \uacb0\uacfc\ubb3c\uc740 \uac80\ud1a0\uc640 \uc218\uc815\uc774 \ud544\uc694\ud558\ub2e4",
        body: [
          "AI\uac00 \uc0dd\uc131\ud55c \uacb0\uacfc\ubb3c\uc740 \ucd5c\uc885 \uc644\uc131\ud488\uc774 \uc544\ub2c8\ub77c \uccab \ubc88\uc9f8 \uc81c\uc791 \uc2dc\uc548\uc785\ub2c8\ub2e4.",
          "\uce74\ub4dc\ub274\uc2a4 \uc81c\uc791 \uacfc\uc815\uc740 \uae30\ud68d \u2192 \ud504\ub86c\ud504\ud2b8 \uc124\uacc4 \u2192 AI \uc0dd\uc131 \u2192 \uac80\ud1a0 \u2192 \uc218\uc815 \u2192 \uc644\uc131\uc758 \uc21c\uc11c\ub85c \uc9c4\ud589\ub429\ub2c8\ub2e4.",
          "\uac80\ud1a0 \ud56d\ubaa9: \uc815\ubcf4\uac00 \uc815\ud655\ud55c\uac00, \ub300\uc0c1\uc5d0\uac8c \uc801\ud569\ud55c \ud45c\ud604\uc778\uac00, \uc81c\ubaa9\uc774 \ud55c\ub208\uc5d0 \uc774\ud574\ub418\ub294\uac00, \uc774\ubbf8\uc9c0\uc640 \ubb38\uc7a5\uc774 \uc5f0\uacb0\ub418\ub294\uac00, \ud589\ub3d9 \uc720\ub3c4 \ubb38\uad6c\uac00 \uc788\ub294\uac00\ub97c \ud655\uc778\ud574\uc57c \ud569\ub2c8\ub2e4.",
          "AI\ub294 \uc81c\uc791 \uc18d\ub3c4\ub97c \ub192\uc774\ub294 \ub3c4\uad6c\uc774\uba70, \ucd5c\uc885 \ud310\ub2e8\uacfc \ud3b8\uc9d1\uc740 \uc0ac\ub78c\uc774 \ub2f4\ub2f9\ud569\ub2c8\ub2e4.",
        ],
        source: "Norman, D. A. (1988). The Design of Everyday Things. / OpenAI Prompt Engineering Guide.",
      },
    ];
    return `<details class="planning-theory-panel prompt-theory-panel" aria-label="AI \uc20f\ud3fc \ucf58\ud150\uce20 \uc81c\uc791\uc744 \uc704\ud55c \ud504\ub86c\ud504\ud2b8 \uc124\uacc4 \uc774\ub860">
      <summary class="planning-theory-title"><span aria-hidden="true">\ud83d\udcd8</span><h3>\ubc30\uc6b0\uae30 | AI \uc20f\ud3fc \ucf58\ud150\uce20 \uc81c\uc791\uc744 \uc704\ud55c \ud504\ub86c\ud504\ud2b8 \uc124\uacc4</h3><i aria-hidden="true">\u203a</i></summary>
      <div class="planning-theory-list">${items.map(theoryAccordion).join("")}</div>
      <div class="planning-checklist"><strong>\ud504\ub86c\ud504\ud2b8 \uc124\uacc4 \uccb4\ud06c\ub9ac\uc2a4\ud2b8</strong><ul><li>\u25a1 \ub204\uad6c\uc5d0\uac8c \ubcf4\uc5ec\uc904 \ucf58\ud150\uce20\uc778\uac00?</li><li>\u25a1 \ubb34\uc5c7\uc744 \uc804\ub2ec\ud560 \uac83\uc778\uac00?</li><li>\u25a1 \uc5b4\ub5a4 \ud589\ub3d9\uc744 \uc6d0\ud558\ub294\uac00?</li><li>\u25a1 \uc5b4\ub5a4 \ud654\uba74 \ud615\ud0dc\uc778\uac00?</li><li>\u25a1 \uc5b4\ub5a4 \ubd84\uc704\uae30\ub85c \ud45c\ud604\ud560 \uac83\uc778\uac00?</li><li>\u25a1 \ubc18\ub4dc\uc2dc \ud3ec\ud568\ud560 \uc815\ubcf4\ub294 \ubb34\uc5c7\uc778\uac00?</li></ul></div>
      <p class="theory-source">\ucc38\uace0\uc790\ub8cc: Liu, P. et al. (2023). Pre-train, Prompt, and Predict: A Systematic Survey of Prompting Methods in NLP. / White, J. et al. (2023). A Prompt Pattern Catalog to Enhance Prompt Engineering with ChatGPT. / Norman, D. A. (1988). The Design of Everyday Things. / Ware, C. (2013). Information Visualization: Perception for Design.</p>
    </details>`;
  }

  function fluxView() {
    return `<div class="step-title"><div><span class="badge">3\ub2e8\uacc4</span><h2>\uc774\ubbf8\uc9c0 \uc0dd\uc131+\uae00 \ubc30\uce58</h2></div><div class="button-row"><button id="generateFlux" class="primary-button" ${project.flux.used ? "disabled" : ""} type="button">\uc774\ubbf8\uc9c0 \uc0dd\uc131\ud558\uae30</button><button id="downloadFlux" class="ghost-button" type="button">PNG \ub2e4\uc6b4\ub85c\ub4dc</button></div></div>
    <div class="canvas-workspace"><div class="canvas-wrap"><canvas id="cardCanvas" width="1080" height="1080"></canvas></div><aside class="card">${fluxStatusView()}<p class="notice">\uc774 \ubc29\uc2dd\uc740 2\ub2e8\uacc4\uc5d0\uc11c \ub9cc\ub4e0 Flux \uc774\ubbf8\uc9c0 \uc0dd\uc131\uc6a9 \ud504\ub86c\ud504\ud2b8\ub97c \uc0ac\uc6a9\ud574 \uc774\ubbf8\uc9c0\ub97c \uba3c\uc800 \ub9cc\ub4e0 \ub4a4, \ud3b8\uc9d1 \uac00\ub2a5\ud55c \ubb38\uad6c\ub97c \uc62c\ub824 \uc644\uc131\ud569\ub2c8\ub2e4.</p><div class="layer-list">${project.flux.layers.map(layerView).join("")}</div><div class="button-row"><button id="loadCopy" class="ghost-button" type="button">\ubb38\uad6c \ubd88\ub7ec\uc624\uae30</button><button id="resetLayout" class="ghost-button" type="button">\ub808\uc774\uc544\uc6c3 \ucd08\uae30\ud654</button></div></aside></div>`;
  }

  function fluxStatusView() {
    const hasPrompt = Boolean(project.copy.fluxPrompt);
    const status = project.flux.status || (project.flux.used ? "success" : hasPrompt ? "ready" : "waiting");
    const messages = {
      waiting: "2\ub2e8\uacc4\uc5d0\uc11c Flux \ud504\ub86c\ud504\ud2b8\ub97c \uba3c\uc800 \uc0dd\uc131\ud558\uc138\uc694.",
      ready: "2\ub2e8\uacc4 Flux \ud504\ub86c\ud504\ud2b8\ub97c \uac00\uc838\uc654\uc2b5\ub2c8\ub2e4. \uc774\ubbf8\uc9c0 \uc0dd\uc131\ud558\uae30\ub97c \ub204\ub974\uc138\uc694.",
      loading: "\uc774\ubbf8\uc9c0 \uc0dd\uc131 \uc911\uc785\ub2c8\ub2e4. \uc7a0\uc2dc\ub9cc \uae30\ub2e4\ub824 \uc8fc\uc138\uc694.",
      success: "\uc774\ubbf8\uc9c0 \uc0dd\uc131\uc774 \uc644\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \ubb38\uad6c\ub97c \ubd88\ub7ec\uc640 \ud3b8\uc9d1\ud55c \ub4a4 PNG\ub85c \uc800\uc7a5\ud558\uc138\uc694.",
      failed: project.flux.message || "\uc774\ubbf8\uc9c0 \uc0dd\uc131\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4. 2\ub2e8\uacc4 \ud504\ub86c\ud504\ud2b8\ub97c \ud655\uc778\ud558\uace0 \ub2e4\uc2dc \uc2dc\ub3c4\ud558\uc138\uc694.",
    };
    return `<div class="generation-status is-${status}" role="status">${messages[status] || messages.ready}</div>`;
  }

  function layerView(layer) {
    return `<div class="layer-item" data-layer="${layer.id}"><label>${layer.id}<textarea data-layer-field="text">${esc(layer.text)}</textarea></label><div class="field-grid two"><label>X<input type="range" min="20" max="900" value="${layer.x}" data-layer-field="x" /></label><label>Y<input type="range" min="20" max="960" value="${layer.y}" data-layer-field="y" /></label><label>Size<input type="range" min="20" max="90" value="${layer.size}" data-layer-field="size" /></label><label>Color<input type="color" value="${layer.color}" data-layer-field="color" /></label></div></div>`;
  }

  function gptView() {
    return `<div class="step-title"><div><span class="badge">4\ub2e8\uacc4</span><h2>\uc774\ubbf8\uc9c0+\uae00 \ud55c \ubc88\uc5d0 \uc790\ub3d9 \uc81c\uc791</h2></div><button id="generateGpt" class="primary-button" ${project.gpt.used ? "disabled" : ""} type="button">\uce74\ub4dc \ud55c \ubc88\uc5d0 \uc0dd\uc131</button></div>
    <div class="layout"><section class="card"><h3>\ud655\uc815\ub41c \uae30\ud68d</h3><div class="preview-box">${esc(summary())}</div><h3>\ud1b5\ud569 \ud504\ub86c\ud504\ud2b8</h3><div class="prompt-box">${esc(project.copy.gptPrompt || buildGptPrompt())}</div></section><aside class="preview-card">${project.gpt.imageUrl ? `<img class="result-image" src="${esc(project.gpt.imageUrl)}" alt="GPT \uc0dd\uc131 \uacb0\uacfc" />` : `<div class="preview-box">\uc544\uc9c1 \uacb0\uacfc\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.</div>`}</aside></div>`;
  }

  function finalView() {
    return `<div class="step-title"><div><span class="badge">5\ub2e8\uacc4</span><h2>\ube44\uad50\ud558\uace0 \uc644\uc131</h2></div></div><div class="compare-grid">${resultCard("flux", "\ubc30\uacbd \uc0dd\uc131+\uae00 \uc9c1\uc811 \ubc30\uce58", project.flux.finalImage || project.flux.imageUrl)}${resultCard("gpt", "\uc774\ubbf8\uc9c0+\uae00 \uc790\ub3d9 \uc81c\uc791", project.gpt.imageUrl)}</div><section class="card" style="margin-top:18px">${field("final", "reflection", "\uc65c \uc774 \uacb0\uacfc\ubb3c\uc744 \uc120\ud0dd\ud588\ub098\uc694?", true)}<div class="button-row"><button id="downloadFinal" class="primary-button" type="button">\ucd5c\uc885 PNG \ub2e4\uc6b4\ub85c\ub4dc</button><button id="submitProject" class="ghost-button" type="button">\uacb0\uacfc\ubb3c \uc81c\ucd9c</button></div></section>`;
  }

  function resultCard(method, title, image) {
    return `<article class="result-card ${project.final.selected === method ? "is-selected" : ""}"><h3>${title}</h3>${image ? `<img src="${esc(image)}" alt="${title}" />` : `<div class="preview-box">\uacb0\uacfc \uc5c6\uc74c</div>`}<button class="ghost-button" data-select="${method}" ${image ? "" : "disabled"} type="button">\uc774 \uacb0\uacfc \uc120\ud0dd</button></article>`;
  }

  function bind() {
    dom.main.querySelectorAll("[data-field]").forEach((input) => input.addEventListener("input", () => {
      const [group, key] = input.dataset.field.split(".");
      project[group][key] = input.value;
      if (group === "prompt") project.copy.promptStatus = "";
      debounceSave();
    }));
    dom.main.querySelectorAll("[data-copy-prompt]").forEach((input) => input.addEventListener("input", () => {
      project.copy[input.dataset.copyPrompt] = input.value;
      debounceSave();
    }));
    dom.main.querySelectorAll("[data-example-select]").forEach((button) => button.addEventListener("click", () => selectTopicExample(button.dataset.exampleSelect)));
    dom.main.querySelectorAll("[data-generation-mode]").forEach((button) => button.addEventListener("click", () => setGenerationMode(button.dataset.generationMode)));
    dom.main.querySelector("#generateCopy")?.addEventListener("click", generateCopy);
    dom.main.querySelector("#copyPrompt")?.addEventListener("click", copyGeneratedPrompt);
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
    ensurePromptDefaults();
    const button = dom.main.querySelector("#generateCopy");
    if (button) {
      button.disabled = true;
      button.textContent = "\u23f3 AI \ud504\ub86c\ud504\ud2b8 \uc0dd\uc131 \uc911...";
    }
    let data = null;
    try {
      data = await post("/api/card-news/generate-copy", { ...project, planning: project.planning, promptDesign: project.prompt, generationMode: project.prompt.generationMode });
    } finally {
      if (button) button.disabled = false;
    }
    if (!data) {
      project.copy.promptStatus = "error";
      project.copy.metaPrompt = project.copy.metaPrompt || buildStandalonePromptRequest();
      dom.saveStatus.textContent = "\uc0dd\uc131 \uc2e4\ud328. \uc804\uccb4 \ud504\ub86c\ud504\ud2b8 \ubcf5\uc0ac\ub85c \uc678\ubd80 AI\uc5d0 \ubd99\uc5ec\ub123\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.";
      save(false);
      render();
      return;
    }
    project.copy = { ...project.copy, ...data.copy };
    project.copy.promptStatus = "done";
    loadCopy();
    save();
    render();
  }

  async function copyGeneratedPrompt() {
    ensurePromptDefaults();
    const text = buildFullGeneratedPrompt();
    try {
      await navigator.clipboard.writeText(text);
      dom.saveStatus.textContent = "\uc804\uccb4 \ud504\ub86c\ud504\ud2b8\ub97c \ubcf5\uc0ac\ud588\uc2b5\ub2c8\ub2e4.";
    } catch {
      alert(text);
    }
  }

  async function generateFlux() {
    if (project.flux.used) return;
    project.flux.status = "loading";
    project.flux.message = "";
    save(false);
    const button = dom.main.querySelector("#generateFlux");
    const status = dom.main.querySelector(".generation-status");
    if (button) {
      button.disabled = true;
      button.textContent = "\uc774\ubbf8\uc9c0 \uc0dd\uc131 \uc911...";
    }
    if (status) {
      status.className = "generation-status is-loading";
      status.textContent = "\uc774\ubbf8\uc9c0 \uc0dd\uc131 \uc911\uc785\ub2c8\ub2e4. \uc7a0\uc2dc\ub9cc \uae30\ub2e4\ub824 \uc8fc\uc138\uc694.";
    }
    window.LoreAXUsage?.trackAiGenerate?.(COURSE_ID, "flux_generation", { provider: "flux" });
    const data = await post("/api/card-news/generate-flux", { ...project, planning: project.planning, prompt: project.copy.fluxPrompt, idempotencyKey: `${project.projectId}:flux_generation` });
    if (!data) {
      window.LoreAXUsage?.trackAiGenerateResult?.(COURSE_ID, false, { provider: "flux" });
      project.flux.status = "failed";
      project.flux.message = "\uc774\ubbf8\uc9c0 \uc0dd\uc131\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4. 2\ub2e8\uacc4 \ud504\ub86c\ud504\ud2b8\ub97c \ud655\uc778\ud558\uace0 \ub2e4\uc2dc \uc2dc\ub3c4\ud558\uc138\uc694.";
      save(false);
      if (button) {
        button.disabled = false;
        button.textContent = "\uc774\ubbf8\uc9c0 \uc0dd\uc131\ud558\uae30";
      }
      if (status) {
        status.className = "generation-status is-failed";
        status.textContent = project.flux.message;
      }
      return;
    }
    project.flux.imageUrl = data.imageUrl;
    project.flux.used = true;
    project.flux.status = "success";
    project.flux.message = "";
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

  function fluxRules() {
    return "\ud655\uc778\ub41c \uc815\ubcf4\ub9cc \uc0ac\uc6a9\ud55c\ub2e4.\n\uc774\ubbf8\uc9c0 \uc548\uc5d0\ub294 \uae00\uc790, \uc22b\uc790, \ub85c\uace0\ub97c \ub123\uc9c0 \uc54a\ub294\ub2e4.\n\ucd5c\uc885 \ubb38\uad6c\ub97c \ucd94\uac00\ud560 \uc218 \uc788\ub3c4\ub85d \ucda9\ubd84\ud55c \ube48 \uacf5\uac04\uc744 \ud655\ubcf4\ud55c\ub2e4.\n9:16 \uc138\ub85c\ud615 \ubaa8\ubc14\uc77c \uce74\ub4dc\ub274\uc2a4 \uad6c\ub3c4\ub97c \uc720\uc9c0\ud55c\ub2e4.\n\ud575\uc2ec \uc774\ubbf8\uc9c0\ub294 \uc911\uc559 \uc548\uc804 \uc601\uc5ed\uc5d0 \ubc30\uce58\ud55c\ub2e4.\n\ubcf5\uc7a1\ud55c \ubc30\uacbd\ubcf4\ub2e4 \ud14d\uc2a4\ud2b8\uac00 \uc798 \ubcf4\uc774\ub294 \uad6c\uc131\uc744 \uc6b0\uc120\ud55c\ub2e4.";
  }

  function gptIntegratedRules() {
    return "\ud655\uc778\ub41c \uc815\ubcf4\ub9cc \uc0ac\uc6a9\ud55c\ub2e4.\n\uc774\ubbf8\uc9c0\uc640 \ud14d\uc2a4\ud2b8\uac00 \ud3ec\ud568\ub41c \uc644\uc131\ud615 \uce74\ub4dc\ub274\uc2a4\ub97c \uc81c\uc791\ud55c\ub2e4.\n9:16 \ubaa8\ubc14\uc77c \ud654\uba74 \uae30\uc900\uc73c\ub85c \uad6c\uc131\ud55c\ub2e4.\n\uc81c\ubaa9, \uc124\uba85, \ud589\ub3d9 \uc720\ub3c4 \ubb38\uad6c\uc758 \uc815\ubcf4 \uc704\uacc4\ub97c \uba85\ud655\ud788 \ud55c\ub2e4.\n\ud55c\uad6d\uc5b4 \ud14d\uc2a4\ud2b8\uac00 \uc77d\uae30 \uc27d\uac8c \ud45c\ud604\ub418\ub3c4\ub85d \ud55c\ub2e4.\n\uacfc\uc7a5\ub418\uac70\ub098 \uc874\uc7ac\ud558\uc9c0 \uc54a\ub294 \uc815\ubcf4\ub294 \uc0dd\uc131\ud558\uc9c0 \uc54a\ub294\ub2e4.";
  }

  function ensurePromptDefaults() {
    project.prompt.generationMode = project.prompt.generationMode || project.copy.generationMode || "flux";
    project.prompt.role = project.prompt.role || "\uce74\ub4dc\ub274\uc2a4 \uae30\ud68d\uc790";
    project.prompt.task = project.prompt.task || "\uc9c0\uc5ed \ud589\uc0ac \ud64d\ubcf4\uc6a9 \uc20f\ud3fc \uce74\ub4dc\ub274\uc2a4 \uc81c\uc791";
    project.prompt.audience = project.prompt.audience || project.planning.audience || "";
    project.prompt.context = project.prompt.context || project.planning.purpose || "";
    project.prompt.format = project.prompt.format || "9:16 \uc138\ub85c\ud615 \ubaa8\ubc14\uc77c \uce74\ub4dc\ub274\uc2a4";
    project.prompt.style = project.prompt.style || project.planning.mood || "\uce5c\uadfc\ud558\uace0 \ucc3d\uc758\uc801\uc778 \ud64d\ubcf4 \uc2a4\ud0c0\uc77c";
    project.prompt.rules = project.prompt.rules || (project.prompt.generationMode === "gpt_integrated" ? gptIntegratedRules() : fluxRules());
    project.copy.generationMode = project.copy.generationMode || project.prompt.generationMode;
    project.copy.negativePrompt = project.copy.negativePrompt || (project.prompt.generationMode === "gpt_integrated" ? gptNegativeDefault() : fluxNegativeDefault());
  }

  function setGenerationMode(mode) {
    project.prompt.generationMode = mode === "gpt_integrated" ? "gpt_integrated" : "flux";
    project.copy.generationMode = project.prompt.generationMode;
    project.prompt.rules = project.prompt.generationMode === "gpt_integrated" ? gptIntegratedRules() : fluxRules();
    project.copy.promptStatus = "";
    project.copy.negativePrompt = project.prompt.generationMode === "gpt_integrated" ? gptNegativeDefault() : fluxNegativeDefault();
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

  function buildStandalonePromptRequest() {
    ensurePromptDefaults();
    const mode = project.prompt.generationMode === "gpt_integrated" ? "GPT \ud1b5\ud569 \uce74\ub4dc \uc81c\uc791" : "Flux \uc774\ubbf8\uc9c0 \uc0dd\uc131 + \ud14d\uc2a4\ud2b8 \uc624\ubc84\ub808\uc774";
    const modeInstruction = project.prompt.generationMode === "gpt_integrated"
      ? "\uc644\uc131\ud615 \uce74\ub4dc\ub274\uc2a4\ub97c \uc704\ud55c IMAGE PROMPT\ub97c \uc791\uc131\ud574 \uc918. \uc81c\ubaa9 \uc704\uce58, \ubcf8\ubb38 \uc704\uce58, CTA \uc704\uce58, \ud14d\uc2a4\ud2b8 \uc704\uacc4, \ubaa8\ubc14\uc77c \uac00\ub3c5\uc131, \ud55c\uad6d\uc5b4 \ud14d\uc2a4\ud2b8 \ud3ec\ud568 \uc870\uac74\uc744 \ubc18\uc601\ud574 \uc918."
      : "\ud14d\uc2a4\ud2b8 \uc5c6\ub294 Flux \uc774\ubbf8\uc9c0\ub97c \uc704\ud55c IMAGE PROMPT\uc640 NEGATIVE PROMPT\ub97c \uc791\uc131\ud574 \uc918. 9:16 vertical composition, clear empty space for text overlay, no text, no letters, no numbers, no logo, no watermark \uc870\uac74\uc744 \ubc18\ub4dc\uc2dc \ubc18\uc601\ud574 \uc918.";
    return [
      "\ub108\ub294 AI \uc774\ubbf8\uc9c0 \uc0dd\uc131 \ud504\ub86c\ud504\ud2b8 \uc124\uacc4 \uc804\ubb38\uac00\uc774\uba70, \uc20f\ud3fc \ucf58\ud150\uce20\uc640 \uce74\ub4dc\ub274\uc2a4 \uc81c\uc791 \uc804\ubb38\uac00\uc774\ub2e4.",
      "",
      `\uc81c\uc791 \ubc29\uc2dd: ${mode}`,
      `\uc5ed\ud560: ${project.prompt.role}`,
      `\uacfc\uc5c5: ${project.prompt.task}`,
      `\ub300\uc0c1: ${project.prompt.audience || project.planning.audience}`,
      `\ub9e5\ub77d: ${project.prompt.context || project.planning.purpose}`,
      `\ud615\uc2dd: ${project.prompt.format}`,
      `\uc2a4\ud0c0\uc77c: ${project.prompt.style || project.planning.mood}`,
      "",
      "\uc218\uc5c5 \uae30\ud68d \uc815\ubcf4:",
      `\uc8fc\uc81c: ${project.planning.topic}`,
      `\ubaa9\uc801: ${project.planning.purpose}`,
      `\ud575\uc2ec \uba54\uc2dc\uc9c0: ${project.planning.message}`,
      `\ud655\uc778\ub41c \uc0ac\uc2e4: ${project.planning.facts}`,
      project.planning.sourceLabel ? `\uacf5\uc2dd \ucd9c\ucc98: ${project.planning.sourceLabel}` : "",
      project.planning.sourceUrl ? `\uacf5\uc2dd \ub9c1\ud06c: ${project.planning.sourceUrl}` : "",
      "",
      "\uc0dd\uc131 \uaddc\uce59:",
      project.prompt.rules,
      "",
      "\uc694\uccad:",
      modeInstruction,
      "\ud655\uc778\ub418\uc9c0 \uc54a\uc740 \ub0a0\uc9dc, \uc7a5\uc18c, \ube44\uc6a9, \uc2e0\uccad \ubc29\ubc95, \ub85c\uace0, \uc0ac\uc2e4\uc740 \uc784\uc758\ub85c \ub9cc\ub4e4\uc9c0 \ub9c8.",
    ].filter(Boolean).join("\n");
  }

  function buildFullGeneratedPrompt() {
    ensurePromptDefaults();
    const mode = project.prompt.generationMode || "flux";
    const imagePrompt = mode === "gpt_integrated" ? project.copy.gptPrompt : project.copy.fluxPrompt;
    const negativePrompt = project.copy.negativePrompt || (mode === "gpt_integrated" ? gptNegativeDefault() : fluxNegativeDefault());
    if (imagePrompt || negativePrompt) {
      return `IMAGE PROMPT:\n\n${imagePrompt || "\uc544\uc9c1 \uc774\ubbf8\uc9c0 \ud504\ub86c\ud504\ud2b8\uac00 \uc0dd\uc131\ub418\uc9c0 \uc54a\uc558\uc2b5\ub2c8\ub2e4."}\n\nNEGATIVE PROMPT:\n\n${negativePrompt}`;
    }
    return buildStandalonePromptRequest();
  }

  function buildGptPrompt() {
    return project.copy.gptPrompt || `Make one 1080x1080 news card. Title: ${project.copy.title}. Subtitle: ${project.copy.subtitle}. CTA: ${project.copy.cta}. Use only these facts: ${project.planning.facts}.`;
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
    if (desc) desc.textContent = "\ud558\ub098\uc758 \uba54\uc2dc\uc9c0\ub97c \uae30\ud68d\ud558\uace0, \uae00\uc790 \uc5c6\ub294 \ubc30\uacbd\uc5d0 \ubb38\uad6c\ub97c \uc9c1\uc811 \ubc30\uce58\ud558\ub294 \ubc29\uc2dd\uacfc \uc774\ubbf8\uc9c0+\uae00\uc744 \ud55c \ubc88\uc5d0 \uc0dd\uc131\ud558\ub294 \ubc29\uc2dd\uc744 \ube44\uad50\ud574 \ucd5c\uc885 \ub274\uc2a4\uce74\ub4dc PNG 1\uc7a5\uc744 \uc81c\ucd9c\ud569\ub2c8\ub2e4.";
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
