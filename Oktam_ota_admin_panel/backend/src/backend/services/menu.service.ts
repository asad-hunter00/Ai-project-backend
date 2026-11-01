import { getAnonClient, getAuthClient, getServiceClient, STORAGE_BUCKET } from '../config/supabase.ts';
import type { MenuRecord } from '../types/database.types.ts';
export class MenuService {
  static async list(token?: string) {
    const client = token ? getAuthClient(token) : getAnonClient();
    let query = client.from('menu_items').select('*').order('sort_order');
    if (!token) query = query.eq('is_published', true);
    const { data, error } = await query;
    if (error) throw new Error(`Menyuni olishda xatolik: ${error.message}`);
    return Promise.all((data as MenuRecord[]).map(async item => {
      if (!item.gallery_image_id) return { ...item, signed_url: item.image_url };
      // Access to this menu row has already been restricted by RLS/admin middleware.
      const { data: image, error: imageError } = await getServiceClient().from('gallery_images').select('file_path,public_path').eq('id', item.gallery_image_id).single();
      if (imageError || !image) return { ...item, signed_url: null };
      if (image.public_path) return { ...item, signed_url: image.public_path };
      const { data: signed, error: signError } = await getServiceClient().storage.from(STORAGE_BUCKET).createSignedUrl(image.file_path, 3600);
      if (signError) throw new Error('Menyu rasmini ochib bo‘lmadi');
      return { ...item, signed_url: signed.signedUrl };
    }));
  }
  static async create(token: string, data: Record<string,unknown>) {
    const { data: row, error } = await getAuthClient(token).from('menu_items').insert(data).select().single();
    if (error) throw new Error(error.message); return row;
  }
  static async update(token: string, id: string, updates: Record<string,unknown>) {
    const { data, error } = await getAuthClient(token).from('menu_items').update(updates).eq('id',id).select().single();
    if (error) throw new Error(error.message); return data;
  }
  static async remove(token: string, id: string) {
    const { data, error } = await getAuthClient(token).from('menu_items').delete().eq('id',id).select('id');
    if (error) throw new Error(error.message); if (!data?.length) throw new Error('Taom topilmadi');
  }
}
