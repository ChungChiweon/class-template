const {
  contextFrom,
  endJson,
  getProject,
  methodNotAllowed,
  requestJson,
  setCors,
  upsertProject,
} = require("./_shared");

module.exports = async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return endJson(res, 204, {});

  if (req.method === "GET") {
    const context = contextFrom({}, req);
    if (!context.ok) return endJson(res, context.statusCode, { ok: false, message: context.error });
    const result = await getProject(context);
    if (!result.project) return endJson(res, 404, { ok: false, found: false, source: result.source, message: "Project not found" });
    return endJson(res, 200, { ok: true, found: true, source: result.source, project: result.project });
  }

  if (req.method !== "POST") return methodNotAllowed(res);

  const body = requestJson(req);
  if (body.__error) return endJson(res, body.statusCode, { ok: false, message: body.message });

  const context = contextFrom(body, req);
  if (!context.ok) return endJson(res, context.statusCode, { ok: false, message: context.error });

  const result = await upsertProject(context, body);
  return endJson(res, result.ok ? 200 : 202, {
    ok: result.ok,
    queued: !result.ok,
    source: result.source,
    savedAt: result.project?.updated_at || result.project?.project_data?.updatedAt || new Date().toISOString(),
    project: result.project,
    message: result.ok ? "Saved" : result.error || "Saved locally on server fallback",
  });
};
