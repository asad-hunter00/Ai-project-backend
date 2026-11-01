export interface LocalizedText {
  uz: string;
  ru: string;
  en: string;
}
export interface Room {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  capacity: number;
  amenities: LocalizedText[];
  image?: string;
  published: boolean;
}
export interface DishReview {
  id: string;
  name: string;
  text: LocalizedText;
  rating: number;
  date: string;
}
export interface MenuItem {
  id: string;
  name: LocalizedText;
  category?: LocalizedText;
  description?: LocalizedText;
  price?: number;
  portion?: LocalizedText;
  meat?: LocalizedText;
  ingredients?: LocalizedText;
  source?: LocalizedText;
  quality?: LocalizedText;
  imageIllustration?: boolean;
  imageFit?: "cover" | "contain";
  imageCaption?: LocalizedText;
  reviews?: DishReview[];
  image?: string;
}
export interface GalleryImage {
  id: string;
  src: string;
  alt: LocalizedText;
}
export interface Announcement {
  id: string;
  title: LocalizedText;
  text: LocalizedText;
  active: boolean;
}
export interface Settings {
  addressLocalized?: LocalizedText;
  descriptionLocalized?: LocalizedText;
  scheduleLocalized?: LocalizedText;
  name: string;
  address: string;
  hours: string;
  phones: string[];
  description?: string;
  scheduleNotes?: string;
  mapUrl?: string | null;
  telegramUrl?: string | null;
  instagramUrl?: string | null;
}
export interface SiteContent {
  menu?: MenuItem[];
  loadWarning?: boolean;
  settings: Settings;
  rooms: Room[];
  gallery: GalleryImage[];
  announcements: Announcement[];
}
