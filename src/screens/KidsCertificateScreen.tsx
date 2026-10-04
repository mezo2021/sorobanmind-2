// src/screens/KidsCertificateScreen.tsx
// شهادة إتمام قسم الصغار — L3 (فضية · لغة واحدة فقط · قابلة للطباعة)
// [FIX 7] — وضع المعاينة: درجات افتراضية لعرض الشهادة

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Printer, Award, Home, Edit3, Sparkles, Languages } from 'lucide-react';
import CertificateLogo from '@/components/CertificateLogo';
import CertificateMedal from '@/components/CertificateMedal';
import { useProgressStore } from '@/store/progressStore';
import type { CertificateLevel } from '@/utils/certificateGenerator';

// [FIX 7] — أداة المعاينة
import { isPreviewMode } from '@/utils/previewMode';

type Lang = 'ar' | 'en';

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

function getKidsLevel(score: number): {
  level: CertificateLevel;
  levelAr: string;
  levelEn: string;
  appreciationAr: string;
  appreciationEn: string;
  hasMedal: boolean;
} {
  if (score >= 90) {
    return { level: 'silver', levelAr: 'فضي', levelEn: 'Silver', appreciationAr: 'ممتاز', appreciationEn: 'Excellent', hasMedal: true };
  }
  if (score >= 85) {
    return { level: 'bronze', levelAr: 'برونزي', levelEn: 'Bronze', appreciationAr: 'جيد جداً', appreciationEn: 'Very Good', hasMedal: true };
  }
  if (score >= 80) {
    return { level: 'pass', levelAr: 'ناجح', levelEn: 'Pass', appreciationAr: 'جيد', appreciationEn: 'Good', hasMedal: false };
  }
  return { level: 'fail', levelAr: 'راسب', levelEn: 'Fail', appreciationAr: 'حاول مرة أخرى', appreciationEn: 'Try Again', hasMedal: false };
}

const SILVER = {
  text: '#3A3A3A',
  textSoft: '#5A5A5A',
  textTitle: '#606060',
  accent: '#7A7A7A',
};

interface Props {
  onBack: () => void;
  playSound: (type: 'click' | 'success' | 'whoosh' | 'levelup') => void;
  onGoHome?: () => void;
}

