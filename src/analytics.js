const defaultGoogleAdsId = "AW-18126194689";
const mealPlanSignupSendTo = "AW-18126194689/F4FaCK7eyaUcEIGQn8ND";

const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_ID || defaultGoogleAdsId;
const mealPlanSignupConversionSendTo =
  import.meta.env.VITE_GOOGLE_ADS_MEAL_PLAN_SIGNUP_SEND_TO ||
  mealPlanSignupSendTo;

const mealPlanSignupSessionKey =
  "health_metric_pro_meal_plan_signup_conversion_sent";

let isInitialised = false;
let mealPlanSignupFallbackGuard = false;

function getTagIds() {
  return Array.from(new Set([gaMeasurementId, googleAdsId].filter(Boolean)));
}

function ensureDataLayer() {
  if (typeof window === "undefined") return false;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  return true;
}

function hasSessionGuard(key) {
  if (typeof window === "undefined") return true;

  try {
    return window.sessionStorage.getItem(key) === "true";
  } catch {
    return mealPlanSignupFallbackGuard;
  }
}

function setSessionGuard(key) {
  mealPlanSignupFallbackGuard = true;

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(key, "true");
  } catch {
    // The in-memory guard still prevents duplicate conversions in this tab.
  }
}

export function initialiseAnalytics() {
  if (!ensureDataLayer() || isInitialised) return;

  const tagIds = getTagIds();
  if (tagIds.length === 0) return;

  if (!document.getElementById("google-tag-script")) {
    const script = document.createElement("script");
    script.id = "google-tag-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${tagIds[0]}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());

  if (gaMeasurementId) {
    window.gtag("config", gaMeasurementId, { send_page_view: false });
  }

  if (googleAdsId) {
    window.gtag("config", googleAdsId);
  }

  isInitialised = true;
}

export function trackPageView({ path, title, url }) {
  initialiseAnalytics();

  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: url,
  });
}

export function trackEvent(eventName, parameters = {}) {
  initialiseAnalytics();

  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", eventName, {
    event_category: "health_metric_pro",
    ...parameters,
  });
}

export function trackMealPlanSignup(parameters = {}) {
  trackEvent("meal_plan_signup", {
    event_category: "conversion",
    ...parameters,
  });
}

export function trackMealPlanSignupConversion(parameters = {}) {
  initialiseAnalytics();

  if (hasSessionGuard(mealPlanSignupSessionKey)) return false;

  setSessionGuard(mealPlanSignupSessionKey);
  trackMealPlanSignup(parameters);

  if (typeof window === "undefined" || !window.gtag) return false;

  window.gtag("event", "conversion", {
    send_to: mealPlanSignupConversionSendTo,
    ...parameters,
  });

  return true;
}

export function trackPremiumUpgradeClick(parameters = {}) {
  trackEvent("premium_upgrade_click", {
    transport_type: "beacon",
    ...parameters,
  });
}

export function trackPremiumDownloadOpen(parameters = {}) {
  trackEvent("premium_download_open", {
    transport_type: "beacon",
    ...parameters,
  });
}
