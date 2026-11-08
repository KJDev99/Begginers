"use client";

import { useMemo, useState } from "react";
import { Check, Layers, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import { ButtonLink } from "@/components/ui/Button";
import { Chip, ChipRow } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { AudioButton } from "@/components/ui/AudioButton";
import { SectionHead } from "@/components/ui/SectionHead";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import {
  ChipsSkeleton,
  ListSkeleton,
  Skeleton,
} from "@/components/ui/Skeleton";
import { LEVELS } from "@/lib/korean";
import { memorizedWords } from "@/lib/progress";
import { useStore } from "@/lib/store";
import { useSessionState } from "@/lib/useSessionState";
import { cn } from "@/lib/utils";

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

  const known = memorizedWords(state);

  return (
    <div>
      <SectionHead
        title="Beginner lug‘ati"
        subtitle="Qidiring, tinglang, flashcard bilan takrorlang."
        action={
          <>
            <ButtonLink href="/vocabulary/flashcard" variant="primary">
              <Layers className="size-4" strokeWidth={2.5} />
              Flashcard
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
            Yodlangan:{" "}
            <span className="text-green tabular-nums">{known}</span> ta
          </p>

          {/* ---------- Ro'yxat ---------- */}
          {list.length ? (
            <Stagger className="space-y-2" step={0.012}>
              {list.map((v) => {
                const memorized = (state.box[v.id] || 0) >= 3;
                return (
                  <StaggerItem key={v.id}>
                    <div
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all duration-200",
                        memorized
                          ? "border-green/40 bg-green/[0.06]"
                          : "border-line bg-panel hover:border-cyan/35",
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <AudioButton text={v.kr} />
                        <div className="min-w-0">
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
                      </div>

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
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2",
                          "text-[12.5px] font-bold transition-all duration-150 active:scale-95",
                          memorized
                            ? "border-green/50 bg-green/15 text-green"
                            : "border-line bg-panel2 text-muted hover:border-cyan/50 hover:text-text",
                        )}
                      >
                        {memorized && (
                          <Check className="size-3.5" strokeWidth={3} />
                        )}
                        {memorized ? "Yodlangan" : "Yodladim"}
                      </button>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
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
