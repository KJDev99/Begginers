import { esc } from "./utils";

/** Bosh undoshlar — grammatika shakllarini harf bo'yicha guruhlash uchun. */
export const CONS: string[] = [..."ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ"];

/**
 * Hangul bosh undosh indeksini (0–18) `CONS` dagi o'ringa moslaydi:
 * qo'sh undoshlar (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ) oddiy juftiga qo'shiladi.
 */
export const BASE: number[] = [
  0, 0, 1, 2, 2, 3, 4, 5, 5, 6, 6, 7, 8, 8, 9, 10, 11, 12, 13,
];

/** Grammatika turkumlarining o'zbekcha nomlari. */
export const CAT: Record<string, string> = {
  조사: "Kelishik, yuklama (조사)",
  선어말어미: "Zamon/hurmat qo‘shimchasi (선어말어미)",
  연결어미: "Bog‘lovchi qo‘shimcha (연결어미)",
  종결어미: "Gap yakunlovchi qo‘shimcha (종결어미)",
  전성어미: "Shakl o‘zgartiruvchi qo‘shimcha (전성어미)",
  표현: "Grammatik ifoda (표현)",
};

/** Darajalar ro'yxati (filtrlar uchun). */
export const LEVELS = ["Hammasi", "A1", "A2", "B1", "B2"] as const;

/** Daraja raqamini yorliqqa aylantirish: 1 → A1. */
export const LVM: Record<number, string> = {
  1: "A1",
  2: "A2",
  3: "B1",
  4: "B2",
};

/** Matndagi birinchi hangul bo'g'inining bosh undoshini qaytaradi. */
export function initialConsonant(form: string): string {
  const m = /[가-힣]/.exec(form);
  if (!m) return "";
  return CONS[BASE[Math.floor((m[0].charCodeAt(0) - 0xac00) / 588)]];
}

/**
 * `{...}` ichidagi qismni qalin qiladi — asl loyihadagi `gR` bilan bir xil.
 * Matn allaqachon ishonchli (loyiha ma'lumotlari), HTML teglar saqlanadi.
 */
export function rich(s: unknown): string {
  return String(s).replace(/\{([^}]*)\}/g, "<b>$1</b>");
}

/** `rich`, lekin avval HTML belgilarini xavfsizlashtiradi (asl `gB`). */
export function richEscaped(s: unknown): string {
  return rich(esc(s));
}

/** Ovoz chiqarib o'qishdan oldin `{}` belgilarini olib tashlash. */
export const plain = (s: string): string => s.replace(/[{}]/g, "");
