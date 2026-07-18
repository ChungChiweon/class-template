(function () {
  const COURSE_ID = "cardNews";
  const STEPS = [
    { id: "plan", title: "Topic plan" },
    { id: "prompt", title: "Prompt design" },
    { id: "flux", title: "Flux workflow" },
    { id: "gpt", title: "GPT workflow" },
    { id: "final", title: "Compare and submit" },
  ];
  const DEFAULT_PROJECT = {
    currentStep: 0,
    planning: { topic: "", audience: "", purpose: "", message: "", facts: "", mood: "" },
    prompt: { role: "news card designer", task: "make one square news card", style: "clean school-friendly editorial design", rules: "use only provided facts" },
    copy: { title: "", subtitle: "", cta: "", fluxPrompt: "", gptPrompt: "" },
    flux: { used: false, imageUrl: "", finalImage: "", layers: [{ id: "title", text: "", x: 80, y: 120, size: 58, color: "#0f172a" }, { id: "subtitle", text: "", x: 80, y: 420, size: 36, color: "#1e293b" }, { id: "cta", text: "", x: 80, y: 820, size: 30, color: "#ffffff" }] },
    gpt: { used: false, imageUrl: "" },
    final: { selected: "", reflection: "", submittedAt: "" },
  };
  const dom = {
    stepper: document.querySelector("#stepper"),
    main: document.querySelector("#mainStep"),
    prev: document.querySelector("#prevButton"),
    save: document.querySelector("#saveButton"),
    next: document.querySelector("#nextButton"),
    saveStatus: document.querySelector("#saveStatus"),
    stepStatus: document.querySelector("#stepStatus"),
  };
  if (window.LoreAXTenant?.guardCourseAccess?.(COURSE_ID, { homeUrl: "../../index.html" })?.blocked) return;

  const project = load();
  let saveTimer = null;

  function tenantId() {
    return window.LoreAXTenant?.resolveTenantId?.() || "default";
  }

  function studentId() {
    return window.LoreAXUsage?.getAnonymousStudentId?.() || "anonymous";
  }

  function storageKey() {
    return `loreax:cardNewsProject:${tenantId()}:${studentId()}`;
  }

  function load() {
    try {
      const raw = localStorage.getItem(`loreax:cardNewsProject:${window.LoreAXTenant?.resolveTenantId?.() || "default"}:${window.LoreAXUsage?.getAnonymousStudentId?.() || "anonymous"}`);
      if (!raw) return structuredClone(DEFAULT_PROJECT);
      return merge(structuredClone(DEFAULT_PROJECT), JSON.parse(raw));
    } catch {
      return structuredClone(DEFAULT_PROJECT);
    }
  }

  function merge(base, data) {
    const out = { ...base, ...data };
    ["planning", "prompt", "copy", "flux", "gpt", "final"].forEach((key) => {
      out[key] = { ...base[key], ...(data?.[key] || {}) };
    });
    if (!Array.isArray(out.flux.layers)) out.flux.layers = base.flux.layers;
    return out;
  }

  function save(remote = true) {
    project.updatedAt = new Date().toISOString();
    project.tenantId = tenantId();
    project.anonymousStudentId = studentId();
    localStorage.setItem(storageKey(), JSON.stringify(project));
    dom.saveStatus.textContent = "Saved locally";
    window.LoreAXUsage?.trackActivitySave?.(COURSE_ID, { step: STEPS[project.currentStep].id });
    if (remote) {
      fetch("/api/card-news/save-project", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) }).catch(() => {});
    }
  }

  function debounceSave() {
    dom.saveStatus.textContent = "Saving...";
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 400);
  }

  function esc(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  function field(group, key, label, long = false) {
    const value = project[group][key] || "";
    if (long) return `<label>${label}<textarea data-field="${group}.${key}">${esc(value)}</textarea></label>`;
    return `<label>${label}<input data-field="${group}.${key}" value="${esc(value)}" /></label>`;
  }

  function render() {
    dom.stepStatus.textContent = `${project.currentStep + 1} / 5 steps`;
    dom.prev.disabled = project.currentStep === 0;
    dom.next.textContent = project.currentStep === 4 ? "Submit result" : "Save and continue";
    dom.stepper.innerHTML = STEPS.map((step, index) => `<button class="step-chip ${index === project.currentStep ? "is-active" : ""} ${complete(index) ? "is-done" : ""}" data-step="${index}" type="button"><span>${index + 1}</span><strong>${esc(step.title)}</strong></button>`).join("");
    dom.main.innerHTML = [planView, promptView, fluxView, gptView, finalView][project.currentStep]();
    bind();
    if (project.currentStep === 2) requestAnimationFrame(drawCanvas);
  }

  function complete(index) {
    if (index === 0) return project.planning.topic && project.planning.audience && project.planning.purpose && project.planning.message;
    if (index === 1) return project.copy.title && project.copy.fluxPrompt && project.copy.gptPrompt;
    if (index === 2) return project.flux.finalImage || project.flux.imageUrl;
    if (index === 3) return project.gpt.imageUrl;
    return project.final.selected && project.final.reflection;
  }

  function planView() {
    return `<div class="step-title"><div><span class="badge">Step 1</span><h2>Topic and plan</h2></div></div>
    <div class="layout"><section class="card field-grid">
      <div class="topic-presets">${["School event", "Club recruitment", "Environment campaign", "Local tourism", "Shop promotion", "Safety notice"].map((x) => `<button class="preset-button" data-topic="${x}" type="button">${x}</button>`).join("")}</div>
      ${field("planning", "topic", "Topic")}
      <div class="field-grid two">${field("planning", "audience", "Audience")}${field("planning", "purpose", "Purpose")}</div>
      ${field("planning", "message", "Core message")}
      ${field("planning", "facts", "Required facts", true)}
      ${field("planning", "mood", "Mood")}
    </section><aside class="preview-card"><h3>Plan summary</h3><div class="preview-box">${esc(summary())}</div><p class="notice">Use only facts you have checked. Do not invent dates, places, prices, or names.</p></aside></div>`;
  }

  function promptView() {
    return `<div class="step-title"><div><span class="badge">Step 2</span><h2>Prompt design</h2></div><button id="generateCopy" class="primary-button" type="button">Build copy and prompts</button></div>
    <div class="layout"><section class="card field-grid">
      <div class="field-grid two">${field("prompt", "role", "Role")}${field("prompt", "task", "Task")}</div>
      ${field("prompt", "style", "Visual style")}
      ${field("prompt", "rules", "Output rules", true)}
    </section><aside class="preview-card field-grid">
      ${field("copy", "title", "Title")}
      ${field("copy", "subtitle", "Subtitle")}
      ${field("copy", "cta", "CTA")}
      <h3>Flux prompt</h3><div class="prompt-box">${esc(project.copy.fluxPrompt || "Not generated yet.")}</div>
      <h3>GPT prompt</h3><div class="prompt-box">${esc(project.copy.gptPrompt || "Not generated yet.")}</div>
    </aside></div>`;
  }

  function fluxView() {
    return `<div class="step-title"><div><span class="badge">Step 3</span><h2>Flux-style workflow</h2></div><div class="button-row"><button id="generateFlux" class="primary-button" ${project.flux.used ? "disabled" : ""} type="button">Generate background</button><button id="downloadFlux" class="ghost-button" type="button">Download PNG</button></div></div>
    <div class="canvas-workspace"><div class="canvas-wrap"><canvas id="cardCanvas" width="1080" height="1080"></canvas></div><aside class="card"><p class="notice">This workflow creates a no-text background first, then overlays editable text.</p><div class="layer-list">${project.flux.layers.map(layerView).join("")}</div><div class="button-row"><button id="loadCopy" class="ghost-button" type="button">Load copy</button><button id="resetLayout" class="ghost-button" type="button">Reset layout</button></div></aside></div>`;
  }

  function layerView(layer) {
    return `<div class="layer-item" data-layer="${layer.id}"><label>${layer.id}<textarea data-layer-field="text">${esc(layer.text)}</textarea></label><div class="field-grid two"><label>X<input type="range" min="20" max="900" value="${layer.x}" data-layer-field="x" /></label><label>Y<input type="range" min="20" max="960" value="${layer.y}" data-layer-field="y" /></label><label>Size<input type="range" min="20" max="90" value="${layer.size}" data-layer-field="size" /></label><label>Color<input type="color" value="${layer.color}" data-layer-field="color" /></label></div></div>`;
  }

  function gptView() {
    return `<div class="step-title"><div><span class="badge">Step 4</span><h2>GPT integrated workflow</h2></div><button id="generateGpt" class="primary-button" ${project.gpt.used ? "disabled" : ""} type="button">Generate GPT card</button></div>
    <div class="layout"><section class="card"><h3>Fixed plan</h3><div class="preview-box">${esc(summary())}</div><h3>Integrated prompt</h3><div class="prompt-box">${esc(project.copy.gptPrompt || buildGptPrompt())}</div></section><aside class="preview-card">${project.gpt.imageUrl ? `<img class="result-image" src="${esc(project.gpt.imageUrl)}" alt="GPT result" />` : `<div class="preview-box">No result yet.</div>`}</aside></div>`;
  }

  function finalView() {
    return `<div class="step-title"><div><span class="badge">Step 5</span><h2>Compare and submit</h2></div></div><div class="compare-grid">${resultCard("flux", "Flux + overlay", project.flux.finalImage || project.flux.imageUrl)}${resultCard("gpt", "GPT integrated", project.gpt.imageUrl)}</div><section class="card" style="margin-top:18px">${field("final", "reflection", "Why did you choose this result?", true)}<div class="button-row"><button id="downloadFinal" class="primary-button" type="button">Download final PNG</button><button id="submitProject" class="ghost-button" type="button">Submit result</button></div></section>`;
  }

  function resultCard(method, title, image) {
    return `<article class="result-card ${project.final.selected === method ? "is-selected" : ""}"><h3>${title}</h3>${image ? `<img src="${esc(image)}" alt="${title}" />` : `<div class="preview-box">No result</div>`}<button class="ghost-button" data-select="${method}" ${image ? "" : "disabled"} type="button">Select this</button></article>`;
  }

  function bind() {
    dom.main.querySelectorAll("[data-field]").forEach((input) => input.addEventListener("input", () => {
      const [group, key] = input.dataset.field.split(".");
      project[group][key] = input.value;
      debounceSave();
    }));
    dom.main.querySelectorAll("[data-topic]").forEach((button) => button.addEventListener("click", () => {
      project.planning.topic = button.dataset.topic;
      save(false);
      render();
    }));
    dom.main.querySelector("#generateCopy")?.addEventListener("click", generateCopy);
    dom.main.querySelector("#generateFlux")?.addEventListener("click", generateFlux);
    dom.main.querySelector("#generateGpt")?.addEventListener("click", generateGpt);
    dom.main.querySelector("#loadCopy")?.addEventListener("click", loadCopy);
    dom.main.querySelector("#resetLayout")?.addEventListener("click", resetLayout);
    dom.main.querySelector("#downloadFlux")?.addEventListener("click", () => download(project.flux.finalImage || canvasData(), "flux-card-news.png"));
    dom.main.querySelector("#downloadFinal")?.addEventListener("click", downloadFinal);
    dom.main.querySelector("#submitProject")?.addEventListener("click", submit);
    dom.main.querySelectorAll("[data-select]").forEach((button) => button.addEventListener("click", () => {
      project.final.selected = button.dataset.select;
      save();
      render();
    }));
    dom.main.querySelectorAll("[data-layer-field]").forEach((input) => input.addEventListener("input", () => {
      const layer = project.flux.layers.find((item) => item.id === input.closest("[data-layer]").dataset.layer);
      layer[input.dataset.layerField] = input.type === "range" ? Number(input.value) : input.value;
      debounceSave();
      drawCanvas();
    }));
  }

  async function generateCopy() {
    const data = await post("/api/card-news/generate-copy", { planning: project.planning, promptDesign: project.prompt });
    if (!data) return;
    project.copy = { ...project.copy, ...data.copy };
    loadCopy();
    save();
    render();
  }

  async function generateFlux() {
    if (project.flux.used) return;
    window.LoreAXUsage?.trackAiGenerate?.(COURSE_ID, "flux_generation", { provider: "flux" });
    const data = await post("/api/card-news/generate-flux", { planning: project.planning, prompt: project.copy.fluxPrompt });
    if (!data) return window.LoreAXUsage?.trackAiGenerateResult?.(COURSE_ID, false, { provider: "flux" });
    project.flux.imageUrl = data.imageUrl;
    project.flux.used = true;
    window.LoreAXUsage?.trackAiGenerateResult?.(COURSE_ID, true, { provider: "flux" });
    save();
    render();
  }

  async function generateGpt() {
    if (project.gpt.used) return;
    window.LoreAXUsage?.trackAiGenerate?.(COURSE_ID, "gpt_integrated_generation", { provider: "gpt" });
    const data = await post("/api/card-news/generate-gpt", { planning: project.planning, copy: project.copy, prompt: project.copy.gptPrompt });
    if (!data) return window.LoreAXUsage?.trackAiGenerateResult?.(COURSE_ID, false, { provider: "gpt" });
    project.gpt.imageUrl = data.imageUrl;
    project.gpt.used = true;
    window.LoreAXUsage?.trackAiGenerateResult?.(COURSE_ID, true, { provider: "gpt" });
    save();
    render();
  }

  async function post(url, body) {
    try {
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, tenantId: tenantId(), anonymousStudentId: studentId() }) });
      const data = await response.json();
      if (!response.ok || data.success === false) throw new Error(data.message || "Request failed");
      return data;
    } catch (error) {
      alert(error.message || "Request failed");
      return null;
    }
  }

  function loadCopy() {
    project.flux.layers[0].text = project.copy.title || project.planning.topic;
    project.flux.layers[1].text = project.copy.subtitle || project.planning.message;
    project.flux.layers[2].text = project.copy.cta || "Learn more";
  }

  function resetLayout() {
    project.flux.layers = structuredClone(DEFAULT_PROJECT.flux.layers);
    loadCopy();
    save(false);
    render();
  }

  function buildGptPrompt() {
    return `Make one 1080x1080 news card. Title: ${project.copy.title}. Subtitle: ${project.copy.subtitle}. CTA: ${project.copy.cta}. Use only these facts: ${project.planning.facts}.`;
  }

  function summary() {
    return `Topic: ${project.planning.topic || "-"}\nAudience: ${project.planning.audience || "-"}\nPurpose: ${project.planning.purpose || "-"}\nMessage: ${project.planning.message || "-"}\nFacts: ${project.planning.facts || "-"}\nMood: ${project.planning.mood || "-"}`;
  }

  function drawCanvas() {
    const canvas = document.querySelector("#cardCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 1080, 1080);
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, "#eaf3ff");
    gradient.addColorStop(0.6, "#ffffff");
    gradient.addColorStop(1, "#dffbf2");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "rgba(36,87,214,.18)";
    ctx.beginPath();
    ctx.arc(860, 200, 260, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#102a66";
    ctx.fillRect(0, 850, 1080, 230);
    project.flux.layers.forEach((layer) => {
      if (!layer.text) return;
      ctx.font = `900 ${layer.size}px Arial`;
      ctx.fillStyle = layer.color;
      wrap(ctx, layer.text, layer.x, layer.y, 820, layer.size * 1.25);
    });
    project.flux.finalImage = canvas.toDataURL("image/png");
  }

  function wrap(ctx, text, x, y, max, lineHeight) {
    const words = String(text).split(/\s+/);
    let line = "";
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > max && line) {
        ctx.fillText(line, x, y);
        y += lineHeight;
        line = word;
      } else {
        line = test;
      }
    });
    if (line) ctx.fillText(line, x, y);
  }

  function canvasData() {
    drawCanvas();
    return document.querySelector("#cardCanvas")?.toDataURL("image/png") || "";
  }

  function downloadFinal() {
    const image = project.final.selected === "gpt" ? project.gpt.imageUrl : project.flux.finalImage || canvasData();
    if (!image) return alert("Select a final result first.");
    download(image, "loreax-card-news-final.png");
  }

  function download(dataUrl, filename) {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  function submit() {
    if (!project.final.selected) return alert("Select a final result first.");
    if (!project.final.reflection) return alert("Write a short reflection first.");
    project.final.submittedAt = new Date().toISOString();
    save();
    window.LoreAXUsage?.trackReportSubmit?.(COURSE_ID, { selectedMethod: project.final.selected });
    fetch("/api/card-news/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) }).catch(() => {});
    alert("Submitted.");
  }

  dom.stepper.addEventListener("click", (event) => {
    const button = event.target.closest("[data-step]");
    if (!button) return;
    project.currentStep = Number(button.dataset.step);
    save(false);
    render();
  });
  dom.prev.addEventListener("click", () => {
    project.currentStep = Math.max(0, project.currentStep - 1);
    save();
    render();
  });
  dom.save.addEventListener("click", () => save());
  dom.next.addEventListener("click", () => {
    if (project.currentStep === 4) return submit();
    project.currentStep = Math.min(STEPS.length - 1, project.currentStep + 1);
    save();
    render();
  });

  window.LoreAXTenant?.applyTenantBranding?.();
  window.LoreAXTenant?.applyTenantLinks?.();
  window.LoreAXUsage?.trackCourseOpen?.(COURSE_ID, { page: "card-news" });
  render();
})();
