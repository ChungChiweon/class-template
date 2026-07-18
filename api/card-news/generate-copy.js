const { cleanText, contextFrom, endJson, methodNotAllowed, requestJson, setCors, upsertProject } = require("./_shared");

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const REQUEST_TIMEOUT_MS = 60000;

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "POST") return methodNotAllowed(res);

  const body = requestJson(req);
  if (body.__error) return endJson(res, body.statusCode, { success: false, message: body.message });

  const context = contextFrom(body, req);
  if (!context.ok) return endJson(res, context.statusCode, { success: false, message: context.error });

  const planning = sanitizePlanning(body.planning || {});
  const design = sanitizeDesign(body.promptDesign || body.prompt || {}, body.generationMode);
  const metaPrompt = buildMetaPrompt(planning, design);

  let generated;
  try {
    generated = await callOpenAiPromptDesigner(metaPrompt, design.generationMode);
  } catch (error) {
    return endJson(res, 502, {
      success: false,
      message: safeProviderError(error?.message || "\ud504\ub86c\ud504\ud2b8 \uc0dd\uc131\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4."),
      fallbackPrompt: metaPrompt,
    });
  }

  const copy = buildCopy(planning, design, generated, metaPrompt);
  await upsertProject(context, { ...body, copy, prompt: design, currentStep: body.currentStep ?? 1 });
  return endJson(res, 200, { success: true, copy, mode: process.env.CARDNEWS_PROVIDER_MODE || "mock", provider: OPENAI_MODEL });
};

function sanitizePlanning(planning) {
  const facts = planning.facts || (Array.isArray(planning.requiredFacts) ? planning.requiredFacts.join("\n") : planning.requiredFacts) || "\ud655\uc778\ud55c \uc0ac\uc2e4\ub9cc \uc0ac\uc6a9";
  return {
    topic: cleanText(planning.topic || "\uce74\ub4dc\ub274\uc2a4", 160),
    audience: cleanText(planning.audience || "\ud559\uc0dd", 160),
    purpose: cleanText(planning.purpose || "\uc815\ubcf4 \uc804\ub2ec", 200),
    message: cleanText(planning.message || planning.coreMessage || planning.topic || "", 240),
    facts: cleanText(facts, 1600),
    sourceLabel: cleanText(planning.sourceLabel || "", 180),
    sourceUrl: cleanText(planning.sourceUrl || "", 320),
    mood: cleanText(planning.mood || "", 140),
  };
}

function sanitizeDesign(design, bodyMode) {
  const generationMode = bodyMode === "gpt_integrated" || design.generationMode === "gpt_integrated" ? "gpt_integrated" : "flux";
  return {
    generationMode,
    role: cleanText(design.role || "\uce74\ub4dc\ub274\uc2a4 \uae30\ud68d\uc790", 140),
    task: cleanText(design.task || "\uc20f\ud3fc \uce74\ub4dc\ub274\uc2a4 \uc81c\uc791", 180),
    audience: cleanText(design.audience || "", 180),
    context: cleanText(design.context || "", 260),
    format: cleanText(design.format || "9:16 \uc138\ub85c\ud615 \ubaa8\ubc14\uc77c \uce74\ub4dc\ub274\uc2a4", 180),
    style: cleanText(design.style || "\uce5c\uadfc\ud558\uace0 \uc2e0\ub8b0\uac10 \uc788\ub294", 180),
    rules: cleanText(design.rules || "", 1600),
  };
}

