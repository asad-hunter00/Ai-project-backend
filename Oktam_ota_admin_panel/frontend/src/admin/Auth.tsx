import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {Navigate,useLocation} from 'react-router-dom';
import {apiRequest} from '../services/admin';
interface Session {token:string;email:string;expiresAt:number;}
interface Auth {session:Session|null;checking:boolean;login:(email:string,password:string)=>Promise<void>;logout:()=>Promise<void>;}
const Context=createContext<Auth|null>(null);
function stored():Session|null {try{const v=JSON.parse(sessionStorage.getItem('oktam-admin')||'null');return v && typeof v.token==='string' && typeof v.email==='string' && typeof v.expiresAt==='number' && v.expiresAt>Date.now()/1000?v:null;}catch{return null;}}
export function AdminAuth({children}:{children:ReactNode}){
 const [session,setSession]=useState<Session|null>(stored);const [checking,setChecking]=useState(true);
 function clear(){try{sessionStorage.removeItem('oktam-admin');}catch{}setSession(null);}
 useEffect(()=>{let cancelled=false;const current=stored();
  if(!current){setChecking(false);return;}
  apiRequest<{authenticated:boolean;isAdmin:boolean}>('auth/me',{token:current.token}).then(data=>{if(!cancelled && (!data.authenticated||!data.isAdmin))clear();}).catch(()=>{if(!cancelled)clear();}).finally(()=>{if(!cancelled)setChecking(false);});
  return()=>{cancelled=true;};
 },[]);
 useEffect(()=>{const expired=()=>clear();window.addEventListener('oktam-auth-expired',expired);const timer=session?window.setTimeout(clear,Math.max(0,session.expiresAt*1000-Date.now())):undefined;return()=>{window.removeEventListener('oktam-auth-expired',expired);clearTimeout(timer);};},[session]);
 async function login(email:string,password:string){
  const result=await apiRequest<{user:{email:string};session:{access_token:string;expires_at:number}}>('auth/login',{method:'POST',body:{email,password}});
  const value={token:result.session.access_token,email:result.user.email,expiresAt:result.session.expires_at};
  if(!value.token || !Number.isFinite(value.expiresAt))throw new Error('Kirish javobi noto‘g‘ri');
  const me=await apiRequest<{authenticated:boolean;isAdmin:boolean}>('auth/me',{token:value.token});
  if(!me.authenticated||!me.isAdmin)throw new Error('Administrator huquqi yo‘q');
  try{sessionStorage.setItem('oktam-admin',JSON.stringify(value));}catch{}setSession(value);
 }
 async function logout(){const current=session;clear();if(current)await apiRequest('auth/logout',{method:'POST',token:current.token});}
 return <Context.Provider value={{session,checking,login,logout}}>{children}</Context.Provider>;
}
export function useAdminAuth(){const value=useContext(Context);if(!value)throw new Error('Auth provider missing');return value;}
export function AdminGuard({children}:{children:ReactNode}){const {session,checking}=useAdminAuth();const location=useLocation();if(checking)return <p className="admin-loading">Sessiya tekshirilmoqda…</p>;if(!session)return <Navigate to="/admin/login" replace state={{from:location.pathname}}/>;return <>{children}</>;}
