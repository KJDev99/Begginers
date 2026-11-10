"use client";

import { useMemo, useState } from "react";
import { Check, Layers, PenLine, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import { ButtonLink } from "@/components/ui/Button";
import { Chip, ChipRow } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { AudioButton } from "@/components/ui/AudioButton";
import { SectionHead } from "@/components/ui/SectionHead";
import { WordImage } from "@/components/ui/WordImage";
import { WriteButton } from "@/components/WriteButton";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import {
  ChipsSkeleton,
  ListSkeleton,
  Skeleton,
} from "@/components/ui/Skeleton";
import type { VocabWord } from "@/data/types";
import { GROUP_EMOJI } from "@/data/vocab-emoji";
import { LEVELS } from "@/lib/korean";
import { memorizedWords } from "@/lib/progress";
import { useStore } from "@/lib/store";
import { useSessionState } from "@/lib/useSessionState";
import { cn } from "@/lib/utils";

/** Bitta bo'lim: guruh nomi, so'zlari va boshlang'ich tartib raqami. */
type Section = { group: string; words: VocabWord[]; start: number };

export default function VocabularyPage() {
  const { state, ready, vocab, toggleMemorized } = useStore();

  const [level, setLevel] = useSessionState("v.level", "Hammasi");
  const [group, setGroup] = useSessionState("v.group", "Hammasi");
  const [query, setQuery] = useState("");

  const groups = useMemo(
    () => ["Hammasi", "Yodlanmagan", ...new Set(vocab.map((v) => v.g))],
    [vocab],
  );

  const q = query.toLowerCase().trim();

  const list = useMemo(
    () =>
      vocab.filter(
        (v) =>
          (level === "Hammasi" || (v.l || "A1") === level) &&
          (group === "Hammasi" ||
            (group === "Yodlanmagan"
              ? (state.box[v.id] || 0) < 3
              : v.g === group)) &&
          (!q || `${v.kr}${v.uz}${v.pr}`.toLowerCase().includes(q)),
      ),
    [vocab, level, group, q, state.box],
  );

  /** So'zlar guruhlar bo'yicha ketma-ket, raqamlash uzluksiz: 1, 2, 3 ... */
  const sections = useMemo<Section[]>(() => {
    const map = new Map<string, VocabWord[]>();
    for (const v of list) {
      const arr = map.get(v.g);
      if (arr) arr.push(v);
      else map.set(v.g, [v]);
    }
    let n = 1;
    return [...map.entries()].map(([g, words]) => {
      const s: Section = { group: g, words, start: n };
      n += words.length;
      return s;
    });
  }, [list]);

  const known = memorizedWords(state);

  return (
    <div>
      <SectionHead
        title="Beginner lug‘ati"
        subtitle="Mavzular ketma-ket, har bir so‘z rasmi bilan. Tinglang, yozing, takrorlang."
        action={
          <>
            <ButtonLink href="/vocabulary/flashcard" variant="primary">
              <Layers className="size-4" strokeWidth={2.5} />
              Flashcard
            </ButtonLink>
            <ButtonLink href="/writing" variant="soft">
              <PenLine className="size-4" strokeWidth={2.5} />
              Yozuv mashqi
            </ButtonLink>
            <ButtonLink
              href={`/add-content?tab=formV${level !== "Hammasi" ? `&level=${level}` : ""}`}
              variant="soft"
            >
              <Plus className="size-4" strokeWidth={2.6} />
              So‘z qo‘shish
            </ButtonLink>
          </>
        }
      />

      {!ready ? (
        <>
          <ChipsSkeleton />
          <ChipsSkeleton count={7} />
          <Skeleton className="mb-5 h-12 rounded-2xl" />
          <ListSkeleton />
        </>
      ) : (
        <>
          {/* ---------- Daraja ---------- */}
          <ChipRow className="mb-3">
            {LEVELS.map((l) => (
              <Chip
                key={l}
                active={l === level}
                onClick={() => setLevel(l)}
                count={
                  l === "Hammasi"
                    ? vocab.length
                    : vocab.filter((v) => (v.l || "A1") === l).length
                }
              >
                {l}
              </Chip>
            ))}
          </ChipRow>

          {/* ---------- Guruh ---------- */}
          <ChipRow className="mb-5">
            {groups.map((gr) => (
              <Chip key={gr} active={gr === group} onClick={() => setGroup(gr)}>
                {gr !== "Hammasi" && gr !== "Yodlanmagan" && (
                  <span aria-hidden>{GROUP_EMOJI[gr] || "📘"}</span>
                )}
                {gr}
              </Chip>
            ))}
          </ChipRow>

          {/* ---------- Qidiruv ---------- */}
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Qidirish"
              placeholder="Koreyscha yoki o‘zbekcha qidirish..."
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

          <p className="mb-4 text-[12.5px] font-bold text-muted">
            Ko‘rsatilmoqda:{" "}
            <span className="text-cyan tabular-nums">{list.length}</span> ta ·
            Yodlangan: <span className="text-green tabular-nums">{known}</span>{" "}
            ta · Mavzular:{" "}
            <span className="text-purple tabular-nums">{sections.length}</span>{" "}
            ta
          </p>

          {/* ---------- Mavzular ketma-ket ---------- */}
          {sections.length ? (
            <div className="space-y-7">
              {sections.map((sec) => (
                <section key={sec.group}>
                  <h3 className="mb-3 flex items-center gap-2.5 text-[11px] font-extrabold tracking-[1.8px] text-muted">
                    <span aria-hidden className="text-[15px]">
                      {GROUP_EMOJI[sec.group] || "📘"}
                    </span>
                    {sec.group.toUpperCase()}
                    <span className="h-px flex-1 bg-line" />
                    <span className="tabular-nums">{sec.words.length} ta</span>
                  </h3>

                  <Stagger className="space-y-2" step={0.012}>
                    {sec.words.map((v, i) => {
                      const memorized = (state.box[v.id] || 0) >= 3;
                      const no = sec.start + i;
                      return (
                        <StaggerItem key={v.id}>
                          <div
                            className={cn(
                              "flex items-center gap-2.5 rounded-2xl border p-3 transition-all duration-200 sm:gap-3 sm:p-3.5",
                              memorized
                                ? "border-green/40 bg-green/[0.06]"
                                : "border-line bg-panel hover:border-cyan/35",
                            )}
                          >
                            {/* Tartib raqami */}
                            <span className="w-6 shrink-0 text-center text-[11.5px] font-extrabold text-muted tabular-nums">
                              {no}
                            </span>

                            {/* Rasm */}
                            <WordImage emoji={v.im} alt={v.uz} size="md" />

                            {/* Matn */}
                            <div className="min-w-0 flex-1">
                              <p className="ko truncate text-[17px] font-bold">
                                {v.kr}
                              </p>
                              <p className="truncate text-[13.5px] text-muted">
                                {v.uz}
                              </p>
                              {v.pr && (
                                <p className="truncate text-[11.5px] text-cyan/80 italic">
                                  {v.pr}
                                </p>
                              )}
                            </div>

                            {/* Amallar */}
                            <div className="flex shrink-0 items-center gap-1.5">
                              <AudioButton text={v.kr} size="sm" />
                              <WriteButton
                                text={v.kr}
                                meaning={v.uz}
                                size="sm"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const next = toggleMemorized(v.id);
                                  toast[next ? "success" : "info"](
                                    next
                                      ? `${v.kr} — yodlangan ✓  +3 XP`
                                      : `${v.kr} — takrorlashga qaytarildi`,
                                  );
                                }}
                                aria-pressed={memorized}
                                title={memorized ? "Yodlangan" : "Yodladim"}
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-xl border px-2 py-2 sm:px-3",
                                  "text-[12.5px] font-bold transition-all duration-150 active:scale-95",
                                  memorized
                                    ? "border-green/50 bg-green/15 text-green"
                                    : "border-line bg-panel2 text-muted hover:border-cyan/50 hover:text-text",
                                )}
                              >
                                <Check className="size-3.5" strokeWidth={3} />
                                <span className="hidden sm:inline">
                                  {memorized ? "Yodlangan" : "Yodladim"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </StaggerItem>
                      );
                    })}
                  </Stagger>
                </section>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Hech narsa topilmadi."
              hint="Boshqa guruh yoki daraja tanlab ko‘ring."
            />
          )}
        </>
      )}
    </div>
  );
}
