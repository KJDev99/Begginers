"use client";

/* ============================================================
   Yozuv mashqi — belgini barmoq yoki sichqoncha bilan yozish.

   • "Ko'rsatish" — belgi qanday yozilishini jonli animatsiya
     qilib ko'rsatadi (koreyscha tartib: 초성 → 중성 → 종성).
   • "Tekshirish" — yozilgan chiziqlar belgi shakliga qanchalik
     mos kelishini piksel darajasida hisoblaydi.
   • Xato bo'lsa chiziqlar tozalanadi va qaytadan yozdiriladi.
   • Mobil: Pointer Events + `touch-action: none` — barmoq bilan
     yozganda sahifa siljimaydi.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Eraser, Lightbulb, Play, X } from "lucide-react";
import { toast } from "sonner";

import { AudioButton } from "./ui/AudioButton";
import { Button } from "./ui/Button";
import {
  decompose,
  isSyllable,
  romanizeChar,
  writableChars,
} from "@/lib/hangul";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ---------- Sozlamalar ---------- */

/** Tahlil uchun niqob o'lchami (piksel). */
const MASK = 192;
/** Ruxsat etilgan chetga chiqish (kvadrat o'lchamiga nisbatan). */
const TOL = 0.085;
/** Qalam qalinligi (kvadrat o'lchamiga nisbatan). */
const PEN = 0.08;
/** O'tish uchun kerakli aniqlik. */
const PASS_SCORE = 0.6;
/** O'tish uchun belgining kamida shuncha qismi chizilgan bo'lishi kerak. */
const PASS_COVER = 0.45;

type Pt = { x: number; y: number };
type Stroke = Pt[];

/** Pastga yoziladigan unlilar (ㅗ, ㅜ ...) */
const V_HORIZ = new Set([..."ㅗㅛㅜㅠㅡ"]);
/** Burchakka yoziladigan qo'shma unlilar (ㅘ, ㅝ ...) */
const V_MIXED = new Set([..."ㅘㅙㅚㅝㅞㅟㅢ"]);

/* ============================================================
   Kanvas yordamchilari
   ============================================================ */

