import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="grid size-16 place-items-center rounded-3xl border border-line bg-panel2 text-muted">
        <Compass className="size-7" strokeWidth={1.8} />
      </span>
      <p className="ko text-4xl font-black">길을 잃었어요</p>
      <h1 className="text-xl font-extrabold">Sahifa topilmadi</h1>
      <p className="max-w-sm text-sm text-muted">
        Siz izlagan sahifa mavjud emas yoki ko‘chirilgan.
      </p>
      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple to-cyan px-5 py-2.5 text-sm font-bold text-ink transition-all hover:brightness-110 active:scale-[0.97]"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
