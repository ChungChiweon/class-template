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
  const contentInfo = sanitizeContentInfo(body.contentInfo || {}, planning);
  if (body.action === "copy_text") {
    let copyText;
    try {
      copyText = await callOpenAiCopyWriter(buildCopyTextPrompt(planning, contentInfo));
    } catch (error) {
      return endJson(res, 502, {
        success: false,
        message: safeProviderError(error?.message || "\ubb38\uad6c \uc0dd\uc131\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4."),
      });
    }
    await upsertProject(context, { ...body, contentInfo, copyText, currentStep: body.currentStep ?? 1 });
    return endJson(res, 200, { success: true, copyText, mode: process.env.CARDNEWS_PROVIDER_MODE || "mock", provider: OPENAI_MODEL });
  }

  const design = sanitizeDesign(body.promptDesign || body.prompt || {}, body.generationMode);
  const copyText = sanitizeCopyText(body.copyText || body.copy || {}, planning);
  const metaPrompt = buildMetaPrompt(planning, contentInfo, copyText, design);

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

  const copy = buildCopy(planning, copyText, design, generated, metaPrompt);
  await upsertProject(context, { ...body, contentInfo, copyText, copy, prompt: design, currentStep: body.currentStep ?? 1 });
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

function sanitizeContentInfo(contentInfo, planning) {
  return {
    officialInfo: cleanText(contentInfo.officialInfo || planning.facts || "", 1600),
    programInfo: cleanText(contentInfo.programInfo || planning.message || "", 900),
    audience: cleanText(contentInfo.audience || planning.audience || "", 240),
    benefits: cleanText(contentInfo.benefits || planning.purpose || "", 900),
    ctaInfo: cleanText(contentInfo.ctaInfo || planning.sourceLabel || planning.sourceUrl || "", 400),
  };
}

function sanitizeCopyText(copyText, planning) {
  return {
    title: cleanText(copyText.title || planning.topic || "", 120),
    body: cleanText(copyText.body || copyText.subtitle || planning.message || "", 360),
    cta: cleanText(copyText.cta || "\uc790\uc138\ud788 \ubcf4\uae30", 120),
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
              "Reflect content purpose, target audience, mobile screen structure, visual composition, image style, and generation constraints.",
              "Do not create fake dates, places, prices, logos, organizations, or facts.",
              "Always return both IMAGE PROMPT and NEGATIVE PROMPT content.",
              "Return JSON only. Do not include markdown.",
              generationMode === "flux"
                ? [
                    'For flux mode, return {"mode":"flux","prompt":"IMAGE PROMPT:\\n...","negativePrompt":"NEGATIVE PROMPT:\\nno readable text,\\nno letters,\\nno numbers,\\nno logo,\\nno watermark,\\nno fake brand name,\\nno incorrect information,\\nno distorted faces,\\nno cluttered composition"}.',
                    "Flux mode is for a meaningful text-free card-news background image, not an empty abstract background.",
                    "The IMAGE PROMPT must follow this order: 1) Main Subject, 2) Scene / Action, 3) Visual Elements, 4) Style, 5) Composition, 6) Text Safe Area.",
                    "Always include concrete people, real actions, relevant places, and related objects when appropriate.",
                    "Prefer visualizable phrases such as students participating in an art workshop, families exploring an exhibition, people creating crafts together.",
                    "Avoid vague-only phrases such as cultural richness, community spirit, creative atmosphere unless they are supported by concrete visible subjects.",
                  ].join("\n")
                : 'For gpt_integrated mode, create a complete 9:16 Korean card-news image prompt for GPT image generation. It may include readable Korean title/body/CTA text requested by the user. Return {"mode":"gpt_integrated","prompt":"IMAGE PROMPT:\\n...","negativePrompt":"NEGATIVE PROMPT:\\nDo not create:\\n- broken or unreadable Korean text\\n- fake dates or information\\n- unnecessary logos\\n- excessive decorative elements"}.',
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

async function callOpenAiCopyWriter(prompt) {
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
              "You are a Korean card-news copywriter for middle and high school classroom projects.",
              "Create concise Korean card-news text only from the provided official information.",
              "Do not invent dates, places, prices, application details, organizations, statistics, or benefits.",
              "Return JSON only: {\"title\":\"...\",\"body\":\"...\",\"cta\":\"...\"}.",
            ].join("\n"),
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.35,
        max_tokens: 500,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error?.message || payload?.message || `OpenAI API ${response.status}`);
    const content = payload?.choices?.[0]?.message?.content || "";
    return parseCopyText(content);
  } finally {
    clearTimeout(timer);
  }
}