const KidsCertificateScreen: React.FC<Props> = ({ onBack, playSound, onGoHome }) => {
  const [studentName, setStudentName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [finalScore, setFinalScore] = useState<number>(0);
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    // [FIX 7] — في وضع المعاينة: درجات افتراضية لرؤية شكل الشهادة
    const inPreview = isPreviewMode();

    if (inPreview) {
      // درجة افتراضية (فضية — 92%)
      setFinalScore(92);
      const savedName = localStorage.getItem('soroban_child_full_name');
      setStudentName(savedName || 'اسم الطالب التجريبي');
      return;
    }

    // الحالة الحقيقية — قراءة عادية
    try {
      const s = useProgressStore.getState().computeFinalScore('L3');
      if (s !== null) setFinalScore(s);
    } catch { /* ignore */ }

    const savedName = localStorage.getItem('soroban_child_full_name');
    if (savedName) {
      setStudentName(savedName);
    } else {
      setEditingName(true);
    }
  }, []);

  const handleSaveName = () => {
    if (!tempName.trim()) return;
    setStudentName(tempName.trim());
    try {
      localStorage.setItem('soroban_child_full_name', tempName.trim());
    } catch { /* ignore */ }
    setEditingName(false);
    playSound('success');
  };

  const info = getKidsLevel(finalScore);
  const isAr = lang === 'ar';

  const handlePrint = () => {
    if (!studentName) {
      setEditingName(true);
      return;
    }
    playSound('click');
    setTimeout(() => window.print(), 300);
  };

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const issueDateAr = `${now.getFullYear()} / ${pad(now.getMonth() + 1)} / ${pad(now.getDate())} م`;
  const issueDateEn = `${pad(now.getDate())} / ${pad(now.getMonth() + 1)} / ${now.getFullYear()}`;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-6 pb-24 cert-root"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* أنماط الطباعة — متوافقة مع أندرويد */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 8mm; }
          html, body { background: #fff !important; }
          .no-print { display: none !important; }
          .cert-root {
            background: #fff !important;
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
          }
          .cert-card {
            box-shadow: none !important;
            page-break-inside: avoid;
            transform: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 max-w-4xl mx-auto no-print">
        <button onClick={onBack} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition">
          <ArrowRight className={`w-5 h-5 sm:w-6 sm:h-6 ${isAr ? '' : 'rotate-180'}`} />
        </button>
        <div className="text-center">
          <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            {isAr ? 'شهادة إتمام — الأبطال الصغار' : 'Kids Certificate of Completion'}
          </h1>
        </div>
        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
      </div>

      {/* تبديل اللغة */}
      <div className="max-w-4xl mx-auto mb-3 flex justify-center no-print">
        <div className="inline-flex bg-white/10 rounded-2xl p-1 gap-1">
          <button
            onClick={() => { playSound('click'); setLang('ar'); }}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition ${
              isAr ? 'bg-gradient-to-l from-gray-400 to-gray-600 text-white shadow' : 'text-white/60'
            }`}
          >
            <Languages className="w-3.5 h-3.5" /> عربي
          </button>
          <button
            onClick={() => { playSound('click'); setLang('en'); }}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition ${
              !isAr ? 'bg-gradient-to-l from-gray-400 to-gray-600 text-white shadow' : 'text-white/60'
            }`}
          >
            <Languages className="w-3.5 h-3.5" /> English
          </button>
        </div>
      </div>

      {/* تنبيه اسم */}
      {editingName && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-400/15 border border-gray-300/40 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 max-w-4xl mx-auto no-print"
        >
          <p className="text-xs sm:text-sm text-gray-100 font-body mb-2 sm:mb-3">
            {isAr ? '📝 اكتب اسمك الثلاثي ليظهر على الشهادة' : '📝 Write your full name to appear on the certificate'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder={isAr ? 'اكتب اسمك الثلاثي' : 'Enter your full name'}
              className="flex-1 bg-slate-800 border-2 border-gray-400/50 rounded-xl px-3 sm:px-4 py-2 text-white text-sm outline-none focus:border-gray-200"
              dir={isAr ? 'rtl' : 'ltr'}
            />
            <button
              onClick={handleSaveName}
              disabled={!tempName.trim()}
              className="px-3 sm:px-4 py-2 bg-gradient-to-l from-gray-400 to-gray-600 rounded-xl font-bold text-sm disabled:opacity-40"
            >
              {isAr ? 'حفظ' : 'Save'}
            </button>
          </div>
        </motion.div>
      )}

      {/* ═══════ الشهادة ═══════ */}
      <div className="w-full flex justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="cert-card w-full print:my-0 origin-top"
          style={{
            maxWidth: '720px',
            background:
              'linear-gradient(135deg, #6E6E6E 0%, #C0C0C0 25%, #9A9A9A 50%, #D8D8D8 75%, #707070 100%)',
            padding: 'clamp(3px, 1vw, 8px)',
            borderRadius: '14px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 24px rgba(192,192,192,0.25)',
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              background:
                'radial-gradient(ellipse at center, #FCFCFC 0%, #F0F0F0 50%, #E2E2E2 100%)',
              borderRadius: '10px',
              padding: 'clamp(10px, 3vw, 18px) clamp(8px, 2.5vw, 14px)',
            }}
          >
            {/* علامة مائية */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
              <CertificateLogo size={420} watermark />
            </div>

            {/* إطار داخلي مزدوج */}
            <div
              className="absolute pointer-events-none"
              style={{ top: 6, left: 6, right: 6, bottom: 6, border: '1.5px solid #808080', borderRadius: '8px' }}
            />
            <div
              className="absolute pointer-events-none"
              style={{ top: 10, left: 10, right: 10, bottom: 10, border: '0.8px solid #B0B0B0', borderRadius: '6px' }}
            />

            {/* زخارف الزوايا */}
            {[
              { top: 3, left: 3, rotation: 0 },
              { top: 3, right: 3, rotation: 90 },
              { bottom: 3, right: 3, rotation: 180 },
              { bottom: 3, left: 3, rotation: 270 },
            ].map((pos, i) => (
              <svg
                key={i}
                width="34"
                height="34"
                viewBox="0 0 48 48"
                className="absolute pointer-events-none"
                style={{
                  top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom,
                  transform: `rotate(${pos.rotation}deg)`,
                } as React.CSSProperties}
              >
                <path d="M 2 2 L 20 2 L 20 6 L 6 6 L 6 20 L 2 20 Z" fill="#808080" />
                <circle cx="10" cy="10" r="2.5" fill="#C0C0C0" stroke="#606060" strokeWidth="0.5" />
                <circle cx="4" cy="4" r="1.5" fill="#D8D8D8" />
                <path d="M 20 2 L 30 2" stroke="#808080" strokeWidth="1" />
                <path d="M 2 20 L 2 30" stroke="#808080" strokeWidth="1" />
              </svg>
            ))}

            {/* ───── المحتوى ───── */}
            <div className="relative z-10 text-center" style={{ color: SILVER.text }}>

              {/* الشعار */}
              <div className="flex justify-center mb-1">
                <CertificateLogo size={80} />
              </div>

              {/* اسم الأكاديمية */}
              {isAr ? (
                <>
                  <p className="font-serif font-bold text-[9px] sm:text-[10px] tracking-widest" style={{ color: SILVER.textTitle }}>
                    INTERNATIONAL SOROBAN ACADEMY
                  </p>
                  <p className="font-serif font-black text-xs sm:text-sm mt-0.5" style={{ color: SILVER.text }}>
                    أكاديمية السوروبان الدولية
                  </p>
                </>
              ) : (
                <>
                  <p className="font-serif font-black text-xs sm:text-sm" style={{ color: SILVER.text }}>
                    INTERNATIONAL SOROBAN ACADEMY
                  </p>
                  <p className="font-serif font-bold text-[9px] sm:text-[10px] tracking-widest mt-0.5" style={{ color: SILVER.textTitle }} dir="rtl">
                    أكاديمية السوروبان الدولية
                  </p>
                </>
              )}

              {/* فاصل */}
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, #808080, transparent)' }} />
                <span style={{ color: '#808080', fontSize: '12px' }}>❖</span>
                <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, #808080, transparent)' }} />
              </div>

              {/* العنوان */}
              <h1
                className="font-serif font-black leading-tight"
                style={{
                  fontSize: 'clamp(18px, 4.5vw, 28px)',
                  color: SILVER.textTitle,
                  textShadow: '1px 1px 0 #E8E8E8, 1.5px 1.5px 2px rgba(0,0,0,0.15)',
                }}
              >
                {isAr ? 'شهادة إتمام' : 'Certificate of Completion'}
              </h1>

              {/* الدورة */}
              <p className="font-bold text-[11px] sm:text-sm mt-1.5" style={{ color: SILVER.text }}>
                {isAr
                  ? 'دورة السوروبان في الحساب الذهني — الأبطال الصغار'
                  : 'Soroban Mental Arithmetic Course — Young Heroes'}
              </p>

              {/* شريط المستوى */}
              <div
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #F0F0F0 0%, #C0C0C0 100%)',
                  border: '1.2px solid #808080',
                  boxShadow: '0 2px 8px rgba(192,192,192,0.45)',
                }}
              >
                {info.hasMedal && <CertificateMedal level={info.level} size={26} />}
                <div className={`flex flex-col ${isAr ? 'items-start' : 'items-start'}`}>
                  <span className="font-black leading-tight" style={{ color: SILVER.text, fontSize: '11px' }}>
                    {isAr ? `المستوى ${info.levelAr}` : `${info.levelEn} Level`}
                  </span>
                  <span className="font-bold leading-tight" style={{ color: SILVER.accent, fontSize: '7px', letterSpacing: '0.8px' }}>
                    {isAr ? info.levelEn.toUpperCase() + ' LEVEL' : info.levelAr}
                  </span>
                </div>
              </div>

              {/* فاصل */}
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px flex-1 max-w-[140px]" style={{ background: 'linear-gradient(to right, transparent, #A8A8A8, transparent)' }} />
                <span style={{ color: '#A8A8A8', fontSize: '10px' }}>✦</span>
                <div className="h-px flex-1 max-w-[140px]" style={{ background: 'linear-gradient(to left, transparent, #A8A8A8, transparent)' }} />
              </div>

              {/* التقديم */}
              <p className="text-[10px] sm:text-xs" style={{ color: SILVER.text }}>
                {isAr ? 'تشهد الأكاديمية بأن الطالب/ة المتميز/ة' : 'The academy certifies that the distinguished student'}
              </p>

              {/* اسم الطالب */}
              <p
                className="font-serif font-black my-1.5"
                style={{
                  fontSize: 'clamp(16px, 4vw, 26px)',
                  color: SILVER.textTitle,
                  textShadow: '1px 1px 0 #FFFFFF',
                }}
              >
                {studentName || '—'}
              </p>

              <div className="mx-auto mb-2" style={{ width: '55%', maxWidth: '260px', height: '1.2px', background: 'linear-gradient(to right, transparent, #808080, transparent)' }} />

              {/* نص الإتمام */}
              {isAr ? (
                <p className="text-[10px] sm:text-[11px] leading-relaxed px-2 sm:px-6" style={{ color: SILVER.text }}>
                  أتم بنجاح <strong>المستوى الثالث (L3)</strong> من دورة السوروبان في الحساب الذهني،
                  وأثبت إتقانًا للمهارات الأساسية وفق معايير الأكاديمية الدولية.
                </p>
              ) : (
                <p className="text-[10px] sm:text-[11px] leading-relaxed px-2 sm:px-6" style={{ color: SILVER.text }}>
                  has successfully completed <strong>Level 3 (L3)</strong> of the Soroban Mental Arithmetic Course,
                  demonstrating mastery of the fundamental skills according to the International Academy standards.
                </p>
              )}

              {/* بطاقات النتيجة والمستوى */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-3 my-3 px-1 sm:px-2">
                <div
                  className="rounded-lg p-1.5 sm:p-2.5 text-center flex flex-col items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #FAFAFA 0%, #ECECEC 100%)',
                    border: '1.2px solid #A8A8A8',
                  }}
                >
                  <p className="text-[8px] sm:text-[9px] font-bold" style={{ color: SILVER.accent }}>
                    {isAr ? 'النتيجة التراكمية' : 'Final Score'}
                  </p>
                  <p className="font-black font-serif leading-none mt-0.5" style={{ fontSize: 'clamp(15px, 3.5vw, 22px)', color: SILVER.textTitle }} dir="ltr">
                    {isAr ? toArabicNumber(finalScore) : finalScore}
                  </p>
                  <p className="text-[8px] sm:text-[9px] mt-0.5" style={{ color: SILVER.accent }}>
                    {isAr ? `من ${toArabicNumber(100)} / 100` : 'out of 100'}
                  </p>
                  <div
                    className="mt-1 mx-auto rounded-full overflow-hidden"
                    style={{ height: '3px', background: 'rgba(128,128,128,0.2)', width: '80%' }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, finalScore)}%`,
                        background: 'linear-gradient(to right, #C0C0C0, #808080)',
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>

                <div
                  className="rounded-lg p-1.5 sm:p-2.5 text-center flex flex-col items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #F5F5F5 0%, #C8C8C8 200%)',
                    border: '1.2px solid #808080',
                  }}
                >
                  <p className="text-[8px] sm:text-[9px] font-bold" style={{ color: SILVER.accent }}>
                    {isAr ? 'التقدير' : 'Appreciation'}
                  </p>
                  {info.hasMedal ? (
                    <div className="-my-1">
                      <CertificateMedal level={info.level} size={38} />
                    </div>
                  ) : (
                    <div className="my-2 text-2xl">🎖️</div>
                  )}
                  <p className="font-black font-serif leading-none" style={{ fontSize: 'clamp(11px, 2.5vw, 15px)', color: SILVER.text }}>
                    {isAr ? info.appreciationAr : info.appreciationEn}
                  </p>
                </div>
              </div>

              {/* التذييل: الأختام */}
              <div className="grid grid-cols-2 gap-2 sm:gap-6 mt-3 mb-2 px-1 sm:px-4">
                <div className="text-center">
                  <div className="relative mx-auto mb-1" style={{ width: '44px', height: '44px' }}>
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #F0F0F0 0%, #A8A8A8 100%)',
                        border: '1.2px solid #606060',
                      }}
                    />
                    <div className="absolute rounded-full" style={{ inset: '4px', border: '0.8px dashed #606060', borderRadius: '50%' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ color: SILVER.text, fontSize: '6.5px', fontWeight: 'bold', lineHeight: 1.1, letterSpacing: '0.4px' }}>
                        ISA<br />★<br />SEAL
                      </span>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: '#808080', margin: '3px 8px' }} />
                  <p className="text-[9px] sm:text-xs font-bold" style={{ color: SILVER.text }}>
                    {isAr ? 'المشرف الأكاديمي' : 'Academic Supervisor'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="relative mx-auto mb-1" style={{ width: '44px', height: '44px' }}>
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #E8E8E8 0%, #909090 100%)',
                        border: '1.2px solid #505050',
                        boxShadow: '0 0 8px rgba(128,128,128,0.5)',
                      }}
                    />
                    <div className="absolute rounded-full" style={{ inset: '4px', border: '0.8px solid #505050', borderRadius: '50%' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ color: SILVER.text, fontSize: '7.5px', fontWeight: 'bold', lineHeight: 1.1, letterSpacing: '0.4px' }}>
                        ★<br />CEO
                      </span>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: '#808080', margin: '3px 8px' }} />
                  <p className="text-[9px] sm:text-xs font-black" style={{ color: SILVER.text }}>
                    {isAr ? 'مصطفى علي أكر' : 'Mustafa Ali Akr'}
                  </p>
                  <p className="text-[7px] sm:text-[9px]" style={{ color: SILVER.accent }}>
                    {isAr ? 'المدير والمؤسس' : 'Founder & Director'}
                  </p>
                </div>
              </div>

              {/* التاريخ */}
              <div
                className="flex items-center justify-center mt-2 px-1.5 py-1.5 rounded-md"
                style={{ background: 'rgba(128,128,128,0.08)', border: '1px solid rgba(128,128,128,0.3)' }}
              >
                <div className="text-center">
                  <p className="text-[7px] sm:text-[9px]" style={{ color: SILVER.accent }}>
                    {isAr ? 'تاريخ الإصدار' : 'Date of Issue'}
                  </p>
                  <p className="text-[8px] sm:text-[10px] font-bold" style={{ color: SILVER.text }} dir="ltr">
                    {isAr ? issueDateAr : issueDateEn}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>

      {/* أزرار التحكم */}
      <div className="max-w-4xl mx-auto flex gap-2 print:hidden mt-4 no-print">
        <button
          onClick={() => setEditingName(true)}
          className="flex-1 py-2.5 sm:py-3 rounded-2xl bg-white/10 hover:bg-white/20 font-bold flex items-center justify-center gap-2 text-xs sm:text-sm"
        >
          <Edit3 className="w-4 h-4" /> {isAr ? 'تعديل الاسم' : 'Edit Name'}
        </button>
        <button
          onClick={handlePrint}
          disabled={!studentName}
          className="flex-1 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-l from-gray-400 to-gray-600 font-bold flex items-center justify-center gap-2 disabled:opacity-40 text-xs sm:text-sm"
        >
          <Printer className="w-4 h-4 sm:w-5 sm:h-5" /> {isAr ? 'طباعة / PDF' : 'Print / PDF'}
        </button>
      </div>

      {onGoHome && (
        <button
          onClick={() => { playSound('click'); onGoHome(); }}
          className="max-w-4xl mx-auto w-full mt-2 py-2.5 sm:py-3 rounded-2xl bg-white/5 hover:bg-white/10 font-bold flex items-center justify-center gap-2 text-white/70 text-xs sm:text-sm print:hidden no-print"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5" /> {isAr ? 'الصفحة الرئيسية' : 'Home'}
        </button>
      )}

      <div className="max-w-4xl mx-auto mt-3 text-center text-[10px] sm:text-xs text-white/40 print:hidden no-print flex items-center justify-center gap-2">
        <Sparkles className="w-3 h-3" />
        <span>{isAr ? 'اضغط "طباعة / PDF" للحفظ' : 'Press "Print / PDF" to save'}</span>
      </div>
    </div>
  );
};

export default KidsCertificateScreen;