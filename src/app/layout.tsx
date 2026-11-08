import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";

import { AppShell } from "@/components/AppShell";
import { NavigationProgress } from "@/components/NavigationProgress";
import { Splash } from "@/components/Splash";
import { ToastHost } from "@/components/ToastHost";
import { StoreProvider } from "@/lib/store";

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
  title: "HANGUK — Korean Learning World",
  description:
    "Koreys tilini noldan o‘rgan. Grammatikalar 0 dan tushuntirilgan, har bir so‘z va misolning o‘zbekcha tarjimasi va ovozli talaffuzi bor.",
  applicationName: "HANGUK",
  verification: {
    google: "sKrzjvBusJYW1rcmnXtEPOV16aujuHKGJwxA-WdwLL8",
  },
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
