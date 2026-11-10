"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Eye, PartyPopper, X } from "lucide-react";
import { toast } from "sonner";

import { AudioButton } from "@/components/ui/AudioButton";
import { WordImage } from "@/components/ui/WordImage";
import { WriteButton } from "@/components/WriteButton";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHead } from "@/components/ui/SectionHead";
import { Skeleton } from "@/components/ui/Skeleton";
import type { VocabWord } from "@/data/types";
import { memorizedWords } from "@/lib/progress";
import { useStore } from "@/lib/store";
import { pct } from "@/lib/utils";

export default function FlashcardPage() {
  const { state, ready, vocab, update } = useStore();

  const [current, setCurrent] = useState<VocabWord | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [seen, setSeen] = useState(0);

  /** Takrorlash navbati: kam bilinadigan so'zlar ko'proq tushadi (Leitner). */
  const pool = useMemo(() => {
    const p: VocabWord[] = [];
    vocab.forEach((v) => {
      const b = state.box[v.id] || 1;
      if (b < 3) for (let i = 0; i < (b === 1 ? 3 : 1); i++) p.push(v);
    });
    return p;
  }, [vocab, state.box]);

  const pickNext = useCallback(() => {
    setRevealed(false);
    setCurrent((prev) => {
      if (!pool.length) return null;
      // Ketma-ket bir xil so'z tushmasligi uchun bir marta qayta tanlaymiz.
      let next = pool[Math.floor(Math.random() * pool.length)];
      if (pool.length > 1 && prev && next.id === prev.id) {
        next = pool[Math.floor(Math.random() * pool.length)];
      }
      return next;
    });
  }, [pool]);

  // Birinchi kartani tanlaymiz.
  useEffect(() => {
    if (!ready) return;
    if (!current) pickNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, pool.length]);

  const answer = useCallback(
    (knows: boolean) => {
      if (!current) return;
      const id = current.id;

      update((d) => {
        if (knows) {
          d.box[id] = Math.min(3, (d.box[id] || 1) + 1);
          d.xp += 2;
          const t = new Date().toISOString().slice(0, 10);
          if (d.last !== t) {
            const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
            d.streak = d.last === y ? d.streak + 1 : 1;
            d.last = t;
          }
        } else {
          d.box[id] = 1;
        }
      });

      if (knows) toast.success(`${current.kr} — bilasiz! +2 XP`);
      setSeen((s) => s + 1);
      pickNext();
    },
    [current, update, pickNext],
  );

  // Klaviatura: Space/Enter — javob, 1/← — bilmayman, 2/→ — bilaman.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!current) return;
      if (!revealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (!revealed) return;
      if (e.key === "1" || e.key === "ArrowLeft") answer(false);
      if (e.key === "2" || e.key === "ArrowRight" || e.key === "Enter")
        answer(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, revealed, answer]);

  const known = memorizedWords(state);
  const total = vocab.length;

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-28 rounded-xl" />
        <Skeleton className="h-[340px] rounded-3xl" />
        <Skeleton className="h-12 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/vocabulary"
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-line bg-panel2 px-3.5 py-2 text-[13px] font-bold text-muted transition-colors hover:border-cyan/40 hover:text-text"
      >
        <ArrowLeft className="size-4" strokeWidth={2.4} />
        Lug‘at
      </Link>

      <SectionHead
        title="Flashcard takrori"
        subtitle="Avval o‘zingizni sinab ko‘ring, keyin javobni oching."
      />

      {/* ---------- Umumiy holat ---------- */}
      <div className="mb-6 rounded-2xl border border-line bg-panel p-4">
        <div className="mb-2.5 flex items-center justify-between text-[12.5px] font-bold">
          <span className="text-muted">
            Yodlangan:{" "}
            <span className="text-green tabular-nums">
              {known} / {total}
            </span>
          </span>
          <span className="text-muted tabular-nums">
            Bu seansda: {seen} ta
          </span>
        </div>
        <ProgressBar
          value={pct(total ? known / total : 0)}
          label="Lug‘at rivojlanishi"
          barClassName="from-green to-cyan"
        />
      </div>

      {/* ---------- Karta ---------- */}
      {!current ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4 rounded-3xl border border-green/40 bg-green/[0.07] px-6 py-16 text-center"
        >
          <PartyPopper className="size-12 text-green" strokeWidth={1.7} />
          <p className="text-lg font-extrabold">Hamma so‘zlar yodlangan!</p>
          <p className="max-w-sm text-sm text-muted">
            Yangi so‘z qo‘shsangiz yoki biror so‘zni takrorlashga
            qaytarsangiz, flashcard yana ishga tushadi.
          </p>
          <Link
            href="/vocabulary"
            className="mt-2 text-sm font-bold text-cyan hover:underline"
          >
            Lug‘atga qaytish
          </Link>
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id + String(revealed)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden rounded-3xl border border-line bg-panel px-6 py-12 text-center"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
                style={{ background: "var(--color-cyan)" }}
              />
              <div className="relative">
                <p className="mb-5 text-[10px] font-extrabold tracking-[2px] text-muted">
                  {current.g.toUpperCase()} · {current.l}
                </p>

                <div className="flex items-center justify-center gap-3">
                  <p className="ko text-[40px] leading-tight font-black sm:text-[52px]">
                    {current.kr}
                  </p>
                  <AudioButton text={current.kr} />
                  <WriteButton text={current.kr} meaning={current.uz} />
                </div>

                {revealed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                  >
                    <WordImage
                      emoji={current.im}
                      alt={current.uz}
                      size="xl"
                      className="mx-auto mb-4"
                    />
                    <p className="text-xl font-bold">{current.uz}</p>
                    {current.pr && (
                      <p className="mt-1 text-sm text-cyan/80 italic">
                        {current.pr}
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <Button
                    variant="soft"
                    size="lg"
                    className="mt-7"
                    onClick={() => setRevealed(true)}
                  >
                    <Eye className="size-4" strokeWidth={2.4} />
                    Javobni ko‘rsatish
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-4 grid grid-cols-2 gap-3"
            >
              <Button variant="danger" size="lg" onClick={() => answer(false)}>
                <X className="size-4" strokeWidth={3} />
                Bilmayman
              </Button>
              <Button
                size="lg"
                onClick={() => answer(true)}
                className="border border-green/50 bg-green/15 text-green hover:border-green/70 hover:bg-green/25"
              >
                <Check className="size-4" strokeWidth={3} />
                Bilaman
              </Button>
            </motion.div>
          )}

          <p className="mt-5 text-center text-[11.5px] text-muted">
            Tezkor tugmalar:{" "}
            <kbd className="rounded border border-line bg-panel2 px-1.5 py-0.5 font-mono">
              Space
            </kbd>{" "}
            javob ·{" "}
            <kbd className="rounded border border-line bg-panel2 px-1.5 py-0.5 font-mono">
              1
            </kbd>{" "}
            bilmayman ·{" "}
            <kbd className="rounded border border-line bg-panel2 px-1.5 py-0.5 font-mono">
              2
            </kbd>{" "}
            bilaman
          </p>
        </>
      )}
    </div>
  );
}