function cssVar(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

function koFont(px: number): string {
  const fam = cssVar("--font-kr", '"Noto Sans KR", sans-serif');
  return `700 ${px}px ${fam}, "Noto Sans KR", sans-serif`;
}

function newCanvas(size: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  return c;
}

/** Belgi shaklini `size x size` niqobga aylantiradi. `pad` — kengaytirish. */
function glyphMask(ch: string, size: number, pad: number): Uint8Array {
  const c = newCanvas(size);
  const x = c.getContext("2d", { willReadFrequently: true });
  const m = new Uint8Array(size * size);
  if (!x) return m;
  x.fillStyle = "#fff";
  x.strokeStyle = "#fff";
  x.lineJoin = "round";
  x.lineCap = "round";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.font = koFont(size * 0.74);
  if (pad > 0) {
    x.lineWidth = pad * 2;
    x.strokeText(ch, size / 2, size * 0.53);
  }
  x.fillText(ch, size / 2, size * 0.53);
  const d = x.getImageData(0, 0, size, size).data;
  for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 60 ? 1 : 0;
  return m;
}

/** Foydalanuvchi chiziqlarini niqobga aylantiradi. */
function strokeMask(strokes: Stroke[], size: number, width: number): Uint8Array {
  const c = newCanvas(size);
  const x = c.getContext("2d", { willReadFrequently: true });
  const m = new Uint8Array(size * size);
  if (!x) return m;
  x.strokeStyle = "#fff";
  x.lineJoin = "round";
  x.lineCap = "round";
  x.lineWidth = width;
  for (const s of strokes) {
    if (!s.length) continue;
    x.beginPath();
    x.moveTo(s[0].x * size, s[0].y * size);
    if (s.length === 1) x.lineTo(s[0].x * size + 0.1, s[0].y * size);
    else
      for (let i = 1; i < s.length; i++) x.lineTo(s[i].x * size, s[i].y * size);
    x.stroke();
  }
  const d = x.getImageData(0, 0, size, size).data;
  for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 60 ? 1 : 0;
  return m;
}

export type WriteScore = {
  /** Belgining qancha qismi chizilgan */
  coverage: number;
  /** Chizilganning qancha qismi belgi ustida */
  precision: number;
  /** Umumiy aniqlik 0–1 */
  score: number;
  ok: boolean;
};

/** Yozilgan chiziqlarni belgi shakli bilan solishtiradi. */
function evaluate(ch: string, strokes: Stroke[]): WriteScore {
  const size = MASK;
  const tol = size * TOL;
  const pen = size * PEN;

  const tight = glyphMask(ch, size, 0);
  const fat = glyphMask(ch, size, tol);
  const user = strokeMask(strokes, size, pen);
  const userFat = strokeMask(strokes, size, pen + tol * 2);

  let glyphN = 0;
  let covered = 0;
  let userN = 0;
  let inside = 0;
  for (let i = 0; i < tight.length; i++) {
    if (tight[i]) {
      glyphN++;
      if (userFat[i]) covered++;
    }
    if (user[i]) {
      userN++;
      if (fat[i]) inside++;
    }
  }
  const coverage = glyphN ? covered / glyphN : 0;
  const precision = userN ? inside / userN : 0;
  const score = coverage * 0.55 + precision * 0.45;
  return {
    coverage,
    precision,
    score,
    ok: score >= PASS_SCORE && coverage >= PASS_COVER,
  };
}

/* ============================================================
   "Qanday yoziladi" animatsiyasi
   ============================================================ */

type DemoStep = { from: number; to: number; t0: number; t1: number };
type Demo = { order: Int32Array; steps: DemoStep[]; total: number; size: number };

/**
 * Belgini bo'laklarga (jamo'larga) ajratib, koreyscha yozuv
 * tartibida ochiladigan piksellar ro'yxatini tayyorlaydi.
 */
function buildDemo(ch: string, size: number): Demo | null {
  const ink = glyphMask(ch, size, 0);

  /* ---- bog'langan bo'laklar ---- */
  const seen = new Int32Array(size * size).fill(-1);
  const stack: number[] = [];
  const raw: number[][] = [];
  for (let i = 0; i < ink.length; i++) {
    if (!ink[i] || seen[i] >= 0) continue;
    const id = raw.length;
    const list: number[] = [];
    seen[i] = id;
    stack.push(i);
    while (stack.length) {
      const p = stack.pop() as number;
      list.push(p);
      const px = p % size;
      const py = (p - px) / size;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = py + dy;
        if (ny < 0 || ny >= size) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = px + dx;
          if (nx < 0 || nx >= size) continue;
          const q = ny * size + nx;
          if (ink[q] && seen[q] < 0) {
            seen[q] = id;
            stack.push(q);
          }
        }
      }
    }
    if (list.length > 24) raw.push(list);
  }
  if (!raw.length) return null;

  /* ---- bo'lak o'lchamlari ---- */
  const metas = raw.map((px) => {
    let minX = size;
    let maxX = 0;
    let minY = size;
    let maxY = 0;
    for (const p of px) {
      const x = p % size;
      const y = (p - x) / size;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    return {
      px,
      minX,
      minY,
      cx: (minX + maxX) / 2 / size,
      cy: (minY + maxY) / 2 / size,
      w: maxX - minX + 1,
      h: maxY - minY + 1,
      group: 0,
    };
  });

  /* ---- bo'laklarni 초성 / 중성 / 종성 ga taqsimlash ---- */
  const parts = decompose(ch);
  const syl = isSyllable(ch);
  const vowel = syl && parts.length >= 2 ? parts[1] : "";
  const jong = syl && parts.length === 3;
  const layout = V_HORIZ.has(vowel) ? "h" : V_MIXED.has(vowel) ? "m" : "v";

  for (const m of metas) {
    if (!syl) {
      m.group = 0;
    } else if (layout === "h") {
      m.group = jong
        ? m.cy > 0.7
          ? 2
          : m.cy > 0.42
            ? 1
            : 0
        : m.cy > 0.5
          ? 1
          : 0;
    } else if (layout === "m") {
      m.group = jong
        ? m.cy > 0.7
          ? 2
          : m.cx > 0.52 || m.cy > 0.45
            ? 1
            : 0
        : m.cx > 0.52 || m.cy > 0.52
          ? 1
          : 0;
    } else {
      m.group = jong
        ? m.cy > 0.63
          ? 2
          : m.cx > 0.52
            ? 1
            : 0
        : m.cx > 0.52
          ? 1
          : 0;
    }
  }

  metas.sort((a, b) => {
    if (a.group !== b.group) return a.group - b.group;
    if (Math.abs(a.minY - b.minY) > size * 0.08) return a.minY - b.minY;
    return a.minX - b.minX;
  });

  /* ---- har bir bo'lak ichida: chizish yo'nalishi ---- */
  const order = new Int32Array(metas.reduce((n, m) => n + m.px.length, 0));
  const steps: DemoStep[] = [];
  const total = order.length;
  let at = 0;
  let time = 0;
  for (const m of metas) {
    const ar = m.w / m.h;
    const kx = ar > 1.8 ? 1 : ar < 0.55 ? 0.12 : 0.38;
    const ky = ar > 1.8 ? 0.12 : ar < 0.55 ? 1 : 0.72;
    m.px.sort((p, q) => {
      const px = p % size;
      const qx = q % size;
      return (
        px * kx + ((p - px) / size) * ky - (qx * kx + ((q - qx) / size) * ky)
      );
    });
    const from = at;
    for (const p of m.px) order[at++] = p;
    const dur = 320 + 900 * (m.px.length / total);
    steps.push({ from, to: at, t0: time, t1: time + dur });
    time += dur + 170;
  }

  return { order, steps, total, size };
}

