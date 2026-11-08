"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert, X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "./ui/Button";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Davom etish",
  cancelLabel = "Bekor qilish",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onCancel}
          className="fixed inset-0 z-[1200] grid place-items-center bg-ink/70 px-4 backdrop-blur-sm"
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-line bg-panel p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-pink/40 bg-pink/10 text-pink">
                <TriangleAlert className="size-5" strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="confirm-title" className="text-[17px] font-extrabold">
                  {title}
                </h2>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                  {message}
                </p>
              </div>
              <button
                type="button"
                onClick={onCancel}
                aria-label="Yopish"
                className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-hover hover:text-text"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-6 flex gap-2.5">
              <Button
                variant="soft"
                className="flex-1"
                onClick={onCancel}
                autoFocus
              >
                {cancelLabel}
              </Button>
              <Button variant="danger" className="flex-1" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
