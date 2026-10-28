/**
 * O‘ktam ota choyxonasi - Backend Server & API Entry Point
 */
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

import authRoutes from './src/backend/routes/auth.routes.ts';
import settingsRoutes from './src/backend/routes/settings.routes.ts';
import roomsRoutes from './src/backend/routes/rooms.routes.ts';
import galleryRoutes from './src/backend/routes/gallery.routes.ts';
import announcementsRoutes from './src/backend/routes/announcements.routes.ts';
import { errorHandler } from './src/backend/middlewares/error.middleware.ts';
import { isSupabaseConfigured } from './src/backend/config/supabase.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 1. Health check & Diagnostics API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'O‘ktam ota choyxonasi - Backend API & Database Service',
    time: new Date().toISOString(),
    timezone: 'Asia/Tashkent (UTC+5)',
    supabase_configured: isSupabaseConfigured(),
    features: {
      auth: 'Supabase Auth with custom admin_roles table',
      database: 'PostgreSQL with Row Level Security (RLS)',
      storage: 'Supabase Storage private bucket (choyxona-media) with signed URLs',
      capacity: '20 rooms with 10 person capacity',
      amenities: ['shinam mebellar', 'konditsioner'],
    },
  });
});

// 2. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/announcements', announcementsRoutes);

// 3. API Error handling
app.use(errorHandler);

// 4. Vite middleware (Headless status dashboard integration)
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const distPath = path.resolve(__dirname, 'dist');

  if (isProduction && fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Backend] O‘ktam ota choyxonasi API serveri http://0.0.0.0:${PORT} portida ishga tushdi`);
    console.log(`[Backend] Supabase sozlanganlik holati: ${isSupabaseConfigured() ? 'Ulangan' : 'Kutilmoqda (.env)'}`);
  });
}

startServer().catch((err) => {
  console.error('[Backend] Serverni ishga tushirishda xatolik:', err);
  process.exit(1);
});
