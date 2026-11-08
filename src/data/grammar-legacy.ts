// Eski shakldagi grammatika yozuvlari — asl loyihadan o'zgartirilmagan holda ko'chirilgan.
import type { LegacyGrammar } from "./types";

export const GRAMMAR: LegacyGrammar[] = [
        {
          id: "g1",
          t: "이에요/예요",
          tag: "BO‘LISH FE’LI",
          d: "“Bu ... dir / Men ... man” degan ma’noni beradi. Otdan keyin qo‘yiladi. Undosh bilan tugasa 이에요, unli bilan tugasa 예요.",
          f: "Ot (undosh) + 이에요\nOt (unli) + 예요",
          ex: [
            ["저는 학생이에요", "Men talabaman"],
            ["이것은 책이에요", "Bu kitob"],
            ["친구예요", "(U) do‘st"],
          ],
        },
        {
          id: "g2",
          t: "은/는",
          tag: "MAVZU YUKLAMASI",
          d: "Gapning mavzusini (kim/nima haqida gap ketayotganini) bildiradi. Undosh bilan tugasa 은, unli bilan tugasa 는.",
          f: "Ot (undosh) + 은\nOt (unli) + 는",
          ex: [
            ["저는 우즈벡 사람이에요", "Men o‘zbekman"],
            ["책은 재미있어요", "Kitob qiziqarli"],
          ],
        },
        {
          id: "g3",
          t: "이/가",
          tag: "EGA YUKLAMASI",
          d: "Gap egasini bildiradi, yangi ma’lumot berilganda ishlatiladi. Undosh bilan 이, unli bilan 가.",
          f: "Ot (undosh) + 이\nOt (unli) + 가",
          ex: [
            ["친구가 와요", "Do‘stim kelyapti"],
            ["물이 있어요", "Suv bor"],
          ],
        },
        {
          id: "g4",
          t: "을/를",
          tag: "TO‘LDIRUVCHI",
          d: "Fe’lning to‘g‘ridan-to‘g‘ri to‘ldiruvchisini (kimni/nimani) bildiradi. Undosh bilan 을, unli bilan 를.",
          f: "Ot (undosh) + 을\nOt (unli) + 를",
          ex: [
            ["밥을 먹어요", "Ovqat yeyman"],
            ["물을 마셔요", "Suv ichaman"],
            ["친구를 봐요", "Do‘stni ko‘raman"],
          ],
        },
        {
          id: "g5",
          t: "에 / 에서",
          tag: "JOY VA VAQT",
          d: "에 — borish yo‘nalishi, mavjud joy yoki vaqt. 에서 — harakat sodir bo‘layotgan joy.",
          f: "Joy + 에 가다/있다\nJoy + 에서 + fe’l",
          ex: [
            ["학교에 가요", "Maktabga boraman"],
            ["집에서 공부해요", "Uyda o‘qiyman"],
          ],
        },
        {
          id: "g6",
          t: "~아요/어요",
          tag: "HOZIRGI ZAMON",
          d: "Muloyim hozirgi zamon shakli. Fe’l o‘zagidagi oxirgi unli ㅏ yoki ㅗ bo‘lsa 아요, aks holda 어요. 하다 → 해요.",
          f: "가(다) → 가요\n먹(다) → 먹어요\n하(다) → 해요",
          ex: [
            ["저는 학교에 가요", "Men maktabga boraman"],
            ["밥을 먹어요", "Ovqat yeyman"],
            ["공부해요", "O‘qiyman"],
          ],
        },
        {
          id: "g7",
          t: "~고 싶다",
          tag: "ISTAK-XOHISH",
          d: "“...moqchiman” degan ma’no. Fe’l o‘zagiga qo‘shiladi.",
          f: "Fe’l o‘zagi + 고 싶어요",
          ex: [
            ["가고 싶어요", "Bormoqchiman"],
            ["먹고 싶어요", "Yemoqchiman"],
          ],
        },
        {
          id: "g8",
          t: "안 / ~지 않다",
          tag: "INKOR",
          d: "Fe’l oldiga 안 qo‘yilsa yoki o‘zakka ~지 않아요 qo‘shilsa, inkor bo‘ladi.",
          f: "안 + fe’l\nFe’l o‘zagi + 지 않아요",
          ex: [
            ["안 가요", "Bormayman"],
            ["먹지 않아요", "Yemayman"],
          ],
        },
        {
          id: "g9",
          t: "~(으)세요",
          tag: "HURMAT / BUYRUQ",
          d: "Hurmat bilan so‘rash yoki iltimos qilish. Unli bilan tugasa 세요, undosh bilan tugasa 으세요.",
          f: "Fe’l o‘zagi (unli) + 세요\nFe’l o‘zagi (undosh) + 으세요",
          ex: [
            ["가세요", "Boring"],
            ["앉으세요", "O‘tiring"],
            ["어서 오세요", "Xush kelibsiz"],
          ],
        },
        {
          id: "g10",
          t: "~(으)ㄹ 거예요",
          tag: "KELASI ZAMON",
          d: "Kelajakdagi ish yoki rejani bildiradi. Unli bilan tugasa ㄹ 거예요, undosh bilan tugasa 을 거예요.",
          f: "Fe’l o‘zagi (unli) + ㄹ 거예요\nFe’l o‘zagi (undosh) + 을 거예요",
          ex: [
            ["내일 갈 거예요", "Ertaga boraman"],
            ["저녁에 먹을 거예요", "Kechqurun yeyman"],
            ["공부할 거예요", "O‘qiyman"],
          ],
        },
        {
          id: "g11",
          t: "~았/었어요",
          tag: "O‘TGAN ZAMON",
          d: "O‘tgan zamon shakli. Oxirgi unli ㅏ/ㅗ bo‘lsa 았어요, aks holda 었어요. 하다 → 했어요.",
          f: "가다 → 갔어요\n먹다 → 먹었어요\n하다 → 했어요",
          ex: [
            ["학교에 갔어요", "Maktabga bordim"],
            ["밥을 먹었어요", "Ovqat yedim"],
            ["공부했어요", "O‘qidim"],
          ],
        },
        {
          id: "g12",
          t: "~(으)ㄹ 수 있다/없다",
          tag: "QOBILIYAT",
          d: "“...a olaman / ...a olmayman” ma’nosi. 있다 — mumkin, 없다 — mumkin emas.",
          f: "Fe’l o‘zagi + ㄹ/을 수 있어요\nFe’l o‘zagi + ㄹ/을 수 없어요",
          ex: [
            ["한국어를 할 수 있어요", "Koreys tilida gapira olaman"],
            ["갈 수 없어요", "Bora olmayman"],
          ],
        },
        {
          id: "g13",
          t: "~지만",
          tag: "QARAMA-QARSHILIK",
          d: "“lekin, ammo” ma’nosi. Fe’l yoki sifat o‘zagiga qo‘shiladi.",
          f: "Fe’l/sifat o‘zagi + 지만",
          ex: [
            ["작지만 예뻐요", "Kichik, lekin chiroyli"],
            ["비싸지만 맛있어요", "Qimmat, lekin mazali"],
          ],
        },
        {
          id: "g14",
          t: "~(으)니까",
          tag: "SABAB",
          d: "“...gani uchun” ma’nosi. Odatda keyingi gapda taklif yoki buyruq bo‘ladi.",
          f: "Fe’l o‘zagi (unli) + 니까\nFe’l o‘zagi (undosh) + 으니까",
          ex: [
            [
              "비가 오니까 집에 있어요",
              "Yomg‘ir yog‘ayotgani uchun uyda qolaman",
            ],
            ["바쁘니까 나중에 만나요", "Bandman, keyinroq uchrashamiz"],
          ],
        },
        {
          id: "g15",
          t: "~(으)러 가다",
          tag: "MAQSAD",
          d: "“...gani bormoq” ma’nosi. Harakat maqsadini bildiradi.",
          f: "Fe’l o‘zagi + (으)러 가다/오다",
          ex: [
            ["먹으러 가요", "Yegani boraman"],
            ["책을 사러 서점에 가요", "Kitob olgani kitob do‘koniga boraman"],
          ],
        },
        {
          id: "g16",
          t: "와/과, (이)랑, 하고",
          tag: "BOG‘LOVCHI",
          d: "“va / bilan” ma’nosi. 와 (unli) / 과 (undosh) — rasmiy, (이)랑 va 하고 — so‘zlashuv.",
          f: "Ot + 와/과\nOt + (이)랑\nOt + 하고",
          ex: [
            ["친구랑 가요", "Do‘stim bilan boraman"],
            ["빵과 우유", "Non va sut"],
          ],
        },
        {
          id: "g17",
          t: "도",
          tag: "“HAM” YUKLAMASI",
          d: "“ham, shuningdek” ma’nosi. 은/는 va 이/가 o‘rniga qo‘yiladi.",
          f: "Ot + 도",
          ex: [
            ["저도 학생이에요", "Men ham talabaman"],
            ["물도 마셔요", "Suv ham ichaman"],
          ],
        },
        {
          id: "g18",
          t: "의",
          tag: "EGALIK",
          d: "Qarashlilik: “...ning”. So‘zlashuvda ko‘pincha tushirib qoldiriladi. 저의 → 제 (mening).",
          f: "Ot + 의 + ot",
          ex: [
            ["친구의 책", "Do‘stning kitobi"],
            ["제 친구", "Mening do‘stim"],
          ],
        },
        {
          id: "g19",
          t: "이/그/저",
          tag: "KO‘RSATISH",
          d: "이 — yaqindagi (bu), 그 — gapirilgan yoki yaqin bo‘lmagan (o‘sha), 저 — uzoqdagi (anavi).",
          f: "이/그/저 + ot",
          ex: [
            ["이 책", "Bu kitob"],
            ["그 사람", "O‘sha odam"],
            ["저 집", "Anavi uy"],
          ],
        },
        {
          id: "g20",
          t: "~(으)면",
          tag: "SHART",
          d: "“agar ...sa” ma’nosi.",
          f: "Fe’l o‘zagi (unli) + 면\nFe’l o‘zagi (undosh) + 으면",
          ex: [
            ["비가 오면 안 가요", "Yomg‘ir yog‘sa bormayman"],
            ["시간이 있으면 와요", "Vaqt bo‘lsa keling"],
          ],
        },
        {
          id: "g21",
          t: "~지 마세요",
          tag: "TAQIQ",
          d: "“...mang” — muloyim taqiq.",
          f: "Fe’l o‘zagi + 지 마세요",
          ex: [
            ["가지 마세요", "Ketmang"],
            ["먹지 마세요", "Yemang"],
          ],
        },
        {
          id: "g22",
          t: "~(으)ㄹ까요?",
          tag: "TAKLIF",
          d: "“...ymizmi?” — taklif yoki fikr so‘rash.",
          f: "Fe’l o‘zagi + ㄹ/을까요?",
          ex: [
            ["같이 갈까요?", "Birga boramizmi?"],
            ["뭘 먹을까요?", "Nima yeymiz?"],
          ],
        },
        {
          id: "g23",
          t: "에게/한테",
          tag: "KIMGA",
          d: "“...ga (shaxsga)” ma’nosi. 한테 — so‘zlashuv, 에게 — yozma.",
          f: "Shaxs + 에게/한테",
          ex: [
            ["친구에게 줘요", "Do‘stimga beraman"],
            ["엄마한테 전화해요", "Onamga qo‘ng‘iroq qilaman"],
          ],
        },
        {
          id: "g24",
          t: "~아/어서",
          tag: "SABAB / KETMA-KETLIK",
          d: "“...gani uchun” yoki “...ib, keyin”. Buyruq va taklif bilan ishlatilmaydi.",
          f: "Fe’l o‘zagi + 아/어서",
          ex: [
            ["배고파서 먹어요", "Ochiqqanim uchun yeyman"],
            ["집에 가서 쉬어요", "Uyga borib dam olaman"],
          ],
        },
        {
          id: "g25",
          t: "부터 / 까지",
          tag: "VAQT ORALIG‘I",
          d: "부터 — “...dan (boshlab)”, 까지 — “...gacha”.",
          f: "Vaqt/joy + 부터 ... + 까지",
          ex: [
            ["9시부터 5시까지", "9dan 5gacha"],
            ["월요일부터 금요일까지", "Dushanbadan jumagacha"],
          ],
        },
        {
          id: "g26",
          l: "A1",
          t: "~고",
          tag: "VA / KETMA-KETLIK",
          d: "Ikki gapni “va / keyin” bilan bog‘laydi.",
          f: "Fe’l/sifat o‘zagi + 고",
          ex: [
            ["먹고 가요", "Yeb ketaman"],
            ["크고 예뻐요", "Katta va chiroyli"],
          ],
        },
        {
          id: "g27",
          l: "A2",
          t: "~(으)ㄴ/는 + ot",
          tag: "SIFATDOSH",
          d: "Fe’l/sifat otni aniqlaydi. Hozirgi: fe’l+는, sifat(unli)+ㄴ / (undosh)+은. O‘tgan: ㄴ/은. Kelasi: ㄹ/을.",
          f: "Fe’l + 는 + ot\nSifat + ㄴ/은 + ot",
          ex: [
            ["먹는 음식", "Yeyilayotgan ovqat"],
            ["예쁜 옷", "Chiroyli kiyim"],
            ["어제 본 영화", "Kecha ko‘rgan filmim"],
          ],
          x: [
            "있다/없다 bilan: 있는, 없는 (재미있는 영화)",
            "ㄹ-o‘zak: ㄹ tushadi: 살다 → 사는, 만들다 → 만드는",
          ],
        },
        {
          id: "g28",
          l: "A2",
          t: "~아/어 보다",
          tag: "SINAB KO‘RISH",
          d: "“...ib ko‘rmoq” — biror narsani sinab ko‘rish.",
          f: "Fe’l o‘zagi + 아/어 보다",
          ex: [
            ["먹어 보세요", "Yeb ko‘ring"],
            ["한번 해 봤어요", "Bir marta qilib ko‘rdim"],
          ],
        },
        {
          id: "g29",
          l: "A2",
          t: "~아/어야 하다",
          tag: "MAJBURIYAT",
          d: "“...ishi kerak / shart”.",
          f: "Fe’l o‘zagi + 아/어야 해요(되다)",
          ex: [
            ["공부해야 해요", "O‘qishim kerak"],
            ["일찍 가야 돼요", "Erta ketishim kerak"],
          ],
        },
        {
          id: "g30",
          l: "A2",
          t: "~는 중이다",
          tag: "JARAYON",
          d: "“...ayotgan paytda” — harakat hozir davom etmoqda.",
          f: "Fe’l o‘zagi + 는 중이에요",
          ex: [
            ["지금 공부하는 중이에요", "Hozir o‘qiyapman"],
            ["회의 중이에요", "Yig‘ilishda"],
          ],
        },
        {
          id: "g31",
          l: "A2",
          t: "~(으)려고",
          tag: "MAQSAD",
          d: "“...moqchi bo‘lib / ...ish uchun”.",
          f: "Fe’l o‘zagi + (으)려고",
          ex: [["한국에 가려고 공부해요", "Koreyaga borish uchun o‘qiyapman"]],
        },
        {
          id: "g32",
          l: "B1",
          t: "~기 때문에",
          tag: "SABAB (RASMIY)",
          d: "“...gani sababli”. Otdan keyin 때문에: 비 때문에.",
          f: "Fe’l o‘zagi + 기 때문에\nOt + 때문에",
          ex: [
            ["바쁘기 때문에 못 가요", "Bandligim sababli bora olmayman"],
            ["비 때문에 늦었어요", "Yomg‘ir sababli kechikdim"],
          ],
        },
        {
          id: "g33",
          l: "B1",
          t: "~(으)ㄴ 적이 있다",
          tag: "TAJRIBA",
          d: "“...gan edim / ...ganman” — hayotda bo‘lgan tajriba. Inkor: 없다.",
          f: "Fe’l o‘zagi + ㄴ/은 적이 있어요",
          ex: [
            ["한국에 간 적이 있어요", "Koreyada bo‘lganman"],
            ["김치를 먹은 적이 없어요", "Kimchi yemaganman"],
          ],
        },
        {
          id: "g34",
          l: "B1",
          t: "~(으)ㄹ 것 같다",
          tag: "TAXMIN",
          d: "“...ga o‘xshaydi / ...sa kerak”.",
          f: "Fe’l o‘zagi + ㄹ/을 것 같아요",
          ex: [["비가 올 것 같아요", "Yomg‘ir yog‘adiganga o‘xshaydi"]],
        },
        {
          id: "g35",
          l: "B1",
          t: "~게 되다",
          tag: "O‘ZGARISH",
          d: "“...ib qolmoq / ...adigan bo‘lmoq” — vaziyat o‘zgarishi.",
          f: "Fe’l o‘zagi + 게 되다",
          ex: [["한국에서 살게 됐어요", "Koreyada yashaydigan bo‘ldim"]],
        },
        {
          id: "g36",
          l: "B1",
          t: "~는데/(으)ㄴ데",
          tag: "FON / QARAMA-QARSHILIK",
          d: "Fon ma’lumot beradi yoki “...ammo” ma’nosida.",
          f: "Fe’l + 는데\nSifat + ㄴ/은데",
          ex: [
            ["비가 오는데 갈까요?", "Yomg‘ir yog‘yapti, boramizmi?"],
            ["맛있는데 비싸요", "Mazali, lekin qimmat"],
          ],
        },
        {
          id: "g37",
          l: "B2",
          t: "~는 바람에",
          tag: "YOMON SABAB",
          d: "Kutilmagan, salbiy natijaga olib kelgan sabab.",
          f: "Fe’l o‘zagi + 는 바람에",
          ex: [
            ["늦잠을 자는 바람에 지각했어요", "Uxlab qolganim uchun kechikdim"],
          ],
        },
        {
          id: "g38",
          l: "B2",
          t: "~(으)ㄹ 뿐만 아니라",
          tag: "“NAFAQAT...”",
          d: "“...ningina emas, ...ham”.",
          f: "Fe’l/sifat + ㄹ/을 뿐만 아니라",
          ex: [
            [
              "예쁠 뿐만 아니라 똑똑해요",
              "Chiroyli bo‘lishi bilan birga aqlli ham",
            ],
          ],
        },
      ];

