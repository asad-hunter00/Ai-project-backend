import { randomUUID } from 'node:crypto';
import { getAnonClient, getAuthClient, getServiceClient, STORAGE_BUCKET } from '../config/supabase.ts';
import type { GalleryImage } from '../types/database.types.ts';
export function validateImageBytes(bytes: Buffer, mime: string) {
  if (!bytes.length || bytes.length > 5242880) throw new Error('Fayl hajmi 1 baytdan 5 MB gacha bo‘lsin');
  const detected = bytes[0]===255 && bytes[1]===216 && bytes[2]===255 ? 'image/jpeg' :
    bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png' :
    bytes.subarray(0,4).toString()==='RIFF' && bytes.subarray(8,12).toString()==='WEBP' ? 'image/webp' : '';
  if (!detected || detected !== mime) throw new Error('Fayl mazmuni JPEG, PNG yoki WebP formatiga mos emas');
}
export class GalleryService {
  static async sign(img: GalleryImage) {
    if (img.public_path) return { ...img, signed_url: img.public_path };
    const {data,error}=await getServiceClient().storage.from(STORAGE_BUCKET).createSignedUrl(img.file_path,3600);
    if(error) throw new Error('Rasm havolasini yaratib bo‘lmadi');
    return {...img,signed_url:data.signedUrl};
  }
  static async getImages(options:{roomId?:string;isAdmin?:boolean;accessToken?:string}={}) {
    const client=options.isAdmin && options.accessToken ? getAuthClient(options.accessToken):getAnonClient();
    let query=client.from('gallery_images').select('*').order('sort_order').order('created_at',{ascending:false});
    if(options.roomId)query=query.eq('room_id',options.roomId);
    if(!options.isAdmin)query=query.eq('is_published',true);
    const {data,error}=await query;if(error)throw new Error(error.message);
    return Promise.all((data as GalleryImage[]).map(img=>this.sign(img)));
  }
  static async createUploadUrl(accessToken:string, params:{fileName:string;mimeType:string;fileSize:number}) {
    if(params.fileSize<=0 || params.fileSize>5242880 || !['image/jpeg','image/png','image/webp'].includes(params.mimeType)) throw new Error('Rasm formati yoki hajmi noto‘g‘ri');
    const filePath=`uploads/${randomUUID()}_${params.fileName.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
    const {data,error}=await getAuthClient(accessToken).storage.from(STORAGE_BUCKET).createSignedUploadUrl(filePath);
    if(error)throw new Error(error.message);return {file_path:filePath,signed_url:data.signedUrl,token:data.token};
  }
  static async registerImage(token:string, input:Record<string,unknown>) {
    const filePath=String(input.file_path);
    if(!/^uploads\/[a-zA-Z0-9._-]+$/.test(filePath))throw new Error('Fayl yo‘li noto‘g‘ri');
    // Do not sign arbitrary paths: require the uploaded file to exist and verify bytes.
    const {data:blob,error:readError}=await getAuthClient(token).storage.from(STORAGE_BUCKET).download(filePath);
    if(readError||!blob)throw new Error('Yuklangan rasm topilmadi');
    const bytes=Buffer.from(await blob.arrayBuffer());validateImageBytes(bytes,String(input.mime_type));
    if(bytes.length!==input.file_size)throw new Error('Fayl hajmi mos emas');
    const {data,error}=await getAuthClient(token).from('gallery_images').insert(input).select().single();
    if(error)throw new Error(error.message);return this.sign(data);
  }
  static async upload(token:string, input:{base64:string;file_name:string;mime_type:string;[key:string]:unknown}) {
    const bytes=Buffer.from(input.base64,'base64');validateImageBytes(bytes,input.mime_type);
    const ext=input.mime_type==='image/png'?'png':input.mime_type==='image/jpeg'?'jpg':'webp';
    const path=`uploads/${randomUUID()}.${ext}`;const client=getAuthClient(token);
    const {error}=await client.storage.from(STORAGE_BUCKET).upload(path,bytes,{contentType:input.mime_type,upsert:false});
    if(error)throw new Error(error.message);
    const {base64,...meta}=input;
    const {data,error:dbError}=await client.from('gallery_images').insert({...meta,file_path:path,file_size:bytes.length,public_path:null}).select().single();
    if(dbError){await client.storage.from(STORAGE_BUCKET).remove([path]);throw new Error(dbError.message);}
    return this.sign(data);
  }
  static async updateImage(token:string,id:string,updates:Record<string,unknown>) {
    const {data,error}=await getAuthClient(token).from('gallery_images').update(updates).eq('id',id).select().single();
    if(error)throw new Error(error.message);return this.sign(data);
  }
  static async deleteImage(token:string,id:string) {
    const client=getAuthClient(token);
    const {data:img,error}=await client.from('gallery_images').select('*').eq('id',id).single();
    if(error||!img)throw new Error('Rasm topilmadi');
    const {error:hideError}=await client.from('gallery_images').update({is_published:false}).eq('id',id);
    if(hideError)throw new Error(hideError.message);
    if(!img.public_path){const {error:storageError}=await client.storage.from(STORAGE_BUCKET).remove([img.file_path]);if(storageError)throw new Error('Storage faylini o‘chirib bo‘lmadi. Qayta urinib ko‘ring');}
    const {error:dbError}=await client.from('gallery_images').delete().eq('id',id);
    if(dbError)throw new Error(dbError.message);return true;
  }
}
