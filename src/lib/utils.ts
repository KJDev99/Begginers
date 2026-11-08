/** Tailwind klasslarini shartli birlashtirish. */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

/** HTML belgilarini xavfsiz holatga keltirish (asl loyihadagi `esc` bilan bir xil). */
export function esc(s: unknown): string {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string,
  );
}

/** Massivni tasodifiy tartibda qaytaradi (Fisher–Yates). */
export function shuffle<T>(input: readonly T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Bugungi kun `YYYY-MM-DD` shaklida. */
export const today = (): string => new Date().toISOString().slice(0, 10);

/** Kechagi kun `YYYY-MM-DD` shaklida. */
export const yesterday = (): string =>
  new Date(Date.now() - 864e5).toISOString().slice(0, 10);

/** Sonni foizga aylantirib, 0–100 oralig'ida ushlab turadi. */
export const pct = (n: number): number =>
  Math.max(0, Math.min(100, Math.round((Number.isFinite(n) ? n : 0) * 100)));
