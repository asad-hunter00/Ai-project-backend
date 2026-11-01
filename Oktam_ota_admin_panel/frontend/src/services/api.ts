import {initialContent} from '../data/content';
import type {Settings,SiteContent,Announcement,LocalizedText,MenuItem,Room,GalleryImage} from '../types';
import {apiRequest,type AdminSettings,type AdminRoom,type AdminImage,type AdminAnnouncement,type AdminMenu} from './admin';
export const apiConfigured=true;
export async function requestEndpoint(endpoint:'settings'|'rooms'|'gallery'|'announcements'|'menu',signal?:AbortSignal):Promise<unknown>{return {success:true,data:await apiRequest(endpoint,{signal})};}
function local(value:unknown,fallback=''):LocalizedText{if(value&&typeof value==='object'){const v=value as Partial<LocalizedText>;return {uz:v.uz||fallback,ru:v.ru||v.uz||fallback,en:v.en||v.uz||fallback};}return {uz:fallback,ru:fallback,en:fallback};}
export function safeUrl(value:unknown):string|null{if(typeof value!=='string')return null;try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
function imageUrl(value:unknown):string|undefined{if(typeof value!=='string')return undefined;if(/^\/images\/[a-zA-Z0-9/_ .-]+$/.test(value)&&!value.includes('..'))return value;return safeUrl(value)??undefined;}
function unwrap<T>(value:unknown):T{const v=value as {success?:boolean;data?:T};if(v?.success!==true||v.data===undefined)throw new Error('API javobi noto‘g‘ri');return v.data;}
export function parseSettingsResponse(value:unknown):Settings{
 const d=unwrap<AdminSettings>(value);if(typeof d.name!=='string'||typeof d.address!=='string'||!Array.isArray(d.phones)||!d.phones.length||!d.phones.every(p=>typeof p==='string'&&/^\+?[\d\s()-]{7,25}$/.test(p))||typeof d.opening_time!=='string'||typeof d.closing_time!=='string')throw new Error('Sozlamalar formati noto‘g‘ri');
 return {name:d.name,address:d.address,addressLocalized:local(d.address_i18n,d.address),hours:`${d.opening_time.slice(0,5)}–${d.closing_time.slice(0,5)}`,phones:d.phones,description:d.description||undefined,descriptionLocalized:local(d.description_i18n,d.description||''),scheduleNotes:d.schedule_notes||undefined,scheduleLocalized:local(d.schedule_notes_i18n,d.schedule_notes||''),mapUrl:safeUrl(d.map_url),telegramUrl:safeUrl(d.telegram_url),instagramUrl:safeUrl(d.instagram_url)};
}
export function parseAnnouncementsResponse(value:unknown,now=Date.now()):Announcement[]{const data=unwrap<AdminAnnouncement[]>(value);if(!Array.isArray(data))throw new Error('E’lon formati noto‘g‘ri');return data.filter(i=>i.is_published&&Number.isFinite(Date.parse(i.starts_at))&&Date.parse(i.starts_at)<=now&&(!i.ends_at||Date.parse(i.ends_at)>now)).map(i=>({id:i.id,title:local(i.title_i18n,i.title),text:local(i.content_i18n,i.content),active:true}));}
export function parseMenuResponse(value:unknown):MenuItem[]{const rows=unwrap<AdminMenu[]>(value);if(!Array.isArray(rows))throw new Error('Menyu formati noto‘g‘ri');return rows.filter(i=>i.is_published).map(i=>({id:i.id,name:local(i.name),category:i.category?local(i.category):undefined,description:i.description?local(i.description):undefined,meat:i.meat?local(i.meat):undefined,ingredients:i.ingredients?local(i.ingredients):undefined,source:i.source?local(i.source):undefined,quality:i.quality?local(i.quality):undefined,portion:i.portion?local(i.portion):{uz:i.price_unit==='kg'?'1 kg':i.price_unit==='piece'?'1 dona':'1 porsiya',ru:i.price_unit==='kg'?'1 кг':i.price_unit==='piece'?'1 шт.':'1 порция',en:i.price_unit==='kg'?'1 kg':i.price_unit==='piece'?'1 skewer':'1 serving'},price:i.price===null?undefined:i.price,image:imageUrl(i.signed_url??i.image_url),imageFit:i.image_fit,imageCaption:i.image_caption?local(i.image_caption):undefined,reviews:[]}));}
const commonAmenities:Record<string,LocalizedText>={'shinam mebellar':{uz:'Shinam mebellar',ru:'Удобная мебель',en:'Comfortable furniture'},konditsioner:{uz:'Konditsioner',ru:'Кондиционер',en:'Air conditioning'}};
export function parseRoomsResponse(value:unknown,images:AdminImage[]=[]):Room[]{const rows=unwrap<AdminRoom[]>(value);if(!Array.isArray(rows))throw new Error('Xonalar formati noto‘g‘ri');return rows.filter(r=>r.is_published).map(r=>({id:r.id,name:local(r.name_i18n,r.name),description:local(r.description_i18n,r.description||''),capacity:r.capacity,amenities:r.amenities.map(a=>commonAmenities[a.toLowerCase()]||local(null,a)),image:imageUrl(images.find(i=>i.room_id===r.id&&i.is_published)?.signed_url),published:true}));}
export function parseGalleryResponse(value:unknown):GalleryImage[]{const rows=unwrap<AdminImage[]>(value);if(!Array.isArray(rows))throw new Error('Galereya formati noto‘g‘ri');return rows.filter(i=>i.is_published&&imageUrl(i.signed_url??i.public_path)).map(i=>({id:i.id,src:imageUrl(i.signed_url??i.public_path)!,alt:local(i.description_i18n,i.description||i.file_name)}));}
export async function loadSiteContent(signal?:AbortSignal):Promise<SiteContent>{
 const paths=['settings','announcements','menu','rooms','gallery'] as const;
 const responses=await Promise.allSettled(paths.map(path=>requestEndpoint(path,signal)));
 if(signal?.aborted)throw new DOMException('Aborted','AbortError');
 let warning=false;
 function read<T>(index:number,parse:(v:unknown)=>T,fallback:T):T{const r=responses[index];if(r.status==='fulfilled'){try{return parse(r.value);}catch{warning=true;return fallback;}}warning=true;return fallback;}
 const settings=read(0,parseSettingsResponse,initialContent.settings);
 const announcements=read(1,parseAnnouncementsResponse,[]);
 const menu=read<MenuItem[]|undefined>(2,parseMenuResponse,undefined);
 const images=read<AdminImage[]>(4,v=>unwrap<AdminImage[]>(v),[]);
 const gallery=read(4,parseGalleryResponse,initialContent.gallery);
 const rooms=read(3,v=>parseRoomsResponse(v,images),[]);
 return {settings,announcements,menu,gallery,rooms,loadWarning:warning};
}
