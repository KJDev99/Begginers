"use client";

import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import { useEffect } from "react";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 160,
  minimum: 0.12,
  easing: "ease",
  speed: 320,
});

/** Havola ichki sahifaga olib boradimi? */
function isInternalNavigation(anchor: HTMLAnchorElement, current: string) {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  if (anchor.getAttribute("href")?.startsWith("#")) return false;

  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return false;
  }

  if (url.origin !== window.location.origin) return false;
  // Faqat hash o'zgarsa — yuklanish bo'lmaydi.
  if (url.pathname + url.search === current) return false;

  return true;
}

/**
 * Sahifalar o'rtasida o'tishda yuqorida NProgress chizig'ini ko'rsatadi.
 * App Router'da o'tish boshlanishini havola bosilishi va `history` orqali ushlaymiz.
 */
export function NavigationProgress() {
  const pathname = usePathname();

  // Yangi sahifa render bo'ldi — chiziqni tugatamiz.
  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const current = window.location.pathname + window.location.search;
      if (isInternalNavigation(anchor, current)) NProgress.start();
    };

    // `router.push()` kabi programmali o'tishlar uchun.
    const { pushState, replaceState } = window.history;

    window.history.pushState = function (...args) {
      NProgress.start();
      return pushState.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      return replaceState.apply(this, args);
    };

    const onPopState = () => NProgress.start();

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      window.history.pushState = pushState;
      window.history.replaceState = replaceState;
      NProgress.remove();
    };
  }, []);

  return null;
}
