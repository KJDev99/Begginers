import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { ALL_LETTERS } from "@/data/alphabet";
import {
  PAGE_KEYWORDS,
  SITE_URL,
  breadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Koreyscha yozuv mashqi — hangul yozishni o‘rganish",
  description:
    "Hangul harflari va koreyscha so‘zlarni to‘g‘ri yozishni mashq qiling: har bir " +
    "belgi qanday yozilishi jonli ko‘rsatiladi, yozganingiz tekshiriladi va xato " +
    "bo‘lsa qaytadan yozdiriladi. Telefonda barmoq bilan ham ishlaydi.",
  keywords: PAGE_KEYWORDS.writing,
  path: "/writing",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Koreyscha yozuv mashqi",
  url: `${SITE_URL}/writing`,
  inLanguage: ["uz", "ko"],
  learningResourceType: "Mashq",
  educationalLevel: "A1, A2",
  teaches: "Hangul yozuvi va koreyscha so‘zlarni yozish",
  isAccessibleForFree: true,
  numberOfItems: ALL_LETTERS.length,
};

export default function WritingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Bosh sahifa", path: "/" },
          { name: "Yozuv mashqi", path: "/writing" },
        ])}
      />
      {children}
    </>
  );
}
