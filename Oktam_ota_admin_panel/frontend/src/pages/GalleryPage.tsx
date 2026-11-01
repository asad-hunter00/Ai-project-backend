import type { GalleryImage } from "../types";
import { usePreferences } from "../i18n";
import { GalleryContent } from "../components/GalleryContent";
export function GalleryPage({ images }: { images: GalleryImage[] }) {
  const { t } = usePreferences();
  return (
    <div className="route-page">
      <header className="page-heading">
        <span className="eyebrow">{t.tag}</span>
        <h1>{t.galleryTitle}</h1>
      </header>
      <section className="section">
        <GalleryContent images={images} />
      </section>
    </div>
  );
}
