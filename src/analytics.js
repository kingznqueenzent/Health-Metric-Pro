const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_ID;

const conversionLabels = {
  meal_plan_signup: import.meta.env.VITE_GOOGLE_ADS_MEAL_PLAN_SIGNUP_LABEL,
  premium_upgrade_click: import.meta.env.VITE_GOOGLE_ADS_PREMIUM_UPGRADE_LABEL,
  premium_download_open: import.meta.env.VITE_GOOGLE_ADS_PREMIUM_DOWNLOAD_LABEL,
};

let isInitialised = false;

function getTagIds() {
  return [gaMeasurementId, googleAdsId].filter(Boolean);
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

  if (!gaMeasurementId || typeof window === "undefined" || !window.gtag) return;

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

export function trackConversion(eventName, parameters = {}) {
  trackEvent(eventName, {
    event_category: "conversion",
    ...parameters,
  });

  const label = conversionLabels[eventName];
  if (!googleAdsId || !label || typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: `${googleAdsId}/${label}`,
    ...parameters,
  });
}

export function trackMealPlanSignup(parameters = {}) {
  trackConversion("meal_plan_signup", parameters);
}

export function trackPremiumUpgradeClick(parameters = {}) {
  trackConversion("premium_upgrade_click", {
    transport_type: "beacon",
    ...parameters,
  });
}

export function trackPremiumDownloadOpen(parameters = {}) {
  trackConversion("premium_download_open", {
    transport_type: "beacon",
    ...parameters,
  });
}
