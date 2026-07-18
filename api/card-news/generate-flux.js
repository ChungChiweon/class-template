const {
  cleanText,
  contextFrom,
  endJson,
  hasGenerationSuccess,
  limitResponse,
  methodNotAllowed,
  recordGenerationSuccess,
  requestJson,
  setCors,
} = require("./_shared");

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
  const imageUrl = svgDataUrl(topic, mood, false);
  const flux = { ...(body.flux || {}), used: true, generationUsed: true, imageUrl };

  const saveResult = await recordGenerationSuccess(context, feature, "flux", { ...body, flux, currentStep: body.currentStep ?? 2 });
  return endJson(res, 200, {
    success: true,
    provider: "mock-flux",
    mode: process.env.CARDNEWS_PROVIDER_MODE || "mock",
    imageUrl,
    saved: saveResult.ok,
    storage: saveResult.source,
  });
};

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
