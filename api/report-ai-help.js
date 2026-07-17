const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_MODEL = "z-ai/glm-5.2";
const REQUEST_TIMEOUT_MS = 60000;

const TASKS = {
  generate_period1_topic: {
    minLength: 8,
    minCandidates: 1,
    buildPrompt(data) {
      return `1차시-1 탐구 주제 후보를 만든다.

학생 입력:
- 관심 분야: ${safeText(data.interestArea)}
- 관심 키워드: ${safeText(data.keywords)}
- 관심 이유: ${safeText(data.interestReason)}

규칙:
- 4차시 안에 조사와 보고서 작성이 가능한 주제 후보 3~5개를 제안한다.
- 각 후보는 구체적이고 학생이 실제 자료를 찾을 수 있어야 한다.
- 실제 자료를 찾기 어려운 주제는 feasibility 또는 narrowingSuggestion에 경고를 넣는다.
- AI가 최종 주제를 확정하지 않는다.
- 존재하지 않는 논문, 통계, 출처, 수치를 만들지 않는다.
- 고등학생이 이해할 수 있는 쉬운 한국어로 쓴다.

JSON만 반환한다. 영어 key를 그대로 사용한다.
{
  "candidates": [
    {
      "title": "",
      "target": "",
      "scope": "",
      "requiredData": "",
      "feasibility": "",
      "narrowingSuggestion": ""
    }
  ]
}`;
    },
  },
  generate_period1_research: {
    minLength: 12,
    minCandidates: 1,
    buildPrompt(data) {
      return `1차시-2 탐구 질문과 기존 연구를 정리한다.

학생 입력:
- 최종 선택 주제: ${safeText(data.selectedTopic)}
- 초안 탐구 질문: ${safeText(data.draftQuestion)}
- 찾은 논문 제목: ${safeText(data.paperTitle)}
- 초록 또는 핵심 문장 1~2개: ${safeText(data.paperKeySentences)}
- 내 주제와 관련 있는 이유: ${safeText(data.paperRelevanceReason)}
- 정리된 학생 입력: ${safeText(data.literaturePaste)}
- 관심 키워드: ${safeText(data.keywords)}

규칙:
- 학생이 입력한 논문 제목과 핵심 문장 안에서만 기존 연구와 핵심 개념을 요약한다.
- 존재하지 않는 논문, 저자, 연도, 통계, 출처, 수치를 만들지 않는다.
- 논문 안에 이론이 명확하지 않으면 확정하지 말고 핵심 개념 후보로 표시한다.
- 인과관계가 불명확하면 관계 또는 연관성으로 표현한다.
- 독립변수·종속변수는 확정값이 아니라 비교 요소 후보로 제시한다.
- 전체 보고서를 대신 작성하지 않는다.
- 고등학생이 이해할 수 있는 쉬운 한국어로 쓴다.

JSON만 반환한다. 영어 key를 그대로 사용한다.
{
  "questionProblems": [],
  "questionCandidates": [],
  "recommendedQuestion": "",
  "researchTarget": "",
  "researchScope": "",
  "comparisonFactors": [],
  "priorResearchSummary": "",
  "theory": "",
  "theoryApplication": "",
  "organizedSource": "",
  "dataDirection": "",
  "initialOutline": []
}`;
    },
  },
  generate_period2: {
    minLength: 30,
    minCandidates: 0,
    buildPrompt(data) {
      return `2차시 자료 분석과 시각화 결과 초안을 만든다.

1차시 승인 결과:
${safeText(data.inheritedJson)}

선택한 분석 방향:
${safeText(data.selectedDirectionJson)}

선택한 실제 데이터팩:
${safeText(data.dataPackJson)}

기본 그래프:
${safeText(data.basicChartJson)}

특별 시각화:
${safeText(data.specialChartJson)}

학생 관찰 1문장:
${safeText(data.studentObservation)}

규칙:
- 선택한 데이터팩에 포함된 값, 기간, 단위, 출처만 사용한다.
- 없는 통계, 출처, URL, 논문, 저자, 연도, 수치를 만들지 않는다.
- 증가, 감소, 최고, 최저, 비율, 비교는 표의 값으로 확인되는 경우에만 설명한다.
- 상관관계를 인과관계로 단정하지 않는다.
- 1차시 이론과 탐구 질문에 연결한다.
- 학생의 관찰 문장을 반영한다.
- 최종 결론이 아니라 탐구 결과 초안으로만 작성한다.
- 고등학생 보고서 문체로 쓴다.

JSON만 반환한다. 영어 key를 그대로 사용한다.
{
  "analysisDirections": [],
  "selectedDirectionSummary": "",
  "tableDescription": "",
  "basicChartDescription": "",
  "specialChartDescription": "",
  "comparison": "",
  "keyFindings": [],
  "theoryConnection": "",
  "researchQuestionConnection": "",
  "limitations": [],
  "resultDraft": "",
  "updatedOutline": []
}`;
    },
  },
  generate_period3: {
    minLength: 40,
    minCandidates: 0,
    preferredProvider: "openai",
    fallbackProviders: ["anthropic"],
    buildPrompt(data) {
      return `3차시 서론, 연구방법, 분석 본문 초안을 만든다.

1차시 승인 결과:
${safeText(data.period1Json)}

2차시 승인 결과:
${safeText(data.period2Json)}

학생 핵심 생각 4개:
- 이 주제를 탐구하게 된 배경: ${safeText(data.backgroundThought)}
- 무엇을 알아보려고 했는지: ${safeText(data.researchPurposeThought)}
- 어떤 자료와 그래프를 활용했는지: ${safeText(data.dataUsageThought)}
- 분석 결과에서 가장 중요하다고 생각한 점: ${safeText(data.keyFindingThought)}

규칙:
- 1차시와 2차시에서 학생이 승인한 값만 사용한다.
- 없는 논문, 통계, 출처, 수치를 만들지 않는다.
- 탐구 질문, 이론, 데이터, 그래프 결과가 서로 연결되게 쓴다.
- 학생이 입력한 표현을 최대한 살린다.
- 너무 전문적인 논문체가 아니라 고등학생 보고서 문체로 쓴다.
- 배경, 목적, 필요성을 반복하지 않는다.
- 연구방법은 실제 학생이 수행한 과정만 작성한다.
- 그래프와 표를 사용하지 않았다면 사용했다고 쓰지 않는다.
- 상관관계를 인과관계로 단정하지 않는다.
- 결론을 미리 확정하지 않고 본문 초안 수준으로만 작성한다.

JSON만 반환한다. 영어 key를 그대로 사용한다.
{
  "background": "",
  "purpose": "",
  "necessity": "",
  "researchQuestion": "",
  "researchScope": "",
  "priorResearchSection": "",
  "theoreticalBackground": "",
  "dataCollectionMethod": "",
  "dataSelectionCriteria": "",
  "analysisMethod": "",
  "visualizationMethod": "",
  "resultSectionDraft": "",
  "studentVoiceReflection": "",
  "aiUsageMethod": "",
  "updatedOutline": []
}`;
    },
  },
};

