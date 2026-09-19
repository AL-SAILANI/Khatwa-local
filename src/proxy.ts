import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18n = createMiddleware(routing);

/** Cookie next-intl writes when the learner picks a language. */
const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * First-time visitors land in Arabic regardless of their device language:
 * the audience is Saudi students preparing for STEP, and a phone set to
 * English was sending them to the English site by default.
 *
 * `localeDetection: false` would have done this too, but it also switches
 * off the cookie, so a learner who picked English would be forced back to
 * Arabic on every visit. Instead the `accept-language` header is rewritten
 * only while no preference is stored — once the learner chooses, the cookie
 * exists, this branch is skipped, and their choice wins.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has(LOCALE_COOKIE)) {
    const headers = new Headers(request.headers);
    headers.set("accept-language", routing.defaultLocale);
    return handleI18n(new NextRequest(request, { headers }));
  }

  return handleI18n(request);
}

export const config = {
  // `.*\..*` catches most static/metadata files (favicon.ico,
  // manifest.webmanifest, ...) since their URL has a real extension, but
  // Next's icon.tsx/apple-icon.tsx file-convention routes are served at
  // extension-less URLs (/icon, /apple-icon) — without excluding them by
  // name too, this proxy intercepted them as page routes and 404'd them.
  matcher: ["/((?!api|trpc|_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
