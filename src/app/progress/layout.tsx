import type { Metadata } from "next";

import { PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

// Shaxsiy natijalar sahifasi — indekslanmaydi.
export const metadata: Metadata = buildMetadata({
  title: "Natijalar va yutuqlar",
  description:
    "O‘rganish rivojlanishingiz: o‘zlashtirilgan harflar, yodlangan so‘zlar, " +
    "to‘g‘ri javoblar, XP, kunlik seriya va qo‘lga kiritilgan nishonlar.",
  keywords: PAGE_KEYWORDS.progress,
  path: "/progress",
  noIndex: true,
});

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
