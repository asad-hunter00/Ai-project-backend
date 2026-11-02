# Videolar bo‘limini ishga tushirish

Bu paketda frontend, backend va 00004 SQL bor. Mavjud Supabase loyihasi va admin hisobidan foydalaning. Eski jadvallarni o‘chirmang.

## 1. Supabase
SQL Editor’da 00004_videos.sql faylining to‘liq matnini bajaring. Oldingi 00001–00003 bajarilgan bo‘lishi kerak; ularni qayta bajarish kerak emas.
Migratsiya videos jadvali, RLS va private choyxona-videos bucketini yaratadi. Faqat MP4, 50 MB gacha. Rasmlar bucketi o‘zgarmaydi.

## 2. Backend (Render)
Backend.zip ichidagi Oktam_ota_admin_panel/backend fayllari GitHub Ai-project-backend repository’sidagi xuddi shu papkani yangilash uchun. Butun repository’ni o‘chirmang. Mavjud Render Environment kalitlarini saqlang.
Render Root Directory: Oktam_ota_admin_panel/backend
Build: npm ci && npm run build
Start: npm start
Push qiling va deploy tugashini kuting. /api/health da admin-panel-1.2-videos chiqishi kerak.

## 3. Frontend (Netlify / mahalliy)
Frontend.zip ichida package.json, src, public bevosita turadi. Fayllarni frontend repository’sining asosiy papkasiga joylashtiring, yana ichki loyiha papkasi yaratmang. Mavjud .env ni saqlang; VITE_API_BASE_URL=/backend bo‘lsin. API manziliga maxfiy kalit kiritilmaydi.
npm ci
npm run build
Mahalliy ish: npm run dev. .env o‘zgarsa, serverni to‘xtatib qayta yoqing.
Netlify Environment VITE_API_BASE_URL=/backend qiymatini saqlang. GitHub front-end-ai main branchiga push qiling. Netlify yangilanishini kuting.

## 4. Video yuklash
/admin/login orqali kiring → Videolar → Video qo‘shish.
MP4 tanlang, UZ nomini to‘ldiring, kerak bo‘lsa RU/EN tarjimalarini yozing. Saqlashni bosing va yuklash hamda tekshiruv tugaguncha sahifani yopmang. Maksimal 50 MB. Telefonlar uchun MP4 ichida H.264 video va AAC audio ishlating; ovozsiz video ham mumkin. Musiqa bo‘limi yo‘q.
Dastlab qoralama saqlang. /videos da ko‘rinmasligini tekshiring. Keyin tahrirlab Nashr qilishni yoqing va /videos sahifasini yangilang. Sana-vaqt Toshkent (UTC+5) bo‘yicha avtomatik chiqadi. Tahrirlashda dastlabki qo‘shilgan sana o‘zgarmaydi.
Nomi, tavsifi, tartibi va nashr holatini tahrirlash mumkin. Video faylini almashtirish uchun yangi video qo‘shib, eskisini o‘chiring. O‘chirish tasdiqdan keyin faylni ham o‘chiradi.

## Tekshiruvlar va cheklovlar
Frontend va backend build o‘tdi. API testlari: anonim/member yozish bloklanishi, hajm/MIME tekshiruvi, MP4 belgisini tekshirish, upload complete va tahrirlash. PGlite’da migratsiyani takror bajarish va draft/published RLS sinovi o‘tdi.
Haqiqiy Supabase’da MP4 yuklash bu muhitda bajarilmadi; deploydan keyin bitta kichik video bilan yuqoridagi sinovni bajaring. Brauzer preview bu muhitda localhost’ga ulana olmadi.
Videolar o‘z-o‘zidan ijro etilmaydi. Private video ko‘rish havolasi bir soat amal qiladi: yashirilgan video uchun ilgari olingan havola shu muddatgacha ishlashi mumkin. /videos ochiq turganda 45 daqiqada havolalar yangilanadi.
Signed upload havolasi bilan MP4 to‘g‘ridan-to‘g‘ri Storage’ga yuklanadi. Backend nashrdan oldin haqiqiy fayl hajmi va MP4 sarlavhasini tekshiradi. Upload muvaffaqiyatsiz tugasa ilova imkon qadar qoralama/faylni tozalaydi. Yuklash paytida brauzer yopilsa tugallanmagan yozuv qolishi mumkin; u saytda ko‘rinmaydi. Storage hajmini nazorat qiling.
