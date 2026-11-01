import { useSettings } from "../settings";
import { Link } from "react-router-dom";
import {
  Brand,
  Preferences,
  sectionIds,
  sectionTarget,
  phoneHref,
} from "./Header";
import { usePreferences } from "../i18n";
export function Footer({ phones }: { phones: string[] }) {
  const { t, lang } = usePreferences();
  const settings = useSettings();
  return (
    <>
      <div className="pattern-divider" aria-hidden="true" />
      <footer>
        <div className="footer-main">
          <Brand />
          <nav>
            {sectionIds.slice(1).map((id, i) => (
              <Link key={id} to={sectionTarget(id)}>
                {t.nav[i + 1]}
              </Link>
            ))}
          </nav>
          <Preferences />
        </div>
        <div className="footer-phones">
          {phones.map((p) => (
            <a key={p} href={phoneHref(p)}>
              {p}
            </a>
          ))}
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {settings.name}. {t.copyright}
          </span>
          <span>{settings.addressLocalized?.[lang] || (lang === "uz" ? settings.address : t.address)}</span>
          <Link to="/admin">Admin</Link>
          <Link to="/#bosh">{t.up} ↑</Link>
        </div>
      </footer>
    </>
  );
}
