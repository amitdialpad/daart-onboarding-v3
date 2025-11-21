# DAART Onboarding V3 - AI Assistant Context

**Last Updated:** November 21, 2025
**Developer:** Amit Ayre
**Designer:** Sofia (conversational builder vision)
**Project:** DAART (Dialpad Agentic AI in Real-Time) Onboarding Prototype V3

---

## Quick Start for AI Assistants

This document provides complete context for AI assistants (Claude, etc.) working on this project.

---

## 🎯 Project Mission

Build a **conversational-first agent builder** where an AI guides users through creating AI agents via chat, with a persistent milestone tracker showing progress.

This is V3 of the DAART onboarding prototype - a fundamental UX shift from workspace-based building (V2) to conversational building.

---

## 📁 Project Structure

```
daart-onboarding-v3/
├── .windsurf/
│   └── README.md              ← You are here!
├── src/
│   ├── layouts/
│   │   └── AppLayout.vue              ← Persistent left navigation sidebar
│   ├── views/
│   │   ├── StartingPointView.vue      ← Landing page with suggested goals
│   │   ├── ConversationalBuilderView.vue  ← Main chat interface (550+ lines)
│   │   ├── AgentOverviewView.vue      ← Post-build overview
│   │   ├── DeployView.vue             ← Channel deployments
│   │   ├── MonitorView.vue            ← Performance dashboard
│   │   ├── WorkflowBuilderView.vue    ← Drag-and-drop node editor
│   │   └── TestModeView.vue           ← Agent testing interface
│   ├── components/
│   │   └── builder/
│   │       ├── ChatMessage.vue        ← Message bubbles with action buttons
│   │       ├── MessageInput.vue       ← Text input with Improve/Send
│   │       ├── MilestoneTracker.vue   ← Progress sidebar
│   │       └── LoadingProgress.vue    ← Loading states
│   ├── stores/
│   │   ├── conversation.js            ← Conversation state machine
│   │   └── agent.js                   ← Agent configuration + onboarding state
│   ├── router/
│   │   └── index.js                   ← Route config with meta tags
│   └── main.js
├── PROGRESS.md                 ← Complete development log
├── CONTEXT_FROM_V2.md          ← Learnings from V2 prototype
├── README.md                   ← Quick start guide
└── package.json
```

---

## 🚀 Current State (November 21, 2025)

### ✅ What's Complete

#### Phase 1: Setup ✅
- Vue 3 + Vite + Pinia + Vue Router
- Dialtone CSS design system fully integrated
- 50+ design tokens properly applied
- Dev server running on `http://localhost:5174/`

#### Phase 2: Starting Point View ✅
- Landing page with "AI Agents" hero
- Large textarea for custom agent goals
- 6 suggested healthcare goals (clickable cards)
- Help section with placeholders
- Styled with Dialtone tokens

#### Phase 3: Conversational Builder ✅
- Full chat interface with AI + user messages
- Milestone tracker sidebar (3-column layout)
- Two complete paths:
  - **Beginner path** ("Go step by step"): 6-phase guided flow
  - **Pro path** ("Run whole plan"): Faster configuration
- State machine managing conversation flow
- Action buttons reduce typing friction
- Auto-scrolling chat, natural message timing

#### Phase 4: 6-Phase Flow ✅
1. **Phase 1:** Agent Foundation (5 questions about appointments)
2. **Phase 2:** Tool Connections (calendar + video service)
3. **Phase 3:** Safety & Guardrails (identity verification, business rules)
4. **Phase 4:** Validation (show improvements, apply them)
5. **Phase 5:** Optional Skills (confirmations, reminders, or skip)
6. **Phase 6:** Test & Launch (start testing or save demo link)

#### Phase 5: Persistent Left Navigation ✅
- AppLayout component with Intercom-style left sidebar
- 240px sidebar with navigation items: Build, Test, Deploy, Monitor, Workflow Studio, Overview
- Agent name selector and footer links (Help & Docs, Settings)
- Conditional rendering: no sidebar during onboarding, appears after completion
- Mobile-responsive (collapses to 60px on small screens)

