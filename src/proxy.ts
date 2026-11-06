import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip api, studio, Next internals and any path with a file extension (icons, images, sitemap.xml...).
  matcher: "/((?!api|studio|_next|.*\\..*).*)",
};
