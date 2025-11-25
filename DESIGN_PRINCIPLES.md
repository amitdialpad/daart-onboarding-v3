# Design Principles for DAART Onboarding

## Core Principles from Josh

### 1. "Opt into complexity"
**Principle**: Start with a simple view and let users dive deeper when they need to.

**Key Insight**: Don't overwhelm users with all the details upfront. Show them what they need to know right now, and provide ways to access advanced features or detailed information only when they want it.

**Applied to DAART**:
- Start with skill selection, not a comprehensive overview
- Show progress indicator in header, not a detailed 6-phase breakdown
- Let users complete the flow through simple conversational Q&A
- Advanced configuration options can be accessed later, not forced upfront

---

### 2. "It works in 5 clicks"
**Principle**: Users should reach a working state quickly.

**Key Insight**: The path from "I want to try this" to "I have something working" should be as short as possible. Every extra step, decision, or piece of information delays the moment when users see value.

**Applied to DAART**:
- Removed "How would you like to proceed?" choice - just start building
- Auto-execute the best path (pro path) immediately
- No fake work like reading plans or choosing options
- Direct skill selection → builder → working agent

---

### 3. "Documentation is a failed state"
**Principle**: Design should be self-evident, not requiring guides.

**Key Insight**: If users need documentation to understand your interface, the interface has failed. Good design communicates what to do and why through the experience itself.

**Applied to DAART**:
- Removed overwhelming 6-phase overview card that was "explaining" the process
- Progress is shown through doing, not through reading about what you're about to do
- Conversational UI guides users naturally through questions
- Each phase completes through interaction, not documentation reading

---

## How These Principles Work Together

These three principles create a cohesive philosophy:

1. **Opt into complexity** → Don't show everything at once
2. **It works in 5 clicks** → Get users to value fast
3. **Documentation is a failed state** → Make the path self-evident

**Example Applied to Builder Flow**:
- ❌ **Before**: Show 6-phase overview → Ask user to choose path → Explain what will happen → Then start
- ✅ **After**: Just start asking Phase 1 questions → Show progress in header → User learns by doing

---

## Implementation Guidelines

### For Homepage:
- Show outcome-focused value prop, not feature lists
- Offer skill templates with clear benefits
- One click → start building
- No "Learn more" or documentation barriers

### For Builder Flow:
- Start immediately with first question
- Progress indicator is visible but not overwhelming
- No choice paralysis (removed beginner vs pro path)
- Conversational guidance replaces documentation

### For Progress Indication:
- Show current phase in header (simple view)
- Visual progress bar shows completion
- Phase transitions marked clearly through messages
- Users can "opt into complexity" by viewing full plan details (future feature)

---

## Anti-Patterns to Avoid

### ❌ Violates "Opt into complexity":
- Showing all 6 phases with descriptions at the start
- Displaying every configuration option on one screen
- Explaining every feature before users try anything

### ❌ Violates "It works in 5 clicks":
- Asking users to choose between paths
- Requiring profile setup before starting
- Multiple preview/confirmation steps

### ❌ Violates "Documentation is a failed state":
- "Here's what we're going to do" explanatory cards
- Tooltips explaining obvious buttons
- Required tutorials or walkthroughs

---

## Success Metrics

**We know we're following these principles when**:
1. New users complete their first agent without asking questions
2. Time from landing page to working agent is under 5 minutes
3. Users understand where they are and what's next without help text
4. Advanced users can find deeper features without them cluttering the main flow

---

## References

These principles were established by Josh to guide the DAART onboarding experience. They align well with broader product design philosophies like:
- Don't make me think (Steve Krug)
- Progressive disclosure (Jakob Nielsen)
- Minimum viable product thinking
