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

  const feature = "gpt_integrated_generation";
  if (await hasGenerationSuccess(context, feature)) return limitResponse(res);

  const copy = body.copy || {};
  const planning = body.planning || {};
  const title = cleanText(copy.title || planning.topic || "\ub274\uc2a4\uce74\ub4dc", 120);
  const subtitle = cleanText(copy.subtitle || planning.message || "", 180);
  const cta = cleanText(copy.cta || "\uc790\uc138\ud788 \ubcf4\uae30", 80);
  const imageUrl = svgDataUrl(title, subtitle, cta);
  const gpt = { ...(body.gpt || {}), used: true, generationUsed: true, imageUrl };

  const saveResult = await recordGenerationSuccess(context, feature, "gpt", { ...body, gpt, currentStep: body.currentStep ?? 3 });
  return endJson(res, 200, {
    success: true,
    provider: "mock-gpt-image",
    mode: process.env.CARDNEWS_PROVIDER_MODE || "mock",
    imageUrl,
    saved: saveResult.ok,
    storage: saveResult.source,
  });
};

function svgDataUrl(title, subtitle, cta) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#102a66"/><stop offset="1" stop-color="#2457d6"/></linearGradient></defs>
  <rect width="1080" height="1080" fill="url(#g)"/>
  <circle cx="860" cy="170" r="180" fill="#7c3aed" opacity=".45"/>
  <circle cx="170" cy="900" r="210" fill="#14b8a6" opacity=".45"/>
  <rect x="86" y="118" width="908" height="812" rx="54" fill="#ffffff" opacity=".94"/>
  <text x="140" y="250" font-family="Arial" font-size="76" font-weight="900" fill="#0f172a">${escapeXml(title)}</text>
  <text x="140" y="390" font-family="Arial" font-size="40" font-weight="700" fill="#334155">${escapeXml(subtitle)}</text>
  <rect x="140" y="760" width="620" height="84" rx="42" fill="#2457d6"/>
  <text x="178" y="815" font-family="Arial" font-size="34" font-weight="800" fill="#ffffff">${escapeXml(cta)}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value) {
  return cleanText(value, 160).replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]);
}
