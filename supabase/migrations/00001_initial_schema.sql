-- ==============================================================================
-- O‘ktam ota choyxonasi - Database Schema & RLS Policies
-- PostgreSQL / Supabase Migration: 00001_initial_schema.sql
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TRIGGER FUNCTION: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. ADMIN ROLES TABLE
-- auth.users dagi foydalanuvchilarga maxsus administratorlik huquqini biriktiradi.
-- Oddiy autentifikatsiyadan o'tgan foydalanuvchilar admin hisoblanmaydi!
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_admin_user UNIQUE (user_id)
);

-- Index for fast user_id lookups
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON public.admin_roles(user_id);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- 4. SECURITY DEFINER FUNCTION: is_admin()
-- Foydalanuvchi joriy sessiyasida admin huquqiga ega ekanligini xavfsiz tekshiradi.
-- SEARCH PATH 'public' qilib qat'iy belgilangan (search path hijacking oldini olish uchun).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Agar foydalanuvchi tizimga kirmagan bo'lsa darhol false
    IF auth.uid() IS NULL THEN
        RETURN false;
    END IF;

    -- Faqat admin_roles jadvalida ro'yxatdan o'tgan adminlar
    RETURN EXISTS (
        SELECT 1 
        FROM public.admin_roles
        WHERE user_id = auth.uid()
          AND role IN ('admin', 'superadmin')
    );
END;
$$;

-- RLS Policies on admin_roles:
-- Foydalanuvchi o'ziga o'zi admin huquqini bera olmasin va begona foydalanuvchilar ro'yxatni ko'ra olmasin.
DROP POLICY IF EXISTS "Admins can view admin_roles" ON public.admin_roles;
CREATE POLICY "Admins can view admin_roles" 
ON public.admin_roles 
FOR SELECT 
TO authenticated 
USING (public.is_admin());

-- INSERT, UPDATE, DELETE faqat service_role yoki bevosita DB superuser uchun ruxsat etilgan.
-- Ochiq web mijozlar orqali o'zgartirish qat'iyan man etiladi.

-- 5. RESTAURANT SETTINGS (Choyxona sozlamalari)
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 150),
    description TEXT,
    address TEXT NOT NULL CHECK (char_length(address) >= 5 AND char_length(address) <= 300),
    phones TEXT[] NOT NULL DEFAULT '{}',
    opening_time TEXT NOT NULL DEFAULT '09:00',
    closing_time TEXT NOT NULL DEFAULT '23:50',
    schedule_notes TEXT,
    map_url TEXT,
    telegram_url TEXT,
    instagram_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trg_restaurant_settings_updated_at ON public.restaurant_settings;
CREATE TRIGGER trg_restaurant_settings_updated_at
BEFORE UPDATE ON public.restaurant_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: Hamma o'qishi mumkin (anon + authenticated)
DROP POLICY IF EXISTS "Public can view restaurant settings" ON public.restaurant_settings;
CREATE POLICY "Public can view restaurant settings"
ON public.restaurant_settings
FOR SELECT
TO public
USING (true);

-- RLS: Faqat administrator tahrirlay oladi
DROP POLICY IF EXISTS "Admins can update restaurant settings" ON public.restaurant_settings;
CREATE POLICY "Admins can update restaurant settings"
ON public.restaurant_settings
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert restaurant settings" ON public.restaurant_settings;
CREATE POLICY "Admins can insert restaurant settings"
ON public.restaurant_settings
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- 6. ROOMS TABLE (Xonalar)
-- Qat'iy talab: qavat, narx va zal kiritilmasin!
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 100),
    description TEXT,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    amenities TEXT[] NOT NULL DEFAULT '{shinam mebellar, konditsioner}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_temporary_name BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_rooms_is_published ON public.rooms(is_published);
