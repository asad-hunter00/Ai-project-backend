import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { MenuItem } from "../types";
import { usePreferences } from "../i18n";
import { experience } from "../data/experience";
import { useSettings } from "../settings";
import { useSavedDishes } from "../hooks/useSavedDishes";
import { MediaDialog } from "./MediaDialog";
export function MenuCard({ item }: { item: MenuItem }) {
  const { lang, t } = usePreferences();
  const c = experience[lang];
  const settings = useSettings();
  const [search, setSearch] = useSearchParams();
  const [manualOpen, setOpen] = useState(false);
  const linked = search.get("dish") === item.id;
  const [tab, setTab] = useState<"about" | "origin" | "reviews">("about");
  const [shareStatus, setShareStatus] = useState("");
  const { saved, toggle } = useSavedDishes();
  const isSaved = saved.includes(item.id);
  function close() {
    setOpen(false); setShareStatus("");
    if (linked) { const next = new URLSearchParams(search); next.delete("dish"); setSearch(next, { replace: true }); }
  }
  async function share() {
    const url = new URL("/menu", window.location.origin); url.searchParams.set("dish", item.id);
    try {
      if (navigator.share) await navigator.share({ title: item.name[lang], url: url.href });
      else { await navigator.clipboard.writeText(url.href); setShareStatus(c.copied); }
    } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setShareStatus(c.copyFailed); }
  }
  const reviews = item.reviews ?? [];
  const price = item.price === undefined ? null : new Intl.NumberFormat(lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-GB").format(item.price);
  const priceLabel = price ? `${price} ${t.currency}${item.portion ? ` / ${item.portion[lang]}` : ""}` : null;
  return <>
    <article className="menu-card interactive-card dish-card-v2">
      <button className="save-dish" onClick={() => toggle(item.id)} aria-label={`${isSaved ? c.saved : c.favorite}: ${item.name[lang]}`} aria-pressed={isSaved}>{isSaved ? "♥" : "♡"}</button>
      <button className="dish-trigger" aria-label={`${t.dishDetails}: ${item.name[lang]}`} onClick={() => { setTab("about"); setOpen(true); }}>
        {item.image && <img src={item.image} alt="" loading="lazy" decoding="async" style={{ objectFit: item.imageFit ?? "contain", borderRadius: item.imageFit === "cover" ? 10 : 0 }} />}
        <span className="dish-category">{item.category?.[lang]}</span>
        <h3>{item.name[lang]}</h3>
        {item.description && <p>{item.description[lang]}</p>}
        <span className="dish-card-bottom"><span>{priceLabel || c.more}</span><span aria-hidden="true">↗</span></span>
      </button>
    </article>
    {(manualOpen || linked) && <MediaDialog title={item.name[lang]} onClose={close}>
      <div className="dish-modal-top">
        <div className="dish-modal-art">
          {item.image && <img className="dish-large-image" src={item.image} alt={item.name[lang]} style={{ objectFit: item.imageFit ?? "contain", borderRadius: 8 }} />}
          {item.imageCaption && <span className="illustration-label">{item.imageCaption[lang]}</span>}
          {item.imageIllustration && <span className="illustration-label">{c.illustration}</span>}
        </div>
        <div className="dish-modal-intro"><span className="eyebrow">{item.category?.[lang]}</span><h2>{item.name[lang]}</h2>
          {item.description && <p>{item.description[lang]}</p>}
          {(item.portion || priceLabel) && <p className="dish-price">{priceLabel || item.portion?.[lang]}</p>}
          <div className="dish-actions"><button className="button outline" aria-pressed={isSaved} onClick={() => toggle(item.id)}>{isSaved ? "♥" : "♡"} {isSaved ? c.saved : c.favorite}</button><button className="button outline" onClick={share}>↗ {c.share}</button></div>
          <small>{c.personal}</small><p role="status">{shareStatus}</p>
        </div>
      </div>
      <div className="dish-tabs" role="group" aria-label={c.detail}>
        {(["about", "origin", "reviews"] as const).map(key => <button key={key} aria-pressed={tab === key} onClick={() => setTab(key)}>{c[key]}{key === "reviews" ? ` (${reviews.length})` : ""}</button>)}
      </div>
      <div className="dish-panel" key={tab}>
        {tab === "about" && <><h3>{c.about}</h3><p>{item.description?.[lang]}</p><div className="dish-info-grid"><div><h4>{item.meat ? c.meat : c.ingredients}</h4><p>{item.meat?.[lang] || item.ingredients?.[lang] || c.ingredientsPending}</p></div><div><h4>{c.ingredients}</h4><p>{item.ingredients?.[lang] || c.ingredientsPending}</p></div></div><p className="allergy-note">{c.allergy}</p></>}
        {tab === "origin" && <div className="dish-info-grid"><div><span className="info-mark" aria-hidden="true">01</span><h3>{c.source}</h3><p>{item.source?.[lang] || c.sourcePending}</p></div><div><span className="info-mark" aria-hidden="true">02</span><h3>{c.quality}</h3><p>{item.quality?.[lang] || c.qualityPending}</p></div></div>}
        {tab === "reviews" && (reviews.length ? <div className="dish-reviews">{reviews.map(r => <article key={r.id}><h4>{r.name}</h4><p>{"★".repeat(Math.min(5, Math.max(0, Math.round(r.rating))))} · {r.date}</p><p>{r.text[lang]}</p></article>)}</div> : <div className="reviews-empty"><span aria-hidden="true">“</span><h3>{c.noReviews}</h3><p>{c.noReviewsText}</p><a className="button outline" href={`tel:${settings.phones[0].replace(/[^+\d]/g, "")}`}>{c.feedback} ↗</a></div>)}
      </div>
    </MediaDialog>}
  </>;
}
