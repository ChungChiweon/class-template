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
      features: ["기본 수업 포털", "학생 보고서 PDF", "기본 사용량 집계"],
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
      features: ["기관형 전체 패키지", "대규모 강사 운영", "기관별 운영 리포트"],
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
    return enabledIds.includes(courseId);
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
    billingMonth,
    calculateEstimatedBilling,
  };
})();
