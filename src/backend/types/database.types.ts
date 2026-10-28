/**
 * O‘ktam ota choyxonasi - Database & Domain TypeScript Types
 */

export interface RestaurantSettings {
  id: string;
  name: string;
  description: string | null;
  address: string;
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