#### Phase 6: Post-Onboarding Navigation ✅
- Onboarding completion state tracking in agent store
- 4 navigation options at builder completion: View Overview, Deploy, Test, Monitor
- Seamless transition from onboarding to workspace mode
- All post-onboarding views implemented:
  - DeployView: Channel integrations (Chat, Email, Phone, Slack)
  - MonitorView: Performance dashboard, conversation history
  - WorkflowBuilderView: Drag-and-drop node editor
  - TestModeView: Agent testing interface
  - AgentOverviewView: Agent details and settings

#### Phase 7: NO EMOJIS Compliance ✅
- Removed all emojis from 6 views and components
- Project fully compliant with design constraints

---

## 🐛 Recent Bug Fixes

### Fixed Today (November 21, 2025)

#### 1. Pro Path Stuck Button
**Issue:** User stuck at "Got it! Ready to move forward? - Yes Continue" button
**Root cause:** `processAction` function missing handler for `pro_gathering_info` state
**Fix:** Added handler in ConversationalBuilderView.vue line 151-153
**Status:** ✅ Fixed and working

#### 2. Vue Compiler Error - DeployView.vue
**Issue:** "[plugin:vite:vue] Invalid end tag" error at line 340
**Root cause:** `</script>` tag in template string was interpreted as closing tag for `<script setup>` block
**Fix:** Escaped closing script tag as `<\/script>` on line 291
**Status:** ✅ Fixed and working

#### 3. Missing Post-Onboarding Navigation
**Issue:** Users stuck at demo link screen with no way to access Deploy/Monitor/Overview
**Root cause:** Only 2 navigation options provided ("Test agent now", "Back to building")
**Fix:** Updated to 4 options with navigation handlers that mark onboarding as complete
**Status:** ✅ Fixed and working

---

## 🎨 Design System

### Dialtone Integration
**Status:** ✅ Complete

**CSS Imports:**
```javascript
// src/main.js
import '@dialpad/dialtone/css'              // Base styles
import '@dialpad/dialtone/css-default-theme' // Theme tokens (required!)
```

**Design Tokens in Use:**
- Colors: `var(--dt-color-surface-primary)`, `var(--dt-color-foreground-primary)`
- Spacing: `var(--dt-space-550)`, `var(--dt-space-700)`
- Typography: `var(--dt-font-size-200)`, `var(--dt-font-weight-medium)`
- Borders: `var(--dt-size-radius-400)`
- Shadows: `var(--dt-shadow-200)`

**Benefits:**
- Automatic theme support (light/dark mode)
- Consistent spacing and colors
- Design system compliance

---

## 🔑 Critical Design Constraints

### ⚠️ NEVER DO THESE:
1. **NO EMOJIS** - Never use emojis anywhere in this project (strict rule)
2. **NO Dialtone Vue Components** - CSS-only approach (Vue 2/3 compatibility issues)
3. **NO Component-Scoped Hardcoded Styles** - Always use Dialtone tokens

### ✅ ALWAYS DO THESE:
1. Use Dialtone design tokens for ALL styling
2. Keep components small and focused
3. Update PROGRESS.md when making significant changes
4. Test both beginner and pro paths when modifying conversation flow

---

## 🧠 State Management

### Conversation Store (`src/stores/conversation.js`)
**Purpose:** Manages conversation state machine and message history

**Key State:**
- `currentState` - State machine position (e.g., `beginner_phase_2`)
- `userPath` - 'beginner' or 'pro'
- `messages` - Array of all chat messages
- `currentPhase` - Phase tracking with status
- `milestones` - Progress tracking for sidebar

**Key Actions:**
- `addAIMessage(content, type, actions)` - Add AI message (optionally with action buttons)
- `addUserMessage(content)` - Add user message
- `selectPath(path)` - Choose beginner or pro path
- `updateMilestone(update)` - Update progress tracker

