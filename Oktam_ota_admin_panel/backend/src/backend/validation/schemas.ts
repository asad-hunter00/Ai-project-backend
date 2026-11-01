/**
 * O‘ktam ota choyxonasi - Request Validation Schemas (Zod)
 */
import { z } from 'zod';

export const LocalizedSchema = z.object({ uz: z.string().trim().max(3000), ru: z.string().trim().max(3000), en: z.string().trim().max(3000) }).strict();
const webUrl = z.string().refine(v => { try { return ['http:', 'https:'].includes(new URL(v).protocol); } catch { return false; } }, 'Faqat http/https havola kiriting');
// 1. ADMIN AUTHENTICATION
export const LoginSchema = z.object({
  email: z.string().trim().email('To‘g‘ri elektron pochta manzilini kiriting'),
  password: z.string().min(6, 'Parol kamida 6 belgidan iborat bo‘lishi kerak'),
});

export const CreateFirstAdminSchema = z.object({
  email: z.string().trim().email('To‘g‘ri elektron pochta manzilini kiriting'),
  password: z.string().min(8, 'Administrator paroli kamida 8 belgidan iborat bo‘lishi kerak'),
  role: z.enum(['admin', 'superadmin']).default('admin'),
});

// 2. RESTAURANT SETTINGS
export const UpdateSettingsSchema = z.object({
  address_i18n: LocalizedSchema.nullable().optional(),
  description_i18n: LocalizedSchema.nullable().optional(),
  schedule_notes_i18n: LocalizedSchema.nullable().optional(),
  name: z.string().trim().min(2, 'Nom kamida 2 ta belgidan iborat bo‘lishi kerak').max(150, 'Nom ko‘pi bilan 150 ta belgi bo‘lishi mumkin').optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  address: z.string().trim().min(5, 'Manzil kamida 5 ta belgidan iborat bo‘lishi kerak').max(300, 'Manzil ko‘pi bilan 300 ta belgi bo‘lishi mumkin').optional(),
  phones: z.array(z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Telefon raqam formati noto‘g‘ri')).min(1, 'Kamida bitta telefon raqami kiritilishi shart').optional(),
  opening_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Ochilish vaqti HH:mm formatida bo‘lishi kerak (masalan, 09:00)').optional(),
  closing_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Yopilish vaqti HH:mm formatida bo‘lishi kerak (masalan, 23:50)').optional(),
  schedule_notes: z.string().trim().max(500).nullable().optional(),
  map_url: webUrl.nullable().optional(),
  telegram_url: webUrl.nullable().optional(),
  instagram_url: webUrl.nullable().optional(),
}).strict(); // Tasdiqlanmagan qo'shimcha maydonlarni qat'iyan rad etish

// 3. ROOMS (Xonalar)
// Muhim: Qavat, narx va zal ma'lumotlari kiritilmasin (strict validation orqali bloklanadi)
export const CreateRoomSchema = z.object({
  name_i18n: LocalizedSchema.nullable().optional(),
  description_i18n: LocalizedSchema.nullable().optional(),
  name: z.string().trim().min(1, 'Xona nomi bo‘sh bo‘lishi mumkin emas').max(100, 'Xona nomi ko‘pi bilan 100 ta belgi bo‘lishi mumkin'),
  description: z.string().trim().max(1000).nullable().optional(),
  capacity: z.number().int('Sig‘im butun son bo‘lishi kerak').positive('Sig‘im musbat son bo‘lishi shart (1 yoki undan yuqori)'),
  amenities: z.array(z.string().trim()).default(['shinam mebellar', 'konditsioner']),
  sort_order: z.number().int().nonnegative('Tartib raqami 0 yoki undan katta bo‘lishi kerak').default(0),
  is_published: z.boolean().default(false),
  is_temporary_name: z.boolean().default(false),
}).strict();

export const UpdateRoomSchema = CreateRoomSchema.partial().strict();

export const ReorderRoomsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid('ID to‘g‘ri UUID formatida bo‘lishi kerak'),
      sort_order: z.number().int().nonnegative(),
    })
  ).min(1, 'Kamida bitta element taqdim etilishi kerak'),
});

export const AllowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

// 4. GALLERY & FILES
export const RegisterImageSchema = z.object({
  description_i18n: LocalizedSchema.nullable().optional(),
  room_id: z.string().uuid('Xona IDsi to‘g‘ri UUID bo‘lishi kerak').nullable().optional(),
  file_path: z.string().min(1, 'Fayl yo‘li talab qilinadi'),
  file_name: z.string().min(1, 'Fayl nomi talab qilinadi').max(255),
  file_size: z.number().int().positive().max(5242880, 'Fayl hajmi maksimal 5 MB (5,242,880 bayt) bo‘lishi mumkin'),
  mime_type: z.enum(AllowedMimeTypes),
  description: z.string().trim().max(500).nullable().optional(),
  sort_order: z.number().int().nonnegative().default(0),
  is_published: z.boolean().default(false),
}).strict();

