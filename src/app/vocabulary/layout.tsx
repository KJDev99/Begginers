import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { VOCAB, VOCAB_GROUPS } from "@/data/vocab";
import { PAGE_KEYWORDS, SITE_URL, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Koreyscha–o‘zbekcha lug‘at",
  description:
    `${VOCAB.length} ta koreyscha so‘z o‘zbekcha tarjimasi, lotincha talaffuzi va ovozli ` +
    `o‘qilishi bilan. Mavzular: ${VOCAB_GROUPS.slice(0, 6).join(", ")} va boshqalar.`,
  keywords: PAGE_KEYWORDS.vocabulary,
  path: "/vocabulary",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Koreyscha–o‘zbekcha lug‘at",
  url: `${SITE_URL}/vocabulary`,
  inLanguage: ["uz", "ko"],
  learningResourceType: "Lug‘at",
  educationalLevel: "A1, A2, B1, B2",
  teaches: "Koreys tili so‘z boyligi",
  isAccessibleForFree: true,
  numberOfItems: VOCAB.length,
};

export default function VocabularyLayout({
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
          { name: "Lug‘at", path: "/vocabulary" },
        ])}
      />
      {children}
    </>
  );
}
