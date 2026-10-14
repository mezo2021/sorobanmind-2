// scripts/lazyify.cjs
// يحوّل استيرادات App.tsx الساكنة إلى React.lazy
// ويلف <App /> بـ Suspense في main.tsx
// لا يلمس: hooks · stores · types · helper functions · Header

const fs = require('fs');

const SKIP_NAMES = new Set(['Header']);
const SKIP_PATHS = new Set([
  './curriculum/lessons',
  './components/flash/flashData',
]);

const appPath = 'src/App.tsx';
let app = fs.readFileSync(appPath, 'utf8');

const converted = [];
const skipped = [];

// 1) default imports من ./screens/
app = app.replace(
  /^import\s+(\w+)\s+from\s+['"](\.\/screens\/[^'"]+)['"];?[ \t\r]*$/gm,
  (m, name, path) => {
    if (SKIP_NAMES.has(name) || SKIP_PATHS.has(path)) {
      skipped.push(`${name} (${path})`);
      return m;
    }
    converted.push(name);
    return `const ${name} = lazy(() => import('${path}'));`;
  }
);

// 2) single named import من ./components/
app = app.replace(
  /^import\s+\{\s*(\w+)\s*\}\s+from\s+['"](\.\/components\/[^'"]+)['"];?[ \t\r]*$/gm,
  (m, name, path) => {
    if (SKIP_NAMES.has(name) || SKIP_PATHS.has(path)) {
      skipped.push(`${name} (${path})`);
      return m;
    }
    converted.push(name);
    return `const ${name} = lazy(() => import('${path}').then(m => ({ default: m.${name} })));`;
  }
);

if (converted.length === 0) {
  console.error('ERROR: No imports matched — aborting');
  process.exit(1);
}

app = `import { lazy } from 'react';\n` + app;
fs.writeFileSync(appPath, app);

console.log(`Converted ${converted.length} imports to lazy:`);
converted.forEach(n => console.log('  ✓ ' + n));
if (skipped.length) {
  console.log(`\nSkipped ${skipped.length}:`);
  skipped.forEach(n => console.log('  ○ ' + n));
}

// main.tsx — Suspense
const mainPath = 'src/main.tsx';
let main = fs.readFileSync(mainPath, 'utf8');

if (!/<App\s*\/>/.test(main)) {
  console.error('ERROR: <App /> not found in main.tsx');
  process.exit(1);
}

const fallback = '<div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",direction:"rtl",fontSize:"1.2rem",color:"#666"}}>جارٍ التحميل…</div>';
main = main.replace(/<App\s*\/>/, `<Suspense fallback={${fallback}}><App /></Suspense>`);
main = `import { Suspense } from 'react';\n` + main;
fs.writeFileSync(mainPath, main);

console.log('\nmain.tsx wrapped with Suspense');
console.log('=== Done ===');