const SYSTEM_PROMPT = `너는 고등학생의 주제탐구보고서 작성을 돕는 연구 코치다.
전체 보고서를 대신 작성하지 않는다.
학생이 입력한 사실과 제공한 자료 안에서만 제안한다.
존재하지 않는 논문, 저자, 연도, 통계, 출처, 수치를 만들지 않는다.
근거가 부족하면 "확인 필요" 또는 "자료 안에서 확인되지 않음"이라고 쓴다.
상관관계를 인과관계로 단정하지 않는다.
반드시 설명문 없이 JSON 객체 하나만 반환한다.`;

module.exports = async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "POST 요청만 사용할 수 있습니다." });
    return;
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    sendJson(res, 400, { error: "요청 JSON을 읽을 수 없습니다." });
    return;
  }

  if (body.model || body.endpoint || body.system || body.systemPrompt || body.messages) {
    sendJson(res, 400, { error: "모델, 엔드포인트, 시스템 프롬프트는 클라이언트에서 지정할 수 없습니다." });
    return;
  }

  const task = String(body.task || "");
  const taskConfig = TASKS[task];
  if (!taskConfig) {
    sendJson(res, 400, { error: "허용되지 않은 task입니다." });
    return;
  }

  const providers = getAiProviders(taskConfig);
  if (!providers.length) {
    sendJson(res, 503, { error: taskConfig.fallbackProviders?.includes("anthropic") ? "OPENAI_API_KEY 또는 ANTHROPIC_API_KEY가 설정되어 있지 않습니다." : "OPENAI_API_KEY가 설정되어 있지 않습니다." });
    return;
  }

  const studentData = sanitizeStudentData(body.studentData || {});
  const combined = Object.values(studentData).join(" ").trim();
  if (combined.length < taskConfig.minLength) {
    sendJson(res, 400, { error: "생성 전에 학생 입력을 먼저 채워 주세요." });
    return;
  }

  try {
    const payload = await generateTaskPayload(providers, task, taskConfig, studentData);
    sendJson(res, 200, payload);
  } catch (error) {
    sendJson(res, 502, { error: toSafeErrorMessage(error) });
  }
};

