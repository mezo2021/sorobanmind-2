import { useState } from 'react';
import { useT } from '../i18n/useTranslation';
import { pickLang } from '../i18n/pickLang';
import { useProgressStore } from '../store/progressStore';
import { cloudSync } from '../lib/cloudSync';
import { Plus, User, X, AlertCircle } from 'lucide-react';

export function ChildSwitcher() {
  const { lang } = useT();
  const childrenList = useProgressStore((s) => s.childrenList) || [];
  const activeChildId = useProgressStore((s) => s.activeChildId);
  const setActiveChild = useProgressStore((s) => s.setActiveChild);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async () => {
    setError('');
    if (newName.trim().split(/\s+/).length !== 3) {
      setError(pickLang({ ar: 'يجب إدخال 3 أسماء', en: 'Must enter 3 names' }, lang)); return;
    }
    try {
      await cloudSync.addChildToCloud(newName.trim());
      setShowAdd(false); setNewName('');
    } catch (e: any) { setError(e.message); }
  };

  if (childrenList.length === 0) return null;

  return (
    <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
      {childrenList.map((child) => (
        <button key={child.id} onClick={() => setActiveChild(child.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border ${activeChildId === child.id ? 'bg-purple-500/20 border-purple-400/50 text-purple-200' : 'bg-white/5 border-white/10 text-white/60'}`}>
          <User className="w-4 h-4" /> {child.name}
        </button>
      ))}
      <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-white/30 text-white/60">
        <Plus className="w-4 h-4" /> {pickLang({ ar: 'إضافة طفل', en: 'Add Child' }, lang)}
      </button>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-card p-6 w-full max-w-sm relative">
            <button onClick={() => setShowAdd(false)} className="absolute top-3 left-3 text-white/50"><X className="w-5 h-5"/></button>
            <h3 className="text-lg font-bold text-white mb-4">{pickLang({ ar: 'طفل جديد (ثلاثي)', en: 'New Child (3 parts)' }, lang)}</h3>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="ميمو أحمد علي" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-3 text-white mb-2" />
            {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
            <button onClick={handleAdd} className="btn-primary w-full !py-2.5">{pickLang({ ar: 'حفظ', en: 'Save' }, lang)}</button>
          </div>
        </div>
      )}
    </div>
  );
}