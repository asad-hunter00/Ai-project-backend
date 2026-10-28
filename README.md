# “O‘ktam ota choyxonasi” — Backend, Supabase Database, Auth va Storage Hujjatlari

Ushbu backend “O‘ktam ota choyxonasi” uchun **faqat backend** talabi asosida ishlab chiqilgan. Tizim frontend, veb-sahifalar, dizayn yoki admin panel interfeysini o‘z ichiga olmaydi; ma’lumotlar bazasi, RLS xavfsizligi, saqlash (Storage) va to‘liq REST API orqali ishlaydi.

---

## 1. Asosiy Ma’lumotlar (Backendda Saqlangan)

- **Nomi:** O‘ktam ota choyxonasi
- **Manzil:** Jizzax shahri, Eron zapravkasi oldida
- **Telefonlar:** `+998915672815` va `+998904869611`
- **Ish vaqti:** 09:00 – 23:50
- **Ish tartibi:** Yakshanba kunlari ishlaydi. Ayrim chorshanbalarda sanitariya-profilaktika sababli dam beriladi (har haftalik doimiy dam olish emas).
- **Xonalar:** 20 ta xona, har biri 10 kishilik sig‘imga ega, barchasi qoralama (draft) holatda va vaqtinchalik nom bilan yaratilgan.
- **Qulayliklar:** Shinam mebellar va konditsioner.
- **Cheklovlar:** Tasdiqlanmagan qavat (floor), narx (price) va zal (hall) kiritilmagan. Rasmlar, aniq xarita havolasi va menyu hali yo‘qligi sababli bo‘sh qoldirilgan.

---

## 2. Fayl Tuzilmasi

```text
/
├── .env.example                               # Supabase URL, anon key, service_role key namunalari
├── README.md                                  # Loyihani sozlash va API qo‘llanmasi
├── metadata.json                              # Applet metama'lumotlari
├── package.json                               # Backend kutubxonalari va scriptlar
├── server.ts                                  # Express REST API server (Port 3000)
├── supabase/
│   ├── migrations/
│   │   ├── 00001_initial_schema.sql          # Jadvallar, cheklovlar, is_admin() funksiyasi va RLS
│   │   └── 00002_storage_setup.sql           # Private storage bucket (choyxona-media) va RLS
│   ├── seed.sql                               # Takrorlanmas (idempotent) boshlang‘ich ma'lumotlar
│   └── tests/
│       └── rls_and_permissions_test.sql       # PostgreSQL darajasidagi RLS tekshiruv skripti
└── src/
    ├── backend/
    │   ├── types/database.types.ts            # TypeScript interfeyslari
    │   ├── config/supabase.ts                 # Supabase Anon, Auth va Service Role mijozlari
    │   ├── validation/schemas.ts              # Zod validatsiya sxemalari
    │   ├── services/                          # Biznes mantiq xizmatlari (UI siz)
    │   │   ├── auth.service.ts                # Admin login, logout, rol tekshiruvi
    │   │   ├── settings.service.ts            # Sozlamalarni o‘qish va tahrirlash
    │   │   ├── rooms.service.ts               # Xonalar CRUD, draft filtr va tartiblash
    │   │   ├── gallery.service.ts             # Rasm yuklash (signed URL) va tozalash
    │   │   └── announcements.service.ts       # E'lonlar CRUD va vaqt bo‘yicha filtrlash
    │   ├── middlewares/                       # Express middlewarelari (JWT va RLS himoya)
    │   │   ├── auth.middleware.ts
    │   │   └── error.middleware.ts
    │   └── routes/                            # REST API yo‘nalishlari
    │       ├── auth.routes.ts
    │       ├── settings.routes.ts
    │       ├── rooms.routes.ts
    │       ├── gallery.routes.ts
    │       └── announcements.routes.ts
    └── tests/
        └── backend_service.test.ts            # Avtomatlashgan integratsiya va xavfsizlik testlari
```

---

## 3. O‘rnatish va Sozlash Tartibi

