import { useState } from "react";
import type { GalleryImage } from "../types";
import { usePreferences } from "../i18n";
import { MediaDialog } from "./MediaDialog";
import { Icon } from "./Icon";
import { Leaf } from "./Leaf";
export function GalleryContent({ images }: { images: GalleryImage[] }) {
  const { t, lang } = usePreferences();
  const [index, setIndex] = useState<number | null>(null);
  const selected = index === null ? null : images[index];
  return (
    <>
      {images.length ? (
        <div className="gallery-grid">
          {images.map((image, i) => (
            <button
              key={image.id}
              onClick={() => setIndex(i)}
              aria-label={`${t.enlarge}: ${image.alt[lang]}`}
            >
              <img
                src={image.src}
                alt={image.alt[lang]}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="gallery-placeholders" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <Icon name="image" />
                <Leaf />
              </div>
            ))}
          </div>
          <div className="gallery-message">
            <h3>{t.gallerySoon}</h3>
            <p>{t.galleryText}</p>
          </div>
        </>
      )}
      {selected && index !== null && (
        <MediaDialog
          title={selected.alt[lang]}
          onClose={() => setIndex(null)}
          onPrevious={
            images.length > 1
              ? () =>
                  setIndex((i) =>
                    i === null ? null : (i - 1 + images.length) % images.length,
                  )
              : undefined
          }
          onNext={
            images.length > 1
              ? () =>
                  setIndex((i) => (i === null ? null : (i + 1) % images.length))
              : undefined
          }
        >
          <img
            className="gallery-large-image"
            src={selected.src}
            alt={selected.alt[lang]}
            loading="lazy"
          />
          <p className="gallery-caption">
            {selected.alt[lang]}{" "}
            <span>
              {index + 1} / {images.length}
            </span>
          </p>
        </MediaDialog>
      )}
    </>
  );
}
