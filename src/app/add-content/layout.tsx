import type { Metadata } from "next";

import { PAGE_KEYWORDS, buildMetadata } from "@/lib/seo";

// Shaxsiy vosita — qidiruv tizimlariga keragi yo'q.
export const metadata: Metadata = buildMetadata({
  title: "Yangi ma’lumot qo‘shish",
  description:
    "O‘zingizning grammatika mavzularingiz, so‘zlaringiz va test savollaringizni qo‘shing. " +
    "Hammasi brauzeringizda saqlanadi.",
  keywords: PAGE_KEYWORDS.addContent,
  path: "/add-content",
  noIndex: true,
});

export default function AddContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
