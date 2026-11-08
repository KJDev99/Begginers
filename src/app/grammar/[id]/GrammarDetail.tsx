"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  MessageSquare,
  Plus,
  Quote,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import { RichText } from "@/components/RichText";
import { AudioButton } from "@/components/ui/AudioButton";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import type { Example } from "@/data/types";
import { allGrammar } from "@/lib/grammar";
import { CAT, rich, richEscaped } from "@/lib/korean";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const MARKS = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧"];

/** Sarlavhali bo'lim. */
function Block({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof BookOpen;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-panel p-5 sm:p-6">
      <h3 className="mb-4 flex items-center gap-2 text-[11px] font-extrabold tracking-[1.6px] text-cyan">
        <Icon className="size-3.5" strokeWidth={2.6} />
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Koreyscha + o'zbekcha misol qatori. */
function ExampleRow({
  kr,
  uz,
  speaker,
}: {
  kr: string;
  uz: string;
  speaker?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line/60 py-3 last:border-0">
      <div className="min-w-0">
        <p className="ko text-[15.5px] leading-relaxed font-semibold">
          {speaker && (
            <span className="mr-1.5 inline-block w-4 text-[11px] font-extrabold text-purple">
              {speaker}
            </span>
          )}
          <RichText html={richEscaped(kr)} />
        </p>
        {uz && <p className="mt-0.5 text-[13.5px] text-muted">{uz}</p>}
      </div>
      <AudioButton text={kr} size="sm" />
    </div>
  );
}

/** Grammatika mavzusining interaktiv qismi (o'qildi belgisi, izohlar, audio). */
export function GrammarDetail({ id }: { id: string }) {
  const {
    state,
    ready,
    markGrammarRead,
    addGrammarExample,
    addGrammarException,
    note,
  } = useStore();

  const g = useMemo(
    () => allGrammar(state.cGrammar).find((x) => x.id === id),
    [state.cGrammar, id],
  );

  const [exDraft, setExDraft] = useState("");
  const [excDraft, setExcDraft] = useState("");

  // Ochilganda o'qilgan deb belgilaymiz (+5 XP).
  useEffect(() => {
    if (!ready || !g) return;
    if (markGrammarRead(g.id)) toast.success("O‘qilgan deb belgilandi · +5 XP");
    // faqat mavzu o'zgarganda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, g?.id]);

  if (!ready) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-9 w-28 rounded-xl" />
        <div className="skeleton h-44 rounded-2xl" />
        <div className="skeleton h-56 rounded-2xl" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    );
  }

  if (!g) {
    return (
      <EmptyState
        icon={BookOpen}
        title="Bunday grammatika topilmadi"
        hint="Mavzu o‘chirilgan yoki havola noto‘g‘ri bo‘lishi mumkin."
        action={
          <Link
            href="/grammar"
            className="mt-2 text-sm font-bold text-cyan hover:underline"
          >
            Grammatika ro‘yxatiga qaytish
          </Link>
        }
      />
    );
  }

  const n = note(g.id);
  const examples: Example[] = [...g.e, ...n.ex];

  return (
    // O'qish uchun qulay kenglik
    <div className="mx-auto max-w-4xl space-y-4">
      <Link
        href="/grammar"
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-panel2 px-3.5 py-2 text-[13px] font-bold text-muted transition-colors hover:border-cyan/40 hover:text-text"
      >
        <ArrowLeft className="size-4" strokeWidth={2.4} />
        Grammatika
      </Link>

      {/* ---------- Sarlavha ---------- */}
      <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-panel p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full opacity-[0.14] blur-3xl"
          style={{ background: "var(--color-purple)" }}
        />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-purple/40 bg-purple/15 px-2.5 py-1 text-[10px] font-extrabold tracking-wide text-purple">
              {g.l}
            </span>
            {g.i && (
              <span className="ko rounded-full border border-line bg-panel2 px-2.5 py-1 text-[10px] font-bold text-muted">
                {g.i}
              </span>
            )}
            {state.gread[g.id] && (
              <span className="inline-flex items-center gap-1 rounded-full border border-green/40 bg-green/10 px-2.5 py-1 text-[10px] font-extrabold text-green">
                <Check className="size-3" strokeWidth={3.4} />
                O‘qilgan
              </span>
            )}
          </div>

          <h2 className="ko mt-4 flex flex-wrap items-center gap-3 text-[30px] leading-tight font-black sm:text-[38px]">
            {g.f}
            <AudioButton text={g.f} />
          </h2>

          <dl className="mt-6 grid gap-2.5 sm:grid-cols-3">
            {[
              ["DARAJA", g.l, false],
              ["TURKUM", CAT[g.c] || g.c || "—", false],
              ["BOG‘LIQ SHAKLLAR", g.v || "—", true],
            ].map(([label, value, korean]) => (
              <div
                key={label as string}
                className="rounded-xl border border-line bg-panel2 px-3.5 py-2.5"
              >
                <dt className="text-[9.5px] font-extrabold tracking-[1.2px] text-purple">
                  {label as string}
                </dt>
                <dd
                  className={cn(
                    "mt-1 text-[13px] font-semibold",
                    korean && "ko",
                  )}
                >
                  {value as string}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Reveal>

      {/* ---------- Ma'nosi ---------- */}
      <Block title="MA’NOSI VA QO‘LLANISHI" icon={BookOpen}>
        <p className="text-[14.5px] leading-[1.8]">
          <RichText html={rich(g.m)} />
        </p>
        {g.u && (
          <div className="mt-4 rounded-r-lg border-l-4 border-cyan bg-hover px-4 py-3 text-[14px] leading-[1.75]">
            <b className="text-cyan">O‘zbekcha muqobili:</b>{" "}
            <RichText html={rich(g.u)} />
          </div>
        )}
      </Block>

      {/* ---------- Dialoglar ---------- */}
      {g.d.length > 0 && (
        <Block title="DIALOG MISOLLARI" icon={MessageSquare}>
          <div className="space-y-3">
            {g.d.map((dialog, di) => (
              <div
                key={di}
                className="rounded-2xl border border-dashed border-line px-4 py-1"
              >
                {dialog.map((line, li) => (
                  <ExampleRow
                    key={li}
                    kr={line[0]}
                    uz={line[1]}
                    speaker={li % 2 ? "B" : "A"}
                  />
                ))}
              </div>
            ))}
          </div>
        </Block>
      )}

      {/* ---------- Gap misollari ---------- */}
      <Block title="GAP MISOLLARI" icon={Quote}>
        {examples.length > 0 ? (
          <div className="mb-4">
            {examples.map((x, i) => (
              <ExampleRow key={i} kr={x[0]} uz={x[1]} />
            ))}
          </div>
        ) : (
          <p className="mb-4 text-sm text-muted">Hozircha yo‘q</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const parts = exDraft.split("|").map((s) => s.trim());
            if (!parts[0]) {
              toast.error("Koreyscha misolni kiriting");
              return;
            }
            addGrammarExample(g.id, [parts[0], parts[1] || ""]);
            setExDraft("");
            toast.success("Misol qo‘shildi ✓");
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            value={exDraft}
            onChange={(e) => setExDraft(e.target.value)}
            placeholder="Koreyscha | O‘zbekcha"
            aria-label="Yangi misol"
            className="ko w-full rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-sm transition-colors outline-none placeholder:text-muted focus:border-cyan/60"
          />
          <Button type="submit" variant="soft" className="shrink-0">
            <Plus className="size-4" strokeWidth={2.6} />
            Misol
          </Button>
        </form>
      </Block>

      {/* ---------- Qo'shilish qoidalari ---------- */}
      {g.r.length > 0 && (
        <Block title="QO‘SHILISH QOIDALARI" icon={Check}>
          <div className="space-y-4">
            {g.r.map((r, k) => {
              const cells = r[1] || [];
              const pairs: [string, string][] = [];
              for (let j = 0; j < cells.length; j += 2)
                pairs.push([cells[j], cells[j + 1] || ""]);

              return (
                <div key={k}>
                  <p className="rounded-xl bg-panel2 px-4 py-3 text-[14px] leading-relaxed font-semibold">
                    <span className="mr-1.5 text-purple">
                      {MARKS[k] || "•"}
                    </span>
                    {r[0]}
                  </p>

                  {pairs.length > 0 && (
                    <div className="mt-2 overflow-hidden rounded-xl border border-line">
                      <table className="w-full border-collapse">
                        <tbody>
                          {pairs.map((p, j) => (
                            <tr key={j} className="even:bg-hover">
                              <td className="ko w-1/2 border-r border-b border-line px-3.5 py-2.5 text-[13.5px] font-medium last:border-r-0">
                                {p[0]}
                              </td>
                              <td className="ko w-1/2 border-b border-line px-3.5 py-2.5 text-[13.5px] font-medium">
                                {p[1]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {r[2] && (
                    <p className="mt-2 text-[12.5px] text-muted">* {r[2]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Block>
      )}

      {/* ---------- Istisnolar ---------- */}
      <Block title="ISTISNOLAR" icon={TriangleAlert}>
        {n.exc.length > 0 ? (
          <ul className="mb-4 space-y-2">
            {n.exc.map((x, i) => (
              <li
                key={i}
                className="rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-[13.5px]"
              >
                {x}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-sm text-muted">Hozircha yo‘q</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = excDraft.trim();
            if (!v) {
              toast.error("Istisno matnini kiriting");
              return;
            }
            addGrammarException(g.id, v);
            setExcDraft("");
            toast.success("Istisno qo‘shildi ✓");
          }}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <input
            value={excDraft}
            onChange={(e) => setExcDraft(e.target.value)}
            placeholder="Istisno yozing"
            aria-label="Yangi istisno"
            className="w-full rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-sm transition-colors outline-none placeholder:text-muted focus:border-cyan/60"
          />
          <Button type="submit" variant="soft" className="shrink-0">
            <Plus className="size-4" strokeWidth={2.6} />
            Istisno
          </Button>
        </form>
      </Block>
    </div>
  );
}
