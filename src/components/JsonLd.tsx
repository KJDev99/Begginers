/**
 * Schema.org structured data (JSON-LD) ni sahifaga qo'shadi.
 * Google qidiruv natijalarida boyroq ko'rinish uchun ishlatiladi.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Ma'lumot loyihaning o'zidan keladi, foydalanuvchi kiritmaydi.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
