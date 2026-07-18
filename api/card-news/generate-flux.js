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

  const feature = "flux_generation";
  if (await hasGenerationSuccess(context, feature)) return limitResponse(res);

  const planning = body.planning || {};
  const topic = cleanText(planning.topic || "\ub274\uc2a4\uce74\ub4dc", 120);
  const mood = cleanText(planning.mood || "\ubc1d\uace0 \uc2e0\ub8b0\uac10 \uc788\ub294", 120);
  let imageUrl;
  let provider = "mock-flux";
  let mode = providerMode();
  if (isLiveProviderMode()) {
    try {
      imageUrl = await callOpenAiImage(body.prompt || body.copy?.fluxPrompt || buildFluxPrompt(planning), planning, body.copy || {});
      provider = `${OPENAI_IMAGE_MODEL}-as-flux`;
    } catch (error) {
      return endJson(res, 502, { success: false, provider: `${OPENAI_IMAGE_MODEL}-as-flux`, mode, message: safeProviderError(error?.message) });
    }
  } else {
    imageUrl = svgDataUrl();
  }
  const flux = { ...(body.flux || {}), used: true, generationUsed: true, imageUrl };

  const saveResult = await recordGenerationSuccess(context, feature, "flux", { ...body, flux, currentStep: body.currentStep ?? 2 });
  return endJson(res, 200, {
    success: true,
    provider,
    mode,
    imageUrl,
    saved: saveResult.ok,
    storage: saveResult.source,
  });
};

async function callOpenAiImage(prompt, planning = {}, copy = {}) {
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
        prompt: cleanText(buildOpenAiBackgroundPrompt(prompt, planning, copy), 4000),
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

function buildOpenAiBackgroundPrompt(prompt, planning = {}, copy = {}) {
  return [
    "Create one high-quality 9:16 vertical card-news background image using OpenAI image generation.",
    "This image is for the step formerly called Flux, but DO NOT use Flux style. Use rich ChatGPT-style editorial illustration quality.",
    "Important: this version is a text-free visual background. Do not render Korean text, letters, numbers, logos, watermarks, dates, prices, or fake written information inside the image.",
    "Do not make an empty background. Show a meaningful scene with concrete people, action, place, props, depth, lighting, and visual storytelling.",
    "Keep the composition suitable for later human text editing: reserve a clean area near the top or bottom while keeping the scene rich and attractive.",
    `Topic-specific visual direction: ${topicVisualHints(planning, copy)}`,
    `Original student-designed visual prompt: ${sanitizeVisualPrompt(prompt || buildFluxPrompt(planning))}`,
    `Topic: ${cleanText(planning.topic || "news card", 120)}`,
    `Mood: ${cleanText(planning.mood || "bright and reliable", 120)}`,
    `Verified facts to respect visually only: ${cleanText(planning.facts || "", 900)}`,
    "Negative direction: no readable text, no letters, no numbers, no logo, no watermark, no fake brand name, no incorrect information, no distorted faces, no cluttered composition, no sparse blank gradient poster.",
  ].join("\n");
}

function sanitizeVisualPrompt(value) {
  const raw = cleanText(value || "", 5000);
  const withoutFence = raw.replace(/^```(?:text|markdown)?\s*/i, "").replace(/```$/i, "").trim();
  const imageMatch = withoutFence.match(/IMAGE PROMPT\s*:?\s*([\s\S]*?)(?:\n\s*NEGATIVE PROMPT\s*:|$)/i);
  return cleanText(imageMatch ? imageMatch[1] : withoutFence, 1600);
}

function topicVisualHints(planning = {}, copy = {}) {
  const haystack = [
    planning.topic,
    planning.purpose,
    planning.message,
    planning.facts,
    planning.sourceLabel,
    copy.title,
    copy.subtitle,
  ].filter(Boolean).join(" ").toLowerCase();
  if (/공연|문화|예술|아트홀|전시|체험|음악|무대|재단|festival|concert|culture|art|exhibition/.test(haystack)) {
    return "Show a warm cultural event scene: stage curtains, spotlights, music notes, theater/performance icons, art materials, a venue or community arts center, and a smiling family or students enjoying the event. Rich premium Korean public-event illustration style.";
  }
  if (/교육|수업|학생|학교|진로|체험|workshop|class|student|career/.test(haystack)) {
    return "Show students actively participating in a workshop or class, learning tools, tablets, classroom/workshop space, mentor guidance, and clean education-platform visual style.";
  }
  if (/관광|여행|지역|명소|tour|travel|landmark/.test(haystack)) {
    return "Show travelers exploring a local scene, landmark-inspired background, map/travel icons, warm daylight, and polished tourism-card visual style.";
  }
  return "Show a concrete scene with people, action, relevant props, and a meaningful place instead of abstract shapes.";
}

function buildFluxPrompt(planning = {}) {
  return [
    "Create a 9:16 vertical editorial news card background with no text.",
    `Topic: ${cleanText(planning.topic || "news card", 120)}`,
    `Mood: ${cleanText(planning.mood || "bright and reliable", 120)}`,
    "Use clean educational editorial design, clear empty space for Korean title overlays, premium blue and mint accents.",
    "Do not add letters, numbers, logos, dates, prices, names, or fake facts.",
  ].join("\n");
}

function safeProviderError(value) {
  return String(value || "Flux generation failed")
    .replace(/sk-[\w-]+/g, "[api key hidden]")
    .replace(/sk-proj-[\w-]+/g, "[api key hidden]")
    .replace(/nvapi-[\w-]+/g, "[api key hidden]")
    .replace(/eyJ[\w.-]+/g, "[token hidden]")
    .slice(0, 240);
}

function svgDataUrl() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#edf6ff"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#eafff8"/></linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2457d6"/><stop offset="1" stop-color="#14b8a6"/></linearGradient>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="22" stdDeviation="28" flood-color="#102a66" flood-opacity=".16"/></filter>
  </defs>
  <rect width="1080" height="1920" fill="url(#g)"/>
  <circle cx="860" cy="250" r="260" fill="#7c3aed" opacity=".14"/>
  <circle cx="125" cy="1640" r="330" fill="#14b8a6" opacity=".15"/>
  <rect x="90" y="130" width="900" height="1660" rx="62" fill="#ffffff" opacity=".72" filter="url(#s)"/>
  <rect x="150" y="220" width="780" height="430" rx="42" fill="#f8fbff" stroke="#d8e6ff" stroke-width="3"/>
  <circle cx="310" cy="420" r="92" fill="#2457d6" opacity=".2"/>
  <circle cx="470" cy="350" r="52" fill="#14b8a6" opacity=".28"/>
  <path d="M600 510 C660 330 820 305 892 455 C808 495 748 552 600 510Z" fill="#7c3aed" opacity=".2"/>
  <rect x="150" y="1210" width="780" height="390" rx="46" fill="url(#card)" opacity=".88"/>
  <rect x="220" y="1300" width="280" height="48" rx="24" fill="#ffffff" opacity=".24"/>
  <rect x="220" y="1384" width="570" height="34" rx="17" fill="#ffffff" opacity=".16"/>
  <rect x="220" y="1448" width="430" height="34" rx="17" fill="#ffffff" opacity=".16"/>
  <circle cx="815" cy="1438" r="72" fill="#ffffff" opacity=".17"/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
