"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Check, ChevronRight, Plus, Search, X } from "lucide-react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Chip, ChipRow } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { CardGridSkeleton, ChipsSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { CONS, LEVELS, initialConsonant } from "@/lib/korean";
import { allGrammar } from "@/lib/grammar";
import { useStore } from "@/lib/store";
import { useSessionState } from "@/lib/useSessionState";
import { cn } from "@/lib/utils";

export default function GrammarPage() {
  const { state, ready } = useStore();
  const [level, setLevel] = useSessionState("g.level", "Hammasi");
  const [cons, setCons] = useSessionState("g.cons", "ㄱ");
  const [query, setQuery] = useState("");

  const all = useMemo(() => allGrammar(state.cGrammar), [state.cGrammar]);

  const inLevel = useMemo(
    () => all.filter((g) => level === "Hammasi" || g.l === level),
    [all, level],
  );

  /** Har bir bosh undosh uchun mavzular soni. */
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    inLevel.forEach((g) => {
      const k = initialConsonant(g.f);
      c[k] = (c[k] || 0) + 1;
    });
    return c;
  }, [inLevel]);

  // Tanlangan undoshda hech narsa bo'lmasa — birinchi to'lgan harfga o'tamiz.
  const activeCons = counts[cons] ? cons : (CONS.find((c) => counts[c]) ?? "");

  const q = query.trim().toLowerCase();

  const list = useMemo(() => {
    const filtered = q
      ? inLevel.filter((g) =>
          `${g.f} ${g.v} ${g.m} ${g.u}`.toLowerCase().includes(q),
        )
      : activeCons
        ? inLevel.filter((g) => initialConsonant(g.f) === activeCons)
        : inLevel;

    const key = (s: string) => s.replace(/[^가-힣]/g, "");
    return [...filtered].sort(
      (a, b) =>
        key(a.f).localeCompare(key(b.f), "ko") || a.f.localeCompare(b.f),
    );
  }, [inLevel, q, activeCons]);

  const levelCounts = useMemo(() => {
    const c: Record<string, number> = { Hammasi: all.length };
    LEVELS.forEach((l) => {
      if (l !== "Hammasi") c[l] = all.filter((g) => g.l === l).length;
    });
    return c;
  }, [all]);

  return (
    <div>
      <SectionHead
        title="Koreys tili grammatikasi"
        subtitle="Darajani tanlang, so‘ng undosh bo‘yicha toping (yoki qidiring)."
        action={
          <ButtonLink
            href={`/add-content?tab=formG${level !== "Hammasi" ? `&level=${level}` : ""}`}
            variant="soft"
          >
            <Plus className="size-4" strokeWidth={2.6} />
            Shu darajaga qo‘shish
          </ButtonLink>
        }
      />

      {!ready ? (
        <>
          <ChipsSkeleton />
          <Skeleton className="mb-5 h-12 rounded-2xl" />
          <Skeleton className="mb-6 h-[86px] rounded-[40px]" />
          <CardGridSkeleton
            count={12}
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
            itemClassName="h-12 rounded-xl"
          />
        </>
      ) : (
        <>
          {/* ---------- Daraja ---------- */}
          <ChipRow className="mb-4">
            {LEVELS.map((l) => (
              <Chip
                key={l}
                active={l === level}
                count={levelCounts[l]}
                onClick={() => setLevel(l)}
              >
                {l}
              </Chip>
            ))}
          </ChipRow>

          {/* ---------- Qidiruv ---------- */}
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Grammatika qidirish"
              placeholder="Grammatika qidirish: -거나, ega, -sa ..."
              autoComplete="off"
              className="w-full rounded-2xl border border-line bg-panel py-3.5 pr-11 pl-11 text-[14.5px] transition-colors outline-none placeholder:text-muted focus:border-cyan/60"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Qidiruvni tozalash"
                className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-text"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* ---------- Bosh undoshlar ---------- */}
          <div className="mb-6 flex flex-wrap justify-center gap-2 rounded-[32px] border border-line bg-panel p-4">
            <button
              type="button"
              onClick={() => {
                setCons("");
                setQuery("");
              }}
              className={cn(
                "h-10 rounded-full border px-4 text-[12.5px] font-bold transition-all duration-150",
                !activeCons
                  ? "border-transparent bg-text text-bg"
                  : "border-line bg-panel2 text-muted hover:border-cyan/50 hover:text-text",
              )}
            >
              Hammasi
            </button>

            {CONS.map((c) => {
              const n = counts[c] || 0;
              const on = c === activeCons;
              return (
                <button
                  key={c}
                  type="button"
                  disabled={!n}
                  title={`${n} ta`}
                  onClick={() => {
                    setCons(c);
                    setQuery("");
                  }}
                  className={cn(
                    "ko grid size-10 place-items-center rounded-full border text-[15px] font-bold transition-all duration-150",
                    on
                      ? "border-transparent bg-text text-bg"
                      : "border-line bg-panel2 text-text hover:border-cyan/60 hover:text-cyan",
                    !n && "cursor-default opacity-30 hover:border-line",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* ---------- Natija satri ---------- */}
          <div className="mb-4 flex items-center gap-2.5 text-[15px] font-extrabold">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-purple/20 text-purple">
              <ChevronRight className="size-3.5" strokeWidth={3} />
            </span>
            <span className="truncate">
              {level === "Hammasi" ? "Barcha darajalar" : `${level} daraja`} ·{" "}
              {q ? "qidiruv natijasi" : activeCons || "barcha harflar"} ·{" "}
              <span className="text-cyan tabular-nums">{list.length} ta</span>
            </span>
          </div>

          {/* ---------- Ro'yxat ---------- */}
          {list.length ? (
            <Reveal className="grid grid-cols-1 gap-1.5 rounded-2xl border border-line bg-panel p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {list.map((g) => (
                <Link
                  key={g.id}
                  href={`/grammar/${encodeURIComponent(g.id)}`}
                  className="group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-hover"
                >
                  <span className="ko truncate text-[15px] font-bold group-hover:text-cyan">
                    {g.f}
                  </span>
                  {level === "Hammasi" && (
                    <span className="shrink-0 text-[10px] font-extrabold text-purple">
                      {g.l}
                    </span>
                  )}
                  {state.gread[g.id] && (
                    <Check
                      className="size-3.5 shrink-0 text-green"
                      strokeWidth={3}
                    />
                  )}
                  <ChevronRight className="ml-auto size-3.5 shrink-0 text-muted/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-cyan" />
                </Link>
              ))}
            </Reveal>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="Bu yerda hozircha grammatika yo‘q"
              hint="“Shu darajaga qo‘shish” tugmasi bilan o‘zingiz qo‘shishingiz mumkin."
              action={
                <ButtonLink
                  href={`/add-content?tab=formG${level !== "Hammasi" ? `&level=${level}` : ""}`}
                  variant="primary"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="size-4" strokeWidth={2.6} />
                  Grammatika qo‘shish
                </ButtonLink>
              }
            />
          )}

          {q && list.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
                Qidiruvni tozalash
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
