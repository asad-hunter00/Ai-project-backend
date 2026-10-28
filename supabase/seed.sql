-- ==============================================================================
-- O‘ktam ota choyxonasi - Idempotent Seed Data
-- Fayl: supabase/seed.sql
-- ==============================================================================

DO $$
BEGIN
    -- 1. CHOYXONA SOZLAMALARI (Agar mavjud bo'lmasa kiritiladi, qayta ishga tushganda takrorlanmaydi)
    IF NOT EXISTS (SELECT 1 FROM public.restaurant_settings LIMIT 1) THEN
        INSERT INTO public.restaurant_settings (
            id,
            name,
            description,
            address,
            phones,
            opening_time,
            closing_time,
            schedule_notes,
            map_url,
            telegram_url,
            instagram_url
        ) VALUES (
            'a0000000-0000-0000-0000-000000000001'::uuid,
            'O‘ktam ota choyxonasi',
            'Jizzax shahridagi xushmuomala xizmat, shinam va salqin xonalarga ega milliy choyxona.',
            'Jizzax shahri, Eron zapravkasi oldida',
            ARRAY['+998915672815', '+998904869611'],
            '09:00',
            '23:50',
            'Yakshanba kunlari ishlaydi. Ayrim chorshanbalarda dam beriladi (har haftalik doimiy dam olish emas).',
            NULL, -- Haqiqiy xarita havolasi hali mavjud emas (o'ylab topilmagan)
            NULL, -- Ixtiyoriy Telegram havolasi (keyinroq kiritiladi)
            NULL  -- Ixtiyoriy Instagram havolasi (keyinroq kiritiladi)
        );
        RAISE NOTICE 'Choyxona asosiy sozlamalari muvaffaqiyatli kiritildi.';
    ELSE
        RAISE NOTICE 'Choyxona sozlamalari allaqachon mavjud, o‘tkazib yuborildi.';
    END IF;

    -- 2. 20 TA XONA (HAR BIRI 10 KISHILIK, DRAFT HOLATDA VA VAQTINCHALIK NOM BILAN)
    -- Talab: Faqat haqiqiy ma'lumotlar; qavat, narx va zal kiritilmasin!
    -- Idempotent: Agar xonalar soni 0 bo'lsa, 20 ta xona generatsiya qilinadi.
    IF NOT EXISTS (SELECT 1 FROM public.rooms LIMIT 1) THEN
        INSERT INTO public.rooms (
            name,
            description,
            capacity,
            amenities,
            sort_order,
            is_published,
            is_temporary_name
        )
        SELECT 
            i || '-xona (Vaqtinchalik)' AS name,
            '10 kishilik shinam xona. Qulay mebellar va konditsioner bilan jihozlangan.' AS description,
            10 AS capacity,
            ARRAY['shinam mebellar', 'konditsioner'] AS amenities,
            i AS sort_order,
            false AS is_published,       -- Draft holatda (ommaga ko'rinmaydi)
            true AS is_temporary_name    -- Vaqtinchalik nom ekanligi belgilangan
        FROM generate_series(1, 20) AS i;

        RAISE NOTICE '20 ta draft xona (har biri 10 kishilik) muvaffaqiyatli yaratildi.';
    ELSE
        RAISE NOTICE 'Xonalar jadvali allaqachon to‘ldirilgan, o‘tkazib yuborildi.';
    END IF;

    -- 3. NAMUNAVIY E'LON (O‘ktam ota choyxonasi ish vaqti va tartibi haqida)
    IF NOT EXISTS (SELECT 1 FROM public.announcements LIMIT 1) THEN
        INSERT INTO public.announcements (
            title,
            content,
            starts_at,
            ends_at,
            is_published
        ) VALUES (
            'O‘ktam ota choyxonasiga xush kelibsiz!',
            'Choyxonamiz har kuni soat 09:00 dan 23:50 gacha xizmatingizda. Yakshanba kunlari ham ochiqmiz. Ayrim chorshanbalarda profilaktika sababli dam beriladi.',
            timezone('utc'::text, now()) - interval '1 hour',
            timezone('utc'::text, now()) + interval '90 days',
            true
        );
        RAISE NOTICE 'Boshlang‘ich namunaviy e‘lon kiritildi.';
    END IF;

END $$;
