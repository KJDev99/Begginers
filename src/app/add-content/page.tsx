"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Library, Save, Target } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Example } from "@/data/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import AddContentLoading from "./loading";

const TABS = [
  { id: "formG", label: "Grammatika", icon: BookOpen },
  { id: "formV", label: "So‘z (Lug‘at)", icon: Library },
  { id: "formQ", label: "Test savoli", icon: Target },
] as const;

type TabId = (typeof TABS)[number]["id"];

const LEVEL_OPTIONS = ["A1", "A2", "B1", "B2"];

/* ---------- Umumiy maydonlar ---------- */

function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-4">
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[12.5px] font-bold text-muted"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11.5px] text-muted/80">{hint}</p>}
    </div>
  );
}

const control =
  "w-full rounded-xl border border-line bg-panel2 px-3.5 py-2.5 text-[14.5px] " +
  "outline-none transition-colors placeholder:text-muted/70 focus:border-cyan/60";

/* ---------- Grammatika formasi ---------- */

function GrammarForm({ defaultLevel }: { defaultLevel: string }) {
  const { addCustomGrammar } = useStore();
  const [level, setLevel] = useState(defaultLevel);

  useEffect(() => setLevel(defaultLevel), [defaultLevel]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const examples: Example[] = String(f.get("gEx") || "")
          .split("\n")
          .map((line) => line.split("|").map((s) => s.trim()))
          .filter((a) => a[0])
          .map((a) => [a[0], a[1] || ""]);

        addCustomGrammar({
          id: "cg" + Date.now(),
          t: String(f.get("gTitle") || "").trim(),
          tag: String(f.get("gTag") || "")
            .trim()
            .toUpperCase(),
          l: String(f.get("gLvl") || "A1"),
          d: String(f.get("gDesc") || "").trim(),
          f: String(f.get("gFormula") || "").trim(),
          ex: examples,
        });

        e.currentTarget.reset();
        setLevel(defaultLevel);
        toast.success("Grammatika saqlandi ✓");
      }}
    >
      <Field label="Nomi (masalan: ~고 싶다):" htmlFor="gTitle">
        <input id="gTitle" name="gTitle" required className={cn(control, "ko")} />
      </Field>

      <Field label="Bo‘lim (masalan: ISTAK-XOHISH):" htmlFor="gTag">
        <input id="gTag" name="gTag" required className={control} />
      </Field>

      <Field label="Daraja:" htmlFor="gLvl">
        <select
          id="gLvl"
          name="gLvl"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className={control}
        >
          {LEVEL_OPTIONS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </Field>

      <Field label="Tushuntirish:" htmlFor="gDesc">
        <textarea
          id="gDesc"
          name="gDesc"
          required
          rows={4}
          className={cn(control, "resize-y")}
        />
      </Field>

      <Field label="Formula:" htmlFor="gFormula">
        <input
          id="gFormula"
          name="gFormula"
          placeholder="Fe’l o‘zagi + 고 싶다"
          className={cn(control, "ko")}
        />
      </Field>

      <Field
        label="Misollar (har qatorda: koreyscha | o‘zbekcha):"
        htmlFor="gEx"
      >
        <textarea
          id="gEx"
          name="gEx"
          rows={4}
          placeholder="저는 가고 싶어요 | Men bormoqchiman"
          className={cn(control, "ko resize-y")}
        />
      </Field>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        <Save className="size-4" strokeWidth={2.4} />
        Saqlash
      </Button>
    </form>
  );
}

/* ---------- Lug'at formasi ---------- */

function VocabForm({ defaultLevel }: { defaultLevel: string }) {
  const { addCustomVocab } = useStore();
  const [level, setLevel] = useState(defaultLevel);

  useEffect(() => setLevel(defaultLevel), [defaultLevel]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);

        addCustomVocab({
          id: "cv" + Date.now(),
          kr: String(f.get("vKr") || "").trim(),
          uz: String(f.get("vUz") || "").trim(),
          pr: String(f.get("vPr") || "").trim(),
          g: String(f.get("vGr") || "").trim() || "Boshqa",
          l: String(f.get("vLvl") || "A1"),
        });

        e.currentTarget.reset();
        setLevel(defaultLevel);
        toast.success("So‘z saqlandi ✓");
      }}
    >
      <Field label="Koreyscha:" htmlFor="vKr">
        <input id="vKr" name="vKr" required className={cn(control, "ko")} />
      </Field>

      <Field label="O‘zbekcha:" htmlFor="vUz">
        <input id="vUz" name="vUz" required className={control} />
      </Field>

      <Field label="Talaffuz (lotin):" htmlFor="vPr">
        <input id="vPr" name="vPr" className={control} />
      </Field>

      <Field label="Daraja:" htmlFor="vLvl">
        <select
          id="vLvl"
          name="vLvl"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className={control}
        >
          {LEVEL_OPTIONS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </Field>

      <Field label="Guruh:" htmlFor="vGr">
        <input id="vGr" name="vGr" defaultValue="Boshqa" className={control} />
      </Field>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        <Save className="size-4" strokeWidth={2.4} />
        Saqlash
      </Button>
    </form>
  );
}

