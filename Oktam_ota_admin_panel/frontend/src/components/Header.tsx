import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePreferences, type Language } from "../i18n";
import { useSettings } from "../settings";
import { Icon } from "./Icon";
export const sectionIds = [
  "bosh",
  "haqimizda",
  "xonalar",
  "menyu",
  "galereya",
  "aloqa",
];
export const sectionTarget = (id: string) =>
  id === "menyu" ? "/menu" : id === "galereya" ? "/gallery" : `/#${id}`;
export const phoneHref = (p: string) => `tel:${p.replace(/\s/g, "")}`;
export function Brand() {
  const settings = useSettings();
  return (
    <Link className="brand" to="/">
      <img
        src="/images/oktam-ota-logo.png"
        alt={settings.name}
        width="707"
        height="353"
      />
    </Link>
  );
}
export function Preferences() {
  const { lang, setLang, theme, setTheme, t } = usePreferences();
  return (
    <div className="preferences">
      <div className="languages" role="group" aria-label={t.language}>
        {(["uz", "ru", "en"] as Language[]).map((l) => (
          <button
            key={l}
            lang={l}
            aria-pressed={lang === l}
            onClick={() => setLang(l)}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      <div
        className="themes"
        role="group"
        aria-label={`${t.light} / ${t.dark}`}
      >
        <button
          aria-label={t.light}
          aria-pressed={theme === "light"}
          onClick={() => setTheme("light")}
        >
          <Icon name="sun" />
        </button>
        <button
          aria-label={t.dark}
          aria-pressed={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          <Icon name="moon" />
        </button>
      </div>
    </div>
  );
}
export function Header() {
  const { t, lang } = usePreferences();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname, location.hash]);
  useEffect(() => setOpen(false), [lang]);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <header className="header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label={t.nav[0]}>
          {sectionIds.map((id, i) => (
            <Link key={id} to={sectionTarget(id)}>
              {t.nav[i]}
            </Link>
          ))}
        </nav>
        <Preferences />
        <button
          className="menu-toggle"
          aria-controls="mobile-nav"
          aria-expanded={open}
          aria-label={open ? t.closeMenu : t.openMenu}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      <nav
        id="mobile-nav"
        className={`mobile-nav ${open ? "open" : ""}`}
        aria-label={t.openMenu}
      >
        {sectionIds.map((id, i) => (
          <Link key={id} to={sectionTarget(id)} onClick={() => setOpen(false)}>
            {t.nav[i]}
          </Link>
        ))}
      </nav>
    </header>
  );
}
