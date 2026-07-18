module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "POST") return endJson(res, 405, { success: false, message: "POST only" });
  const body = readBody(req);
  const copy = body.copy || {};
  const planning = body.planning || {};
  return endJson(res, 200, {
    success: true,
    provider: "mock-gpt-image",
    imageUrl: svgDataUrl(copy.title || planning.topic || "News card", copy.subtitle || planning.message || "", copy.cta || ""),
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
  <text x="178" y="815" font-family="Arial" font-size="34" font-weight="800" fill="#ffffff">${escapeXml(cta || "Learn more")}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function safe(value) {
  return String(value || "").trim().slice(0, 80);
}

function escapeXml(value) {
  return safe(value).replace(/[<>&"']/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" })[char]);
}

function readBody(req) {
  try {
    return typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch {
    return {};
  }
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function endJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}
