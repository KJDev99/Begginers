"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { VOCAB } from "@/data/vocab";
import type {
  AppState,
  CustomQuiz,
  CustomVocab,
  CustomGrammar,
  Example,
  GrammarNote,
  VocabWord,
} from "@/data/types";
import { allGrammar } from "./grammar";
import { warmUpVoices } from "./speech";
import { today, yesterday } from "./utils";

const KEY = "hanguk_v2";

export const DEFAULT_STATE: AppState = {
  letters: {},
  box: {},
  gread: {},
  correct: 0,
  xp: 0,
  streak: 0,
  last: "",
  wrong: [],
  cVocab: [],
  cGrammar: [],
  cQuiz: [],
  theme: "light",
  flashIdx: 0,
  gnotes: {},
};

function loadState(): AppState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = window.localStorage.getItem(KEY);
    const s: AppState = { ...DEFAULT_STATE, ...(raw ? JSON.parse(raw) : {}) };
    // Asl loyihadagi bir martalik migratsiya.
    if (!s.v3) {
      s.theme = "light";
      s.v3 = 1;
    }
    return s;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function persist(s: AppState): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* kvota to'lgan bo'lsa jim o'tamiz */
  }
}

type Store = {
  state: AppState;
  /** localStorage o'qilganmi — skeleton ko'rsatish uchun. */
  ready: boolean;

  /** Holatni o'zgartiradi va saqlaydi. */
  update: (fn: (draft: AppState) => void) => void;

  /* ---- qulay amallar ---- */
  addXP: (n: number) => void;
  touchStreak: () => void;
  toggleLetter: (ch: string) => boolean;
  markGrammarRead: (id: string) => boolean;
  setBox: (id: string, value: number) => void;
  toggleMemorized: (id: string) => boolean;
  addGrammarExample: (id: string, example: Example) => void;
  addGrammarException: (id: string, text: string) => void;
  addCustomGrammar: (g: CustomGrammar) => void;
  addCustomVocab: (v: CustomVocab) => void;
  addCustomQuiz: (q: CustomQuiz) => void;
  toggleTheme: () => void;
  reset: () => void;

  /* ---- hosilalar ---- */
  vocab: VocabWord[];
  grammarCount: number;
  level: string;
  note: (id: string) => GrammarNote;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  // Birinchi renderdan keyin localStorage dan o'qiymiz (SSR bilan mos bo'lishi uchun).
  useEffect(() => {
    setState(loadState());
    setReady(true);
    warmUpVoices();
  }, []);

  // Mavzuni <html> ga qo'llaymiz.
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.classList.toggle("light", state.theme === "light");
    root.style.colorScheme = state.theme === "light" ? "light" : "dark";
  }, [state.theme, ready]);

  const update = useCallback((fn: (draft: AppState) => void) => {
    setState((prev) => {
      const draft: AppState = structuredClone(prev);
      fn(draft);
      persist(draft);
      return draft;
    });
  }, []);

  const addXP = useCallback(
    (n: number) => update((d) => void (d.xp += n)),
    [update],
  );

  const touchStreak = useCallback(() => {
    update((d) => {
      const t = today();
      if (d.last === t) return;
      d.streak = d.last === yesterday() ? d.streak + 1 : 1;
      d.last = t;
    });
  }, [update]);

  /** Harfni belgilaydi/bekor qiladi. @returns yangi holat (o'rganilganmi) */
  const toggleLetter = useCallback(
    (ch: string) => {
      const next = !state.letters[ch];
      update((d) => {
        d.letters[ch] = next;
        if (next) {
          d.xp += 2;
          const t = today();
          if (d.last !== t) {
            d.streak = d.last === yesterday() ? d.streak + 1 : 1;
            d.last = t;
          }
        }
      });
      return next;
    },
    [state.letters, update],
  );

  /** Grammatikani o'qilgan deb belgilaydi. @returns birinchi marta ochilganmi */
  const markGrammarRead = useCallback(
    (id: string) => {
      if (state.gread[id]) return false;
      update((d) => {
        if (d.gread[id]) return;
        d.gread[id] = 1;
        d.xp += 5;
        const t = today();
        if (d.last !== t) {
          d.streak = d.last === yesterday() ? d.streak + 1 : 1;
          d.last = t;
        }
      });
      return true;
    },
    [state.gread, update],
  );

  const setBox = useCallback(
    (id: string, value: number) => update((d) => void (d.box[id] = value)),
    [update],
  );

  /** "Yodladim" tugmasi. @returns yodlangan holatga o'tdimi */
  const toggleMemorized = useCallback(
    (id: string) => {
      const known = (state.box[id] || 0) >= 3;
      update((d) => {
        if (known) {
          d.box[id] = 1;
        } else {
          d.box[id] = 3;
          d.xp += 3;
          const t = today();
          if (d.last !== t) {
            d.streak = d.last === yesterday() ? d.streak + 1 : 1;
            d.last = t;
          }
        }
      });
      return !known;
    },
    [state.box, update],
  );

  const addGrammarExample = useCallback(
    (id: string, example: Example) =>
      update((d) => {
        const n = (d.gnotes[id] = d.gnotes[id] || { exc: [], ex: [] });
        n.ex.push(example);
      }),
    [update],
  );

  const addGrammarException = useCallback(
    (id: string, text: string) =>
      update((d) => {
        const n = (d.gnotes[id] = d.gnotes[id] || { exc: [], ex: [] });
        n.exc.push(text);
      }),
    [update],
  );

  const addCustomGrammar = useCallback(
    (g: CustomGrammar) => update((d) => void d.cGrammar.push(g)),
    [update],
  );

  const addCustomVocab = useCallback(
    (v: CustomVocab) => update((d) => void d.cVocab.push(v)),
    [update],
  );

  const addCustomQuiz = useCallback(
    (q: CustomQuiz) => update((d) => void d.cQuiz.push(q)),
    [update],
  );

  const toggleTheme = useCallback(
    () =>
      update((d) => {
        d.theme = d.theme === "light" ? "dark" : "light";
      }),
    [update],
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setState({ ...DEFAULT_STATE, v3: 1 });
  }, []);

  const vocab = useMemo(
    () => [...VOCAB, ...state.cVocab],
    [state.cVocab],
  );

  const grammarCount = useMemo(
    () => allGrammar(state.cGrammar).length,
    [state.cGrammar],
  );

  const note = useCallback(
    (id: string): GrammarNote => state.gnotes[id] || { exc: [], ex: [] },
    [state.gnotes],
  );

  // Kunlik seriyani ilova ochilganda yangilaymiz.
  useEffect(() => {
    if (!ready) return;
    touchStreak();
    // faqat bir marta, hydrate bo'lgandan keyin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const value: Store = {
    state,
    ready,
    update,
    addXP,
    touchStreak,
    toggleLetter,
    markGrammarRead,
    setBox,
    toggleMemorized,
    addGrammarExample,
    addGrammarException,
    addCustomGrammar,
    addCustomVocab,
    addCustomQuiz,
    toggleTheme,
    reset,
    vocab,
    grammarCount,
    level: state.xp >= 1000 ? "A2" : "A1",
    note,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore faqat <StoreProvider> ichida ishlaydi");
  return ctx;
}
