"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  PartyPopper,
  RotateCcw,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SectionHead } from "@/components/ui/SectionHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { LEVELS } from "@/lib/korean";
import { buildQuiz, type Question } from "@/lib/quiz";
import { speak } from "@/lib/speech";
import { useStore } from "@/lib/store";
import { useSessionState } from "@/lib/useSessionState";
import { cn, shuffle, today, yesterday } from "@/lib/utils";

const COUNTS = [
  { value: "8", label: "8" },
  { value: "15", label: "15" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
  { value: "all", label: "Hammasi" },
];

type Phase = "play" | "retry" | "done";

export default function QuizPage() {
  const { state, ready, vocab, update } = useStore();

  const [count, setCount] = useSessionState("q.count", "15");
  const [level, setLevel] = useSessionState("q.level", "Hammasi");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState<Record<string, true>>({});
  const [reAsked, setReAsked] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("play");

  const timer = useRef<number | null>(null);
  const clearTimer = () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
  };

  /** Yangi testni boshlaydi. */
  const start = useCallback(() => {
    clearTimer();
    setQuestions(
      buildQuiz({
        vocab,
        customQuiz: state.cQuiz,
        wrong: state.wrong,
        level,
        count: count === "all" ? "all" : Number(count),
      }),
    );
    setIdx(0);
    setScore(0);
    setMissed({});
    setReAsked(false);
    setPicked(null);
    setPhase("play");
    // `vocab`/`state` o'zgarishi testni qayta boshlamasligi kerak
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, count]);

  // Sahifa ochilganda va sozlama o'zgarganda testni yangilaymiz.
  useEffect(() => {
    if (ready) start();
  }, [ready, start]);

  useEffect(() => clearTimer, []);

  const current = questions[idx];

  // "Tinglab topish" savolini avtomatik o'qiymiz.
  useEffect(() => {
    if (phase !== "play" || !current?.auto || !current.say) return;
    const t = window.setTimeout(() => speak(current.say as string), 300);
    return () => window.clearTimeout(t);
  }, [current, phase]);

  const finish = useCallback(
    (missedMap: Record<string, true>, list: Question[]) => {
      const wrongOnes = list.filter((q) => missedMap[q.id]);

      if (wrongOnes.length && !reAsked) {
        setPhase("retry");
        return;
      }

      update((d) => {
        d.wrong = [];
        d.xp += 10;
      });
      setPhase("done");
    },
    [reAsked, update],
  );

  const answer = useCallback(
    (option: string) => {
      if (picked !== null || !current) return;
      setPicked(option);

      const ok = option === current.a;
      const firstTry = !missed[current.id] && !reAsked;

      if (ok) {
        if (firstTry) setScore((s) => s + 1);
        update((d) => {
          d.correct += 1;
          d.xp += 5;
          const t = today();
          if (d.last !== t) {
            d.streak = d.last === yesterday() ? d.streak + 1 : 1;
            d.last = t;
          }
          d.wrong = d.wrong.filter((w) => w.id !== current.id);
        });
      } else {
        setMissed((m) => ({ ...m, [current.id]: true }));
        update((d) => {
          if (!d.wrong.find((w) => w.id === current.id)) {
            d.wrong.push({
              id: current.id,
              type: current.type,
              q: current.q,
              sub: current.sub,
              a: current.a,
              opts: current.opts,
              say: current.say,
            });
          }
        });
      }

      const nextMissed: Record<string, true> = ok
        ? missed
        : { ...missed, [current.id]: true };

      timer.current = window.setTimeout(
        () => {
          setPicked(null);
          if (idx + 1 >= questions.length) finish(nextMissed, questions);
          else setIdx((i) => i + 1);
        },
        ok ? 700 : 1400,
      );
    },
    [picked, current, missed, reAsked, update, idx, questions, finish],
  );

  const continueRetry = () => {
    const wrongOnes = questions.filter((q) => missed[q.id]);
    setQuestions(shuffle(wrongOnes.map((q) => ({ ...q, opts: shuffle(q.opts) }))));
    setMissed({});
    setReAsked(true);
    setIdx(0);
    setPicked(null);
    setPhase("play");
    toast.info("Xato savollar qayta boshlandi");
  };

  const wrongCount = questions.filter((q) => missed[q.id]).length;

  return (
    <div>
      <SectionHead
        title="Bilimingni tekshir"
        subtitle="Tarjima, teskari tarjima va tinglab topish savollari."
      />

      {/* ---------- Sozlamalar ---------- */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl border border-line bg-panel px-5 py-4">
        <label className="flex items-center gap-2 text-[12.5px] font-bold text-muted">
          Savollar soni:
          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="rounded-lg border border-line bg-panel2 px-3 py-1.5 text-[13px] font-bold text-text outline-none focus:border-cyan/60"
          >
            {COUNTS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-[12.5px] font-bold text-muted">
          Daraja:
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-lg border border-line bg-panel2 px-3 py-1.5 text-[13px] font-bold text-text outline-none focus:border-cyan/60"
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <Button variant="ghost" size="sm" onClick={start}>
          <RotateCcw className="size-3.5" strokeWidth={2.4} />
          Qayta boshlash
        </Button>
      </div>

      {/* ---------- Test ---------- */}
      <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-panel p-6 sm:p-8">
        {!ready ? (
          <div className="space-y-4">
            <Skeleton className="h-1.5 rounded-full" />
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-10 w-3/4" />
            <div className="space-y-2.5 pt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : phase === "retry" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-4 py-8 text-center"
          >
            <RotateCcw className="size-11 text-purple" strokeWidth={1.8} />
            <p className="text-[15px] font-bold">
              Xato qilgan {wrongCount} ta savolni qayta ishlaymiz.
            </p>
            <Button variant="primary" size="lg" onClick={continueRetry}>
              Davom etish
            </Button>
          </motion.div>
        ) : phase === "done" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-4 py-8 text-center"
          >
            <PartyPopper className="size-12 text-green" strokeWidth={1.7} />
            <h2 className="text-2xl font-black">Test tugadi!</h2>
            <p className="text-sm text-muted">
              Birinchi urinishda to‘g‘ri:{" "}
              <span className="font-bold text-green tabular-nums">
                {score} ta
              </span>{" "}
              · <span className="font-bold text-purple">+10 XP</span>
            </p>
            <Button variant="primary" size="lg" onClick={start}>
              <Sparkles className="size-4" strokeWidth={2.4} />
              Yangi test
            </Button>
          </motion.div>
        ) : !current ? (
          <div className="py-10 text-center">
            <p className="text-sm text-muted">
              Bu darajada savol tuzish uchun so‘zlar yetarli emas.
            </p>
            <Button variant="soft" className="mt-4" onClick={() => setLevel("Hammasi")}>
              Barcha darajalarni tanlash
            </Button>
          </div>
        ) : (
          <div>
            <ProgressBar
              value={(idx / questions.length) * 100}
              label="Test rivojlanishi"
              className="mb-4"
            />

            <div className="mb-5 flex items-center justify-between">
              <p className="text-[11.5px] font-bold text-muted tabular-nums">
                Savol {idx + 1} / {questions.length}
              </p>
              {reAsked && (
                <span className="rounded-full border border-purple/40 bg-purple/10 px-2.5 py-1 text-[10px] font-extrabold text-purple">
                  TAKROR
                </span>
              )}
            </div>

            <motion.div
              key={current.id + idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-wrap items-center justify-center gap-3 text-center">
                {current.auto ? (
                  <button
                    type="button"
                    onClick={() => current.say && speak(current.say)}
                    className="inline-flex items-center gap-2.5 rounded-2xl border border-cyan/50 bg-cyan/10 px-5 py-3.5 text-lg font-bold text-cyan transition-all duration-150 hover:bg-cyan/20 active:scale-95"
                  >
                    <Volume2 className="size-5" strokeWidth={2.3} />
                    {current.q}
                  </button>
                ) : (
                  <>
                    <h3
                      className={cn(
                        "text-[26px] leading-tight font-black sm:text-[32px]",
                        current.type === "uz" && "ko",
                      )}
                    >
                      {current.q}
                    </h3>
                    {current.say && (
                      <button
                        type="button"
                        onClick={() => speak(current.say as string)}
                        aria-label="Tinglash"
                        className="grid size-9 place-items-center rounded-full border border-line bg-panel2 text-cyan transition-all hover:border-cyan hover:bg-cyan/10 active:scale-90"
                      >
                        <Volume2 className="size-4" strokeWidth={2.3} />
                      </button>
                    )}
                  </>
                )}
              </div>

              <p className="mt-2.5 text-center text-[13px] text-muted">
                {current.sub}
              </p>

              <div className="mt-7 grid gap-2.5">
                {current.opts.map((o) => {
                  const isAnswer = o === current.a;
                  const isPicked = picked === o;
                  const settled = picked !== null;

                  return (
                    <button
                      key={o}
                      type="button"
                      disabled={settled}
                      onClick={() => answer(o)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5",
                        "text-left text-[15px] font-semibold transition-all duration-150",
                        !settled &&
                          "border-line bg-panel2 hover:-translate-y-px hover:border-cyan/55 hover:bg-cyan/[0.07] active:scale-[0.99]",
                        settled &&
                          isAnswer &&
                          "border-green/60 bg-green/15 text-green",
                        settled &&
                          isPicked &&
                          !isAnswer &&
                          "border-pink/60 bg-pink/15 text-pink",
                        settled &&
                          !isAnswer &&
                          !isPicked &&
                          "border-line bg-panel2 opacity-45",
                      )}
                    >
                      <span
                        className={cn(
                          current.type !== "uz" && "ko",
                          "min-w-0 break-words",
                        )}
                      >
                        {o}
                      </span>
                      {settled && isAnswer && (
                        <Check
                          className="size-4 shrink-0"
                          strokeWidth={3}
                        />
                      )}
                      {settled && isPicked && !isAnswer && (
                        <X className="size-4 shrink-0" strokeWidth={3} />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
