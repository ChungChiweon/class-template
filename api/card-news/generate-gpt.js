const {
  cleanText,
  contextFrom,
  endJson,
  hasGenerationSuccess,
  isLiveProviderMode,
  limitResponse,
  methodNotAllowed,
  providerMode,
  recordGenerationSuccess,
  requestJson,
  setCors,
} = require("./_shared");

const OPENAI_IMAGE_ENDPOINT = "https://api.openai.com/v1/images/generations";
const OPENAI_IMAGE_MODEL = process.env.CARDNEWS_GPT_IMAGE_MODEL || process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
const REQUEST_TIMEOUT_MS = 90000;

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "POST") return methodNotAllowed(res);

  const body = requestJson(req);
  if (body.__error) return endJson(res, body.statusCode, { success: false, message: body.message });

  const context = contextFrom(body, req);
  if (!context.ok) return endJson(res, context.statusCode, { success: false, message: context.error });

  const feature = "gpt_integrated_generation";
  if (await hasGenerationSuccess(context, feature)) return limitResponse(res);

  const copy = body.copy || {};
  const planning = body.planning || {};
  const promptUsed = buildOpenAiImagePrompt(planning, copy, body.prompt || copy.gptPrompt || "");
  let imageUrl;
  let provider = "mock-gpt-image";
  let mode = providerMode();
  if (isLiveProviderMode()) {
    try {
      imageUrl = await callOpenAiImage(promptUsed);
      provider = OPENAI_IMAGE_MODEL;
    } catch (error) {
      return endJson(res, 502, { success: false, provider: OPENAI_IMAGE_MODEL, mode, message: safeProviderError(error?.message) });
    }
  } else {
    imageUrl = svgDataUrl();
  }
  const gpt = { ...(body.gpt || {}), used: true, generationUsed: true, imageUrl };

  const saveResult = await recordGenerationSuccess(context, feature, "gpt", { ...body, gpt, currentStep: body.currentStep ?? 3 });
  return endJson(res, 200, {
    success: true,
    provider,
    mode,
    imageUrl,
    promptUsed: body.debugPrompt === true ? promptUsed : undefined,
    saved: saveResult.ok,
    storage: saveResult.source,
  });
};

async function callOpenAiImage(prompt) {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim().replace(/^['"]|['"]$/g, "");
  if (!apiKey) throw new Error("OpenAI API key is not configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(OPENAI_IMAGE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_IMAGE_MODEL,
        prompt: cleanText(prompt, 4000),
        size: process.env.CARDNEWS_GPT_IMAGE_SIZE || "1024x1536",
        quality: process.env.CARDNEWS_GPT_IMAGE_QUALITY || "high",
        output_format: "png",
        n: 1,
      }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(safeProviderError(payload?.error?.message || payload?.message || `OpenAI image API ${response.status}`));
    }
    const b64 = payload?.data?.[0]?.b64_json;
    const url = payload?.data?.[0]?.url;
    if (b64) return `data:image/png;base64,${b64}`;
    if (url) return url;
    throw new Error("OpenAI image response did not include image data");
  } finally {
    clearTimeout(timer);
  }
}

function buildOpenAiImagePrompt(planning = {}, copy = {}, studentPrompt = "") {
  return [
    "Create one complete 9:16 vertical Korean mobile card-news image.",
    "This is NOT a text-free background. Render the Korean title, short body text, information labels, and CTA inside the card-news image.",
    "Design it like a polished educational/public information card-news poster for students: clear hierarchy, readable Korean typography, neat information boxes, friendly but professional visual style.",
    "Use the provided facts only. Do not invent dates, places, prices, schedules, organizations, or unsupported details.",
    "Use a balanced layout: large title area, short body message, 1-2 information panels, official source/link area if provided, and a clear CTA button at the bottom.",
    "Keep Korean text large, simple, high contrast, and easy to read on a mobile screen.",
    "Keep all important objects, text boxes, icons, and characters fully inside the frame. Do not crop faces, icons, or main objects at the edges.",
    "Avoid cluttered decoration. Use relevant visual elements that support the topic.",
    "If the visual brief contains older instructions such as no text, text-free, background only, safe area for later overlay, or HTML/canvas overlay, ignore those older instructions.",
    `Visual brief from prompt design: ${sanitizeGptVisualBrief(studentPrompt)}`,
    `Korean title to render: ${cleanText(copy.title || planning.topic || "뉴스카드", 120)}`,
    `Korean body text to render: ${cleanText(copy.subtitle || planning.message || "", 180)}`,
    `Korean CTA text to render: ${cleanText(copy.cta || "\uc790\uc138\ud788 \ud655\uc778\ud558\uae30", 80)}`,
    `Audience: ${cleanText(planning.audience || "students", 120)}`,
    `Mood: ${cleanText(planning.mood || "bright and reliable", 120)}`,
    `Required facts: ${cleanText(planning.facts || "", 1200)}`,
  ].join("\n");
}

