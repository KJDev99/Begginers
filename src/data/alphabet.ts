// Hangul alifbosi ma'lumotlari — asl loyihadan o'zgartirilmagan holda ko'chirilgan.
import type { Letter, LetterTuple } from "./types";

export const C: LetterTuple[] = [
        ["ㄱ", "g/k", 0],
        ["ㄴ", "n", 2],
        ["ㄷ", "d/t", 3],
        ["ㄹ", "r/l", 5],
        ["ㅁ", "m", 6],
        ["ㅂ", "b/p", 7],
        ["ㅅ", "s", 9],
        ["ㅇ", "ng / -", 11],
        ["ㅈ", "j", 12],
        ["ㅊ", "ch", 14],
        ["ㅋ", "k", 15],
        ["ㅌ", "t", 16],
        ["ㅍ", "p", 17],
        ["ㅎ", "h", 18],
      ];

export const DC: LetterTuple[] = [
        ["ㄲ", "kk", 1],
        ["ㄸ", "tt", 4],
        ["ㅃ", "pp", 8],
        ["ㅆ", "ss", 10],
        ["ㅉ", "jj", 13],
      ];

export const V: LetterTuple[] = [
        ["ㅏ", "a", 0],
        ["ㅑ", "ya", 2],
        ["ㅓ", "eo", 4],
        ["ㅕ", "yeo", 6],
        ["ㅗ", "o", 8],
        ["ㅛ", "yo", 12],
        ["ㅜ", "u", 13],
        ["ㅠ", "yu", 17],
        ["ㅡ", "eu", 18],
        ["ㅣ", "i", 20],
      ];

export const CV: LetterTuple[] = [
        ["ㅐ", "ae", 1],
        ["ㅒ", "yae", 3],
        ["ㅔ", "e", 5],
        ["ㅖ", "ye", 7],
        ["ㅘ", "wa", 9],
        ["ㅙ", "wae", 10],
        ["ㅚ", "oe", 11],
        ["ㅝ", "wo", 14],
        ["ㅞ", "we", 15],
        ["ㅟ", "wi", 16],
        ["ㅢ", "ui", 19],
      ];

export const LETTERS: [string, LetterTuple[], string][] = [
        ["Undoshlar (14)", C, "undosh"],
        ["Qo‘sh undoshlar (5)", DC, "qo‘sh undosh"],
        ["Unlilar (10)", V, "unli"],
        ["Murakkab unlilar (11)", CV, "murakkab unli"],
      ];

export const ALL_LETTERS: Letter[] = LETTERS.flatMap(([, a, k]) =>
  a.map((x) => ({ ch: x[0], s: x[1], k, i: x[2] })),
);

/** Bosh undosh + unli indeksidan bo'g'in yasaydi (ㄱ + ㅏ = 가). */
export const syl = (lead: number, vowel: number): string =>
  String.fromCharCode(0xac00 + (lead * 21 + vowel) * 28);

/** Harfni ovoz chiqarib o'qish uchun bo'g'inga aylantiradi. */
export const letterSpeech = (l: Letter): string =>
  l.k.includes("undosh") ? syl(l.i, 0) : syl(11, l.i);
