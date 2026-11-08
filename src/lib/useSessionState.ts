"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * `useState`, lekin qiymat `sessionStorage` da saqlanadi.
 * Shu sababli boshqa sahifaga o'tib qaytganda filtrlar joyida qoladi.
 */
export function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    // faqat birinchi renderda o'qiymiz
  }, [key]);

  const set = useCallback(
    (next: T) => {
      setValue(next);
      try {
        window.sessionStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  return [value, set] as const;
}
