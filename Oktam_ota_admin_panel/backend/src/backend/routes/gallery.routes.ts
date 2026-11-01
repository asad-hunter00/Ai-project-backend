/**
 * O‘ktam ota choyxonasi - Gallery & Storage Routes (/api/gallery)
 */
import { Router } from 'express';
import { GalleryService } from '../services/gallery.service.ts';
import { 
  RequestUploadUrlSchema, 
  RegisterImageSchema, 
  UploadImageSchema,
  UpdateImageSchema 
} from '../validation/schemas.ts';
import { optionalAuthMiddleware, requireAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware.ts';

const router = Router();

/**
 * GET /api/gallery
 * Rasmlar ro'yxatini olish (Private bucketdan qisqa muddatli Signed URL bilan).
 * - Mehmonlarga faqat nashr etilgan (is_published = true) rasmlar.
 * - Administratorga barcha rasmlar (jumladan draft rasmlar).
 */
router.get('/', optionalAuthMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const roomId = req.query.room_id as string | undefined;
    const images = await GalleryService.getImages({
      roomId,
      isAdmin: req.isAdmin,
      accessToken: req.token ?? undefined,
    });
    res.json({
      success: true,
      data: images,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/gallery/upload-url
 * Storage ga to'g'ridan-to'g'ri rasm yuklash uchun xavfsiz Signed Upload URL olish (Faqat administrator)
 * MIME turi va hajm (maks 5MB) tekshiriladi.
 */
router.post('/upload', optionalAuthMiddleware, requireAdmin, async(req: AuthenticatedRequest,res,next)=>{
  try{ const input=UploadImageSchema.parse(req.body);res.status(201).json({success:true,data:await GalleryService.upload(req.token!,input)}); }catch(error){next(error);}
});
router.post('/upload-url' , optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = RequestUploadUrlSchema.parse(req.body);
    const result = await GalleryService.createUploadUrl(req.token!, {
      fileName: validated.file_name,
      mimeType: validated.mime_type,
      fileSize: validated.file_size,
    });
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/gallery
 * Yuklangan rasm metama'lumotlarini bazada ro'yxatdan o'tkazish (Faqat administrator)
 */
router.post('/', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = RegisterImageSchema.parse(req.body);
    const record = await GalleryService.registerImage(req.token!, validated);
    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/gallery/:id
 * Rasm tavsifi, xona bog'lanishi yoki nashr holatini tahrirlash (Faqat administrator)
 */
router.put('/:id', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validated = UpdateImageSchema.parse(req.body);
    const updated = await GalleryService.updateImage(req.token!, req.params.id, validated);
    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/gallery/:id
 * Rasmni to'liq o'chirish (Storage fayli va DB yozuvi birgalikda o'chiriladi)
 */
router.delete('/:id', optionalAuthMiddleware, requireAdmin, async (req: AuthenticatedRequest, res, next) => {
  try {
    await GalleryService.deleteImage(req.token!, req.params.id);
    res.json({
      success: true,
      message: 'Rasm bazadan va xotiradan (storage) to‘liq o‘chirildi',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
