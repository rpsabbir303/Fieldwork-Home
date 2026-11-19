export type SiteEvent =
  | "calculator_started"
  | "calculator_completed"
  | "result_printed"
  | "guide_clicked"
  | "search_submitted"
  | "search_no_results";
export function trackEvent(name: SiteEvent, detail: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("fieldwork:analytics", { detail: { name, ...detail } }));
  // No network transport is enabled. A privacy-reviewed adapter can subscribe later.
}
