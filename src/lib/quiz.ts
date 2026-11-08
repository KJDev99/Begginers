import type { CustomQuiz, VocabWord, WrongQuestion } from "@/data/types";
import { shuffle } from "./utils";

export type QuestionType = "uz" | "kr" | "listen" | "custom";

export type Question = {
  id: string;
  type: QuestionType | string;
  /** Savol matni */
  q: string;
  /** Savol ostidagi izoh */
  sub: string;
  /** To'g'ri javob */
  a: string;
  /** Variantlar */
  opts: string[];
  /** Ovoz chiqarib o'qiladigan matn */
  say?: string;
  /** Savol ochilishi bilan avtomatik o'qilsinmi */
  auto?: boolean;
  /** Bu savolda xato qilingan */
  missed?: boolean;
};

const QUESTION_TYPES: QuestionType[] = ["uz", "kr", "listen"];

/** Bitta so'zdan savol yasaydi (asl `mkQuestion`). */
export function makeQuestion(
  v: VocabWord,
  type: QuestionType,
  all: VocabWord[],
): Question {
  const others = shuffle(all.filter((x) => x.id !== v.id)).slice(0, 3);

  if (type === "uz") {
    return {
      id: v.id + type,
      type,
      q: v.kr,
      sub: "Bu so‘z nima degani?",
      a: v.uz,
      opts: shuffle([v.uz, ...others.map((o) => o.uz)]),
      say: v.kr,
    };
  }

  if (type === "kr") {
    return {
      id: v.id + type,
      type,
      q: v.uz,
      sub: "Koreyscha qaysi?",
      a: v.kr,
      opts: shuffle([v.kr, ...others.map((o) => o.kr)]),
    };
  }

  return {
    id: v.id + type,
    type,
    q: "Tinglang",
    sub: "Eshitgan so‘zingiz qaysi?",
    a: v.kr,
    opts: shuffle([v.kr, ...others.map((o) => o.kr)]),
    say: v.kr,
    auto: true,
  };
}

export type QuizOptions = {
  vocab: VocabWord[];
  customQuiz: CustomQuiz[];
  wrong: WrongQuestion[];
  /** `Hammasi` | `A1` | `A2` | `B1` | `B2` */
  level: string;
  /** Savollar soni yoki `all` */
  count: number | "all";
};

/** Test savollarini yig'adi (asl `startQuiz` mantig'i). */
export function buildQuiz({
  vocab,
  customQuiz,
  wrong,
  level,
  count,
}: QuizOptions): Question[] {
  const pool = vocab.filter((v) => level === "Hammasi" || (v.l || "A1") === level);
  const take = count === "all" ? pool.length : count;

  const fromVocab = shuffle(pool)
    .slice(0, take)
    .map((v, i) => makeQuestion(v, QUESTION_TYPES[i % 3], vocab));

  const customTake =
    count === "all" ? customQuiz.length : Math.ceil(Number(count) / 4);

  const fromCustom: Question[] = shuffle(customQuiz)
    .slice(0, customTake)
    .map((c, i) => ({
      id: "c" + i + c.q,
      type: "custom" as const,
      q: c.q,
      sub: "To‘g‘ri javobni tanlang",
      a: c.a,
      opts: shuffle([c.a, ...c.w]),
    }));

  const questions = shuffle([...fromVocab, ...fromCustom]);

  // Oldingi xato qilingan savollarni oxiriga qo'shamiz.
  wrong.slice(0, 3).forEach((w) => {
    questions.push({ ...w, opts: shuffle(w.opts) });
  });

  return questions;
}
