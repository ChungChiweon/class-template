module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "POST") return endJson(res, 405, { success: false, message: "POST only" });
  const body = readBody(req);
  const planning = body.planning || {};
  const design = body.promptDesign || {};
  const topic = clean(planning.topic || "Our news");
  const core = clean(planning.message || planning.coreMessage || `Join ${topic}`);
  const facts = clean(planning.facts || planning.requiredFacts || "Use checked facts only");
  const mood = clean(planning.mood || "bright and reliable");
  const title = compact(topic, 15);
  const subtitle = compact(core, 28);
  const cta = compact(facts.split(/\n/)[0] || "Learn more", 30);
  return endJson(res, 200, {
    success: true,
    copy: {
      title,
      subtitle,
      cta,
      fluxPrompt: [
        "Create a square 1080x1080 editorial card background with no text.",
        `Topic: ${topic}`,
        `Audience: ${clean(planning.audience || design.audience || "students")}`,
        `Purpose: ${clean(planning.purpose || "information card")}`,
        `Mood: ${mood}`,
        "Leave clear empty space for title and short copy. Do not add letters, numbers, logos, or invented facts.",
      ].join("\n"),
      gptPrompt: [
        "Create one square 1080x1080 news card.",
        `Title: ${title}`,
        `Subtitle: ${subtitle}`,
        `CTA: ${cta}`,
        `Audience: ${clean(planning.audience || "students")}`,
        `Mood: ${mood}`,
        `Required facts: ${facts}`,
        "Do not invent facts that were not provided. Make text large, simple, and easy to read.",
      ].join("\n"),
    },
  });
};

function clean(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 500);
}

function compact(value, max) {
  const text = clean(value);
  return text.length > max ? text.slice(0, max) : text;
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
