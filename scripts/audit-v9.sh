#!/usr/bin/env bash
# ================================================
# SorobanMind Audit v9 — Complement to v8
# Purpose: resolve gaps that v8 (AST) couldn't
# Pattern: read-only · no src/ modification
# ================================================

set +e

REPORT="audit-v9.txt"

# ────────────────────────────────────────────
# Header
# ────────────────────────────────────────────
{
  echo "═══════════════════════════════════════════════"
  echo "📊 SorobanMind Audit v9 — مكمّل لـ v8"
  echo "التاريخ: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "Commit: ${GITHUB_SHA:-local}"
  echo "المستودع: ${GITHUB_REPOSITORY:-local}"
  echo "Node: $(node --version 2>/dev/null || echo 'n/a')"
  echo "═══════════════════════════════════════════════"
} > "$REPORT"

# ════════════════════════════════════════════════
# القسم 1 — المتاجر الأربعة كاملة
# الهدف: استخراج أسماء مفاتيح persist الصريحة
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "🗄️ القسم 1: المتاجر الأربعة كاملة"
  echo "═══════════════════════════════════════════════"
} >> "$REPORT"

for f in \
  src/store/progressStore.ts \
  src/store/masteryBadgesStore.ts \
  src/store/numberStyleStore.ts \
  src/i18n/useTranslation.ts \
; do
  echo "" >> "$REPORT"
  echo "── FILE: $f ──" >> "$REPORT"
  if [ -f "$f" ]; then
    LINES=$(wc -l < "$f")
    echo "   (عدد الأسطر: $LINES)" >> "$REPORT"
    head -300 "$f" >> "$REPORT" 2>/dev/null
    if [ "$LINES" -gt 300 ]; then
      echo "" >> "$REPORT"
      echo "   ... [تم اقتصاص $((LINES - 300)) سطر]" >> "$REPORT"
    fi
  else
    echo "   (غير موجود)" >> "$REPORT"
  fi
done

# ════════════════════════════════════════════════
# القسم 2 — ملفات المفاتيح الديناميكية
# الهدف: كشف الـ80 مفتاحًا الديناميكي
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "🔀 القسم 2: ملفات المفاتيح الديناميكية"
  echo "═══════════════════════════════════════════════"
} >> "$REPORT"

for f in \
  src/components/games/highScoreStore.ts \
  src/utils/previewMode.ts \
  src/utils/skillsChecker.ts \
  src/utils/anzanBadges.ts \
  src/utils/audioAnzanBadges.ts \
  src/utils/badgeChecker.ts \
  src/hooks/useQuests.ts \
  src/data/srb/progress.ts \
  src/data/bank-v2/placement-engine.ts \
; do
  echo "" >> "$REPORT"
  echo "── FILE: $f ──" >> "$REPORT"
  if [ -f "$f" ]; then
    cat "$f" >> "$REPORT" 2>/dev/null
  else
    echo "   (غير موجود)" >> "$REPORT"
  fi
done

# ════════════════════════════════════════════════
# القسم 3 — أنماط المفاتيح الديناميكية
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "🔍 القسم 3: أنماط المفاتيح الديناميكية"
  echo "═══════════════════════════════════════════════"
  echo ""
  echo "-- setItem بمفتاح فيه \${ --"
} >> "$REPORT"
grep -rn 'localStorage\.setItem(' src --include="*.ts" --include="*.tsx" 2>/dev/null | grep '\${' >> "$REPORT" || echo "   (لا نتائج)" >> "$REPORT"

{
  echo ""
  echo "-- getItem بمفتاح فيه \${ --"
} >> "$REPORT"
grep -rn 'localStorage\.getItem(' src --include="*.ts" --include="*.tsx" 2>/dev/null | grep '\${' >> "$REPORT" || echo "   (لا نتائج)" >> "$REPORT"

{
  echo ""
  echo "-- removeItem بمفتاح فيه \${ --"
} >> "$REPORT"
grep -rn 'localStorage\.removeItem(' src --include="*.ts" --include="*.tsx" 2>/dev/null | grep '\${' >> "$REPORT" || echo "   (لا نتائج)" >> "$REPORT"

{
  echo ""
  echo "-- متغيرات المفاتيح المعرّفة --"
} >> "$REPORT"
grep -rnE "const[[:space:]]+[A-Za-z_]*[Kk]ey[[:space:]]*=" src --include="*.ts" --include="*.tsx" 2>/dev/null >> "$REPORT" || echo "   (لا نتائج)" >> "$REPORT"

