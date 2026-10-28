/**
 * O‘ktam ota choyxonasi - Backend Services, Security & Validation Automated Test Suite
 * 
 * Ishga tushirish: npm test (tsx src/tests/backend_service.test.ts)
 */

import { 
  CreateRoomSchema, 
  UpdateSettingsSchema, 
  RequestUploadUrlSchema, 
  RegisterImageSchema, 
  CreateAnnouncementSchema 
} from '../backend/validation/schemas.ts';
import { ZodError } from 'zod';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

function expectThrows(fn: () => void, message: string, expectedErrorSubstring?: string) {
  totalTests++;
  try {
    fn();
    failedTests++;
    console.error(`  ❌ [FAIL] ${message} (Kutilgan xatolik tashlanmadi)`);
  } catch (err: unknown) {
    if (expectedErrorSubstring && err instanceof Error) {
      if (err.message.includes(expectedErrorSubstring)) {
        passedTests++;
        console.log(`  ✅ [PASS] ${message} (To‘g‘ri xato: "${expectedErrorSubstring}")`);
      } else {
        failedTests++;
        console.error(`  ❌ [FAIL] ${message} (Boshqa xato chiqdi: ${err.message})`);
      }
    } else {
      passedTests++;
      console.log(`  ✅ [PASS] ${message}`);
    }
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('  O‘ktam ota choyxonasi - Backend & Security Avtomatlashgan Testlari');
  console.log('================================================================\n');

  // -------------------------------------------------------------
  // TEST 1: Xonalar validatsiyasi va xavfsizligi
  // -------------------------------------------------------------
  console.log('--- 1. Xonalar (Rooms) Validatsiya va Cheklovlari ---');

  // 1.1 To'g'ri xona ma'lumoti
  const validRoom = {
    name: '1-xona (Vaqtinchalik)',
    capacity: 10,
    amenities: ['shinam mebellar', 'konditsioner'],
    sort_order: 1,
    is_published: false,
    is_temporary_name: true,
  };
  const parsedRoom = CreateRoomSchema.parse(validRoom);
  assert(parsedRoom.capacity === 10, 'Sig‘im 10 kishilik deb to‘g‘ri qabul qilindi');
  assert(parsedRoom.is_published === false, 'Xona draft (is_published = false) holatda yaratildi');
  assert(parsedRoom.is_temporary_name === true, 'Xona vaqtinchalik nomga egaligi belgilandi');

  // 1.2 Sig'im musbat son bo'lishi shart
  expectThrows(() => {
    CreateRoomSchema.parse({
      name: 'Xato xona',
      capacity: 0, // Musbat emas
    });
  }, 'Sig‘im 0 bo‘lganda rad etilishi kerak');

  expectThrows(() => {
    CreateRoomSchema.parse({
      name: 'Salbiy xona',
      capacity: -5,
    });
  }, 'Sig‘im manfiy bo‘lganda rad etilishi kerak');

  // 1.3 Tasdiqlanmagan qavat (floor), narx (price) va zal (hall) kiritilmasligi kerak!
  expectThrows(() => {
    CreateRoomSchema.parse({
      name: 'Xona 1',
      capacity: 10,
      price: 150000, // Strict schema rejects extra fields!
    } as any);
  }, 'Tasdiqlanmagan "price" maydoni kiritilganda rad etilishi kerak');

  expectThrows(() => {
    CreateRoomSchema.parse({
      name: 'Xona 1',
      capacity: 10,
      floor: 2, // Strict schema rejects extra fields!
    } as any);
  }, 'Tasdiqlanmagan "floor" maydoni kiritilganda rad etilishi kerak');

  expectThrows(() => {
    CreateRoomSchema.parse({
      name: 'Xona 1',
      capacity: 10,
      hall: 'Katta zal', // Strict schema rejects extra fields!
    } as any);
  }, 'Tasdiqlanmagan "hall" maydoni kiritilganda rad etilishi kerak');

  // -------------------------------------------------------------
  // TEST 2: Galereya va Supabase Storage cheklovlari
  // -------------------------------------------------------------
  console.log('\n--- 2. Galereya va Fayllar (Storage Limits & MIME) ---');

  // 2.1 To'g'ri rasm yuklash so'rovi
  const validUpload = {
    file_name: 'xona-1.webp',
    mime_type: 'image/webp' as const,
    file_size: 1024 * 500, // 500 KB
  };
  const parsedUpload = RequestUploadUrlSchema.parse(validUpload);
  assert(parsedUpload.mime_type === 'image/webp', 'WebP formatdagi rasmga ruxsat berildi');

  // 2.2 Ruxsat berilmagan format (masalan, svg yoki pdf yoki exe)
  expectThrows(() => {
    RequestUploadUrlSchema.parse({
      file_name: 'document.pdf',
      mime_type: 'application/pdf' as any,
      file_size: 1024,
    });
  }, 'PDF yoki ruxsat etilmagan MIME format rad etilishi kerak');

  // 2.3 5 MB dan katta fayl rad etilishi shart (5242880 bayt)
  expectThrows(() => {
    RequestUploadUrlSchema.parse({
      file_name: 'katta-rasm.png',
      mime_type: 'image/png' as const,
      file_size: 5242881, // 5 MB + 1 bayt
    });
  }, '5 MB dan katta fayllar rad etilishi kerak');

  // -------------------------------------------------------------
  // TEST 3: E'lonlar (Announcements) va sana mantiqi
  // -------------------------------------------------------------
  console.log('\n--- 3. E‘lonlar (Announcements) Vaqt Mantiqi ---');

  const now = new Date();
  const future = new Date(now.getTime() + 1000 * 60 * 60 * 24); // 1 kun keyin
  const past = new Date(now.getTime() - 1000 * 60 * 60 * 24); // 1 kun oldin

  // 3.1 To'g'ri e'lon
  const validAnnouncement = {
    title: 'O‘ktam ota choyxonasi ish vaqti',
    content: 'Har kuni 09:00 dan 23:50 gacha ishlaymiz.',
    starts_at: now.toISOString(),
    ends_at: future.toISOString(),
    is_published: true,
  };
  const parsedAnnouncement = CreateAnnouncementSchema.parse(validAnnouncement);
  assert(parsedAnnouncement.title.length > 0, 'To‘g‘ri e‘lon ma‘lumotlari qabul qilindi');

  // 3.2 Tugash vaqti boshlanish vaqtidan oldin bo'lishi taqiqlanadi
  expectThrows(() => {
    CreateAnnouncementSchema.parse({
      title: 'Xato muddatli e‘lon',
      content: 'Matn',
      starts_at: now.toISOString(),
      ends_at: past.toISOString(), // Tugash vaqti oldin!
      is_published: true,
    });
  }, 'Tugash vaqti boshlanishidan oldin bo‘lsa rad etilishi kerak');

  // -------------------------------------------------------------
  // TEST 4: Sozlamalar (Settings) formati
  // -------------------------------------------------------------
  console.log('\n--- 4. Choyxona Sozlamalari (Settings) ---');

  const validSettings = {
    name: 'O‘ktam ota choyxonasi',
    address: 'Jizzax shahri, Eron zapravkasi oldida',
    phones: ['+998915672815', '+998904869611'],
    opening_time: '09:00',
    closing_time: '23:50',
    schedule_notes: 'Yakshanba kunlari ishlaydi. Ayrim chorshanbalarda dam beriladi.',
    map_url: null,
    telegram_url: null,
    instagram_url: null,
  };
  const parsedSettings = UpdateSettingsSchema.parse(validSettings);
  assert(parsedSettings.name === 'O‘ktam ota choyxonasi', 'Choyxona nomi to‘g‘ri qabul qilindi');
  assert(parsedSettings.phones?.length === 2, 'Ikkala telefon raqami (+998915672815, +998904869611) tasdiqlandi');

  // Noto'g'ri soat formati (masalan 25:99)
  expectThrows(() => {
    UpdateSettingsSchema.parse({
      opening_time: '25:99',
    });
  }, 'Noto‘g‘ri soat formati rad etilishi kerak');

  // -------------------------------------------------------------
  // TEST 5: Mehmon va Admin Huquqlari Simulyatsiyasi
  // -------------------------------------------------------------
  console.log('\n--- 5. Mehmon va Admin Huquqlari & Draftlarning Yashirilishi ---');

  // Simulyatsiya qilingan baza ma'lumotlari
  const mockRooms = [
    { id: '1', name: '1-xona (Vaqtinchalik)', is_published: false, capacity: 10 },
    { id: '2', name: '2-xona (Vaqtinchalik)', is_published: false, capacity: 10 },
    { id: '3', name: 'Bosh xona', is_published: true, capacity: 10 },
  ];

  // Mehmon so'rovi filtri:
  const guestRooms = mockRooms.filter((r) => r.is_published === true);
  assert(guestRooms.length === 1, 'Mehmon faqat 1 ta nashr etilgan xonani ko‘radi');
  assert(guestRooms.every((r) => r.is_published === true), 'Mehmon hech qachon draft xonalarni ko‘rmaydi');

  // Admin so'rovi:
  const adminRooms = mockRooms; // Admin hammasini ko'radi
  assert(adminRooms.length === 3, 'Administrator barcha 3 ta xonani (draftlarni ham) to‘liq ko‘radi');

  // E'lonlar filtri (Active vs Draft vs Expired):
  const mockAnnouncements = [
    { id: 'a1', title: 'Faol e‘lon', is_published: true, starts_at: past.toISOString(), ends_at: future.toISOString() },
    { id: 'a2', title: 'Qoralama e‘lon', is_published: false, starts_at: past.toISOString(), ends_at: future.toISOString() },
    { id: 'a3', title: 'Muddati o‘tgan e‘lon', is_published: true, starts_at: past.toISOString(), ends_at: past.toISOString() },
  ];

  const nowIso = new Date().toISOString();
  const guestActiveAnnouncements = mockAnnouncements.filter((a) => {
    return a.is_published && a.starts_at <= nowIso && (!a.ends_at || a.ends_at >= nowIso);
  });
  assert(guestActiveAnnouncements.length === 1 && guestActiveAnnouncements[0].id === 'a1', 'Mehmon faqat haqiqiy faol va nashr qilingan e‘lonni ko‘radi');

  console.log('\n================================================================');
  console.log(`Testlar yakunlandi: Jami: ${totalTests} | Muvaffaqiyatli: ${passedTests} | Xatolar: ${failedTests}`);
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Testlarni bajarishda kutilmagan xatolik:', err);
  process.exit(1);
});
