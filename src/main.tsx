import { Suspense } from 'react';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ═══ Cleanup: dead keys (one-time, v10) ═══
// تُنظَّف مفاتيح قديمة من إصدارات سابقة — لا تُستخدم بعد v10
[
  'soroban_practice_stats',
  'soroban_anzan_stats',
  'sorobanmind-stats',
  'soroban_exam_result',
  'soroban_anzan_badges',
  'soroban_anzan_audio_badges',
].forEach((k) => {
  try {
    localStorage.removeItem(k);
  } catch {
    /* ignore */
  }
});

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
).render(
  <React.StrictMode>
    <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",direction:"rtl",fontSize:"1.2rem",color:"#666"}}>جارٍ التحميل…</div>}><App /></Suspense>
  </React.StrictMode>,
);