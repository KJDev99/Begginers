"use client";

import { Check } from "lucide-react";
import { toast } from "sonner";

import { AudioButton } from "@/components/ui/AudioButton";
import { WriteButton } from "@/components/WriteButton";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { CardGridSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { ALL_LETTERS, LETTERS, letterSpeech } from "@/data/alphabet";
import { learnedLetters } from "@/lib/progress";
import { useStore } from "@/lib/store";
import { cn, pct } from "@/lib/utils";

export default function AlphabetPage() {
  const { state, ready, toggleLetter } = useStore();
  const done = learnedLetters(state);

  return (
    <div>
      <SectionHead
        title="Hangul alifbosi — 한글"
        subtitle="Harfni bosib o‘rganilgan deb belgilang, talaffuzini tinglang yoki ✎ tugmasi bilan yozib mashq qiling."
      />

      {/* ---------- Umumiy rivojlanish ---------- */}
      {ready ? (
        <Reveal className="mb-8 rounded-2xl border border-line bg-panel p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold">
              O‘rganilgan harflar:{" "}
              <span className="text-cyan tabular-nums">
                {done} / {ALL_LETTERS.length}
              </span>
            </p>
            <p className="text-xs font-bold text-muted tabular-nums">
              {pct(done / ALL_LETTERS.length)}%
            </p>
          </div>
          <ProgressBar
            value={pct(done / ALL_LETTERS.length)}
            label="Alifbo rivojlanishi"
          />
        </Reveal>
      ) : (
        <Skeleton className="mb-8 h-24 rounded-2xl" />
      )}

      {/* ---------- Harflar ---------- */}
      {!ready ? (
        <div className="space-y-8">
          {[14, 5, 10, 11].map((n, i) => (
            <div key={i}>
              <Skeleton className="mb-4 h-4 w-44" />
              <CardGridSkeleton
                count={n}
                className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7"
                itemClassName="h-[118px] rounded-2xl"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-9">
          {LETTERS.map(([title, arr, kind]) => (
            <section key={title}>
              <h3 className="mb-4 flex items-center gap-3 text-[11px] font-extrabold tracking-[1.8px] text-muted">
                {title.toUpperCase()}
                <span className="h-px flex-1 bg-line" />
              </h3>

              <Stagger
                className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7"
                step={0.018}
              >
                {arr.map((x) => {
                  const letter = { ch: x[0], s: x[1], k: kind, i: x[2] };
                  const learned = Boolean(state.letters[letter.ch]);

                  return (
                    <StaggerItem key={letter.ch}>
                      <div
                        role="button"
                        tabIndex={0}
                        aria-pressed={learned}
                        aria-label={`${letter.ch} — ${letter.s}`}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter" && e.key !== " ") return;
                          e.preventDefault();
                          e.currentTarget.click();
                        }}
                        onClick={() => {
                          const next = toggleLetter(letter.ch);
                          toast[next ? "success" : "info"](
                            next
                              ? `${letter.ch} — o‘rganildi ✓  +2 XP`
                              : `${letter.ch} — belgi olib tashlandi`,
                          );
                        }}
                        className={cn(
                          "group relative flex cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden",
                          "rounded-2xl border px-4 pt-4 pb-11 transition-all duration-200",
                          "hover:-translate-y-0.5",
                          learned
                            ? "border-green/50 bg-green/[0.08]"
                            : "border-line bg-panel hover:border-cyan/40",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-2 right-2 grid size-5 place-items-center rounded-full transition-all duration-200",
                            learned
                              ? "scale-100 bg-green text-ink opacity-100"
                              : "scale-50 opacity-0",
                          )}
                        >
                          <Check className="size-3" strokeWidth={3.4} />
                        </span>

                        <span className="ko text-[34px] leading-none font-black">
                          {letter.ch}
                        </span>
                        <span className="mt-1 text-[13px] font-bold text-cyan">
                          {letter.s}
                        </span>
                        <span className="text-[10px] text-muted">{kind}</span>

                        <span className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 opacity-70 transition-opacity duration-150 group-hover:opacity-100">
                          <AudioButton
                            text={letterSpeech(letter)}
                            size="sm"
                            label={`${letter.ch} talaffuzini tinglash`}
                          />
                          <WriteButton
                            text={letter.ch}
                            meaning={letter.s}
                            size="sm"
                            label="Yozib mashq qilish"
                          />
                        </span>
                      </div>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