async function callOpenAiPromptDesigner(metaPrompt, generationMode) {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim().replace(/^['"]|['"]$/g, "");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: [
              "You are an expert AI image prompt designer for short-form content and card-news production.",
              "Create high-quality prompts for image generation models from the user's planning information.",
              "Do not create fake dates, places, prices, logos, organizations, or facts.",
              "Return JSON only. Do not include markdown.",
              generationMode === "flux"
                ? 'For flux mode, return {"mode":"flux","prompt":"...","negativePrompt":"no text,\\nno letters,\\nno numbers,\\nno logo,\\nno watermark"}.'
                : 'For gpt_integrated mode, return {"mode":"gpt_integrated","prompt":"..."}.',
            ].join("\n"),
          },
          { role: "user", content: metaPrompt },
        ],
        temperature: 0.35,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error?.message || payload?.message || `OpenAI API ${response.status}`);
    const content = payload?.choices?.[0]?.message?.content || "";
    return parseGeneratedPrompt(content, generationMode);
  } finally {
    clearTimeout(timer);
  }
}

function parseGeneratedPrompt(content, generationMode) {
  const text = String(content || "").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const parsed = JSON.parse(text);
  const prompt = cleanText(parsed.prompt || parsed.imagePrompt || "", 7000);
  if (!prompt) throw new Error("Prompt designer response did not include prompt");
  if (generationMode === "flux") {
    return {
      mode: "flux",
      prompt: ensureFluxNoText(prompt),
      negativePrompt: cleanText(parsed.negativePrompt || "no text,\nno letters,\nno numbers,\nno logo,\nno watermark", 800),
    };
  }
  return { mode: "gpt_integrated", prompt: ensureGptTextLayout(prompt) };
}

function buildCopy(planning, design, generated, metaPrompt) {
  const title = compact(planning.topic, 18);
  const subtitle = compact(planning.message || planning.purpose, 34);
  const cta = compact((planning.facts || "").split(/\n|\.|,/)[0] || "\uc790\uc138\ud788 \uc0b4\ud3b4\ubcf4\uae30", 30);
  const base = {
    title,
    subtitle,
    cta,
    metaPrompt,
    generationMode: generated.mode || design.generationMode,
  };
  if (generated.mode === "gpt_integrated") {
    return { ...base, gptPrompt: generated.prompt, fluxPrompt: "", negativePrompt: "" };
  }
  return { ...base, fluxPrompt: generated.prompt, negativePrompt: generated.negativePrompt, gptPrompt: "" };
}

