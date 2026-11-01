// User-confirmed location; backend may still contain the old landmark.
export const confirmedLocation = {
  address: "Sarvar Azimov ko‘chasi 47, 131100, Jizzax, Jizzax viloyati, O‘zbekiston",
  mapUrl: "https://www.google.com/maps/place/O'ktam+bobo+Choyxonasi/@40.1387575,67.7935703,18z/data=!3m1!4b1!4m6!3m5!1s0x38b29731db3a3db3:0xe5367e1e39de8856!8m2!3d40.1387558!4d67.7946529!16s%2Fg%2F11z_xpb6xg",
  instagramUrl: "https://www.instagram.com/oktam._bobo.coyxonasi/",
  telegramUrl: "https://t.me/javohir_6000",
  latitude: 40.138759,
  longitude: 67.794645,
};

export function mapCoordinates(url: string | null | undefined): [number, number] | null {
  if (!url) return null;
  const place = url.match(/!3d(-?[\d.]+)!4d(-?[\d.]+)/);
  let values: string[] | null = place ? [place[1], place[2]] : null;
  if (!values) { try { const u=new URL(url); const q=u.searchParams.get('query')||u.searchParams.get('q'); if(q) values=q.split(','); } catch {return null;} }
  if (!values || values.length !== 2) return null;
  const lat=Number(values[0]),lng=Number(values[1]);
  return Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180?[lat,lng]:null;
}
