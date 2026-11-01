import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePreferences } from "../i18n";
export function RouteEffects() {
  const location = useLocation();
  const { t } = usePreferences();
  useLayoutEffect(() => {
    const scroll = () => {
      const target = location.hash
        ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
        : null;
      if (target) {
        target.scrollIntoView({ behavior: "instant" });
        return true;
      }
      if (!location.hash)
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return !location.hash;
    };
    let observer: MutationObserver | undefined;
    if (!scroll()) {
      observer = new MutationObserver(() => {
        if (scroll()) observer?.disconnect();
      });
      observer.observe(document.getElementById("main")!, {
        childList: true,
        subtree: true,
      });
    }
    if (!location.hash)
      document.getElementById("main")?.focus({ preventScroll: true });
    return () => observer?.disconnect();
  }, [location.pathname, location.hash, location.key]);
  useEffect(() => {
    const name =
      location.pathname === "/menu"
        ? t.menuTitle
        : location.pathname === "/gallery"
          ? t.galleryTitle
          : location.pathname === "/"
            ? t.nav[0]
            : t.notFound;
    document.title = `${name} | ${t.brand}`;
  }, [location.pathname, t]);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.07 },
    );
    document.querySelectorAll(".section").forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);
  return null;
}
