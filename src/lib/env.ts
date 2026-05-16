// Domain / environment helpers.
// Marketing site lives on root (terriblecoaching.com), authenticated app on app.*.
// The host-routing redirect is feature-flagged off until DNS is wired.

export const APP_HOSTNAME_PREFIX = "app.";

export function isAppHost(host: string = typeof window !== "undefined" ? window.location.hostname : ""): boolean {
  return host.startsWith(APP_HOSTNAME_PREFIX);
}

export function isMarketingHost(host: string = typeof window !== "undefined" ? window.location.hostname : ""): boolean {
  // Anything not on app.* and not a preview/lovable host is marketing.
  if (isAppHost(host)) return false;
  return true;
}

export const HOST_REDIRECT_ENABLED = false; // flip when DNS for app.* is live
