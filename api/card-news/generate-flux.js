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

const NVIDIA_FLUX_MODEL = process.env.CARDNEWS_FLUX_MODEL || "flux.1-dev";
const NVIDIA_FLUX_ENDPOINT = `https://ai.api.nvidia.com/v1/genai/black-forest-labs/${NVIDIA_FLUX_MODEL}`;
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
      provider = `nvidia-${NVIDIA_FLUX_MODEL}`;
    } catch (error) {
      return endJson(res, 502, { success: false, provider: `nvidia-${NVIDIA_FLUX_MODEL}`, mode, message: safeProviderError(error?.message) });
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
        height: Number(process.env.CARDNEWS_FLUX_HEIGHT || process.env.CARDNEWS_FLUX_SIZE || 1344),
        width: Number(process.env.CARDNEWS_FLUX_WIDTH || 768),
        cfg_scale: Number(process.env.CARDNEWS_FLUX_CFG_SCALE || 3.5),
        mode: "base",
        samples: 1,
        seed: 0,
        steps: Number(process.env.CARDNEWS_FLUX_STEPS || 5),
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
  const mime = image.startsWith("/9j/") ? "image/jpeg" : image.startsWith("iVBOR") ? "image/png" : "image/png";
  return `data:${mime};base64,${image}`;
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
