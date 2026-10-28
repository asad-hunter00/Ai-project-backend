/**
 * O‘ktam ota choyxonasi - Gallery & Storage Service
 */
import { getAnonClient, getAuthClient, getServiceClient, STORAGE_BUCKET } from '../config/supabase.ts';
import { GalleryImage } from '../types/database.types.ts';

export class GalleryService {
  /**
   * Rasmlar ro'yxatini olish:
   * - Mehmonlarga faqat nashr etilgan (is_published = true) rasmlar ko'rinadi.
   * - Administrator barcha rasmlarni (jumladan draft rasmlarni) ko'ra oladi.
   * - Private bucket bo'lganligi uchun qisqa muddatli Signed URL lar hosil qilinadi.
   */
  static async getImages(options: { roomId?: string; isAdmin?: boolean } = {}): Promise<GalleryImage[]> {
    const supabase = getAnonClient();
    let query = supabase
      .from('gallery_images')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (options.roomId) {
      query = query.eq('room_id', options.roomId);
    }

    if (!options.isAdmin) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Rasmlarni olishda xatolik: ${error.message}`);
    }

    const images = (data || []) as GalleryImage[];

    // Private bucketdan xavfsiz vaqtinchalik Signed URL lar generatsiya qilish (1 soatlik)
    const imagesWithUrls = await Promise.all(
      images.map(async (img) => {
        try {
          const serviceClient = getServiceClient();
          const { data: signData } = await serviceClient.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(img.file_path, 3600); // 3600 soniya (1 soat)

          return {
            ...img,
            signed_url: signData?.signedUrl || undefined,
          };
        } catch {
          return img;
        }
      })
    );

    return imagesWithUrls;
  }

  /**
   * Rasm yuklash uchun xavfsiz Signed Upload URL olish (Faqat administrator uchun).
   * MIME va hajm cheklovlari tekshiriladi.
   */
  static async createUploadUrl(
    accessToken: string,
    params: {
      fileName: string;
      mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
      fileSize: number;
    }
  ) {
    // 1. Cheklovlarni tekshirish
    if (params.fileSize > 5242880) {
      throw new Error('Fayl hajmi maksimal 5 MB bo‘lishi mumkin');
    }
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(params.mimeType)) {
      throw new Error('Faqat JPEG, PNG yoki WebP formatdagi rasmlarga ruxsat berilgan');
    }

    const userClient = getAuthClient(accessToken);
    const sanitizedFileName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const filePath = `uploads/${timestamp}_${sanitizedFileName}`;

    // Supabase Storage createSignedUploadUrl
    const { data, error } = await userClient.storage
      .from(STORAGE_BUCKET)
      .createSignedUploadUrl(filePath);

    if (error) {
      throw new Error(`Yuklash havolasini yaratishda xatolik: ${error.message}`);
    }

    return {
      file_path: filePath,
      signed_url: data.signedUrl,
      token: data.token,
    };
  }

  /**
   * Yuklangan rasm metama'lumotlarini bazaga saqlash (Faqat administrator).
   */
  static async registerImage(
    accessToken: string,
    data: Omit<GalleryImage, 'id' | 'created_at' | 'updated_at' | 'signed_url'>
  ): Promise<GalleryImage> {
    const userClient = getAuthClient(accessToken);
    const { data: record, error } = await userClient
      .from('gallery_images')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw new Error(`Rasm ma‘lumotlarini saqlashda xatolik: ${error.message}`);
    }

    return record as GalleryImage;
  }

  /**
   * Rasm ma'lumotlarini tahrirlash (Faqat administrator).
   */
  static async updateImage(
    accessToken: string,
    id: string,
    updates: Partial<Pick<GalleryImage, 'room_id' | 'description' | 'sort_order' | 'is_published'>>
  ): Promise<GalleryImage> {
    const userClient = getAuthClient(accessToken);
    const { data, error } = await userClient
      .from('gallery_images')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Rasm ma‘lumotlarini yangilashda xatolik: ${error.message}`);
    }

    return data as GalleryImage;
  }

  /**
   * Rasmni to'liq o'chirish:
   * Fayl storage dan ham, ma'lumotlar bazasidan ham birgalikda o'chiriladi.
   * Bu qolib ketgan (orphaned) fayllar va buzilgan havolalarning oldini oladi.
   */
  static async deleteImage(accessToken: string, id: string): Promise<boolean> {
    const userClient = getAuthClient(accessToken);

    // 1. Rasmni bazadan topish
    const { data: img, error: fetchError } = await userClient
      .from('gallery_images')
      .select('id, file_path')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !img) {
      throw new Error('O‘chiriladigan rasm topilmadi');
    }

    // 2. Storage dan faylni o'chirish
    try {
      await userClient.storage.from(STORAGE_BUCKET).remove([img.file_path]);
    } catch (storageErr) {
      console.warn(`Storage faylini o‘chirishda ogohlantirish:`, storageErr);
    }

    // 3. Bazadan yozuvni o'chirish
    const { error: dbError } = await userClient
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (dbError) {
      throw new Error(`Bazadan yozuvni o‘chirishda xatolik: ${dbError.message}`);
    }

    return true;
  }
}
