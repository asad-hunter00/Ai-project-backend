/**
 * O‘ktam ota choyxonasi - Database & Domain TypeScript Types
 */

export interface RestaurantSettings {
  id: string;
  name: string;
  description: string | null;
  address: string;
  address_i18n?: Localized | null;
  description_i18n?: Localized | null;
  schedule_notes_i18n?: Localized | null;
  phones: string[];
  opening_time: string;
  closing_time: string;
  schedule_notes: string | null;
  map_url: string | null;
  telegram_url: string | null;
  instagram_url: string | null;
  created_at?: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string | null;
  name_i18n?: Localized | null;
  description_i18n?: Localized | null;
  capacity: number;
  amenities: string[];
  sort_order: number;
  is_published: boolean;
  is_temporary_name: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GalleryImage {
  id: string;
  room_id?: string | null;
  public_path?: string | null;
  description_i18n?: Localized | null;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: 'image/jpeg' | 'image/png' | 'image/webp';
  description?: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  signed_url?: string;
}

export interface Announcement {
  id: string;
  title_i18n?: Localized | null;
  content_i18n?: Localized | null;
  title: string;
  content: string;
  starts_at: string;
  ends_at?: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminRole {
  id: string;
  user_id: string;
  role: 'admin' | 'superadmin';
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface Localized { uz: string; ru: string; en: string; }
export interface MenuRecord {
  id: string; name: Localized; category: Localized | null; description: Localized | null;
  meat: Localized | null; ingredients: Localized | null; source: Localized | null; quality: Localized | null;
  portion: Localized | null; price: number | null; price_unit: 'piece' | 'kg' | 'portion';
  image_url: string | null; gallery_image_id: string | null; image_fit: 'contain' | 'cover'; image_caption: Localized | null;
  is_published: boolean; sort_order: number; signed_url?: string | null;
}
