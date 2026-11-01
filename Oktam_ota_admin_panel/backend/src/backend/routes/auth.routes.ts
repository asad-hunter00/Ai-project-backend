/**
 * O‘ktam ota choyxonasi - Auth Routes (/api/auth)
 */
import { Router } from 'express';
import { AuthService } from '../services/auth.service.ts';
import { LoginSchema } from '../validation/schemas.ts';
import { AuthenticatedRequest, optionalAuthMiddleware } from '../middlewares/auth.middleware.ts';

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

// Admin accounts are provisioned only from the Supabase dashboard.
export default router;
