const { contextFrom, endJson, methodNotAllowed, recordSubmit, requestJson, setCors } = require("./_shared");

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});
  if (req.method !== "POST") return methodNotAllowed(res);

  const body = requestJson(req);
  if (body.__error) return endJson(res, body.statusCode, { ok: false, message: body.message });

  const context = contextFrom(body, req);
  if (!context.ok) return endJson(res, context.statusCode, { ok: false, message: context.error });

  const selected = String(body.final?.selected || body.final?.selectedMethod || "").trim();
  const image = body.final?.finalImageUrl || (selected === "gpt" ? body.gpt?.imageUrl : body.flux?.finalImage || body.flux?.imageUrl);
  const reflection = String(body.final?.reflection || "").trim();

  if (!selected) return endJson(res, 400, { ok: false, message: "Final method is required" });
  if (!image) return endJson(res, 400, { ok: false, message: "Final image is required" });
  if (!reflection) return endJson(res, 400, { ok: false, message: "Reflection is required" });

  const submittedAt = body.final?.submittedAt || new Date().toISOString();
  const final = { ...(body.final || {}), selected, finalImageUrl: image, submittedAt };
  const result = await recordSubmit(context, { ...body, final, status: "submitted", submittedAt });

  return endJson(res, result.ok ? 200 : 202, {
    ok: result.ok,
    queued: !result.ok,
    source: result.source,
    submittedAt,
    project: result.project,
  });
};
