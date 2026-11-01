-- ==============================================================================
-- O‘ktam ota choyxonasi - Supabase Storage Configuration & Policies
-- PostgreSQL / Supabase Migration: 00002_storage_setup.sql
-- ==============================================================================

-- 1. BUCKET YARATISH: choyxona-media
-- Xavfsizlik talabi: Private bucket (public = false). 
-- Draft (qoralama) rasmlar ommaga ochiq bo'lmasligi uchun fayllarga to'g'ridan-to'g'ri 
-- ochiq URL orqali emas, faqat server tekshiruvidan keyin qisqa muddatli Signed URL beriladi.
-- Hajm cheklovi: 5 MB (5242880 bayt)
-- MIME cheklovi: image/jpeg, image/png, image/webp
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'choyxona-media',
    'choyxona-media',
    false,
    5242880,
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- 2. STORAGE RLS SIYOSATLARI (storage.objects)

-- Faqat administrator fayl yuklashi mumkin (INSERT)
DROP POLICY IF EXISTS "Admin can upload files to choyxona-media" ON storage.objects;
CREATE POLICY "Admin can upload files to choyxona-media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'choyxona-media'
    AND public.is_admin()
);

-- Faqat administrator faylni yangilashi/almashtirishi mumkin (UPDATE)
DROP POLICY IF EXISTS "Admin can update files in choyxona-media" ON storage.objects;
CREATE POLICY "Admin can update files in choyxona-media"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'choyxona-media'
    AND public.is_admin()
)
WITH CHECK (
    bucket_id = 'choyxona-media'
    AND public.is_admin()
);

-- Faqat administrator faylni o'chirishi mumkin (DELETE)
DROP POLICY IF EXISTS "Admin can delete files in choyxona-media" ON storage.objects;
CREATE POLICY "Admin can delete files in choyxona-media"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'choyxona-media'
    AND public.is_admin()
);

-- Administrator fayllarni to'g'ridan-to'g'ri o'qiy oladi (SELECT)
DROP POLICY IF EXISTS "Admin can view all files in choyxona-media" ON storage.objects;
CREATE POLICY "Admin can view all files in choyxona-media"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'choyxona-media'
    AND public.is_admin()
);

-- 3. BAZADAN O'CHIRILGANDA XOTIRADAGI FAYLNI TOZALASH FUNKSIYASI VA TRIGGERI
-- Qolib ketgan (orphaned) fayllarni oldini olish uchun yordamchi mexanizm.
CREATE OR REPLACE FUNCTION public.handle_gallery_image_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- gallery_images jadvalidan yozuv o'chirilganda, storage.objects dagi tegishli faylni ham tozalash
    DELETE FROM storage.objects 
    WHERE bucket_id = 'choyxona-media' 
      AND name = OLD.file_path;
    RETURN OLD;
EXCEPTION WHEN OTHERS THEN
    -- Storage xatolari asosiy tranzaksiyani to'xtatib qo'ymasligi uchun ogohlantirish qaytariladi
    RAISE WARNING 'Faylni storage.objects dan o‘chirishda ogohlantirish: %', SQLERRM;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, storage;

DROP TRIGGER IF EXISTS trg_cleanup_gallery_image_storage ON public.gallery_images;
CREATE TRIGGER trg_cleanup_gallery_image_storage
AFTER DELETE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.handle_gallery_image_delete();