### Agent Store (`src/stores/agent.js`)
**Purpose:** Stores agent configuration built during conversation

**Key State:**
- `id`, `name`, `goal` - Agent basics
- `foundation` - Purpose, hours, duration, buffer
- `connections` - Array of connected tools
- `guardrails` - Safety rules and verification
- `skills` - Additional capabilities

---

## 🧭 Navigation Architecture

### Two-Mode System

**Onboarding Mode (First-Time Users):**
- No left navigation sidebar
- Full-screen conversational builder
- Focus on step-by-step agent creation
- Route meta: `hideLayout: true`

**Workspace Mode (Post-Onboarding):**
- Persistent left navigation sidebar appears
- Intercom-style 240px sidebar with:
  - DAART branding
  - Agent name selector
  - Navigation: Build, Test, Deploy, Monitor, Workflow Studio, Overview
  - Footer: Help & Docs, Settings
- Triggers when user clicks any navigation action at builder completion
- Route meta: `useLayout: true`

### Implementation Details

**State Tracking:**
- `agentStore.hasCompletedOnboarding` boolean flag
- Set to `true` when any post-onboarding navigation action is clicked
- Persists across session (Pinia state)

**Conditional Layout Logic (App.vue):**
```javascript
const shouldShowLayout = computed(() => {
  if (route.meta.hideLayout) return false
  return route.meta.useLayout && agentStore.hasCompletedOnboarding
})
```

**Navigation Options at Builder Completion:**
1. View agent overview → `/agent/:id/overview`
2. Deploy agent → `/deploy`
3. Test agent now → `/test-mode`
4. Monitor performance → `/monitor`

All options call `agentStore.completeOnboarding()` before navigating.

---

## 🗺️ Conversation Flow State Machine

### States Overview
```
SHOWING_PLAN → ASKING_PATH
    ↓
    ├─→ BEGINNER PATH
    │   ├─→ BEGINNER_PHASE_1 (Foundation questions)
    │   ├─→ BEGINNER_PHASE_2 (Tool connections)
    │   ├─→ BEGINNER_PHASE_3 (Guardrails)
    │   ├─→ BEGINNER_PHASE_4 (Validation)
    │   ├─→ BEGINNER_PHASE_5 (Optional skills)
    │   └─→ BEGINNER_PHASE_6 (Test & Launch)
    │
    └─→ PRO PATH
        ├─→ PRO_GATHERING_INFO (paste doc or quick questions)
        ├─→ PRO_PHASE_2 (Combined tool selection)
        ├─→ PRO_PHASE_3 (Fast guardrails)
        ├─→ PRO_PHASE_4 (Validation)
        └─→ PRO_PHASE_6 (Test & Launch - skip phase 5)
```

### Handler Functions
- `handleBeginnerPhase1()` - 5 foundation questions
- `handleBeginnerPhase2()` - Calendar + video service selection
- `handleBeginnerPhase3()` - Identity verification + business rules
- `handleBeginnerPhase4()` - Apply validation improvements
- `handleBeginnerPhase5()` - Optional skill selection
- `handleProPath()` - Document paste or quick config
- `handleProPhase2()` - Combined tool selection
- `handleProPhase3()` - Fast safety config
- `handleProPhase4()` - Same as beginner validation

---

## 📚 Key Files to Understand

### Must Read (in order)
1. **PROGRESS.md** - Complete development history and decisions
2. **CONTEXT_FROM_V2.md** - Learnings from previous prototype (600+ lines)
3. **src/stores/conversation.js** - State machine logic
4. **src/stores/agent.js** - Agent configuration + onboarding state tracking
5. **src/layouts/AppLayout.vue** - Persistent left navigation sidebar
6. **src/App.vue** - Conditional layout rendering logic
7. **src/views/ConversationalBuilderView.vue** - Main conversation logic (550+ lines)