### 3.1. Supabase loyihasini yaratish
1. [supabase.com](https://supabase.com) saytida yangi loyiha oching.
2. Loyihangizning **Project Settings -> API** bo‘limiga kiring.
3. Loyiha URL manzili (`Project URL`), `anon/public` kaliti va `service_role` kalitini ko‘chirib oling.

### 3.2. Muhit o‘zgaruvchilarini (`.env`) sozlash
Loyiha ildizida `.env` faylini yarating va quyidagi o‘zgaruvchilarni to‘ldiring:

```env
PORT=3000
SUPABASE_URL="https://sizning-loyihangiz.supabase.co"
SUPABASE_ANON_KEY="sizning-anon-kalitingiz"
SUPABASE_SERVICE_ROLE_KEY="sizning-service-role-kalitingiz"
SUPABASE_STORAGE_BUCKET="choyxona-media"
```

### 3.3. SQL Migration va Seedni ishga tushirish
Supabase boshqaruv panelidagi **SQL Editor** bo‘limiga kiring:
1. `supabase/migrations/00001_initial_schema.sql` fayli mazmunini nusxalang va bajaring (`Run`). Bu jadvallar, cheklovlar, `is_admin()` funksiyasi va RLS siyosatlarini yaratadi.
2. `supabase/migrations/00002_storage_setup.sql` fayli mazmunini bajaring. Bu `choyxona-media` nomli xususiy (private) xotira paketini (bucket) va 5MB / MIME cheklovlarini o‘rnatadi.
3. `supabase/seed.sql` fayli mazmunini bajaring. Bu choyxona sozlamalarini va 20 ta draft xonani (har biri 10 kishilik, konditsioner va shinam mebellar bilan) xavfsiz yuklaydi (takroriy chaqirilganda ma'lumotlarni ko‘paytirib yubormaydi).

### 3.4. Supabase Auth sozlamasi (Ochiq ro‘yxatdan o‘tishni o‘chirish)
Administrator bo‘lmagan shaxslar akkaunt ocholmasligi uchun:
- Supabase panelida: **Authentication -> Providers -> Email** bo‘limiga kiring.
- **"Enable Sign up"** opsiyasini o‘chiring (`Disabled`).
- Shunda tizimga faqat administrator orqali qo‘shilgan hisoblar kiritiladi.

---

## 4. Birinchi Administrator Hisobini Yaratish Tartibi

Oddiy foydalanuvchilar o‘zlariga administratorlik huquqini bera olmaydi. Admin huquqi alohida `public.admin_roles` jadvali orqali tekshiriladi.

### 1-usul: Supabase SQL Editor orqali (Tavsiya etiladi)

1. Supabase panelida **Authentication -> Users** bo‘limiga o‘tib, "Add user" orqali yangi admin email va parolini kiriting (Auto Confirm Email belgilansin).
2. Yaratilgan foydalanuvchining UUID identifikatorini (`User UID`) nusxalang.
3. **SQL Editor**da quyidagi buyruqni bajaring:

```sql
INSERT INTO public.admin_roles (user_id, role)
VALUES ('<BU_YERGA_USER_UID_NI_QO‘YING>'::uuid, 'superadmin')
ON CONFLICT (user_id) DO NOTHING;
```

### 2-usul: Backend Bootstrap API orqali (Faqat birinchi marta)

Agar bazada hali birorta ham admin bo‘lmasa, backenddagi himoyalangan endpoint orqali yaratish mumkin:

```bash
curl -X POST http://localhost:3000/api/auth/bootstrap-first-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@oktamota.uz",
    "password": "ParolKamida8Belgi!",
    "role": "admin"
  }'
```
*Izoh: Agar bazada 1 ta bo‘lsa ham admin mavjud bo‘lsa, ushbu endpoint darhol 400 xatolik bilan rad etiladi.*

---

## 5. REST API So‘rov va Javob Misollari

### 5.1. Administrator Kirishi (Login)
- **Endpoint:** `POST /api/auth/login`
- **So‘rov:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@oktamota.uz",
    "password": "ParolKamida8Belgi!"
  }'
```
- **Muvaffaqiyatli Javob:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "e6a2b5e0-...",
      "email": "admin@oktamota.uz",
      "role": "admin"
    },
    "session": {
      "access_token": "eyJhbGciOi...",
      "refresh_token": "...",
      "expires_at": 1793280000
    }
  }
}
```

---

### 5.2. Choyxona Sozlamalari
- **Ommaviy O‘qish (Hamma uchun):** `GET /api/settings`
```bash
curl http://localhost:3000/api/settings
```
Javob:
```json
{
  "success": true,
  "data": {
    "id": "a0000000-0000-0000-0000-000000000001",
    "name": "O‘ktam ota choyxonasi",
    "address": "Jizzax shahri, Eron zapravkasi oldida",
    "phones": ["+998915672815", "+998904869611"],
    "opening_time": "09:00",
    "closing_time": "23:50",
    "schedule_notes": "Yakshanba kunlari ishlaydi. Ayrim chorshanbalarda dam beriladi (har haftalik doimiy dam olish emas).",
    "map_url": null,
    "telegram_url": null,
    "instagram_url": null,
    "updated_at": "2026-10-28T07:00:00Z"
  }
}
```

- **Yangilash (Faqat Administrator):** `PUT /api/settings`
```bash
curl -X PUT http://localhost:3000/api/settings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{
    "schedule_notes": "Yakshanba kunlari ishlaydi. Ushbu haftadagi chorshanba kuni profilaktika sababli dam olinadi."
  }'
```

---

### 5.3. Xonalar (Rooms)
- **Ommaviy O‘qish (Mehmonlar uchun):** `GET /api/rooms`
  *Faqat `is_published = true` bo‘lgan xonalarni qaytaradi. Draftdagi 20 ta xona mehmonlarga ko‘rinmaydi.*
- **Administrator O‘qishi:** `GET /api/rooms` (Headerda `Authorization: Bearer <TOKEN>` berilganda barcha 20 ta draft xonalarni ham ko‘rsatadi).

- **Xona Ma’lumotlarini Yangilash / Nashr Qilish (Admin):**
```bash
curl -X PUT http://localhost:3000/api/rooms/<XONA_UUID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{
    "name": "1-Sharqona xona",
    "is_temporary_name": false,
    "is_published": true
  }'
```

- **Xonalar Tartibini O‘zgartirish (Admin):**
```bash
curl -X PUT http://localhost:3000/api/rooms/reorder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{
    "items": [
      { "id": "uuid-1", "sort_order": 1 },
      { "id": "uuid-2", "sort_order": 2 }
    ]
  }'
```

---

### 5.4. Galereya va Fayllar (Storage & Signed URLs)
Bucket maxfiy (`public = false`) bo‘lib, rasmlar to‘g‘ridan-to‘g‘ri ommaga ochilmaydi.
- **Rasm Yuklash uchun Signed Upload URL Olish (Admin):** `POST /api/gallery/upload-url`
```bash
curl -X POST http://localhost:3000/api/gallery/upload-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{
    "file_name": "xona-1.webp",
    "mime_type": "image/webp",
    "file_size": 2048000
  }'
```
- **Rasmni Bazada Ro‘yxatdan O‘tkazish (Admin):** `POST /api/gallery`
```bash
curl -X POST http://localhost:3000/api/gallery \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{
    "room_id": "<XONA_UUID>",
    "file_path": "uploads/1740000000_xona-1.webp",
    "file_name": "xona-1.webp",
    "file_size": 2048000,
    "mime_type": "image/webp",
    "description": "Shinam mebellar bilan jihozlangan 1-xona",
    "is_published": true
  }'
```
- **Rasmni O‘chirish (Admin):** `DELETE /api/gallery/<RASM_UUID>`
  *Fayl Supabase Storage’dan ham, `gallery_images` jadvalidan ham birgalikda o‘chiriladi (qolib ketgan fayllar bo‘lmaydi).*

---

### 5.5. E‘lonlar (Announcements)
- **Faol E‘lonlarni Olish (Ommaviy):** `GET /api/announcements`
  *Faqat `is_published = true`, `starts_at <= hozirgi_vaqt` va `ends_at >= hozirgi_vaqt` bo‘lgan e‘lonlar chiqadi.*
- **Yangi E‘lon Yaratish (Admin):** `POST /api/announcements`
```bash
curl -X POST http://localhost:3000/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \
  -d '{
    "title": "Chorshanba kuni profilaktika",
    "content": "Hurmatli mehmonlar, ushbu chorshanba kuni choyxonamizda profilaktika ishlari olib boriladi.",
    "starts_at": "2026-10-28T09:00:00Z",
    "ends_at": "2026-10-28T23:50:00Z",
    "is_published": true
  }'
```

---

## 6. Xavfsizlik Kafolatlari

1. **Row Level Security (RLS):** Barcha jadvallarda yoqilgan (`admin_roles`, `restaurant_settings`, `rooms`, `gallery_images`, `announcements`).
2. **Rol O‘g‘irlashdan Himoya:** `is_admin()` funksiyasi `SECURITY DEFINER` va qat‘iy `SET search_path = public` bilan yozilgan.
3. **Draftlar Himoyasi:** Mehmon so‘rovlarida va RLS darajasida `is_published = false` bo‘lgan barcha yozuvlar (jumladan 20 ta xona va qoralama rasmlar) yashiriladi.
4. **Validatsiya:** Zod sxemalari orqali sig‘im musbat bo‘lishi, e‘lon tugash vaqti boshlanishidan keyin bo‘lishi va tasdiqlanmagan maydonlar kiritilmasligi ta’minlangan.
5. **Private Storage:** Fayllarga to‘g‘ridan-to‘g‘ri havolalar berilmaydi; faqat ruxsat tekshirilgandan so‘ng qisqa muddatli Signed URL hosil qilinadi.

---

## 7. Testlarni Ishga Tushirish

Backend validatsiya, xavfsizlik va ruxsatlarni tekshirish uchun:

```bash
npm test
```
Tekshirilgan bandlar:
- 20 ta draft xona va vaqtinchalik nom cheklovlari
- Tasdiqlanmagan `price`, `floor`, `hall` maydonlarini qat'iy rad etish
- Sig‘imning musbatligi (`capacity > 0`)
- Rasm formatlari (JPEG, PNG, WebP) va 5MB maksimal hajm cheklovi
- E‘lon sanalari mantiqi (`ends_at > starts_at`)
- Mehmonlarga faqat nashr etilgan ma'lumotlarni ko‘rsatish
