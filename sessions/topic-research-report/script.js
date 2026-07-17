const LESSON_ID = "dataAnalysisReport";
const REPORT_STORAGE_KEY = `loreaxReport:${LESSON_ID}`;
const PROGRESS_STORAGE_KEY = `lessonProgress:${LESSON_ID}`;
const PRESENCE_STORAGE_PREFIX = "loreaxPresence:";
const PRESENCE_DEVICE_KEY = "loreaxPresenceDeviceId";
const HEARTBEAT_INTERVAL_MS = 180000;

if (window.LoreAXTenant?.guardCourseAccess?.(LESSON_ID, { homeUrl: "../../index.html" })?.blocked) {
  window.LoreAXTopicResearch = { blocked: true };
} else {

const TOOL_URLS = {
  ChatGPT: "https://chatgpt.com/",
  Gemini: "https://gemini.google.com/",
  Claude: "https://claude.ai/",
  "Google Scholar": "https://scholar.google.com/",
  "Semantic Scholar": "https://www.semanticscholar.org/",
  NotebookLM: "https://notebooklm.google/",
  Consensus: "https://consensus.app/",
  Elicit: "https://elicit.com/",
  Scite: "https://scite.ai/",
  Excel: "https://www.microsoft.com/ko-kr/microsoft-365/excel",
  "Google Sheets": "https://docs.google.com/spreadsheets/",
  Datawrapper: "https://www.datawrapper.de/",
};

const lessonSteps = [
  {
    id: "period1-step1",
    label: "1차시-1",
    title: "탐구 주제 설정",
    goal: "관심 분야와 키워드를 바탕으로 4차시 안에 탐구 가능한 주제를 고릅니다.",
    details: ["탐구보고서 구조 이해", "관심 분야 키워드 정리", "AI로 주제 후보 만들기", "주제 범위 좁히기"],
    activities: ["관심 분야 입력", "키워드 3개 작성", "주제 후보 생성", "최종 주제 선택"],
    inputs: ["관심 분야", "관심 키워드 3개", "관심을 가진 이유", "최종 선택 주제", "주제 선택 이유"],
    tools: ["ChatGPT", "Gemini", "Claude"],
    prompt: `너는 중학생의 주제탐구보고서 작성을 돕는 코치다.
내 관심 분야는 [관심 분야]이고, 내가 생각한 키워드는 [키워드 3개]이다.
이 내용을 바탕으로 실제 자료를 찾을 수 있고 4차시 안에 탐구 가능한 주제 후보 5개를 제안해 줘.
각 후보마다 탐구 대상, 범위, 필요한 자료, 너무 넓은 점을 함께 설명해 줘.
완성된 보고서를 대신 쓰지 말고, 내가 선택할 수 있도록 비교표 형태로 정리해 줘.`,
    checklist: ["관심 분야를 입력했다", "키워드 3개를 작성했다", "주제 후보를 확인했다", "최종 주제를 선택했다", "주제 선택 이유를 작성했다"],
    warning: "AI가 제안한 주제를 그대로 제출하지 말고 학생이 직접 고르고 수정해야 합니다.",
  },
  {
    id: "period1-step2",
    label: "1차시-2",
    title: "탐구 질문과 기존 연구 정리",
    goal: "1차시-1에서 고른 주제를 바탕으로 탐구 질문, 기존 연구, 이론, 데이터 방향을 정리합니다.",
    details: ["탐구 질문 구체화", "기존 연구 검색", "출처 신뢰성 점검", "2차시 데이터 방향 설정"],
    activities: ["초안 탐구 질문 작성", "논문 또는 기존 연구 붙여넣기", "AI로 질문 후보 정리", "최종 질문 선택"],
    inputs: ["최종 선택 주제", "초안 탐구 질문", "기존 연구 검색 결과", "최종 탐구 질문", "기존 연구 요약", "이론 적용 방법"],
    tools: ["ChatGPT", "Gemini", "Claude", "Google Scholar", "Semantic Scholar", "NotebookLM", "Consensus", "Elicit", "Scite"],
    prompt: `내 탐구 주제는 [주제]이고 현재 질문은 [초안 질문]이다.
아래에는 내가 찾은 논문 또는 기존 연구 내용을 붙여넣었다.
[기존 연구 내용]
이 질문이 구체성, 탐구 가능성, 자료 검색 가능성 기준에 맞는지 점검해 줘.
문제점을 설명한 뒤, 대상·기간·지역·비교 기준을 반영한 수정 질문 3개를 제안해 줘.
붙여넣은 자료 안에서만 기존 연구와 핵심 개념을 요약하고, 없는 논문이나 통계는 만들지 마.`,
    checklist: ["초안 탐구 질문을 입력했다", "기존 연구 내용을 붙여넣었다", "질문 후보를 확인했다", "최종 질문을 선택했다", "기존 연구와 이론을 정리했다"],
    warning: "AI 요약만 믿지 말고 자료 제목, 기관, 발행 시점, 원문 내용을 확인하세요.",
  },
  {
    id: "period2",
    label: "2차시",
    title: "자료 분석과 시각화",
    goal: "1차시 승인 결과를 이어받아 실제 데이터팩을 선택하고 표와 그래프를 만든 뒤 분석 초안을 작성합니다.",
    details: ["1차시 결과 확인", "분석 방향 선택", "실제 데이터팩 선택", "표와 그래프 확인", "AI 분석 초안 승인"],
    activities: ["분석 방향 선택", "데이터팩 선택", "추천 그래프 확인", "학생 관찰 1문장 작성", "분석 결과 승인"],
    inputs: ["분석 방향", "데이터팩", "그래프 유형", "학생 관찰 1문장", "승인된 분석 결과"],
    tools: ["ChatGPT", "Gemini", "Claude", "Excel", "Google Sheets", "Datawrapper"],
    prompt: `내 탐구 질문은 [탐구 질문]이다.
선택한 데이터의 표와 출처는 다음과 같다.
[데이터 표]
[출처]
이 데이터 안에서만 증가, 감소, 최고, 최저, 차이를 설명해 줘.
없는 수치나 출처를 만들지 말고, 상관관계를 인과관계로 단정하지 마.
그래프 해석과 탐구 질문과의 연결을 고등학생 보고서 문체로 정리해 줘.`,
    checklist: ["분석 방향을 선택했다", "데이터팩을 선택했다", "표를 확인했다", "그래프를 확인했다", "학생 관찰을 작성했다", "분석 결과를 승인했다"],
    warning: "학생이 숫자를 직접 만들지 않습니다. 앱이 제공한 실제 데이터 범위 안에서만 해석합니다.",
  },
  {
    id: "period3",
    label: "3차시",
    title: "보고서 초안 작성",
    goal: "서론과 연구 방법 초안을 작성하고 AI 문장을 비판적으로 검토합니다.",
    details: ["서론 구조", "연구 배경·목적·필요성", "연구 방법 작성", "AI 문장 비교", "윤리 점검"],
    activities: ["서론 초안 작성", "연구 방법 작성", "자기 문장과 AI 문장 비교", "참고문헌 기록"],
    inputs: ["연구 배경", "탐구 목적", "탐구 필요성", "자료 수집 방법", "분석 방법", "AI 활용 기록"],
    tools: ["ChatGPT", "Gemini", "Claude"],
    prompt: "아래는 내가 직접 작성한 서론 초안이다. 문장을 대신 새로 작성하지 말고 연구 배경, 탐구 목적, 탐구 필요성이 구분되는지 점검해 줘.",
    checklist: ["연구 배경을 작성했다", "탐구 목적을 작성했다", "탐구 필요성을 작성했다", "연구 방법을 작성했다", "AI 활용 기록을 남겼다"],
    warning: "AI는 대필 도구가 아니라 점검 도구로 사용합니다.",
  },
  {
    id: "period4",
    label: "4차시",
    title: "결과 해석과 최종 보고서 완성",
    goal: "결과와 결론을 구분하고 한계, 향후 탐구, 피드백 반영 후 PDF를 생성합니다.",
    details: ["결과 해석", "결론 작성", "학문적 의미", "연구 한계", "동료 피드백", "PDF 생성"],
    activities: ["결과 해석 작성", "결론 작성", "한계와 향후 탐구 작성", "피드백 반영", "PDF 미리보기"],
    inputs: ["결과 해석", "결론", "학문적 의미", "연구 한계", "향후 탐구", "동료 피드백"],
    tools: ["ChatGPT", "Gemini", "Claude", "Google Scholar", "Semantic Scholar", "NotebookLM", "Scite"],
    prompt: "내 탐구 질문과 주요 결과, 결론 초안을 기준으로 결과에 없는 내용을 단정하지 않았는지, 상관관계를 인과관계로 잘못 표현하지 않았는지 점검해 줘.",
    checklist: ["결과와 결론을 구분했다", "결론이 탐구 질문에 답한다", "한계점을 작성했다", "향후 탐구를 작성했다", "PDF 미리보기를 확인했다"],
    warning: "필수 항목이 일부 비어도 PDF는 만들 수 있지만 제출 전 누락 항목을 확인하세요.",
  },
];
const detailedStepPrompts = {
  "period1-step1": {
    promptTitle: "관심 분야에서 탐구 주제 후보 만들기",
    promptTiming: "1차시-1 · 관심 분야와 키워드를 적은 뒤 사용",
    promptInputs: ["[관심 분야]", "[키워드 3개]", "[관심을 가진 이유]"],
    promptCheckpoints: ["주제가 너무 넓지 않은가", "실제 자료를 찾을 수 있는가", "4차시 안에 끝낼 수 있는가"],
    prompt: `너는 중학생의 주제탐구보고서 작성을 돕는 코치다.
내 관심 분야는 [관심 분야]이고, 내가 생각한 키워드는 [키워드 3개]이다.
내가 이 분야에 관심을 가진 이유는 [관심을 가진 이유]이다.
이 내용을 바탕으로 실제 자료를 찾을 수 있고 4차시 안에 탐구 가능한 주제 후보 5개를 제안해 줘.
각 후보마다 탐구 대상, 범위, 필요한 자료, 너무 넓은 점을 함께 설명해 줘.
완성된 보고서를 대신 쓰지 말고, 내가 선택할 수 있도록 비교표 형태로 정리해 줘.
자료에 없는 사실이나 통계는 만들지 말고 확인이 필요한 부분은 따로 표시해 줘.`,
  },
  "period1-step2": {
    promptTitle: "탐구 질문과 기존 연구 정리하기",
    promptTiming: "1차시-2 · 주제를 고르고 기존 연구 내용을 붙여넣은 뒤 사용",
    promptInputs: ["[탐구 주제]", "[초안 질문]", "[기존 연구 내용]"],
    promptCheckpoints: ["질문이 구체적인가", "자료 검색이 가능한가", "기존 연구 내용을 과장하지 않았는가"],
    prompt: `내 탐구 주제는 [탐구 주제]이고 현재 질문은 [초안 질문]이다.
아래에는 내가 찾은 논문 또는 기존 연구 내용을 붙여넣었다.
[기존 연구 내용]
이 질문이 구체성, 탐구 가능성, 자료 검색 가능성 기준에 맞는지 점검해 줘.
문제점을 설명한 뒤 대상, 기간, 지역, 비교 기준을 반영한 수정 질문 3개를 제안해 줘.
붙여넣은 자료 안에서만 기존 연구와 핵심 개념을 요약해 줘.
자료에 없는 논문, 저자, 연도, 통계는 만들지 마.
인과관계가 확실하지 않으면 관계 또는 연관성으로 표현해 줘.`,
  },
  "period2": {
    promptTitle: "표와 그래프 해석 점검하기",
    promptTiming: "2차시 · 데이터팩과 그래프를 확인한 뒤 사용",
    promptInputs: ["[탐구 질문]", "[데이터 표]", "[그래프 설명]", "[학생 관찰]"],
    promptCheckpoints: ["실제 데이터 값만 사용했는가", "그래프 유형이 적절한가", "상관관계를 인과관계로 단정하지 않았는가"],
    prompt: `내 탐구 질문은 [탐구 질문]이다.
선택한 데이터 표는 다음과 같다.
[데이터 표]
그래프 설명은 [그래프 설명]이고, 내가 관찰한 점은 [학생 관찰]이다.
이 데이터 안에서만 증가, 감소, 최고, 최저, 차이를 설명해 줘.
없는 수치나 출처를 만들지 말고, 상관관계를 인과관계로 단정하지 마.
그래프 해석과 탐구 질문과의 연결을 고등학생 보고서 문체로 정리해 줘.
최종 결론이 아니라 탐구 결과 초안으로만 작성해 줘.`,
  },
  "period3": {
    promptTitle: "서론과 연구 방법 초안 점검하기",
    promptTiming: "3차시 · 학생이 직접 쓴 초안을 붙여넣은 뒤 사용",
    promptInputs: ["[학생 초안]", "[탐구 주제]", "[탐구 질문]"],
    promptCheckpoints: ["배경·목적·필요성이 구분되는가", "문장을 대신 써 주지 않는가", "AI 문장 복사를 피했는가"],
    prompt: `아래는 내가 직접 작성한 서론 초안이다.
[학생 초안]
문장을 대신 새로 작성하지 말고 연구 배경, 탐구 목적, 탐구 필요성이 잘 구분되어 있는지 점검해 줘.
모호하거나 반복되는 문장을 표시하고 각 문장을 어떻게 고치면 좋은지 이유와 함께 제안해 줘.
수정 전과 수정 방향을 비교표로 보여 줘.`,
  },
  "period4": {
    promptTitle: "결과와 결론 최종 점검하기",
    promptTiming: "4차시 · 결과 해석과 결론 초안을 작성한 뒤 사용",
    promptInputs: ["[탐구 질문]", "[주요 결과]", "[결론 초안]"],
    promptCheckpoints: ["결론이 질문에 답하는가", "결과에 없는 내용을 단정하지 않았는가", "한계와 향후 탐구가 구체적인가"],
    prompt: `내 탐구 질문은 [탐구 질문]이고, 주요 결과는 [주요 결과]이다.
내가 작성한 결론 초안은 다음과 같다.
[결론 초안]
결론이 탐구 질문에 직접 답하는지, 결과에 없는 내용을 단정하지 않았는지, 상관관계를 인과관계로 잘못 표현하지 않았는지 점검해 줘.
문장을 대신 완성하지 말고 수정이 필요한 부분과 수정 방향을 항목별로 알려 줘.`,
  },
};
const dom = {
  stepList: document.querySelector("#stepList"),
  reportForm: document.querySelector("#reportForm"),
  progressSummary: document.querySelector("#progressSummary"),
  saveStatus: document.querySelector("#saveStatus"),
  bottomSaveStatus: document.querySelector("#bottomSaveStatus"),
  serverStatus: document.querySelector("#serverStatus"),
  toast: document.querySelector("#toast"),
  resetProgressButton: document.querySelector("#resetProgressButton"),
  chartImageInput: document.querySelector("#chartImageInput"),
  chartPreview: document.querySelector("#chartPreview"),
  chartPreviewImage: document.querySelector("#chartPreviewImage"),
  removeChartButton: document.querySelector("#removeChartButton"),
  authStatus: document.querySelector("#authStatus"),
  kakaoLoginButton: document.querySelector("#kakaoLoginButton"),
  kakaoLogoutButton: document.querySelector("#kakaoLogoutButton"),
};

function setSaveStatusText(text) {
  if (dom.saveStatus) dom.saveStatus.textContent = text;
  if (dom.bottomSaveStatus) dom.bottomSaveStatus.textContent = text;
}

let saveTimer = null;
let activeStepIndex = Number(window.localStorage.getItem("topicResearchActiveStep") || 0);
activeStepIndex = Number.isFinite(activeStepIndex) ? Math.max(-1, Math.min(lessonSteps.length - 1, activeStepIndex)) : 0;
let period1Timer = null;
let period1RemainingSeconds = 300;
const period1GenerationState = {
  topic: { loading: false, error: "" },
  research: { loading: false, error: "" },
};

const PERIOD1_DEFAULTS = {
  topicSetting: {
    interestArea: "",
    keywords: [],
    keyword1: "",
    keyword2: "",
    keyword3: "",
    interestReason: "",
    generatedCandidates: [],
    candidates: [],
    selectedTopic: "",
    topicReason: "",
    selectedReason: "",
    approvedAt: "",
  },
  researchDesign: {
    draftQuestion: "",
    paperTitle: "",
    paperKeySentences: "",
    paperRelevanceReason: "",
    paperRawText: "",
    literaturePaste: "",
    questionProblems: [],
    questionCandidates: [],
    finalResearchQuestion: "",
    recommendedQuestion: "",
    researchTarget: "",
    researchScope: "",
    comparisonFactors: [],
    comparisonPoint: "",
    priorResearchSummary: "",
    literatureSummary: "",
    theory: "",
    theoryConcept: "",
    theoryApplication: "",
    dataDirection: "",
    nextDataDirection: "",
    initialOutlineItems: [],
    initialOutline: "",
    approvedAt: "",
  },
};

const PERIOD2_DEFAULTS = {
  inheritedFromPeriod1: {
    selectedTopic: "",
    finalResearchQuestion: "",
    researchTarget: "",
    researchScope: "",
    comparisonFactors: [],
    theory: "",
    theoryApplication: "",
    dataDirection: "",
  },
  selectedDirection: {},
  selectedDataPack: {},
  visualizations: {
    basicChart: {},
    specialChart: {},
  },
  studentObservation: "",
  generatedAnalysis: {
    analysisDirections: [],
    selectedDirectionSummary: "",
    tableDescription: "",
    basicChartDescription: "",
    specialChartDescription: "",
    comparison: "",
    keyFindings: [],
    theoryConnection: "",
    researchQuestionConnection: "",
    limitations: [],
    resultDraft: "",
    updatedOutline: [],
    approvedAt: "",
  },
};


const PERIOD3_DEFAULTS = {
  inheritedFromPeriod1: {},
  inheritedFromPeriod2: {},
  studentInputs: {
    backgroundThought: "",
    researchPurposeThought: "",
    dataUsageThought: "",
    keyFindingThought: "",
  },
  generatedDraft: {
    background: "",
    purpose: "",
    necessity: "",
    researchQuestion: "",
    researchScope: "",
    priorResearchSection: "",
    theoreticalBackground: "",
    dataCollectionMethod: "",
    dataSelectionCriteria: "",
    analysisMethod: "",
    visualizationMethod: "",
    resultSectionDraft: "",
    studentVoiceReflection: "",
    aiUsageMethod: "",
    updatedOutline: [],
    approvedAt: "",
  },
};

const PERIOD4_DEFAULTS = {
  inheritedFromPeriod1: {},
  inheritedFromPeriod2: {},
  inheritedFromPeriod3: {},
  checklist: {
    topicQuestionLinked: false,
    priorTheoryRelated: false,
    tableGraphMatched: false,
    sourcesVisible: false,
    noCausationOverclaim: false,
    noDuplicateSentences: false,
    studentVoiceIncluded: false,
    aiTextReviewed: false,
  },
  studentInputs: {
    finalAnswer: "",
    learningReflection: "",
    futureInquiry: "",
  },
  finalEdits: {
    title: "",
    outline: "",
    background: "",
    purposeNecessity: "",
    questionScope: "",
    priorTheory: "",
    methodology: "",
    tableGraphDescription: "",
    analysisResult: "",
    conclusion: "",
    references: "",
    aiUsage: "",
    hideEmptySections: true,
    approvedAt: "",
  },
};

const period3GenerationState = {
  loading: false,
  error: "",
  lastGeneratedAt: 0,
};
const period2GenerationState = {
  loading: false,
  error: "",
  lastGeneratedAt: 0,
};

const DATA_PACKS = [
  {
    id: "digital-internet-korea",
    category: "디지털 기술",
    title: "대한민국 인터넷 이용자 비율",
    description: "개인 중 인터넷을 이용하는 사람의 비율 변화",
    sourceName: "World Bank, Individuals using the Internet (% of population), IT.NET.USER.ZS",
    sourceUrl: "https://data.worldbank.org/indicator/IT.NET.USER.ZS?locations=KR",
    period: "2019~2024",
    unit: "%",
    relatedKeywords: ["디지털", "인터넷", "스마트폰", "온라인", "미디어", "청소년", "기술"],
    tableData: { columns: ["연도", "인터넷 이용자 비율"], rows: [["2019", 96.16], ["2020", 96.51], ["2021", 97.57], ["2022", 97.17], ["2023", 97.42], ["2024", 97.9]] },
    availableChartTypes: ["line", "bar"],
  },
  {
    id: "employment-unemployment-korea",
    category: "산업·고용",
    title: "대한민국 실업률",
    description: "전체 노동인구 대비 실업률 변화",
    sourceName: "World Bank, Unemployment, total (% of total labor force), SL.UEM.TOTL.ZS",
    sourceUrl: "https://data.worldbank.org/indicator/SL.UEM.TOTL.ZS?locations=KR",
    period: "2020~2025",
    unit: "%",
    relatedKeywords: ["직업", "진로", "고용", "실업", "산업", "노동", "경제"],
    tableData: { columns: ["연도", "실업률"], rows: [["2020", 3.93], ["2021", 3.64], ["2022", 2.86], ["2023", 2.68], ["2024", 2.78], ["2025", 2.68]] },
    availableChartTypes: ["line", "bar"],
  },
  {
    id: "education-secondary-enrollment-korea",
    category: "교육·진로",
    title: "대한민국 중등교육 총취학률",
    description: "중등교육 단계의 총취학률 변화",
    sourceName: "World Bank, School enrollment, secondary (% gross), SE.SEC.ENRR",
    sourceUrl: "https://data.worldbank.org/indicator/SE.SEC.ENRR?locations=KR",
    period: "2019~2024",
    unit: "%",
    relatedKeywords: ["교육", "학교", "진로", "학습", "학생", "중학생", "고등학생"],
    tableData: { columns: ["연도", "중등교육 총취학률"], rows: [["2019", 98.38], ["2020", 97.09], ["2021", 98.07], ["2022", 97.82], ["2023", 96.3], ["2024", 96.25]] },
    availableChartTypes: ["line", "bar"],
  },
  {
    id: "youth-life-internet-korea",
    category: "청소년 생활",
    title: "청소년 생활 참고 지표: 인터넷 이용률",
    description: "청소년 생활 주제에서 디지털 환경 변화를 참고할 때 사용할 수 있는 공개 지표",
    sourceName: "World Bank, Individuals using the Internet (% of population), IT.NET.USER.ZS",
    sourceUrl: "https://data.worldbank.org/indicator/IT.NET.USER.ZS?locations=KR",
    period: "2019~2024",
    unit: "%",
    relatedKeywords: ["청소년", "생활", "스마트폰", "인터넷", "수면", "미디어", "온라인"],
    tableData: { columns: ["연도", "인터넷 이용자 비율"], rows: [["2019", 96.16], ["2020", 96.51], ["2021", 97.57], ["2022", 97.17], ["2023", 97.42], ["2024", 97.9]] },
    availableChartTypes: ["line", "bar"],
  },
  {
    id: "environment-renewable-energy-korea",
    category: "환경·에너지",
    title: "대한민국 재생에너지 소비 비중",
    description: "최종 에너지 소비 중 재생에너지 비중 변화",
    sourceName: "World Bank, Renewable energy consumption (% of total final energy consumption), EG.FEC.RNEW.ZS",
    sourceUrl: "https://data.worldbank.org/indicator/EG.FEC.RNEW.ZS?locations=KR",
    period: "2016~2021",
    unit: "%",
    relatedKeywords: ["환경", "에너지", "재생에너지", "기후", "탄소", "전기", "지속가능"],
    tableData: { columns: ["연도", "재생에너지 소비 비중"], rows: [["2016", 2.6], ["2017", 2.8], ["2018", 3.2], ["2019", 3.2], ["2020", 3.6], ["2021", 3.6]] },
    availableChartTypes: ["line", "bar"],
  },
  {
    id: "population-urban-korea",
    category: "인구·지역",
    title: "대한민국 도시 인구 비율",
    description: "전체 인구 중 도시 지역 거주 인구 비율 변화",
    sourceName: "World Bank, Urban population (% of total population), SP.URB.TOTL.IN.ZS",
    sourceUrl: "https://data.worldbank.org/indicator/SP.URB.TOTL.IN.ZS?locations=KR",
    period: "2020~2025",
    unit: "%",
    relatedKeywords: ["인구", "지역", "도시", "지방", "사회", "주거", "이동"],
    tableData: { columns: ["연도", "도시 인구 비율"], rows: [["2020", 81.18], ["2021", 81.16], ["2022", 81.16], ["2023", 81.16], ["2024", 81.17], ["2025", 81.17]] },
    availableChartTypes: ["line", "bar"],
  },
];
function createDefaultReportData() {
  const now = new Date().toISOString();
  return {
    student: { name: "", studentNumber: "", className: "" },
    report: {
      title: "",
      topicReason: "",
      researchQuestion: "",
      independentVariable: "",
      dependentVariable: "",
      researchScope: "",
      dataSummary: "",
      cleanedDataNotes: "",
      introduction: { background: "", purpose: "", necessity: "" },
      methodology: { dataSource: "", collectionMethod: "", analysisMethod: "" },
      results: { summary: "", chartTitle: "", xAxisDescription: "", yAxisDescription: "", interpretation: "" },
      conclusion: { answer: "", significance: "", limitations: "", futureResearch: "" },
      references: [],
      aiUsageLogs: [],
      selfDraft: "",
      aiRevisedSentence: "",
      finalRevisedSentence: "",
      peerFeedback: "",
      feedbackReflection: "",
      aiFinalRevisionLog: "",
      generated: {
        period1: structuredClone(PERIOD1_DEFAULTS),
        period2: structuredClone(PERIOD2_DEFAULTS),
        period3: structuredClone(PERIOD3_DEFAULTS),
        period4: structuredClone(PERIOD4_DEFAULTS),
      },
    },
    chartImage: null,
    metadata: { createdAt: now, updatedAt: now, pdfGenerated: false, pdfGeneratedAt: "" },
  };
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/\n+/).map((item) => item.trim()).filter(Boolean);
  return [];
}

