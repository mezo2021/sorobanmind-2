// src/components/games/MentalArchivesGame/ExamCertificateModal.tsx
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon, Printer, X } from 'lucide-react';
import { useGameLang } from '../gamesI18n';
import { useProgressStore } from '@/store/progressStore';
import { Num } from '@/components/Num';
import { isPreviewMode } from '@/utils/previewMode';
import { examLabel } from '@/utils/leaderboard';
import logoImg from '@/assets/logo.webp';

type Props = {
  examId?: string;
  kyuLabelAr?: string;
  kyuLabelEn?: string;
  score?: number;
  totalMarks?: number;
  onClose: () => void;
};

const GOLD = '#D4AF37';
const NAVY = '#0F172A';
const IVORY = '#FFF8DC';

function Corner({ pos }: { pos: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`absolute w-[8%] h-auto ${pos}`} fill="none" stroke={GOLD} strokeWidth="2">
      <path d="M4 56V14C4 8 8 4 14 4h42" />
      <path d="M12 56V22c0-5 5-10 10-10h34" opacity=".6" />
      <circle cx="10" cy="10" r="3" fill={GOLD} />
    </svg>
  );
}

export default function ExamCertificateModal({ examId, kyuLabelAr, kyuLabelEn, score, totalMarks, onClose }: Props) {
  const { isAr } = useGameLang();
  const childName = useProgressStore((s) => s.childName);
  const parentName = useProgressStore((s) => s.parentName);
  const result = useProgressStore((s) => (examId ? s.mentalArchivesExams[examId] : undefined));
  const preview = isPreviewMode();
  const certRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [warn, setWarn] = useState(false);

  useEffect(() => {
    const id = 'cert-fonts';
    if (document.getElementById(id)) return;
    const l = document.createElement('link');
    l.id = id; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Cinzel:wght@500;700&family=Playfair+Display:wght@500;700&display=swap';
    document.head.appendChild(l);
  }, []);

  const kyu = examId
    ? examLabel(examId, isAr)
    : isAr ? (kyuLabelAr ?? '') : (kyuLabelEn ?? '');
  const finalScore = result?.score ?? score ?? 0;
  const finalTotal = result?.totalMarks ?? totalMarks ?? 500;

  const d = new Date(result?.completedAt ?? Date.now());
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dateStr = isAr ? `${dd}/${mm}/${d.getFullYear()}` : `${mm}/${dd}/${d.getFullYear()}`;

  const render = async () => {
    // ننتظر تحميل الخطوط لضمان ظهور النص بشكل سليم في الصورة
    await document.fonts.ready;
    const { default: html2canvas } = await import('html2canvas');
    return html2canvas(certRef.current as HTMLElement, { 
      scale: 2, 
      backgroundColor: IVORY, 
      useCORS: true,
      allowTaint: true,
      windowWidth: 1400 // إجبار المتصفح على الرندر بعرض كبير
    });
  };

  const downloadPng = async () => {
    if (!certRef.current) return;
    setBusy(true);
    try {
      const c = await render();
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = 'soroban-certificate.png';
      a.click();
    } catch (e) {
      console.error(e);
    } finally { setBusy(false); }
  };

  const downloadPdf = () => {
    if (preview) { setWarn(true); return; }
    // الطريقة الأضمن على الجوال: نفتح نافذة الطباعة، ويختار المستخدم "حفظ كـ PDF"
    window.print(); 
  };

  const font = isAr ? "'Cairo','Tajawal',sans-serif" : "'Cinzel','Playfair Display',serif";

  const node = (
    <div id="cert-portal" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 overflow-auto" dir={isAr ? 'rtl' : 'ltr'}>
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body > *:not(#cert-portal) { display: none !important; }
          #cert-portal { position: static !important; background: white !important; padding: 0 !important; display: block !important; }
          #cert-portal > div { width: 297mm !important; height: 210mm !important; max-width: none !important; transform: none !important; padding: 0 !important; margin: 0 !important; }
          .cert-actions { display: none !important; }
          #cert-sheet { 
            width: 100% !important; height: 100% !important; 
            aspect-ratio: auto !important;
            box-shadow: none !important; border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; 
          }
        }
      `}</style>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 16 }} className="w-full max-w-4xl">
        <div className="cert-actions flex flex-wrap gap-2 justify-center mb-3">
          <button onClick={downloadPdf} disabled={busy} className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-60"><Download className="w-4 h-4" />{isAr ? 'حفظ PDF' : 'Save PDF'}</button>
          <button onClick={downloadPng} disabled={busy} className="flex items-center gap-1.5 bg-sky-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-60"><ImageIcon className="w-4 h-4" />{isAr ? 'تحميل صورة' : 'Download Image'}</button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-sm"><Printer className="w-4 h-4" />{isAr ? 'طباعة' : 'Print'}</button>
          <button onClick={onClose} className="flex items-center gap-1.5 bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-sm"><X className="w-4 h-4" />{isAr ? 'إغلاق' : 'Close'}</button>
        </div>
        {warn && <p className="cert-actions text-center text-amber-300 text-sm mb-2">{isAr ? 'وضع المعاينة — لا يتم حفظ' : 'Preview mode — not saved'}</p>}

        <div ref={certRef} id="cert-sheet" style={{ containerType: 'inline-size', aspectRatio: '1.414 / 1', background: `radial-gradient(ellipse at center, ${IVORY} 0%, #f3e3b0 70%, #e2cb85 100%)`, fontFamily: font, color: NAVY, boxShadow: `0 0 40px ${GOLD}88` }}
          className="relative w-full rounded-lg overflow-hidden p-[4%]">
          <div className="absolute inset-[2.5%] border-[0.3cqw] rounded-md" style={{ borderColor: GOLD }} />
          <div className="absolute inset-[3.6%] border-[0.1cqw] rounded-sm" style={{ borderColor: `${GOLD}99` }} />
          <Corner pos="top-2 left-2" />
          <Corner pos="top-2 right-2 -scale-x-100" />
          <Corner pos="bottom-2 left-2 -scale-y-100" />
          <Corner pos="bottom-2 right-2 scale-[-1]" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 0 0, ${GOLD}22, transparent 18%), radial-gradient(circle at 100% 100%, ${GOLD}22, transparent 18%)` }} />

          <div className="relative h-full flex flex-col items-center justify-between text-center px-[5%] py-[3%]">
            {/* أعلى: اللوجو + اسم الأكاديمية + العنوان الديناميكي */}
            <div className="flex flex-col items-center">
              <img src={logoImg} alt="Logo" className="w-[9cqw] object-contain mb-[1cqw]" crossOrigin="anonymous" />
              <h1 className="font-black text-[2.8cqw] leading-none">{isAr ? 'أكاديمية السوروبان الدولية' : 'International Soroban Academy'}</h1>
              <div className="mt-[2cqw] inline-flex items-center justify-center whitespace-nowrap px-[4cqw] py-[1.2cqw] rounded-full text-[1.6cqw] font-bold" style={{ background: NAVY, color: GOLD }}>
  {isAr ? <>شهادة إنجاز فخرية - <span className="mx-[1cqw]"><Num>{kyu}</Num></span></> : <>Honorary Certificate - <span className="mx-[1cqw]"><Num>{kyu}</Num></span></>}
</div>
            </div>

            {/* وسط: الاسم الكامل + نص الاجتياز */}
            <div className="flex flex-col items-center gap-[1cqw] max-w-[90%]">
              <p className="text-[1.8cqw] opacity-80">{isAr ? 'تُمنح هذه الشهادة إلى' : 'This certificate is proudly presented to'}</p>
              <h2 className="font-black text-[4.5cqw] leading-tight" style={{ color: '#8a6d12', textShadow: '0 1px 0 #fff8' }}>{childName}</h2>
              <p className="text-[2.1cqw] font-bold leading-relaxed">
                {isAr
                  ? <>لقد اجتزت بنجاح امتحان <Num>{kyu}</Num> بدرجة <Num>{finalScore}</Num> من <Num>{finalTotal}</Num></>
                  : <>You have successfully passed the <Num>{kyu}</Num> exam with a score of <Num>{finalScore}</Num> out of <Num>{finalTotal}</Num></>}
              </p>
            </div>

            {/* تذييل مطابق لورقة التدريب */}
            <div className="w-full">
              <div className="flex items-center justify-between text-[1.5cqw] font-bold">
                <div className="text-center w-1/3">
                  {isAr ? 'تصميم البرنامج: مصطفى علي اكر' : 'Program Design: Mustafa Ali Eker'}
                </div>
                <div className="w-[10cqw] h-[10cqw] rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle at 30% 30%, #fff3b0, ${GOLD} 60%, #8a6d12)`, boxShadow: `0 0 1cqw ${GOLD}`, border: '0.2cqw solid #8a6d12' }}>
                  <img src={logoImg} alt="Seal" className="w-[65%] object-contain" crossOrigin="anonymous" />
                </div>
                <div className="text-center w-1/3">
                  {parentName ? <div className="mb-[0.5cqw]">{isAr ? `ابن السيد: ${parentName}` : `Son of: ${parentName}`}</div> : null}
                  <div dir="ltr">{isAr ? 'تاريخ الإصدار: ' : 'Issue Date: '}<Num>{dateStr}</Num></div>
                </div>
              </div>
              <p className="mt-[1cqw] text-[1.2cqw] opacity-60">{isAr ? 'شهادة فخرية غير رسمية' : 'Non-official honorary certificate'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
  return createPortal(node, document.body);
}