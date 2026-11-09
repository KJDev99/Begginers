import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";

import { AppShell } from "@/components/AppShell";
import { JsonLd } from "@/components/JsonLd";
import { NavigationProgress } from "@/components/NavigationProgress";
import { Splash } from "@/components/Splash";
import { ToastHost } from "@/components/ToastHost";
import { StoreProvider } from "@/lib/store";
import {
  BASE_KEYWORDS,
  GOOGLE_VERIFICATION,
  PAGE_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  siteJsonLd,
} from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const notoKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    // Ichki sahifalar: "Alifbo | HANGUK"
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...PAGE_KEYWORDS.home, ...BASE_KEYWORDS],

  applicationName: SITE_NAME,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "education",
  creator: SITE_NAME,
  publisher: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],

  alternates: {
    canonical: "/",
    languages: { uz: "/", "x-default": "/" },
  },

  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: SITE_TITLE,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: { google: GOOGLE_VERIFICATION },

  formatDetection: { telephone: false, address: false, email: false },

  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f4fb" },
    { media: "(prefers-color-scheme: dark)", color: "#090b13" },
  ],
};

/** Mavzu birinchi chizilishdan oldin qo'llanadi — "miltillash" bo'lmaydi. */
const themeInit = `(function(){try{var s=JSON.parse(localStorage.getItem("hanguk_v2")||"{}");var t=s.v3?s.theme:"light";var r=document.documentElement;if(t==="dark"){r.style.colorScheme="dark"}else{r.classList.add("light");r.style.colorScheme="light"}}catch(e){document.documentElement.classList.add("light")}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${inter.variable} ${notoKR.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <JsonLd data={siteJsonLd()} />
      </head>
      <body>
        <StoreProvider>
          <NavigationProgress />
          <Splash />
          <AppShell>{children}</AppShell>
          <ToastHost />
        </StoreProvider>
      </body>
    </html>
  );
}
