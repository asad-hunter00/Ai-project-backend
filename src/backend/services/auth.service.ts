/**
 * O‘ktam ota choyxonasi - Administrator Authentication Service
 */
import { getAnonClient, getServiceClient, getAuthClient, isSupabaseConfigured } from '../config/supabase.ts';

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
    const supabase = getAnonClient();
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
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    };
  }

  /**
   * Tizimdan chiqish (Logout)
   */
  static async logout(accessToken: string) {
    const userClient = getAuthClient(accessToken);
    const { error } = await userClient.auth.signOut();
    if (error) {
      throw new Error(`Chiqishda xatolik: ${error.message}`);
    }
    return { success: true };
  }

  /**
   * Birinchi administratorni yaratish tartibi (Server-Side Bootstrapping):
   * Agar bazada hali hech qanday admin bo'lmasa, dastlabki superadminni yaratadi.
   * Agar adminlar mavjud bo'lsa, ochiq holda yangi admin yaratish qat'iyan taqiqlanadi.
   */
  static async bootstrapFirstAdmin(email: string, password: string, role: 'admin' | 'superadmin' = 'admin') {
    const serviceClient = getServiceClient();

    // 1. Mavjud adminlar bor-yo'qligini tekshirish
    const { count, error: countError } = await serviceClient
      .from('admin_roles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      throw new Error(`Adminlar sonini tekshirishda xatolik: ${countError.message}`);
    }

    if (count && count > 0) {
      throw new Error(
        'Bazada administratorlar allaqachon mavjud! Yangi admin yaratish uchun mavjud superadmin vakolati talab qilinadi.'
      );
    }

    // 2. Supabase Auth da foydalanuvchini ro'yxatdan o'tkazish (Email tasdiqlangan holda)
    const { data: userData, error: userError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin' },
    });

    if (userError || !userData.user) {
      throw new Error(`Admin foydalanuvchisini yaratishda xatolik: ${userError?.message}`);
    }

    // 3. Himoyalangan admin_roles jadvaliga yozuv qo'shish
    const { error: roleError } = await serviceClient.from('admin_roles').insert({
      user_id: userData.user.id,
      role,
    });

    if (roleError) {
      // Rollback: Agar role yozilmasa, auth foydalanuvchini tozalash
      await serviceClient.auth.admin.deleteUser(userData.user.id);
      throw new Error(`Admin rolini biriktirishda xatolik: ${roleError.message}`);
    }

    return {
      id: userData.user.id,
      email: userData.user.email,
      role,
      message: 'Birinchi administrator hisobi muvaffaqiyatli yaratildi va tasdiqlandi.',
    };
  }
}