function buildMetaPrompt(planning, design) {
  const modeLabel = design.generationMode === "gpt_integrated" ? "GPT \ud1b5\ud569 \uce74\ub4dc \uc81c\uc791" : "Flux \uc774\ubbf8\uc9c0 \uc0dd\uc131 + \ud14d\uc2a4\ud2b8 \uc624\ubc84\ub808\uc774";
  const modeRules = design.generationMode === "gpt_integrated"
    ? [
        "\uc644\uc131\ud615 \uce74\ub4dc\ub274\uc2a4 \uc81c\uc791 \ubaa9\uc801",
        "\uc81c\ubaa9 \uc704\uce58, \ubcf8\ubb38 \uc704\uce58, CTA \uc704\uce58\ub97c \uc9c0\uc815",
        "\ud14d\uc2a4\ud2b8 \uc704\uacc4\uc640 \ubaa8\ubc14\uc77c \uac00\ub3c5\uc131 \uace0\ub824",
        "\ud55c\uad6d\uc5b4 \ud14d\uc2a4\ud2b8 \ud3ec\ud568 \uc694\uccad",
      ]
    : [
        "\uc774\ubbf8\uc9c0 \uc0dd\uc131\uc6a9 \uc601\ubb38 \uc911\uc2ec \uc0c1\uc138 \ud504\ub86c\ud504\ud2b8 \uc791\uc131",
        "\ud14d\uc2a4\ud2b8 \uc5c6\ub294 \uc774\ubbf8\uc9c0 \uc0dd\uc131 \ubaa9\uc801",
        "9:16 vertical composition",
        "leave clear empty space for text overlay",
        "describe subject, composition, lighting, color, style",
        "do not include written information inside image",
        "negative prompt \uc0dd\uc131",
      ];
  return [
    "\ub108\ub294 AI \uc774\ubbf8\uc9c0 \uc0dd\uc131 \ud504\ub86c\ud504\ud2b8 \uc124\uacc4 \uc804\ubb38\uac00\uc774\uba70, \uc20f\ud3fc \ucf58\ud150\uce20\uc640 \uce74\ub4dc\ub274\uc2a4 \uc81c\uc791 \uc804\ubb38\uac00\uc774\ub2e4.",
    "\uc0ac\uc6a9\uc790\uc758 \uae30\ud68d \uc815\ubcf4\ub97c \ubc14\ud0d5\uc73c\ub85c \uc774\ubbf8\uc9c0 \uc0dd\uc131 \ubaa8\ub378\uc5d0 \uc804\ub2ec\ud560 \uace0\ud488\uc9c8 \ud504\ub86c\ud504\ud2b8\ub97c \uc791\uc131\ud574\ub77c.",
    "",
    `\uc81c\uc791 \ubc29\uc2dd: ${modeLabel}`,
    `\uc5ed\ud560: ${design.role}`,
    `\uacfc\uc5c5: ${design.task}`,
    `\ub300\uc0c1: ${design.audience || planning.audience}`,
    `\ub9e5\ub77d: ${design.context || planning.purpose}`,
    `\ud615\uc2dd: ${design.format}`,
    `\uc2a4\ud0c0\uc77c: ${design.style || planning.mood}`,
    "",
    "\uc218\uc5c5 \uae30\ud68d \uc815\ubcf4:",
    `\uc8fc\uc81c: ${planning.topic}`,
    `\ubaa9\uc801: ${planning.purpose}`,
    `\ud575\uc2ec \uba54\uc2dc\uc9c0: ${planning.message}`,
    `\ud655\uc778\ub41c \uc0ac\uc2e4: ${planning.facts}`,
    planning.sourceLabel ? `\uacf5\uc2dd \ucd9c\ucc98: ${planning.sourceLabel}` : "",
    planning.sourceUrl ? `\uacf5\uc2dd \ub9c1\ud06c: ${planning.sourceUrl}` : "",
    "",
    "\uc0dd\uc131 \uaddc\uce59:",
    design.rules,
    "",
    "\ucd94\uac00 \uc870\uac74:",
    ...modeRules,
    "",
    design.generationMode === "flux"
      ? "JSON\ub9cc \ubc18\ud658: {\"mode\":\"flux\",\"prompt\":\"IMAGE PROMPT:\\n...\",\"negativePrompt\":\"no text,\\nno letters,\\nno numbers,\\nno logo,\\nno watermark\"}"
      : "JSON\ub9cc \ubc18\ud658: {\"mode\":\"gpt_integrated\",\"prompt\":\"IMAGE PROMPT:\\n...\"}",
  ].filter(Boolean).join("\n");
}

function ensureFluxNoText(prompt) {
  const text = cleanText(prompt, 7000);
  return /no text|without text|text-free/i.test(text)
    ? text
    : `${text}\n\nStrict condition: no text, no letters, no numbers, no logo, no watermark, do not include written information inside the image.`;
}

function ensureGptTextLayout(prompt) {
  const text = cleanText(prompt, 7000);
  return /title|CTA|text/i.test(text)
    ? text
    : `${text}\n\nInclude clear Korean title area, body text area, and CTA area with strong mobile readability.`;
}

function safeProviderError(value) {
  return String(value || "\ud504\ub86c\ud504\ud2b8 \uc0dd\uc131 \uc2e4\ud328")
    .replace(/sk-proj-[\w-]+/g, "[api key hidden]")
    .replace(/sk-[\w-]+/g, "[api key hidden]")
    .replace(/eyJ[\w.-]+/g, "[token hidden]")
    .slice(0, 240);
}

function compact(value, max) {
  const text = cleanText(value, 500);
  return text.length > max ? text.slice(0, max) : text;
}
