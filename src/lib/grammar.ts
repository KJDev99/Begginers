import { GRAMMAR as LEGACY } from "@/data/grammar-legacy";
import { SRC } from "@/data/grammar-source";
import type {
  CustomGrammar,
  Grammar,
  LegacyGrammar,
  Rule,
} from "@/data/types";
import { LVM } from "./korean";
import { esc } from "./utils";

/**
 * Eski shakldagi (`t`/`tag`/`d`/`ex`) yozuvni yakuniy shaklga o'tkazadi.
 * Asl loyihadagi `ad()` funksiyasining aynan o'zi.
 */
export function adapt(g: LegacyGrammar | CustomGrammar): Grammar {
  const exceptions = (g as LegacyGrammar).x || [];
  return {
    id: g.id,
    l: g.l || "A1",
    c: g.tag || "",
    f: g.t,
    v: "",
    i: "",
    m: esc(g.d),
    u: "",
    d: [],
    e: (g.ex || []).map((x) => [x[0], x[1] || ""]),
    r: [
      ...(g.f ? ([["Formula", g.f.split("\n")]] as Rule[]) : []),
      ...exceptions.map((x) => [x, []] as Rule),
    ],
  };
}

/** Yangi shakldagi manba yozuvlari. */
const fresh: Grammar[] = SRC.map((g, i) => ({
  id: "n" + i,
  l: LVM[g.l] || "A1",
  c: g.c,
  f: g.f,
  v: g.v || "",
  i: g.i || "",
  m: g.m,
  u: g.u || "",
  d: g.d || [],
  e: g.e || [],
  r: g.r || [],
}));

/** Eski ro'yxatdan faqat B1/B2 mavzularini saqlab qolamiz. */
const kept: Grammar[] = LEGACY.filter(
  (g) => g.l === "B1" || g.l === "B2",
).map(adapt);

/** Loyiha bilan birga keladigan grammatikalar. */
export const GRAMMAR_BASE: Grammar[] = [...fresh, ...kept];

/** Loyiha + foydalanuvchi qo'shgan grammatikalar. */
export function allGrammar(custom: CustomGrammar[] = []): Grammar[] {
  return custom.length
    ? [...GRAMMAR_BASE, ...custom.map(adapt)]
    : GRAMMAR_BASE;
}

/** Bitta grammatikani `id` bo'yicha topadi. */
export function findGrammar(
  id: string,
  custom: CustomGrammar[] = [],
): Grammar | undefined {
  return allGrammar(custom).find((g) => g.id === id);
}
