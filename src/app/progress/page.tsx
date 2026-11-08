"use client";

import { useState } from "react";
import {
  BookOpen,
  Flame,
  Languages,
  Library,
  Lock,
  RotateCcw,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import {
  CardGridSkeleton,
  Skeleton,
  StatsSkeleton,
} from "@/components/ui/Skeleton";
import { ALL_LETTERS } from "@/data/alphabet";
import { BADGES } from "@/data/badges";
import { learnedLetters, memorizedWords, progressVals } from "@/lib/progress";
import { useStore } from "@/lib/store";
import { cn, pct } from "@/lib/utils";

export default function ProgressPage() {
  const { state, ready, vocab, grammarCount, reset } = useStore();
  const [confirming, setConfirming] = useState(false);

  const p = progressVals(state, vocab.length, grammarCount);

  const stats = [
    {
      label: "Harflar",
      value: `${learnedLetters(state)}/${ALL_LETTERS.length}`,
      icon: Languages,
      accent: "var(--color-cyan)",
    },
    {
      label: "Yodlangan so‘zlar",
      value: `${memorizedWords(state)}/${vocab.length}`,
      icon: Library,
      accent: "var(--color-pink)",
    },
    {
      label: "To‘g‘ri javoblar",
      value: String(state.correct),
      icon: Target,
      accent: "var(--color-green)",
    },
    {
      label: "Umumiy",
      value: `${pct(p.t)}%`,
      icon: TrendingUp,
      accent: "var(--color-purple)",
    },
  ];

  const sections = [
    {
      label: "Hangul alifbosi",
      value: p.a,
      icon: Languages,
      from: "from-cyan",
      to: "to-purple",
    },
    {
      label: "Grammatika",
      value: p.g,
      icon: BookOpen,
      from: "from-purple",
      to: "to-pink",
    },
    {
      label: "Lug‘at",
      value: p.v,
      icon: Library,
      from: "from-pink",
      to: "to-green",
    },
  ];

  const earned = BADGES.filter((b) => b[2](state)).length;

  return (
    <div>
      <SectionHead
        title="Natijalar va yutuqlar"
        subtitle="Rivojlanishingiz va olgan nishonlaringiz."
        action={
          <Button variant="danger" onClick={() => setConfirming(true)}>
            <RotateCcw className="size-4" strokeWidth={2.4} />
            Hammasini tozalash
          </Button>
        }
      />

      {!ready ? (
        <>
          <Skeleton className="mb-6 h-32 rounded-3xl" />
          <StatsSkeleton />
          <Skeleton className="mb-6 h-48 rounded-2xl" />
          <CardGridSkeleton
            count={8}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            itemClassName="h-28 rounded-2xl"
          />
        </>
      ) : (
        <>
          {/* ---------- XP va seriya ---------- */}
          <Reveal className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-panel p-5 sm:col-span-2">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full opacity-[0.13] blur-3xl"
                style={{ background: "var(--color-purple)" }}
              />
              <div className="relative flex items-center gap-4">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-purple/40 bg-purple/15 text-purple">
                  <Star className="size-6" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold tracking-[1.4px] text-muted">
                    TAJRIBA BALLARI
                  </p>
                  <p className="mt-1 text-3xl leading-none font-black tabular-nums">
                    {state.xp}{" "}
                    <span className="text-base font-bold text-muted">XP</span>
                  </p>
                  <p className="mt-1.5 text-[12px] text-muted">
                    Keyingi daraja:{" "}
                    <span className="font-bold text-purple tabular-nums">
                      {Math.max(0, 1000 - state.xp)} XP
                    </span>{" "}
                    qoldi
                  </p>
                </div>
              </div>
              <ProgressBar
                value={pct(Math.min(1, state.xp / 1000))}
                label="Daraja rivojlanishi"
                className="relative mt-4"
              />
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-line bg-panel p-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl border border-pink/40 bg-pink/15 text-pink">
                <Flame className="size-6" strokeWidth={2.2} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold tracking-[1.4px] text-muted">
                  KUNLIK SERIYA
                </p>
                <p className="mt-1 text-3xl leading-none font-black tabular-nums">
                  {state.streak}{" "}
                  <span className="text-base font-bold text-muted">kun</span>
                </p>
                <p className="mt-1.5 text-[12px] text-muted">
                  Har kun o‘rganib seriyani uzaytiring
                </p>
              </div>
            </div>
          </Reveal>

          {/* ---------- Statistika ---------- */}
          <Stagger className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <StaggerItem key={s.label}>
                  <div className="rounded-2xl border border-line bg-panel p-4 transition-transform duration-200 hover:-translate-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[11px] font-bold text-muted">
                        {s.label}
                      </p>
                      <span
                        className="grid size-7 shrink-0 place-items-center rounded-lg"
                        style={{
                          background: `color-mix(in srgb, ${s.accent} 14%, transparent)`,
                          color: s.accent,
                        }}
                      >
                        <Icon className="size-3.5" strokeWidth={2.4} />
                      </span>
                    </div>
                    <p className="mt-2.5 text-[22px] font-extrabold tabular-nums">
                      {s.value}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          {/* ---------- Bo'limlar bo'yicha ---------- */}
          <div className="mb-8 rounded-2xl border border-line bg-panel p-5 sm:p-6">
            <h3 className="mb-5 text-[11px] font-extrabold tracking-[1.6px] text-cyan">
              BO‘LIMLAR BO‘YICHA
            </h3>
            <div className="space-y-5">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="flex items-center gap-2 text-[13.5px] font-bold">
                        <Icon className="size-4 text-muted" strokeWidth={2.2} />
                        {s.label}
                      </p>
                      <p className="text-[12.5px] font-bold text-muted tabular-nums">
                        {pct(s.value)}%
                      </p>
                    </div>
                    <ProgressBar
                      value={pct(s.value)}
                      label={s.label}
                      barClassName={cn(s.from, s.to)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------- Nishonlar ---------- */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-[11px] font-extrabold tracking-[1.6px] text-cyan">
              NISHONLAR
            </h3>
            <p className="text-[12px] font-bold text-muted tabular-nums">
              {earned} / {BADGES.length}
            </p>
          </div>

          <Stagger
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            step={0.035}
          >
            {BADGES.map((b) => {
              const on = b[2](state);
              return (
                <StaggerItem key={b[1]}>
                  <div
                    className={cn(
                      "relative flex h-full flex-col items-center gap-2 overflow-hidden rounded-2xl border p-4 text-center transition-all duration-200",
                      on
                        ? "border-green/45 bg-green/[0.07] hover:-translate-y-0.5"
                        : "border-line bg-panel",
                    )}
                  >
                    {!on && (
                      <span className="absolute top-2.5 right-2.5 text-muted/50">
                        <Lock className="size-3" strokeWidth={2.6} />
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-[30px] leading-none transition-all duration-200",
                        on ? "" : "opacity-25 grayscale",
                      )}
                    >
                      {b[0]}
                    </span>
                    <span
                      className={cn(
                        "text-[12.5px] font-bold",
                        on ? "" : "text-muted",
                      )}
                    >
                      {b[1]}
                    </span>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </>
      )}

      <ConfirmDialog
        open={confirming}
        title="Hammasini tozalash"
        message="Barcha natijalar va qo‘shilgan ma’lumotlar o‘chiriladi. Davom etasizmi?"
        confirmLabel="Ha, tozalash"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          reset();
          setConfirming(false);
          toast.success("Hammasi tozalandi");
        }}
      />
    </div>
  );
}