# ════════════════════════════════════════════════
# القسم 4 — package.json + lockfile
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "📦 القسم 4: package.json + lockfile"
  echo "═══════════════════════════════════════════════"
  echo ""
  echo "-- package.json كامل --"
} >> "$REPORT"
if [ -f package.json ]; then
  cat package.json >> "$REPORT" 2>/dev/null
else
  echo "   (غير موجود)" >> "$REPORT"
fi

{
  echo ""
  echo "-- scripts في package.json --"
} >> "$REPORT"
if [ -f package.json ]; then
  node -e "const p=require('./package.json'); console.log(JSON.stringify(p.scripts||{}, null, 2))" >> "$REPORT" 2>/dev/null || echo "   (فشل التحليل)" >> "$REPORT"
fi

{
  echo ""
  echo "-- dependencies --"
} >> "$REPORT"
if [ -f package.json ]; then
  node -e "const p=require('./package.json'); console.log(JSON.stringify(p.dependencies||{}, null, 2))" >> "$REPORT" 2>/dev/null
fi

{
  echo ""
  echo "-- devDependencies --"
} >> "$REPORT"
if [ -f package.json ]; then
  node -e "const p=require('./package.json'); console.log(JSON.stringify(p.devDependencies||{}, null, 2))" >> "$REPORT" 2>/dev/null
fi

{
  echo ""
  echo "-- حالة lockfile --"
} >> "$REPORT"
if [ -f package-lock.json ]; then
  echo "   ✅ موجود — الحجم: $(wc -c < package-lock.json) بايت" >> "$REPORT"
else
  echo "   🔴 غير موجود" >> "$REPORT"
fi

{
  echo ""
  echo "-- .gitignore --"
} >> "$REPORT"
if [ -f .gitignore ]; then
  cat .gitignore >> "$REPORT" 2>/dev/null
  echo "" >> "$REPORT"
  echo "-- ذكر كلمة lock في .gitignore --" >> "$REPORT"
  grep -i "lock" .gitignore >> "$REPORT" 2>/dev/null || echo "   (لا ذكر)" >> "$REPORT"
else
  echo "   (لا يوجد .gitignore)" >> "$REPORT"
fi

# ════════════════════════════════════════════════
# القسم 5 — المفاتيح اليتيمة — قارئ/كاتب/حذف
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "🕳️ القسم 5: المفاتيح اليتيمة — قارئ/كاتب/حذف"
  echo "═══════════════════════════════════════════════"
} >> "$REPORT"

for key in \
  soroban_passed_level_tests \
  soroban_exam_result \
  soroban_placement_result \
  soroban_placement_last_attempt \
  soroban_placement_recommended \
  soroban_placement_weak_skills \
  soroban_kids_certificate_ready \
  soroban_section2_unlocked \
  soroban_child_name \
  soroban_companion \
  soroban_weak_skills_v2 \
; do
  echo "" >> "$REPORT"
  echo "── KEY: $key ──" >> "$REPORT"
  echo "   كتابة:" >> "$REPORT"
  grep -rn "setItem.*$key\|$key.*setItem" src --include="*.ts" --include="*.tsx" >> "$REPORT" 2>/dev/null || echo "     (لا كاتب ثابت)" >> "$REPORT"
  echo "   قراءة:" >> "$REPORT"
  grep -rn "getItem.*$key\|$key.*getItem" src --include="*.ts" --include="*.tsx" >> "$REPORT" 2>/dev/null || echo "     (لا قارئ ثابت)" >> "$REPORT"
  echo "   حذف:" >> "$REPORT"
  grep -rn "removeItem.*$key\|$key.*removeItem" src --include="*.ts" --include="*.tsx" >> "$REPORT" 2>/dev/null || echo "     (لا حذف)" >> "$REPORT"
done

# ════════════════════════════════════════════════
# القسم 6 — ملفات v8 الحاسمة الناقصة
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "📁 القسم 6: ملفات v8 الحاسمة"
  echo "═══════════════════════════════════════════════"
} >> "$REPORT"

for f in \
  src/i18n/index.ts \
  src/i18n/ar.ts \
  src/i18n/en.ts \
  src/utils/numberStyle.ts \
  src/utils/numerals.ts \
