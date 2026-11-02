BEGIN;
CREATE TABLE IF NOT EXISTS public.videos (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 title jsonb NOT NULL DEFAULT '{"uz":"Yangi video","ru":"","en":""}',
 description jsonb NOT NULL DEFAULT '{"uz":"","ru":"","en":""}',
 file_path text UNIQUE NOT NULL CHECK(file_path ~ '^videos/[0-9a-f-]+\.mp4$'),
 file_size bigint NOT NULL CHECK(file_size > 0 AND file_size <= 52428800),
 upload_complete boolean NOT NULL DEFAULT false,
 is_published boolean NOT NULL DEFAULT false,
 sort_order integer NOT NULL DEFAULT 0 CHECK(sort_order>=0),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CHECK(NOT is_published OR upload_complete)
);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS videos_read ON public.videos;
CREATE POLICY videos_read ON public.videos FOR SELECT TO anon,authenticated USING ((is_published AND upload_complete) OR public.is_admin());
DROP POLICY IF EXISTS videos_admin ON public.videos;
CREATE POLICY videos_admin ON public.videos FOR ALL TO authenticated USING(public.is_admin()) WITH CHECK(public.is_admin());
GRANT SELECT ON public.videos TO anon,authenticated;
GRANT INSERT,UPDATE,DELETE ON public.videos TO authenticated;
CREATE OR REPLACE FUNCTION public.video_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END $$;
DROP TRIGGER IF EXISTS video_updated_at ON public.videos;
CREATE TRIGGER video_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.video_updated_at();
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES('choyxona-videos','choyxona-videos',false,52428800,ARRAY['video/mp4']) ON CONFLICT(id) DO UPDATE SET public=false,file_size_limit=52428800,allowed_mime_types=ARRAY['video/mp4'];
DROP POLICY IF EXISTS videos_storage_read ON storage.objects;
CREATE POLICY videos_storage_read ON storage.objects FOR SELECT TO anon,authenticated USING(bucket_id='choyxona-videos' AND (public.is_admin() OR EXISTS(SELECT 1 FROM public.videos v WHERE v.file_path=name AND v.is_published AND v.upload_complete)));
DROP POLICY IF EXISTS videos_storage_admin ON storage.objects;
CREATE POLICY videos_storage_admin ON storage.objects FOR ALL TO authenticated USING(bucket_id='choyxona-videos' AND public.is_admin()) WITH CHECK(bucket_id='choyxona-videos' AND public.is_admin());
COMMIT;
