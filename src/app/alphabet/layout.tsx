import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { ALL_LETTERS } from "@/data/alphabet";
import { PAGE_KEYWORDS, SITE_URL, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Hangul alifbosi — 한글",
  description:
    `Hangul alifbosining ${ALL_LETTERS.length} ta harfi: 14 undosh, 5 qo‘sh undosh, ` +
    "10 unli va 11 murakkab unli. Har bir harfning lotincha talaffuzi va ovozli o‘qilishi bor.",
  keywords: PAGE_KEYWORDS.alphabet,
  path: "/alphabet",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Hangul alifbosi — 한글",
  url: `${SITE_URL}/alphabet`,
  inLanguage: "uz",
  learningResourceType: "Alifbo darsi",
  educationalLevel: "Beginner",
  teaches: "Hangul harflari va ularning talaffuzi",
  isAccessibleForFree: true,
};

export default function AlphabetLayout({
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
          { name: "Alifbo", path: "/alphabet" },
        ])}
      />
      {children}
    </>
  );
}
