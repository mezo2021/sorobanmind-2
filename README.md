# 🧮 SorobanMind 2

أكاديمية السوروبان الدولية — الإصدار 2.0
منهج ياباني أصيل + محرك سوروبان حقيقي + تعليم تكيفي

## 🌐 الرابط
https://mezo2021.github.io/sorobanmind-2

## 🚀 التشغيل المحلي
\`\`\`bash
npm install
npm run dev
\`\`\`

## 📦 البناء والنشر
\`\`\`bash
npm run build
npm run deploy
\`\`\`

## 🧪 الاختبارات
\`\`\`bash
npm run test:run
\`\`\`

## 📂 البنية

\`\`\`
src/
├── curriculum/     ← بيانات المنهج
│   ├── types.ts
│   └── levels/
├── engine/         ← المحرك
│   ├── sorobanMoves.ts
│   ├── sorobanEngine.ts
│   ├── problemGenerator.ts
│   └── masteryTracker.ts
├── store/          ← Zustand
├── components/     ← الشاشات
└── hooks/          ← الصوت والأنزان
\`\`\`

## 📅 خارطة الطريق

- [x] المرحلة 1: الأساس + محرك السوروبان
- [ ] المرحلة 2: المنهج الكامل (L00 → L17)
- [ ] المرحلة 3: نقل الشاشات من v1
- [ ] المرحلة 4: التعليم التكيفي
- [ ] المرحلة 5: الأنزان والامتحانات
- [ ] المرحلة 6: الإطلاق

## 🎯 المطوّر
مصطفى علي أكر — [@mezo2021](https://github.com/mezo2021)
