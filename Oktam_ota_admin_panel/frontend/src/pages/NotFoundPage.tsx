import { Link } from "react-router-dom";
import { usePreferences } from "../i18n";
export function NotFoundPage() {
  const { t } = usePreferences();
  return (
    <section className="section not-found">
      <span className="eyebrow">404</span>
      <h1>{t.notFound}</h1>
      <p>{t.notFoundText}</p>
      <Link className="button primary" to="/">
        {t.backHome}
      </Link>
    </section>
  );
}
