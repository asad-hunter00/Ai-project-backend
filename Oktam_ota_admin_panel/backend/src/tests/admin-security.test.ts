import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import type {AddressInfo} from 'node:net';
const adminId='11111111-1111-4111-8111-111111111111';
async function listen(s:http.Server){await new Promise<void>(r=>s.listen(0,'127.0.0.1',r));return `http://127.0.0.1:${(s.address() as AddressInfo).port}`;}
async function close(s:http.Server){await new Promise<void>((r,j)=>s.close(e=>e?j(e):r()));}
test('API authorization, stateless clients and validation',async()=>{
 let writes=0;const seen:string[]=[];
 const mock=http.createServer((req,res)=>{
  const url=new URL(req.url!,'http://test'),auth=req.headers.authorization||'';seen.push(url.pathname+'|'+auth);res.setHeader('Content-Type','application/json');
  if(url.pathname==='/auth/v1/token'){res.end(JSON.stringify({access_token:'admin-test-token',token_type:'bearer',expires_in:3600,refresh_token:'unused-test-token',user:{id:adminId,email:'admin@example.test'}}));return;}
  if(url.pathname==='/auth/v1/user'){if(auth==='Bearer admin-test-token'||auth==='Bearer member-test-token'){res.end(JSON.stringify({id:auth.includes('member')?'22222222-2222-4222-8222-222222222222':adminId,email:'admin@example.test'}));}else{res.statusCode=401;res.end(JSON.stringify({msg:'invalid'}));}return;}
  if(url.pathname==='/auth/v1/logout'){res.statusCode=204;res.end();return;}
  if(url.pathname==='/rest/v1/admin_roles'){res.end(JSON.stringify(url.searchParams.get('user_id')===`eq.${adminId}`?{role:'superadmin'}:null));return;}
  if(!['GET','HEAD'].includes(req.method||''))writes++;
  if(url.pathname==='/rest/v1/rooms'){res.end(JSON.stringify(auth==='Bearer admin-test-token'?[{id:adminId,name:'Draft',is_published:false}]:[]));return;}
  if(url.pathname==='/rest/v1/gallery_images'){res.end(JSON.stringify(auth==='Bearer admin-test-token'?[{id:adminId,public_path:'/images/test.webp',file_path:'/images/test.webp',is_published:false}]:[]));return;}
  res.end('[]');
 });
 const mockUrl=await listen(mock);process.env.SUPABASE_URL=mockUrl;process.env.SUPABASE_ANON_KEY='anon-test-key';process.env.SUPABASE_SERVICE_ROLE_KEY='service-test-key';
 const {createApp,loginLimiter}=await import('../backend/app.ts');
 const {validateImageBytes}=await import('../backend/services/gallery.service.ts');
 const {CreateMenuSchema,UpdateSettingsSchema}=await import('../backend/validation/schemas.ts');
 const server=http.createServer(createApp()),base=await listen(server);
 const request=(path:string,method='GET',token?:string,body?:unknown)=>fetch(`${base}/api/${path}`,{method,headers:{...(token?{Authorization:`Bearer ${token}`} :{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
 try{
  for(const endpoint of ['menu','rooms','gallery','announcements'])assert.equal((await request(endpoint,'POST',undefined,{})).status,401);
  assert.equal((await request('settings','PUT',undefined,{})).status,401);
  assert.equal((await request('menu/any','DELETE','member-test-token')).status,403);
  assert.equal((await request('gallery/upload','POST',undefined,{})).status,401);
  assert.equal((await request('auth/bootstrap-first-admin','POST',undefined,{})).status,404);
  const login=await request('auth/login','POST',undefined,{email:'admin@example.test',password:'test-password'});assert.equal(login.status,200);assert.equal((await login.json()).data.session.refresh_token,undefined);
  assert.equal((await (await request('rooms','GET','admin-test-token')).json()).data.length,1);
  assert.deepEqual((await (await request('rooms')).json()).data,[]);
  assert.equal((await (await request('gallery','GET','admin-test-token')).json()).data[0].signed_url,'/images/test.webp');
  assert.deepEqual((await (await request('gallery')).json()).data,[]);
  assert.equal((await (await request('auth/me','GET','member-test-token')).json()).data.isAdmin,false);
  assert.equal((await request('menu','POST','admin-test-token',{id:'bad id'})).status,400);
  assert.equal(writes,0);assert.ok(seen.includes('/rest/v1/rooms|Bearer anon-test-key'));
  assert.throws(()=>validateImageBytes(Buffer.from('fake png'),'image/png'));assert.throws(()=>validateImageBytes(Buffer.alloc(5242881),'image/webp'));
  assert.throws(()=>CreateMenuSchema.parse({id:'dish',name:{uz:'Taom',ru:'',en:''},price:-1}));assert.throws(()=>UpdateSettingsSchema.parse({map_url:'javascript:alert(1)'}));
  assert.equal((await request('auth/logout','POST','admin-test-token')).status,200);
  const express=(await import('express')).default;const limited=express();limited.post('/login',loginLimiter(2,60000),(_req,res)=>res.json({ok:true}));const limitServer=http.createServer(limited),limitBase=await listen(limitServer);
  try{for(let i=0;i<2;i++)assert.equal((await fetch(`${limitBase}/login`,{method:'POST'})).status,200);assert.equal((await fetch(`${limitBase}/login`,{method:'POST'})).status,429);}finally{await close(limitServer);}
 }finally{await close(server);await close(mock);}
});
