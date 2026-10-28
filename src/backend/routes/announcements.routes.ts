/**
 * O‘ktam ota choyxonasi - Announcements Routes (/api/announcements)
 */
import { Router } from 'express';
import { AnnouncementsService } from '../services/announcements.service.ts';
import { CreateAnnouncementSchema, UpdateAnnouncementSchema } from '../validation/schemas.ts';
import { optionalAuthMiddleware, requireAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware.ts';

const router = Router();

/**
 * GET /api/announcements
 * Ommaviy e'lonlar: Faqat nashr qilingan (is_published = true) va ayni damda faol bo'lganlar
 */
router.get('/', async (_req, res, next) => {
  try {
    const announcements = await AnnouncementsService.getActiveAnnouncements();
    res.json({
      success: true,
      data: announcements,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/announcements/all
 * Barcha e'lonlar ro'yxati (Faqat administrator uchun)
 */
router.get('/all', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const announcements = await AnnouncementsService.getAllAnnouncements(req.token!);
    res.json({
      success: true,
      data: announcements,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/announcements
 * Yangi e'lon qo'shish (Faqat administrator)
 */
router.post('/', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = CreateAnnouncementSchema.parse(req.body);
    const announcement = await AnnouncementsService.createAnnouncement(req.token!, validated);
    res.status(201).json({
      success: true,
      data: announcement,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/announcements/:id
 * E'lonni tahrirlash (Faqat administrator)
 */
router.put('/:id', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = UpdateAnnouncementSchema.parse(req.body);
    const updated = await AnnouncementsService.updateAnnouncement(req.token!, req.params.id, validated);
    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/announcements/:id
 * E'lonni o'chirish (Faqat administrator)
 */
router.delete('/:id', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    await AnnouncementsService.deleteAnnouncement(req.token!, req.params.id);
    res.json({
      success: true,
      message: 'E‘lon muvaffaqiyatli o‘chirildi',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