function normalizePeriod2Data(value) {
  const base = structuredClone(PERIOD2_DEFAULTS);
  const input = value || {};
  return {
    ...base,
    ...input,
    inheritedFromPeriod1: { ...base.inheritedFromPeriod1, ...(input.inheritedFromPeriod1 || {}) },
    selectedDirection: { ...base.selectedDirection, ...(input.selectedDirection || {}) },
    selectedDataPack: { ...base.selectedDataPack, ...(input.selectedDataPack || {}) },
    visualizations: {
      basicChart: { ...base.visualizations.basicChart, ...(input.visualizations?.basicChart || {}) },
      specialChart: { ...base.visualizations.specialChart, ...(input.visualizations?.specialChart || {}) },
    },
    generatedAnalysis: {
      ...base.generatedAnalysis,
      ...(input.generatedAnalysis || {}),
      keyFindings: normalizeList(input.generatedAnalysis?.keyFindings),
      limitations: normalizeList(input.generatedAnalysis?.limitations),
      updatedOutline: normalizeList(input.generatedAnalysis?.updatedOutline),
      analysisDirections: normalizeList(input.generatedAnalysis?.analysisDirections),
    },
  };
}


function normalizePeriod3Data(value) {
  const base = structuredClone(PERIOD3_DEFAULTS);
  const input = value || {};
  return {
    ...base,
    ...input,
    inheritedFromPeriod1: { ...base.inheritedFromPeriod1, ...(input.inheritedFromPeriod1 || {}) },
    inheritedFromPeriod2: { ...base.inheritedFromPeriod2, ...(input.inheritedFromPeriod2 || {}) },
    studentInputs: { ...base.studentInputs, ...(input.studentInputs || {}) },
    generatedDraft: {
      ...base.generatedDraft,
      ...(input.generatedDraft || {}),
      updatedOutline: normalizeList(input.generatedDraft?.updatedOutline),
    },
  };
}
function normalizePeriod4Data(value) {
  const base = structuredClone(PERIOD4_DEFAULTS);
  const input = value || {};
  return {
    ...base,
    ...input,
    inheritedFromPeriod1: { ...base.inheritedFromPeriod1, ...(input.inheritedFromPeriod1 || {}) },
    inheritedFromPeriod2: { ...base.inheritedFromPeriod2, ...(input.inheritedFromPeriod2 || {}) },
    inheritedFromPeriod3: { ...base.inheritedFromPeriod3, ...(input.inheritedFromPeriod3 || {}) },
    checklist: { ...base.checklist, ...(input.checklist || {}) },
    studentInputs: { ...base.studentInputs, ...(input.studentInputs || {}) },
    finalEdits: { ...base.finalEdits, ...(input.finalEdits || {}) },
  };
}

function normalizeReportData(data) {
  const base = createDefaultReportData();
  const period1 = data?.report?.generated?.period1 || {};
  const period2 = data?.report?.generated?.period2 || {};
  const period3 = data?.report?.generated?.period3 || {};
  const period4 = data?.report?.generated?.period4 || {};
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
      generated: {
        ...(base.report.generated || {}),
        ...(data?.report?.generated || {}),
        period1: {
          topicSetting: { ...PERIOD1_DEFAULTS.topicSetting, ...(period1.topicSetting || {}) },
          researchDesign: { ...PERIOD1_DEFAULTS.researchDesign, ...(period1.researchDesign || {}) },
        },
        period2: normalizePeriod2Data(period2),
        period3: normalizePeriod3Data(period3),
        period4: normalizePeriod4Data(period4),
      },
    },
    chartImage: data?.chartImage || null,
    metadata: { ...base.metadata, ...(data?.metadata || {}) },
  };
}

function loadReportData() {
  try {
    const stored = window.localStorage.getItem(REPORT_STORAGE_KEY);
    return stored ? normalizeReportData(JSON.parse(stored)) : createDefaultReportData();
  } catch {
    return createDefaultReportData();
  }
}

function saveReportData(data) {
  const normalized = normalizeReportData(data);
  normalized.metadata.updatedAt = new Date().toISOString();
  try {
    window.localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    showToast("저장 공간을 확인해 주세요.");
  }
  window.LoreAXUsage?.trackActivitySave?.(LESSON_ID, { source: "topic_research_save" });
  return normalized;
}

function savePeriod1Data(mutator, options = {}) {
  const data = readFormData();
  mutator(data);
  const saved = saveReportData(data);
  syncReportForm(saved);
  setSaveStatusText(`로컬 저장됨 · ${new Date(saved.metadata.updatedAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`);
  updateProgressDisplay();
  saveReportToServer(saved);
  sendPresenceHeartbeat();
  if (options.render !== false) renderSteps(saved);
  return saved;
}

function syncReportForm(data) {
  dom.reportForm.querySelectorAll("[data-report-path]").forEach((field) => {
    const value = getByPath(data, field.dataset.reportPath);
    field.value = Array.isArray(value) ? value.join("\n") : value || "";
  });
}

function getByPath(source, path) {
  return path.split(".").reduce((target, key) => target?.[key], source);
}

function setByPath(source, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const target = keys.reduce((node, key) => {
    if (!node[key] || typeof node[key] !== "object") node[key] = {};
    return node[key];
  }, source);
  target[lastKey] = value;
}

function syncPeriod1ToReportFields(data) {
  const period1 = getPeriod1(data);
  if (period1.topicSetting.selectedTopic) data.report.title = period1.topicSetting.selectedTopic;
  if (period1.topicSetting.topicReason) data.report.topicReason = period1.topicSetting.topicReason;
  if (period1.researchDesign.finalResearchQuestion) data.report.researchQuestion = period1.researchDesign.finalResearchQuestion;
  if (period1.researchDesign.researchTarget) data.report.researchTarget = period1.researchDesign.researchTarget;
  if (period1.researchDesign.researchScope) data.report.researchScope = period1.researchDesign.researchScope;
  if (period1.researchDesign.priorResearchSummary) data.report.dataSummary = period1.researchDesign.priorResearchSummary;
  if (period1.researchDesign.theory) data.report.theory = period1.researchDesign.theory;
  if (period1.researchDesign.theoryApplication) data.report.theoryApplication = period1.researchDesign.theoryApplication;
  if (period1.researchDesign.initialOutline) data.report.initialOutline = period1.researchDesign.initialOutline;
  if (period1.researchDesign.comparisonPoint) data.report.comparisonPoint = period1.researchDesign.comparisonPoint;
  if (period1.researchDesign.dataDirection) data.report.methodology.collectionMethod = period1.researchDesign.dataDirection;
  const sourceText = period1.researchDesign.organizedSource || period1.researchDesign.paperTitle;
  if (sourceText) {
    data.report.methodology.dataSource = sourceText;
    data.report.references = Array.from(new Set([...normalizeList(data.report.references), sourceText]));
  }
}

function addAiUsageLog(data, message) {
  const logs = normalizeList(data.report.aiUsageLogs);
  if (!logs.includes(message)) logs.push(message);
  data.report.aiUsageLogs = logs;
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => dom.toast.classList.remove("is-visible"), 1800);
}

function readFormData() {
  const data = loadReportData();
  dom.reportForm.querySelectorAll("[data-report-path]").forEach((field) => {
    const path = field.dataset.reportPath;
    const rawValue = field.value || "";
    const value = path === "report.references" || path === "report.aiUsageLogs" ? normalizeList(rawValue) : rawValue;
    setByPath(data, path, value);
  });
  return data;
}

function hydrateForm() {
  const data = loadReportData();
  try {
    window.localStorage.setItem("selectedLessonId", LESSON_ID);
  } catch {}
  dom.reportForm.querySelectorAll("[data-report-path]").forEach((field) => {
    const value = getByPath(data, field.dataset.reportPath);
    field.value = Array.isArray(value) ? value.join("\n") : value || "";
  });
  renderChartPreview(data.chartImage);
  updateProgressDisplay();
  sendPresenceHeartbeat();
}

function scheduleSave() {
  setSaveStatusText("저장 중...");
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    const saved = saveReportData(readFormData());
    setSaveStatusText(`로컬 저장됨 · ${new Date(saved.metadata.updatedAt).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    })}`);
    updateProgressDisplay();
    saveReportToServer(saved);
    sendPresenceHeartbeat();
  }, 900);
}

function loadProgress() {
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {}
}

function getProgressSummary() {
  const progress = loadProgress();
  const ids = lessonSteps.flatMap((step) => step.checklist.map((_, index) => `${step.id}-${index}`));
  const done = ids.filter((id) => progress[id]).length;
  return { done, total: ids.length };
}

function updateProgressDisplay() {
  const { done, total } = getProgressSummary();
  dom.progressSummary.textContent = total ? `체크리스트 ${done} / ${total} 완료` : "진행 체크리스트가 없습니다.";
}

function updatePeriod1ProgressDisplay() {
  const { done, total } = getProgressSummary();
  const reportData = loadReportData();
  const period1Items = getPeriod1CompletionItems(getPeriod1(reportData));
  const period2Items = getPeriod2CompletionItems(getPeriod2(reportData));
  const period3Items = getPeriod3CompletionItems(getPeriod3(reportData));
  const period4Items = getPeriod4CompletionItems(getPeriod4(reportData));
  const period1Done = period1Items.filter((item) => item.complete).length;
  const period2Done = period2Items.filter((item) => item.complete).length;
  const period3Done = period3Items.filter((item) => item.complete).length;
  const period4Done = period4Items.filter((item) => item.complete).length;
  const checklistText = total ? `체크리스트 ${done}/${total}` : "체크리스트 없음";
  dom.progressSummary.textContent = `${checklistText} · 1차시 ${period1Done}/${period1Items.length} · 2차시 ${period2Done}/${period2Items.length} · 3차시 ${period3Done}/${period3Items.length} · 4차시 ${period4Done}/${period4Items.length}`;
}

updateProgressDisplay = updatePeriod1ProgressDisplay;

