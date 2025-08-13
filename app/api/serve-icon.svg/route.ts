import { GET as baseGet } from "../serve-icon/route";

// Expose the same icon-serving logic under a path that ends with `.svg` so that
// GitHub and some other proxies that rely on file extensions treat the response
// as an SVG image. All query-string parameters (file, theme, style, size) work
// exactly the same.

export const runtime = "nodejs";

export const GET = baseGet;
