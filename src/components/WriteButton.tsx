"use client";

/* ============================================================
   "Yozish" tugmasi va uning oynasi.

   Mobil: pastdan chiqadigan varaq (bottom sheet) — barmoq bilan
   qulay. Katta ekranda: markazdagi oyna.
   ============================================================ */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PenLine } from "lucide-react";

import { WriteTrainer } from "./WriteTrainer";
import { cn } from "@/lib/utils";

export function WriteDialog({
  open,
  text,
  meaning,
  onClose,
}: {
  open: boolean;
  text: string;
  meaning?: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className={cn(
            "fixed inset-0 z-[1300] flex justify-center bg-ink/70 backdrop-blur-sm",
            "items-end sm:items-center sm:px-4 sm:py-6",
          )}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Yozuv mashqi"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "max-h-[92dvh] w-full overflow-y-auto overscroll-contain",
              "pb-[env(safe-area-inset-bottom)] sm:max-w-md sm:pb-0",
            )}
          >
            <WriteTrainer
              text={text}
              meaning={meaning}
              onClose={onClose}
              className="rounded-b-none shadow-2xl sm:rounded-b-3xl"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Ro'yxatdagi yozuv yonida turadigan kichik "yozish" tugmasi. */
export function WriteButton({
  text,
  meaning,
  className,
  size = "md",
  label = "Yozib mashq qilish",
}: {
  text: string;
  meaning?: string;
  className?: string;
  size?: "sm" | "md";
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        title={label}
        aria-label={`${text} — ${label}`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setOpen(true);
        }}
        className={cn(
          "inline-grid shrink-0 place-items-center rounded-full border border-line",
          "bg-panel2 text-purple transition-all duration-150",
          "hover:border-purple hover:bg-purple/10 active:scale-90",
          size === "sm" ? "size-7" : "size-9",
          className,
        )}
      >
        <PenLine
          className={size === "sm" ? "size-3.5" : "size-4"}
          strokeWidth={2.2}
        />
      </button>

      <WriteDialog
        open={open}
        text={text}
        meaning={meaning}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
