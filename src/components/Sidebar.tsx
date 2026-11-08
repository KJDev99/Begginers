"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isActive(href: string, pathname: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Asosiy menyu">
      {NAV.map((item) => {
        const active = isActive(item.href, pathname);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3 py-2.5",
              "text-sm font-semibold transition-all duration-150",
              active
                ? "bg-hover text-text"
                : "text-muted hover:bg-hover hover:text-text",
            )}
          >
            {/* Faol band ko'rsatkichi */}
            <span
              className={cn(
                "absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full",
                "transition-all duration-200",
                active ? "opacity-100" : "scale-y-0 opacity-0",
              )}
              style={{ background: item.accent }}
            />
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-[10px] border transition-all duration-150",
                active
                  ? "border-transparent"
                  : "border-line bg-panel2 group-hover:border-line/80",
              )}
              style={
                active
                  ? {
                      background: `color-mix(in srgb, ${item.accent} 18%, transparent)`,
                      color: item.accent,
                    }
                  : undefined
              }
            >
              <Icon className="size-[15px]" strokeWidth={2.1} />
            </span>
            <span className="truncate">{item.label}</span>
            <span className="ko ml-auto text-[11px] text-muted/50">
              {item.kr}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link
        href="/"
        onClick={onNavigate}
        className="mb-7 flex items-center gap-3 px-1.5"
      >
        <span className="ko grid size-11 place-items-center rounded-[15px] bg-gradient-to-br from-purple to-cyan text-[22px] font-black text-ink shadow-lg shadow-purple/25">
          한
        </span>
        <span className="min-w-0">
          <span className="block text-[19px] leading-none font-extrabold tracking-[2px]">
            HANGUK
          </span>
          <span className="mt-1 block text-[9px] font-semibold tracking-[1.1px] whitespace-nowrap text-muted">
            KOREAN LEARNING WORLD
          </span>
        </span>
      </Link>

      <p className="px-3 pb-2.5 text-[10px] font-extrabold tracking-[2px] text-muted">
        O‘RGANISH
      </p>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-line bg-panel2/60 p-4">
          <strong className="ko block text-sm font-bold">오늘의 목표 ✦</strong>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            Har kuni ozgina o‘rgan. Katta natijalar kichik qadamlardan
            boshlanadi.
          </p>
        </div>
      </div>
    </>
  );
}

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Katta ekranlar — doimiy yon panel */}
      <aside className="glass sticky top-0 hidden h-screen flex-col overflow-y-auto border-r border-line px-4 py-7 lg:flex">
        <SidebarBody />
      </aside>

      {/* Kichik ekranlar — chetdan chiqadigan panel */}
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col overflow-y-auto",
          "border-r border-line bg-bg px-4 py-7 shadow-2xl",
          "transition-transform duration-250 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Menyuni yopish"
          className="absolute top-5 right-4 grid size-9 place-items-center rounded-xl border border-line bg-panel2 text-muted transition-colors hover:text-text"
        >
          <X className="size-4" />
        </button>
        <SidebarBody onNavigate={onClose} />
      </aside>
    </>
  );
}
