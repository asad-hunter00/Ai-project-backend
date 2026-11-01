/**
 * O‘ktam ota choyxonasi - Authentication & Authorization Middleware
 */
import { Request, Response, NextFunction } from 'express';
import { getAnonClient, isSupabaseConfigured } from '../config/supabase.ts';
import { AuthService } from '../services/auth.service.ts';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  } | null;
  token?: string | null;
  isAdmin?: boolean;
}

/**
 * Tokenni tekshiruvchi ixtiyoriy middleware:
 * Token bo'lsa tekshiradi va req.user hamda req.isAdmin ni to'ldiradi.
 * Token bo'lmasa xato bermaydi, mehmon deb belgilaydi.
 */
export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  req.isAdmin = false;
  req.user = null;
  req.token = null;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  req.token = token;

  if (!isSupabaseConfigured()) {
    return next();
  }

  try {
    const supabase = getAnonClient();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next();
    }

    req.user = { id: user.id, email: user.email };
    req.isAdmin = await AuthService.checkIsAdmin(user.id);
  } catch {
    // Xatolik yuz bersa mehmon sifatida davom etadi
    req.isAdmin = false;
  }

  next();
}

/**
 * Faqat administratorlar uchun qat'iy tekshiruv:
 * Token yo'q bo'lsa yoki foydalanuvchi admin_roles da mavjud bo'lmasa 401 / 403 qaytaradi.
 */
export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.token || !req.user) {
    res.status(401).json({
      success: false,
      error: 'Autentifikatsiya talab qilinadi. Iltimos, administrator sifatida tizimga kiring.',
    });
    return;
  }

  if (!req.isAdmin) {
    res.status(403).json({
      success: false,
      error: 'Ruxsat cheklangan: Ushbu amalni bajarish faqat tasdiqlangan administratorga ruxsat etiladi.',
    });
    return;
  }

  next();
}