function parseCopyText(content) {
  const text = String(content || "").trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const parsed = JSON.parse(text);
  return {
    title: cleanText(parsed.title || "", 120),
    body: cleanText(parsed.body || parsed.subtitle || "", 360),
    cta: cleanText(parsed.cta || "", 120),
  };
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
      negativePrompt: ensureFluxNegative(parsed.negativePrompt),
    };
  }
  return {
    mode: "gpt_integrated",
    prompt: ensureGptIntegratedPrompt(prompt),
    negativePrompt: cleanText(parsed.negativePrompt || gptNegativeDefault(), 1000),
  };
}

function buildCopy(planning, copyText, design, generated, metaPrompt) {
  const title = compact(copyText.title || planning.topic, 30);
  const subtitle = compact(copyText.body || planning.message || planning.purpose, 80);
  const cta = compact(copyText.cta || "\uc790\uc138\ud788 \uc0b4\ud3b4\ubcf4\uae30", 36);
  const base = {
    title,
    subtitle,
    cta,
    metaPrompt,
    generationMode: generated.mode || design.generationMode,
  };
  if (generated.mode === "gpt_integrated") {
    return { ...base, gptPrompt: generated.prompt, fluxPrompt: "", negativePrompt: generated.negativePrompt || gptNegativeDefault() };
  }
  return { ...base, fluxPrompt: generated.prompt, negativePrompt: generated.negativePrompt, gptPrompt: "" };
}

