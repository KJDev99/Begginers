import { plain } from "./korean";

let warmed = false;

/** Brauzer ovozlarini oldindan yuklab qo'yadi (ba'zi brauzerlarda kerak). */
export function warmUpVoices(): void {
  if (warmed || typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  warmed = true;
  window.speechSynthesis.getVoices();
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/**
 * Koreyscha matnni ovoz chiqarib o'qiydi.
 * @returns qo'llab-quvvatlanmasa `false`
 */
export function speak(text: string): boolean {
  if (!isSpeechSupported()) return false;

  const synth = window.speechSynthesis;
  synth.cancel();

  const u = new SpeechSynthesisUtterance(plain(text));
  u.lang = "ko-KR";
  u.rate = 0.8;

  const voice = synth.getVoices().find((v) => v.lang.startsWith("ko"));
  if (voice) u.voice = voice;

  synth.speak(u);
  return true;
}
