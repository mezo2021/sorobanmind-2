
# 🧮 SorobanMind v2

### International Soroban Academy

**Learn Japanese Soroban in Arabic — For Kids & Adults**

Offline · No Ads · 100% Private

---

## 🌟 Pitch in a Sentence

> Teaching Japanese Soroban (Takashi Kojima curriculum) in Arabic — for kids and adults — offline, ad-free, with complete privacy.

---

## 🏆 Milestone 2026-10-17 — Soroban2D5 Upgrade

> ✅ **Interactive Abacus upgrade completed** after a full day of continuous development.

| # | Achievement | Impact |
|---|---|---|
| 1 | **6 full-size columns** | Bead sizes increased to 34px (sm) / 44px (md) / 56px (lg) instead of 28px — easier tapping during practice |
| 2 | **New height dimensions** | Adjusted to 360 / 420 / 500 (up from 350 / 410 / 490) |
| 3 | **Wider spacing in ocean/barbie** | `beadGap = 12` instead of 10 — well-spaced, highly visible beads |
| 4 | **Larger classic scale** | `beadSizeBoost = 1.12` (+12%) — fuller, realistic wooden beads |
| 5 | **13 columns without scrolling** | All columns fit on small screens (390px) via smart automatic scaling |
| 6 | **Functional landscape mode** | `heightFactor = 0.34` at 7+ columns — complete abacus visibility when rotating screen |
| 7 | **Flash mode intact** | Practice mode (multiplication/division) remained completely unaffected |

**Modified Files:**
- `src/components/soroban2d5/Soroban2D5.tsx`
- `src/components/soroban2d5/Rod2D5.tsx`

---

## ✨ Features

| Feature | Description |
|--------|-------|
| 🌍 **Arabic Application** | Complete native RTL support |
| 📚 **Authentic Japanese Curriculum** | Takashi Kojima + Japan Soroban Association standards |
| 🎯 **Adaptive Learning** | Active `AdaptiveFeedback` · Isolated engine reserved for next phase |
| 🧮 **Interactive Soroban 2D5** | 3 themes (Wooden, Laser, Barbie) · Landscape mode · Full interaction |
| 👥 **4 Companions** | Sham, Rayan, Jude, and Bana |
| 🎮 **Complete Games City** | 5 educational games |
| 🏅 **Comprehensive Badge System** | Mastery, Visual, Auditory, Level, and Legend badges |
| 🎓 **Certificates** | Kids (L3) · Adults (L7) |
| 📶 **Offline-First** | PWA · Works offline |
| 🔒 **Complete Privacy** | All data stored strictly on the user's local device |
| 🚫 **Ad-Free** | Forever |
| 👁️ **Preview Mode** | For developers/inspectors · Zero impact on child's data |

---

## 🏗️ Tech Stack

| Component | Technology |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5.5 |
| Styling | Tailwind CSS 3 |
| Animation | framer-motion 11 |
| Icons | lucide-react |
| State Management | zustand 4 + persist |
| Deployment | GitHub Pages |

---

## 👥 Age Groups

### 🧒 Young Champions (Ages 5–12)

- **Levels:** L0 → L3
- **Content:** Foundations · Numbers · Addition · Subtraction · Multiplication · Division
- **Certificate:** Silver Certificate (L3)

### 🧑 Adult Champions (Ages 13+)

- **Levels:** L4 → L7
- **Content:** Complex Chains · Advanced Multiplication & Division · Decimals · Square Roots
- **Certificate:** Gold Certificate (L7)

---

## 📚 Curriculum — 8 Levels · 15 Lessons · 51 Skills

| Level | Title | Lessons | Status |
|---|---|---|---|
| **L0** | Preparatory | intro · S01 · S02 | ✅ |
| **L1** | Addition & Subtraction | S03 · S04 | ✅ |
| **L2** | Multiplication | S05 · S06 | 🟡 |
| **L3** | Division | S07 · S08 | 🟡 |
| **L4** | Addition & Subtraction Chains | S09 · S10 | ⏳ |
| **L5** | Advanced Multiplication & Division | S11 · S12 | ⏳ |
| **L6** | Decimals | S13 · S14 | ⏳ |
| **L7** | Square Roots | S15 | ⏳ |

---

## 🎯 Level Structure Workflow


