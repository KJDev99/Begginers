import type { MetadataRoute } from "next";

import { GRAMMAR_BASE } from "@/lib/grammar";
import { SITE_URL } from "@/lib/seo";

/**
 * Sayt xaritasi: /sitemap.xml
 * Shaxsiy sahifalar (/add-content, /progress) ataylab kiritilmagan.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/alphabet`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/grammar`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/vocabulary`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${SITE_URL}/vocabulary/flashcard`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Har bir grammatika mavzusi — alohida sahifa
  const grammar: MetadataRoute.Sitemap = GRAMMAR_BASE.map((g) => ({
    url: `${SITE_URL}/grammar/${encodeURIComponent(g.id)}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...pages, ...grammar].map((p) => ({ ...p, lastModified: now }));
}
