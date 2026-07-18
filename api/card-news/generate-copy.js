const { cleanText, contextFrom, endJson, methodNotAllowed, requestJson, setCors, upsertProject } = require("./_shared");

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "POST") return methodNotAllowed(res);

  const body = requestJson(req);
  if (body.__error) return endJson(res, body.statusCode, { success: false, message: body.message });

  const context = contextFrom(body, req);
  if (!context.ok) return endJson(res, context.statusCode, { success: false, message: context.error });

  const planning = body.planning || {};
  const design = body.promptDesign || body.prompt || {};
  const topic = cleanText(planning.topic || "\ub274\uc2a4\uce74\ub4dc", 120);
  const audience = cleanText(planning.audience || "\ud559\uc0dd", 120);
  const purpose = cleanText(planning.purpose || "\uc815\ubcf4 \uc804\ub2ec", 120);
  const core = cleanText(planning.message || planning.coreMessage || topic, 160);
  const facts = cleanText(planning.facts || planning.requiredFacts || "\ud655\uc778\ud55c \uc0ac\uc2e4\ub9cc \uc0ac\uc6a9", 1200);
  const mood = cleanText(planning.mood || design.style || "\ubc1d\uace0 \uc2e0\ub8b0\uac10 \uc788\ub294", 120);
  const title = compact(topic, 18);
  const subtitle = compact(core, 34);
  const cta = compact(facts.split(/\n|\.|,/)[0] || "\uc790\uc138\ud788 \uc0b4\ud3b4\ubcf4\uae30", 30);

  const copy = {
    title,
    subtitle,
    cta,
    fluxPrompt: [
      "Create a square 1080x1080 editorial card background with no text.",
      `Topic: ${topic}`,
      `Audience: ${audience}`,
      `Purpose: ${purpose}`,
      `Mood: ${mood}`,
      "Leave clear empty space for title and short copy.",
      "Do not add letters, numbers, logos, or invented facts.",
    ].join("\n"),
    gptPrompt: [
      "Create one square 1080x1080 Korean news card.",
      `Title: ${title}`,
      `Subtitle: ${subtitle}`,
      `CTA: ${cta}`,
      `Audience: ${audience}`,
      `Mood: ${mood}`,
      `Required facts: ${facts}`,
      "Do not invent facts that were not provided.",
      "Make text large, simple, and easy to read on a tablet.",
    ].join("\n"),
  };

  await upsertProject(context, { ...body, copy, currentStep: body.currentStep ?? 1 });
  return endJson(res, 200, { success: true, copy, mode: process.env.CARDNEWS_PROVIDER_MODE || "mock" });
};

function compact(value, max) {
  const text = cleanText(value, 500);
  return text.length > max ? text.slice(0, max) : text;
}