📖 Learn (Watch + Try)
↓
✏️ Practice (≥ 70%)
↓
🧠 Standard Visual Anzan (≥ 70%)
⚡ Flash Anzan (≥ 70%)
↓
🎧 Auditory Anzan (≥ 70%)
↓
🎓 Level Exam (≥ 70% · 10 Questions)
↓
📊 Cumulative Score → 🏅 Certificate → 📖 Next Level

### 🧮 Cumulative Grading Formula


Final Score = 70% × Exam + 10% × Practice + 5% × Standard Visual Anzan
+ 5% × Flash Anzan + 10% × Auditory Anzan = 100%

---

## 🎮 Games City — 5 Games

| # | Game | ID | Duration | Hero Companion |
|---|---|---|---|---|
| 1 | 🛸 Flying Abacus | `flying-abacus` | 60s | The Chosen One |
| 2 | 🔍 Number Detective | `detective` | 45s | Jude |
| 3 | 🥋 Soroban Dojo | `friends` | 90s | Sham |
| 4 | 🏴‍☠️ Pirate Race | `pirate-race` | 90s | Rayan |
| 5 | 🏝️ Sorobania Island | `sorobania-island` | 60s | Bana |

### 💰 Economy System

| Balance Type | Purpose | Cap |
|---|---|---|
| `totalXP` | Level progression & reporting | No limit |
| `ticketXP` | Purchasing game tickets | 50 XP |
| `tickets` | Playtime balance | 5 Tickets |

**Loop:** Lesson → Earn XP → Get Ticket → Play Game → Earn XP → Next Lesson...

📖 For full details: see `GAMES_CITY.md`.

---

## 🏦 SRB Question Banks

| Bank | Path | Size | Role | Status |
|---|---|---:|---|---|
| **Bank A** | `srb/questions/` | 275 Questions | Formative Assessment | ✅ |
| **Bank B** | `srb/exam/` | 666 Questions | Summative Evaluation | ✅ |

**Bank B Distribution:**
L0=43 · L1=228 · L2-L5=81×4 · L6=51 · L7=28

📖 For details: see `STATE_OF_THE_PROJECT.md`.

---

## 📐 Decimal Calculation Rules


 * Integer (result % 1 === 0)       → Displayed as-is
 * Decimal (3.8)                     → Displayed as 3.80
 * Input without decimal point (380) → Parsed as 380
 * Rod count: Integers = result digits · Decimals = integer digits + 2
 * Comparison tolerance: Math.round(result * 100)
 * Division: Exact division only (no remainder)

✅ Implemented in: CE1 · CE2 · PT · Practice · Anzan · Audio.

---

## 🏗️ Project Architecture


src/
├── App.tsx                  ← Main entry gateway
├── types.ts
├── i18n/                    ← Localization (LangState)
├── curriculum/              ← Textual lesson content (L0 · L1)
├── engine/                  ← Calculation engine (5 files · isolated by decision)
├── data/
│   ├── srb/                 ← Unified SRB System
│   │   ├── questions/       ← Bank A
│   │   ├── exam/            ← Bank B
│   │   ├── types.ts · generateId.ts
│   │   ├── curriculum.ts · modules.ts
│   │   ├── sessionBuilder.ts
│   │   ├── progress.ts · remediation.ts
│   ├── bank-v2/             ← Legacy bank (isolated)
│   ├── bank-raw/            ← Raw legacy bank (isolated)
│   └── srb-adapter.ts
├── store/
│   ├── progressStore.ts     ← Project core state (v9)
│   ├── masteryBadgesStore.ts
│   └── numberStyleStore.ts
├── utils/                   ← Helpers and utilities
├── hooks/                   ← Custom React hooks (7)
├── components/
│   ├── games/               ← 5 mini-games
│   ├── flash/               ← Flash lesson modules
│   ├── soroban2d5/          ← Interactive abacus (upgraded 2026-10-17)
│   └── avatars/
└── screens/                 ← 22 application screens

---

## 🎓 Educational System Tracks

| Stage | Path | Status |
|---|---|---|
| **Kids Track** | L0–L3 | 🟡 L2–L3 under construction |
| **Adult Track** | L4–L7 | ⏳ Pending |
| **CE1** | Kids Section Comprehensive Exam | ✅ |
| **CE2** | Adults Section Comprehensive Exam | ✅ |
| **PT** | Placement Test | ✅ |

---

## 🔑 Parent Dashboard

