const defaultGaMeasurementId = "G-4BGXQP1DY4";
const defaultGoogleAdsId = "AW-18126194689";
const mealPlanSignupSendTo = "AW-18126194689/F4FaCK7eyaUcEIGQn8ND";

const gaMeasurementId =
  import.meta.env.VITE_GA_MEASUREMENT_ID || defaultGaMeasurementId;
const googleAdsId = import.meta.env.VITE_GOOGLE_ADS_ID || defaultGoogleAdsId;
const mealPlanSignupConversionSendTo =
  import.meta.env.VITE_GOOGLE_ADS_MEAL_PLAN_SIGNUP_SEND_TO ||
  mealPlanSignupSendTo;

const mealPlanSignupSessionKey =
  "health_metric_pro_meal_plan_signup_conversion_sent";
const premiumTrackingUpdatedEvent =
  "health_metric_pro_premium_tracking_updated";

const premiumTrackingKeys = {
  lastPremiumClickAt: "health_metric_pro_last_premium_click_at",
  lastPremiumRedirectAt: "health_metric_pro_last_premium_redirect_at",
  lastPremiumDownloadClickAt:
    "health_metric_pro_last_premium_download_click_at",
};

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

function logDevelopmentEvent(eventName, parameters = {}) {
  if (!import.meta.env.DEV) return;

  console.info("[Health Metric Pro tracking]", eventName, parameters);
}

function getBrowserStorage(storageName) {
  if (typeof window === "undefined") return null;

  try {
    return window[storageName];
  } catch {
    return null;
  }
}

function writeStorageValue(storage, key, value) {
  if (!storage) return;

  try {
    storage.setItem(key, value);
  } catch {
    // Tracking markers are helpful, but the payment flow should never depend on them.
  }
}

function readStorageValue(storage, key) {
  if (!storage) return "";

  try {
    return storage.getItem(key) || "";
  } catch {
    return "";
  }
}

function writePremiumMarker(key, parameters = {}) {
  if (typeof window === "undefined") return "";

  const timestamp = new Date().toISOString();
  const localStorage = getBrowserStorage("localStorage");
  const sessionStorage = getBrowserStorage("sessionStorage");

  writeStorageValue(localStorage, key, timestamp);
  writeStorageValue(sessionStorage, key, timestamp);

  window.dispatchEvent(
    new CustomEvent(premiumTrackingUpdatedEvent, {
      detail: { key, timestamp, parameters },
    }),
  );

  return timestamp;
}

export function getPremiumTrackingSnapshot() {
  if (typeof window === "undefined") {
    return {
      lastPremiumClickAt: "",
      lastPremiumRedirectAt: "",
      lastPremiumDownloadClickAt: "",
    };
  }

  const localStorage = getBrowserStorage("localStorage");
  const sessionStorage = getBrowserStorage("sessionStorage");

  return {
    lastPremiumClickAt:
      readStorageValue(
        localStorage,
        premiumTrackingKeys.lastPremiumClickAt,
      ) ||
      readStorageValue(
        sessionStorage,
        premiumTrackingKeys.lastPremiumClickAt,
      ),
    lastPremiumRedirectAt:
      readStorageValue(
        localStorage,
        premiumTrackingKeys.lastPremiumRedirectAt,
      ) ||
      readStorageValue(
        sessionStorage,
        premiumTrackingKeys.lastPremiumRedirectAt,
      ),
    lastPremiumDownloadClickAt:
      readStorageValue(
        localStorage,
        premiumTrackingKeys.lastPremiumDownloadClickAt,
      ) ||
      readStorageValue(
        sessionStorage,
        premiumTrackingKeys.lastPremiumDownloadClickAt,
      ),
  };
}

export function subscribeToPremiumTrackingUpdates(callback) {
  if (typeof window === "undefined") return () => {};

  function handleUpdate() {
    callback(getPremiumTrackingSnapshot());
  }

  window.addEventListener(premiumTrackingUpdatedEvent, handleUpdate);

  return () => {
    window.removeEventListener(premiumTrackingUpdatedEvent, handleUpdate);
  };
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
  logDevelopmentEvent(eventName, parameters);

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

export function markPremiumRedirect(parameters = {}) {
  const timestamp = writePremiumMarker(
    premiumTrackingKeys.lastPremiumRedirectAt,
    parameters,
  );

  logDevelopmentEvent("premium_redirect_completed", {
    event_timestamp: timestamp,
    ...parameters,
  });

  return timestamp;
}

export function trackPremiumUpgradeClick(parameters = {}) {
  const timestamp = writePremiumMarker(
    premiumTrackingKeys.lastPremiumClickAt,
    parameters,
  );

  trackEvent("premium_upgrade_click", {
    event_timestamp: timestamp,
    transport_type: "beacon",
    ...parameters,
  });
}

export function trackPremiumDownloadOpen(parameters = {}) {
  const timestamp = writePremiumMarker(
    premiumTrackingKeys.lastPremiumDownloadClickAt,
    parameters,
  );

  trackEvent("premium_download_open", {
    event_timestamp: timestamp,
    transport_type: "beacon",
    ...parameters,
  });
}