function getAiProviders(taskConfig = {}) {
  const keys = {
    openai: normalizeKey(process.env.OPENAI_API_KEY),
    anthropic: normalizeKey(process.env.ANTHROPIC_API_KEY),
    nvidia: normalizeKey(process.env.NVIDIA_API_KEY),
  };
  const orderedNames = [taskConfig.preferredProvider, ...(taskConfig.fallbackProviders || [])].filter(Boolean);
  const names = orderedNames.length ? orderedNames : ["openai", "nvidia"];
  const seen = new Set();
  return names
    .filter((name) => {
      if (seen.has(name)) return false;
      seen.add(name);
      return Boolean(keys[name]);
    })
    .map((name) => ({ name, apiKey: keys[name] }));
}

function normalizeKey(value) {
  return String(value || "").trim().replace(/^['\"]|['\"]$/g, "");
}

async function generateTaskPayload(providers, task, taskConfig, studentData) {
  const providerList = Array.isArray(providers) ? providers : [providers].filter(Boolean);
  let lastError = null;
  for (const provider of providerList) {
    try {
      return await generateTaskPayloadWithProvider(provider, task, taskConfig, studentData);
    } catch (error) {
      lastError = error;
      if (provider !== providerList[providerList.length - 1]) continue;
    }
  }
  throw lastError || new Error("AI 생성 요청에 실패했습니다.");
}

async function generateTaskPayloadWithProvider(provider, task, taskConfig, studentData) {
  let lastPayload = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const retryHint =
      attempt === 0
        ? ""
        : "\n\n이전 응답은 유효한 JSON이 아니었다. 이번에는 반드시 영어 key를 지키고 trailing comma 없는 JSON 객체 하나만 반환한다.";
    const raw = await callAi(provider, `${taskConfig.buildPrompt(studentData)}${retryHint}`);
    let parsed;
    try {
      parsed = parseJsonObject(raw);
    } catch (error) {
      if (attempt === 0) continue;
      throw error;
    }
    const payload = normalizeTaskResponse(task, parsed);
    lastPayload = payload;
    if (task !== "generate_period1_topic") return payload;
    if (payload.candidates.length >= taskConfig.minCandidates) return payload;
  }
  return lastPayload;
}
async function callAi(provider, userPrompt) {
  if (provider.name === "anthropic") return callAnthropic(provider.apiKey, userPrompt);
  if (provider.name === "openai") return callOpenAi(provider.apiKey, userPrompt);
  return callNvidia(provider.apiKey, userPrompt);
}

async function callAnthropic(apiKey, userPrompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(ANTHROPIC_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        system: SYSTEM_PROMPT,
        max_tokens: 1200,
        thinking: { type: "disabled" },
        messages: [{ role: "user", content: userPrompt }],
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || payload?.message || `Anthropic API 오류: ${response.status}`);
    }

    return (payload?.content || []).map((block) => block?.text || "").join("\\n").trim();
  } finally {
    clearTimeout(timer);
  }
}

async function callOpenAi(apiKey, userPrompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || payload?.message || `OpenAI API 오류: ${response.status}`);
    }

    return payload?.choices?.[0]?.message?.content || "";
  } finally {
    clearTimeout(timer);
  }
}

async function callNvidia(apiKey, userPrompt) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(NVIDIA_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 900,
        stream: false,
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || payload?.message || `NVIDIA API 오류: ${response.status}`);
    }

    return payload?.choices?.[0]?.message?.content || "";
  } finally {
    clearTimeout(timer);
  }
}

function parseJsonObject(rawContent) {
  let content = String(rawContent || "")
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(content);
  } catch {
    content = extractJsonBody(content);
    const repaired = repairJson(content);
    try {
      return JSON.parse(repaired);
    } catch {
      const start = repaired.indexOf("{");
      const end = repaired.lastIndexOf("}");
      if (start >= 0 && end > start) return JSON.parse(repairJson(repaired.slice(start, end + 1)));
    }
    throw new Error("AI 응답을 JSON으로 읽을 수 없습니다.");
  }
}

function extractJsonBody(content) {
  const text = String(content || "").trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) return text.slice(start, end + 1).trim();

  return text;
}

