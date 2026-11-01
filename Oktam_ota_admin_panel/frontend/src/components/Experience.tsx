import { Link } from "react-router-dom";
import { usePreferences } from "../i18n";
import { experience } from "../data/experience";
import { useSettings } from "../settings";
export function Together() {
  const { lang } = usePreferences(); const c = experience[lang];
  return <section className="section together-section"><div className="experience-heading"><span className="eyebrow">{c.comfortTag}</span><h2>{c.comfortTitle}</h2><p>{c.comfortText}</p></div><div className="together-grid">{c.comfortCards.map((title,i)=><article key={title}><span className="experience-number">0{i+1}</span><h3>{title}</h3><p>{c.comfortTexts[i]}</p></article>)}</div></section>;
}
export function SaladSpotlight() {
  const { lang } = usePreferences(); const c = experience[lang];
  return <section className="section salad-spotlight"><div className="salad-art"><img src="/images/menu/achchiq-chuchuk.webp" alt={lang === "uz" ? "Achchiq-chuchuk salati" : lang === "ru" ? "Салат ачичук" : "Achichuk salad"} loading="lazy"/></div><div><span className="eyebrow">{lang==='uz'?'SALATLAR':lang==='ru'?'САЛАТЫ':'SALADS'}</span><h2>{c.pairTitle}</h2><p>{c.pairText}</p><Link className="button primary" to="/menu?dish=achchiq-chuchuk">{c.pairAction} ↗</Link></div></section>;
}
export function VisitGuide() {
  const { lang, t } = usePreferences(); const c = experience[lang]; const settings = useSettings();
  return <><section className="section visit-guide"><div className="experience-heading"><span className="eyebrow">{c.guideTag}</span><h2>{c.guideTitle}</h2></div><div className="visit-grid">{c.guideSteps.map((title,i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{c.guideTexts[i]}</p>{i===0?<Link to="/menu">{t.menuTitle} ↗</Link>:i===1?<a href={`tel:${settings.phones[0].replace(/[^+\d]/g,'')}`}>{t.call} ↗</a>:<Link to="/#aloqa">{t.contactTitle} ↗</Link>}</article>)}</div></section><section className="section questions-banner"><div><h2>{c.callTitle}</h2><p>{c.callText}</p></div><a className="button primary" href={`tel:${settings.phones[0].replace(/[^+\d]/g,'')}`}>{t.call} ↗</a></section></>;
}
