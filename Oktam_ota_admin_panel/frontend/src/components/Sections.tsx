import { mapCoordinates } from "../data/location";
import { experience } from "../data/experience";
import { useSettings } from "../settings";
import { Leaf } from "./Leaf";
import { Link } from "react-router-dom";
import { MenuCard } from "./MenuCard";
import { GalleryContent } from "./GalleryContent";
import type { Room, MenuItem, GalleryImage, Announcement } from "../types";
import { usePreferences } from "../i18n";
import { Icon, RoomDrawing } from "./Icon";
export function Rooms({ rooms }: { rooms: Room[] }) {
  const { t, lang } = usePreferences();
  const settings = useSettings();
  const published = rooms.filter((r) => r.published);
  return (
    <section id="xonalar" className="section rooms">
      <div className="rooms-intro">
        <span className="eyebrow">{t.roomsTag}</span>
        <h2>{t.roomsTitle}</h2>
        <p>{t.roomsText}</p>
        <ul className="room-features">
          {t.roomFeatures.map((s, i) => (
            <li key={s}>
              <Icon name={(["door", "users", "chair", "snow"] as const)[i]} />
              {s}
            </li>
          ))}
        </ul>
        <a className="button outline" href={`tel:${settings.phones[0].replace(/[^+\d]/g, "")}`}>
          {t.askRooms}
          <Icon name="arrow" />
        </a>
      </div>
      <div className="rooms-number" aria-hidden="true">
        <span>20</span>
        <div className="arch-line" />
        <RoomDrawing />
      </div>
      {published.length > 0 && (
        <div className="content-grid">
          {published.map((r) => (
            <article className="room-card" key={r.id}>
              {r.image && (
                <img src={r.image} alt={r.name[lang]} loading="lazy" />
              )}
              <h3>{r.name[lang]}</h3>
              <p>{r.description[lang]}</p>
              <p>{r.capacity} {lang === "uz" ? "kishilik" : lang === "ru" ? "человек" : "guests"}</p>
              <ul>
                {r.amenities.map((a, i) => (
                  <li key={i}>{a[lang]}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
export function Menu({ items }: { items: MenuItem[] }) {
  const { t, lang } = usePreferences();
  const c = experience[lang];
  return (
    <section id="menyu" className="section menu-section">
      <div className="section-heading">
        <h2>{t.menuTitle}</h2>
        <Link className="section-more" to="/menu">
          {t.viewFullMenu} →
        </Link>
        <span className="heading-rule" />
      </div>
      <p className="section-description">{c.selectionText}</p>
      {items.length ? (
        <div className="content-grid">
          {items.slice(0, 6).map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="empty menu-empty">
          <Leaf className="leaf-left" />
          <Icon name="cup" className="empty-icon" />
          <h3>{t.menuSoon}</h3>
          <p>{t.menuText}</p>
          <Leaf className="leaf-right" />
        </div>
      )}
    </section>
  );
}
export function Gallery({ images }: { images: GalleryImage[] }) {
  const { t } = usePreferences();
  return (
    <section id="galereya" className="section gallery">
      <div className="section-heading">
        <h2>{t.galleryTitle}</h2>
        <Link className="section-more" to="/gallery">
          {t.viewGallery} →
        </Link>
        <span className="heading-rule" />
      </div>
      <GalleryContent images={images.slice(0, 3)} />
    </section>
  );
}
export function Announcements({ items }: { items: Announcement[] }) {
  const { t, lang } = usePreferences();
  const active = items.filter((i) => i.active);
  return active.length ? (
    <section className="section announcements">
      <h2>{t.announcements}</h2>
      {active.map((i) => (
        <article key={i.id}>
          <h3 lang={i.title[lang] ? lang : "uz"}>{i.title[lang] || i.title.uz}</h3>
          <p lang={i.text[lang] ? lang : "uz"}>{i.text[lang] || i.text.uz}</p>
        </article>
      ))}
    </section>
  ) : null;
}
export function FAQ() {
  const { t } = usePreferences();
  return (
    <section className="section faq">
      <h2>{t.faqTitle}</h2>
      <div className="faq-content">
        <div>
          {t.faqQ.map((q, i) => (
            <details key={i}>
              <summary>
                {q}
                <span aria-hidden="true">+</span>
              </summary>
              <p>{t.faqA[i]}</p>
            </details>
          ))}
        </div>
        <Leaf />
      </div>
    </section>
  );
}
export function Contact() {
  const { t, lang } = usePreferences();
  const settings = useSettings();
  const coordinates = mapCoordinates(settings.mapUrl);
  const address = settings.addressLocalized?.[lang] || (lang === "uz" ? settings.address : t.address);
  return (
    <section id="aloqa" className="contact section">
      <div>
        <h2>{t.contactTitle}</h2>
        <p className="contact-intro">{t.contactText}</p>
        <address>
          <div>
            <Icon name="pin" />
            <span>{address}</span>
          </div>
          <div>
            <Icon name="clock" />
            <span>
              <span className="sr-only">{t.hours}: </span>{settings.hours}
            </span>
          </div>
          {settings.phones.map(phone => (
            <a key={phone} href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
              <Icon name="phone" />{phone}
            </a>
          ))}
        </address>
        <p className="schedule">{settings.scheduleLocalized?.[lang] || (lang === "uz" ? (settings.scheduleNotes ?? t.schedule) : t.schedule)}</p>
      </div>
      <div className="location-card">
        <span className="eyebrow">{t.location}</span>
        <Icon name="pin" />
        <h3>{t.visit}</h3>
        <p>{t.locationText}</p>
        <span className="location-address">{address}</span>
        {settings.mapUrl && <a className="button outline" href={settings.mapUrl} target="_blank" rel="noopener noreferrer">{lang === "uz" ? "Yo‘l olish" : lang === "ru" ? "Маршрут" : "Get directions"} ↗</a>}
        {settings.telegramUrl && <a className="button outline" href={settings.telegramUrl} target="_blank" rel="noopener noreferrer">Telegram</a>}
        {settings.instagramUrl && <a className="button outline" href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a>}
        {coordinates && <iframe className="contact-map" title={lang === "uz" ? "Choyxona xaritada" : lang === "ru" ? "Чайхана на карте" : "Teahouse location"} src={`https://maps.google.com/maps?q=${coordinates[0]},${coordinates[1]}&z=16&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
        <Leaf />
      </div>
    </section>
  );
}