; do
  echo "" >> "$REPORT"
  echo "── FILE: $f ──" >> "$REPORT"
  if [ -f "$f" ]; then
    LINES=$(wc -l < "$f")
    echo "   (عدد الأسطر: $LINES)" >> "$REPORT"
    head -200 "$f" >> "$REPORT" 2>/dev/null
  else
    echo "   (غير موجود)" >> "$REPORT"
  fi
done

{
  echo ""
  echo "── FILE: src/data/index.ts (أول 120 سطرًا) ──"
} >> "$REPORT"
if [ -f src/data/index.ts ]; then
  head -120 src/data/index.ts >> "$REPORT" 2>/dev/null
fi

# ════════════════════════════════════════════════
# القسم 7 — من يستورد ماذا (خريطة الاستيراد)
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "🔗 القسم 7: خريطة الاستيراد"
  echo "═══════════════════════════════════════════════"
} >> "$REPORT"

for lib in \
  progressStore \
  masteryBadgesStore \
  numberStyleStore \
  useTranslation \
  i18n \
  engine \
  bank-v2 \
  bank-raw \
  bank-linked \
  bank-adapter \
  srb-adapter \
; do
  echo "" >> "$REPORT"
  echo "── يستورد $lib ──" >> "$REPORT"
  grep -rn "from.*$lib" src --include="*.ts" --include="*.tsx" >> "$REPORT" 2>/dev/null || echo "   (لا مستورد)" >> "$REPORT"
done

# ════════════════════════════════════════════════
# القسم 8 — هل المحرك مستدعى؟
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "🧠 القسم 8: هل المحرك مستدعى؟"
  echo "═══════════════════════════════════════════════"
} >> "$REPORT"

for name in \
  adaptiveEngine \
  masteryTracker \
  createAttempt \
  problemGenerator \
  recordAttempt \
  sorobanEngine \
  sorobanMoves \
; do
  echo "" >> "$REPORT"
  echo "── $name ──" >> "$REPORT"
  grep -rn "$name" src --include="*.ts" --include="*.tsx" >> "$REPORT" 2>/dev/null || echo "   (لا استدعاء)" >> "$REPORT"
done

# ════════════════════════════════════════════════
# القسم 9 — الشارات — من يمنح ماذا
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "🏅 القسم 9: الشارات — من يمنح ماذا"
  echo "═══════════════════════════════════════════════"
} >> "$REPORT"

for method in \
  awardBadge \
  setAnzanBadge \
  setAnzanAudioBadge \
  saveAnzanBadges \
  saveAudioAnzanBadges \
  getAnzanBadgeKey \
  getAudioAnzanBadgeKey \
  AdaptiveFeedback \
  BadgeModal \
  BADGES \
  useGameStats \
; do
  echo "" >> "$REPORT"
  echo "── $method ──" >> "$REPORT"
  grep -rn "$method" src --include="*.ts" --include="*.tsx" >> "$REPORT" 2>/dev/null || echo "   (لا استدعاء)" >> "$REPORT"
done

# ════════════════════════════════════════════════
# القسم 10 — scripts وفحوصات المشروع
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "⚙️ القسم 10: scripts وفحوصات المشروع"
  echo "═══════════════════════════════════════════════"
  echo ""
  echo "-- هل يوجد typecheck؟ --"
} >> "$REPORT"
if grep -q '"typecheck"' package.json 2>/dev/null; then
  echo "   ✅ موجود" >> "$REPORT"
else
  echo "   🔴 غير موجود" >> "$REPORT"
fi

{
  echo ""
  echo "-- هل يوجد build؟ --"
} >> "$REPORT"
if grep -q '"build"' package.json 2>/dev/null; then
  echo "   ✅ موجود" >> "$REPORT"
else
  echo "   🔴 غير موجود" >> "$REPORT"
fi

{
  echo ""
  echo "-- هل يوجد lint؟ --"
} >> "$REPORT"
if grep -q '"lint"' package.json 2>/dev/null; then
  echo "   ✅ موجود" >> "$REPORT"
else
  echo "   🔴 غير موجود" >> "$REPORT"
fi

# ════════════════════════════════════════════════
# Footer
# ════════════════════════════════════════════════
{
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "✅ نهاية تقرير v9 — 10 أقسام"
  echo "═══════════════════════════════════════════════"
} >> "$REPORT"

echo "تم إنشاء التقرير: $REPORT ($(wc -l < "$REPORT") سطر)"