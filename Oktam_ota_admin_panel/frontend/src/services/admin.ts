export const API_BASE = (import.meta as ImportMeta & {env:Record<string,string>}).env.VITE_API_BASE_URL?.trim() || '/backend';
export class ApiError extends Error { constructor(message:string,public status:number){super(message);} }
export async function apiRequest<T>(path:string, options:{method?:string;body?:unknown;token?:string;signal?:AbortSignal}={}):Promise<T> {
  const response=await fetch(`${API_BASE.replace(/\/+$/,'')}/api/${path}`,{
    method:options.method || 'GET',signal:options.signal,cache:'no-store',
    headers:{...(options.body===undefined?{}:{'Content-Type':'application/json'}),...(options.token?{Authorization:`Bearer ${options.token}`}:{})},
    body:options.body===undefined?undefined:JSON.stringify(options.body),
  });
  const result=await response.json().catch(()=>null);
  if(!response.ok || !result?.success){
    if(options.token && (response.status===401 || response.status===403))window.dispatchEvent(new Event('oktam-auth-expired'));
    const details=Array.isArray(result?.details)?result.details.map((d:{field:string;message:string})=>`${d.field}: ${d.message}`).join('; '):'';
    throw new ApiError([result?.error || `API xatosi (${response.status})`,details].filter(Boolean).join(' — '),response.status);
  }
  return result.data as T;
}
export interface Localized {uz:string;ru:string;en:string}
export interface AdminSettings {id?:string;name:string;description:string|null;address:string;phones:string[];opening_time:string;closing_time:string;schedule_notes:string|null;map_url:string|null;telegram_url:string|null;instagram_url:string|null;address_i18n?:Localized|null;description_i18n?:Localized|null;schedule_notes_i18n?:Localized|null;}
export interface AdminRoom {id:string;name:string;description:string|null;capacity:number;amenities:string[];sort_order:number;is_published:boolean;is_temporary_name:boolean;name_i18n?:Localized|null;description_i18n?:Localized|null;}
export interface AdminImage {id:string;room_id:string|null;file_path:string;public_path?:string|null;signed_url?:string;description:string|null;description_i18n?:Localized|null;sort_order:number;is_published:boolean;file_name:string;file_size:number;mime_type:string;}
export interface AdminAnnouncement {id:string;title:string;content:string;starts_at:string;ends_at:string|null;is_published:boolean;title_i18n?:Localized|null;content_i18n?:Localized|null;}
export interface AdminMenu {id:string;name:Localized;category:Localized|null;description:Localized|null;meat:Localized|null;ingredients:Localized|null;source:Localized|null;quality:Localized|null;portion:Localized|null;price:number|null;price_unit:'piece'|'kg'|'portion';image_url:string|null;gallery_image_id:string|null;signed_url?:string|null;image_fit:'contain'|'cover';image_caption:Localized|null;is_published:boolean;sort_order:number;}
export async function uploadImage(file:File,token:string,roomId:string|null=null):Promise<AdminImage>{
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5242880||file.size===0)throw new Error('JPEG, PNG yoki WebP, maksimal 5 MB rasm tanlang');
  const base64=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('Faylni o‘qib bo‘lmadi'));reader.readAsDataURL(file);});
  return apiRequest<AdminImage>('gallery/upload',{method:'POST',token,body:{file_name:file.name,mime_type:file.type,base64,room_id:roomId,is_published:false}});
}
