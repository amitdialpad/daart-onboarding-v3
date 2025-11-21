# Quick Reference - DAART V3

**For AI Assistants: Read this first for instant context**

---

## 🎯 What Is This?

Conversational agent builder where AI guides users through creating AI agents via chat.

**V3 Approach:** Chat-based building with milestone tracker
**V2 Approach:** Workspace with tabs (previous prototype)
**Why V3?** Faster time to value (2-5 min vs 5-10 min)

---

## 📂 Key Files (Priority Order)

1. `.windsurf/README.md` - Full context (read this!)
2. `PROGRESS.md` - Development log and decisions
3. `CONTEXT_FROM_V2.md` - Learnings from V2 (600+ lines)
4. `src/stores/conversation.js` - State machine
5. `src/views/ConversationalBuilderView.vue` - Main logic (550+ lines)

---

## ⚡ Quick Start

```bash
cd /Users/amitayre/code/daart-onboarding-v3
npm run dev
# Opens http://localhost:5174/
```

---

## 🚦 Current Status

**What's Done:** ✅
- Starting point with suggested goals
- Full conversational builder (both paths)
- 6-phase flow (beginner + pro)
- Milestone tracker
- State machine
- Dialtone design system integrated

**What's Next:**
- Testing & polish
- Error handling
- Content refinement

---

## 🎨 Styling Rules

**ALWAYS:**
- Use Dialtone tokens: `var(--dt-color-surface-primary)`
- No hardcoded colors, spacing, or sizes

**NEVER:**
- No emojis (strict rule)
- No Dialtone Vue components (CSS only)
- No hardcoded values

---

## 🧠 State Machine

```
SHOWING_PLAN → ASKING_PATH
    ↓
    ├─→ BEGINNER (6 phases, step-by-step)
    └─→ PRO (faster, combined selections)
```

**States in:** `src/stores/conversation.js`
**Handlers in:** `src/views/ConversationalBuilderView.vue`

---

## 🐛 Recent Fixes

**Nov 21, 2025:** Fixed "Yes, continue" button stuck in pro path
**Root cause:** Missing handler for `pro_gathering_info` state
**Location:** ConversationalBuilderView.vue line 151-153

---

## 📚 Context Documents

- **Full context:** `.windsurf/README.md`
- **Development log:** `PROGRESS.md`
- **V2 learnings:** `CONTEXT_FROM_V2.md`
- **V2 repo:** `/Users/amitayre/code/daart-onboarding-prototype`

---

## 🔑 Design Tokens

```css
/* Spacing */
var(--dt-space-550)  /* 24px */
var(--dt-space-700)  /* 80px */

/* Colors */
var(--dt-color-surface-primary)      /* white */
var(--dt-color-foreground-primary)   /* dark text */

/* Typography */
var(--dt-font-size-200)  /* 15px */
var(--dt-font-size-300)  /* 19px */
```

**Full reference:** https://dialtone.dialpad.com/design/tokens/

---

## 🎯 Philosophy

1. **Conversational first** - AI guides naturally
2. **Milestone tracking** - Always show progress
3. **Two paths** - Beginner (guided) vs Pro (fast)
4. **Inline actions** - Reduce tab switching
5. **No emojis** - Clean, professional UI

---

**Need more?** Read `.windsurf/README.md` for complete context.
