import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

export const proxy = createMiddleware(routing);

export const config = {
  // `.*\..*` catches most static/metadata files (favicon.ico,
  // manifest.webmanifest, ...) since their URL has a real extension, but
  // Next's icon.tsx/apple-icon.tsx file-convention routes are served at
  // extension-less URLs (/icon, /apple-icon) — without excluding them by
  // name too, this proxy intercepted them as page routes and 404'd them.
  matcher: ["/((?!api|trpc|_next|_vercel|icon|apple-icon|.*\\..*).*)"],
};