function sanitizeGptVisualBrief(value) {
  const raw = cleanText(value || "", 6000);
  if (!raw) return "";
  const withoutFence = raw.replace(/^```(?:text|markdown)?\s*/i, "").replace(/```$/i, "").trim();
  const imageMatch = withoutFence.match(/IMAGE PROMPT\s*:?\s*([\s\S]*?)(?:\n\s*NEGATIVE PROMPT\s*:|$)/i);
  return cleanText((imageMatch ? imageMatch[1] : withoutFence)
    .replace(/do not render any text[^.\n]*(?:\.|\n)/gi, "")
    .replace(/no Korean letters[^.\n]*(?:\.|\n)/gi, "")
    .replace(/no text[^.\n]*(?:\.|\n)/gi, "")
    .replace(/text-free[^.\n]*(?:\.|\n)/gi, "")
    .replace(/background only[^.\n]*(?:\.|\n)/gi, "")
    .replace(/safe areas? for [^.\n]*(?:\.|\n)/gi, "")
    .replace(/HTML\/canvas overlay[^.\n]*(?:\.|\n)/gi, "")
    .trim(), 1400);
}

function safeProviderError(value) {
  return String(value || "GPT image generation failed")
    .replace(/sk-[\w-]+/g, "[api key hidden]")
    .replace(/sk-proj-[\w-]+/g, "[api key hidden]")
    .replace(/eyJ[\w.-]+/g, "[token hidden]")
    .slice(0, 240);
}

function svgDataUrl() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef6ff"/><stop offset=".52" stop-color="#ffffff"/><stop offset="1" stop-color="#e8fff8"/></linearGradient>
    <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d4ed8"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#102a66" flood-opacity=".18"/></filter>
  </defs>
  <rect width="1080" height="1920" fill="url(#bg)"/>
  <circle cx="860" cy="245" r="250" fill="#7c3aed" opacity=".14"/>
  <circle cx="145" cy="1610" r="320" fill="#14b8a6" opacity=".16"/>
  <rect x="96" y="142" width="888" height="1636" rx="58" fill="#ffffff" opacity=".74" filter="url(#shadow)"/>
  <rect x="150" y="214" width="780" height="430" rx="44" fill="#f8fbff" stroke="#d9e6ff" stroke-width="3"/>
  <path d="M205 542 C320 408 480 402 580 508 C680 612 814 532 888 414" fill="none" stroke="#2457d6" stroke-width="20" stroke-linecap="round" opacity=".24"/>
  <circle cx="292" cy="390" r="76" fill="#14b8a6" opacity=".22"/>
  <circle cx="740" cy="330" r="108" fill="#7c3aed" opacity=".2"/>
  <rect x="150" y="735" width="780" height="370" rx="44" fill="url(#panel)" opacity=".9"/>
  <rect x="212" y="805" width="250" height="44" rx="22" fill="#ffffff" opacity=".28"/>
  <rect x="212" y="882" width="585" height="34" rx="17" fill="#ffffff" opacity=".18"/>
  <rect x="212" y="944" width="452" height="34" rx="17" fill="#ffffff" opacity=".18"/>
  <circle cx="820" cy="945" r="58" fill="#ffffff" opacity=".2"/>
  <rect x="150" y="1200" width="360" height="350" rx="42" fill="#e8f2ff"/>
  <rect x="570" y="1200" width="360" height="350" rx="42" fill="#ecfdf5"/>
  <path d="M236 1452 L320 1310 L420 1452Z" fill="#2457d6" opacity=".34"/>
  <path d="M642 1460 C720 1330 804 1330 880 1460Z" fill="#14b8a6" opacity=".34"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