- 📊 Track learning progress
- 🎯 Monitor 4 core cognitive skills: Focus, Visualization, Observation, Auditory Memory
- 🏅 Visual & Auditory Anzan Badges
- ⚡ "Soroban Legend" Card unlock (upon reaching 8/8)
- 📈 Weekly analytics
- 🩺 Remedial sessions log (Last 7 days)
- ⚙️ Administrative Actions: Preview, Backup, Restore, Reset

### 🔒 Privacy Guarantees

- ✅ Data stored 100% locally on device
- ✅ Zero server transmissions
- ✅ No tracking · No ads · No subscriptions

---

## 👁️ Preview Mode Flow


GuardianDashboard → 👁️ Preview Mode
↓
Unlocks all content (Levels · Exams · Certificates)
· Displays mock benchmark scores
↓
Real child progress data remains 100% untouched

**Utility File:** `src/utils/previewMode.ts`

---

## 📋 Current System Status

### ✅ Operational

| Component | Status |
|---|---|
| Bank A (275 questions) | ✅ |
| Bank B (666 questions) | ✅ |
| Curriculum (8 levels · 15 lessons · 51 skills) | ✅ |
| Introductory Lesson (L0-intro) | ✅ |
| Practice · Anzan (Visual · Flash · Audio) | ✅ |
| Level Exams L0–L7 | ✅ |
| Level Achievement Badges (3 stages) | ✅ |
| Level Map Roadmap | ✅ |
| Legend Card (8/8) | ✅ |
| `master_chains` + `master_chains_audio` | ✅ |
| `AdaptiveFeedback` | ✅ |
| Remedial Sessions | ✅ |
| L1 unlocks naturally after L0 | ✅ |
| Preview Mode | ✅ |
| System Backup & Restore (11 keys) | ✅ |
| All 5 Mini-Games | ✅ |
| Ticket Economy (50 XP · 5 Tickets) | ✅ |
| Certificates (Kids & Adults) | ✅ |
| **Upgraded Soroban2D5 Component (2026-10-17)** | ✅ |

### 🟡 Deferred / In Queue

| Component | Reason |
|---|---|
| L2–L7 Detailed Lessons | Under development |
| `useQuests` | Reads from deprecated storage keys |
| `adaptiveEngine` | Deliberately isolated |
| BADGES-8 | Isolated |
| Red halo glow on reveal | Future UI enhancement |
| Unifying the three abacus variants | Post-curriculum completion |

### 📖 Documentation References

- **`STATE_OF_THE_PROJECT.md`** — Comprehensive project overview
- **`REPAIR_PLAN.md`** — Refactoring & maintenance roadmap
- **`GAMES_CITY.md`** — Detailed games specification
- **`SESSION_2026-10-13.md`** — Previous dev session log

---

## ⚠️ Engineering Guidelines


 * Do not delete legacy code before the alternative is proven working.
 * Do not hook legacy paths into the main line during migration.
 * Do not rewrite the adaptive engine unnecessarily.
 * "Imported" does NOT equal "Working".
 * Never start from scratch.
 * Do not rebuild progressStore.ts.
 * Actual active code is the single source of truth — not the README.
 * RTL for Arabic layout · LTR for English layout.
 * Before deleting any code: grep must prove zero imports.
 * One file at a time · test thoroughly before moving to the next.
 * No partial diffs — provide complete files.

---

## 📜 References & Sources

- **Takashi Kojima** — *The Japanese Abacus: Its Use and Theory*
- **Japan Soroban Association** — Official Abacus Curriculum
- **SorobanMind** — 8 Levels · 15 Lessons · 51 Skills

---

## 👨‍💻 Developer

**Mustafa Ali Akar** ([@mezo2021](https://github.com/mezo2021))

---

## 🌐 Live Web Application

Try the application: **[mezo2021.github.io/sorobanmindm-2](https://mezo2021.github.io/sorobanmind-m2)**

Supports: 💻 Desktop · 📱 Mobile · 📱 Tablets.

---

<div align="center">

🧮 **SorobanMind v2**

Built with love for children across the Arab world 🌍

**Last Updated:** 2026-10-17

**Status:** 🟢 Build Passing · 5/5 Games Active · Both Question Banks Connected · Soroban2D5 Upgraded

---

![Made with](https://img.shields.io/badge/Made_with-❤️-red?style=for-the-badge)
![Language](https://img.shields.io/badge/Language-English-blue?style=for-the-badge)
![Offline](https://img.shields.io/badge/Offline-✅-blue?style=for-the-badge)

</div>

