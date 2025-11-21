# Instructions for AI Assistants (Claude, etc.)

**Project:** DAART Onboarding V3 - Conversational Agent Builder
**Last Updated:** November 21, 2025

---

## Your Role

You're helping Amit build a conversational agent builder prototype. This is a Vue 3 + Dialtone design system project.

---

## Critical Rules

### ⛔ NEVER DO THESE
1. **NO EMOJIS** - Amit has a strict "no emojis" rule for this project
2. **NO Hardcoded Styles** - Always use Dialtone tokens (`var(--dt-color-*)`)
3. **NO Dialtone Vue Components** - CSS-only approach due to Vue 2/3 compatibility
4. **NO Guessing** - Read the context files first before making changes

### ✅ ALWAYS DO THESE
1. **Read Context First** - Check `.windsurf/README.md` and `PROGRESS.md`
2. **Use Dialtone Tokens** - For ALL colors, spacing, typography, borders
3. **Test Both Paths** - Beginner and pro paths in conversational builder
4. **Update PROGRESS.md** - When making significant changes
5. **Follow Patterns** - Check `CONTEXT_FROM_V2.md` for proven patterns

---

## Before You Start Any Task

**Checklist:**
1. [ ] Read `.windsurf/README.md` (full context)
2. [ ] Review relevant section of `PROGRESS.md`
3. [ ] Check `CONTEXT_FROM_V2.md` for similar patterns
4. [ ] Understand the state machine (`src/stores/conversation.js`)
5. [ ] Confirm Dialtone tokens will be used

---

## When Adding Features

### Pattern to Follow
1. **Read existing code** - Understand how similar features work
2. **Check V2 patterns** - Review `CONTEXT_FROM_V2.md` for proven approaches
3. **Use Dialtone tokens** - Never hardcode styles
4. **Update state machine** - If adding conversation states
5. **Test both paths** - Beginner and pro paths must work
6. **Document changes** - Update `PROGRESS.md`

### Example: Adding a New Conversation State
```javascript
// 1. Add to ConversationState enum (conversation.js)
export const ConversationState = {
  // ... existing states
  NEW_STATE: 'new_state'
}

// 2. Create handler function (ConversationalBuilderView.vue)
const handleNewState = (input) => {
  // Your logic here
  conversationStore.addAIMessage("Response...")
  // Transition to next state
}

// 3. Add to processUserInput or processAction
if (state === 'new_state') {
  handleNewState(input)
}

// 4. Update milestone tracker if needed
conversationStore.updateMilestone({
  current: 'New phase: in progress'
})
```

---

## Dialtone Token Usage

### DO THIS ✅
```css
.my-component {
  padding: var(--dt-space-550);
  background: var(--dt-color-surface-primary);
  color: var(--dt-color-foreground-primary);
  border-radius: var(--dt-size-radius-400);
  font-size: var(--dt-font-size-200);
}
```

### DON'T DO THIS ❌
```css
.my-component {
  padding: 24px;  /* ❌ Hardcoded */
  background: #fff;  /* ❌ Hardcoded */
  color: #000;  /* ❌ Hardcoded */
  border-radius: 8px;  /* ❌ Hardcoded */
  font-size: 15px;  /* ❌ Hardcoded */
}
```

**Token Reference:** https://dialtone.dialpad.com/design/tokens/

---

## Common Tasks

### Debugging Conversation Flow
```javascript
// Check current state
console.log('Current state:', conversationStore.currentState)

// Check if waiting for user
console.log('Waiting for user?', conversationStore.isWaitingForUser)

// Check message history
console.log('Messages:', conversationStore.messages)
```

### Adding AI Messages
```javascript
// Simple text message
conversationStore.addAIMessage("Hello! How can I help?")

// Message with action buttons
conversationStore.addAIMessage(
  "Which calendar system?",
  'text',
  ['Google Calendar', 'Microsoft Calendar', 'Other']
)

// Then handle the action in processAction()
```

### Updating Milestone Tracker
```javascript
// Update current status
conversationStore.updateMilestone({
  current: 'Phase 2: Connecting tools'
})

// Mark something complete
conversationStore.updateMilestone({
  completed: 'Phase 1: Foundation complete'
})

// Update context summary
conversationStore.updateMilestone({
  contextSummary: 'Healthcare appointment scheduling'
})
```