/* ============================================================
   Komponent
   ============================================================ */

type Props = {
  /** Yoziladigan matn — so'z, bo'g'in yoki harf */
  text: string;
  /** O'zbekcha ma'nosi (ixtiyoriy) */
  meaning?: string;
  /** Yopish tugmasi (modal ichida ko'rinadi) */
  onClose?: () => void;
  /** Hamma belgilar yozib bo'lingach chaqiriladi */
  onFinish?: () => void;
  className?: string;
};

export function WriteTrainer({
  text,
  meaning,
  onClose,
  onFinish,
  className,
}: Props) {
  const { state, markWritten } = useStore();

  const chars = useMemo(() => writableChars(text), [text]);
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState<boolean[]>(() => chars.map(() => false));
  const [hint, setHint] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "bad">("idle");
  const [acc, setAcc] = useState(0);
  const [fails, setFails] = useState(0);
  const [box, setBox] = useState(0);
  const [, bump] = useState(0);

  const ch = chars[idx] ?? "";
  const finished = chars.length > 0 && done.length > 0 && done.every(Boolean);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const rafRef = useRef(0);
  const demoRef = useRef<Demo | null>(null);
  const maskCvRef = useRef<HTMLCanvasElement | null>(null);
  const maskDataRef = useRef<ImageData | null>(null);
  const maskKRef = useRef(0);
  const tmpCvRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<number | null>(null);

  /* ---------- Matn o'zgarsa boshidan ---------- */
  useEffect(() => {
    setIdx(0);
    setDone(chars.map(() => false));
    setStatus("idle");
    setFails(0);
    strokesRef.current = [];
    bump((n) => n + 1);
  }, [chars]);

  /* ---------- O'lcham (mobil uchun moslashuvchan) ---------- */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = Math.round(entries[0].contentRect.width);
      if (w > 0) setBox(w);
    });
    ro.observe(el);
    setBox(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  /* ---------- Fon: katak + namuna + yozilgan chiziqlar ---------- */
  const paintBase = useCallback(
    (ctx: CanvasRenderingContext2D, S: number, showGuide: boolean) => {
      ctx.clearRect(0, 0, S, S);

      // Katak chiziqlari
      ctx.save();
      ctx.strokeStyle = cssVar("--color-line", "rgba(255,255,255,.09)");
      ctx.lineWidth = Math.max(1, S * 0.004);
      ctx.setLineDash([S * 0.03, S * 0.03]);
      ctx.beginPath();
      ctx.moveTo(S / 2, 0);
      ctx.lineTo(S / 2, S);
      ctx.moveTo(0, S / 2);
      ctx.lineTo(S, S / 2);
      ctx.stroke();
      ctx.restore();

      // Namuna belgi
      if (showGuide && ch) {
        ctx.save();
        ctx.globalAlpha = hint ? 0.32 : 0.13;
        ctx.fillStyle = cssVar("--color-text", "#fff");
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = koFont(S * 0.74);
        ctx.fillText(ch, S / 2, S * 0.53);
        ctx.restore();
      }

      // Yozilgan chiziqlar
      const strokes = strokesRef.current;
      if (strokes.length) {
        ctx.save();
        ctx.strokeStyle =
          status === "bad"
            ? cssVar("--color-pink", "#ff76b7")
            : status === "ok"
              ? cssVar("--color-green", "#75e7b0")
              : cssVar("--color-text", "#f5f6ff");
        ctx.lineWidth = S * PEN;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        for (const s of strokes) {
          if (!s.length) continue;
          ctx.beginPath();
          ctx.moveTo(s[0].x * S, s[0].y * S);
          if (s.length === 1) ctx.lineTo(s[0].x * S + 0.1, s[0].y * S);
          else
            for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x * S, s[i].y * S);
          ctx.stroke();
        }
        ctx.restore();
      }
    },
    [ch, hint, status],
  );

  const redraw = useCallback(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    paintBase(ctx, cv.width, true);
  }, [paintBase]);

  /* ---------- Kanvas o'lchami (Retina/mobil) ---------- */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !box) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(box * dpr);
    cv.height = Math.round(box * dpr);
    cv.style.width = `${box}px`;
    cv.style.height = `${box}px`;
    tmpCvRef.current = null;
    redraw();
  }, [box, redraw]);

  useEffect(() => {
    redraw();
  }, [redraw, idx, state.theme]);

  /* ---------- Shrift yuklangach qayta chizamiz ---------- */
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (!alive) return;
      demoRef.current = null;
      redraw();
    });
    return () => {
      alive = false;
    };
  }, [redraw]);

  /* ---------- Animatsiyani to'xtatish ---------- */
  const stopDemo = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    maskKRef.current = 0;
    setPlaying(false);
    redraw();
  }, [redraw]);

  useEffect(() => stopDemo, [stopDemo]);

  useEffect(() => {
    // Belgi almashsa eski animatsiya ma'lumoti yaroqsiz.
    demoRef.current = null;
    maskKRef.current = 0;
  }, [ch]);

  /* ---------- "Qanday yoziladi" animatsiyasi ---------- */
  const playDemo = useCallback(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || !ch) return;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const demo = demoRef.current ?? buildDemo(ch, MASK);
    demoRef.current = demo;
    if (!demo) return;

    const S = cv.width;
    if (!maskCvRef.current) maskCvRef.current = newCanvas(MASK);
    const maskCv = maskCvRef.current;
    const maskCtx = maskCv.getContext("2d");
    if (!maskCtx) return;
    if (!maskDataRef.current) {
      maskDataRef.current = maskCtx.createImageData(MASK, MASK);
    }
    if (!tmpCvRef.current || tmpCvRef.current.width !== S) {
      tmpCvRef.current = newCanvas(S);
    }
    const tmp = tmpCvRef.current;
    const tmpCtx = tmp.getContext("2d");
    const maskData = maskDataRef.current;
    if (!tmpCtx || !maskData) return;

    maskData.data.fill(0);
    maskKRef.current = 0;

    const last = demo.steps[demo.steps.length - 1];
    const totalMs = last.t1 + 300;
    const start = performance.now();
    const cyan = cssVar("--color-cyan", "#54e7f4");
    setPlaying(true);

    const frame = (now: number) => {
      const t = now - start;

      // Nechta piksel ochilgan?
      let k = 0;
      for (const s of demo.steps) {
        if (t >= s.t1) k = s.to;
        else if (t >= s.t0) {
          k =
            s.from + Math.round((s.to - s.from) * ((t - s.t0) / (s.t1 - s.t0)));
          break;
        } else break;
      }

      for (let i = maskKRef.current; i < k; i++) {
        maskData.data[demo.order[i] * 4 + 3] = 255;
      }
      maskKRef.current = k;
      maskCtx.putImageData(maskData, 0, 0);

      // Belgi shaklini niqob orqali ko'rsatamiz
      tmpCtx.globalCompositeOperation = "source-over";
      tmpCtx.clearRect(0, 0, S, S);
      tmpCtx.fillStyle = cyan;
      tmpCtx.textAlign = "center";
      tmpCtx.textBaseline = "middle";
      tmpCtx.font = koFont(S * 0.74);
      tmpCtx.fillText(ch, S / 2, S * 0.53);
      tmpCtx.globalCompositeOperation = "destination-in";
      tmpCtx.imageSmoothingEnabled = true;
      tmpCtx.drawImage(maskCv, 0, 0, S, S);
      tmpCtx.globalCompositeOperation = "source-over";

      paintBase(ctx, S, true);
      ctx.drawImage(tmp, 0, 0);

      // Qalam nuqtasi
      if (k > 0 && t < totalMs - 280) {
        const p = demo.order[k - 1];
        const px = p % MASK;
        const py = (p - px) / MASK;
        ctx.save();
        ctx.fillStyle = cyan;
        ctx.shadowColor = cyan;
        ctx.shadowBlur = S * 0.05;
        ctx.beginPath();
        ctx.arc((px / MASK) * S, (py / MASK) * S, S * 0.028, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (t < totalMs) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rafRef.current = 0;
        setPlaying(false);
        timerRef.current = window.setTimeout(redraw, 450);
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  }, [ch, paintBase, redraw]);

  /* ---------- Chizish ---------- */
  const pointOf = (e: React.PointerEvent<HTMLCanvasElement>): Pt => {
    const r = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
    };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (finished) return;
    e.preventDefault();
    if (playing) stopDemo();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* qo'llab-quvvatlanmasa ham chizish ishlayveradi */
    }
    drawingRef.current = true;
    if (status !== "idle") setStatus("idle");
    strokesRef.current = [...strokesRef.current, [pointOf(e)]];
    redraw();
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const strokes = strokesRef.current;
    const cur = strokes[strokes.length - 1];
    if (!cur) return;
    const p = pointOf(e);
    const last = cur[cur.length - 1];
    if (Math.hypot(p.x - last.x, p.y - last.y) < 0.006) return;
    cur.push(p);
    redraw();
  };

  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ba'zi brauzerlarda kerak emas */
    }
    redraw();
  };

  const clear = useCallback(() => {
    strokesRef.current = [];
    setStatus("idle");
    redraw();
  }, [redraw]);

  /* ---------- Tekshirish ---------- */
  const check = useCallback(() => {
    if (!ch || finished) return;
    if (!strokesRef.current.length) {
      toast.info("Avval belgini chizing");
      return;
    }
    const r = evaluate(ch, strokesRef.current);
    setAcc(Math.round(r.score * 100));
    if (timerRef.current) window.clearTimeout(timerRef.current);

    if (r.ok) {
      setStatus("ok");
      setFails(0);
      const first = markWritten(ch);
      toast.success(
        first ? `${ch} — to‘g‘ri yozildi! +3 XP` : `${ch} — to‘g‘ri yozildi!`,
      );
      const next = idx + 1;
      setDone((d) => d.map((v, i) => (i === idx ? true : v)));
      timerRef.current = window.setTimeout(() => {
        strokesRef.current = [];
        setStatus("idle");
        if (next < chars.length) setIdx(next);
        else onFinish?.();
        redraw();
      }, 800);
    } else {
      setStatus("bad");
      const f = fails + 1;
      setFails(f);
      toast.error("Xato yozildi — qaytadan yozing");
      timerRef.current = window.setTimeout(() => {
        // Xato bo'lsa chiziqlar o'chiriladi va qaytadan yoziladi.
        strokesRef.current = [];
        setStatus("idle");
        redraw();
        // Ikki marta xato bo'lsa — o'zi qanday yozilishini ko'rsatadi.
        if (f >= 2) {
          setHint(true);
          playDemo();
        }
      }, 900);
    }
    redraw();
  }, [
    ch,
    chars.length,
    fails,
    finished,
    idx,
    markWritten,
    onFinish,
    playDemo,
    redraw,
  ]);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const goTo = (i: number) => {
    if (i === idx) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    stopDemo();
    strokesRef.current = [];
    setStatus("idle");
    setFails(0);
    setIdx(i);
  };

  const restart = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setDone(chars.map(() => false));
    setIdx(0);
    setFails(0);
    setStatus("idle");
    strokesRef.current = [];
    redraw();
  };

  if (!chars.length) {
    return (
      <div
        className={cn("rounded-3xl border border-line bg-panel p-5", className)}
      >
        <p className="text-center text-[13.5px] text-muted">
          Bu yozuvda yoziladigan koreyscha belgi yo‘q.
        </p>
      </div>
    );
  }

  const parts = decompose(ch);

  return (
    <div
      className={cn(
        "rounded-3xl border border-line bg-panel p-4 sm:p-5",
        className,
      )}
    >
      {/* ---------- Sarlavha ---------- */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold tracking-[2px] text-muted">
            YOZIB MASHQ QILING
          </p>
          <div className="mt-1 flex min-w-0 items-baseline gap-2">
            <span className="ko truncate text-[18px] font-black">{text}</span>
            {meaning && (
              <span className="truncate text-[12.5px] text-muted">
                — {meaning}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <AudioButton text={ch} size="sm" label={`${ch} talaffuzini tinglash`} />
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Yopish"
              className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-hover hover:text-text"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      {/* ---------- Bo'g'inlar ---------- */}
      {chars.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {chars.map((c, i) => (
            <button
              key={`${c}-${i}`}
              type="button"
              onClick={() => goTo(i)}
              aria-current={i === idx}
              className={cn(
                "ko grid size-9 place-items-center rounded-xl border text-[15px] font-bold transition-all",
                done[i]
                  ? "border-green/50 bg-green/15 text-green"
                  : i === idx
                    ? "border-cyan/60 bg-cyan/15 text-cyan"
                    : "border-line bg-panel2 text-muted hover:border-cyan/40",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* ---------- Talaffuz ---------- */}
      <p className="text-center text-[30px] leading-none font-black tracking-tight sm:text-[36px]">
        {romanizeChar(ch)}
      </p>
      <p className="mt-1.5 mb-3 text-center text-[11.5px] font-bold text-muted">
        {parts.length > 1 && (
          <span className="ko">{parts.join(" + ")}</span>
        )}
        {chars.length > 1 && (
          <span className="tabular-nums">
            {parts.length > 1 ? " · " : ""}
            {idx + 1}/{chars.length}
          </span>
        )}
      </p>

      {/* ---------- Chizish maydoni ---------- */}
      <div
        ref={wrapRef}
        className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-2xl border border-line bg-panel2"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onContextMenu={(e) => e.preventDefault()}
          aria-label={`${ch} belgisini chizish maydoni`}
          className="absolute inset-0 size-full cursor-crosshair touch-none select-none"
          style={{ touchAction: "none" }}
        />
        {finished && (
          <div className="absolute inset-0 grid place-items-center bg-ink/75 px-5 text-center backdrop-blur-sm">
            <div>
              <p className="text-[15px] font-extrabold text-green">
                Barakalla! Hammasi yozildi 🎉
              </p>
              <Button
                variant="soft"
                size="sm"
                className="mt-3"
                onClick={restart}
              >
                Yana yozish
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Natija ---------- */}
      <p
        className={cn(
          "mt-3 min-h-[34px] text-center text-[12.5px] font-bold",
          status === "ok"
            ? "text-green"
            : status === "bad"
              ? "text-pink"
              : "text-muted",
        )}
      >
        {status === "ok"
          ? `To‘g‘ri! Aniqlik ${acc}%`
          : status === "bad"
            ? `Aniqlik ${acc}% — namunaga tushmadi, qaytadan yozing`
            : playing
              ? "Diqqat bilan qarang — shu tartibda yoziladi"
              : "Namuna ustidan chizing, so‘ng «Tekshirish» ni bosing"}
      </p>

      {/* ---------- Tugmalar ---------- */}
      <div className="mt-2 grid grid-cols-3 gap-2">
        <Button
          size="sm"
          onClick={playing ? stopDemo : playDemo}
          className="px-2 py-2.5 text-[12px]"
        >
          <Play className="size-3.5" strokeWidth={2.6} />
          {playing ? "To‘xtatish" : "Ko‘rsatish"}
        </Button>
        <Button size="sm" onClick={clear} className="px-2 py-2.5 text-[12px]">
          <Eraser className="size-3.5" strokeWidth={2.4} />
          Tozalash
        </Button>
        <Button
          size="sm"
          onClick={() => setHint((h) => !h)}
          aria-pressed={hint}
          className={cn(
            "px-2 py-2.5 text-[12px]",
            hint && "border-cyan/60 bg-cyan/10 text-cyan",
          )}
        >
          <Lightbulb className="size-3.5" strokeWidth={2.4} />
          Namuna
        </Button>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="mt-2 w-full"
        onClick={check}
        disabled={finished}
      >
        <Check className="size-4" strokeWidth={3} />
        Tekshirish
      </Button>
    </div>
  );
}