function buildMetaPrompt(planning, contentInfo, copyText, design) {
  const modeLabel = design.generationMode === "gpt_integrated" ? "GPT \ud1b5\ud569 \uce74\ub4dc \uc81c\uc791" : "Flux \uc758\ubbf8 \uc788\ub294 \uae00\uc790 \uc5c6\ub294 \uc774\ubbf8\uc9c0 \uc0dd\uc131";
  const modeRules = design.generationMode === "gpt_integrated"
    ? [
        "GPT \uc774\ubbf8\uc9c0 \uc0dd\uc131\uc6a9 9:16 \uc644\uc131\ud615 \uce74\ub4dc\ub274\uc2a4 \uc81c\uc791 \ubaa9\uc801",
        "\uc81c\ubaa9, \ubcf8\ubb38, CTA \ud14d\uc2a4\ud2b8\ub97c \uc774\ubbf8\uc9c0 \uc548\uc5d0 \uc77d\uae30 \uc27d\uac8c \ubc30\uce58",
        "\ud55c\uae00 \ud0c0\uc774\ud3ec\uadf8\ub798\ud53c\ub97c \ud06c\uace0 \ub2e8\uc21c\ud558\uac8c \uc0ac\uc6a9",
        "\ud14d\uc2a4\ud2b8\uac00 \uc798\ub9ac\uc9c0 \uc54a\ub3c4\ub85d \uc5ec\ubc31\uacfc \uc548\uc804 \uc601\uc5ed \ud655\ubcf4",
        "\uc790\uc5f0\uc5b4 \ud615\ud0dc\uc758 negative prompt \uc0dd\uc131",
        "Do not create broken Korean text, fake dates or information, unnecessary logos, unreadable typography, excessive decorative elements.",
      ]
    : [
        "\ud14d\uc2a4\ud2b8\uac00 \uc5c6\uc9c0\ub9cc \uc8fc\uc81c\uac00 \ubcf4\uc774\ub294 \uce74\ub4dc\ub274\uc2a4 \ubc30\uacbd \uc774\ubbf8\uc9c0 \uc0dd\uc131 \ubaa9\uc801",
        "\ube48 \ubc30\uacbd\uc774 \uc544\ub2c8\ub77c \uc8fc\uc81c\uc640 \uad00\ub828\ub41c \uad6c\uccb4\uc801\uc778 \uc0ac\ub78c, \ud589\ub3d9, \uacf5\uac04, \uc18c\ud488\uc744 \ubc18\ub4dc\uc2dc \ud3ec\ud568",
        "Prompt order: Main Subject -> Scene / Action -> Visual Elements -> Style -> Composition -> Text Safe Area -> Negative Prompt",
        "Main Subject: identify the concrete subject related to the topic",
        "Scene / Action: show people doing a real activity in a relevant place",
        "Visual Elements: include related objects, tools, props, environment details",
        "Style: describe photo / illustration / graphic style, lighting, color, mood",
        "Composition: 9:16 vertical card-news composition with the main scene clearly visible",
        "Text Safe Area: Reserve a clean area for text overlay while maintaining a rich visual scene. Do not empty the whole image.",
        "Avoid vague-only abstract phrases. Convert abstract ideas into visible people, actions, places, and objects.",
        "For culture/education topics, prefer students, families, classrooms, workshops, creative activities, exhibition spaces, and art materials when relevant.",
        "For tourism topics, prefer landmarks, travelers, local scenery, cultural experiences.",
        "For promotion topics, prefer products, customers, business scenes.",
        "For career topics, prefer students, career exploration, professional environments.",
        "Negative prompt \uc0dd\uc131",
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
    "\uacf5\uc2dd \uc790\ub8cc \uae30\ubc18 \ucf58\ud150\uce20 \uc815\ubcf4:",
    `\uacf5\uc2dd \uc790\ub8cc \ud655\uc778 \ub0b4\uc6a9: ${contentInfo.officialInfo}`,
    `\ud575\uc2ec \ud504\ub85c\uadf8\ub7a8 \ub0b4\uc6a9: ${contentInfo.programInfo}`,
    `\ub300\uc0c1 \uc0ac\uc6a9\uc790: ${contentInfo.audience}`,
    `\uc8fc\uc694 \ud2b9\uc9d5/\ud61c\ud0dd: ${contentInfo.benefits}`,
    `\uc2e0\uccad \ubc29\ubc95/CTA \uc815\ubcf4: ${contentInfo.ctaInfo}`,
    "",
    "\uce74\ub4dc\ub274\uc2a4\uc5d0 \uc0ac\uc6a9\ud560 \ud655\uc815 \ubb38\uad6c:",
    `\uc81c\ubaa9: ${copyText.title}`,
    `\ubcf8\ubb38: ${copyText.body}`,
    `\ud589\ub3d9 \uc720\ub3c4 \ubb38\uad6c: ${copyText.cta}`,
    "",
    "\uc0dd\uc131 \uaddc\uce59:",
    design.rules,
    "",
    "\ucd94\uac00 \uc870\uac74:",
    ...modeRules,
    "",
    design.generationMode === "flux"
      ? "JSON\ub9cc \ubc18\ud658: {\"mode\":\"flux\",\"prompt\":\"IMAGE PROMPT:\\nMain Subject: ...\\nScene / Action: ...\\nVisual Elements: ...\\nStyle: ...\\nComposition: ...\\nText Safe Area: ...\",\"negativePrompt\":\"no readable text,\\nno letters,\\nno numbers,\\nno logo,\\nno watermark,\\nno fake brand name,\\nno incorrect information,\\nno distorted faces,\\nno cluttered composition\"}"
      : "JSON\ub9cc \ubc18\ud658: {\"mode\":\"gpt_integrated\",\"prompt\":\"IMAGE PROMPT:\\n...\",\"negativePrompt\":\"NEGATIVE PROMPT:\\nDo not create:\\n- broken or unreadable Korean text\\n- fake dates or information\\n- unnecessary logos\\n- excessive decorative elements\"}",
  ].filter(Boolean).join("\n");
}

