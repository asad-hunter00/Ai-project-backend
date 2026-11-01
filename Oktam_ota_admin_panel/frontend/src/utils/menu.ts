import type { MenuItem } from "../types";
export const UNCATEGORIZED = "uncategorized";
export const categoryKey = (item: MenuItem) =>
  item.category ? `category:${item.category.uz}` : UNCATEGORIZED;
export function normalizeSearch(text: string) {
  return text
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[‘’ʻʼ`´']/g, "'")
    .trim();
}
export function filterMenu(
  items: MenuItem[],
  query: string,
  category: string,
  language: "uz" | "ru" | "en",
) {
  const q = normalizeSearch(query);
  return items.filter(
    (item) =>
      (category === "all" || categoryKey(item) === category) &&
      normalizeSearch([item.name[language], item.name.uz, item.category?.[language] ?? "", item.description?.[language] ?? ""].join(" ")).includes(q),
  );
}
