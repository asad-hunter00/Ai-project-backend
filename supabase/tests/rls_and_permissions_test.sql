-- ==============================================================================
-- O‘ktam ota choyxonasi - Database & RLS Automated SQL Verification Test
-- Fayl: supabase/tests/rls_and_permissions_test.sql
-- ==============================================================================

BEGIN;

-- 1. TEST: anon / ommaviy foydalanuvchi sifatida tekshiruv
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claim.sub" = '';
SET LOCAL "request.jwt.claims" = '';

-- Tekshiruv 1.1: Sozlamalarni o'qish mumkinmi?
DO $$
DECLARE
    v_count INT;
BEGIN
    SELECT COUNT(*) INTO v_count FROM public.restaurant_settings;
    IF v_count = 0 THEN
        RAISE EXCEPTION 'Xatolik: Ommaviy foydalanuvchi restaurant_settings ni o‘qiy olmadi!';
    END IF;
    RAISE NOTICE 'Test 1.1 Muvaffaqiyatli: Ommaviy foydalanuvchi sozlamalarni o‘qiy oladi.';
END $$;

-- Tekshiruv 1.2: Ommaviy foydalanuvchi draft (is_published = false) xonalarni ko'rmasligi kerak
DO $$
DECLARE
    v_draft_count INT;
BEGIN
    SELECT COUNT(*) INTO v_draft_count FROM public.rooms WHERE is_published = false;
    IF v_draft_count > 0 THEN
        RAISE EXCEPTION 'Xavfsizlik xatosi: Ommaviy foydalanuvchiga draft xonalar ko‘rinmoqda!';
    END IF;
    RAISE NOTICE 'Test 1.2 Muvaffaqiyatli: Ommaviy foydalanuvchiga faqat nashr etilgan xonalar ko‘rinadi (draftlar yashirin).';
END $$;

-- Tekshiruv 1.3: Ommaviy foydalanuvchi xona qo'sha olmasligi kerak
DO $$
BEGIN
    BEGIN
        INSERT INTO public.rooms (name, capacity) VALUES ('Ruxsat etilmagan xona', 10);
        RAISE EXCEPTION 'Xavfsizlik xatosi: Ommaviy foydalanuvchi xona qo‘sha oldi!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'Test 1.3 Muvaffaqiyatli: Ommaviy foydalanuvchi xona qo‘sha olmaydi (RLS blokladi).';
    END;
END $$;

-- Tekshiruv 1.4: Ommaviy foydalanuvchi admin_roles jadvaliga kira olmasligi kerak
DO $$
BEGIN
    BEGIN
        PERFORM * FROM public.admin_roles;
        RAISE EXCEPTION 'Xavfsizlik xatosi: Ommaviy foydalanuvchi admin_roles ni ko‘ra oldi!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'Test 1.4 Muvaffaqiyatli: Ommaviy foydalanuvchi admin_roles ga kira olmaydi.';
    END;
END $$;

ROLLBACK;
