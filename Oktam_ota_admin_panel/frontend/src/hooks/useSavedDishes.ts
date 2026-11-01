import { useEffect, useState } from "react";
const key = "oktam-ota-saved-dishes";
function read(): string[] {
  try { const value: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
  } catch { return []; }
}
export function useSavedDishes() {
  const [saved, setSaved] = useState<string[]>(read);
  useEffect(() => {
    const sync = () => setSaved(read());
    window.addEventListener("oktam-saved", sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener("oktam-saved", sync); window.removeEventListener("storage", sync); };
  }, []);
  const toggle = (id: string) => {
    const before = read();
    const next = before.includes(id) ? before.filter(x => x !== id) : [...before, id];
    try { localStorage.setItem(key, JSON.stringify(next)); window.dispatchEvent(new Event("oktam-saved")); }
    catch { setSaved(next); } // Storage restrictions must not break the menu.
  };
  return { saved, toggle };
}