function renderSteps(reportDataOverride) {
  const progress = loadProgress();
  const reportData = reportDataOverride || loadReportData();
  dom.stepList.innerHTML = lessonSteps
    .map((step, index) => {
      if (step.id === "period1-step1") return renderPeriod1TopicCard(step, index, reportData);
      if (step.id === "period1-step2") return renderPeriod1ResearchCard(step, index, reportData);
      if (step.id === "period2") return renderPeriod2Card(step, index, reportData);
      if (step.id === "period3") return renderPeriod3Card(step, index, reportData);
      if (step.id === "period4") return renderPeriod4Card(step, index, reportData);
      if (!isActiveStep(index)) {
        const ids = step.checklist.map((_, checkIndex) => `${step.id}-${checkIndex}`);
        const done = ids.filter((id) => progress[id]).length;
        return renderCollapsedPeriodCard(step, index, `완료 ${done}/${ids.length}`, step.goal);
      }
      return `
        <details class="step-card is-active" open>
          <summary data-step-toggle="${index}">
            <div class="step-title">
              <span class="step-tag">${escapeHtml(step.label)}</span>
              <div>
                <strong>${escapeHtml(step.title)}</strong>
                <span>${escapeHtml(step.goal)}</span>
              </div>
            </div>
            <span class="status-pill">열림</span>
          </summary>
          <div class="step-body">
            <div class="step-grid">
              ${miniPanel("세부 내용", step.details)}
              ${miniPanel("학생 활동", step.activities)}
              ${miniPanel("학생 입력", step.inputs)}
              <div class="mini-panel">
                <h4>외부 도구</h4>
                <div class="tool-grid">
                  ${step.tools
                    .map((tool) => `<a class="tool-link" href="${TOOL_URLS[tool]}" target="_blank" rel="noopener noreferrer">${escapeHtml(tool)}</a>`)
                    .join("")}
                </div>
              </div>
            </div>
            <div class="prompt-box">
              <div class="prompt-guide">
                <div>
                  <span class="prompt-label">견본 프롬프트</span>
                  <h4>${escapeHtml(step.promptTitle || "학생용 견본 프롬프트")}</h4>
                  <p>${escapeHtml(step.promptTiming || "이 단계의 활동을 시작할 때 사용하세요.")}</p>
                </div>
                <div class="prompt-meta-grid">
                  <section>
                    <strong>무엇을 입력해야 하나요?</strong>
                    <ul>${(step.promptInputs || step.inputs || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                  </section>
                  <section>
                    <strong>사용 후 확인할 점</strong>
                    <ul>${(step.promptCheckpoints || step.checklist || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
                  </section>
                </div>
              </div>
              <pre>${escapeHtml(step.prompt)}</pre>
              <button class="copy-button" type="button" data-copy-prompt="${step.id}">프롬프트 복사</button>
            </div>
            <div>
              <h4>체크리스트</h4>
              <div class="checklist">
                ${step.checklist
                  .map((item, checkIndex) => {
                    const id = `${step.id}-${checkIndex}`;
                    const checked = Boolean(progress[id]);
                    return `<label class="${checked ? "is-complete" : ""}">
                      <input type="checkbox" data-progress-id="${id}" ${checked ? "checked" : ""} />
                      <span>${escapeHtml(item)}</span>
                    </label>`;
                  })
                  .join("")}
              </div>
            </div>
            <div class="warning-panel"><strong>주의</strong><p>${escapeHtml(step.warning)}</p></div>
          </div>
        </details>
      `;
    })
    .join("") + renderStepNav();
}
function isActiveStep(index) {
  return index === activeStepIndex;
}

function renderStepNav() {
  const hasActiveStep = activeStepIndex >= 0;
  const current = hasActiveStep ? lessonSteps[activeStepIndex] : null;
  return `
    <div class="step-bottom-nav" aria-label="단계 이동">
      <button class="secondary-button" type="button" data-step-nav="prev" ${!hasActiveStep || activeStepIndex <= 0 ? "disabled" : ""}>이전</button>
      <span>${current ? `<strong>${escapeHtml(current.label)}</strong> ${escapeHtml(current.title)}` : "단계를 선택하세요"}</span>
      <button class="primary-button" type="button" data-step-nav="next" ${hasActiveStep && activeStepIndex >= lessonSteps.length - 1 ? "disabled" : ""}>${hasActiveStep ? "다음" : "처음 단계 열기"}</button>
    </div>
  `;
}

function getPeriod1(data) {
  if (!data.report) data.report = {};
  if (!data.report.generated) data.report.generated = {};
  if (!data.report.generated.period1) data.report.generated.period1 = structuredClone(PERIOD1_DEFAULTS);
  data.report.generated.period1.topicSetting = {
    ...PERIOD1_DEFAULTS.topicSetting,
    ...(data.report.generated.period1.topicSetting || {}),
  };
  data.report.generated.period1.researchDesign = {
    ...PERIOD1_DEFAULTS.researchDesign,
    ...(data.report.generated.period1.researchDesign || {}),
  };
  normalizePeriod1Aliases(data.report.generated.period1);
  return data.report.generated.period1;
}

function getPeriod2(data) {
  if (!data.report) data.report = {};
  if (!data.report.generated) data.report.generated = {};
  data.report.generated.period2 = normalizePeriod2Data(data.report.generated.period2);
  syncPeriod2Inherited(data);
  return data.report.generated.period2;
}

function syncPeriod2Inherited(data) {
  const period1 = getPeriod1(data);
  const period2 = data.report.generated.period2 || normalizePeriod2Data({});
  period2.inheritedFromPeriod1 = {
    selectedTopic: period1.topicSetting.selectedTopic || data.report.title || "",
    finalResearchQuestion: period1.researchDesign.finalResearchQuestion || data.report.researchQuestion || "",
    researchTarget: period1.researchDesign.researchTarget || data.report.researchTarget || "",
    researchScope: period1.researchDesign.researchScope || data.report.researchScope || "",
    comparisonFactors: normalizeList(period1.researchDesign.comparisonFactors?.length ? period1.researchDesign.comparisonFactors : period1.researchDesign.comparisonPoint),
    theory: period1.researchDesign.theory || data.report.theory || "",
    theoryApplication: period1.researchDesign.theoryApplication || data.report.theoryApplication || "",
    dataDirection: period1.researchDesign.dataDirection || data.report.methodology?.collectionMethod || "",
  };
  data.report.generated.period2 = period2;
}

function savePeriod2Data(mutator, options = {}) {
  const data = readFormData();
  getPeriod2(data);
  mutator(data);
  syncPeriod2ToReportFields(data);
  const saved = saveReportData(data);
  syncReportForm(saved);
  setSaveStatusText(`로컬 저장됨 · ${new Date(saved.metadata.updatedAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`);
  updateProgressDisplay();
  saveReportToServer(saved);
  sendPresenceHeartbeat();
  if (options.render !== false) renderSteps(saved);
  return saved;
}

function syncPeriod2ToReportFields(data) {
  const period2 = getPeriod2(data);
  const pack = period2.selectedDataPack || {};
  const generated = period2.generatedAnalysis || {};
  if (pack.title) data.report.methodology.dataSource = `${pack.title} (${pack.sourceName || ""})`;
  if (pack.sourceUrl) data.report.references = Array.from(new Set([...normalizeList(data.report.references), `${pack.sourceName}: ${pack.sourceUrl}`]));
  if (period2.selectedDirection?.label) data.report.methodology.analysisMethod = period2.selectedDirection.label;
  if (generated.tableDescription) data.report.results.summary = generated.tableDescription;
  if (period2.visualizations?.basicChart?.title) data.report.results.chartTitle = period2.visualizations.basicChart.title;
  if (period2.visualizations?.basicChart?.xAxis) data.report.results.xAxisDescription = period2.visualizations.basicChart.xAxis;
  if (period2.visualizations?.basicChart?.yAxis) data.report.results.yAxisDescription = period2.visualizations.basicChart.yAxis;
  if (generated.resultDraft || generated.basicChartDescription || generated.specialChartDescription) {
    data.report.results.interpretation = [generated.resultDraft, generated.basicChartDescription, generated.specialChartDescription, generated.comparison]
      .filter(Boolean)
      .join("\n\n");
  }
  if (generated.theoryConnection || generated.researchQuestionConnection) {
    data.report.conclusion.significance = [generated.theoryConnection, generated.researchQuestionConnection].filter(Boolean).join("\n\n");
  }
  if (generated.limitations?.length) data.report.conclusion.limitations = generated.limitations.join("\n");
  if (generated.updatedOutline?.length) data.report.initialOutline = generated.updatedOutline.join("\n");
}


function getPeriod3(data) {
  if (!data.report) data.report = {};
  if (!data.report.generated) data.report.generated = {};
  data.report.generated.period3 = normalizePeriod3Data(data.report.generated.period3);
  syncPeriod3Inherited(data);
  return data.report.generated.period3;
}

function syncPeriod3Inherited(data) {
  const period1 = getPeriod1(data);
  const period2 = getPeriod2(data);
  const generated2 = period2.generatedAnalysis || {};
  const period3 = data.report.generated.period3 || normalizePeriod3Data({});
  period3.inheritedFromPeriod1 = {
    selectedTopic: period1.topicSetting.selectedTopic || data.report.title || "",
    topicReason: period1.topicSetting.topicReason || data.report.topicReason || "",
    finalResearchQuestion: period1.researchDesign.finalResearchQuestion || data.report.researchQuestion || "",
    researchTarget: period1.researchDesign.researchTarget || data.report.researchTarget || "",
    researchScope: period1.researchDesign.researchScope || data.report.researchScope || "",
    comparisonFactors: normalizeList(period1.researchDesign.comparisonFactors?.length ? period1.researchDesign.comparisonFactors : period1.researchDesign.comparisonPoint),
    priorResearchSummary: period1.researchDesign.priorResearchSummary || data.report.dataSummary || "",
    theory: period1.researchDesign.theory || data.report.theory || "",
    theoryApplication: period1.researchDesign.theoryApplication || data.report.theoryApplication || "",
  };
  period3.inheritedFromPeriod2 = {
    selectedDirection: period2.selectedDirection || {},
    selectedDataPack: period2.selectedDataPack || {},
    tableDescription: generated2.tableDescription || "",
    basicChartDescription: generated2.basicChartDescription || "",
    specialChartDescription: generated2.specialChartDescription || "",
    keyFindings: normalizeList(generated2.keyFindings),
    theoryConnection: generated2.theoryConnection || "",
    researchQuestionConnection: generated2.researchQuestionConnection || "",
    limitations: normalizeList(generated2.limitations),
    resultDraft: generated2.resultDraft || "",
  };
  data.report.generated.period3 = period3;
}

function savePeriod3Data(mutator, options = {}) {
  const data = readFormData();
  getPeriod3(data);
  mutator(data);
  syncPeriod3ToReportFields(data);
  const saved = saveReportData(data);
  syncReportForm(saved);
  setSaveStatusText(`로컬 저장됨 · ${new Date(saved.metadata.updatedAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`);
  updateProgressDisplay();
  saveReportToServer(saved);
  sendPresenceHeartbeat();
  if (options.render !== false) renderSteps(saved);
  return saved;
}

function syncPeriod3ToReportFields(data) {
  const draft = getPeriod3(data).generatedDraft || {};
  if (!draft.approvedAt) return;
  if (draft.background) data.report.introduction.background = draft.background;
  if (draft.purpose) data.report.introduction.purpose = draft.purpose;
  if (draft.necessity) data.report.introduction.necessity = draft.necessity;
  if (draft.researchQuestion) data.report.researchQuestion = draft.researchQuestion;
  if (draft.researchScope) data.report.researchScope = draft.researchScope;
  if (draft.dataCollectionMethod) data.report.methodology.collectionMethod = draft.dataCollectionMethod;
  if (draft.analysisMethod) data.report.methodology.analysisMethod = draft.analysisMethod;
  if (draft.resultSectionDraft) data.report.results.summary = draft.resultSectionDraft;
  if (draft.aiUsageMethod) data.report.aiFinalRevisionLog = draft.aiUsageMethod;
  if (draft.updatedOutline?.length) data.report.finalOutline = draft.updatedOutline.join("\n");
}
function getPeriod4(data) {
  if (!data.report) data.report = {};
  if (!data.report.generated) data.report.generated = {};
  data.report.generated.period4 = normalizePeriod4Data(data.report.generated.period4);
  syncPeriod4Inherited(data);
  return data.report.generated.period4;
}

function syncPeriod4Inherited(data) {
  const period1 = getPeriod1(data);
  const period2 = getPeriod2(data);
  const period3 = getPeriod3(data);
  const generated2 = period2.generatedAnalysis || {};
  const draft3 = period3.generatedDraft || {};
  const period4 = data.report.generated.period4 || normalizePeriod4Data({});
  period4.inheritedFromPeriod1 = {
    selectedTopic: period1.topicSetting.selectedTopic || data.report.title || "",
    topicReason: period1.topicSetting.topicReason || data.report.topicReason || "",
    finalResearchQuestion: period1.researchDesign.finalResearchQuestion || data.report.researchQuestion || "",
    researchTarget: period1.researchDesign.researchTarget || data.report.researchTarget || "",
    researchScope: period1.researchDesign.researchScope || data.report.researchScope || "",
    comparisonFactors: normalizeList(period1.researchDesign.comparisonFactors?.length ? period1.researchDesign.comparisonFactors : period1.researchDesign.comparisonPoint),
    priorResearchSummary: period1.researchDesign.priorResearchSummary || data.report.dataSummary || "",
    theory: period1.researchDesign.theory || data.report.theory || "",
    theoryApplication: period1.researchDesign.theoryApplication || data.report.theoryApplication || "",
    initialOutline: period1.researchDesign.initialOutline || data.report.initialOutline || "",
  };
  period4.inheritedFromPeriod2 = {
    selectedDirection: period2.selectedDirection || {},
    selectedDataPack: period2.selectedDataPack || {},
    basicChart: period2.visualizations?.basicChart || {},
    specialChart: period2.visualizations?.specialChart || {},
    tableDescription: generated2.tableDescription || "",
    basicChartDescription: generated2.basicChartDescription || "",
    specialChartDescription: generated2.specialChartDescription || "",
    comparison: generated2.comparison || "",
    keyFindings: normalizeList(generated2.keyFindings),
    theoryConnection: generated2.theoryConnection || "",
    researchQuestionConnection: generated2.researchQuestionConnection || "",
    limitations: normalizeList(generated2.limitations),
    resultDraft: generated2.resultDraft || "",
    updatedOutline: normalizeList(generated2.updatedOutline),
  };
  period4.inheritedFromPeriod3 = {
    background: draft3.approvedAt ? draft3.background || "" : "",
    purpose: draft3.approvedAt ? draft3.purpose || "" : "",
    necessity: draft3.approvedAt ? draft3.necessity || "" : "",
    researchQuestion: draft3.approvedAt ? draft3.researchQuestion || "" : "",
    researchScope: draft3.approvedAt ? draft3.researchScope || "" : "",
    priorResearchSection: draft3.approvedAt ? draft3.priorResearchSection || "" : "",
    theoreticalBackground: draft3.approvedAt ? draft3.theoreticalBackground || "" : "",
    dataCollectionMethod: draft3.approvedAt ? draft3.dataCollectionMethod || "" : "",
    dataSelectionCriteria: draft3.approvedAt ? draft3.dataSelectionCriteria || "" : "",
    analysisMethod: draft3.approvedAt ? draft3.analysisMethod || "" : "",
    visualizationMethod: draft3.approvedAt ? draft3.visualizationMethod || "" : "",
    resultSectionDraft: draft3.approvedAt ? draft3.resultSectionDraft || "" : "",
    studentVoiceReflection: draft3.approvedAt ? draft3.studentVoiceReflection || "" : "",
    aiUsageMethod: draft3.approvedAt ? draft3.aiUsageMethod || "" : "",
    updatedOutline: draft3.approvedAt ? normalizeList(draft3.updatedOutline) : [],
  };
  data.report.generated.period4 = period4;
}

function buildPeriod4ApprovedDraft(data) {
  const period4 = getPeriod4(data);
  const p1 = period4.inheritedFromPeriod1 || {};
  const p2 = period4.inheritedFromPeriod2 || {};
  const p3 = period4.inheritedFromPeriod3 || {};
  const outline = normalizeList(p3.updatedOutline).length ? normalizeList(p3.updatedOutline) : normalizeList(p2.updatedOutline).length ? normalizeList(p2.updatedOutline) : normalizeList(p1.initialOutline);
  const references = normalizeList(data.report.references);
  const aiUsage = [p3.aiUsageMethod, ...normalizeList(data.report.aiUsageLogs), data.report.aiFinalRevisionLog].filter(Boolean);
  return {
    ...PERIOD4_DEFAULTS.finalEdits,
    title: p1.selectedTopic || data.report.title || "",
    outline: outline.join("\n"),
    background: p3.background || data.report.introduction?.background || "",
    purposeNecessity: [p3.purpose || data.report.introduction?.purpose, p3.necessity || data.report.introduction?.necessity].filter(Boolean).join("\n\n"),
    questionScope: [p3.researchQuestion || p1.finalResearchQuestion || data.report.researchQuestion, p3.researchScope || p1.researchScope || data.report.researchScope].filter(Boolean).join("\n\n"),
    priorTheory: [p3.priorResearchSection || p1.priorResearchSummary, p3.theoreticalBackground || p1.theory, p1.theoryApplication].filter(Boolean).join("\n\n"),
    methodology: [p3.dataCollectionMethod, p3.dataSelectionCriteria, p3.analysisMethod, p3.visualizationMethod].filter(Boolean).join("\n\n"),
    tableGraphDescription: [p2.tableDescription, p2.basicChartDescription, p2.specialChartDescription, p2.comparison].filter(Boolean).join("\n\n"),
    analysisResult: [p2.resultDraft, p3.resultSectionDraft, ...normalizeList(p2.keyFindings)].filter(Boolean).join("\n\n"),
    conclusion: [data.report.conclusion?.answer, data.report.conclusion?.significance, data.report.conclusion?.limitations, data.report.conclusion?.futureResearch].filter(Boolean).join("\n\n"),
    references: references.join("\n"),
    aiUsage: aiUsage.join("\n"),
    hideEmptySections: true,
    approvedAt: "",
  };
}

function ensurePeriod4FinalEdits(data) {
  const period4 = getPeriod4(data);
  const defaults = buildPeriod4ApprovedDraft(data);
  Object.keys(defaults).forEach((key) => {
    if (key === "hideEmptySections" || key === "approvedAt") return;
    if (!period4.finalEdits[key]) period4.finalEdits[key] = defaults[key] || "";
  });
  if (typeof period4.finalEdits.hideEmptySections !== "boolean") period4.finalEdits.hideEmptySections = true;
  return period4;
}

function savePeriod4Data(mutator, options = {}) {
  const data = readFormData();
  ensurePeriod4FinalEdits(data);
  mutator(data);
  syncPeriod4ToReportFields(data);
  const saved = saveReportData(data);
  syncReportForm(saved);
  setSaveStatusText(`로컬 저장됨 · ${new Date(saved.metadata.updatedAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`);
  updateProgressDisplay();
  saveReportToServer(saved);
  sendPresenceHeartbeat();
  if (options.render !== false) renderSteps(saved);
  return saved;
}

function syncPeriod4ToReportFields(data) {
  const period4 = getPeriod4(data);
  const edits = period4.finalEdits || {};
  if (!edits.approvedAt) return;
  data.report.title = edits.title || data.report.title;
  if (edits.background) data.report.introduction.background = edits.background;
  if (edits.purposeNecessity) data.report.introduction.purpose = edits.purposeNecessity;
  if (edits.questionScope) data.report.researchQuestion = edits.questionScope;
  if (edits.methodology) data.report.methodology.analysisMethod = edits.methodology;
  if (edits.tableGraphDescription) data.report.results.interpretation = edits.tableGraphDescription;
  if (edits.analysisResult) data.report.results.summary = edits.analysisResult;
  const finalAnswer = period4.studentInputs?.finalAnswer || "";
  const reflection = period4.studentInputs?.learningReflection || "";
  const future = period4.studentInputs?.futureInquiry || "";
  if (finalAnswer || edits.conclusion) data.report.conclusion.answer = [finalAnswer, edits.conclusion].filter(Boolean).join("\n\n");
  if (future) data.report.conclusion.futureResearch = future;
  if (reflection) data.report.feedbackReflection = reflection;
  if (edits.references) data.report.references = normalizeList(edits.references);
  if (edits.aiUsage) data.report.aiFinalRevisionLog = edits.aiUsage;
  if (edits.outline) data.report.finalOutline = edits.outline;
}

