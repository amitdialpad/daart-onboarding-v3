# DAART Onboarding V3 - Conversational Builder

A Vue 3 prototype for conversational AI agent building using the Dialtone design system.

## Live Demo

🌐 **[View Live Demo](https://amitdialpad.github.io/daart-onboarding-v3-latest/)**

## Overview

V3 introduces a conversational-first approach to building AI agents, replacing the workspace-based model with an AI-guided chat interface that walks users through agent creation step-by-step.

**Key Features:**
- **Multi-Skill Agents** - Build one agent with multiple skills (appointment scheduling, billing, forms, etc.)
- Personalized suggested goals based on mined CC transcripts
- Conversational builder with milestone tracking
- In-conversation actions (tool connections, validation, testing)
- Two building modes: "Guide me step by step" and "Advanced builder"
- Full agent lifecycle: Build → Test → Deploy → Monitor
- Built with Dialtone design system

**Key Differentiator:** "One agent with multiple skills" - users select and configure multiple capabilities in a single agent, not separate single-purpose bots.

## Design Constraints

**IMPORTANT:**
- **Lo-Fi Approach** - Keep design minimal until Dialtone MCP is available
- **Dialtone CSS Only** - Using plain CSS classes (no Vue components due to compatibility)
- Focus on functionality first, polish later

## Tech Stack

- **Vue 3** - Composition API
- **Vite** - Build tool
- **Vue Router** - Navigation
- **Pinia** - State management
- **Dialtone** - Design system
  - `@dialpad/dialtone` - Core styles
  - `@dialpad/dialtone-vue` - Vue components
  - `@dialpad/dialtone-icons` - Icons

## Navigation Architecture

The application uses a dual-mode navigation system:

**During Onboarding (First-Time Users):**
- No left navigation sidebar
- Full-screen conversational builder
- Focus on step-by-step agent creation

**Post-Onboarding (Workspace Mode):**
- Persistent left navigation sidebar (Intercom-style)
- 240px sidebar with:
  - DAART branding
  - Agent name selector
  - Navigation items: Overview, Build, Test, Deploy, Monitor
  - Agent Studio & Knowledge (advanced features)
  - Help & Docs, Settings footer
- Triggers when agent reaches "ready to test" state
- Links become enabled based on agent status

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server (port 5175)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── starting-point/    # Landing page components
│   ├── builder/           # Chat interface components
│   └── ...
├── layouts/
│   └── AppLayout.vue      # Persistent left navigation sidebar
├── views/
│   ├── StartingPointView.vue
│   ├── ConversationalBuilderView.vue
│   ├── AgentOverviewView.vue
│   ├── TestModeView.vue
│   ├── DeployView.vue
│   ├── MonitorView.vue
│   ├── AgentStudioView.vue
│   └── KnowledgeView.vue
├── stores/                # Pinia stores
│   ├── agent.js          # Agent state (status, onboarding)
│   └── conversation.js   # Chat messages and flow
├── router/                # Vue Router config
├── data/                  # Mock data
└── assets/                # Styles and assets
```

## Development Status

**Current Phase:** Session 3 Complete | Multi-Skill Agent Flow ✅ | Awaiting EPD Feedback

### Latest Updates (Session 3):

**Session 3: Multi-Skill Agent Flow Implementation (Based on Michele's Feedback)**
- [x] **Multi-Skill Selection BEFORE Path Choice**
  - Restructured flow: Skills now shown FIRST, establishing "one agent, multiple skills" mental model
  - Created SkillSelector component with multi-select checkboxes
  - 7 skill options including "Something else (I'll describe it)" custom option

- [x] **Improved UX Transitions**
  - Added welcoming explanatory text before skill selector
  - Staggered message timing for natural conversation flow (600ms, 1400ms, 800ms delays)
  - Clear multi-select UI communicates "pick more than one"

- [x] **Updated Path Choice Copy**
  - Changed from "Guide me through 6 steps" to "Guide me step by step" (more accurate)
  - Changed from "Skip to advanced builder" to "I'll configure it myself in the advanced builder"
  - Path choice now happens AFTER skills selected, not before

- [x] **Agent Studio Integration at Completion**
  - Added Agent Studio option at Phase 6 completion
  - Explanatory text about visual flow builder
  - Three options: "Start testing", "Open Agent Studio", "View agent overview"

- [x] **New Repository for Clean Deployment**
  - Created fresh repo to avoid cache issues: https://github.com/amitdialpad/daart-onboarding-v3-latest
  - Fixed vite.config.js base path for new repo
  - Live at: https://amitdialpad.github.io/daart-onboarding-v3-latest/

**Previous Session Updates:**

**Session 2: Deployment State Persistence Fix**
- [x] **Deployment Persistence Issue Fixed**
  - Added deployment state to agent store (channel, deployedAt, config)
  - Created deployAgent(), updateDeploymentConfig(), unpublishAgent() actions
  - DeployView now initializes from store on mount
  - Deployment details now persist across navigation
  - Shows "Live" status and "Deployment Details" card after deploying

**Session 1: Navigation & Flow Improvements**
- [x] **Navigation Links Enabled on "Ready to Test"**
  - Test, Deploy, Agent Studio & Knowledge links unlock when agent is ready
  - Monitor shows "Not Deployed" badge until deployment
  - Proper status tracking (draft → in_progress → ready → deployed)

- [x] **Deployment Flow Improvements**
  - Removed confirmation modal - direct deployment
  - Builder redirects to overview after deployment
  - Back buttons respect deployment status

- [x] **Scroll Behavior Fixed**
  - Auto-scroll to latest content on action clicks
  - Scroll to bottom when returning to builder (non-deployed only)
  - Multiple scroll attempts for reliable behavior

- [x] **Validation Card Buttons**
  - "Skip for now" button working
  - "Review Each Individually" button working
  - "Apply All Improvements" button working

- [x] **Naming Consistency**
  - "Skill" renamed to "Task" throughout - This needs to changed back to Skills as per the update from Jean on 24th Nov. 
  - "Visual Workflow Builder" renamed to "Agent Studio"
  - "Visual Studio sneak peak" corrected to "Agent Studio sneak peek"

### Completed:
- [x] Project structure created
- [x] Dialtone packages installed and configured
- [x] Basic routing configured
- [x] Starting point UI fully styled
- [x] Suggested goals with 6 healthcare examples
- [x] Dialtone MCP server installed and working
- [x] Dialtone design tokens properly integrated
- [x] Conversational Builder Complete
- [x] Persistent Left Navigation Sidebar
- [x] Post-Onboarding Navigation Flow
- [x] Complete Views Implementation (7 views)
- [x] Agent status state management
- [x] Conditional navigation based on deployment

### Known Issues:
- None currently - ready for design team review

**See PROGRESS.md for detailed session notes and technical decisions.**

## Design Reference

See `/V3_PLAN.md` for complete implementation plan and design vision.

Design source: Loom video from Sofia + PDF wireframes

## Dialtone MCP

✅ **Installed, Configured, and Verified Working**

The Dialtone MCP server is installed globally and configured for Claude Code:
```bash
npm install -g @dialpad/dialtone-mcp-server
claude mcp add dialtone --scope user dialtone-mcp-server
```

This enables Claude to query:
- **Components** - DtButton, DtInput, DtCard, etc. with props and usage
- **Design Tokens** - Colors, spacing, typography, borders
- **Utility Classes** - d-p24, d-m64, d-bar-circle, etc.
- **Icons** - Alert icons, navigation icons, etc.

### Important: CSS Import Setup

```javascript
// src/main.js
import '@dialpad/dialtone/css'              // Base styles
import '@dialpad/dialtone/css-default-theme' // Theme tokens (REQUIRED!)
```

The theme CSS provides all the CSS custom property values (`--dt-color-*`, `--dt-space-*`, etc.) that make the design system work.


## Documentation

**Session Summaries:**
- **SESSION_3_SUMMARY.md** - Multi-skill agent flow implementation (Session 3)
- **SESSION_2_SUMMARY.md** - Homepage improvements with Stewart Butterfield principles (Session 2)
- **DESIGN_PRINCIPLES.md** - Full documentation of Stewart Butterfield's 8 design principles
- **HOMEPAGE_ANALYSIS.md** - Principle-by-principle homepage analysis

**Development Docs:**
- **PROGRESS.md** - Detailed session notes, technical decisions, and current state
- **README.md** - This file (quick start and overview)
- **.claude/commands/daart.md** - Complete project context (load with `/daart` command)

**Design Reference:**
- **V3_PLAN.md** - Complete implementation plan (in V2 repo)
- **Design PDF** - In V2 repo: `docs/For context.pdf`
- **Design Reference Image** - In V2 repo: `docs/home.png`

### For Future Sessions

Use the `/daart` command in Claude Code to load complete context including:
- All links and references (live demo, GitHub repo)
- Complete architecture overview
- Key code locations with line numbers
- Design principles and learnings
- Deployment information
- Next steps and priorities

## Related Repos

- **V2 Prototype:** `daart-onboarding-prototype` - Workspace-based builder
- **Design Studio:** `~/design-studio` - Dialtone component library

## Development

### Running Locally
```bash
npm run dev
```
App will be available at http://localhost:5175

### Building
```bash
npm run build
```
Output in `dist/` directory

### Deploying to GitHub Pages
```bash
npm run build
# Push to gh-pages branch
```

## AI Assistant Context

**For AI assistants (Claude in Windsurf, etc.):**
Complete context is available in the `.windsurf/` directory:
- **`.windsurf/README.md`** - Full project context (start here!)
- **`.windsurf/quick_reference.md`** - Quick reference guide
- **`.windsurf/agent_instructions.md`** - AI assistant instructions

**For developers:**
- **`PROGRESS.md`** - Complete development log
- **CONTEXT_FROM_V2.md`** - Learnings from V2 prototype (600+ lines)

## Notes

This is a low-fidelity prototype for UX validation. Focus is on user flow rather than production-ready code.

---

**Last Updated:** November 25, 2025 (Bug Fixes Complete, Ready for EPD Review)
**Developer:** Amit Ayre
**Designer:** Sofia A
**MCP Support:** Nina R, Belu M (Dialtone MCP setup)
**Feedback by :** Ted, Michelle