---

## File Structure You Need to Know

```
src/
├── views/
│   ├── StartingPointView.vue          ← Landing page
│   ├── ConversationalBuilderView.vue  ← Main chat (550+ lines)
│   └── AgentOverviewView.vue          ← Post-build (not built)
│
├── components/builder/
│   ├── ChatMessage.vue      ← Message bubbles
│   ├── MessageInput.vue     ← Input field
│   └── MilestoneTracker.vue ← Progress sidebar
│
├── stores/
│   ├── conversation.js      ← State machine (⭐ READ THIS)
│   └── agent.js             ← Agent config
│
└── router/index.js          ← 3 routes
```

**Most Important:** `conversation.js` and `ConversationalBuilderView.vue`

---

## State Machine Overview

```
Initial: SHOWING_PLAN → ASKING_PATH
         ↓
Beginner: BEGINNER_PHASE_1 → 2 → 3 → 4 → 5 → 6
Pro:      PRO_GATHERING_INFO → PRO_PHASE_2 → 3 → 4 → 6
```

**Each state has a handler function in ConversationalBuilderView.vue**

**Transitions happen when:**
- User answers a question
- User clicks action button
- Phase completes

---

## Patterns from V2 to Reuse

### Progressive Empty States
```vue
<div v-if="noContent" class="empty-state">
  <!-- Guide user to add content -->
</div>
<div v-else-if="hasMinimalContent" class="partial-state">
  <!-- Encourage more content -->
</div>
<div v-else class="ready-state">
  <!-- Full interface -->
</div>
```

### Split View Layout
```vue
<div class="split-layout">
  <div class="left-panel"><!-- Primary content --></div>
  <div class="right-panel"><!-- Preview/testing --></div>
</div>
```

### Auto-Configuration
```javascript
// Infer settings from context
function inferAgentName(goal) {
  // "Appointment Scheduler" → "Appointment Assistant"
  return goal.replace('Scheduler', 'Assistant')
}
```

**Full patterns:** See `CONTEXT_FROM_V2.md`

---

## Testing Checklist

After making changes:
- [ ] Test beginner path (all 6 phases)
- [ ] Test pro path (faster flow)
- [ ] Check milestone tracker updates correctly
- [ ] Verify no console errors
- [ ] Confirm Dialtone tokens used (no hardcoded values)
- [ ] Check responsiveness (if applicable)
- [ ] Update PROGRESS.md with changes

---

## When You Need Help

1. **Check PROGRESS.md** - Recent changes and decisions
2. **Check CONTEXT_FROM_V2.md** - Proven patterns
3. **Review conversation.js** - State machine logic
4. **Ask Amit** - He has full context

---

## Common Issues & Solutions

### "Chat not responding after user input"
**Cause:** Handler function not called or wrong state
**Fix:** Check `processUserInput()` and `processAction()` for missing cases

### "Action button not working"
**Cause:** Missing handler in `processAction()` for current state
**Fix:** Add case for `state === 'your_state'`

### "Milestone tracker not updating"
**Cause:** Forgot to call `updateMilestone()`
**Fix:** Add `conversationStore.updateMilestone({...})` after phase transition

### "Styles not applying"
**Cause:** Hardcoded values or missing Dialtone CSS import
**Fix:** Use tokens and verify `import '@dialpad/dialtone/css'` in main.js

---

## Quick Reference

**Run dev server:**
```bash
npm run dev
# http://localhost:5174/
```

**File to edit for conversation logic:**
```
src/views/ConversationalBuilderView.vue
```

**File to edit for state:**
```
src/stores/conversation.js
```

**Design tokens reference:**
```
https://dialtone.dialpad.com/design/tokens/
```

---

## Remember

1. **This is a prototype** - Focus on UX validation, not production code
2. **NO EMOJIS** - Amit's strict rule
3. **Dialtone tokens always** - Never hardcode styles
4. **Test both paths** - Beginner and pro
5. **Document changes** - Update PROGRESS.md

---

**You're ready to help! Read `.windsurf/README.md` for full context.**