function normalizePeriod1Aliases(period1) {
  const topic = period1.topicSetting;
  const design = period1.researchDesign;
  const keywordValues = [topic.keyword1, topic.keyword2, topic.keyword3].filter(Boolean);
  if (!Array.isArray(topic.keywords) || !topic.keywords.length) topic.keywords = keywordValues;
  if (!topic.keyword1 && topic.keywords[0]) topic.keyword1 = topic.keywords[0];
  if (!topic.keyword2 && topic.keywords[1]) topic.keyword2 = topic.keywords[1];
  if (!topic.keyword3 && topic.keywords[2]) topic.keyword3 = topic.keywords[2];
  if (!topic.generatedCandidates?.length && topic.candidates?.length) topic.generatedCandidates = topic.candidates;
  if (!topic.candidates?.length && topic.generatedCandidates?.length) topic.candidates = topic.generatedCandidates;
  if (!topic.selectedReason && topic.topicReason) topic.selectedReason = topic.topicReason;

  if (!design.paperRawText && design.literaturePaste) design.paperRawText = design.literaturePaste;
  if (!design.paperKeySentences && design.paperRawText) design.paperKeySentences = design.paperRawText;
  const paperParts = [
    design.paperTitle ? `논문 제목: ${design.paperTitle}` : "",
    design.paperKeySentences ? `초록 또는 핵심 문장: ${design.paperKeySentences}` : "",
    design.paperRelevanceReason ? `내 주제와 관련 있는 이유: ${design.paperRelevanceReason}` : "",
  ].filter(Boolean);
  if (paperParts.length) design.paperRawText = paperParts.join("\n");
  if (!design.literaturePaste && design.paperRawText) design.literaturePaste = design.paperRawText;
  if (!design.finalResearchQuestion && design.recommendedQuestion) design.finalResearchQuestion = design.recommendedQuestion;
  if (!design.recommendedQuestion && design.finalResearchQuestion) design.recommendedQuestion = design.finalResearchQuestion;
  if (!Array.isArray(design.comparisonFactors) || !design.comparisonFactors.length) {
    design.comparisonFactors = String(design.comparisonPoint || "").split(/\n+/).map((item) => item.trim()).filter(Boolean);
  }
  if (!design.comparisonPoint && design.comparisonFactors?.length) design.comparisonPoint = design.comparisonFactors.join("\n");
  if (!design.priorResearchSummary && design.literatureSummary) design.priorResearchSummary = design.literatureSummary;
  if (!design.literatureSummary && design.priorResearchSummary) design.literatureSummary = design.priorResearchSummary;
  if (!design.theory && design.theoryConcept) design.theory = design.theoryConcept;
  if (!design.theoryConcept && design.theory) design.theoryConcept = design.theory;
  if (!design.dataDirection && design.nextDataDirection) design.dataDirection = design.nextDataDirection;
  if (!design.nextDataDirection && design.dataDirection) design.nextDataDirection = design.dataDirection;
  if (!Array.isArray(design.initialOutlineItems) || !design.initialOutlineItems.length) {
    design.initialOutlineItems = String(design.initialOutline || "").split(/\n+/).map((item) => item.trim()).filter(Boolean);
  }
  if (!design.initialOutline && design.initialOutlineItems?.length) design.initialOutline = design.initialOutlineItems.join("\n");
}

function renderCollapsedPeriodCard(step, index, statusText, subtitle = "") {
  return `
    <article class="step-card period-work-card is-collapsed-step" data-step-index="${index}">
      <button class="collapsed-step-button" type="button" data-step-jump="${index}">
        <span class="step-tag">${escapeHtml(step.label)}</span>
        <span class="collapsed-step-main">
          <strong>${escapeHtml(step.title)}</strong>
          <small>${escapeHtml(subtitle || step.goal)}</small>
        </span>
        <span class="status-pill">${escapeHtml(statusText || "열기")}</span>
      </button>
    </article>
  `;
}

function renderPeriod1TopicCard(step, index, reportData) {
  const period1 = getPeriod1(reportData);
  const topic = period1.topicSetting;
  const active = isActiveStep(index);
  if (!active) {
    const items = getPeriod1CompletionItems(period1);
    const done = items.filter((item) => item.complete).length;
    return renderCollapsedPeriodCard(step, index, `완료 ${done}/${items.length}`, "관심 분야와 키워드로 탐구 주제를 정합니다.");
  }
  return `
    <article class="step-card period-work-card ${active ? "is-active" : "is-hidden-step"}" data-step-index="${index}">
      <div class="period-work-head" data-step-toggle="${index}">
        <span class="step-tag">${step.label}</span>
        <div>
          <h3>${step.title}</h3>
          <p>${step.goal}</p>
        </div>
      </div>
      <div class="period-work-body">
        ${renderPeriod1Completion(period1)}
        <section class="period-work-section">
          <h4>학생 입력</h4>
          <div class="period-form-grid">
            ${periodInput("관심 분야", "report.generated.period1.topicSetting.interestArea", topic.interestArea, "예: 청소년 수면, 환경 문제, 스포츠 기록")}
            ${periodInput("관심 키워드 1", "report.generated.period1.topicSetting.keyword1", topic.keyword1, "예: 스마트폰")}
            ${periodInput("관심 키워드 2", "report.generated.period1.topicSetting.keyword2", topic.keyword2, "예: 수면 시간")}
            ${periodInput("관심 키워드 3", "report.generated.period1.topicSetting.keyword3", topic.keyword3, "예: 학업 집중도")}
            ${periodTextarea("관심을 가진 이유", "report.generated.period1.topicSetting.interestReason", topic.interestReason, "이 분야가 왜 궁금한지 학생 자신의 말로 적어 보세요.", 3)}
          </div>
        </section>

        <section class="period-tool-row" aria-label="외부 도구">
          <a class="tool-link" href="${TOOL_URLS.ChatGPT}" target="_blank" rel="noopener noreferrer">GPT 열기</a>
          <button class="copy-button" type="button" data-copy-prompt="${step.id}">프롬프트 복사</button>
          <button class="primary-button" type="button" data-period1-generate="topic" ${period1GenerationState.topic.loading ? "disabled" : ""}>
            ${period1GenerationState.topic.loading ? "생성 중..." : "주제 후보 자동 생성"}
          </button>
        </section>

        <section class="period-result-panel">
          <div class="period-result-head">
            <h4>생성 결과</h4>
            <p>학생 입력을 바탕으로 탐구 가능한 주제 후보를 만듭니다. 학생이 직접 선택하기 전까지 보고서에 자동 반영되지 않습니다.</p>
          </div>
          ${renderGenerationMessage("topic")}
          ${renderTopicCandidateCards(topic)}
        </section>

        <section class="period-work-section">
          <h4>선택 후 저장 필드</h4>
          <div class="period-form-grid">
            ${periodTextarea("최종 선택 주제", "report.generated.period1.topicSetting.selectedTopic", topic.selectedTopic || reportData.report.title, "선택한 탐구 주제를 학생 문장으로 정리하세요.", 2)}
            ${periodTextarea("주제 선택 이유", "report.generated.period1.topicSetting.topicReason", topic.topicReason || reportData.report.topicReason, "이 주제를 고른 이유를 적어 보세요.", 3)}
          </div>
        </section>
      </div>
    </article>
  `;
}

function renderPeriod1ResearchCard(step, index, reportData) {
  const period1 = getPeriod1(reportData);
  const topic = period1.topicSetting;
  const design = period1.researchDesign;
  const active = isActiveStep(index);
  if (!active) {
    const items = getPeriod1CompletionItems(period1);
    const done = items.filter((item) => item.complete).length;
    return renderCollapsedPeriodCard(step, index, `완료 ${done}/${items.length}`, "1차시-1에서 선택한 주제로 탐구 질문과 기존 연구를 정리합니다.");
  }
  return `
    <article class="step-card period-work-card ${active ? "is-active" : "is-hidden-step"}" data-step-index="${index}">
      <div class="period-work-head" data-step-toggle="${index}">
        <span class="step-tag">${step.label}</span>
        <div>
          <h3>${step.title}</h3>
          <p>${step.goal}</p>
        </div>
      </div>
      <div class="period-work-body">
        ${renderPeriod1Completion(period1)}
        <section class="period-work-section selected-topic-callout">
          <h4>자동 불러오기: 1차시-1 최종 선택 주제</h4>
          <p>${escapeHtml(topic.selectedTopic || reportData.report.title || "아직 선택한 주제가 없습니다. 1차시-1에서 주제를 먼저 선택하세요.")}</p>
        </section>

        <section class="period-work-section">
          <h4>학생 입력</h4>
          <p class="period-help-text">Semantic Scholar에서 내 주제와 관련된 논문 1개를 찾고, 이미지가 아니라 텍스트로 제목과 초록의 핵심 문장 1~2개만 복사해 넣으세요.</p>
          <div class="period-form-grid">
            ${periodTextarea("초안 탐구 질문", "report.generated.period1.researchDesign.draftQuestion", design.draftQuestion || reportData.report.researchQuestion, "예: 청소년의 스마트폰 사용 시간은 수면 시간과 어떤 관련이 있을까?", 3)}
            ${periodInput("찾은 논문 제목(텍스트)", "report.generated.period1.researchDesign.paperTitle", design.paperTitle, "Semantic Scholar에서 찾은 논문 제목을 텍스트로 입력")}
            ${periodTextarea("초록 핵심 문장 1~2개(텍스트)", "report.generated.period1.researchDesign.paperKeySentences", design.paperKeySentences, "초록에서 내 주제와 관련 있는 문장 1~2개만 텍스트로 붙여넣으세요.", 4)}
            ${periodTextarea("내 주제와 관련 있는 이유 1문장", "report.generated.period1.researchDesign.paperRelevanceReason", design.paperRelevanceReason, "이 논문이 내 탐구 주제와 왜 관련 있는지 한 문장으로 적으세요.", 2)}
          </div>
        </section>

        <section class="period-tool-row" aria-label="외부 도구">
          <button class="copy-button" type="button" data-period1-copy-search>검색어 복사</button>
          <a class="tool-link" href="${TOOL_URLS["Semantic Scholar"]}" target="_blank" rel="noopener noreferrer">Semantic Scholar 열기</a>
          <button class="secondary-button" type="button" data-period1-timer="300">5분 타이머</button>
          <span id="period1Timer" class="timer-chip">05:00</span>
          <button class="primary-button" type="button" data-period1-generate="research" ${period1GenerationState.research.loading ? "disabled" : ""}>
            ${period1GenerationState.research.loading ? "생성 중..." : "탐구 질문·기존 연구 자동 정리"}
          </button>
        </section>

        <section class="period-result-panel">
          <div class="period-result-head">
            <h4>생성 결과</h4>
            <p>수정 질문, 기존 연구 요약, 2차시 데이터 방향을 한 번에 정리합니다. 승인한 내용만 보고서에 반영됩니다.</p>
          </div>
          ${renderGenerationMessage("research")}
          ${renderResearchResult(design)}
        </section>
      </div>
    </article>
  `;
}
function periodInput(label, path, value, placeholder) {
  return `<label><span>${escapeHtml(label)}</span><input data-period1-path="${path}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" type="text" /></label>`;
}

function periodTextarea(label, path, value, placeholder, rows) {
  return `<label class="is-wide"><span>${escapeHtml(label)}</span><textarea data-period1-path="${path}" rows="${rows}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea></label>`;
}

function getPeriod1CompletionItems(period1) {
  return [
    ["최종 탐구 주제", period1.topicSetting.selectedTopic],
    ["주제 선택 이유", period1.topicSetting.topicReason],
    ["최종 탐구 질문", period1.researchDesign.finalResearchQuestion],
    ["기존 연구 요약", period1.researchDesign.priorResearchSummary],
    ["이론 또는 핵심 개념", period1.researchDesign.theory],
    ["이론 적용 방법", period1.researchDesign.theoryApplication],
  ].map(([label, value]) => ({ label, complete: Boolean(String(value || "").trim()) }));
}

function isPeriod1Complete(period1) {
  return getPeriod1CompletionItems(period1).every((item) => item.complete);
}

function renderPeriod1Completion(period1) {
  const items = getPeriod1CompletionItems(period1);
  const done = items.filter((item) => item.complete).length;
  return `
    <section class="period-completion ${done === items.length ? "is-complete" : ""}">
      <div>
        <strong>1차시 완료 상태</strong>
        <span>${done} / ${items.length} 완료</span>
      </div>
      <ul>${items.map((item) => `<li class="${item.complete ? "is-done" : ""}">${escapeHtml(item.label)}</li>`).join("")}</ul>
    </section>
  `;
}
function renderTopicCandidateCards(topic) {
  if (topic?.selectedTopic) {
    return `
      <div class="selected-result-card">
        <strong>선택한 주제</strong>
        <p>${escapeHtml(topic.selectedTopic)}</p>
        ${topic.topicReason ? `<small>${escapeHtml(topic.topicReason)}</small>` : ""}
        <div class="result-actions">
          <button class="secondary-button" type="button" data-clear-selected-topic>주제 다시 선택</button>
        </div>
      </div>
    `;
  }
  const candidates = topic?.generatedCandidates || [];
  if (!candidates?.length) {
    return `<div class="empty-result">아직 생성된 주제 후보가 없습니다. 학생 입력을 채운 뒤 <strong>주제 후보 자동 생성</strong>을 눌러 결과를 확인하세요.</div>`;
  }
  return `<div class="candidate-grid">${candidates
    .map(
      (item, index) => `
        <article class="candidate-card">
          <span class="candidate-number">후보 ${index + 1}</span>
          <h5>${escapeHtml(item.topic || item.title)}</h5>
          <dl>
            <div><dt>탐구 대상</dt><dd>${escapeHtml(item.target)}</dd></div>
            <div><dt>탐구 범위</dt><dd>${escapeHtml(item.scope)}</dd></div>
            <div><dt>필요한 자료</dt><dd>${escapeHtml(item.sources || item.requiredData)}</dd></div>
            <div><dt>4차시 수행 가능성</dt><dd>${escapeHtml(item.feasibility)}</dd></div>
            <div><dt>범위 축소 제안</dt><dd>${escapeHtml(item.narrowing || item.narrowingSuggestion)}</dd></div>
          </dl>
          <div class="result-actions">
            <button class="primary-button" type="button" data-select-topic="${index}">이 주제 선택</button>
            <button class="secondary-button" type="button" data-period1-focus="report.generated.period1.topicSetting.selectedTopic">직접 수정 후 적용</button>
            <button class="secondary-button" type="button" data-period1-generate="topic">다시 생성</button>
            <button class="secondary-button" type="button" data-period1-cancel="topic">취소</button>
          </div>
        </article>
      `
    )
    .join("")}</div>`;
}

function renderGenerationMessage(type) {
  const state = period1GenerationState[type];
  if (state.loading) {
    return `<div class="generation-message is-loading">AI가 입력 내용을 읽고 있습니다. 잠시만 기다려 주세요.</div>`;
  }
  if (state.error) {
    return `<div class="generation-message is-error">
      <strong>생성 실패</strong>
      <p>${escapeHtml(state.error)}</p>
      <button class="secondary-button" type="button" data-period1-generate="${type}">다시 시도</button>
    </div>`;
  }
  return "";
}

function renderResearchResult(design) {
  if (!design.recommendedQuestion && !design.questionCandidates?.length) {
    return `<div class="empty-result">아직 정리된 결과가 없습니다. 초안 질문과 검색 결과를 입력한 뒤 자동 정리 버튼을 눌러 결과를 확인하세요.</div>`;
  }
  return `
    <div class="research-result-grid">
      <section class="mini-panel">
        <h4>질문 점검 결과</h4>
        <ul>${(design.questionProblems || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("") || "<li>아직 점검 결과가 없습니다.</li>"}</ul>
      </section>
      <section class="mini-panel">
        <h4>수정 질문 후보 3개</h4>
        <div class="question-candidate-list">${(design.questionCandidates || [])
          .map(
            (item, index) => `
              <article>
                <p>${escapeHtml(item)}</p>
                <button class="primary-button" type="button" data-select-question="${index}">이 질문 선택</button>
              </article>
            `
          )
          .join("")}</div>
        <button class="secondary-button" type="button" data-period1-focus="report.generated.period1.researchDesign.draftQuestion">직접 수정 후 적용</button>
      </section>
      <section class="mini-panel">
        <h4>추천 최종 질문</h4>
        <p>${escapeHtml(design.recommendedQuestion)}</p>
        <button class="primary-button" type="button" data-use-research-result="question">이 내용 사용</button>
        <button class="secondary-button" type="button" data-period1-focus="report.generated.period1.researchDesign.draftQuestion">직접 수정 후 적용</button>
      </section>
      ${researchMiniPanel("연구 대상", design.researchTarget)}
      ${researchMiniPanel("연구 범위", design.researchScope)}
      ${researchMiniPanel("비교 요소", design.comparisonPoint)}
      ${researchMiniPanel("기존 연구 요약", design.literatureSummary || design.priorResearchSummary)}
      ${researchMiniPanel("적용 이론 또는 핵심 개념 1개", design.theoryConcept || design.theory)}
      ${researchMiniPanel("이론 적용 방법", design.theoryApplication)}
      ${researchMiniPanel("정리된 자료 출처", design.organizedSource || design.paperTitle)}
      ${researchMiniPanel("2차시 데이터 방향", design.nextDataDirection || design.dataDirection)}
      ${researchMiniPanel("초기 목차", design.initialOutline)}
      <div class="result-actions">
        <button class="primary-button" type="button" data-use-research-result="all">이 내용 사용</button>
        <button class="secondary-button" type="button" data-period1-focus="report.generated.period1.researchDesign.paperRawText">직접 수정 후 적용</button>
        <button class="secondary-button" type="button" data-period1-generate="research">다시 생성</button>
        <button class="secondary-button" type="button" data-period1-cancel="research">취소</button>
      </div>
    </div>
  `;
}

