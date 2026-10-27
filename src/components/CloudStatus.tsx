import { useState, useEffect } from 'react';
import { Wifi, WifiOff, CloudOff } from 'lucide-react';
import { useT } from '../i18n/useTranslation';
import { pickLang } from '../i18n/pickLang';
import { cloudSync } from '../lib/cloudSync';

export function CloudStatus() {
  const { lang } = useT();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // مراقبة حالة الإنترنت في المتصفح
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // التحقق من تسجيل الدخول
    cloudSync.getCurrentUser().then(u => setIsAuth(!!u)).catch(() => setIsAuth(false));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isAuth) return null; // لا تظهر شيئاً إذا لم يكن مسجلاً

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold font-body transition-all ${
      isOnline 
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
        : 'bg-red-500/10 border-red-500/30 text-red-300'
    }`}>
      {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
      <span>
        {isOnline 
          ? pickLang({ ar: 'متصل بالسحابة', en: 'Cloud Connected' }, lang)
          : pickLang({ ar: 'غير متصل (يُحفظ محلياً)', en: 'Offline (Saved Locally)' }, lang)}
      </span>
    </div>
  );
}