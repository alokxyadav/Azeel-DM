
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://azeeldm.com";
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard", "/campaigns", "/settings", "/billing"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
