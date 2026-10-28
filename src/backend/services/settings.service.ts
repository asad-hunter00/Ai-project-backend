/**
 * O‘ktam ota choyxonasi - Restaurant Settings Service
 */
import { getAnonClient, getAuthClient } from '../config/supabase.ts';
import { RestaurantSettings } from '../types/database.types.ts';

export class SettingsService {
  /**
   * Choyxona sozlamalarini olish (Ommaviy ruxsat: hamma o'qishi mumkin).
   */
  static async getSettings(): Promise<RestaurantSettings> {
    const supabase = getAnonClient();
    const { data, error } = await supabase
      .from('restaurant_settings')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      throw new Error(`Sozlamalarni yuklashda xatolik: ${error.message}`);
    }

    return data as RestaurantSettings;
  }

  /**
   * Choyxona sozlamalarini yangilash (Faqat administrator uchun).
   * RLS orqali admin vakolati tekshiriladi.
   */
  static async updateSettings(
    accessToken: string,
    updates: Partial<Omit<RestaurantSettings, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<RestaurantSettings> {
    const userClient = getAuthClient(accessToken);

    // Birinchi mavjud sozlama ID sini aniqlash
    const current = await this.getSettings();

    const { data, error } = await userClient
      .from('restaurant_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', current.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Sozlamalarni yangilashda xatolik: ${error.message}`);
    }

    return data as RestaurantSettings;
  }
}
