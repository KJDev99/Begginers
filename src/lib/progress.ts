import { ALL_LETTERS } from "@/data/alphabet";
import type { AppState } from "@/data/types";

/** O'rganilgan deb belgilangan harflar soni. */
export const learnedLetters = (s: AppState): number =>
  Object.values(s.letters).filter(Boolean).length;

/** Yodlangan so'zlar soni (Leitner qutisi 3 va undan katta). */
export const memorizedWords = (s: AppState): number =>
  Object.values(s.box).filter((b) => b >= 3).length;

/** XP ga qarab daraja. */
export const levelOf = (s: AppState): string => (s.xp >= 1000 ? "A2" : "A1");

export type ProgressVals = {
  /** Alifbo ulushi (0–1) */
  a: number;
  /** Lug'at ulushi (0–1) */
  v: number;
  /** Grammatika ulushi (0–1) */
  g: number;
  /** Umumiy o'rtacha (0–1) */
  t: number;
};

/** Uch bo'lim bo'yicha rivojlanish ulushlari. */
export function progressVals(
  s: AppState,
  vocabCount: number,
  grammarCount: number,
): ProgressVals {
  const safe = (n: number, d: number) => (d > 0 ? n / d : 0);
  const a = safe(learnedLetters(s), ALL_LETTERS.length);
  const v = safe(memorizedWords(s), vocabCount);
  const g = safe(Object.keys(s.gread).length, grammarCount);
  return { a, v, g, t: (a + v + g) / 3 };
}