function buildCopyTextPrompt(planning, contentInfo) {
  return [
    "\ub2e4\uc74c \uacf5\uc2dd \uc815\ubcf4\ub97c \uae30\ubc18\uc73c\ub85c 9:16 \uce74\ub4dc\ub274\uc2a4\uc5d0 \ub4e4\uc5b4\uac08 \ubb38\uad6c\ub97c \uc791\uc131\ud574\ub77c.",
    "\uc774\ubbf8\uc9c0 \uc0dd\uc131 \ud504\ub86c\ud504\ud2b8\uac00 \uc544\ub2c8\ub77c, \ud654\uba74\uc5d0 \uc62c\ub9b4 \ud14d\uc2a4\ud2b8\ub9cc \uc124\uacc4\ud55c\ub2e4.",
    "\ud655\uc778\ub418\uc9c0 \uc54a\uc740 \ub0a0\uc9dc, \uc7a5\uc18c, \ube44\uc6a9, \uc2e0\uccad \uc138\ubd80 \uc815\ubcf4\ub294 \uc784\uc758\ub85c \ub9cc\ub4e4\uc9c0 \ub9c8.",
    "",
    `\uc8fc\uc81c: ${planning.topic}`,
    `\ubaa9\uc801: ${planning.purpose}`,
    `\ud575\uc2ec \uba54\uc2dc\uc9c0: ${planning.message}`,
    `\uacf5\uc2dd \uc790\ub8cc \ud655\uc778 \ub0b4\uc6a9: ${contentInfo.officialInfo}`,
    `\ud575\uc2ec \ud504\ub85c\uadf8\ub7a8 \ub0b4\uc6a9: ${contentInfo.programInfo}`,
    `\ub300\uc0c1 \uc0ac\uc6a9\uc790: ${contentInfo.audience}`,
    `\uc8fc\uc694 \ud2b9\uc9d5/\ud61c\ud0dd: ${contentInfo.benefits}`,
    `\uc2e0\uccad \ubc29\ubc95/CTA \uc815\ubcf4: ${contentInfo.ctaInfo}`,
    "",
    "\ucd9c\ub825 JSON:",
    "{",
    "  \"title\": \"18\uc790 \ub0b4\uc678\uc758 \uce74\ub4dc\ub274\uc2a4 \uc81c\ubaa9\",",
    "  \"body\": \"2\ubb38\uc7a5 \uc774\ub0b4\uc758 \uc26c\uc6b4 \ubcf8\ubb38\",",
    "  \"cta\": \"\ud589\ub3d9\uc744 \uc720\ub3c4\ud558\ub294 \uc9e7\uc740 \ubb38\uad6c\"",
    "}",
  ].join("\n");
}

function ensureFluxNoText(prompt) {
  const text = cleanText(prompt, 7000);
  const safeArea = /Text Safe Area|text overlay|safe area/i.test(text)
    ? ""
    : "\n\nText Safe Area: Reserve a clean area for text overlay while maintaining a rich visual scene. Do not empty the whole image.";
  const noReadableText = /no readable text|without readable text|text-free/i.test(text)
    ? ""
    : "\n\nStrict condition: no readable text, no letters, no numbers, no logo, no watermark.";
  return `${text}${safeArea}${noReadableText}`;
}

function ensureFluxNegative(value) {
  const text = cleanText(value || "", 1000);
  const required = ["no readable text", "no letters", "no numbers", "no logo", "no watermark", "no fake brand name", "no incorrect information", "no distorted faces", "no cluttered composition"];
  const merged = ["NEGATIVE PROMPT:", text, ...required.filter((item) => !text.toLowerCase().includes(item))].filter(Boolean).join("\n");
  return cleanText(merged, 1200);
}

function ensureGptIntegratedPrompt(prompt) {
  const text = cleanText(prompt, 7000);
  return /Korean|한글|title|제목|CTA|card-news|카드뉴스/i.test(text)
    ? text
    : `${text}\n\nCreate a complete 9:16 Korean card-news image with readable title, short body text, and CTA text. Keep Korean typography large, simple, and legible.`;
}

function gptNegativeDefault() {
  return "NEGATIVE PROMPT:\nDo not create:\n- broken or unreadable Korean text\n- fake dates or information\n- unnecessary logos\n- excessive decorative elements";
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