CREATE INDEX IF NOT EXISTS idx_rooms_sort_order ON public.rooms(sort_order);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trg_rooms_updated_at ON public.rooms;
CREATE TRIGGER trg_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: Mehmonlar faqat nashr etilgan xonalarni ko'ra oladi
DROP POLICY IF EXISTS "Public can view published rooms" ON public.rooms;
CREATE POLICY "Public can view published rooms"
ON public.rooms
FOR SELECT
TO public
USING (is_published = true);

-- RLS: Admin barcha xonalarni (draft va nashr etilganlarni) ko'ra oladi
DROP POLICY IF EXISTS "Admins can view all rooms" ON public.rooms;
CREATE POLICY "Admins can view all rooms"
ON public.rooms
FOR SELECT
TO authenticated
USING (public.is_admin());

-- RLS: Admin xona qo'shishi mumkin
DROP POLICY IF EXISTS "Admins can insert rooms" ON public.rooms;
CREATE POLICY "Admins can insert rooms"
ON public.rooms
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- RLS: Admin xonalarni tahrirlashi mumkin
DROP POLICY IF EXISTS "Admins can update rooms" ON public.rooms;
CREATE POLICY "Admins can update rooms"
ON public.rooms
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- RLS: Admin xonalarni o'chirishi mumkin
DROP POLICY IF EXISTS "Admins can delete rooms" ON public.rooms;
CREATE POLICY "Admins can delete rooms"
ON public.rooms
FOR DELETE
TO authenticated
USING (public.is_admin());

-- 7. GALLERY IMAGES (Galereya va rasmlar metama'lumotlari)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL UNIQUE,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 5242880), -- Maksimal 5 MB
    mime_type TEXT NOT NULL CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
    description TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_room_id ON public.gallery_images(room_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_published ON public.gallery_images(is_published);
CREATE INDEX IF NOT EXISTS idx_gallery_images_sort_order ON public.gallery_images(sort_order);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trg_gallery_images_updated_at ON public.gallery_images;
CREATE TRIGGER trg_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: Mehmonlar faqat nashr etilgan rasmlar yozuvlarini ko'ra oladi
DROP POLICY IF EXISTS "Public can view published gallery images" ON public.gallery_images;
CREATE POLICY "Public can view published gallery images"
ON public.gallery_images
FOR SELECT
TO public
USING (is_published = true);

-- RLS: Admin rasmlar jadvalini to'liq boshqara oladi
DROP POLICY IF EXISTS "Admins have full access to gallery images" ON public.gallery_images;
CREATE POLICY "Admins have full access to gallery images"
ON public.gallery_images
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 8. ANNOUNCEMENTS TABLE (E'lonlar)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
    content TEXT NOT NULL CHECK (char_length(content) >= 1),
    starts_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ends_at TIMESTAMPTZ,
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT check_announcement_dates CHECK (ends_at IS NULL OR ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS idx_announcements_status_dates ON public.announcements(is_published, starts_at, ends_at);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS trg_announcements_updated_at ON public.announcements;
CREATE TRIGGER trg_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS: Mehmonlar faqat nashr qilingan va ayni damda amal qilayotgan e'lonlarni ko'ra oladi
DROP POLICY IF EXISTS "Public can view active published announcements" ON public.announcements;
CREATE POLICY "Public can view active published announcements"
ON public.announcements
FOR SELECT
TO public
USING (
    is_published = true 
    AND starts_at <= timezone('utc'::text, now()) 
    AND (ends_at IS NULL OR ends_at >= timezone('utc'::text, now()))
);

-- RLS: Admin barcha e'lonlarni boshqara oladi (qoralama, o'tgan va kelgusi)
DROP POLICY IF EXISTS "Admins have full access to announcements" ON public.announcements;
CREATE POLICY "Admins have full access to announcements"
ON public.announcements
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 9. SCHEMA RUXSATLARI VA POSTGREST KESHINI YANGILASH
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- PostgREST API keshini zudlik bilan yangilash
NOTIFY pgrst, 'reload schema';