### Post-Onboarding Views
- **src/views/DeployView.vue** - Channel deployment wizard
- **src/views/MonitorView.vue** - Performance dashboard and analytics
- **src/views/WorkflowBuilderView.vue** - Drag-and-drop workflow editor
- **src/views/TestModeView.vue** - Agent testing interface
- **src/views/AgentOverviewView.vue** - Agent details and settings

### Important References
- **V3_PLAN.md** (in V2 repo) - Original planning document
- **docs/For context.pdf** (in V2 repo) - Design wireframes
- **V2 repo location:** `/Users/amitayre/code/daart-onboarding-prototype`

---

## 🎯 What to Work On Next

### Current Focus: Bug Fixes & Refinements (Nov 21, 2025)
Post-onboarding navigation and emoji removal complete. Ready for bug fixing phase.

### Completed Recently
✅ Persistent left navigation sidebar (Intercom-style)
✅ Post-onboarding navigation flow with 4 options
✅ All post-onboarding views implemented (Deploy, Monitor, Workflow Builder, Test Mode, Overview)
✅ NO EMOJIS compliance (all emojis removed)
✅ Onboarding completion state tracking

### Next Priorities
1. **Bug Fixes** (step-by-step as identified by user)
   - Address any issues found during testing
   - Fix edge cases in navigation flow
   - Resolve any UX friction points

2. **UX Polish & Refinements**
   - Milestone Tracker redesign (transform into live preview panel)
   - Validation Improvements UI (expandable cards with Dialtone accordion)
   - Connection Naming Flow (inline inputs with smart defaults)
   - Pro Path Loading Animation (progressive steps with checkmarks)

3. **Performance Optimizations**
   - Loading states optimization
   - Transition smoothness
   - Error handling improvements

### Design Guidance
- **Keep**: Conversational builder, chat interface, both paths, Intercom-style navigation
- **Apply**: Expandable sections, preview panels, clear CTAs
- **Reference**: "for context.pdf" for feature completeness
- **Strict Rule**: NO EMOJIS anywhere in the project

---

## 🔧 Common Tasks

### Running the Project
```bash
cd /Users/amitayre/code/daart-onboarding-v3
npm run dev
# Runs on http://localhost:5174/
```

### Making Changes
1. Read the relevant section of PROGRESS.md
2. Check CONTEXT_FROM_V2.md for patterns to follow
3. Make your changes (always use Dialtone tokens!)
4. Test both beginner and pro paths
5. Update PROGRESS.md with what you did

### Adding a New Conversation State
1. Add state to `ConversationState` enum in `conversation.js`
2. Add handler function in `ConversationalBuilderView.vue`
3. Add case in `processUserInput()` or `processAction()`
4. Update milestone tracker if needed
5. Test the flow

### Debugging State Issues
1. Check Vue DevTools for Pinia state
2. Console log `conversationStore.currentState`
3. Verify state transitions in handler functions
4. Check if `setWaitingForAI()` is properly toggled

---

## 🌟 Design Philosophy

### Core Principles
1. **Conversational first** - AI guides, user responds naturally
2. **Progressive disclosure** - Show complexity gradually (beginner vs pro)
3. **Instant feedback** - Milestone tracker always shows progress
4. **Minimal friction** - Action buttons reduce typing
5. **Celebration moments** - Mark achievements at each phase

### UX Patterns from V2 (Apply These)
- **Progressive empty states** - Guide users when stuck
- **Split-view layouts** - Content + preview
- **Auto-configuration** - Infer settings from context
- **Smart defaults** - Pre-fill when possible
- **Contextual tips** - Help at the right moment

### Anti-Patterns from V2 (Avoid These)
- ❌ Too many tabs (keep navigation simple)
- ❌ Wizard confusion (clear onboarding vs workspace boundary)
- ❌ Late testing (test early in conversation)
- ❌ Complex forms (conversation is more natural)
- ❌ Hidden progress (milestone tracker solves this)

---

## 🤝 Working with This Codebase

### Code Style
- Vue 3 Composition API (`<script setup>`)
- Pinia for state management
- No TypeScript (plain JavaScript)
- Comments for complex logic only
- Dialtone tokens for ALL styling

