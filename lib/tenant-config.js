(function () {
  const TENANT_STORAGE_KEY = "loreax:tenantId";
  const DEFAULT_TENANT_ID = "default";

  const plans = [
    {
      id: "starter",
      name: "Starter",
      setupFee: 990000,
      monthlyBaseFee: 150000,
      includedLearners: 50,
      overagePrice: 3000,
      includedCourseCount: 5,
      maxTeacherCount: 3,
      monthlyAiQuotaPerLearner: 10,
      monthlyPdfQuotaPerLearner: 3,
      features: ["기본 수업 패키지", "학생 보고서 PDF", "기본 사용량 집계"],
    },
    {
      id: "business",
      name: "Business",
      setupFee: 1990000,
      monthlyBaseFee: 290000,
      includedLearners: 150,
      overagePrice: 2500,
      includedCourseCount: 999,
      maxTeacherCount: 10,
      monthlyAiQuotaPerLearner: 15,
      monthlyPdfQuotaPerLearner: 5,
      features: ["전체 수업 패키지", "확장 사용량 집계", "강사 계정 확장"],
    },
    {
      id: "institution",
      name: "Institution",
      setupFee: 3000000,
      monthlyBaseFee: 600000,
      includedLearners: 300,
      overagePrice: 2000,
      includedCourseCount: 999,
      maxTeacherCount: 50,
      monthlyAiQuotaPerLearner: 20,
      monthlyPdfQuotaPerLearner: 10,
      features: ["기관용 전체 패키지", "대규모 강사 운영", "기관별 운영 리포트"],
    },
  ];

  const tenants = [
    {
      id: "default",
      slug: "default",
      name: "LoreAX Class",
      displayName: "LoreAX Class",
      logoUrl: "/assets/brand/logo.svg",
      primaryColor: "#2348d8",
      status: "active",
      planId: "starter",
      enabledCourseIds: [],
      includedLearners: 50,
      overagePrice: 3000,
      monthlyAiQuotaPerLearner: 10,
      monthlyPdfQuotaPerLearner: 3,
      billingCycle: "monthly",
      createdAt: "2026-07-17",
      updatedAt: "2026-07-17",
    },
    {
      id: "academy-a",
      slug: "academy-a",
      name: "아카데미 A",
      displayName: "아카데미 A AI 클래스",
      logoUrl: "/assets/brand/logo.svg",
      primaryColor: "#3156D3",
      status: "active",
      planId: "starter",
      enabledCourseIds: ["dataAnalysisReport", "hotelPromo", "localEventShorts", "careerRecordActivity", "scienceCsPrep", "cardNews"],
      includedLearners: 50,
      overagePrice: 3000,
      monthlyAiQuotaPerLearner: 10,
      monthlyPdfQuotaPerLearner: 3,
      billingCycle: "monthly",
      createdAt: "2026-07-17",
      updatedAt: "2026-07-17",
    },
    {
      id: "academy-b",
      slug: "academy-b",
      name: "아카데미 B",
      displayName: "아카데미 B 융합 교육관",
      logoUrl: "/assets/brand/logo.svg",
      primaryColor: "#7C3AED",
      status: "active",
      planId: "business",
      enabledCourseIds: ["*"],
      includedLearners: 150,
      overagePrice: 2500,
      monthlyAiQuotaPerLearner: 15,
      monthlyPdfQuotaPerLearner: 5,
      billingCycle: "monthly",
      createdAt: "2026-07-17",
      updatedAt: "2026-07-17",
    },
  ];

  function readTenantIdFromUrl() {
    try {
      return new URLSearchParams(window.location.search).get("tenant") || "";
    } catch {
      return "";
    }
  }

  function readStoredTenantId() {
    try {
      return window.localStorage.getItem(TENANT_STORAGE_KEY) || "";
    } catch {
      return "";
    }
  }

  function writeStoredTenantId(tenantId) {
    try {
      if (tenantId) window.localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
    } catch {
      // Tenant persistence is optional.
    }
  }

  function resolveTenantId(input) {
    const requested = String(input || readTenantIdFromUrl() || readStoredTenantId() || DEFAULT_TENANT_ID).trim();
    const found = tenants.find((tenant) => tenant.id === requested || tenant.slug === requested);
    const resolved = found?.id || DEFAULT_TENANT_ID;
    writeStoredTenantId(resolved);
    return resolved;
  }

  function getCurrentTenant(input) {
    const tenantId = resolveTenantId(input);
    return tenants.find((tenant) => tenant.id === tenantId) || tenants[0];
  }

  function setCurrentTenant(tenantId) {
    const resolved = resolveTenantId(tenantId);
    writeStoredTenantId(resolved);
    return getCurrentTenant(resolved);
  }

  function clearCurrentTenant() {
    try {
      window.localStorage.removeItem(TENANT_STORAGE_KEY);
    } catch {
      // Optional.
    }
    return getCurrentTenant(DEFAULT_TENANT_ID);
  }

  function getPlan(planId) {
    return plans.find((plan) => plan.id === planId) || plans[0];
  }

  function isDefaultTenant(tenant) {
    return !tenant || tenant.id === DEFAULT_TENANT_ID;
  }

  function isCourseEnabledForTenant(courseId, tenantId) {
    const tenant = getCurrentTenant(tenantId);
    const enabledIds = Array.isArray(tenant.enabledCourseIds) ? tenant.enabledCourseIds : [];
    if (isDefaultTenant(tenant) && !enabledIds.length) return true;
    if (enabledIds.includes("*")) return true;
    return enabledIds.includes(courseId);
  }

  function tenantUrl(url, tenantId) {
    const raw = String(url || "").trim();
    if (!raw) return "";
    const resolvedTenantId = resolveTenantId(tenantId);
    try {
      const base = window.location.origin || "https://class-template.vercel.app";
      const parsed = new URL(raw, base);
      parsed.searchParams.set("tenant", resolvedTenantId);
      if (/^https?:\/\//i.test(raw)) return parsed.toString();
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      const separator = raw.includes("?") ? "&" : "?";
      return `${raw}${separator}tenant=${encodeURIComponent(resolvedTenantId)}`;
    }
  }

  function colorMix(hex, alpha = 0.14) {
    const value = String(hex || "#2348d8").replace("#", "");
    if (value.length !== 6) return "rgba(35, 72, 216, 0.14)";
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function applyTenantBranding(root = document.documentElement, tenantId) {
    const tenant = getCurrentTenant(tenantId);
    const primary = tenant.primaryColor || "#2348d8";
    root.style.setProperty("--tenant-primary", primary);
    root.style.setProperty("--tenant-primary-dark", primary);
    root.style.setProperty("--tenant-primary-soft", colorMix(primary, 0.14));
    root.style.setProperty("--primary", primary);
    return tenant;
  }

  function applyTenantLinks(root = document) {
    const tenant = getCurrentTenant();
    root.querySelectorAll?.("a[href]")?.forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (/^https?:\/\//i.test(href) && !href.startsWith(window.location.origin)) return;
      anchor.setAttribute("href", tenantUrl(href, tenant.id));
    });
  }

  function renderAccessDenied({ courseId, tenantId, homeUrl } = {}) {
    const tenant = getCurrentTenant(tenantId);
    const destination = homeUrl ? tenantUrl(homeUrl, tenant.id) : tenantUrl("/index.html", tenant.id);
    document.body.innerHTML = `
      <main style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#f6f8fc;font-family:'Pretendard','Noto Sans KR',system-ui,sans-serif;color:#111827;">
        <section style="width:min(560px,100%);padding:32px;border:1px solid #dce6f3;border-radius:24px;background:#fff;box-shadow:0 18px 50px rgba(15,35,70,.1);">
          <p style="margin:0 0 8px;color:${tenant.primaryColor || "#2348d8"};font-weight:800;">수업 접근 안내</p>
          <h1 style="margin:0 0 12px;font-size:30px;line-height:1.15;">이 기관에서 이용할 수 없는 수업입니다.</h1>
          <p style="margin:0 0 20px;color:#667085;line-height:1.7;">현재 선택된 업체는 ${tenant.displayName || tenant.name}입니다. 허용된 수업 목록에서 다시 선택해 주세요.</p>
          <a href="${destination}" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:14px;background:${tenant.primaryColor || "#2348d8"};color:#fff;text-decoration:none;font-weight:800;">업체 홈으로 돌아가기</a>
        </section>
      </main>`;
    return { blocked: true, tenant, courseId };
  }

  function guardCourseAccess(courseId, options = {}) {
    const tenant = getCurrentTenant(options.tenantId);
    applyTenantBranding(document.documentElement, tenant.id);
    if (isCourseEnabledForTenant(courseId, tenant.id)) return { allowed: true, tenant };
    return renderAccessDenied({ courseId, tenantId: tenant.id, homeUrl: options.homeUrl });
  }

  function getTenantEnabledCourses(courses = [], tenantId) {
    const tenant = getCurrentTenant(tenantId);
    return courses.filter((course) => {
      if (!course || course.status !== "active") return false;
      return isCourseEnabledForTenant(course.id, tenant.id);
    });
  }

  function getTenantFeaturedCourses(courses = [], tenantId) {
    return getTenantEnabledCourses(courses, tenantId).filter((course) => course.featured);
  }

  function getTenantTodayCourse(courses = [], tenantId) {
    const enabled = getTenantEnabledCourses(courses, tenantId);
    return enabled.find((course) => course.isToday) || enabled[0] || null;
  }

  function billingMonth(date = new Date()) {
    return date.toISOString().slice(0, 7);
  }

  function calculateEstimatedBilling(plan, usage = {}) {
    const activeLearners = Number(usage.activeLearners || 0);
    const includedLearners = Number(plan?.includedLearners || 0);
    const overagePrice = Number(plan?.overagePrice || 0);
    const baseFee = Number(plan?.monthlyBaseFee || 0);
    const overageLearners = Math.max(0, activeLearners - includedLearners);
    const overageFee = overageLearners * overagePrice;
    return {
      baseFee,
      includedLearners,
      activeLearners,
      overageLearners,
      overagePrice,
      overageFee,
      estimatedTotal: baseFee + overageFee,
    };
  }

  window.LoreAXTenant = {
    plans,
    tenants,
    defaultTenantId: DEFAULT_TENANT_ID,
    storageKey: TENANT_STORAGE_KEY,
    resolveTenantId,
    getCurrentTenant,
    setCurrentTenant,
    clearCurrentTenant,
    getPlan,
    isCourseEnabledForTenant,
    getTenantEnabledCourses,
    getTenantFeaturedCourses,
    getTenantTodayCourse,
    tenantUrl,
    applyTenantBranding,
    applyTenantLinks,
    guardCourseAccess,
    billingMonth,
    calculateEstimatedBilling,
  };
})();
