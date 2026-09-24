// 🔍 للتشخيص — يظهر في الأعلى
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const el = document.createElement('div');
    el.textContent = `📦 BANK: ${SOROBAN_BANK.length} questions`;
    el.style.cssText = 'position:fixed;top:0;right:0;background:#fbbf24;color:#000;padding:4px 8px;font-weight:bold;z-index:99999;font-size:12px;';
    document.body.appendChild(el);
  }, 2000);
}