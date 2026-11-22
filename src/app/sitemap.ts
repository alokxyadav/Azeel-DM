
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://azeeldm.com";
  return [
    { url: base,                   changeFrequency: "weekly",  priority: 1,   lastModified: new Date() },
    { url: `${base}/pricing`,      changeFrequency: "weekly",  priority: 0.9, lastModified: new Date() },
    { url: `${base}/features`,     changeFrequency: "monthly", priority: 0.8, lastModified: new Date() },
    { url: `${base}/compare`,      changeFrequency: "monthly", priority: 0.7, lastModified: new Date() },
    { url: `${base}/contact`,      changeFrequency: "yearly",  priority: 0.5, lastModified: new Date() },
    { url: `${base}/terms`,        changeFrequency: "yearly",  priority: 0.3, lastModified: new Date() },
    { url: `${base}/privacy`,      changeFrequency: "yearly",  priority: 0.3, lastModified: new Date() },
  ];
}
