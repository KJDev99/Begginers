import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PAGE_KEYWORDS, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Flashcard — koreys so‘zlarini yodlash",
  description:
    "Leitner tizimi asosida ishlaydigan flashcard takrori: bilmagan so‘zlaringiz " +
    "tez-tez, bilganlari esa kamroq takrorlanadi. Har bir so‘zning ovozli talaffuzi bor.",
  keywords: PAGE_KEYWORDS.flashcard,
  path: "/vocabulary/flashcard",
});

export default function FlashcardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Bosh sahifa", path: "/" },
          { name: "Lug‘at", path: "/vocabulary" },
          { name: "Flashcard", path: "/vocabulary/flashcard" },
        ])}
      />
      {children}
    </>
  );
}
