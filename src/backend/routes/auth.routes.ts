/**
 * O‘ktam ota choyxonasi - Auth Routes (/api/auth)
 */
import { Router } from 'express';
import { AuthService } from '../services/auth.service.ts';
import { LoginSchema, CreateFirstAdminSchema } from '../validation/schemas.ts';
import { AuthenticatedRequest, optionalAuthMiddleware, requireAdmin } from '../middlewares/auth.middleware.ts';

const router = Router();

/**
 * POST /api/auth/login
 * Administrator sifatida tizimga kirish (email va parol)
 */
router.post('/login', async (req, res, next) => {
  try {
    const validated = LoginSchema.parse(req.body);
    const result = await AuthService.login(validated.email, validated.password);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/logout
 * Tizimdan chiqish
 */
router.post('/logout', optionalAuthMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (req.token) {
      await AuthService.logout(req.token);
    }
    res.json({
      success: true,
      message: 'Muvaffaqiyatli chiqildi',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Joriy foydalanuvchi ma'lumotlari va admin statusini tekshirish
 */
router.get('/me', optionalAuthMiddleware, (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    res.json({
      success: true,
      data: {
        authenticated: false,
        isAdmin: false,
      },
    });
    return;
  }

  res.json({
    success: true,
    data: {
      authenticated: true,
      user: req.user,
      isAdmin: req.isAdmin,
    },
  });
});

/**
 * POST /api/auth/bootstrap-first-admin
 * Birinchi administratorni yaratish (Faqat tizimda hali bitta ham admin bo'lmaganda ishlaydi!)
 */
router.post('/bootstrap-first-admin', async (req, res, next) => {
  try {
    const validated = CreateFirstAdminSchema.parse(req.body);
    const result = await AuthService.bootstrapFirstAdmin(
      validated.email,
      validated.password,
      validated.role
    );
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