### Component Structure
```vue
<template>
  <!-- Use Dialtone tokens -->
</template>

<script setup>
import { ref, computed } from 'vue'
import { useConversationStore } from '../stores/conversation'

// Props
const props = defineProps({ ... })

// State
const localState = ref(...)

// Computed
const computed = computed(() => ...)

// Methods
const handleAction = () => { ... }
</script>

<style scoped>
/* Always use Dialtone tokens */
.component {
  padding: var(--dt-space-550);
  color: var(--dt-color-foreground-primary);
}
</style>
```

### Dialtone Token Reference
```css
/* Spacing */
--dt-space-300 (8px)
--dt-space-400 (12px)
--dt-space-450 (16px)
--dt-space-500 (20px)
--dt-space-550 (24px)
--dt-space-700 (80px)

/* Colors */
--dt-color-surface-primary (white)
--dt-color-surface-secondary (light gray)
--dt-color-foreground-primary (dark text)
--dt-color-foreground-secondary (gray text)
--dt-color-border-subtle (light border)

/* Typography */
--dt-font-size-200 (15px)
--dt-font-size-300 (19px)
--dt-font-weight-medium (500)
--dt-font-weight-bold (700)

/* Borders */
--dt-size-radius-300 (6px)
--dt-size-radius-400 (8px)
```

---

## 🎓 Learning Resources

### Dialtone Documentation
- Main site: https://dialtone.dialpad.com/
- Design tokens: https://dialtone.dialpad.com/design/tokens/
- Components: https://dialtone.dialpad.com/components/

### Vue 3 Resources
- Composition API: https://vuejs.org/guide/extras/composition-api-faq.html
- Pinia: https://pinia.vuejs.org/

---

## 📝 Important Notes

### Remember
- This is a high-fidelity prototype for UX validation
- Focus is on visual design and user flow, not production code
- All decisions are documented for engineering handoff
- V2 workspace builder still exists for comparison

### Context for Dialpad
- **Project:** DAART (Dialpad Agentic AI in Real-Time)
- **Timeline:** Marketing launch 10/9/2025, EAP release 10/14/2025
- **Team:** PM DRI: Shezan Kazi, Eng DRI: Michele Sama, Design DRI: Marshall Norman
- **Your role (Amit):** Optimizing onboarding and billing workflows with Aykut Durmayaz (Designer)

### Relationship to Main DAART Project
This V3 conversational builder is one exploration of the onboarding experience. The main DAART project includes:
- Skill Builder (no-code skill creation)
- Workflow Builder (visual flow canvas)
- Connector Manager/MCP (external integrations)
- Agentic Analytics (metrics/dashboards)
- Guardrails/Overseer (security/safety)

**This prototype focuses on:** The initial "create your first agent" experience.

---

## 🆘 Getting Help

### If You're Stuck
1. Read PROGRESS.md for context on recent changes
2. Check CONTEXT_FROM_V2.md for similar patterns
3. Look at the state machine in conversation.js
4. Check Vue DevTools for state debugging
5. Ask Amit or review the V2 prototype for inspiration

### Common Issues
- **"Chat not responding"** → Check currentState and handler function
- **"Styles not working"** → Verify Dialtone token usage
- **"State not updating"** → Check Pinia store watchers
- **"Button not working"** → Verify processAction() has handler for current state

---

## ✅ Pre-Flight Checklist

Before starting work, confirm:
- [ ] Read this README.md
- [ ] Reviewed PROGRESS.md (recent changes section)
- [ ] Understand the state machine (conversation.js)
- [ ] Dev server is running (npm run dev)
- [ ] No emojis will be added
- [ ] Dialtone tokens will be used for styling

---

**Ready to code!** 🚀

When in doubt:
1. Check PROGRESS.md
2. Reference CONTEXT_FROM_V2.md
3. Use Dialtone tokens
4. Test both paths
5. Update documentation

**Good luck!**
