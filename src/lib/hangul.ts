/* ============================================================
   Hangul bilan ishlash: bo'g'inni jamo'larga ajratish,
   lotincha o'qilishi va yozuv mashqi uchun belgilar ro'yxati.
   ============================================================ */

const BASE = 0xac00;
const LAST = 0xd7a3;

/** Bosh undoshlar (초성) */
export const CHO = [..."ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"];

/** Unlilar (중성) */
export const JUNG = [..."ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"];

/** Yakuniy undoshlar (종성) — 0-chi bo'sh */
export const JONG = [
  "", ...[..."ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"],
];

const CHO_R = [
  "g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s",
  "ss", "", "j", "jj", "ch", "k", "t", "p", "h",
];

const JUNG_R = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa",
  "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i",
];

const JONG_R = [
  "", "k", "k", "k", "n", "n", "n", "t", "l", "k",
  "m", "l", "l", "l", "p", "l", "m", "p", "p", "t",
  "t", "ng", "t", "t", "k", "t", "p", "t",
];

/** Belgi hangul bo'g'inimi (가–힣)? */
export function isSyllable(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return c >= BASE && c <= LAST;
}

/** Belgi yakka jamo (ㄱ, ㅏ ...) mi? */
export function isJamo(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return c >= 0x3131 && c <= 0x318e;
}

/** Yozib mashq qilish mumkin bo'lgan belgimi? */
export const isWritable = (ch: string): boolean =>
  isSyllable(ch) || isJamo(ch);

/** Bo'g'inni jamo'larga ajratadi: `각` → `["ㄱ","ㅏ","ㄱ"]` */
export function decompose(ch: string): string[] {
  if (!isSyllable(ch)) return [ch];
  const n = (ch.codePointAt(0) as number) - BASE;
  const cho = Math.floor(n / 588);
  const jung = Math.floor((n % 588) / 28);
  const jong = n % 28;
  return jong ? [CHO[cho], JUNG[jung], JONG[jong]] : [CHO[cho], JUNG[jung]];
}

/** Bitta belgining lotincha o'qilishi: `각` → `gak`, `ㄱ` → `g` */
export function romanizeChar(ch: string): string {
  if (isSyllable(ch)) {
    const n = (ch.codePointAt(0) as number) - BASE;
    const cho = Math.floor(n / 588);
    const jung = Math.floor((n % 588) / 28);
    const jong = n % 28;
    return CHO_R[cho] + JUNG_R[jung] + JONG_R[jong];
  }
  const ci = CHO.indexOf(ch);
  if (ci >= 0) return CHO_R[ci] || "ng";
  const vi = JUNG.indexOf(ch);
  if (vi >= 0) return JUNG_R[vi];
  const ji = JONG.indexOf(ch);
  if (ji > 0) return JONG_R[ji];
  return ch;
}

/** Matnning lotincha o'qilishi (bo'g'inlar orasida chiziqcha yo'q). */
export const romanize = (text: string): string =>
  [...text].map(romanizeChar).join("");

/**
 * Matndan yozuv mashqi uchun belgilar ro'yxati — bo'shliq va
 * tinish belgilari tashlab yuboriladi.
 */
export const writableChars = (text: string): string[] =>
  [...text].filter(isWritable);
