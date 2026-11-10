"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";

import { Chip, ChipRow } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { Skeleton } from "@/components/ui/Skeleton";
import { WordImage } from "@/components/ui/WordImage";
import { WriteTrainer } from "@/components/WriteTrainer";
import { ALL_LETTERS } from "@/data/alphabet";
import { GROUP_EMOJI } from "@/data/vocab-emoji";
import { writableChars } from "@/lib/hangul";
import { useStore } from "@/lib/store";
import { useSessionState } from "@/lib/useSessionState";
import { cn, pct } from "@/lib/utils";

type Target = { text: string; meaning?: string };

export default function WritingPage() {
  const { state, ready, vocab } = useStore();

  const [tab, setTab] = useSessionState<"letters" | "words">(
    "w.tab",
    "letters",
  );
  const [group, setGroup] = useSessionState("w.group", "Hammasi");
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<Target>({
    text: ALL_LETTERS[0].ch,
    meaning: ALL_LETTERS[0].s,
  });

  const groups = useMemo(
    () => ["Hammasi", ...new Set(vocab.map((v) => v.g))],
    [vocab],
  );

  const q = query.toLowerCase().trim();

  const words = useMemo(
    () =>
      vocab.filter(
        (v) =>
          (group === "Hammasi" || v.g === group) &&
          (!q || `${v.kr}${v.uz}${v.pr}`.toLowerCase().includes(q)),
      ),
    [vocab, group, q],
  );

  /* ---------- Rivojlanish: yozilgan belgilar ---------- */
  const wrote = state.wrote || {};
  const written = Object.keys(wrote).length;

  const letterDone = ALL_LETTERS.filter((l) => wrote[l.ch]).length;

  const allChars = useMemo(() => {
    const s = new Set<string>();
    for (const l of ALL_LETTERS) s.add(l.ch);
    for (const v of vocab) for (const c of writableChars(v.kr)) s.add(c);
    return s.size;
  }, [vocab]);

  const isWordDone = (kr: string) =>
    writableChars(kr).every((c) => wrote[c]);

  return (
    <div>
      <SectionHead
        title="Yozuv mashqi — 쓰기"
        subtitle="Belgini barmoq yoki sichqoncha bilan yozing. «Ko‘rsatish» tugmasi qanday yozilishini jonli ko‘rsatadi, «Tekshirish» esa xatoni topadi."
      />

      {!ready ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-[520px] rounded-3xl" />
        </div>
      ) : (
        <>
          {/* ---------- Umumiy rivojlanish ---------- */}
          <Reveal className="mb-6 rounded-2xl border border-line bg-panel p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold">
                Yozilgan belgilar:{" "}
                <span className="text-purple tabular-nums">
                  {written} / {allChars}
                </span>
              </p>
              <p className="text-xs font-bold text-muted tabular-nums">
                Alifbo: {letterDone} / {ALL_LETTERS.length}
              </p>
            </div>
            <ProgressBar
              value={pct(allChars ? written / allChars : 0)}
              label="Yozuv rivojlanishi"
              barClassName="from-purple to-pink"
            />
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            {/* ---------- Tanlash ---------- */}
            <div className="order-2 lg:order-1">
              <ChipRow className="mb-4">
                <Chip
                  active={tab === "letters"}
                  onClick={() => setTab("letters")}
                  count={ALL_LETTERS.length}
                >
                  Alifbo harflari
                </Chip>
                <Chip
                  active={tab === "words"}
                  onClick={() => setTab("words")}
                  count={vocab.length}
                >
                  Lug‘at so‘zlari
                </Chip>
              </ChipRow>

              {tab === "letters" ? (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-7">
                  {ALL_LETTERS.map((l) => {
                    const done = Boolean(wrote[l.ch]);
                    const active = target.text === l.ch;
                    return (
                      <button
                        key={l.ch}
                        type="button"
                        onClick={() =>
                          setTarget({ text: l.ch, meaning: l.s })
                        }
                        aria-pressed={active}
                        className={cn(
                          "relative flex flex-col items-center gap-0.5 rounded-2xl border px-2 py-3 transition-all",
                          active
                            ? "border-purple/70 bg-purple/15"
                            : done
                              ? "border-green/40 bg-green/[0.07]"
                              : "border-line bg-panel hover:border-purple/40",
                        )}
                      >
                        {done && (
                          <Check
                            className="absolute top-1.5 right-1.5 size-3 text-green"
                            strokeWidth={3.4}
                          />
                        )}
                        <span className="ko text-[26px] leading-none font-black">
                          {l.ch}
                        </span>
                        <span className="text-[11px] font-bold text-cyan">
                          {l.s}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <>
                  <ChipRow className="mb-3">
                    {groups.map((gr) => (
                      <Chip
                        key={gr}
                        active={gr === group}
                        onClick={() => setGroup(gr)}
                      >
                        {gr !== "Hammasi" && (
                          <span aria-hidden>{GROUP_EMOJI[gr] || "📘"}</span>
                        )}
                        {gr}
                      </Chip>
                    ))}
                  </ChipRow>

                  <div className="relative mb-4">
                    <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      aria-label="So‘z qidirish"
                      placeholder="So‘z qidirish..."
                      autoComplete="off"
                      className="w-full rounded-2xl border border-line bg-panel py-3 pr-11 pl-11 text-[14.5px] transition-colors outline-none placeholder:text-muted focus:border-purple/60"
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

                  {words.length ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {words.map((v) => {
                        const done = isWordDone(v.kr);
                        const active = target.text === v.kr;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() =>
                              setTarget({ text: v.kr, meaning: v.uz })
                            }
                            aria-pressed={active}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl border p-2.5 text-left transition-all",
                              active
                                ? "border-purple/70 bg-purple/15"
                                : done
                                  ? "border-green/40 bg-green/[0.07]"
                                  : "border-line bg-panel hover:border-purple/40",
                            )}
                          >
                            <WordImage emoji={v.im} alt={v.uz} size="sm" />
                            <span className="min-w-0 flex-1">
                              <span className="ko block truncate text-[15px] font-bold">
                                {v.kr}
                              </span>
                              <span className="block truncate text-[12px] text-muted">
                                {v.uz}
                              </span>
                            </span>
                            {done && (
                              <Check
                                className="size-4 shrink-0 text-green"
                                strokeWidth={3}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <EmptyState
                      title="So‘z topilmadi."
                      hint="Boshqa mavzu tanlang yoki qidiruvni o‘zgartiring."
                    />
                  )}
                </>
              )}
            </div>

            {/* ---------- Mashq ---------- */}
            <div className="order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <WriteTrainer
                  key={target.text}
                  text={target.text}
                  meaning={target.meaning}
                />
                <p className="mt-3 text-center text-[11.5px] leading-relaxed text-muted">
                  Maslahat: avval «Ko‘rsatish» ni bosib tartibni ko‘ring,
                  keyin namuna ustidan yozing. Xato bo‘lsa mashq qaytadan
                  boshlanadi.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
