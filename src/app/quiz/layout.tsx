import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PAGE_KEYWORDS, SITE_URL, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Koreys tili testlari",
  description:
    "Koreys tili bo‘yicha uch xil test: koreyschadan o‘zbekchaga tarjima, " +
    "o‘zbekchadan koreyschaga tarjima va tinglab topish. Daraja va savollar sonini tanlang.",
  keywords: PAGE_KEYWORDS.quiz,
  path: "/quiz",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "Koreys tili testlari",
  url: `${SITE_URL}/quiz`,
  inLanguage: "uz",
  educationalLevel: "A1, A2, B1, B2",
  about: "Koreys tili lug‘ati va talaffuzi",
  isAccessibleForFree: true,
  assesses: "Koreys tili so‘z boyligi va tinglab tushunish",
};

export default function QuizLayout({
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
          { name: "Testlar", path: "/quiz" },
        ])}
      />
      {children}
    </>
  );
}
