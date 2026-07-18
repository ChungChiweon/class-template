module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "POST") return endJson(res, 405, { success: false, message: "POST only" });
  const body = readBody(req);
  const topic = safe(body.planning?.topic || "News card");
  const mood = safe(body.planning?.mood || "bright and reliable");
  return endJson(res, 200, {
    success: true,
    provider: "mock-flux",
    imageUrl: svgDataUrl(topic, mood, false),
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