export const GL: Record<string, string> = { g12: "A2", g13: "A2", g14: "A2", g20: "A2", g24: "A2" };

export const GX: Record<string, string[]> = {
        g1: ["아니에요: Ot + 이/가 아니에요 (inkor) — 학생이 아니에요"],
        g4: ["So‘zlashuvda 을/를 ko‘pincha tushiriladi: 밥 먹어요"],
        g6: [
          "ㅂ-o‘zak: 덥다→더워요, 돕다→도와요",
          "ㄷ-o‘zak: 듣다→들어요, 걷다→걸어요",
          "으-o‘zak: 쓰다→써요, 바쁘다→바빠요",
          "르-o‘zak: 모르다→몰라요, 빠르다→빨라요",
        ],
        g11: [
          "ㅂ: 덥다→더웠어요",
          "으: 쓰다→썼어요",
          "하다 → 했어요 (하였어요 emas)",
        ],
        g19: ["Ro‘yxat/misol: 이것·그것·저것 (bu/u/anavi narsa)"],
      };

// Asl loyihadagi kabi: daraja va qo'shimcha istisnolarni to'ldiramiz.
GRAMMAR.forEach((g) => {
  g.l = g.l || GL[g.id] || "A1";
  if (GX[g.id]) g.x = [...(g.x || []), ...GX[g.id]];
});