function repairJson(content) {
  return String(content || "")
    .replace(/^\uFEFF/, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    .trim();
}

function normalizeTaskResponse(task, payload) {
  if (task === "generate_period1_topic") {
    return {
      candidates: toArray(payload.candidates).slice(0, 5).map((item) => ({
        title: pickText(item, ["title", "topic"]),
        target: pickText(item, ["target"]),
        scope: pickText(item, ["scope"]),
        requiredData: pickText(item, ["requiredData", "sources"]),
        feasibility: pickText(item, ["feasibility"]),
        narrowingSuggestion: pickText(item, ["narrowingSuggestion", "narrowing"]),
      })),
    };
  }

  if (task === "generate_period2") {
    return {
      analysisDirections: pickArray(payload, ["analysisDirections"]).map(safeText).slice(0, 5),
      selectedDirectionSummary: pickText(payload, ["selectedDirectionSummary"]),
      tableDescription: pickText(payload, ["tableDescription"]),
      basicChartDescription: pickText(payload, ["basicChartDescription"]),
      specialChartDescription: pickText(payload, ["specialChartDescription"]),
      comparison: pickText(payload, ["comparison"]),
      keyFindings: pickArray(payload, ["keyFindings"]).map(safeText).slice(0, 8),
      theoryConnection: pickText(payload, ["theoryConnection"]),
      researchQuestionConnection: pickText(payload, ["researchQuestionConnection"]),
      limitations: pickArray(payload, ["limitations"]).map(safeText).slice(0, 6),
      resultDraft: pickText(payload, ["resultDraft"]),
      updatedOutline: pickArray(payload, ["updatedOutline"]).map(safeText).slice(0, 10),
    };
  }

  if (task === "generate_period3") {
    return {
      background: pickText(payload, ["background"]),
      purpose: pickText(payload, ["purpose"]),
      necessity: pickText(payload, ["necessity"]),
      researchQuestion: pickText(payload, ["researchQuestion"]),
      researchScope: pickText(payload, ["researchScope"]),
      priorResearchSection: pickText(payload, ["priorResearchSection"]),
      theoreticalBackground: pickText(payload, ["theoreticalBackground"]),
      dataCollectionMethod: pickText(payload, ["dataCollectionMethod"]),
      dataSelectionCriteria: pickText(payload, ["dataSelectionCriteria"]),
      analysisMethod: pickText(payload, ["analysisMethod"]),
      visualizationMethod: pickText(payload, ["visualizationMethod"]),
      resultSectionDraft: pickText(payload, ["resultSectionDraft"]),
      studentVoiceReflection: pickText(payload, ["studentVoiceReflection"]),
      aiUsageMethod: pickText(payload, ["aiUsageMethod"]),
      updatedOutline: pickArray(payload, ["updatedOutline"]).map(safeText).slice(0, 12),
    };
  }
  return {
    questionProblems: pickArray(payload, ["questionProblems"]).map(safeText),
    questionCandidates: pickArray(payload, ["questionCandidates"]).map(safeText).slice(0, 5),
    recommendedQuestion: pickText(payload, ["recommendedQuestion"]),
    researchTarget: pickText(payload, ["researchTarget"]),
    researchScope: pickText(payload, ["researchScope"]),
    comparisonFactors: pickArray(payload, ["comparisonFactors"]).map(safeText).slice(0, 6),
    priorResearchSummary: pickText(payload, ["priorResearchSummary"]),
    theory: pickText(payload, ["theory"]),
    theoryApplication: pickText(payload, ["theoryApplication"]),
    organizedSource: pickText(payload, ["organizedSource", "source", "dataSource"]),
    dataDirection: pickText(payload, ["dataDirection"]),
    initialOutline: pickArray(payload, ["initialOutline"]).map(safeText).slice(0, 8),
  };
}

function pickText(source, keys) {
  for (const key of keys) {
    if (source && source[key] !== undefined && source[key] !== null) return safeText(source[key]);
  }
  return "";
}

function pickArray(source, keys) {
  for (const key of keys) {
    if (source && source[key] !== undefined && source[key] !== null) return toArray(source[key]);
  }
  return [];
}

function sanitizeStudentData(source) {
  const allowed = [
    "interestArea",
    "keywords",
    "interestReason",
    "selectedTopic",
    "draftQuestion",
    "paperTitle",
    "paperKeySentences",
    "paperRelevanceReason",
    "literaturePaste",
    "inheritedJson",
    "selectedDirectionJson",
    "dataPackJson",
    "basicChartJson",
    "specialChartJson",
    "studentObservation",
    "period1Json",
    "period2Json",
    "backgroundThought",
    "researchPurposeThought",
    "dataUsageThought",
    "keyFindingThought",
  ];
  return allowed.reduce((acc, key) => {
    acc[key] = safeText(source?.[key]);
    return acc;
  }, {});
}

function safeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 2200);
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function toSafeErrorMessage(error) {
  if (error?.name === "AbortError") return "AI 응답이 늦어지고 있습니다. 잠시 후 다시 시도해 주세요.";
  const message = String(error?.message || "AI 생성 요청에 실패했습니다.");
  if (/api key|authorization|unauthorized|invalid/i.test(message)) return "AI 서버 인증 설정을 확인해야 합니다.";
  if (/429|rate limit/i.test(message)) return "현재 AI 요청이 많습니다. 잠시 후 다시 시도해 주세요.";
  if (/fetch|network/i.test(message)) return "AI 서버 연결에 실패했습니다.";
  return message.slice(0, 180);
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}















