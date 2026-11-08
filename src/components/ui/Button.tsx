"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "soft" | "ghost" | "danger";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-bold " +
  "transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-purple to-cyan text-ink shadow-lg shadow-purple/20 hover:brightness-110 hover:shadow-purple/30",
  soft: "border border-line bg-panel2 text-text hover:border-cyan/50 hover:bg-hover",
  ghost: "text-muted hover:bg-hover hover:text-text",
  danger:
    "border border-pink/40 bg-pink/10 text-pink hover:border-pink/70 hover:bg-pink/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-[15px]",
};

type CommonProps = {
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "soft",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "soft",
  size = "md",
  className,
  children,
  href,
  ...rest
}: CommonProps & React.ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
