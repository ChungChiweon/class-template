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
  const title = cleanText(copy.title || planning.topic || "\ub274\uc2a4\uce74\ub4dc", 120);
  const subtitle = cleanText(copy.subtitle || planning.message || "", 180);
  const cta = cleanText(copy.cta || "\uc790\uc138\ud788 \ubcf4\uae30", 80);
  let imageUrl;
  let provider = "mock-gpt-image";
  let mode = providerMode();
  if (isLiveProviderMode()) {
    try {
      imageUrl = await callOpenAiImage(buildOpenAiImagePrompt(planning, copy, body.prompt));
      provider = OPENAI_IMAGE_MODEL;
    } catch (error) {
      return endJson(res, 502, { success: false, provider: OPENAI_IMAGE_MODEL, mode, message: safeProviderError(error?.message) });
    }
  } else {
    imageUrl = svgDataUrl(title, subtitle, cta);
  }
  const gpt = { ...(body.gpt || {}), used: true, generationUsed: true, imageUrl };

  const saveResult = await recordGenerationSuccess(context, feature, "gpt", { ...body, gpt, currentStep: body.currentStep ?? 3 });
  return endJson(res, 200, {
    success: true,
    provider,
    mode,
    imageUrl,
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
        quality: "low",
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
    "Create one 9:16 vertical mobile card news visual background.",
    "Do not render any text inside the image. No Korean letters, no English letters, no numbers, no logo, no watermark.",
    "Leave clear safe areas for title, subtitle, and CTA text overlays that will be added later in HTML/canvas.",
    "The image should support a school-friendly educational promotion card, clean editorial composition, balanced margins, and contained visual elements.",
    "Keep all important objects fully inside the frame. Do not crop faces, icons, or main objects at the edges.",
    `Visual brief from prompt design: ${cleanText(studentPrompt || "", 1400)}`,
    `Topic: ${cleanText(copy.title || planning.topic || "news card", 120)}`,
    `Core message: ${cleanText(copy.subtitle || planning.message || "", 180)}`,
    `CTA text to reserve space for, but not draw: ${cleanText(copy.cta || "\uc790\uc138\ud788 \ubcf4\uae30", 80)}`,
    `Audience: ${cleanText(planning.audience || "students", 120)}`,
    `Mood: ${cleanText(planning.mood || "bright and reliable", 120)}`,
    `Required facts: ${cleanText(planning.facts || "", 1200)}`,
    "Use no written information in the image itself. Generate background and visual elements only.",
  ].join("\n");
}

function safeProviderError(value) {
  return String(value || "GPT image generation failed")
    .replace(/sk-[\w-]+/g, "[api key hidden]")
    .replace(/sk-proj-[\w-]+/g, "[api key hidden]")
    .replace(/eyJ[\w.-]+/g, "[token hidden]")
    .slice(0, 240);
}

function svgDataUrl(title, subtitle, cta) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#102a66"/><stop offset="1" stop-color="#2457d6"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="url(#g)"/>
  <circle cx="860" cy="260" r="220" fill="#7c3aed" opacity=".45"/>
  <circle cx="170" cy="1620" r="270" fill="#14b8a6" opacity=".45"/>
  <rect x="86" y="160" width="908" height="1480" rx="54" fill="#ffffff" opacity=".94"/>
  <text x="140" y="330" font-family="Arial" font-size="76" font-weight="900" fill="#0f172a">${escapeXml(title)}</text>
  <text x="140" y="500" font-family="Arial" font-size="40" font-weight="700" fill="#334155">${escapeXml(subtitle)}</text>
  <rect x="140" y="1370" width="620" height="96" rx="48" fill="#2457d6"/>
  <text x="178" y="1432" font-family="Arial" font-size="34" font-weight="800" fill="#ffffff">${escapeXml(cta)}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value) {
  return cleanText(value, 160).replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]);
}
