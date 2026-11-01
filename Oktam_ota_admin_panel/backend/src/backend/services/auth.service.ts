/**
 * O‘ktam ota choyxonasi - Administrator Authentication Service
 */
import { getServiceClient, getAuthClient, isSupabaseConfigured, createPublicClient } from '../config/supabase.ts';

export class AuthService {
  /**
   * Foydalanuvchining admin_roles jadvalida mavjudligini xavfsiz tekshirish.
   * Har qanday autentifikatsiyadan o'tgan oddiy foydalanuvchini admin deb hisoblamaydi!
   */
  static async checkIsAdmin(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    const serviceClient = getServiceClient();
    const { data, error } = await serviceClient
      .from('admin_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return false;
    }
    return ['admin', 'superadmin'].includes(data.role);
  }

  /**
   * Supabase Auth orqali email va parol bilan kirish.
   * Agar foydalanuvchi admin bo'lmasa, sessiya bekor qilinadi va xatolik qaytariladi.
   */
  static async login(email: string, password: string) {
    const supabase = createPublicClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(`Kirishda xatolik: ${error.message}`);
    }

    if (!data.user || !data.session) {
      throw new Error('Foydalanuvchi sessiyasi yaratilmadi');
    }

    // Admin huquqini alohida himoyalangan admin_roles jadvalidan tekshiramiz
    const isAdmin = await this.checkIsAdmin(data.user.id);
    if (!isAdmin) {
      // Sessiyani darhol yopamiz
      const userClient = getAuthClient(data.session.access_token);
      await userClient.auth.signOut();
      throw new Error('Ruxsat cheklangan: Ushbu akkaunt administrator huquqiga ega emas!');
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: 'admin',
      },
      session: {
        access_token: data.session.access_token,

        expires_at: data.session.expires_at,
      },
    };
  }

  /**
   * Tizimdan chiqish (Logout)
   */
  static async logout(accessToken: string) {
    const { error } = await getServiceClient().auth.admin.signOut(accessToken, 'local');
    if (error) {
      throw new Error(`Chiqishda xatolik: ${error.message}`);
    }
    return { success: true };
  }

}
