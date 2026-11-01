import {useEffect,useState} from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import {SettingsContext} from './settings';
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import {RouteEffects} from './components/RouteEffects';
import {HomePage} from './pages/HomePage';
import {MenuPage} from './pages/MenuPage';
import {GalleryPage} from './pages/GalleryPage';
import {NotFoundPage} from './pages/NotFoundPage';
import {initialContent,menuItems} from './data/content';
import {loadSiteContent} from './services/api';
import {usePreferences} from './i18n';
import {AdminRoutes} from './admin/Admin';
function PublicSite(){
 const {t}=usePreferences();const [content,setContent]=useState(initialContent),[status,setStatus]=useState<'idle'|'loading'|'error'>('loading');
 useEffect(()=>{let controller:AbortController|undefined;let disposed=false;const load=()=>{controller?.abort();controller=new AbortController();const current=controller;setStatus('loading');loadSiteContent(current.signal).then(data=>{if(!disposed&&!current.signal.aborted){setContent(data);setStatus(data.loadWarning?'error':'idle');}}).catch(()=>{if(!disposed&&!current.signal.aborted)setStatus('error');});};load();window.addEventListener('focus',load);window.addEventListener('oktam-content-updated',load);const timer=window.setInterval(load,45*60*1000);return()=>{disposed=true;controller?.abort();window.removeEventListener('focus',load);window.removeEventListener('oktam-content-updated',load);clearInterval(timer);};},[]);
 return <SettingsContext.Provider value={content.settings}><RouteEffects/><a className="skip-link" href="#main">{t.skip}</a><Header/><main id="main" tabIndex={-1}><Routes><Route path="/" element={<HomePage content={content} status={status}/>}/><Route path="/menu" element={<MenuPage items={content.menu??menuItems}/>}/><Route path="/gallery" element={<GalleryPage images={content.gallery}/>}/><Route path="*" element={<NotFoundPage/>}/></Routes>{status==='error'&&<p className="data-status" role="status">{t.error}</p>}</main><Footer phones={content.settings.phones}/></SettingsContext.Provider>;
}
export default function App(){return <BrowserRouter><Routes><Route path="/admin/*" element={<AdminRoutes/>}/><Route path="*" element={<PublicSite/>}/></Routes></BrowserRouter>;}
