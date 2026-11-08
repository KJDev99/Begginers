import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { GRAMMAR_BASE } from "@/lib/grammar";
import { PAGE_KEYWORDS, SITE_URL, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Koreys tili grammatikasi",
  description:
    `Koreys tili grammatikasining ${GRAMMAR_BASE.length} ta mavzusi o‘zbek tilida: ` +
    "qo‘shilish qoidalari, dialog va gap misollari, o‘zbekcha muqobillari. " +
    "Daraja, bosh undosh va qidiruv bo‘yicha filtrlanadi.",
  keywords: PAGE_KEYWORDS.grammar,
  path: "/grammar",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LearningResource",
  name: "Koreys tili grammatikasi",
  url: `${SITE_URL}/grammar`,
  inLanguage: "uz",
  learningResourceType: "Grammatika darsligi",
  educationalLevel: "A1, A2, B1, B2",
  teaches: "Koreys tili grammatikasi: kelishiklar, qo‘shimchalar va ifodalar",
  isAccessibleForFree: true,
  numberOfItems: GRAMMAR_BASE.length,
};

export default function GrammarLayout({
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
          { name: "Grammatika", path: "/grammar" },
        ])}
      />
      {children}
    </>
  );
}
