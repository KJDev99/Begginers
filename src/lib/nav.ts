import {
  BookOpen,
  Home,
  Languages,
  Library,
  PlusCircle,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  /** Yon menyudagi va breadcrumbdagi nom */
  label: string;
  /** Sahifa sarlavhasi */
  title: string;
  /** Koreyscha belgi */
  kr: string;
  icon: LucideIcon;
  /** Urg'u rangi (CSS o'zgaruvchisi) */
  accent: string;
};

export const NAV: NavItem[] = [
  {
    href: "/",
    label: "Bosh sahifa",
    title: "Koreys tiliga xush kelibsiz!",
    kr: "홈",
    icon: Home,
    accent: "var(--color-cyan)",
  },
  {
    href: "/alphabet",
    label: "Alifbo",
    title: "Alifbo",
    kr: "한",
    icon: Languages,
    accent: "var(--color-cyan)",
  },
  {
    href: "/grammar",
    label: "Grammatika",
    title: "Grammatika",
    kr: "文",
    icon: BookOpen,
    accent: "var(--color-purple)",
  },
  {
    href: "/vocabulary",
    label: "Lug‘at",
    title: "Lug‘at",
    kr: "語",
    icon: Library,
    accent: "var(--color-pink)",
  },
  {
    href: "/quiz",
    label: "Testlar",
    title: "Testlar",
    kr: "試",
    icon: Target,
    accent: "var(--color-green)",
  },
  {
    href: "/add-content",
    label: "Qo‘shish",
    title: "Qo‘shish",
    kr: "追",
    icon: PlusCircle,
    accent: "var(--color-purple)",
  },
  {
    href: "/progress",
    label: "Natijalar",
    title: "Natijalar",
    kr: "記",
    icon: Trophy,
    accent: "var(--color-green)",
  },
];

/** Yo'lga mos menyu bandini topadi (eng aniq moslik). */
export function findNavItem(pathname: string): NavItem {
  const exact = NAV.find((n) => n.href === pathname);
  if (exact) return exact;
  const nested = NAV.filter((n) => n.href !== "/").find((n) =>
    pathname.startsWith(n.href + "/"),
  );
  return nested ?? NAV[0];
}
