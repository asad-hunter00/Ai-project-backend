/**
 * O‘ktam ota choyxonasi - Rooms Service
 */
import { getAnonClient, getAuthClient } from '../config/supabase.ts';
import { Room } from '../types/database.types.ts';

export class RoomsService {
  /**
   * Xonalar ro'yxatini olish:
   * - Mehmonlar faqat nashr etilgan (is_published = true) xonalarni ko'radi.
   * - Administrator barcha xonalarni (jumladan 20 ta draft xonalarni) ko'radi.
   */
  static async getRooms(options: { isAdmin?: boolean } = {}): Promise<Room[]> {
    const supabase = getAnonClient();
    let query = supabase
      .from('rooms')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (!options.isAdmin) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`Xonalarni olishda xatolik: ${error.message}`);
    }

    return (data || []) as Room[];
  }

  /**
   * Bitta xona ma'lumotlarini ID bo'yicha olish.
   */
  static async getRoomById(id: string, options: { isAdmin?: boolean } = {}): Promise<Room> {
    const supabase = getAnonClient();
    let query = supabase.from('rooms').select('*').eq('id', id);

    if (!options.isAdmin) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query.maybeSingle();
    if (error) {
      throw new Error(`Xonani yuklashda xatolik: ${error.message}`);
    }
    if (!data) {
      throw new Error('Xona topilmadi yoki nashr etilmagan');
    }

    return data as Room;
  }

  /**
   * Yangi xona qo'shish (Faqat administrator).
   */
  static async createRoom(
    accessToken: string,
    roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Room> {
    const userClient = getAuthClient(accessToken);
    const { data, error } = await userClient
      .from('rooms')
      .insert([roomData])
      .select()
      .single();

    if (error) {
      throw new Error(`Xona qo‘shishda xatolik: ${error.message}`);
    }

    return data as Room;
  }

  /**
   * Xona ma'lumotlarini tahrirlash (Faqat administrator).
   */
  static async updateRoom(
    accessToken: string,
    id: string,
    updates: Partial<Omit<Room, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Room> {
    const userClient = getAuthClient(accessToken);
    const { data, error } = await userClient
      .from('rooms')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Xonani tahrirlashda xatolik: ${error.message}`);
    }

    return data as Room;
  }

  /**
   * Xonani o'chirish (Faqat administrator).
   */
  static async deleteRoom(accessToken: string, id: string): Promise<boolean> {
    const userClient = getAuthClient(accessToken);
    const { error } = await userClient.from('rooms').delete().eq('id', id);

    if (error) {
      throw new Error(`Xonani o‘chirishda xatolik: ${error.message}`);
    }

    return true;
  }

  /**
   * Xonalar tartibini yangilash (Batch reordering).
   */
  static async reorderRooms(
    accessToken: string,
    items: { id: string; sort_order: number }[]
  ): Promise<boolean> {
    const userClient = getAuthClient(accessToken);

    for (const item of items) {
      const { error } = await userClient
        .from('rooms')
        .update({ sort_order: item.sort_order, updated_at: new Date().toISOString() })
        .eq('id', item.id);

      if (error) {
        throw new Error(`Xonalar tartibini yangilashda xatolik: ${error.message}`);
      }
    }

    return true;
  }
}
