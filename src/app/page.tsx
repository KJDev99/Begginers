"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Languages,
  Library,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { SectionHead } from "@/components/ui/SectionHead";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { StatsSkeleton, CardGridSkeleton } from "@/components/ui/Skeleton";
import { ALL_LETTERS } from "@/data/alphabet";
import { learnedLetters, memorizedWords, progressVals } from "@/lib/progress";
import { useStore } from "@/lib/store";
import { pct } from "@/lib/utils";

const LESSONS = [
  {
    no: "01 / ALPHABET",
    symbol: "가나다",
    title: "Hangul alifbosi",
    text: "Harflar va talaffuz audiolari.",
    href: "/alphabet",
    glow: "var(--color-cyan)",
    key: "a" as const,
  },
  {
    no: "02 / GRAMMAR",
    symbol: "이에요",
    title: "Grammatika (0 dan)",
    text: "Qoidalar, formulalar va misollar.",
    href: "/grammar",
    glow: "var(--color-purple)",
    key: "g" as const,
  },
  {
    no: "03 / VOCABULARY",
    symbol: "사랑",
    title: "Kundalik lug‘at",
    text: "So‘zlar rasmi bilan, flashcard va takrorlash.",
    href: "/vocabulary",
    glow: "var(--color-pink)",
    key: "v" as const,
  },
  {
    no: "04 / WRITING",
    symbol: "쓰기",
    title: "Yozuv mashqi",
    text: "Belgini yozing — qanday yozilishi ko‘rsatiladi.",
    href: "/writing",
    glow: "var(--color-green)",
    key: "w" as const,
  },
];

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-line bg-panel p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-line/80 sm:p-5">
      <div
        className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: accent }}
      />
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] font-bold tracking-wide text-muted">
          {label}
        </span>
        <span
          className="grid size-8 shrink-0 place-items-center rounded-[10px] border border-line"
          style={{
            background: `color-mix(in srgb, ${accent} 14%, transparent)`,
            color: accent,
          }}
        >
          <Icon className="size-4" strokeWidth={2.2} />
        </span>
      </div>
      <p className="mt-3 text-2xl font-extrabold tabular-nums sm:text-[28px]">
        {value}
      </p>
      <p className="mt-1 text-[11.5px] text-muted">{note}</p>
    </div>
  );
}

export default function HomePage() {
  const { state, ready, vocab, grammarCount } = useStore();
  const p = progressVals(state, vocab.length, grammarCount);

  return (
    <div className="space-y-9">
      {/* ---------- Hero ---------- */}
      <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-panel">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at 85% 10%, color-mix(in srgb, var(--color-purple) 28%, transparent), transparent 55%), radial-gradient(ellipse at 10% 95%, color-mix(in srgb, var(--color-cyan) 20%, transparent), transparent 50%)",
          }}
        />
        <div className="relative flex flex-col items-start gap-8 p-6 sm:p-9 lg:flex-row lg:items-center lg:justify-between lg:p-11">
          <div className="max-w-xl">
            <p className="text-[10.5px] font-extrabold tracking-[2.4px] text-cyan">
              YOUR KOREAN JOURNEY STARTS HERE
            </p>
            <h2 className="mt-4 text-[32px] leading-[1.08] font-black tracking-tight sm:text-[42px]">
              Annyeong!
              <br />
              <span className="ko bg-gradient-to-r from-purple via-cyan to-pink bg-clip-text text-transparent">
                새로운 시작
              </span>
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-muted sm:text-[15.5px]">
              Koreys tilini noldan o‘rgan. Grammatikalar 0 dan tushuntirilgan,
              har bir so‘z va misolning o‘zbekcha tarjimasi va ovozli talaffuzi
              bor.
            </p>
            <Link
              href="/alphabet"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple to-cyan px-6 py-3 text-[15px] font-bold text-ink shadow-lg shadow-purple/25 transition-all duration-150 hover:brightness-110 active:scale-[0.97]"
            >
              O‘rganishni boshlash
              <ArrowUpRight className="size-4" strokeWidth={2.6} />
            </Link>
          </div>

          <div
            aria-hidden
            className="ko animate-float select-none text-[88px] leading-none font-black text-text/[0.07] sm:text-[120px] lg:text-[150px]"
          >
            한글
          </div>
        </div>
      </Reveal>

      {/* ---------- Statistika ---------- */}
      {!ready ? (
        <StatsSkeleton />
      ) : (
        <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StaggerItem>
            <StatCard
              label="O‘rganilgan harflar"
              value={`${learnedLetters(state)} / ${ALL_LETTERS.length}`}
              note="Hangul alifbosi"
              icon={Languages}
              accent="var(--color-cyan)"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Lug‘at boyligi"
              value={String(memorizedWords(state))}
              note="Yodlangan so‘zlar"
              icon={Library}
              accent="var(--color-pink)"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Test natijalari"
              value={String(state.correct)}
              note="To‘g‘ri javoblar"
              icon={Target}
              accent="var(--color-green)"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              label="Umumiy rivojlanish"
              value={`${pct(p.t)}%`}
              note="O‘rganish jarayoni"
              icon={TrendingUp}
              accent="var(--color-purple)"
            />
          </StaggerItem>
        </Stagger>
      )}

      {/* ---------- Bo'limlar ---------- */}
      <section>
        <SectionHead
          title="O‘rganish bo‘limlari"
          subtitle="O‘zingga mos bo‘limni tanla va davom et."
        />

        {!ready ? (
          <CardGridSkeleton
            count={3}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            itemClassName="h-56 rounded-3xl"
          />
        ) : (
          <Stagger
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            step={0.05}
          >
            {LESSONS.map((l) => (
              <StaggerItem key={l.href}>
                <Link
                  href={l.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel p-6 transition-all duration-200 hover:-translate-y-1"
                  style={{ ["--glow" as string]: l.glow }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-[0.12] blur-3xl transition-opacity duration-300 group-hover:opacity-30"
                    style={{ background: l.glow }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${l.glow}, transparent)`,
                    }}
                  />

                  <p
                    className="text-[10px] font-extrabold tracking-[1.8px]"
                    style={{ color: l.glow }}
                  >
                    {l.no}
                  </p>
                  <p className="ko mt-5 text-[34px] leading-none font-black">
                    {l.symbol}
                  </p>
                  <h3 className="mt-5 text-[17px] font-extrabold">{l.title}</h3>
                  <p className="mt-1.5 text-[13.5px] text-muted">{l.text}</p>

                  <div className="mt-auto pt-6">
                    <ProgressBar
                      value={pct(p[l.key])}
                      label={`${l.title} rivojlanishi`}
                      barClassName="transition-[width] duration-700"
                    />
                    <p className="mt-2 flex items-center justify-between text-[11px] font-bold text-muted">
                      <span>{pct(p[l.key])}% o‘zlashtirildi</span>
                      <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </section>
    </div>
  );
}
