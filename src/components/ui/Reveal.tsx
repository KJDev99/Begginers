"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

/**
 * Yengil paydo bo'lish animatsiyasi — qisqa va bir martalik,
 * sahifani og'irlashtirmaydi.
 */
export function Reveal({
  delay = 0,
  children,
  className,
  ...rest
}: { delay?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Ketma-ket paydo bo'luvchi ro'yxat uchun konteyner. */
export function Stagger({
  children,
  className,
  step = 0.028,
}: {
  children: React.ReactNode;
  className?: string;
  step?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: step } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** `Stagger` ichidagi element. */
export function StaggerItem({
  children,
  className,
  ...rest
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 6 },
        show: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
