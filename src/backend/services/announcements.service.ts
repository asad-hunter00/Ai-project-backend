/**
 * O‘ktam ota choyxonasi - Announcements Service
 */
import { getAnonClient, getAuthClient } from '../config/supabase.ts';
import { Announcement } from '../types/database.types.ts';

export class AnnouncementsService {
  /**
   * Ommaviy e'lonlar:
   * Faqat nashr qilingan (is_published = true) va ayni damda faol (starts_at <= now <= ends_at) e'lonlar.
   */
  static async getActiveAnnouncements(): Promise<Announcement[]> {
    const supabase = getAnonClient();
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_published', true)
      .lte('starts_at', nowIso)
      .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
      .order('starts_at', { ascending: false });

    if (error) {
      throw new Error(`E‘lonlarni olishda xatolik: ${error.message}`);
    }

    return (data || []) as Announcement[];
  }

  /**
   * Administrator uchun barcha e'lonlar (jumladan draft, kelgusi va muddati o'tganlar).
   */
  static async getAllAnnouncements(accessToken: string): Promise<Announcement[]> {
    const userClient = getAuthClient(accessToken);
    const { data, error } = await userClient
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Barcha e‘lonlarni olishda xatolik: ${error.message}`);
    }

    return (data || []) as Announcement[];
  }

  /**
   * E'lon qo'shish (Faqat administrator).
   */
  static async createAnnouncement(
    accessToken: string,
    payload: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Announcement> {
    if (payload.ends_at && new Date(payload.ends_at) <= new Date(payload.starts_at)) {
      throw new Error('E‘lonning tugash vaqti boshlanish vaqtidan keyin bo‘lishi shart');
    }

    const userClient = getAuthClient(accessToken);
    const { data, error } = await userClient
      .from('announcements')
      .insert([payload])
      .select()
      .single();

    if (error) {
      throw new Error(`E‘lon qo‘shishda xatolik: ${error.message}`);
    }

    return data as Announcement;
  }

  /**
   * E'lonni tahrirlash (Faqat administrator).
   */
  static async updateAnnouncement(
    accessToken: string,
    id: string,
    updates: Partial<Omit<Announcement, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Announcement> {
    const userClient = getAuthClient(accessToken);
    const { data, error } = await userClient
      .from('announcements')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`E‘lonni tahrirlashda xatolik: ${error.message}`);
    }

    return data as Announcement;
  }

  /**
   * E'lonni o'chirish (Faqat administrator).
   */
  static async deleteAnnouncement(accessToken: string, id: string): Promise<boolean> {
    const userClient = getAuthClient(accessToken);
    const { error } = await userClient
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`E‘lonni o‘chirishda xatolik: ${error.message}`);
    }

    return true;
  }
}
