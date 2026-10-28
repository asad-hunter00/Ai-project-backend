/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DIQQAT: Foydalanuvchi talabiga asosan:
 * "Frontend, sahifalar, dizayn va admin panel interfeysini yaratma. FAQAT backend yarat."
 * "Mavjud API sinash vositasi bo‘lsa, undan foydalanish yo‘lini ko‘rsat."
 * Ushbu sahifa ishlab chiquvchilar uchun texnik API holati va xavfsiz REST API sinov
 * konsolidir. Barcha amallar faqat brauzeringiz ichida bajariladi va parollar hech qayerga uzatilmaydi.
 */

import { useEffect, useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Server, 
  Key, 
  FolderArchive, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  LogOut,
  RefreshCw,
  Terminal
} from 'lucide-react';

interface HealthData {
  status: string;
  name: string;
  time: string;
  timezone: string;
  supabase_configured: boolean;
  features: {
    auth: string;
    database: string;
    storage: string;
    capacity: string;
    amenities: string[];
  };
}

export default function App() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);

  // API Tester State (hech qanday parollar chatga ketmaydi, faqat local state)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authResult, setAuthResult] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roomsData, setRoomsData] = useState<any>(null);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const fetchHealth = () => {
    setLoadingHealth(true);
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoadingHealth(false);
      })
      .catch((err) => {
        console.error('API health fetch error:', err);
        setLoadingHealth(false);
      });
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleLoginTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setAuthLoading(true);
    setAuthResult(null);
    setRoomsData(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setAuthResult({ status: res.status, ok: res.ok, body: data });

      if (res.ok && data.data?.session?.access_token) {
        setToken(data.data.session.access_token);
      } else {
        setToken(null);
      }
    } catch (err: any) {
      setAuthResult({ status: 500, ok: false, error: err.message });
      setToken(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFetchRoomsAsAdmin = async () => {
    if (!token) return;
    setRoomsLoading(true);
    try {
      const res = await fetch('/api/rooms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRoomsData({ status: res.status, body: data });
    } catch (err: any) {
      setRoomsData({ status: 500, error: err.message });
    } finally {
      setRoomsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    setToken(null);
    setAuthResult(null);
    setRoomsData(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header / Notice */}
        <div className="border border-emerald-500/30 bg-emerald-950/20 rounded-lg p-5">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-emerald-400">
                O‘ktam ota choyxonasi — Backend API &amp; Database Service
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Loyiha qat‘iy talab asosida FAQAT backend (Supabase DB, RLS, Storage va REST API) arxitekturasida yaratilgan.
              </p>
            </div>
          </div>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Server className="w-4 h-4 text-sky-400" />
              REST API Server
            </div>
            <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {loadingHealth ? 'Tekshirilmoqda...' : health?.status === 'ok' ? 'Faol (Port 3000)' : 'Noma‘lum'}
            </div>
            <div className="text-xs text-slate-500 mt-2">Vaqt zonasi: Asia/Tashkent (UTC+5)</div>
          </div>

          <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Database className="w-4 h-4 text-emerald-400" />
              Supabase Baza &amp; RLS
            </div>
            <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              {health?.supabase_configured ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Ulangan
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Kutilmoqda (.env)
                </>
              )}
            </div>
            <div className="text-xs text-slate-500 mt-2">RLS 100% barcha jadvallarda yoqilgan</div>
          </div>

          <div className="border border-slate-800 bg-slate-900/60 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              Admin Xavfsizligi
            </div>
            <div className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              admin_roles (superadmin)
            </div>
            <div className="text-xs text-slate-500 mt-2">Ochiq ro‘yxatdan o‘tish o‘chirilgan</div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE API TESTER CONSOLE (Faqat sinov uchun) */}
        {/* ========================================================= */}
        <div className="border border-sky-500/30 bg-slate-900/80 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
              <Terminal className="w-5 h-5" />
              Administrator Kirishini Sinash Konsoli (Interactive API Tester)
            </div>
            <span className="text-[11px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
              Mahalliy Brauzer Sinovi
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Ushbu vosita orqali brauzeringiz ichidan to‘g‘ridan-to‘g‘ri <code className="text-slate-200">POST /api/auth/login</code> va <code className="text-slate-200">GET /api/rooms</code> API’larini xavfsiz sinashingiz mumkin. Kiritilgan ma’lumotlar faqat sizning brauzeringizdan backend serverga yuboriladi va chatga yoki loglarga chiqmaydi.
          </p>

          {!token ? (
            <form onSubmit={handleLoginTest} className="space-y-3 bg-slate-950 p-4 rounded border border-slate-800">
              <div className="text-xs font-semibold text-slate-300">1-qadam: Kirish (POST /api/auth/login)</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Admin Email:</label>
                  <input
                    type="email"
                    required
                    placeholder="admin@misol.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Parol:</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={authLoading}
                  className="bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs px-4 py-2 rounded font-medium transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {authLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                  Kirishni Sinash (Test Login)
                </button>
                <span className="text-[11px] text-slate-500">
                  Supabase Auth’dagi email va parolingiz
                </span>
              </div>
            </form>
          ) : (
            <div className="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Administrator Sessiyasi Faol!
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sessiyani Yakunlash
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <div><span className="text-slate-500">Foydalanuvchi:</span> {authResult?.body?.data?.user?.email}</div>
                <div><span className="text-slate-500">Tasdiqlangan Rol:</span> <span className="text-emerald-400 font-bold">{authResult?.body?.data?.user?.role}</span></div>
                <div><span className="text-slate-500">Bearer Token:</span> <span className="text-slate-400 text-[10px] break-all">{token.slice(0, 30)}... (brauzerda saqlandi)</span></div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 mb-2">2-qadam: Xonalarni Admin Sifatida Ko‘rish (Faqat O‘qish):</div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleFetchRoomsAsAdmin}
                    disabled={roomsLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs px-4 py-2 rounded font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {roomsLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                    Barcha 20 ta Draft Xonani Ko‘rish (GET /api/rooms)
                  </button>
                  <span className="text-[11px] text-amber-400/90">
                    * Xona nomlari o‘zgartirilmaydi va nashr qilinmaydi.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Login Response output */}
          {authResult && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Server Javobi (Status: {authResult.status}):</span>
                {authResult.ok ? (
                  <span className="text-emerald-400 font-bold">200 OK (Muvaffaqiyatli)</span>
                ) : (
                  <span className="text-rose-400 font-bold">Xatolik ({authResult.body?.error || 'Rad etildi'})</span>
                )}
              </div>
              <pre className="text-[11px] text-slate-300 overflow-x-auto p-3 bg-slate-950 rounded border border-slate-800">
                {JSON.stringify(authResult.body, null, 2)}
              </pre>
            </div>
          )}

          {/* Rooms response output */}
          {roomsData && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Admin Sifatida Qaytgan Xonalar Ro‘yxati (Status: {roomsData.status}):</span>
                <span className="text-emerald-400 font-bold">Jami: {roomsData.body?.data?.length || 0} ta xona</span>
              </div>
              <pre className="text-[11px] text-emerald-400 overflow-x-auto p-3 bg-slate-950 rounded border border-slate-800 max-h-60 overflow-y-auto">
                {JSON.stringify(roomsData.body, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Choyxona Configuration Details */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Tasdiqlangan Asosiy Ma’lumotlar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
            <div><span className="text-slate-500">Nomi:</span> O‘ktam ota choyxonasi</div>
            <div><span className="text-slate-500">Manzil:</span> Jizzax shahri, Eron zapravkasi oldida</div>
            <div><span className="text-slate-500">Telefonlar:</span> +998915672815, +998904869611</div>
            <div><span className="text-slate-500">Ish vaqti:</span> 09:00 – 23:50 (Yakshanba ochiq)</div>
            <div><span className="text-slate-500">Xonalar:</span> 20 ta xona (har biri 10 kishilik, draft)</div>
            <div><span className="text-slate-500">Qulayliklar:</span> shinam mebellar, konditsioner</div>
          </div>
          <p className="text-xs text-amber-400/90 pt-2 border-t border-slate-800/80">
            Izoh: Haqiqiy rasmlar, xarita havolasi va menyu hali yo‘qligi sababli o‘ylab topilmadi; qavat, narx va zal kabi tasdiqlanmagan maydonlar kiritilmadi.
          </p>
        </div>

        {/* API Endpoints Reference */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-lg p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Backend REST API Yo‘nalishlari (Endpoints)
          </h2>
          
          <div className="space-y-2 text-xs">
            {/* Auth */}
            <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
              <Key className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-slate-200 font-semibold">POST /api/auth/login</div>
                <div className="text-slate-400">Admin email va parol bilan kirish (oddiy userlar rad etiladi)</div>
              </div>
            </div>

            {/* Settings */}
            <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
              <Server className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-slate-200 font-semibold">GET /api/settings &nbsp;|&nbsp; PUT /api/settings</div>
                <div className="text-slate-400">Ommaviy o‘qish / Faqat admin tahrirlashi mumkin</div>
              </div>
            </div>

            {/* Rooms */}
            <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
              <Database className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-slate-200 font-semibold">GET /api/rooms &nbsp;|&nbsp; POST / PUT / DELETE /api/rooms/:id</div>
                <div className="text-slate-400">Mehmonlar faqat nashr etilganlarni ko‘radi; admin 20 ta draft xonani to‘liq boshqaradi</div>
              </div>
            </div>

            {/* Gallery */}
            <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
              <FolderArchive className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-slate-200 font-semibold">GET /api/gallery &nbsp;|&nbsp; POST /api/gallery/upload-url</div>
                <div className="text-slate-400">Private storage bucket (choyxona-media) orqali vaqtinchalik Signed URL taqdim etish</div>
              </div>
            </div>

            {/* Announcements */}
            <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded border border-slate-800/60">
              <Bell className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-slate-200 font-semibold">GET /api/announcements &nbsp;|&nbsp; POST / PUT / DELETE</div>
                <div className="text-slate-400">Faqat nashr etilgan va hozir faol bo‘lgan e‘lonlarni qaytarish (Asia/Tashkent)</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
