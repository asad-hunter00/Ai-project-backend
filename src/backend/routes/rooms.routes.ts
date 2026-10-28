/**
 * O‘ktam ota choyxonasi - Rooms Routes (/api/rooms)
 */
import { Router } from 'express';
import { RoomsService } from '../services/rooms.service.ts';
import { CreateRoomSchema, UpdateRoomSchema, ReorderRoomsSchema } from '../validation/schemas.ts';
import { optionalAuthMiddleware, requireAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware.ts';

const router = Router();

/**
 * GET /api/rooms
 * Xonalarni ro'yxatini olish.
 * - Mehmonlar faqat nashr etilgan (is_published = true) xonalarni ko'radi.
 * - Administrator barcha xonalarni (jumladan 20 ta draft xonalarni) ko'radi.
 */
router.get('/', optionalAuthMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const rooms = await RoomsService.getRooms({ isAdmin: req.isAdmin });
    res.json({
      success: true,
      data: rooms,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/rooms/reorder
 * Xonalar tartibini o'zgartirish (Faqat administrator)
 */
router.put('/reorder', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = ReorderRoomsSchema.parse(req.body);
    await RoomsService.reorderRooms(req.token!, validated.items);
    res.json({
      success: true,
      message: 'Xonalar tartibi muvaffaqiyatli yangilandi',
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/rooms/:id
 * Bitta xonani olish
 */
router.get('/:id', optionalAuthMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const room = await RoomsService.getRoomById(req.params.id, { isAdmin: req.isAdmin });
    res.json({
      success: true,
      data: room,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/rooms
 * Yangi xona qo'shish (Faqat administrator)
 */
router.post('/', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = CreateRoomSchema.parse(req.body);
    const room = await RoomsService.createRoom(req.token!, validated);
    res.status(201).json({
      success: true,
      data: room,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/rooms/:id
 * Xona ma'lumotlarini tahrirlash (Faqat administrator)
 */
router.put('/:id', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = UpdateRoomSchema.parse(req.body);
    const room = await RoomsService.updateRoom(req.token!, req.params.id, validated);
    res.json({
      success: true,
      data: room,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/rooms/:id
 * Xonani o'chirish (Faqat administrator)
 */
router.delete('/:id', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    await RoomsService.deleteRoom(req.token!, req.params.id);
    res.json({
      success: true,
      message: 'Xona muvaffaqiyatli o‘chirildi',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
