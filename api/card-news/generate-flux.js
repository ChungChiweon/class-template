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

const NVIDIA_FLUX_ENDPOINT = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev";
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
      imageUrl = await callNvidiaFlux(body.prompt || body.copy?.fluxPrompt || buildFluxPrompt(planning), topic, mood);
      provider = "nvidia-flux.1-dev";
    } catch (error) {
      return endJson(res, 502, { success: false, provider: "nvidia-flux.1-dev", mode, message: safeProviderError(error?.message) });
    }
  } else {
    imageUrl = svgDataUrl(topic, mood, false);
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

async function callNvidiaFlux(prompt, topic, mood) {
  const apiKey = String(process.env.CARDNEWS_FLUX_API_KEY || process.env.NVIDIA_API_KEY || "").trim().replace(/^['"]|['"]$/g, "");
  if (!apiKey) throw new Error("Flux API key is not configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(NVIDIA_FLUX_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: cleanText(prompt || buildFluxPrompt({ topic, mood }), 9500),
        height: 1024,
        width: 1024,
        cfg_scale: 5,
        mode: "base",
        samples: 1,
        seed: 0,
        steps: 30,
      }),
      signal: controller.signal,
    });
    const text = await response.text();
    let payload = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = {};
    }
    if (!response.ok) {
      throw new Error(safeProviderError(payload?.detail || payload?.message || payload?.error || `NVIDIA Flux API ${response.status}`));
    }
    return extractImageDataUrl(payload);
  } finally {
    clearTimeout(timer);
  }
}

function extractImageDataUrl(payload) {
  const candidates = [
    payload?.image,
    payload?.b64_json,
    payload?.data?.[0]?.b64_json,
    payload?.data?.[0]?.image,
    payload?.artifacts?.[0]?.base64,
    payload?.artifacts?.[0]?.image,
    payload?.images?.[0],
  ].filter(Boolean);
  const image = String(candidates[0] || "").trim();
  if (!image) throw new Error("Flux image response did not include image data");
  if (image.startsWith("data:image/")) return image;
  return `data:image/png;base64,${image}`;
}

function buildFluxPrompt(planning = {}) {
  return [
    "Create a square 1024x1024 editorial news card background with no text.",
    `Topic: ${cleanText(planning.topic || "news card", 120)}`,
    `Mood: ${cleanText(planning.mood || "bright and reliable", 120)}`,
    "Use clean educational editorial design, clear empty space for Korean title overlays, premium blue and mint accents.",
    "Do not add letters, numbers, logos, dates, prices, names, or fake facts.",
  ].join("\n");
}

function safeProviderError(value) {
  return String(value || "Flux generation failed")
    .replace(/nvapi-[\w-]+/g, "[api key hidden]")
    .replace(/eyJ[\w.-]+/g, "[token hidden]")
    .slice(0, 240);
}

function svgDataUrl(topic, mood, withText) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eaf3ff"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#dcfce7"/></linearGradient>
    <radialGradient id="r" cx=".8" cy=".2" r=".5"><stop offset="0" stop-color="#7c3aed" stop-opacity=".28"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1080" height="1080" fill="url(#g)"/>
  <rect width="1080" height="1080" fill="url(#r)"/>
  <circle cx="145" cy="910" r="220" fill="#14b8a6" opacity=".18"/>
  <rect x="70" y="700" width="940" height="250" rx="42" fill="#102a66" opacity=".08"/>
  <path d="M760 120 C930 180 1010 340 950 520 C875 720 610 665 650 455 C675 320 610 195 760 120Z" fill="#2457d6" opacity=".18"/>
  ${withText ? `<text x="84" y="170" font-family="Arial" font-size="64" font-weight="800" fill="#0f172a">${escapeXml(topic)}</text><text x="84" y="260" font-family="Arial" font-size="32" fill="#334155">${escapeXml(mood)}</text>` : ""}
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value) {
  return cleanText(value, 120).replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]);
}
