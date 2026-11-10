/* ============================================================
   Ma'lumot tiplari
   ============================================================ */

/* ---------- Alifbo ---------- */

/** `[belgi, talaffuz, hangul indeksi]` */
export type LetterTuple = [string, string, number];

export type Letter = {
  /** Hangul belgisi, masalan `ㄱ` */
  ch: string;
  /** Lotincha talaffuz, masalan `g/k` */
  s: string;
  /** Turi: `undosh`, `qo'sh undosh`, `unli`, `murakkab unli` */
  k: string;
  /** Hangul jadvalidagi indeks (bo'g'in yasash uchun) */
  i: number;
};

/* ---------- Lug'at ---------- */

export type VocabWord = {
  id: string;
  /** Koreyscha */
  kr: string;
  /** O'zbekcha */
  uz: string;
  /** Talaffuz (lotin) */
  pr: string;
  /** Guruh, masalan `Salomlashuv` */
  g: string;
  /** Daraja: A1 | A2 | B1 | B2 */
  l: string;
  /** Rasm (emoji) — `vocab-emoji.ts` dan */
  im: string;
};

/* ---------- Grammatika ---------- */

/** Dialogdagi bitta qator: `[koreyscha, o'zbekcha]` */
export type DialogLine = [string, string];

/** Bitta dialog — navbatma-navbat A va B qatorlari */
export type Dialog = DialogLine[];

/** Gap misoli: `[koreyscha, o'zbekcha]` */
export type Example = [string, string];

/** Qo'shilish qoidasi: `[qoida, jadval katakchalari?, izoh?]` */
export type Rule = [string, string[]?, string?];

/** `grammar-source.ts` dagi yangi shakldagi yozuv */
export type SourceGrammar = {
  /** Daraja raqami: 1=A1, 2=A2, 3=B1, 4=B2 */
  l: number;
  /** Turkum (조사, 연결어미, ...) */
  c: string;
  /** Grammatika shakli, masalan `이/가` */
  f: string;
  /** Bog'liq shakllar */
  v?: string;
  /** Daraja yorlig'i (초급 / 중급 ...) */
  i?: string;
  /** Ma'nosi va qo'llanishi (HTML ruxsat etilgan) */
  m: string;
  /** O'zbekcha muqobili (HTML ruxsat etilgan) */
  u?: string;
  /** Dialog misollari */
  d?: Dialog[];
  /** Gap misollari */
  e?: Example[];
  /** Qo'shilish qoidalari */
  r?: Rule[];
};

/** `grammar-legacy.ts` dagi eski shakldagi yozuv */
export type LegacyGrammar = {
  id: string;
  l?: string;
  /** Nomi */
  t: string;
  /** Bo'lim yorlig'i */
  tag: string;
  /** Tushuntirish */
  d: string;
  /** Formula */
  f?: string;
  /** Misollar */
  ex?: Example[];
  /** Istisnolar */
  x?: string[];
};

/** Ilovada ishlatiladigan yakuniy, bir xillashtirilgan grammatika yozuvi */
export type Grammar = {
  id: string;
  /** Daraja: A1 | A2 | B1 | B2 */
  l: string;
  /** Turkum kodi */
  c: string;
  /** Shakl (sarlavha) */
  f: string;
  /** Bog'liq shakllar */
  v: string;
  /** Daraja yorlig'i */
  i: string;
  /** Ma'nosi (HTML) */
  m: string;
  /** O'zbekcha muqobili (HTML) */
  u: string;
  d: Dialog[];
  e: Example[];
  r: Rule[];
};

/* ---------- Yutuqlar ---------- */

export type Badge = [
  /** emoji */
  string,
  /** nomi */
  string,
  /** shart */
  (s: AppState) => boolean,
];

/* ---------- Holat (localStorage) ---------- */

export type CustomGrammar = {
  id: string;
  t: string;
  tag: string;
  l: string;
  d: string;
  f: string;
  ex: Example[];
};

export type CustomVocab = {
  id: string;
  kr: string;
  uz: string;
  pr: string;
  g: string;
  l: string;
};

export type CustomQuiz = {
  q: string;
  a: string;
  w: string[];
};

export type GrammarNote = {
  /** Foydalanuvchi qo'shgan istisnolar */
  exc: string[];
  /** Foydalanuvchi qo'shgan misollar */
  ex: Example[];
};

export type WrongQuestion = {
  id: string;
  type: string;
  q: string;
  sub: string;
  a: string;
  opts: string[];
  say?: string;
};

export type AppState = {
  /** O'rganilgan harflar: `{ "ㄱ": true }` */
  letters: Record<string, boolean>;
  /** Leitner qutisi: `{ "b0": 3 }` — 3 va undan katta = yodlangan */
  box: Record<string, number>;
  /** O'qilgan grammatikalar */
  gread: Record<string, number>;
  /** Jami to'g'ri javoblar */
  correct: number;
  xp: number;
  streak: number;
  /** Oxirgi faol kun (YYYY-MM-DD) */
  last: string;
  wrong: WrongQuestion[];
  cVocab: CustomVocab[];
  cGrammar: CustomGrammar[];
  cQuiz: CustomQuiz[];
  theme: "light" | "dark";
  flashIdx: number;
  gnotes: Record<string, GrammarNote>;
  /** Yozuv mashqida muvaffaqiyatli yozilgan belgi/so'zlar */
  wrote: Record<string, boolean>;
  v3?: number;
};
