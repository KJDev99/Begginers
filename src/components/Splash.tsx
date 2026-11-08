"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const SESSION_KEY = "hanguk_splash_shown";

/**
 * Ilova ochilishida qisqa kirish ekrani: ㅎ + ㅏ + ㄴ = 한.
 * Har bir sessiyada bir marta ko'rinadi, bosilsa darhol yopiladi.
 */
export function Splash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }

    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(t);
  }, []);

  const parts = ["ㅎ", "ㅏ", "ㄴ"];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="presentation"
          onClick={() => setVisible(false)}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[1500] grid cursor-pointer place-items-center bg-bg"
        >
          <div className="flex flex-col items-center gap-7 px-6 text-center">
            <div className="flex items-center gap-3">
              {parts.map((p, i) => (
                <motion.span
                  key={p}
                  initial={{ opacity: 0, y: 14, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: 0.1 + i * 0.13,
                    duration: 0.34,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="ko grid size-16 place-items-center rounded-2xl border border-line bg-panel text-3xl font-black text-cyan sm:size-20 sm:text-4xl"
                >
                  {p}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62, duration: 0.3 }}
              className="ko text-xl font-bold sm:text-2xl"
            >
              <b className="text-purple">ㅎ</b> + <b className="text-cyan">ㅏ</b>{" "}
              + <b className="text-pink">ㄴ</b> ={" "}
              <b className="text-green">한</b>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.3 }}
              className="text-[11px] font-extrabold tracking-[3px] text-muted sm:text-xs"
            >
              HANGUK · XUSH KELIBSIZ
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
