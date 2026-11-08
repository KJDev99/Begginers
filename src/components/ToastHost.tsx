"use client";

import { Toaster } from "sonner";
import { useStore } from "@/lib/store";

/** Sonner toastlari — ilova mavzusiga mos ranglarda. */
export function ToastHost() {
  const { state } = useStore();

  return (
    <Toaster
      position="bottom-right"
      duration={2400}
      gap={10}
      offset={18}
      theme={state.theme === "light" ? "light" : "dark"}
      toastOptions={{
        style: {
          background: "var(--color-panel)",
          border: "1px solid var(--color-line)",
          color: "var(--color-text)",
          borderRadius: "14px",
          fontSize: "13.5px",
          fontWeight: 600,
          boxShadow: "0 12px 32px -12px rgba(0,0,0,.5)",
        },
        classNames: {
          success: "!text-green",
          error: "!text-pink",
          info: "!text-cyan",
        },
      }}
    />
  );
}