function researchMiniPanel(title, content) {
  return `<section class="mini-panel"><h4>${escapeHtml(title)}</h4><p>${escapeHtml(content)}</p></section>`;
}
async function generatePeriod1(type) {
  if (period1GenerationState[type]?.loading) return;

  const data = readFormData();
  const period1 = getPeriod1(data);
  const task = type === "topic" ? "generate_period1_topic" : "generate_period1_research";
  const studentData = type === "topic" ? collectTopicGenerationInput(period1) : collectResearchGenerationInput(period1, data);
  const validationMessage = validatePeriod1Generation(type, studentData);
  if (validationMessage) {
    period1GenerationState[type].error = validationMessage;
    renderSteps(data);
    showToast(validationMessage);
    return;
  }

  period1GenerationState[type].loading = true;
  period1GenerationState[type].error = "";
  renderSteps(data);

  try {
    const payload = await postReportAiHelp(task, studentData);
    savePeriod1Data((nextData) => {
      const nextPeriod1 = getPeriod1(nextData);
      if (type === "topic") {
        nextPeriod1.topicSetting.generatedCandidates = normalizeTopicCandidates(payload.candidates);
        nextPeriod1.topicSetting.candidates = nextPeriod1.topicSetting.generatedCandidates;
      } else {
        Object.assign(nextPeriod1.researchDesign, normalizeResearchDesign(payload));
      }
    });
    showToast(type === "topic" ? "주제 후보를 생성했습니다." : "탐구 질문과 기존 연구를 정리했습니다.");
  } catch (error) {
    period1GenerationState[type].error = error.message || "생성에 실패했습니다. 다시 시도해 주세요.";
    renderSteps(loadReportData());
    showToast(period1GenerationState[type].error);
  } finally {
    period1GenerationState[type].loading = false;
    renderSteps(loadReportData());
  }
}

function collectTopicGenerationInput(period1) {
  const topic = period1.topicSetting;
  return {
    interestArea: topic.interestArea,
    keywords: [topic.keyword1, topic.keyword2, topic.keyword3].filter(Boolean).join(", "),
    interestReason: topic.interestReason,
  };
}

function collectResearchGenerationInput(period1, data) {
  const topic = period1.topicSetting;
  const design = period1.researchDesign;
  const literaturePaste = [
    design.paperTitle ? `논문 제목: ${design.paperTitle}` : "",
    design.paperKeySentences ? `초록 또는 핵심 문장: ${design.paperKeySentences}` : "",
    design.paperRelevanceReason ? `내 주제와 관련 있는 이유: ${design.paperRelevanceReason}` : "",
  ].filter(Boolean).join("\n") || design.paperRawText || design.literaturePaste;
  return {
    selectedTopic: topic.selectedTopic || data.report.title,
    draftQuestion: design.draftQuestion || data.report.researchQuestion,
    paperTitle: design.paperTitle,
    paperKeySentences: design.paperKeySentences,
    paperRelevanceReason: design.paperRelevanceReason,
    literaturePaste,
    keywords: [topic.keyword1, topic.keyword2, topic.keyword3].filter(Boolean).join(", "),
  };
}

function validatePeriod1Generation(type, studentData) {
  if (type === "topic") {
    if (!studentData.interestArea && !studentData.keywords) return "관심 분야와 관심 키워드를 먼저 입력해 주세요.";
    if (!studentData.interestReason) return "관심을 가진 이유를 먼저 입력해 주세요.";
    return "";
  }
  if (!studentData.selectedTopic) return "1차시-1에서 최종 선택 주제를 먼저 정해 주세요.";
  if (!studentData.draftQuestion) return "초안 탐구 질문을 먼저 입력해 주세요.";
  if (!studentData.paperTitle) return "Semantic Scholar에서 찾은 논문 제목을 텍스트로 입력해 주세요.";
  if (!studentData.paperKeySentences) return "논문 초록의 핵심 문장 1~2개를 텍스트로 입력해 주세요.";
  if (!studentData.paperRelevanceReason) return "내 주제와 관련 있는 이유를 1문장으로 입력해 주세요.";
  return "";
}

async function postReportAiHelp(task, studentData) {
  const requestId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  window.LoreAXUsage?.trackAiGenerate?.(LESSON_ID, task, { requestId });
  try {
    const response = await fetch("/api/report-ai-help", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, studentData }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "AI 생성 요청에 실패했습니다.");
    window.LoreAXUsage?.trackAiGenerateResult?.(LESSON_ID, true, { taskName: task, requestId });
    return payload;
  } catch (error) {
    window.LoreAXUsage?.trackAiGenerateResult?.(LESSON_ID, false, { taskName: task, requestId, reason: String(error?.message || "").slice(0, 120) });
    throw error;
  }
}

function normalizeTopicCandidates(candidates) {
  return (Array.isArray(candidates) ? candidates : []).slice(0, 5).map((item) => ({
    topic: item.title || "",
    target: item.target || "",
    scope: item.scope || "",
    sources: item.requiredData || "",
    feasibility: item.feasibility || "",
    narrowing: item.narrowingSuggestion || "",
  })).filter((item) => item.topic);
}

function normalizeResearchDesign(payload) {
  return {
    questionProblems: Array.isArray(payload.questionProblems) ? payload.questionProblems : [],
    questionCandidates: Array.isArray(payload.questionCandidates) ? payload.questionCandidates : [],
    recommendedQuestion: payload.recommendedQuestion || "",
    researchTarget: payload.researchTarget || "",
    researchScope: payload.researchScope || "",
    comparisonFactors: Array.isArray(payload.comparisonFactors) ? payload.comparisonFactors : [],
    comparisonPoint: Array.isArray(payload.comparisonFactors) ? payload.comparisonFactors.join("\n") : "",
    priorResearchSummary: payload.priorResearchSummary || "",
    literatureSummary: payload.priorResearchSummary || "",
    theory: payload.theory || "",
    theoryConcept: payload.theory || "",
    theoryApplication: payload.theoryApplication || "",
    organizedSource: payload.organizedSource || payload.source || payload.dataSource || "",
    dataDirection: payload.dataDirection || "",
    nextDataDirection: payload.dataDirection || "",
    initialOutlineItems: Array.isArray(payload.initialOutline) ? payload.initialOutline : [],
    initialOutline: Array.isArray(payload.initialOutline) ? payload.initialOutline.join("\n") : "",
  };
}

function copySearchTerms() {
  const data = loadReportData();
  const period1 = getPeriod1(data);
  const topic = period1.topicSetting.selectedTopic || data.report.title || period1.topicSetting.interestArea || "탐구 주제";
  const question = period1.researchDesign.draftQuestion || data.report.researchQuestion || "탐구 질문";
  const keywords = [period1.topicSetting.keyword1, period1.topicSetting.keyword2, period1.topicSetting.keyword3].filter(Boolean);
  const searchText = [
    `한국어 검색어: ${topic}, ${keywords.join(", ")}, 청소년, 통계, 연구`,
    `영어 검색어: ${keywords.join(" ") || topic} adolescent study data`,
    `검색 질문: ${question}`,
  ].join("\n");
  copyText(searchText);
}

function updateTimerDisplay() {
  const timer = document.querySelector("#period1Timer");
  if (!timer) return;
  const minutes = String(Math.floor(period1RemainingSeconds / 60)).padStart(2, "0");
  const seconds = String(period1RemainingSeconds % 60).padStart(2, "0");
  timer.textContent = `${minutes}:${seconds}`;
}

function startPeriod1Timer(seconds) {
  period1RemainingSeconds = seconds;
  updateTimerDisplay();
  window.clearInterval(period1Timer);
  period1Timer = window.setInterval(() => {
    period1RemainingSeconds -= 1;
    updateTimerDisplay();
    if (period1RemainingSeconds <= 0) {
      window.clearInterval(period1Timer);
      showToast("5분 자료 검색 시간이 끝났습니다.");
    }
  }, 1000);
}

function renderPeriod2Card(step, index, reportData) {
  const period2 = getPeriod2(reportData);
  const inherited = period2.inheritedFromPeriod1;
  const directions = getPeriod2Directions(reportData);
  const packs = getRecommendedDataPacks(reportData);
  ensurePeriod2Selections(period2, directions, packs);
  const basicChart = buildBasicChart(period2);
  const specialChart = buildSpecialChart(period2, basicChart);
  const active = isActiveStep(index);
  const cooldown = getPeriod2CooldownSeconds();
  if (!active) {
    const items = getPeriod2CompletionItems(period2);
    const done = items.filter((item) => item.complete).length;
    return renderCollapsedPeriodCard(step, index, `완료 ${done}/${items.length}`, "1차시 승인 결과를 이어받아 실제 데이터와 그래프를 만듭니다.");
  }

  return `
    <article class="step-card period-work-card ${active ? "is-active" : "is-hidden-step"}" data-step-index="${index}">
      <div class="period-work-head" data-step-toggle="${index}">
        <span class="step-tag">${step.label}</span>
        <div>
          <h3>2차시: 자료 분석과 시각화</h3>
          <p>1차시에서 승인한 주제와 탐구 질문을 이어받아 실제 데이터팩, 표, 그래프, 분석 초안을 만듭니다.</p>
        </div>
      </div>
      <div class="period-work-body">
        ${renderPeriod2Completion(period2)}
        <section class="period-work-section selected-topic-callout">
          <h4>1차시 승인 결과 자동 불러오기</h4>
          ${definitionHtml([
            ["최종 주제", inherited.selectedTopic],
            ["최종 탐구 질문", inherited.finalResearchQuestion],
            ["연구 대상", inherited.researchTarget],
            ["연구 범위", inherited.researchScope],
            ["비교 요소", inherited.comparisonFactors],
            ["이론/핵심 개념", inherited.theory],
            ["이론 적용 방법", inherited.theoryApplication],
            ["데이터 방향", inherited.dataDirection],
          ])}
        </section>

        <section class="period-work-section">
          <h4>1. 분석 방향 선택</h4>
          <div class="choice-grid">
            ${directions.map((direction, directionIndex) => `
              <button class="choice-card ${period2.selectedDirection?.id === direction.id ? "is-selected" : ""}" type="button" data-period2-direction="${directionIndex}">
                <strong>${escapeHtml(direction.label)}</strong>
                <span>${escapeHtml(direction.reason)}</span>
              </button>
            `).join("")}
          </div>
        </section>

        <section class="period-work-section">
          <h4>2. 실제 데이터팩 선택</h4>
          <div class="data-pack-grid">
            ${packs.map((item, packIndex) => renderDataPackCard(item, packIndex, period2.selectedDataPack?.id)).join("")}
          </div>
          ${period2.selectedDataPack?.matchScore < 1 ? `<p class="generation-message is-error">선택한 데이터와 주제 관련성이 낮습니다. 가상 수치는 만들지 않고 이 데이터 범위 안에서만 분석합니다.</p>` : ""}
        </section>

        <section class="period-work-section">
          <h4>3. 실제 데이터 표</h4>
          ${renderSelectedDataTable(period2.selectedDataPack)}
        </section>

        <section class="period-work-section">
          <h4>4. 그래프 확인 또는 변경</h4>
          <div class="chart-choice-row">
            ${["auto", "bar", "line", "pie"].map((type) => renderChartChoice(type, period2.visualizations.basicChart?.type || "auto", period2.selectedDataPack)).join("")}
          </div>
          <div class="visual-grid">
            ${renderChartPanel("기본 그래프", basicChart, period2.selectedDataPack)}
            ${renderChartPanel(specialChart.isFallback ? "대체 그래프" : "특별 시각화", specialChart, period2.selectedDataPack)}
          </div>
        </section>

        <section class="period-work-section">
          <h4>5. 학생 관찰 1문장</h4>
          ${periodTextarea("그래프를 보고 새롭게 알게 된 점", "report.generated.period2.studentObservation", period2.studentObservation, "예: 인터넷 이용률은 이미 매우 높지만 2021년 이후에도 조금씩 증가하는 흐름이 보인다.", 3).replaceAll("data-period1-path", "data-period2-path")}
        </section>

        <section class="period-tool-row" aria-label="2차시 생성">
          <a class="tool-link" href="${TOOL_URLS.Datawrapper}" target="_blank" rel="noopener noreferrer">Datawrapper 열기</a>
          <button class="primary-button" type="button" data-period2-generate ${period2GenerationState.loading || cooldown > 0 ? "disabled" : ""}>
            ${period2GenerationState.loading ? "분석 생성 중..." : cooldown > 0 ? `다시 생성 ${cooldown}초 후 가능` : "2차시 분석 결과 생성"}
          </button>
        </section>

        <section class="period-result-panel">
          <div class="period-result-head">
            <h4>생성 결과 승인</h4>
            <p>AI 분석은 자동 반영되지 않습니다. 학생이 확인하고 승인한 내용만 보고서와 PDF에 들어갑니다.</p>
          </div>
          ${renderPeriod2Message()}
          ${renderPeriod2GeneratedResult(period2.generatedAnalysis)}
        </section>
      </div>
    </article>
  `;
}

function ensurePeriod2Selections(period2, directions, packs) {
  if (!period2.selectedDirection?.id && directions[0]) period2.selectedDirection = directions[0];
  if (!period2.selectedDataPack?.id && packs[0]) period2.selectedDataPack = packs[0];
  if (!period2.visualizations.basicChart?.type) period2.visualizations.basicChart = buildBasicChart(period2);
  if (!period2.visualizations.specialChart?.type) period2.visualizations.specialChart = buildSpecialChart(period2, period2.visualizations.basicChart);
}

