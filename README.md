# DAART Onboarding V3 - Conversational Builder

A Vue 3 prototype for conversational AI agent building using the Dialtone design system.

## Live Demo

🌐 **[View Live Demo](https://amitayre.github.io/daart-onboarding-v3/)**

## Overview

V3 introduces a conversational-first approach to building AI agents, replacing the workspace-based model with an AI-guided chat interface that walks users through agent creation step-by-step.

**Key Features:**
- Personalized suggested goals based on mined CC transcripts
- Conversational builder with milestone tracking
- In-conversation actions (tool connections, validation, testing)
- Two building modes: Step-by-step and "Do everything"
- Full agent lifecycle: Build → Test → Deploy → Monitor
- Built with Dialtone design system

## Design Constraints

**IMPORTANT:**
- **NO EMOJIS** - Do not use emojis anywhere in the project
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

**Current Phase:** Bug Fixes & Polish | Ready for EPD Team Review ✅

### Latest Updates (November 21, 2025):

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
  - "Skill" renamed to "Task" throughout
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
- [x] NO EMOJIS Compliance
- [x] Monitor charts placeholder (fixing broken visuals)
- [x] Agent status state management
- [x] Conditional navigation based on deployment

### Known Issues:
- None currently - ready for EPD team review

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

**You MUST import both base CSS and theme CSS for Dialtone to work:**

```javascript
// src/main.js
import '@dialpad/dialtone/css'              // Base styles
import '@dialpad/dialtone/css-default-theme' // Theme tokens (REQUIRED!)
```

The theme CSS provides all the CSS custom property values (`--dt-color-*`, `--dt-space-*`, etc.) that make the design system work.

## Agent Lifecycle Flow

1. **Starting Point** - User enters their agent goal
2. **Builder** - Conversational interface guides through 6 phases:
   - Phase 1: Agent Foundation & Tasks
   - Phase 2: Connections (Calendar, Video, CRM)
   - Phase 3: Safety & Guardrails
   - Phase 4: Validation & Refine
   - Phase 5: Additional Tasks (optional)
   - Phase 6: Test & Launch
3. **Ready State** - Navigation links unlock (Test, Deploy, Agent Studio, Knowledge)
4. **Testing** - Test agent in simulated environment
5. **Deployment** - Deploy to channels (Chat Widget, Email, Phone, Slack)
6. **Monitoring** - View performance metrics and conversations
7. **Agent Studio** - Advanced workflow editing (placeholder)

## Documentation

- **PROGRESS.md** - Detailed session notes, technical decisions, and current state
- **V3_PLAN.md** - Complete implementation plan (in V2 repo)
- **README.md** - This file (quick start and overview)
- **Design PDF** - In V2 repo: `docs/For context.pdf`
- **Design Reference Image** - In V2 repo: `docs/home.png`

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

This is a high-fidelity prototype for UX validation. Focus is on visual design and user flow rather than production-ready code.

---

**Last Updated:** November 21, 2025 (Bug Fixes Complete, Ready for EPD Review)
**Developer:** Amit Ayre
**Designer:** Sofia
**MCP Support:** Nina Repetto (Dialtone MCP setup)
