import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { GRAMMAR_BASE } from "@/lib/grammar";
import { CAT } from "@/lib/korean";
import {
  PAGE_KEYWORDS,
  SITE_URL,
  breadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";
import { GrammarDetail } from "./GrammarDetail";

type Props = { params: Promise<{ id: string }> };

/** HTML teglarini olib tashlab, toza tavsif matnini qaytaradi. */
const plainText = (s: string) =>
  s
    .replace(/<[^>]*>/g, "")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/** Barcha grammatika sahifalarini oldindan tayyorlaymiz (statik HTML). */
export function generateStaticParams() {
  return GRAMMAR_BASE.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const g = GRAMMAR_BASE.find((x) => x.id === decodeURIComponent(id));

  if (!g) {
    return buildMetadata({
      title: "Grammatika mavzusi topilmadi",
      description: "Bunday grammatika mavzusi mavjud emas.",
      path: `/grammar/${id}`,
      noIndex: true,
    });
  }

  const meaning = plainText(g.m);
  const uz = g.u ? " O‘zbekcha muqobili: " + plainText(g.u) : "";
  const description = `${g.f} — ${meaning}${uz}`.slice(0, 300);

  return buildMetadata({
    title: `${g.f} — koreys tili grammatikasi (${g.l})`,
    description,
    keywords: [
      g.f,
      `${g.f} grammatikasi`,
      `${g.f} qoidasi`,
      `koreys tili ${g.f}`,
      CAT[g.c] || g.c,
      `koreys grammatikasi ${g.l}`,
      ...PAGE_KEYWORDS.grammar,
    ],
    path: `/grammar/${encodeURIComponent(g.id)}`,
  });
}

export default async function GrammarDetailPage({ params }: Props) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const g = GRAMMAR_BASE.find((x) => x.id === id);

  return (
    <>
      {g && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "LearningResource",
              name: `${g.f} — koreys tili grammatikasi`,
              url: `${SITE_URL}/grammar/${encodeURIComponent(g.id)}`,
              inLanguage: "uz",
              learningResourceType: "Grammatika mavzusi",
              educationalLevel: g.l,
              teaches: plainText(g.m),
              about: CAT[g.c] || g.c || undefined,
              isAccessibleForFree: true,
              // Misollar sonidan foydalanish qulayligini ko'rsatamiz
              ...(g.e.length
                ? { exampleOfWork: { "@type": "CreativeWork", name: g.e[0][0] } }
                : {}),
            }}
          />
          <JsonLd
            data={breadcrumbJsonLd([
              { name: "Bosh sahifa", path: "/" },
              { name: "Grammatika", path: "/grammar" },
              { name: g.f, path: `/grammar/${encodeURIComponent(g.id)}` },
            ])}
          />
        </>
      )}
      <GrammarDetail id={id} />
    </>
  );
}
