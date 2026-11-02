import {Router} from 'express';
import {randomUUID} from 'node:crypto';
import {z} from 'zod';
import {getAnonClient,getAuthClient} from '../config/supabase.ts';
import {optionalAuthMiddleware,requireAdmin,type AuthenticatedRequest} from '../middlewares/auth.middleware.ts';
export const VIDEO_BUCKET='choyxona-videos';
export const MAX_VIDEO=50*1024*1024;
const text=z.object({uz:z.string().trim().min(1).max(200),ru:z.string().max(200),en:z.string().max(200)}).strict();
const schema=z.object({title:text,description:z.object({uz:z.string().max(3000),ru:z.string().max(3000),en:z.string().max(3000)}),is_published:z.boolean(),sort_order:z.number().int().min(0).max(100000)}).strict();
const uploadSchema=z.object({file_size:z.number().int().positive().max(MAX_VIDEO),mime_type:z.literal('video/mp4')}).strict();
export function isMp4(bytes:Uint8Array){return bytes.length>=12&&Buffer.from(bytes.subarray(4,8)).toString()==='ftyp';}
const router=Router();router.use(optionalAuthMiddleware);
const client=(req:AuthenticatedRequest)=>req.isAdmin?getAuthClient(req.token!):getAnonClient();
router.get('/',async(req:AuthenticatedRequest,res,next)=>{try{const db=client(req);let query=db.from('videos').select('*').eq('upload_complete',true).order('sort_order').order('created_at',{ascending:false});if(!req.isAdmin)query=query.eq('is_published',true);const {data,error}=await query;if(error)throw error;const rows=await Promise.all((data||[]).map(async row=>{const {data,error}=await db.storage.from(VIDEO_BUCKET).createSignedUrl(row.file_path,3600);if(error)throw error;return {...row,signed_url:data.signedUrl};}));res.json({success:true,data:rows});}catch(e){next(e);}});
router.post('/upload-url',requireAdmin,async(req:AuthenticatedRequest,res,next)=>{try{const input=uploadSchema.parse(req.body);const db=client(req);const id=randomUUID(),path=`videos/${id}.mp4`;const {error}=await db.from('videos').insert({id,file_path:path,file_size:input.file_size,title:{uz:'Yangi video',ru:'',en:''}});if(error)throw error;const result=await db.storage.from(VIDEO_BUCKET).createSignedUploadUrl(path);if(result.error){await db.from('videos').delete().eq('id',id);throw result.error;}res.json({success:true,data:{id,signed_url:result.data.signedUrl}});}catch(e){next(e);}});
router.post('/:id/complete',requireAdmin,async(req:AuthenticatedRequest,res,next)=>{try{z.string().uuid().parse(req.params.id);const db=client(req);const {data:row,error}=await db.from('videos').select('*').eq('id',req.params.id).single();if(error)throw error;
// Verify uploaded bytes before allowing publication. The bucket enforces 50 MB.
const file=await db.storage.from(VIDEO_BUCKET).download(row.file_path);if(file.error)throw file.error;const bytes=new Uint8Array(await file.data.arrayBuffer());if(bytes.length!==row.file_size||bytes.length>MAX_VIDEO||!isMp4(bytes)){await db.storage.from(VIDEO_BUCKET).remove([row.file_path]);throw new Error('MP4 fayl noto‘g‘ri yoki hajmi mos emas');}
const result=await db.from('videos').update({upload_complete:true}).eq('id',row.id).select().single();if(result.error)throw result.error;res.json({success:true,data:result.data});}catch(e){next(e);}});
router.put('/:id',requireAdmin,async(req:AuthenticatedRequest,res,next)=>{try{z.string().uuid().parse(req.params.id);const input=schema.parse(req.body);const result=await client(req).from('videos').update(input).eq('id',req.params.id).eq('upload_complete',true).select().single();if(result.error)throw result.error;res.json({success:true,data:result.data});}catch(e){next(e);}});
router.delete('/:id',requireAdmin,async(req:AuthenticatedRequest,res,next)=>{try{z.string().uuid().parse(req.params.id);const db=client(req);const {data:row,error}=await db.from('videos').select('file_path').eq('id',req.params.id).single();if(error)throw error;const removed=await db.storage.from(VIDEO_BUCKET).remove([row.file_path]);if(removed.error)throw removed.error;const result=await db.from('videos').delete().eq('id',req.params.id);if(result.error)throw result.error;res.json({success:true,data:{deleted:true}});}catch(e){next(e);}});
export default router;
