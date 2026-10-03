// src/screens/CertificateScreen.tsx
// شهادة الإتمام الدولية — القسم الثاني (ذهبية · لغة واحدة · قابلة للطباعة على أندرويد)

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Printer, Award, Home, Edit3, Sparkles, Languages } from 'lucide-react';
import CertificateLogo from '@/components/CertificateLogo';
import CertificateMedal from '@/components/CertificateMedal';
import {
  getCertificateData,
  getLevelColors,
  type CertificateData,
} from '@/utils/certificateGenerator';

type Lang = 'ar' | 'en';

function toArabicNumber(value: number | string): string {
  return String(value).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

interface Props {
  onBack: () => void;
  playSound: (type: 'click' | 'success' | 'whoosh' | 'levelup') => void;
  onGoHome?: () => void;
}

const CertificateScreen: React.FC<Props> = ({ onBack, playSound, onGoHome }) => {
  const [exam1Score, setExam1Score] = useState(0);
  const [exam2Score, setExam2Score] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    try {
      const score1 = localStorage.getItem('soroban_exam1_score');
      if (score1) setExam1Score(parseFloat(score1));
    } catch { /* ignore */ }

    try {
      const score2 = localStorage.getItem('soroban_exam2_score');
      if (score2) setExam2Score(parseFloat(score2));
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

  const data: CertificateData = getCertificateData(studentName, exam1Score, exam2Score);
  const colors = getLevelColors(data.level);
  const isAr = lang === 'ar';

  const handlePrint = () => {
    if (!studentName || studentName === 'اكتب اسمك الثلاثي') {
      setEditingName(true);
      return;
    }
    playSound('click');
    setTimeout(() => window.print(), 300);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 text-white p-2 sm:p-6 pb-24 cert-root"
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
          <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-amber-300 to-purple-400 bg-clip-text text-transparent">
            {isAr ? 'شهادة الإتمام الدولية' : 'International Certificate of Completion'}
          </h1>
        </div>
        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
      </div>

      {/* تبديل اللغة */}
      <div className="max-w-4xl mx-auto mb-3 flex justify-center no-print">
        <div className="inline-flex bg-white/10 rounded-2xl p-1 gap-1">
          <button
            onClick={() => { playSound('click'); setLang('ar'); }}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition ${
              isAr ? 'bg-gradient-to-l from-amber-500 to-amber-700 text-white shadow' : 'text-white/60'
            }`}
          >
            <Languages className="w-3.5 h-3.5" /> عربي
          </button>
          <button
            onClick={() => { playSound('click'); setLang('en'); }}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition ${
              !isAr ? 'bg-gradient-to-l from-amber-500 to-amber-700 text-white shadow' : 'text-white/60'
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
          className="bg-amber-500/15 border border-amber-400/40 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 max-w-4xl mx-auto no-print"
        >
          <p className="text-xs sm:text-sm text-amber-100 font-body mb-2 sm:mb-3">
            {isAr ? '📝 اكتب اسمك الثلاثي ليظهر على الشهادة' : '📝 Write your full name to appear on the certificate'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder={isAr ? 'اكتب اسمك الثلاثي' : 'Enter your full name'}
              className="flex-1 bg-slate-800 border-2 border-amber-500/50 rounded-xl px-3 sm:px-4 py-2 text-white text-sm outline-none focus:border-amber-400"
              dir={isAr ? 'rtl' : 'ltr'}
            />
            <button
              onClick={handleSaveName}
              disabled={!tempName.trim()}
              className="px-3 sm:px-4 py-2 bg-gradient-to-l from-amber-500 to-amber-600 rounded-xl font-bold text-sm disabled:opacity-40"
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
            background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 25%, #B8860B 50%, #FFD700 75%, #8B6914 100%)',
            padding: 'clamp(3px, 1vw, 8px)',
            borderRadius: '14px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 24px rgba(255,215,0,0.25)',
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at center, #FDF8E7 0%, #F5EBD0 50%, #EFE1BC 100%)',
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
              style={{ top: 6, left: 6, right: 6, bottom: 6, border: '1.5px solid #B8860B', borderRadius: '8px' }}
            />
            <div
              className="absolute pointer-events-none"
              style={{ top: 10, left: 10, right: 10, bottom: 10, border: '0.8px solid #DAA520', borderRadius: '6px' }}
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
                <path d="M 2 2 L 20 2 L 20 6 L 6 6 L 6 20 L 2 20 Z" fill="#B8860B" />
                <circle cx="10" cy="10" r="2.5" fill="#FFD700" stroke="#8B6914" strokeWidth="0.5" />
                <circle cx="4" cy="4" r="1.5" fill="#FFD700" />
                <path d="M 20 2 L 30 2" stroke="#B8860B" strokeWidth="1" />
                <path d="M 2 20 L 2 30" stroke="#B8860B" strokeWidth="1" />
              </svg>
            ))}

            {/* ───── المحتوى ───── */}
            <div className="relative z-10 text-center" style={{ color: '#2C1A0E' }}>

              {/* الشعار */}
              <div className="flex justify-center mb-1">
                <CertificateLogo size={80} />
              </div>

              {/* اسم الأكاديمية */}
              {isAr ? (
                <>
                  <p className="font-serif font-bold text-[9px] sm:text-[10px] tracking-widest" style={{ color: '#7B5D0A' }}>
                    INTERNATIONAL SOROBAN ACADEMY
                  </p>
                  <p className="font-serif font-black text-xs sm:text-sm mt-0.5" style={{ color: '#5D3A1A' }}>
                    أكاديمية السوروبان الدولية
                  </p>
                </>
              ) : (
                <>
                  <p className="font-serif font-black text-xs sm:text-sm" style={{ color: '#5D3A1A' }}>
                    INTERNATIONAL SOROBAN ACADEMY
                  </p>
                  <p className="font-serif font-bold text-[9px] sm:text-[10px] tracking-widest mt-0.5" style={{ color: '#7B5D0A' }} dir="rtl">
                    أكاديمية السوروبان الدولية
                  </p>
                </>
              )}

              {/* فاصل */}
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to right, transparent, #B8860B, transparent)' }} />
                <span style={{ color: '#B8860B', fontSize: '12px' }}>❖</span>
                <div className="h-px flex-1 max-w-[80px]" style={{ background: 'linear-gradient(to left, transparent, #B8860B, transparent)' }} />
              </div>

              {/* العنوان */}
              <h1
                className="font-serif font-black leading-tight"
                style={{
                  fontSize: 'clamp(18px, 4.5vw, 28px)',
                  color: '#8B6914',
                  textShadow: '1px 1px 0 #FFD700, 1.5px 1.5px 2px rgba(0,0,0,0.15)',
                }}
              >
                {isAr ? 'شهادة إتمام دولية' : 'International Certificate of Completion'}
              </h1>

              {/* الدورة */}
              <p className="font-bold text-[11px] sm:text-sm mt-1.5" style={{ color: '#5D3A1A' }}>
                {isAr
                  ? 'دورة السوروبان الدولية في الحساب الذهني'
                  : 'International Soroban Mental Arithmetic Course'}
              </p>

              {/* شريط المستوى */}
              <div
                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.primary} 100%)`,
                  border: `1.2px solid ${colors.dark}`,
                  boxShadow: `0 2px 8px ${colors.primary}55`,
                }}
              >
                <CertificateMedal level={data.level} size={26} />
                <div className="flex flex-col items-start">
                  <span className="font-black leading-tight" style={{ color: colors.text, fontSize: '11px' }}>
                    {isAr ? `المستوى ${data.levelAr}` : `${data.levelEn} Level`}
                  </span>
                  <span className="font-bold leading-tight" style={{ color: colors.dark, fontSize: '7px', letterSpacing: '0.8px' }}>
                    {isAr ? data.levelEn.toUpperCase() + ' LEVEL' : data.levelAr}
                  </span>
                </div>
              </div>

              {/* فاصل */}
              <div className="flex items-center justify-center gap-2 my-2">
                <div className="h-px flex-1 max-w-[140px]" style={{ background: 'linear-gradient(to right, transparent, #DAA520, transparent)' }} />
                <span style={{ color: '#DAA520', fontSize: '10px' }}>✦</span>
                <div className="h-px flex-1 max-w-[140px]" style={{ background: 'linear-gradient(to left, transparent, #DAA520, transparent)' }} />
              </div>

              {/* التقديم */}
              <p className="text-[10px] sm:text-xs" style={{ color: '#5D3A1A' }}>
                {isAr ? 'تشهد الأكاديمية بأن الطالب/ة المتميز/ة' : 'The academy certifies that the distinguished student'}
              </p>

              {/* اسم الطالب */}
              <p
                className="font-serif font-black my-1.5"
                style={{
                  fontSize: 'clamp(16px, 4vw, 26px)',
                  color: '#8B6914',
                  textShadow: '1px 1px 0 #FFF8DC',
                }}
              >
                {data.studentName}
              </p>

              <div className="mx-auto mb-2" style={{ width: '55%', maxWidth: '260px', height: '1.2px', background: 'linear-gradient(to right, transparent, #B8860B, transparent)' }} />

              {/* نص الإتمام */}
              {isAr ? (
                <p className="text-[10px] sm:text-[11px] leading-relaxed px-2 sm:px-6" style={{ color: '#5D3A1A' }}>
                  قد أكمل/ت بنجاح متطلبات الدورة الدولية للحساب الذهني بالسوروبان،
                  وأثبت/ت إتقان/اً للمهارات الأساسية والمتقدمة وفق معايير الأكاديمية الدولية.
                </p>
              ) : (
                <p className="text-[10px] sm:text-[11px] leading-relaxed px-2 sm:px-6" style={{ color: '#5D3A1A' }}>
                  has successfully completed the requirements of the International Soroban Mental Arithmetic Course,
                  demonstrating mastery of the fundamental and advanced skills according to the International Academy standards.
                </p>
              )}

              {/* بطاقات النتيجة والمستوى */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-3 my-3 px-1 sm:px-2">
                <div
                  className="rounded-lg p-1.5 sm:p-2.5 text-center flex flex-col items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #FFF8DC 0%, #F5EBD0 100%)',
                    border: '1.2px solid #DAA520',
                  }}
                >
                  <p className="text-[8px] sm:text-[9px] font-bold" style={{ color: '#7B5D0A' }}>
                    {isAr ? 'الدرجة النهائية' : 'Final Score'}
                  </p>
                  <p className="font-black font-serif leading-none mt-0.5" style={{ fontSize: 'clamp(15px, 3.5vw, 22px)', color: '#8B6914' }} dir="ltr">
                    {isAr ? toArabicNumber(data.averageScore.toFixed(1)) : data.averageScore.toFixed(1)}
                  </p>
                  <p className="text-[8px] sm:text-[9px] mt-0.5" style={{ color: '#7B5D0A' }}>
                    {isAr ? `من ${toArabicNumber(100)} / 100` : 'out of 100'}
                  </p>
                  <div
                    className="mt-1 mx-auto rounded-full overflow-hidden"
                    style={{ height: '3px', background: 'rgba(184,134,11,0.2)', width: '80%' }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, data.averageScore)}%`,
                        background: `linear-gradient(to right, ${colors.primary}, ${colors.dark})`,
                        borderRadius: '999px',
                      }}
                    />
                  </div>
                </div>

                <div
                  className="rounded-lg p-1.5 sm:p-2.5 text-center flex flex-col items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${colors.light} 0%, ${colors.primary} 200%)`,
                    border: `1.2px solid ${colors.dark}`,
                  }}
                >
                  <p className="text-[8px] sm:text-[9px] font-bold" style={{ color: colors.text }}>
                    {isAr ? 'التقدير' : 'Appreciation'}
                  </p>
                  <div className="-my-1">
                    <CertificateMedal level={data.level} size={38} />
                  </div>
                  <p className="font-black font-serif leading-none" style={{ fontSize: 'clamp(11px, 2.5vw, 15px)', color: colors.text }}>
                    {isAr ? data.appreciation : data.levelEn}
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
                        background: 'radial-gradient(circle, #F5EBD0 0%, #DAA520 100%)',
                        border: '1.2px solid #8B6914',
                      }}
                    />
                    <div className="absolute rounded-full" style={{ inset: '4px', border: '0.8px dashed #8B6914', borderRadius: '50%' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ color: '#5D3A1A', fontSize: '6.5px', fontWeight: 'bold', lineHeight: 1.1, letterSpacing: '0.4px' }}>
                        ISA<br />★<br />SEAL
                      </span>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: '#B8860B', margin: '3px 8px' }} />
                  <p className="text-[9px] sm:text-xs font-bold" style={{ color: '#5D3A1A' }}>
                    {isAr ? 'المشرف الأكاديمي' : 'Academic Supervisor'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="relative mx-auto mb-1" style={{ width: '44px', height: '44px' }}>
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, #FFD700 0%, #B8860B 100%)',
                        border: '1.2px solid #5D3A1A',
                        boxShadow: '0 0 8px rgba(184,134,11,0.5)',
                      }}
                    />
                    <div className="absolute rounded-full" style={{ inset: '4px', border: '0.8px solid #5D3A1A', borderRadius: '50%' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ color: '#2C1A0E', fontSize: '7.5px', fontWeight: 'bold', lineHeight: 1.1, letterSpacing: '0.4px' }}>
                        ★<br />CEO
                      </span>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: '#B8860B', margin: '3px 8px' }} />
                  <p className="text-[9px] sm:text-xs font-black" style={{ color: '#5D3A1A' }}>
                    {isAr ? 'مصطفى علي أكر' : 'Mustafa Ali Akr'}
                  </p>
                  <p className="text-[7px] sm:text-[9px]" style={{ color: '#7B5D0A' }}>
                    {isAr ? 'المدير والمؤسس' : 'Founder & Director'}
                  </p>
                </div>
              </div>

              {/* رقم الشهادة + QR + التواريخ */}
              <div
                className="flex items-center justify-between gap-1.5 mt-2 px-1.5 py-1.5 rounded-md"
                style={{ background: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.3)' }}
              >
                <div className={`${isAr ? 'text-right' : 'text-left'} flex-1 min-w-0`}>
                  <p className="text-[7px] sm:text-[9px]" style={{ color: '#7B5D0A' }}>
                    {isAr ? 'رقم الشهادة' : 'Certificate No.'}
                  </p>
                  <p className="text-[8px] sm:text-[10px] font-bold truncate" style={{ color: '#5D3A1A' }} dir="ltr">
                    {data.certificateNumber}
                  </p>
                </div>

                <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
                  <div
                    className="p-0.5 rounded"
                    style={{ background: '#FDF8E7', border: '1px solid rgba(184,134,11,0.4)' }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(data.verificationUrl)}&bgcolor=FDF8E7&color=5D3A1A&margin=2`}
                      alt="QR Code"
                      width={34}
                      height={34}
                      style={{ display: 'block' }}
                      loading="lazy"
                    />
                  </div>
                  <p className="text-[6px] mt-0.5" style={{ color: '#7B5D0A' }}>
                    {isAr ? 'للتحقق' : 'Verify'}
                  </p>
                </div>

                <div className={`${isAr ? 'text-left' : 'text-right'} flex-1 min-w-0`}>
                  <p className="text-[7px] sm:text-[9px]" style={{ color: '#7B5D0A' }}>
                    {isAr ? 'تاريخ الإصدار' : 'Date of Issue'}
                  </p>
                  <p className="text-[8px] sm:text-[10px] font-bold" style={{ color: '#5D3A1A' }} dir="ltr">
                    {data.issueDate}
                  </p>
                  {isAr && (
                    <p className="text-[7px] sm:text-[9px] font-bold mt-0.5" style={{ color: '#7B5D0A' }} dir="ltr">
                      {data.issueDateHijri}
                    </p>
                  )}
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
          disabled={!studentName || studentName === 'اكتب اسمك الثلاثي'}
          className="flex-1 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-l from-amber-500 to-amber-600 font-bold flex items-center justify-center gap-2 disabled:opacity-40 text-xs sm:text-sm"
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

export default CertificateScreen;