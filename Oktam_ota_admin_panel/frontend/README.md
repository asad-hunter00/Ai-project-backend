# O‘ktam ota — admin panelni ishga tushirish

Bu paketda frontend va backend alohida papkalarda. Kod tayyor, ammo jonli Render, Netlify va Supabase loyihangiz bu paket bilan hali yangilanmagan.

## 1. Supabase bazasini yangilash
Mavjud loyihangizda 00001, 00002 va eski seed avval bajarilgan. Supabase → SQL Editor → New query orqali faqat `backend/supabase/migrations/00003_admin_panel_menu.sql` faylini bajaring. Shu fayl paketning boshida ham bor. Eski seed.sql ni qayta ishlatmang.

Bu migration menyu jadvalini, tarjimalar maydonlarini, xavfsizlik siyosatlarini, 16 ta menyu yozuvini va mavjud 7 ta galereya rasmi uchun metama’lumotni qo‘shadi. Xarita, manzil, Instagram va Telegramni yangilaydi. Migration qayta bajarilganda admin keyinchalik tahrirlagan menyu narxlari saqlanadi. Avval baza backupini oling.

Mavjud rasmlar frontend/public/images ichida qoladi; ular Supabase’ga yuklandi deb hisoblanmaydi. Admin yangi yuklagan JPEG/PNG/WebP rasmlar private choyxona-media bucketida saqlanadi (5 MB gacha).

## 2. Backendni Render’da yangilash
`backend` ichidagi loyiha fayllarini backend GitHub repository ildiziga joylashtiring: package.json va server.ts bevosita ildizda tursin. node_modules, .env va dist yuklanmasin. Eski ishlatilmaydigan Vite dashboard fayllarini olib tashlash mumkin — yangi server faqat API.

Render build command: `npm ci && npm run build`
Render start command: `npm start`
Node.js: 22 yoki undan yuqori.
Environment ichidagi mavjud SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY va SUPABASE_STORAGE_BUCKET=choyxona-media qiymatlarini saqlang. ALLOWED_ORIGINS ga haqiqiy frontend URL’ini yozing; bir nechta origin vergul bilan ajratiladi, oxirida slash bo‘lmasin. PORT’ni Render o‘zi beradi.

Service role maxfiy va faqat backendda. Frontendga yoki GitHub kodiga qo‘ymang. Anon key’ni service role o‘rniga yozmang.
Deploydan so‘ng `/api/health` endpointini tekshiring; agar bu yo‘l mavjud bo‘lmasa `/health` ni tekshiring. Server ildizida eski dashboard ko‘rinmasligi normal. `/api/settings` va `/api/menu` JSON javob qaytarishi kerak.

## 3. Frontendni yangilash
`frontend` ichidagi fayllarni frontend repository ildiziga joylashtiring. Mavjud dizayn, UZ/RU/EN, light/dark, menyu tafsilotlari va galereya saqlangan.
`.env.production` da `VITE_API_BASE_URL=/backend` bor. `public/_redirects` Netlify so‘rovlarini Render API’ga uzatadi va React route’larining qayta ochilishini ta’minlaydi.

Mahalliy ishga tushirish:
```
npm ci
npm run dev
```
Tekshirish va Netlify build: `npm run build`; publish directory: `dist`.
Boshqa hostingda `/backend` proxy va SPA rewrite qoidalarini alohida sozlash kerak.

## 4. Administrator kirishi
Saytingiz manziliga `/admin/login` qo‘shing. Avval yaratgan Supabase admin email va parolingiz bilan kiring. Oddiy Auth foydalanuvchisi administrator hisoblanmaydi.

Agar hali admin bo‘lmasa: Supabase → Authentication → Users → Add user orqali email/parol bilan foydalanuvchi yarating, emailini tasdiqlang va UUID nusxalang. SQL Editor’da o‘zingizning haqiqiy UUID’ingiz bilan bajaring:
```
insert into public.admin_roles (user_id, role)
values ('AUTH_USER_UUID_BU_YERGA', 'superadmin')
on conflict (user_id) do update set role = excluded.role;
```
Bu ish faqat Supabase boshqaruv panelida bajariladi. Ochiq ro‘yxatdan o‘tish va bootstrap-admin endpointi yo‘q. Auth sozlamasida yangi foydalanuvchi signup’ini o‘chirib qo‘ying.

Bo‘limlar: Umumiy, Menyu, Xonalar, Galereya, E’lonlar, Sozlamalar. Menyu narxi/birligi, uch tildagi matnlar, rasm, tartib va nashr holatini boshqarish mumkin. Xonalar va galereya uchun qo‘shish/tahrirlash/o‘chirish mavjud. O‘chirish tasdiqlanadi. E’lon vaqti Asia/Tashkent bo‘yicha kiritiladi. Bo‘sh yakun sanasi — muddatsiz.

Admin sessiyasi faqat joriy tab sessionStorage’ida turadi; parol va service role saqlanmaydi. Sessiya tugasa qayta kiring. Chiqishda mahalliy sessiya tozalanadi. Saytdagi ma’lumot baza orqali keladi; admin o‘zgartirgach saytni yangilab ko‘ring. Ochiq sahifa fokusga qaytganda ham yangilanadi.

## Tekshirilgan va qo‘lda tekshiriladigan ishlar
Kodda frontend build, backend TypeScript build va API xavfsizlik testlari o‘tdi. Alohida mahalliy PostgreSQL muhitida migration/RLS, anonim va oddiy foydalanuvchi yozuvlari bloklanishi tekshirildi. Brauzer sinovida API maketi bilan login, narx tahriri, nashr, upload, e’lon, sozlamalar, logout va mobil ko‘rinish tekshirildi. Bular sizning jonli Supabase’ingizda yangi o‘zgarishlar bajarilganini bildirmaydi.

Deploydan keyin o‘zingiz tekshiring: mehmon /admin ga kirganda login chiqadi; noto‘g‘ri/oddiy foydalanuvchi yozolmaydi; admin menyu narxini o‘zgartirganda ommaviy sahifa yangilanadi; draft xonalar/e’lonlar ko‘rinmaydi; real rasm yuklanadi va o‘chadi; xarita va ijtimoiy havolalar ochiladi. Birinchi sinovni draft yozuv bilan bajaring.

API ulanmasa xato xabari ko‘rinadi va mavjud statik kontent vaqtincha ko‘rsatiladi. Muvaffaqiyatli bo‘sh API javobi bo‘sh holat sifatida qoladi. Admin panelda soxta saqlash yoki soxta statistikalar yo‘q.

Bron, taom buyurtmasi, to‘lov, mijoz ro‘yxati, SMS va Telegram bot qo‘shilmagan. Telegram — oddiy aloqa havolasi. Mijoz fikrlari yoki go‘sht manbasi haqida tasdiqlanmagan ma’lumotlar yaratilmagan.
