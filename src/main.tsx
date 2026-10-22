import { Component, Suspense, type ReactNode } from 'react';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ═══ Cleanup: dead keys (one-time, v11) ═══
[
  'soroban_practice_stats',
  'soroban_anzan_stats',
  'sorobanmind-stats',
  'soroban_exam_result',
  'soroban_anzan_badges',
  'soroban_anzan_audio_badges',
  'soroban_passed_level_tests',   // 🆕 v11 — لا قارئ ولا كاتب بعد إصلاحات 2026-10-20
  'soroban_weak_skills_v2',       // 🆕 v11 — لا قارئ ولا كاتب بعد إصلاحات 2026-10-20
  // 🆕 [m3-d] مفاتيح توقفنا عن الكتابة فيها بعد تنظيف App.tsx
  'soroban_completed_levels',
  'soroban_placement_result',
  'soroban_section2_unlocked',
].forEach((k) => {
  try {
    localStorage.removeItem(k);
  } catch {
    /* ignore */
  }
});

// إعادة تحميل تلقائية مرة واحدة إذا فشل جلب جزء بعد نشر جديد
window.addEventListener('vite:preloadError', () => {
  if (!sessionStorage.getItem('chunk-reload')) {
    sessionStorage.setItem('chunk-reload', '1');
    window.location.reload();
  }
});
window.addEventListener('load', () => {
  setTimeout(() => sessionStorage.removeItem('chunk-reload'), 5000);
});

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div dir="rtl" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 16, background: '#0b1020', color: '#fff', textAlign: 'center' }}>
        <p>حدث خطأ أثناء تحميل الشاشة</p>
        <button onClick={() => window.location.reload()} style={{ padding: '8px 16px', borderRadius: 12, background: '#7c3aed', color: '#fff' }}>إعادة التحميل</button>
        <pre dir="ltr" style={{ fontSize: 11, opacity: 0.6, whiteSpace: 'pre-wrap' }}>{String(this.state.error.message)}</pre>
      </div>
    );
  }
}

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",direction:"rtl",fontSize:"1.2rem",color:"#fbbf24"}}>🧮 جاري التحميل...</div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>,
);