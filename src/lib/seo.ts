import type { Metadata } from "next";

/* ============================================================
   SEO markaziy sozlamalari

   MUHIM: saytni joylashtirgandan so'ng `NEXT_PUBLIC_SITE_URL`
   muhit o'zgaruvchisiga haqiqiy domenni yozing (.env.local):
       NEXT_PUBLIC_SITE_URL=https://sizning-domeningiz.uz
   Shunda canonical havolalar, sitemap va OG rasm manzillari
   to'g'ri ishlaydi.
   ============================================================ */

/**
 * Saytning asosiy manzili.
 * 1) `NEXT_PUBLIC_SITE_URL` — o'z domeningiz (eng ustun turadi);
 * 2) Vercel avtomatik beradigan production domeni;
 * 3) lokal ishlab chiqish manzili.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

export const SITE_NAME = "HANGUK";

export const SITE_TITLE = "HANGUK — Korean Learning World";

export const SITE_DESCRIPTION =
  "Koreys tilini noldan o‘rganing: hangul alifbosi, 0 dan tushuntirilgan grammatika, " +
  "o‘zbekcha tarjimali lug‘at, ovozli talaffuz, flashcard va testlar. Hammasi bepul.";

/** Google Search Console tasdiqlash kodi. */
export const GOOGLE_VERIFICATION = "sKrzjvBusJYW1rcmnXtEPOV16aujuHKGJwxA-WdwLL8";

/* ---------- Kalit so'zlar ---------- */

/** Barcha sahifalar uchun umumiy kalit so'zlar. */
export const BASE_KEYWORDS = [
  "koreys tili",
  "koreys tilini o‘rganish",
  "koreys tilini organish",
  "koreys tili o‘zbek tilida",
  "koreys tili darslari",
  "koreys tilini noldan o‘rganish",
  "koreys tili onlayn",
  "koreys tili bepul",
  "koreyscha o‘rganish",
  "korean learning",
  "한국어",
  "한국어 공부",
  "hanguk",
  "TOPIK",
  "EPS TOPIK",
  "koreys tili A1",
  "koreys tili A2",
];

/** Sahifaga xos kalit so'zlar. */
export const PAGE_KEYWORDS = {
  home: [
    "koreys tili sayti",
    "koreys tili platformasi",
    "koreys tili kursi",
    "koreys tili o‘quv dasturi",
    "koreys tili boshlang‘ich daraja",
  ],
  alphabet: [
    "hangul",
    "hangul alifbosi",
    "한글",
    "koreys alifbosi",
    "koreys harflari",
    "koreys harflari talaffuzi",
    "hangul o‘qish",
    "koreys unlilari",
    "koreys undoshlari",
    "한글 자음 모음",
    "hangul alifbosini o‘rganish",
  ],
  grammar: [
    "koreys tili grammatikasi",
    "koreys grammatikasi",
    "koreys grammatikasi o‘zbekcha",
    "koreys tili qoidalari",
    "koreys tili qo‘shimchalari",
    "조사",
    "연결어미",
    "이/가",
    "은/는",
    "을/를",
    "koreys tili kelishiklari",
    "한국어 문법",
  ],
  vocabulary: [
    "koreyscha o‘zbekcha lug‘at",
    "koreys tili lug‘ati",
    "koreys so‘zlari",
    "kundalik koreyscha so‘zlar",
    "koreyscha so‘zlar tarjimasi",
    "한국어 단어",
    "koreys tili so‘z boyligi",
  ],
  flashcard: [
    "flashcard",
    "koreys so‘zlarini yodlash",
    "koreyscha so‘z takrorlash",
    "leitner usuli",
    "한국어 단어 암기",
  ],
  quiz: [
    "koreys tili testi",
    "koreys tili test savollari",
    "koreyscha test",
    "koreys tili bilimini tekshirish",
    "tinglab topish mashqi",
    "한국어 퀴즈",
  ],
  addContent: [
    "koreys tili konspekt",
    "o‘z lug‘atingiz",
    "koreys tili yozuvlari",
  ],
  progress: [
    "koreys tili rivojlanishi",
    "o‘rganish natijalari",
    "koreys tili yutuqlari",
  ],
} as const;

/* ---------- Metadata yasovchi ---------- */

type BuildArgs = {
  title: string;
  description: string;
  /** Sahifaga xos qo'shimcha kalit so'zlar */
  keywords?: readonly string[];
  /** `/grammar` kabi yo'l (canonical uchun) */
  path: string;
  /** Shaxsiy sahifalarni indeksdan chiqarish */
  noIndex?: boolean;
};

/** Bitta sahifa uchun to'liq Metadata yasaydi. */
export function buildMetadata({
  title,
  description,
  keywords = [],
  path,
  noIndex = false,
}: BuildArgs): Metadata {
  const url = SITE_URL + path;
  const fullTitle = path === "/" ? SITE_TITLE : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: [...keywords, ...BASE_KEYWORDS],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "uz_UZ",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: SITE_TITLE,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/og.png"],
    },
    ...(noIndex
      ? { robots: { index: false, follow: true, nocache: true } }
      : {}),
  };
}

/* ---------- Structured data (JSON-LD) ---------- */

/** Sayt haqida umumiy JSON-LD. */
export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: "uz",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo: `${SITE_URL}/og.png`,
      },
      {
        "@type": "Course",
        "@id": `${SITE_URL}/#course`,
        name: "Koreys tili — boshlang‘ich daraja (A1–A2)",
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        inLanguage: "uz",
        teaches: "Koreys tili: hangul alifbosi, grammatika va lug‘at",
        educationalLevel: "Beginner",
        isAccessibleForFree: true,
        provider: { "@id": `${SITE_URL}/#organization` },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "PT20M",
        },
      },
    ],
  };
}

/** Non o'qish zanjiri (breadcrumb) JSON-LD. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE_URL + it.path,
    })),
  };
}