export const UpdateImageSchema = z.object({
  description_i18n: LocalizedSchema.nullable().optional(),
  room_id: z.string().uuid().nullable().optional(),
  description: z.string().trim().max(500).nullable().optional(),
  sort_order: z.number().int().nonnegative().optional(),
  is_published: z.boolean().optional(),
}).strict();

export const RequestUploadUrlSchema = z.object({
  file_name: z.string().min(1).max(255),
  mime_type: z.enum(AllowedMimeTypes),
  file_size: z.number().int().positive().max(5242880),
  room_id: z.string().uuid().nullable().optional(),
});

// 5. ANNOUNCEMENTS (E'lonlar)
export const CreateAnnouncementSchema = z.object({
  title_i18n: LocalizedSchema.nullable().optional(),
  content_i18n: LocalizedSchema.nullable().optional(),
  title: z.string().trim().min(1, 'Sarlavha bo‘sh bo‘lishi mumkin emas').max(200, 'Sarlavha ko‘pi bilan 200 ta belgi bo‘lishi mumkin'),
  content: z.string().trim().min(1, 'E‘lon matni bo‘sh bo‘lishi mumkin emas'),
  starts_at: z.string().datetime({ message: 'Boshlanish vaqti to‘g‘ri ISO datetime formatida bo‘lishi kerak' }),
  ends_at: z.string().datetime({ message: 'Tugash vaqti to‘g‘ri ISO datetime formatida bo‘lishi kerak' }).nullable().optional(),
  is_published: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.ends_at) {
      return new Date(data.ends_at).getTime() > new Date(data.starts_at).getTime();
    }
    return true;
  },
  {
    message: 'Tugash vaqti boshlanish vaqtidan keyin bo‘lishi shart',
    path: ['ends_at'],
  }
);

export const UpdateAnnouncementSchema = z.object({
  title_i18n: LocalizedSchema.nullable().optional(),
  content_i18n: LocalizedSchema.nullable().optional(),
  title: z.string().trim().min(1).max(200).optional(),
  content: z.string().trim().min(1).optional(),
  starts_at: z.string().datetime().optional(),
  ends_at: z.string().datetime().nullable().optional(),
  is_published: z.boolean().optional(),
}).refine(
  (data) => {
    if (data.starts_at && data.ends_at) {
      return new Date(data.ends_at).getTime() > new Date(data.starts_at).getTime();
    }
    return true;
  },
  {
    message: 'Tugash vaqti boshlanish vaqtidan keyin bo‘lishi shart',
    path: ['ends_at'],
  }
);

const publicImage = z.string().refine(v => /^\/images\/[a-zA-Z0-9/_ .-]+$/.test(v) && !v.includes('..') || /^https:\/\//.test(v), 'Xavfsiz rasm havolasini kiriting');
export const CreateMenuSchema = z.object({
  id: z.string().regex(/^[a-z0-9][a-z0-9-]{0,79}$/),
  name: LocalizedSchema.refine(v => v.uz.length > 0, 'O‘zbekcha nom kerak'),
  category: LocalizedSchema.nullable().default(null), description: LocalizedSchema.nullable().default(null),
  meat: LocalizedSchema.nullable().default(null), ingredients: LocalizedSchema.nullable().default(null),
  source: LocalizedSchema.nullable().default(null), quality: LocalizedSchema.nullable().default(null),
  portion: LocalizedSchema.nullable().default(null), price: z.number().int().nonnegative().nullable().default(null),
  price_unit: z.enum(['piece','kg','portion']).default('piece'), image_url: publicImage.nullable().default(null),
  gallery_image_id: z.string().uuid().nullable().default(null), image_fit: z.enum(['contain','cover']).default('contain'),
  image_caption: LocalizedSchema.nullable().default(null), is_published: z.boolean().default(false),
  sort_order: z.number().int().nonnegative().default(0),
}).strict();
export const UpdateMenuSchema = CreateMenuSchema.omit({ id: true }).partial().strict();
export const UploadImageSchema = z.object({
  file_name: z.string().min(1).max(200), mime_type: z.enum(AllowedMimeTypes),
  base64: z.string().min(1).max(7000000), room_id: z.string().uuid().nullable().optional(),
  description: z.string().max(500).nullable().optional(), description_i18n: LocalizedSchema.nullable().optional(),
  is_published: z.boolean().default(false), sort_order: z.number().int().nonnegative().default(0),
}).strict();
