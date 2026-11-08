"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Menu, Moon, Star, Sun } from "lucide-react";

import { findNavItem } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/Skeleton";

/**
 * Yuqoridagi kichik ko'rsatkich.
 * `display` klassi ataylab bazada yo'q — har bir chaqiruv o'zi beradi,
 * aks holda `inline-flex` bilan `hidden` to'qnashib qoladi.
 */
function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "items-center gap-1.5 rounded-full border border-line bg-panel2",
        "px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap tabular-nums",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { state, ready, level, toggleTheme } = useStore();
  const item = findNavItem(pathname);

  return (
    <header className="glass sticky top-0 z-30 border-b border-line">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-4 sm:px-7 sm:py-5">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenu}
            aria-label="Menyuni ochish"
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-panel2 text-muted transition-colors hover:text-text lg:hidden"
          >
            <Menu className="size-[18px]" />
          </button>

          <div className="min-w-0">
            <p className="truncate text-[10px] font-extrabold tracking-[1.6px] text-muted">
              HANGUK / <span className="text-cyan">{item.label.toUpperCase()}</span>
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h1
                key={item.href}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="mt-1 truncate text-[17px] leading-tight font-extrabold tracking-tight sm:text-[21px]"
              >
                {item.title}
              </motion.h1>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {ready ? (
            <>
              <Pill className="inline-flex text-pink">
                <Flame className="size-3.5" strokeWidth={2.4} />
                {state.streak} kun
              </Pill>
              <Pill className="hidden text-purple sm:inline-flex">
                <Star className="size-3.5" strokeWidth={2.4} />
                {state.xp} XP
              </Pill>
              <Pill className="hidden text-muted md:inline-flex">
                BEGINNER · {level}
              </Pill>
            </>
          ) : (
            <>
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="hidden h-8 w-20 rounded-full sm:block" />
              <Skeleton className="hidden h-8 w-32 rounded-full md:block" />
            </>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Yorug‘/qorong‘i rejim"
            title="Yorug‘/qorong‘i rejim"
            className="grid size-10 place-items-center rounded-full border border-line bg-panel2 text-cyan transition-all duration-150 hover:border-cyan/60 hover:bg-cyan/10 active:scale-90"
          >
            {state.theme === "light" ? (
              <Moon className="size-[17px]" strokeWidth={2.2} />
            ) : (
              <Sun className="size-[17px]" strokeWidth={2.2} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
