import { ALL_LETTERS } from "@/data/alphabet";
import { VOCAB } from "@/data/vocab";
import type { AppState } from "@/data/types";
import { writableChars } from "@/lib/hangul";

/** O'rganilgan deb belgilangan harflar soni. */
export const learnedLetters = (s: AppState): number =>
  Object.values(s.letters).filter(Boolean).length;

/** Yodlangan so'zlar soni (Leitner qutisi 3 va undan katta). */
export const memorizedWords = (s: AppState): number =>
  Object.values(s.box).filter((b) => b >= 3).length;

/** Yozuv mashqida yozilgan belgilar soni. */
export const writtenChars = (s: AppState): number =>
  Object.keys(s.wrote || {}).length;

/** Yozib mashq qilish mumkin bo'lgan barcha belgilar (harflar + lug'at bo'g'inlari). */
export const ALL_WRITABLE: number = (() => {
  const set = new Set<string>();
  for (const l of ALL_LETTERS) set.add(l.ch);
  for (const v of VOCAB) for (const c of writableChars(v.kr)) set.add(c);
  return set.size;
})();

/** XP ga qarab daraja. */
export const levelOf = (s: AppState): string => (s.xp >= 1000 ? "A2" : "A1");

export type ProgressVals = {
  /** Alifbo ulushi (0–1) */
  a: number;
  /** Lug'at ulushi (0–1) */
  v: number;
  /** Grammatika ulushi (0–1) */
  g: number;
  /** Yozuv mashqi ulushi (0–1) */
  w: number;
  /** Umumiy o'rtacha (0–1) */
  t: number;
};

/** To'rt bo'lim bo'yicha rivojlanish ulushlari. */
export function progressVals(
  s: AppState,
  vocabCount: number,
  grammarCount: number,
): ProgressVals {
  const safe = (n: number, d: number) => (d > 0 ? n / d : 0);
  const a = safe(learnedLetters(s), ALL_LETTERS.length);
  const v = safe(memorizedWords(s), vocabCount);
  const g = safe(Object.keys(s.gread).length, grammarCount);
  const w = safe(writtenChars(s), ALL_WRITABLE);
  return { a, v, g, w, t: (a + v + g + w) / 4 };
}
