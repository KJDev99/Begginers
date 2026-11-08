# HANGUK — Korean Learning World

O‘zbek tilida so‘zlashuvchilar uchun koreys tilini noldan o‘rgatuvchi ilova.
Avvalgi bitta `index.html` fayl **Next.js + TypeScript + Tailwind CSS** loyihasiga
ko‘chirildi. **Barcha o‘quv ma’lumotlari — alifbo, lug‘at va grammatika —
asl holicha, bitta belgi ham o‘zgartirilmagan.**

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:3000
```

Boshqa buyruqlar:

```bash
npm run build      # production build
npm start          # build qilingan ilovani ishga tushirish
npm run lint       # ESLint
npm run typecheck  # TypeScript tekshiruvi
```

## Sahifalar (har biri alohida route)

| Route                   | Nima qiladi                                                 |
| ----------------------- | ----------------------------------------------------------- |
| `/`                     | Bosh sahifa: rivojlanish statistikasi va bo‘limlar          |
| `/alphabet`             | Hangul alifbosi — 40 ta harf, talaffuz audiosi bilan        |
| `/grammar`              | Grammatika ro‘yxati: daraja, bosh undosh va qidiruv filtri  |
| `/grammar/[id]`         | Bitta grammatika mavzusi — qoidalar, dialoglar, misollar    |
| `/vocabulary`           | 146 so‘zlik lug‘at: guruh, daraja va qidiruv bo‘yicha       |
| `/vocabulary/flashcard` | Leitner tizimidagi flashcard takrori                        |
| `/quiz`                 | Testlar: tarjima, teskari tarjima va tinglab topish         |
| `/add-content`          | O‘z grammatikangiz, so‘zingiz va test savolingizni qo‘shish |
| `/progress`             | Natijalar, XP, kunlik seriya va nishonlar                   |

## Texnologiyalar

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** — ranglar CSS o‘zgaruvchilarida, yorug‘/qorong‘i mavzu
- **NProgress** — sahifalar o‘rtasida yuqoridagi yuklanish chizig‘i
- **Sonner** — toast xabarlari
- **lucide-react** — ikonkalar
- **framer-motion** — qisqa, yengil animatsiyalar (`prefers-reduced-motion` hurmat qilinadi)
- **Web Speech API** — koreyscha talaffuz (`ko-KR`)

## Loyiha tuzilishi

```
src/
  app/                  # routelar; har birida loading.tsx (skeleton)
  components/
    ui/                 # qayta ishlatiladigan elementlar
    AppShell.tsx        # yon menyu + yuqori panel
    NavigationProgress.tsx
    Splash.tsx, ToastHost.tsx, ConfirmDialog.tsx
  data/                 # ASL MA'LUMOTLAR — o'zgartirilmaydi
    alphabet.ts         # C, DC, V, CV, LETTERS, ALL_LETTERS
    vocab.ts            # VOCAB (146 so'z)
    grammar-source.ts   # G1 + G2 + G3 (88 mavzu)
    grammar-legacy.ts   # eski ro'yxat (undan B1/B2 saqlanadi)
    badges.ts, types.ts
  lib/                  # holat, grammatika birlashtirish, test, talaffuz
```

### Ma’lumotlar haqida

`src/data/` ichidagi fayllar asl `index.html` dan **aynan ko‘chirilgan**:

- 40 ta harf (14 undosh, 5 qo‘sh undosh, 10 unli, 11 murakkab unli)
- 146 ta so‘z
- 95 ta grammatika mavzusi (88 ta yangi + eski ro‘yxatdan 7 ta B1/B2)

Yakuniy grammatika ro‘yxati `src/lib/grammar.ts` da asl loyihadagi tartibda
birlashtiriladi. Asl `index.html` solishtirish uchun loyihada qoldirilgan.

## Foydalanuvchi ma’lumotlari

Rivojlanish, qo‘shilgan so‘z/grammatika/savollar va tanlangan mavzu
brauzerning `localStorage` ida, avvalgi ilova bilan bir xil kalit ostida
(`hanguk_v2`) saqlanadi — ya’ni eski natijalar yo‘qolmaydi.