/* ---------- Test savoli formasi ---------- */

function QuizForm() {
  const { addCustomQuiz } = useStore();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const f = new FormData(form);

        const wrong = String(f.get("qW") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

        if (wrong.length < 2) {
          toast.error("Kamida 2 ta noto‘g‘ri variant kiriting");
          return;
        }

        addCustomQuiz({
          q: String(f.get("qQ") || "").trim(),
          a: String(f.get("qA") || "").trim(),
          w: wrong.slice(0, 3),
        });

        form.reset();
        toast.success("Savol saqlandi ✓");
      }}
    >
      <Field label="Savol:" htmlFor="qQ">
        <input id="qQ" name="qQ" required className={control} />
      </Field>

      <Field label="To‘g‘ri javob:" htmlFor="qA">
        <input id="qA" name="qA" required className={control} />
      </Field>

      <Field
        label="Noto‘g‘ri variantlar (vergul bilan, kamida 2 ta):"
        htmlFor="qW"
        hint="Masalan: Kitob, Daftar, Qalam"
      >
        <input id="qW" name="qW" required className={control} />
      </Field>

      <Button type="submit" variant="primary" size="lg" className="w-full">
        <Save className="size-4" strokeWidth={2.4} />
        Saqlash
      </Button>
    </form>
  );
}

/* ---------- Sahifa ---------- */

function AddContent() {
  const params = useSearchParams();
  const { state, ready } = useStore();

  const urlTab = params.get("tab");
  const urlLevel = params.get("level");

  const [tab, setTab] = useState<TabId>(
    TABS.some((t) => t.id === urlTab) ? (urlTab as TabId) : "formG",
  );

  useEffect(() => {
    if (TABS.some((t) => t.id === urlTab)) setTab(urlTab as TabId);
  }, [urlTab]);

  const defaultLevel =
    urlLevel && LEVEL_OPTIONS.includes(urlLevel) ? urlLevel : "A1";

  const counts = [
    { label: "Grammatika", value: state.cGrammar.length },
    { label: "So‘z", value: state.cVocab.length },
    { label: "Test savoli", value: state.cQuiz.length },
  ];

  return (
    <div>
      <SectionHead
        title="Yangi ma’lumot qo‘shish"
        subtitle="Grammatika, so‘z va test savollarini kiriting. Hammasi saqlanadi."
      />

      <div className="mx-auto max-w-2xl">
        {/* ---------- Qo'shilganlar ---------- */}
        {ready && (
          <div className="mb-5 grid grid-cols-3 gap-2.5">
            {counts.map((c) => (
              <div
                key={c.label}
                className="rounded-xl border border-line bg-panel px-3 py-2.5 text-center"
              >
                <p className="text-lg font-extrabold tabular-nums">{c.value}</p>
                <p className="text-[10.5px] font-bold text-muted">{c.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ---------- Tablar ---------- */}
        <div className="mb-5 flex gap-1.5 rounded-2xl border border-line bg-panel p-1.5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-pressed={active}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5",
                  "text-[12.5px] font-bold transition-colors duration-150",
                  active ? "text-ink" : "text-muted hover:text-text",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="addTabPill"
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-purple to-cyan"
                  />
                )}
                <Icon className="size-3.5 shrink-0" strokeWidth={2.4} />
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* ---------- Forma ---------- */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-line bg-panel p-5 sm:p-6"
        >
          {tab === "formG" && <GrammarForm defaultLevel={defaultLevel} />}
          {tab === "formV" && <VocabForm defaultLevel={defaultLevel} />}
          {tab === "formQ" && <QuizForm />}
        </motion.div>

        <p className="mt-4 text-center text-[11.5px] text-muted">
          Ma’lumotlar brauzeringizda saqlanadi — faqat sizga ko‘rinadi.
        </p>
      </div>
    </div>
  );
}

export default function AddContentPage() {
  return (
    <Suspense fallback={<AddContentLoading />}>
      <AddContent />
    </Suspense>
  );
}
