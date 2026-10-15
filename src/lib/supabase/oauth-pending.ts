/** Set just before the browser leaves for Google so the return trip is recognised. */
export const OAUTH_PENDING_KEY = "khatwa.oauth-pending";
export const OAUTH_PENDING_TTL_MS = 5 * 60 * 1000;

export function markOAuthPending() {
  try {
    sessionStorage.setItem(OAUTH_PENDING_KEY, String(Date.now()));
  } catch {
    // storage unavailable: the URL params still identify the return
  }
}
