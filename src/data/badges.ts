// Yutuq nishonlari — asl loyihadan o'zgartirilmagan holda ko'chirilgan.
import type { Badge } from "./types";
import { ALL_LETTERS } from "./alphabet";
import { learnedLetters as lc, memorizedWords as wc } from "@/lib/progress";

export const BADGES: Badge[] = [
        ["🔤", "Birinchi 10 harf", (s) => lc(s) >= 10],
        ["🏅", "Hamma harflar", (s) => lc(s) >= ALL_LETTERS.length],
        ["📚", "10 ta so‘z", (s) => wc(s) >= 10],
        ["🧠", "30 ta so‘z", (s) => wc(s) >= 30],
        ["✅", "20 to‘g‘ri javob", (s) => s.correct >= 20],
        ["🔥", "3 kunlik seriya", (s) => s.streak >= 3],
        ["⭐", "100 XP", (s) => s.xp >= 100],
        ["🚀", "500 XP", (s) => s.xp >= 500],
      ];
