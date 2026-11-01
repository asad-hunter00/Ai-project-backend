import express, { type RequestHandler } from 'express';
import authRoutes from './routes/auth.routes.ts';
import settingsRoutes from './routes/settings.routes.ts';
import roomsRoutes from './routes/rooms.routes.ts';
import galleryRoutes from './routes/gallery.routes.ts';
import announcementsRoutes from './routes/announcements.routes.ts';
import menuRoutes from './routes/menu.routes.ts';
import { errorHandler } from './middlewares/error.middleware.ts';
import { isSupabaseConfigured } from './config/supabase.ts';
export function loginLimiter(limit=10, windowMs=15*60*1000):RequestHandler {
  const attempts=new Map<string,{count:number;until:number}>();
  return (req,res,next)=>{
    const now=Date.now(),key=req.ip || 'unknown';
    // Bound memory without a timer that keeps tests/server alive.
    if(attempts.size>10000)for(const [key,value]of attempts)if(value.until<=now)attempts.delete(key);
    const entry=attempts.get(key);
    const current=entry && entry.until>now?entry:{count:0,until:now+windowMs};
    current.count++;attempts.set(key,current);
    if(current.count>limit){res.setHeader('Retry-After',String(Math.ceil((current.until-now)/1000)));res.status(429).json({success:false,error:'Kirish urinishlari ko‘p. 15 daqiqadan keyin qayta urinib ko‘ring.'});return;}
    next();
  };
}
export function createApp() {
  const app=express();app.disable('x-powered-by');app.set('trust proxy',1);
  app.use((_req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');next();});
  const origins=(process.env.ALLOWED_ORIGINS||'http://localhost:5173,http://127.0.0.1:5173').split(',').map(s=>s.trim());
  app.use((req,res,next)=>{
    const origin=req.get('Origin');
    if(origin && origins.includes(origin)){
      res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
      res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS');
    }
    if(req.method==='OPTIONS'){res.sendStatus(origin && !origins.includes(origin)?403:204);return;}
    next();
  });
  app.use(express.json({limit:'8mb'}));
  app.get('/api/health',(_req,res)=>res.json({status:'ok',supabase_configured:isSupabaseConfigured(),version:'admin-panel-1.1'}));
  app.post('/api/auth/login',loginLimiter());
  app.use('/api/auth',authRoutes);app.use('/api/settings',settingsRoutes);app.use('/api/rooms',roomsRoutes);
  app.use('/api/gallery',galleryRoutes);app.use('/api/announcements',announcementsRoutes);app.use('/api/menu',menuRoutes);
  app.use((_req,res)=>res.status(404).json({success:false,error:'API manzili topilmadi'}));
  app.use(errorHandler);return app;
}