function getPeriod2Directions(data) {
  const period1 = getPeriod1(data);
  const joined = [
    period1.topicSetting.selectedTopic,
    period1.researchDesign.finalResearchQuestion,
    period1.researchDesign.dataDirection,
    period1.researchDesign.comparisonPoint,
  ].join(" ");
  const candidates = [
    { id: "time-change", label: "연도별 변화", reason: "시간 흐름에 따라 값이 증가하거나 감소하는지 확인합니다.", keywords: ["변화", "연도", "시간", "추이", "증가", "감소"] },
    { id: "group-compare", label: "집단 또는 항목별 비교", reason: "대상이나 항목 사이의 차이를 비교합니다.", keywords: ["비교", "집단", "항목", "차이", "지역"] },
    { id: "composition", label: "구성 비율", reason: "전체 안에서 각 항목이 차지하는 비중을 봅니다.", keywords: ["비율", "구성", "비중", "점유"] },
    { id: "relation", label: "두 요소의 관계", reason: "두 요소가 함께 움직이는지 조심스럽게 살펴봅니다.", keywords: ["관계", "영향", "연관", "상관"] },
    { id: "keyword-frequency", label: "핵심 키워드 빈도", reason: "자료 안에서 자주 등장하는 키워드를 정리합니다.", keywords: ["키워드", "빈도", "텍스트", "의견"] },
  ];
  return candidates
    .map((item) => ({ ...item, score: item.keywords.filter((keyword) => joined.includes(keyword)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function getRecommendedDataPacks(data) {
  const period1 = getPeriod1(data);
  const keywords = [
    period1.topicSetting.selectedTopic,
    period1.researchDesign.finalResearchQuestion,
    period1.researchDesign.dataDirection,
    ...normalizeList(period1.researchDesign.comparisonFactors),
    period1.topicSetting.keyword1,
    period1.topicSetting.keyword2,
    period1.topicSetting.keyword3,
  ].join(" ").toLowerCase();
  return DATA_PACKS.map((pack) => {
    const matchScore = pack.relatedKeywords.reduce((score, keyword) => score + (keywords.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    return { ...pack, matchScore };
  })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}

function renderDataPackCard(pack, index, selectedId) {
  return `
    <button class="data-pack-card ${selectedId === pack.id ? "is-selected" : ""}" type="button" data-period2-pack="${index}">
      <span>${escapeHtml(pack.category)} · 관련도 ${pack.matchScore}</span>
      <strong>${escapeHtml(pack.title)}</strong>
      <small>${escapeHtml(pack.description)}</small>
      <em>${escapeHtml(pack.sourceName)}</em>
    </button>
  `;
}

function renderSelectedDataTable(pack) {
  if (!pack?.tableData?.rows?.length) return `<div class="empty-result">선택한 데이터팩이 없습니다.</div>`;
  return `
    <div class="data-table-wrap">
      <h5>${escapeHtml(pack.title)}</h5>
      <p>${escapeHtml(pack.period)} · 단위: ${escapeHtml(pack.unit)} · 출처: <a href="${escapeHtml(pack.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(pack.sourceName)}</a></p>
      <table class="data-table">
        <thead><tr>${pack.tableData.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead>
        <tbody>${pack.tableData.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function renderChartChoice(type, selectedType, pack) {
  const label = { auto: "추천 그래프 사용", bar: "막대", line: "꺾은선", pie: "원" }[type];
  const disabled = type === "pie" && !canUsePieChart(pack);
  const disabledTitle = "합계가 100%인 구성비 자료가 아니면 원그래프를 권장하지 않습니다.";
  return `<button class="secondary-button ${selectedType === type ? "is-selected" : ""}" type="button" data-period2-chart-type="${type}" ${disabled ? `disabled title="${disabledTitle}"` : ""}>${label}</button>`;
}

function canUsePieChart(pack) {
  const values = getPackValues(pack);
  const total = values.reduce((sum, item) => sum + item.value, 0);
  return values.length >= 3 && Math.abs(total - 100) <= 1;
}

function buildBasicChart(period2) {
  const pack = period2.selectedDataPack || {};
  const chosen = period2.visualizations?.basicChart?.type || "auto";
  const type = chosen === "auto" ? recommendBasicChartType(pack, period2.selectedDirection) : chosen;
  return {
    type,
    title: `${pack.title || "데이터"} ${type === "line" ? "추이" : type === "pie" ? "구성비" : "비교"}`,
    xAxis: pack.tableData?.columns?.[0] || "항목",
    yAxis: `${pack.tableData?.columns?.[1] || "값"} (${pack.unit || ""})`,
    unit: pack.unit || "",
    sourceName: pack.sourceName || "",
    sourceUrl: pack.sourceUrl || "",
    reason: type === "line" ? "연도별 변화가 있는 자료라 꺾은선그래프가 적합합니다." : type === "pie" ? "전체 구성비를 볼 수 있어 원그래프를 사용할 수 있습니다." : "항목 간 값을 비교하기 쉬워 막대그래프가 적합합니다.",
  };
}
function buildSpecialChart(period2, basicChart) {
  const pack = period2.selectedDataPack || {};
  const direction = period2.selectedDirection?.id || "";
  if (direction === "keyword-frequency") {
    return {
      type: "wordcloud",
      title: `${pack.title || "자료"} 핵심어 워드클라우드`,
      unit: "빈도",
      sourceName: pack.sourceName || "",
      sourceUrl: pack.sourceUrl || "",
      reason: "키워드 중심 분석 방향이므로 핵심어 빈도를 시각화합니다.",
    };
  }
  if (pack.tableData?.rows?.length >= 5) {
    return {
      type: "heatmap",
      title: `${pack.title || "자료"} 값의 강도 히트맵`,
      xAxis: pack.tableData?.columns?.[0] || "항목",
      yAxis: pack.tableData?.columns?.[1] || "값",
      unit: pack.unit || "",
      sourceName: pack.sourceName || "",
      sourceUrl: pack.sourceUrl || "",
      reason: "값의 높고 낮음을 색으로 빠르게 비교할 수 있습니다.",
    };
  }
  return {
    ...basicChart,
    isFallback: true,
    title: `${basicChart.title} 보조 그래프`,
    reason: "특별 시각화에 적합한 구조가 아니므로 기본 그래프를 하나 더 사용합니다.",
  };
}
function recommendBasicChartType(pack, direction) {
  if (direction?.id === "composition" && canUsePieChart(pack)) return "pie";
  if (direction?.id === "time-change") return "line";
  if ((pack.tableData?.rows || []).every((row) => /^\d{4}$/.test(String(row[0])))) return "line";
  return "bar";
}

function renderChartPanel(title, chart, pack) {
  return `
    <section class="mini-panel chart-panel">
      <h4>${escapeHtml(title)}</h4>
      <strong>${escapeHtml(chart.title)}</strong>
      <p>유형: ${escapeHtml(chart.type)} · 단위: ${escapeHtml(chart.unit || pack?.unit || "")}</p>
      ${renderSvgChart(chart.type, pack)}
      <p>${escapeHtml(chart.reason)}</p>
      <small>출처: ${escapeHtml(chart.sourceName || pack?.sourceName || "")}</small>
    </section>
  `;
}

function getPackValues(pack) {
  return (pack?.tableData?.rows || []).map((row) => ({ label: String(row[0]), value: Number(row[1]) })).filter((item) => Number.isFinite(item.value));
}

function renderSvgChart(type, pack) {
  const values = getPackValues(pack);
  if (!values.length) return "";
  if (type === "pie") return renderPieSvg(values);
  if (type === "heatmap") return renderHeatmapSvg(values);
  if (type === "wordcloud") return renderWordCloudSvg(pack);
  if (type === "line") return renderLineSvg(values);
  return renderBarSvg(values);
}

function formatChartValue(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value).toFixed(2)).replace(/\.00$/, "").replace(/0$/, "");
}

function getChartScale(values) {
  const max = Math.max(...values.map((item) => item.value));
  const min = Math.min(...values.map((item) => item.value));
  const padding = (max - min) * 0.12 || Math.max(1, max * 0.08);
  return { max: max + padding, min: Math.max(0, min - padding), rawMax: max, rawMin: min };
}

function renderSvgGrid(width = 620, height = 320) {
  return `
    <rect class="chart-bg" x="0" y="0" width="${width}" height="${height}" rx="18"></rect>
    <line class="chart-axis" x1="78" y1="252" x2="570" y2="252"></line>
    <line class="chart-axis" x1="78" y1="54" x2="78" y2="252"></line>
    ${[0, 1, 2, 3].map((i) => `<line class="chart-grid-line" x1="78" y1="${54 + i * 66}" x2="570" y2="${54 + i * 66}"></line>`).join("")}
  `;
}

function renderBarSvg(values) {
  const scale = getChartScale(values);
  const plotHeight = 198;
  const startX = 105;
  const step = 430 / Math.max(1, values.length);
  const barWidth = Math.min(48, step * 0.54);
  return `<svg class="chart-svg chart-svg-polished" viewBox="0 0 620 320" role="img" aria-label="bar chart">
    <defs><linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2dd4bf"></stop><stop offset="100%" stop-color="#0f766e"></stop></linearGradient></defs>
    ${renderSvgGrid(620, 320)}
    ${values.map((item, index) => {
      const ratio = (item.value - scale.min) / Math.max(1, scale.max - scale.min);
      const height = Math.max(8, ratio * plotHeight);
      const x = startX + index * step + (step - barWidth) / 2;
      const y = 252 - height;
      return `<g><rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${height}" rx="10"></rect><text class="chart-value" x="${x + barWidth / 2}" y="${y - 10}">${formatChartValue(item.value)}</text><text class="chart-label" x="${x + barWidth / 2}" y="282">${escapeHtml(item.label)}</text></g>`;
    }).join("")}
  </svg>`;
}

function renderLineSvg(values) {
  const scale = getChartScale(values);
  const points = values.map((item, index) => {
    const x = 88 + index * (470 / Math.max(1, values.length - 1));
    const y = 252 - ((item.value - scale.min) / Math.max(1, scale.max - scale.min)) * 198;
    return { ...item, x, y };
  });
  const area = `88,252 ${points.map((p) => `${p.x},${p.y}`).join(" ")} 558,252`;
  return `<svg class="chart-svg chart-svg-polished" viewBox="0 0 620 320" role="img" aria-label="line chart">
    <defs><linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(45,212,191,.3)"></stop><stop offset="100%" stop-color="rgba(45,212,191,0)"></stop></linearGradient></defs>
    ${renderSvgGrid(620, 320)}
    <polygon class="chart-line-area" points="${area}"></polygon>
    <polyline class="chart-line" points="${points.map((p) => `${p.x},${p.y}`).join(" ")}"></polyline>
    ${points.map((p) => `<g><circle class="chart-point" cx="${p.x}" cy="${p.y}" r="6"></circle><text class="chart-value" x="${p.x}" y="${p.y - 14}">${formatChartValue(p.value)}</text><text class="chart-label" x="${p.x}" y="282">${escapeHtml(p.label)}</text></g>`).join("")}
  </svg>`;
}

function renderPieSvg(values) {
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

function renderHeatmapSvg(values) {
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
      return `<g><rect class="heat-cell" x="${x}" y="${y}" width="138" height="64" rx="16" style="fill:hsl(174, 72%, ${lightness}%);"></rect><text class="heat-label" x="${x + 69}" y="${y + 27}" style="fill:${textColor}">${escapeHtml(item.label)}</text><text class="heat-value" x="${x + 69}" y="${y + 49}" style="fill:${textColor}">${formatChartValue(item.value)}</text></g>`;
    }).join("")}
    <rect x="178" y="294" width="264" height="14" rx="7" fill="url(#heatLegend)"></rect><text class="chart-label" x="150" y="306">낮음</text><text class="chart-label" x="470" y="306">높음</text>
  </svg>`;
}

function renderWordCloudSvg(pack) {
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

function definitionHtml(rows) {
  return `<dl class="definition-grid">${rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${Array.isArray(value) ? escapeHtml(value.join(", ")) : escapeHtml(value || "아직 없음")}</dd></div>`).join("")}</dl>`;
}

function renderPeriod2Completion(period2) {
  const items = getPeriod2CompletionItems(period2);
  const done = items.filter((item) => item.complete).length;
  return `
    <section class="period-completion ${done === items.length ? "is-complete" : ""}">
      <div>
        <strong>2차시 완료 상태</strong>
        <span>${done} / ${items.length} 완료</span>
      </div>
      <ul>${items.map((item) => `<li class="${item.complete ? "is-done" : ""}">${escapeHtml(item.label)}</li>`).join("")}</ul>
    </section>
  `;
}

function getPeriod2CompletionItems(period2) {
  return [
    ["분석 방향 선택", period2.selectedDirection?.id],
    ["데이터팩 선택", period2.selectedDataPack?.id],
    ["표 존재", period2.selectedDataPack?.tableData?.rows?.length],
    ["기본 그래프 존재", period2.visualizations?.basicChart?.type],
    ["특별 시각화 또는 대체 그래프 존재", period2.visualizations?.specialChart?.type],
    ["학생 관찰 1문장", period2.studentObservation],
    ["분석 결과 승인", period2.generatedAnalysis?.approvedAt],
  ].map(([label, value]) => ({ label, complete: Boolean(Array.isArray(value) ? value.length : String(value || "").trim()) }));
}

function getPeriod2CooldownSeconds() {
  const elapsed = Date.now() - (period2GenerationState.lastGeneratedAt || 0);
  return Math.max(0, Math.ceil((60000 - elapsed) / 1000));
}

function renderPeriod2Message() {
  if (period2GenerationState.loading) return `<div class="generation-message is-loading">AI가 선택한 데이터팩과 그래프를 분석하고 있습니다.</div>`;
  if (period2GenerationState.error) {
    return `<div class="generation-message is-error"><strong>생성 실패</strong><p>${escapeHtml(period2GenerationState.error)}</p><button class="secondary-button" type="button" data-period2-generate>다시 시도</button></div>`;
  }
  return "";
}

function renderPeriod2GeneratedResult(generated) {
  if (!generated?.tableDescription && !generated?.resultDraft) return `<div class="empty-result">아직 승인할 분석 결과가 없습니다. 학생 관찰을 입력한 뒤 생성 버튼을 눌러 주세요.</div>`;
  return `
    <div class="research-result-grid">
      ${researchMiniPanel("표 설명", generated.tableDescription)}
      ${researchMiniPanel("기본 그래프 해석", generated.basicChartDescription)}
      ${researchMiniPanel("특별 시각화 해석", generated.specialChartDescription)}
      ${researchMiniPanel("두 시각화 비교", generated.comparison)}
      <section class="mini-panel"><h4>핵심 결과</h4>${listHtmlLocal(generated.keyFindings)}</section>
      ${researchMiniPanel("이론과의 연결", generated.theoryConnection)}
      ${researchMiniPanel("탐구 질문과의 연결", generated.researchQuestionConnection)}
      <section class="mini-panel"><h4>분석 한계</h4>${listHtmlLocal(generated.limitations)}</section>
      ${researchMiniPanel("탐구 결과 초안", generated.resultDraft)}
      <section class="mini-panel"><h4>수정 목차</h4>${listHtmlLocal(generated.updatedOutline)}</section>
      <div class="result-actions">
        <button class="primary-button" type="button" data-period2-approve>이 내용 사용</button>
        <button class="secondary-button" type="button" data-period2-focus="report.generated.period2.studentObservation">직접 수정 후 적용</button>
        <button class="secondary-button" type="button" data-period2-generate>다시 생성</button>
        <button class="secondary-button" type="button" data-period2-cancel>취소</button>
      </div>
    </div>
  `;
}

function listHtmlLocal(items) {
  const list = normalizeList(items);
  return list.length ? `<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>아직 없음</p>";
}

async function generatePeriod2() {
  if (period2GenerationState.loading) return;
  const cooldown = getPeriod2CooldownSeconds();
  if (cooldown > 0) {
    showToast(`AI 재생성은 ${cooldown}초 후 가능합니다.`);
    return;
  }
  const data = readFormData();
  const period2 = getPeriod2(data);
  ensurePeriod2Selections(period2, getPeriod2Directions(data), getRecommendedDataPacks(data));
  period2.visualizations.basicChart = buildBasicChart(period2);
  period2.visualizations.specialChart = buildSpecialChart(period2, period2.visualizations.basicChart);
  const validation = validatePeriod2Generation(period2);
  if (validation) {
    period2GenerationState.error = validation;
    renderSteps(data);
    showToast(validation);
    return;
  }

  period2GenerationState.loading = true;
  period2GenerationState.error = "";
  period2GenerationState.lastGeneratedAt = Date.now();
  renderSteps(data);

  try {
    const payload = await postReportAiHelp("generate_period2", {
      inheritedJson: JSON.stringify(period2.inheritedFromPeriod1),
      selectedDirectionJson: JSON.stringify(period2.selectedDirection),
      dataPackJson: JSON.stringify(period2.selectedDataPack),
      basicChartJson: JSON.stringify(period2.visualizations.basicChart),
      specialChartJson: JSON.stringify(period2.visualizations.specialChart),
      studentObservation: period2.studentObservation,
    });
    savePeriod2Data((nextData) => {
      const nextPeriod2 = getPeriod2(nextData);
      nextPeriod2.selectedDirection = period2.selectedDirection;
      nextPeriod2.selectedDataPack = period2.selectedDataPack;
      nextPeriod2.visualizations = period2.visualizations;
      nextPeriod2.studentObservation = period2.studentObservation;
      nextPeriod2.generatedAnalysis = {
        ...nextPeriod2.generatedAnalysis,
        ...normalizePeriod2Analysis(payload),
        approvedAt: "",
      };
    });
    showToast("2차시 분석 결과를 생성했습니다. 확인 후 승인해 주세요.");
  } catch (error) {
    period2GenerationState.error = /429/.test(String(error.message))
      ? "현재 AI 요청이 많습니다. 잠시 후 다시 시도해 주세요."
      : error.message || "2차시 분석 생성에 실패했습니다.";
    renderSteps(loadReportData());
    showToast(period2GenerationState.error);
  } finally {
    period2GenerationState.loading = false;
    renderSteps(loadReportData());
  }
}

function validatePeriod2Generation(period2) {
  if (!period2.inheritedFromPeriod1.selectedTopic || !period2.inheritedFromPeriod1.finalResearchQuestion) return "1차시 승인 결과가 필요합니다.";
  if (!period2.selectedDirection?.id) return "분석 방향을 선택해 주세요.";
  if (!period2.selectedDataPack?.id) return "데이터팩을 선택해 주세요.";
  if (!period2.studentObservation) return "그래프를 보고 새롭게 알게 된 점 1문장을 입력해 주세요.";
  return "";
}
function normalizePeriod2Analysis(payload) {
  return {
    analysisDirections: normalizeList(payload.analysisDirections),
    selectedDirectionSummary: payload.selectedDirectionSummary || "",
    tableDescription: payload.tableDescription || "",
    basicChartDescription: payload.basicChartDescription || "",
    specialChartDescription: payload.specialChartDescription || "",
    comparison: payload.comparison || "",
    keyFindings: normalizeList(payload.keyFindings),
    theoryConnection: payload.theoryConnection || "",
    researchQuestionConnection: payload.researchQuestionConnection || "",
    limitations: normalizeList(payload.limitations),
    resultDraft: payload.resultDraft || "",
    updatedOutline: normalizeList(payload.updatedOutline),
    approvedAt: "",
  };
}


function renderPeriod3Card(step, index, reportData) {
  const period3 = getPeriod3(reportData);
  const p1 = period3.inheritedFromPeriod1;
  const p2 = period3.inheritedFromPeriod2;
  const inputs = period3.studentInputs;
  const active = isActiveStep(index);
  const cooldown = getPeriod3CooldownSeconds();
  if (!active) {
    const items = getPeriod3CompletionItems(period3);
    const done = items.filter((item) => item.complete).length;
    return renderCollapsedPeriodCard(step, index, `완료 ${done}/${items.length}`, "1·2차시 승인 결과를 바탕으로 서론, 연구방법, 본문 초안을 만듭니다.");
  }

  return `
    <article class="step-card period-work-card is-active" data-step-index="${index}">
      <div class="period-work-head" data-step-toggle="${index}">
        <span class="step-tag">${step.label}</span>
        <div>
          <h3>3차시: 서론·연구방법·본문 초안 작성</h3>
          <p>1·2차시에서 승인한 최종값만 이어받아 학생 생각을 보고서 문장으로 정리합니다.</p>
        </div>
      </div>
      <div class="period-work-body">
        ${renderPeriod3Completion(period3)}
        <section class="period-work-section selected-topic-callout">
          <h4>1·2차시 승인 결과 자동 불러오기</h4>
          ${definitionHtml([
            ["최종 주제", p1.selectedTopic],
            ["주제 선택 이유", p1.topicReason],
            ["최종 탐구 질문", p1.finalResearchQuestion],
            ["연구 대상", p1.researchTarget],
            ["연구 범위", p1.researchScope],
            ["비교 요소", p1.comparisonFactors],
            ["기존 연구 요약", p1.priorResearchSummary],
            ["이론/핵심 개념", p1.theory],
            ["이론 적용 방법", p1.theoryApplication],
            ["분석 방향", p2.selectedDirection?.label],
            ["데이터팩", p2.selectedDataPack?.title],
            ["표 설명", p2.tableDescription],
            ["기본 그래프 해석", p2.basicChartDescription],
            ["특별 시각화 해석", p2.specialChartDescription],
            ["핵심 결과", p2.keyFindings],
            ["이론 연결", p2.theoryConnection],
            ["탐구 질문 연결", p2.researchQuestionConnection],
            ["분석 한계", p2.limitations],
            ["결과 초안", p2.resultDraft],
          ])}
        </section>

        <section class="period-work-section">
          <h4>학생 핵심 생각 4개</h4>
          <p class="period-help-text">긴 글을 쓰지 않아도 됩니다. 자신의 생각을 1~2문장으로 입력하면 AI가 보고서 문장으로 정리합니다.</p>
          <div class="period-form-grid">
            ${periodTextarea("이 주제를 탐구하게 된 배경", "report.generated.period3.studentInputs.backgroundThought", inputs.backgroundThought, "예: 스마트폰 사용 시간이 늘면서 수면이 부족해지는 친구들을 자주 보았기 때문이다.", 3).replaceAll("data-period1-path", "data-period3-path")}
            ${periodTextarea("무엇을 알아보려고 했는지", "report.generated.period3.studentInputs.researchPurposeThought", inputs.researchPurposeThought, "예: 스마트폰 사용 시간과 수면 시간이 어떤 관계가 있는지 알고 싶었다.", 3).replaceAll("data-period1-path", "data-period3-path")}
            ${periodTextarea("어떤 자료와 그래프를 활용했는지", "report.generated.period3.studentInputs.dataUsageThought", inputs.dataUsageThought, "예: 앱에서 제공한 통계 데이터와 꺾은선그래프, 히트맵을 활용했다.", 3).replaceAll("data-period1-path", "data-period3-path")}
            ${periodTextarea("분석 결과에서 가장 중요하다고 생각한 점", "report.generated.period3.studentInputs.keyFindingThought", inputs.keyFindingThought, "예: 수치가 높고 낮은 차이보다 변화 흐름을 조심스럽게 해석해야 한다고 생각했다.", 3).replaceAll("data-period1-path", "data-period3-path")}
          </div>
        </section>

        <section class="period-tool-row" aria-label="3차시 생성">
          <a class="tool-link" href="${TOOL_URLS.Claude}" target="_blank" rel="noopener noreferrer">Claude 열기</a>
          <button class="copy-button" type="button" data-copy-prompt="period3">프롬프트 복사</button>
          <button class="primary-button" type="button" data-period3-generate ${period3GenerationState.loading || cooldown > 0 ? "disabled" : ""}>
            ${period3GenerationState.loading ? "초안 생성 중..." : cooldown > 0 ? `다시 생성 ${cooldown}초 후 가능` : "서론·연구방법·본문 초안 생성"}
          </button>
        </section>

        <section class="period-result-panel">
          <div class="period-result-head">
            <h4>생성 결과 승인</h4>
            <p>초안은 자동 반영되지 않습니다. 학생이 확인하고 승인한 내용만 보고서와 PDF에 들어갑니다.</p>
          </div>
          ${renderPeriod3Message()}
          ${renderPeriod3GeneratedResult(period3.generatedDraft)}
        </section>
      </div>
    </article>
  `;
}

function getPeriod3CompletionItems(period3) {
  const inputs = period3.studentInputs || {};
  const draft = period3.generatedDraft || {};
  return [
    ["학생 입력 4개", inputs.backgroundThought && inputs.researchPurposeThought && inputs.dataUsageThought && inputs.keyFindingThought],
    ["탐구 배경 승인", draft.approvedAt && draft.background],
    ["탐구 목적·필요성 승인", draft.approvedAt && draft.purpose && draft.necessity],
    ["기존 연구·이론 승인", draft.approvedAt && (draft.priorResearchSection || draft.theoreticalBackground)],
    ["연구방법 승인", draft.approvedAt && (draft.dataCollectionMethod || draft.analysisMethod || draft.visualizationMethod)],
    ["결과 본문 초안 승인", draft.approvedAt && draft.resultSectionDraft],
  ].map(([label, value]) => ({ label, complete: Boolean(String(value || "").trim()) }));
}

function renderPeriod3Completion(period3) {
  const items = getPeriod3CompletionItems(period3);
  const done = items.filter((item) => item.complete).length;
  return `
    <section class="period-completion ${done === items.length ? "is-complete" : ""}">
      <div>
        <strong>3차시 완료 상태</strong>
        <span>${done} / ${items.length} 완료</span>
      </div>
      <ul>${items.map((item) => `<li class="${item.complete ? "is-done" : ""}">${escapeHtml(item.label)}</li>`).join("")}</ul>
    </section>
  `;
}

function getPeriod3CooldownSeconds() {
  const elapsed = Date.now() - (period3GenerationState.lastGeneratedAt || 0);
  return Math.max(0, Math.ceil((60000 - elapsed) / 1000));
}

function renderPeriod3Message() {
  if (period3GenerationState.loading) return `<div class="generation-message is-loading">AI가 1·2차시 승인 결과와 학생 생각을 연결해 초안을 만들고 있습니다.</div>`;
  if (period3GenerationState.error) {
    return `<div class="generation-message is-error"><strong>생성 실패</strong><p>${escapeHtml(period3GenerationState.error)}</p><button class="secondary-button" type="button" data-period3-generate>다시 시도</button></div>`;
  }
  return "";
}

function renderPeriod3GeneratedResult(draft) {
  if (!draft?.background && !draft?.resultSectionDraft) return `<div class="empty-result">아직 생성된 3차시 초안이 없습니다. 학생 생각 4개를 입력한 뒤 생성 버튼을 눌러 주세요.</div>`;
  return `
    <div class="research-result-grid">
      ${researchMiniPanel("탐구 배경", draft.background)}
      ${researchMiniPanel("탐구 목적", draft.purpose)}
      ${researchMiniPanel("탐구 필요성", draft.necessity)}
      ${researchMiniPanel("탐구 질문", draft.researchQuestion)}
      ${researchMiniPanel("탐구 범위", draft.researchScope)}
      ${researchMiniPanel("기존 연구", draft.priorResearchSection)}
      ${researchMiniPanel("이론적 배경", draft.theoreticalBackground)}
      ${researchMiniPanel("자료 수집 방법", draft.dataCollectionMethod)}
      ${researchMiniPanel("자료 선택 기준", draft.dataSelectionCriteria)}
      ${researchMiniPanel("분석 방법", draft.analysisMethod)}
      ${researchMiniPanel("시각화 방법", draft.visualizationMethod)}
      ${researchMiniPanel("탐구 결과 본문 초안", draft.resultSectionDraft)}
      ${researchMiniPanel("학생 생각 반영", draft.studentVoiceReflection)}
      ${researchMiniPanel("AI 활용 방법", draft.aiUsageMethod)}
      <section class="mini-panel"><h4>수정 목차</h4>${listHtmlLocal(draft.updatedOutline)}</section>
      <div class="result-actions">
        <button class="primary-button" type="button" data-period3-approve>이 내용 사용</button>
        <button class="secondary-button" type="button" data-period3-focus="report.generated.period3.studentInputs.backgroundThought">직접 수정 후 적용</button>
        <button class="secondary-button" type="button" data-period3-generate>다시 생성</button>
        <button class="secondary-button" type="button" data-period3-cancel>취소</button>
      </div>
    </div>
  `;
}

async function generatePeriod3() {
  if (period3GenerationState.loading) return;
  const cooldown = getPeriod3CooldownSeconds();
  if (cooldown > 0) {
    showToast(`AI 재생성은 ${cooldown}초 후 가능합니다.`);
    return;
  }
  const data = readFormData();
  const period3 = getPeriod3(data);
  const validation = validatePeriod3Generation(period3);
  if (validation) {
    period3GenerationState.error = validation;
    renderSteps(data);
    showToast(validation);
    return;
  }

  period3GenerationState.loading = true;
  period3GenerationState.error = "";
  period3GenerationState.lastGeneratedAt = Date.now();
  renderSteps(data);

  try {
    const payload = await postReportAiHelp("generate_period3", collectPeriod3GenerationInput(period3));
    savePeriod3Data((nextData) => {
      const nextPeriod3 = getPeriod3(nextData);
      nextPeriod3.studentInputs = { ...period3.studentInputs };
      nextPeriod3.generatedDraft = { ...nextPeriod3.generatedDraft, ...normalizePeriod3Draft(payload), approvedAt: "" };
    });
    showToast("3차시 초안을 생성했습니다. 확인 후 승인해 주세요.");
  } catch (error) {
    period3GenerationState.error = /429/.test(String(error.message))
      ? "현재 AI 요청이 많습니다. 잠시 후 다시 시도해 주세요."
      : error.message || "3차시 초안 생성에 실패했습니다.";
    renderSteps(loadReportData());
    showToast(period3GenerationState.error);
  } finally {
    period3GenerationState.loading = false;
    renderSteps(loadReportData());
  }
}

function collectPeriod3GenerationInput(period3) {
  return {
    period1Json: JSON.stringify(period3.inheritedFromPeriod1 || {}),
    period2Json: JSON.stringify(period3.inheritedFromPeriod2 || {}),
    backgroundThought: period3.studentInputs.backgroundThought,
    researchPurposeThought: period3.studentInputs.researchPurposeThought,
    dataUsageThought: period3.studentInputs.dataUsageThought,
    keyFindingThought: period3.studentInputs.keyFindingThought,
  };
}

function validatePeriod3Generation(period3) {
  const p1 = period3.inheritedFromPeriod1 || {};
  const p2 = period3.inheritedFromPeriod2 || {};
  const inputs = period3.studentInputs || {};
  if (!p1.selectedTopic || !p1.finalResearchQuestion) return "1차시 승인 결과가 필요합니다.";
  if (!p2.tableDescription && !p2.resultDraft) return "2차시 승인 결과가 필요합니다.";
  if (!inputs.backgroundThought || !inputs.researchPurposeThought || !inputs.dataUsageThought || !inputs.keyFindingThought) return "학생 핵심 생각 4개를 모두 입력해 주세요.";
  return "";
}

function normalizePeriod3Draft(payload) {
  return {
    background: payload.background || "",
    purpose: payload.purpose || "",
    necessity: payload.necessity || "",
    researchQuestion: payload.researchQuestion || "",
    researchScope: payload.researchScope || "",
    priorResearchSection: payload.priorResearchSection || "",
    theoreticalBackground: payload.theoreticalBackground || "",
    dataCollectionMethod: payload.dataCollectionMethod || "",
    dataSelectionCriteria: payload.dataSelectionCriteria || "",
    analysisMethod: payload.analysisMethod || "",
    visualizationMethod: payload.visualizationMethod || "",
    resultSectionDraft: payload.resultSectionDraft || "",
    studentVoiceReflection: payload.studentVoiceReflection || "",
    aiUsageMethod: payload.aiUsageMethod || "",
    updatedOutline: normalizeList(payload.updatedOutline),
    approvedAt: "",
  };
}
function renderPeriod4Card(step, index, reportData) {
  const period4 = ensurePeriod4FinalEdits(reportData);
  const active = isActiveStep(index);
  if (!active) {
    const items = getPeriod4CompletionItems(period4);
    const done = items.filter((item) => item.complete).length;
    return renderCollapsedPeriodCard(step, index, `완료 ${done}/${items.length}`, "1~3차시 승인본을 검토하고 최종 PDF 내용을 확정합니다.");
  }
  const p1 = period4.inheritedFromPeriod1 || {};
  const p2 = period4.inheritedFromPeriod2 || {};
  const p3 = period4.inheritedFromPeriod3 || {};
  const inputs = period4.studentInputs || {};
  const edits = period4.finalEdits || {};
  return `
    <article class="step-card period-work-card is-active" data-step-index="${index}">
      <div class="period-work-head" data-step-toggle="${index}">
        <span class="step-tag">${step.label}</span>
        <div>
          <h3>4차시: 최종 검토·편집·PDF 완성</h3>
          <p>새 AI 생성 없이 1~3차시 승인 결과를 학생이 직접 확인하고 제출본을 확정합니다.</p>
        </div>
      </div>
      <div class="period-work-body">
        ${renderPeriod4Completion(period4)}
        <section class="period-work-section selected-topic-callout">
          <h4>누적 보고서 불러오기</h4>
          ${definitionHtml([
            ["최종 주제", p1.selectedTopic],
            ["최종 탐구 질문", p1.finalResearchQuestion],
            ["연구 대상·범위", [p1.researchTarget, p1.researchScope].filter(Boolean).join(" / ")],
            ["비교 요소 또는 분석 기준", p1.comparisonFactors],
            ["기존 연구와 이론", [p1.priorResearchSummary, p1.theory, p1.theoryApplication].filter(Boolean).join("\n\n")],
            ["자료와 표", p2.selectedDataPack?.title || p2.tableDescription],
            ["기본 그래프", p2.basicChart?.title || p2.basicChartDescription],
            ["특별 시각화", p2.specialChart?.title || p2.specialChartDescription],
            ["3차시 서론", [p3.background, p3.purpose, p3.necessity].filter(Boolean).join("\n\n")],
            ["3차시 연구방법", [p3.dataCollectionMethod, p3.analysisMethod, p3.visualizationMethod].filter(Boolean).join("\n\n")],
            ["3차시 결과 본문", p3.resultSectionDraft],
          ])}
        </section>

        <section class="period-work-section">
          <h4>최종 점검 체크리스트</h4>
          <div class="checklist period4-checklist">
            ${period4ChecklistItem("topicQuestionLinked", "탐구 주제와 질문이 연결되는가", period4)}
            ${period4ChecklistItem("priorTheoryRelated", "기존 연구와 이론이 주제와 관련 있는가", period4)}
            ${period4ChecklistItem("tableGraphMatched", "표·그래프의 수치와 설명이 일치하는가", period4)}
            ${period4ChecklistItem("sourcesVisible", "출처가 표시되어 있는가", period4)}
            ${period4ChecklistItem("noCausationOverclaim", "상관관계를 인과관계로 단정하지 않았는가", period4)}
            ${period4ChecklistItem("noDuplicateSentences", "중복 문장이 없는가", period4)}
            ${period4ChecklistItem("studentVoiceIncluded", "내 생각이 포함되어 있는가", period4)}
            ${period4ChecklistItem("aiTextReviewed", "AI 문장을 그대로 사용하지 않고 검토했는가", period4)}
          </div>
        </section>

        <section class="period-work-section">
          <h4>학생 직접 입력 3개</h4>
          <p class="period-help-text">최종 PDF에 학생의 판단과 배운 점이 들어갑니다. 짧아도 직접 쓴 문장이 필요합니다.</p>
          <div class="period-form-grid">
            ${periodTextarea("탐구 질문에 대한 최종 답", "report.generated.period4.studentInputs.finalAnswer", inputs.finalAnswer, "탐구 질문에 직접 답하는 문장으로 정리하세요.", 3).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("배우고 느낀 점", "report.generated.period4.studentInputs.learningReflection", inputs.learningReflection, "자료를 분석하며 새롭게 알게 된 점이나 느낀 점을 적으세요.", 3).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("앞으로 더 알아보고 싶은 내용", "report.generated.period4.studentInputs.futureInquiry", inputs.futureInquiry, "이번 탐구 이후 더 조사하고 싶은 내용을 적으세요.", 3).replaceAll("data-period1-path", "data-period4-path")}
          </div>
        </section>

        <section class="period-work-section">
          <div class="period-result-head">
            <h4>최종 편집</h4>
            <p>아래 내용이 최종 PDF의 기준입니다. 빈 섹션 숨기기를 켜면 내용 없는 항목은 PDF에서 제외됩니다.</p>
          </div>
          <label class="inline-option"><input type="checkbox" data-period4-hide-empty ${edits.hideEmptySections ? "checked" : ""}> 빈 섹션 숨기기</label>
          <div class="period-form-grid final-edit-grid">
            ${periodTextarea("제목", "report.generated.period4.finalEdits.title", edits.title, "보고서 제목", 2).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("목차", "report.generated.period4.finalEdits.outline", edits.outline, "한 줄에 하나씩 목차를 적으세요.", 4).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("탐구 배경", "report.generated.period4.finalEdits.background", edits.background, "탐구 배경", 4).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("탐구 목적과 필요성", "report.generated.period4.finalEdits.purposeNecessity", edits.purposeNecessity, "목적과 필요성을 정리하세요.", 4).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("탐구 질문과 범위", "report.generated.period4.finalEdits.questionScope", edits.questionScope, "탐구 질문과 범위", 4).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("기존 연구와 이론", "report.generated.period4.finalEdits.priorTheory", edits.priorTheory, "기존 연구, 핵심 이론, 적용 방법", 5).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("탐구 방법", "report.generated.period4.finalEdits.methodology", edits.methodology, "자료 수집, 선택 기준, 분석 방법, 시각화 방법", 5).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("표·그래프 설명", "report.generated.period4.finalEdits.tableGraphDescription", edits.tableGraphDescription, "표와 그래프 설명, 출처, 단위 확인", 5).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("분석 결과", "report.generated.period4.finalEdits.analysisResult", edits.analysisResult, "핵심 결과와 해석", 5).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("결론", "report.generated.period4.finalEdits.conclusion", edits.conclusion, "최종 결론", 4).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("참고문헌", "report.generated.period4.finalEdits.references", edits.references, "한 줄에 하나씩 출처를 적으세요.", 4).replaceAll("data-period1-path", "data-period4-path")}
            ${periodTextarea("AI 활용 기록", "report.generated.period4.finalEdits.aiUsage", edits.aiUsage, "AI를 어디에 활용했고 어떻게 검토했는지 적으세요.", 4).replaceAll("data-period1-path", "data-period4-path")}
          </div>
          <div class="result-actions">
            <button class="secondary-button" type="button" data-period4-save>저장</button>
            <button class="secondary-button" type="button" data-period4-revert>원래 승인본으로 되돌리기</button>
            <button class="primary-button" type="button" data-period4-approve>최종본 승인</button>
            <a class="primary-button" href="./report/">보고서 미리보기·PDF 생성</a>
          </div>
        </section>
      </div>
    </article>
  `;
}

function period4ChecklistItem(key, label, period4) {
  const checked = Boolean(period4.checklist?.[key]);
  return `<label class="${checked ? "is-complete" : ""}"><input type="checkbox" data-period4-check="${key}" ${checked ? "checked" : ""}><span>${escapeHtml(label)}</span></label>`;
}

function getPeriod4CompletionItems(period4) {
  const inputs = period4.studentInputs || {};
  const checks = Object.values(period4.checklist || {});
  const edits = period4.finalEdits || {};
  return [
    ["최종 답 입력", inputs.finalAnswer],
    ["배우고 느낀 점 입력", inputs.learningReflection],
    ["향후 탐구 입력", inputs.futureInquiry],
    ["체크리스트 전체 확인", checks.length >= 8 && checks.every(Boolean)],
    ["최종본 승인", edits.approvedAt],
  ].map(([label, value]) => ({ label, complete: Boolean(typeof value === "boolean" ? value : String(value || "").trim()) }));
}

function renderPeriod4Completion(period4) {
  const items = getPeriod4CompletionItems(period4);
  const done = items.filter((item) => item.complete).length;
  return `
    <section class="period-completion ${done === items.length ? "is-complete" : ""}">
      <div>
        <strong>4차시 완료 상태</strong>
        <span>${done} / ${items.length} 완료</span>
      </div>
      <ul>${items.map((item) => `<li class="${item.complete ? "is-done" : ""}">${escapeHtml(item.label)}</li>`).join("")}</ul>
    </section>
  `;
}

function miniPanel(title, items) {
  return `<div class="mini-panel"><h4>${title}</h4><ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul></div>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error("Clipboard API unavailable");
    }
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  showToast("프롬프트를 복사했습니다.");
}

function renderChartPreview(imageData) {
  if (!imageData) {
    dom.chartPreview.hidden = true;
    dom.chartPreviewImage.removeAttribute("src");
    return;
  }
  dom.chartPreview.hidden = false;
  dom.chartPreviewImage.src = imageData;
}

function getPresenceDeviceId() {
  try {
    const existing = window.localStorage.getItem(PRESENCE_DEVICE_KEY);
    if (existing) return existing;
    const next = `device-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(PRESENCE_DEVICE_KEY, next);
    return next;
  } catch {
    return `device-${Date.now()}`;
  }
}

function buildPresencePayload() {
  const reportData = loadReportData();
  const progress = getProgressSummary();
  const deviceId = getPresenceDeviceId();
  const progressPercent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  return {
    id: deviceId,
    studentId: deviceId,
    device_id: deviceId,
    lessonId: LESSON_ID,
    lesson_id: LESSON_ID,
    class_session_id: LESSON_ID,
    student_name: reportData.student.name || "학생 기기",
    student_number: reportData.student.studentNumber || "",
    class_name: reportData.student.className || "",
    current_step: "주제탐구보고서 커리큘럼",
    currentStep: "주제탐구보고서 커리큘럼",
    progress: progressPercent,
    last_seen_at: new Date().toISOString(),
    lastSeenAt: Date.now(),
    is_pdf_generated: Boolean(reportData.metadata.pdfGenerated),
    pdfGenerated: Boolean(reportData.metadata.pdfGenerated),
    pdf_url: reportData.metadata.pdfUrl || "",
    pdfUrl: reportData.metadata.pdfUrl || "",
  };
}

function sendPresenceHeartbeat() {
  const payload = buildPresencePayload();
  try {
    window.localStorage.setItem(`${PRESENCE_STORAGE_PREFIX}${payload.studentId}`, JSON.stringify(payload));
  } catch {}
  window.LoreAXSupabase?.syncPresence?.(payload);
}

function saveReportToServer(reportData) {
  if (!window.LoreAXSupabase?.isEnabled?.()) {
    dom.serverStatus.textContent = "로컬 저장 모드";
    return;
  }
  dom.serverStatus.textContent = "서버 저장 중...";
  window.LoreAXSupabase.saveReport({
    lessonId: LESSON_ID,
    reportData,
    presence: buildPresencePayload(),
  }).then((result) => {
    dom.serverStatus.textContent = result.mode === "supabase" ? "서버 저장 완료" : "로컬 저장 모드";
  }).catch(() => {
    dom.serverStatus.textContent = "서버 연결 실패, 로컬에 저장됨";
  });
}

function getAuthRedirectTo() {
  return `${window.location.origin}/sessions/topic-research-report/`;
}

function getAuthDisplayName(user) {
  return user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || "카카오 사용자";
}

async function renderAuthState() {
  if (!dom.authStatus) return;
  if (!window.LoreAXSupabase?.isEnabled?.()) {
    dom.authStatus.textContent = "Supabase 미연결 · 로컬 저장";
    if (dom.kakaoLoginButton) {
      dom.kakaoLoginButton.hidden = false;
      dom.kakaoLoginButton.disabled = false;
    }
    if (dom.kakaoLogoutButton) dom.kakaoLogoutButton.hidden = true;
    return;
  }
  const result = await window.LoreAXSupabase.getAuthUser();
  const user = result.user;
  if (user) {
    dom.authStatus.textContent = `카카오 로그인됨 · ${getAuthDisplayName(user)}`;
    if (dom.kakaoLoginButton) dom.kakaoLoginButton.hidden = true;
    if (dom.kakaoLogoutButton) dom.kakaoLogoutButton.hidden = false;
  } else {
    dom.authStatus.textContent = "로그인 없이 저장 중";
    if (dom.kakaoLoginButton) {
      dom.kakaoLoginButton.hidden = false;
      dom.kakaoLoginButton.disabled = false;
    }
    if (dom.kakaoLogoutButton) dom.kakaoLogoutButton.hidden = true;
  }
}

function initKakaoAuth() {
  renderAuthState();
  window.LoreAXSupabase?.onAuthStateChange?.(() => renderAuthState());

  dom.kakaoLoginButton?.addEventListener("click", async () => {
    if (!window.LoreAXSupabase?.isEnabled?.()) {
      showToast("Supabase 설정 후 카카오 로그인을 사용할 수 있습니다.");
      renderAuthState();
      return;
    }
    dom.kakaoLoginButton.disabled = true;
    const result = await window.LoreAXSupabase.signInWithKakao({ redirectTo: getAuthRedirectTo() });
    if (!result.ok) {
      dom.kakaoLoginButton.disabled = false;
      showToast(result.message || "카카오 로그인 연결을 확인해 주세요.");
    }
  });

  dom.kakaoLogoutButton?.addEventListener("click", async () => {
    const result = await window.LoreAXSupabase?.signOut?.();
    if (!result?.ok) showToast(result?.message || "로그아웃 상태를 확인해 주세요.");
    await renderAuthState();
  });
}

renderSteps();
hydrateForm();
initKakaoAuth();
window.LoreAXTenant?.applyTenantLinks?.();

dom.reportForm.addEventListener("input", scheduleSave);
dom.reportForm.addEventListener("change", scheduleSave);

dom.stepList.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("[data-step-toggle]");
  if (toggleButton) {
    event.preventDefault();
    const index = Number(toggleButton.dataset.stepToggle);
    activeStepIndex = activeStepIndex === index ? -1 : Math.max(0, Math.min(lessonSteps.length - 1, index));
    window.localStorage.setItem("topicResearchActiveStep", String(activeStepIndex));
    renderSteps();
    dom.stepList.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const jumpButton = event.target.closest("[data-step-jump]");
  if (jumpButton) {
    activeStepIndex = Math.max(0, Math.min(lessonSteps.length - 1, Number(jumpButton.dataset.stepJump)));
    window.localStorage.setItem("topicResearchActiveStep", String(activeStepIndex));
    renderSteps();
    dom.stepList.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const navButton = event.target.closest("[data-step-nav]");
  if (navButton) {
    const direction = navButton.dataset.stepNav;
    if (activeStepIndex < 0) {
      activeStepIndex = 0;
    } else {
      activeStepIndex += direction === "next" ? 1 : -1;
    }
    activeStepIndex = Math.max(0, Math.min(lessonSteps.length - 1, activeStepIndex));
    window.localStorage.setItem("topicResearchActiveStep", String(activeStepIndex));
    renderSteps();
    dom.stepList.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const copyButton = event.target.closest("[data-copy-prompt]");
  if (copyButton) {
    const step = lessonSteps.find((item) => item.id === copyButton.dataset.copyPrompt);
    if (!step) return;
    copyText(step.prompt);
    return;
  }

  if (event.target.closest("[data-period1-copy-search]")) {
    copySearchTerms();
    return;
  }

  const timerButton = event.target.closest("[data-period1-timer]");
  if (timerButton) {
    startPeriod1Timer(Number(timerButton.dataset.period1Timer || 300));
    return;
  }

  const generateButton = event.target.closest("[data-period1-generate]");
  if (generateButton) {
    generatePeriod1(generateButton.dataset.period1Generate);
    return;
  }


  const period4Check = event.target.closest("[data-period4-check]");
  if (period4Check) {
    savePeriod4Data((data) => {
      const period4 = getPeriod4(data);
      period4.checklist[period4Check.dataset.period4Check] = period4Check.checked;
    }, { render: false });
    period4Check.closest("label")?.classList.toggle("is-complete", period4Check.checked);
    return;
  }

  if (event.target.closest("[data-period4-save]")) {
    savePeriod4Data(() => {}, { render: false });
    showToast("4차시 최종 편집 내용을 저장했습니다.");
    return;
  }

  if (event.target.closest("[data-period4-revert]")) {
    savePeriod4Data((data) => {
      const period4 = getPeriod4(data);
      period4.finalEdits = buildPeriod4ApprovedDraft(data);
    });
    showToast("1~3차시 승인본 기준으로 되돌렸습니다.");
    return;
  }

  if (event.target.closest("[data-period4-approve]")) {
    savePeriod4Data((data) => {
      const period4 = getPeriod4(data);
      period4.finalEdits.approvedAt = new Date().toISOString();
      addAiUsageLog(data, "4차시에서 학생이 최종 편집본을 검토하고 승인함");
      syncPeriod4ToReportFields(data);
    });
    showToast("최종본을 승인했습니다. 보고서 화면에서 PDF를 생성하세요.");
    return;
  }

  if (event.target.closest("[data-period3-generate]")) {
    generatePeriod3();
    return;
  }

  if (event.target.closest("[data-period3-approve]")) {
    savePeriod3Data((data) => {
      const period3 = getPeriod3(data);
      period3.generatedDraft.approvedAt = new Date().toISOString();
      addAiUsageLog(data, "3차시 AI 초안을 학생이 검토하고 서론·연구방법·본문 초안에 반영함");
      syncPeriod3ToReportFields(data);
    });
    showToast("3차시 초안을 보고서에 반영했습니다.");
    return;
  }

  if (event.target.closest("[data-period3-cancel]")) {
    savePeriod3Data((data) => {
      const period3 = getPeriod3(data);
      period3.generatedDraft = structuredClone(PERIOD3_DEFAULTS.generatedDraft);
    });
    showToast("3차시 생성 결과를 취소했습니다.");
    return;
  }

  const period3FocusButton = event.target.closest("[data-period3-focus]");
  if (period3FocusButton) {
    const field = dom.stepList.querySelector(`[data-period3-path="${period3FocusButton.dataset.period3Focus}"]`);
    if (field) {
      field.focus();
      field.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }
  const period2DirectionButton = event.target.closest("[data-period2-direction]");
  if (period2DirectionButton) {
    const index = Number(period2DirectionButton.dataset.period2Direction);
    savePeriod2Data((data) => {
      const period2 = getPeriod2(data);
      const directions = getPeriod2Directions(data);
      period2.selectedDirection = directions[index] || directions[0] || {};
      period2.visualizations.basicChart = buildBasicChart(period2);
      period2.visualizations.specialChart = buildSpecialChart(period2, period2.visualizations.basicChart);
    });
    showToast("분석 방향을 선택했습니다.");
    return;
  }

  const period2PackButton = event.target.closest("[data-period2-pack]");
  if (period2PackButton) {
    const index = Number(period2PackButton.dataset.period2Pack);
    savePeriod2Data((data) => {
      const period2 = getPeriod2(data);
      const packs = getRecommendedDataPacks(data);
      period2.selectedDataPack = packs[index] || packs[0] || {};
      period2.visualizations.basicChart = buildBasicChart(period2);
      period2.visualizations.specialChart = buildSpecialChart(period2, period2.visualizations.basicChart);
    });
    showToast("데이터팩을 선택했습니다.");
    return;
  }

  const period2ChartButton = event.target.closest("[data-period2-chart-type]");
  if (period2ChartButton) {
    savePeriod2Data((data) => {
      const period2 = getPeriod2(data);
      period2.visualizations.basicChart = { ...period2.visualizations.basicChart, type: period2ChartButton.dataset.period2ChartType };
      period2.visualizations.basicChart = buildBasicChart(period2);
      period2.visualizations.specialChart = buildSpecialChart(period2, period2.visualizations.basicChart);
    });
    showToast("그래프 유형을 반영했습니다.");
    return;
  }

  if (event.target.closest("[data-period2-generate]")) {
    generatePeriod2();
    return;
  }

  if (event.target.closest("[data-period2-approve]")) {
    savePeriod2Data((data) => {
      const period2 = getPeriod2(data);
      period2.generatedAnalysis.approvedAt = new Date().toISOString();
      addAiUsageLog(data, "2차시 AI 분석 결과를 학생이 확인하고 탐구 결과 초안에 반영함");
      syncPeriod2ToReportFields(data);
    });
    showToast("2차시 분석 결과를 보고서에 반영했습니다.");
    return;
  }

  if (event.target.closest("[data-period2-cancel]")) {
    savePeriod2Data((data) => {
      const period2 = getPeriod2(data);
      period2.generatedAnalysis = structuredClone(PERIOD2_DEFAULTS.generatedAnalysis);
    });
    showToast("2차시 생성 결과를 취소했습니다.");
    return;
  }

  const period2FocusButton = event.target.closest("[data-period2-focus]");
  if (period2FocusButton) {
    const field = dom.stepList.querySelector(`[data-period2-path="${period2FocusButton.dataset.period2Focus}"]`);
    if (field) {
      field.focus();
      field.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  const selectTopicButton = event.target.closest("[data-select-topic]");
  if (selectTopicButton) {
    const index = Number(selectTopicButton.dataset.selectTopic);
    savePeriod1Data((data) => {
      const topicSetting = getPeriod1(data).topicSetting;
      const candidate = topicSetting.generatedCandidates[index] || topicSetting.candidates[index];
      if (!candidate) return;
      topicSetting.selectedTopic = candidate.topic || candidate.title || "";
      topicSetting.approvedAt = new Date().toISOString();
      addAiUsageLog(data, "1차시-1 AI 주제 후보 중 학생이 최종 탐구 주제를 선택함");
      syncPeriod1ToReportFields(data);
    });
    showToast("선택한 주제를 보고서 필드에 저장했습니다.");
    return;
  }

  if (event.target.closest("[data-clear-selected-topic]")) {
    savePeriod1Data((data) => {
      const topicSetting = getPeriod1(data).topicSetting;
      topicSetting.selectedTopic = "";
      topicSetting.approvedAt = "";
      syncPeriod1ToReportFields(data);
    });
    showToast("주제를 다시 선택할 수 있습니다.");
    return;
  }

  const selectQuestionButton = event.target.closest("[data-select-question]");
  if (selectQuestionButton) {
    const index = Number(selectQuestionButton.dataset.selectQuestion);
    savePeriod1Data((data) => {
      const design = getPeriod1(data).researchDesign;
      const question = design.questionCandidates[index];
      if (!question) return;
      design.finalResearchQuestion = question;
      design.recommendedQuestion = question;
      design.approvedAt = new Date().toISOString();
      addAiUsageLog(data, "1차시-2 AI 질문 후보 중 학생이 최종 탐구 질문을 선택함");
      syncPeriod1ToReportFields(data);
    });
    showToast("선택한 질문을 보고서 필드에 저장했습니다.");
    return;
  }

  const useResearchButton = event.target.closest("[data-use-research-result]");
  if (useResearchButton) {
    savePeriod1Data((data) => {
      const design = getPeriod1(data).researchDesign;
      if (design.recommendedQuestion && !design.finalResearchQuestion) design.finalResearchQuestion = design.recommendedQuestion;
      design.approvedAt = new Date().toISOString();
      addAiUsageLog(data, "1차시-2 AI 생성 결과를 학생이 검토해 보고서에 반영함");
      syncPeriod1ToReportFields(data);
    });
    showToast("탐구 질문 정리 내용을 보고서 필드에 반영했습니다.");
    return;
  }

  const cancelButton = event.target.closest("[data-period1-cancel]");
  if (cancelButton) {
    const type = cancelButton.dataset.period1Cancel;
    savePeriod1Data((data) => {
      const period1 = getPeriod1(data);
      if (type === "topic") {
        period1.topicSetting.generatedCandidates = [];
        period1.topicSetting.candidates = [];
        period1.topicSetting.approvedAt = "";
      } else {
        Object.assign(period1.researchDesign, {
          questionProblems: [],
          questionCandidates: [],
          recommendedQuestion: "",
          researchTarget: "",
          researchScope: "",
          comparisonFactors: [],
          comparisonPoint: "",
          priorResearchSummary: "",
          literatureSummary: "",
          theory: "",
          theoryConcept: "",
          theoryApplication: "",
          dataDirection: "",
          nextDataDirection: "",
          initialOutlineItems: [],
          initialOutline: "",
          approvedAt: "",
        });
      }
    });
    showToast("생성 결과를 취소했습니다.");
    return;
  }

  const focusButton = event.target.closest("[data-period1-focus]");
  if (focusButton) {
    const field = dom.stepList.querySelector(`[data-period1-path="${focusButton.dataset.period1Focus}"]`);
    if (field) {
      field.focus();
      field.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
});

dom.stepList.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-progress-id]");
  if (!checkbox) return;
  const progress = loadProgress();
  progress[checkbox.dataset.progressId] = checkbox.checked;
  if (!checkbox.checked) delete progress[checkbox.dataset.progressId];
  saveProgress(progress);
  checkbox.closest("label")?.classList.toggle("is-complete", checkbox.checked);
  updateProgressDisplay();
  sendPresenceHeartbeat();
});

dom.stepList.addEventListener("input", (event) => {
  const period4Field = event.target.closest("[data-period4-path]");
  if (period4Field) {
    savePeriod4Data((data) => {
      setByPath(data, period4Field.dataset.period4Path, period4Field.value || "");
    }, { render: false });
    return;
  }

  const period4Hide = event.target.closest("[data-period4-hide-empty]");
  if (period4Hide) {
    savePeriod4Data((data) => {
      const period4 = getPeriod4(data);
      period4.finalEdits.hideEmptySections = period4Hide.checked;
    }, { render: false });
    return;
  }

  const period3Field = event.target.closest("[data-period3-path]");
  if (period3Field) {
    savePeriod3Data((data) => {
      setByPath(data, period3Field.dataset.period3Path, period3Field.value || "");
    }, { render: false });
    return;
  }
  const period2Field = event.target.closest("[data-period2-path]");
  if (period2Field) {
    savePeriod2Data((data) => {
      setByPath(data, period2Field.dataset.period2Path, period2Field.value || "");
    }, { render: false });
    return;
  }

  const field = event.target.closest("[data-period1-path]");
  if (!field) return;
  savePeriod1Data((data) => {
    setByPath(data, field.dataset.period1Path, field.value || "");
    const period1 = getPeriod1(data);
    if (field.dataset.period1Path.includes(".topicSetting.selectedTopic") || field.dataset.period1Path.includes(".topicSetting.topicReason")) {
      period1.topicSetting.approvedAt = period1.topicSetting.approvedAt || new Date().toISOString();
    }
    if (
      field.dataset.period1Path.includes(".researchDesign.finalResearchQuestion") ||
      field.dataset.period1Path.includes(".researchDesign.priorResearchSummary") ||
      field.dataset.period1Path.includes(".researchDesign.theory") ||
      field.dataset.period1Path.includes(".researchDesign.theoryApplication")
    ) {
      period1.researchDesign.approvedAt = period1.researchDesign.approvedAt || new Date().toISOString();
    }
    syncPeriod1ToReportFields(data);
  }, { render: false });
});

dom.resetProgressButton.addEventListener("click", () => {
  if (!confirm("현재 수업의 체크리스트 진행상태를 초기화할까요?")) return;
  try {
    window.localStorage.removeItem(PROGRESS_STORAGE_KEY);
  } catch {}
  renderSteps();
  updateProgressDisplay();
  sendPresenceHeartbeat();
});

dom.chartImageInput.addEventListener("change", () => {
  const file = dom.chartImageInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const data = readFormData();
    data.chartImage = reader.result;
    saveReportData(data);
    renderChartPreview(data.chartImage);
    showToast("그래프 이미지를 저장했습니다.");
    sendPresenceHeartbeat();
  };
  reader.readAsDataURL(file);
});

dom.removeChartButton.addEventListener("click", () => {
  const data = readFormData();
  data.chartImage = null;
  dom.chartImageInput.value = "";
  saveReportData(data);
  renderChartPreview(null);
  sendPresenceHeartbeat();
});

window.LoreAXPresence = {
  heartbeat: sendPresenceHeartbeat,
  buildPayload: buildPresencePayload,
  intervalMs: HEARTBEAT_INTERVAL_MS,
  onlineWindowMs: 360000,
};

window.setInterval(sendPresenceHeartbeat, HEARTBEAT_INTERVAL_MS);
["click", "change", "input", "visibilitychange"].forEach((eventName) => {
  document.addEventListener(eventName, sendPresenceHeartbeat, { passive: true });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    window.LoreAXUsage?.trackCourseOpen?.(LESSON_ID, { source: "topic_research_page" });
    navigator.serviceWorker.register("../../sw.js").catch(() => {});
  });
}
}


















