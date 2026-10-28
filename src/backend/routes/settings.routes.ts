/**
 * O‘ktam ota choyxonasi - Settings Routes (/api/settings)
 */
import { Router } from 'express';
import { SettingsService } from '../services/settings.service.ts';
import { UpdateSettingsSchema } from '../validation/schemas.ts';
import { optionalAuthMiddleware, requireAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware.ts';

const router = Router();

/**
 * GET /api/settings
 * Ommaviy o'qish: Choyxona nom, manzil, telefonlar, ish vaqti va ixtiyoriy havolalar
 */
router.get('/', async (_req, res, next) => {
  try {
    const settings = await SettingsService.getSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/settings
 * Sozlamalarni yangilash: Faqat administrator uchun
 */
router.put('/', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = UpdateSettingsSchema.parse(req.body);
    const updated = await SettingsService.updateSettings(req.token!, validated);
    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
