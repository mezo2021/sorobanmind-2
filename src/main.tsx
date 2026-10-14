import { Suspense } from 'react';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
).render(
  <React.StrictMode>
    <Suspense fallback={<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",direction:"rtl",fontSize:"1.2rem",color:"#666"}}>جارٍ التحميل…</div>}><App /></Suspense>
  </React.StrictMode>,
);