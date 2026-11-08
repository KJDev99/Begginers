import { cn } from "@/lib/utils";

/**
 * Loyiha ma'lumotlaridagi tayyor HTML bo'lagini chiqaradi.
 * Matn loyihaning o'z fayllaridan keladi; foydalanuvchi kiritgan matnlar
 * `richEscaped()` orqali oldin xavfsizlashtiriladi.
 */
export function RichText({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <span
      className={cn("rich", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
