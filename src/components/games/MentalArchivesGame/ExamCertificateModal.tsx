// src/components/games/MentalArchivesGame/ExamCertificateModal.tsx
// شهادة إنجاز فخرية (غير رسمية) — نموذج واحد ديناميكي لكل امتحان كيو ناجح.
// تصدير PDF/PNG عبر html2canvas + jspdf، وطباعة عبر window.print().
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
  /** معرّف الامتحان (exam_10_7, exam_6 ...) — المصدر الأساسي للمستوى والدرجة والتاريخ */
  examId?: string;
  /** احتياطي فقط إن لم يُمرَّر examId (توافق مع الاستدعاء السابق) */
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
    <svg viewBox="0 0 60 60" className={`absolute w-14 h-14 ${pos}`} fill="none" stroke={GOLD} strokeWidth="2">
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

  // المستوى: يُستخرج من examId (exam_10_7 → "10-7 كيو"، exam_6 → "6 كيو")
  const kyu = examId
    ? examLabel(examId, isAr)
    : isAr ? (kyuLabelAr ?? '') : (kyuLabelEn ?? '');
  const finalScore = result?.score ?? score ?? 0;
  const finalTotal = result?.totalMarks ?? totalMarks ?? 500;

  // التاريخ من completedAt (احتياطياً: اليوم)
  const d = new Date(result?.completedAt ?? Date.now());
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dateStr = isAr ? `${dd}/${mm}/${d.getFullYear()}` : `${mm}/${dd}/${d.getFullYear()}`;

  const render = async () => {
    const { default: html2canvas } = await import('html2canvas');
    return html2canvas(certRef.current as HTMLElement, { scale: 2, backgroundColor: IVORY, useCORS: true });
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
    } finally { setBusy(false); }
  };

  const downloadPdf = async () => {
    if (!certRef.current) return;
    if (preview) { setWarn(true); return; }
    setBusy(true);
    try {
      const c = await render();
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(c.toDataURL('image/png'), 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save('soroban-certificate.pdf');
    } finally { setBusy(false); }
  };

  const font = isAr ? "'Cairo','Tajawal',sans-serif" : "'Cinzel','Playfair Display',serif";

  const node = (
    <div id="cert-portal" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 overflow-auto" dir={isAr ? 'rtl' : 'ltr'}>
      <style>{`
        @media print {
          body > *:not(#cert-portal) { display: none !important; }
          #cert-portal { position: static !important; background: white !important; padding: 0 !important; }
          .cert-actions { display: none !important; }
          #cert-sheet { box-shadow: none !important; width: 100% !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 16 }} className="w-full max-w-3xl">
        <div className="cert-actions flex flex-wrap gap-2 justify-center mb-3">
          <button onClick={downloadPdf} disabled={busy} className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-60"><Download className="w-4 h-4" />{isAr ? 'تحميل PDF' : 'Download PDF'}</button>
          <button onClick={downloadPng} disabled={busy} className="flex items-center gap-1.5 bg-sky-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-60"><ImageIcon className="w-4 h-4" />{isAr ? 'تحميل صورة' : 'Download Image'}</button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-sm"><Printer className="w-4 h-4" />{isAr ? 'طباعة' : 'Print'}</button>
          <button onClick={onClose} className="flex items-center gap-1.5 bg-rose-600 text-white font-bold px-4 py-2 rounded-xl text-sm"><X className="w-4 h-4" />{isAr ? 'إغلاق' : 'Close'}</button>
        </div>
        {warn && <p className="cert-actions text-center text-amber-300 text-sm mb-2">{isAr ? 'وضع المعاينة — لا يتم حفظ' : 'Preview mode — not saved'}</p>}

        <div ref={certRef} id="cert-sheet" style={{ aspectRatio: '1.414 / 1', background: `radial-gradient(ellipse at center, ${IVORY} 0%, #f3e3b0 70%, #e2cb85 100%)`, fontFamily: font, color: NAVY, boxShadow: `0 0 40px ${GOLD}88` }}
          className="relative w-full rounded-lg overflow-hidden p-[4%]">
          <div className="absolute inset-[2.5%] border-[3px] rounded-md" style={{ borderColor: GOLD }} />
          <div className="absolute inset-[3.6%] border rounded-sm" style={{ borderColor: `${GOLD}99` }} />
          <Corner pos="top-2 left-2" />
          <Corner pos="top-2 right-2 -scale-x-100" />
          <Corner pos="bottom-2 left-2 -scale-y-100" />
          <Corner pos="bottom-2 right-2 scale-[-1]" />
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 0 0, ${GOLD}22, transparent 18%), radial-gradient(circle at 100% 100%, ${GOLD}22, transparent 18%)` }} />

          <div className="relative h-full flex flex-col items-center justify-between text-center px-[5%] py-[2%]">
            {/* أعلى: اللوجو + اسم الأكاديمية + العنوان الديناميكي */}
            <div className="flex flex-col items-center">
              <img src={logoImg} alt="Logo" className="w-[9%] min-w-[38px] object-contain" crossOrigin="anonymous" />
              <h1 className="font-black text-[clamp(11px,2.6vw,24px)] leading-tight">{isAr ? 'أكاديمية السوروبان الدولية' : 'International Soroban Academy'}</h1>
              <div className="mt-1 px-4 py-0.5 rounded-full text-[clamp(9px,1.8vw,15px)] font-bold" style={{ background: NAVY, color: GOLD }}>
                {isAr ? <>شهادة إنجاز فخرية - <Num>{kyu}</Num></> : <>Honorary Certificate - <Num>{kyu}</Num></>}
              </div>
            </div>

            {/* وسط: الاسم الكامل + نص الاجتياز */}
            <div className="flex flex-col items-center gap-[1.5%] max-w-[90%]">
              <p className="text-[clamp(9px,1.7vw,14px)] opacity-70">{isAr ? 'تُمنح هذه الشهادة إلى' : 'This certificate is proudly presented to'}</p>
              <h2 className="font-black text-[clamp(16px,4.2vw,40px)] leading-tight" style={{ color: '#8a6d12', textShadow: '0 1px 0 #fff8' }}>{childName}</h2>
              <p className="text-[clamp(10px,2vw,17px)] font-bold leading-relaxed">
                {isAr
                  ? <>لقد اجتزت بنجاح امتحان <Num>{kyu}</Num> بدرجة <Num>{finalScore}</Num> من <Num>{finalTotal}</Num></>
                  : <>You have successfully passed the <Num>{kyu}</Num> exam with a score of <Num>{finalScore}</Num> out of <Num>{finalTotal}</Num></>}
              </p>
            </div>

            {/* تذييل مطابق لورقة التدريب */}
            <div className="w-full">
              <div className="flex items-end justify-between text-[clamp(8px,1.5vw,12px)] font-bold">
                <div className="text-center w-1/3">
                  {isAr ? 'تصميم البرنامج: مصطفى علي اكر' : 'Program Design: Mustafa Ali Eker'}
                </div>
                <div className="w-[12%] min-w-[44px] aspect-square rounded-full flex items-center justify-center" style={{ background: `radial-gradient(circle at 30% 30%, #fff3b0, ${GOLD} 60%, #8a6d12)`, boxShadow: `0 0 12px ${GOLD}`, border: '2px solid #8a6d12' }}>
                  <img src={logoImg} alt="Seal" className="w-[62%] object-contain" crossOrigin="anonymous" />
                </div>
                <div className="text-center w-1/3">
                  {parentName ? <div>{isAr ? `ابن السيد: ${parentName}` : `Son of: ${parentName}`}</div> : null}
                  <div dir="ltr" className="mt-0.5">{isAr ? 'تاريخ الإصدار: ' : 'Issue Date: '}<Num>{dateStr}</Num></div>
                </div>
              </div>
              <p className="mt-1 text-[clamp(7px,1.2vw,10px)] opacity-60">{isAr ? 'شهادة فخرية غير رسمية' : 'Non-official honorary certificate'}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
  return createPortal(node, document.body);
}
