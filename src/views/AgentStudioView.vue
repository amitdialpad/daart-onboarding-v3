<template>
  <div class="agent-studio">
    <!-- Header -->
    <div class="studio-header">
      <div class="header-content">
        <div class="header-left">
          <button v-if="isOnboarding" @click="goBackToGuidedSetup" class="back-arrow-button">
            ←
          </button>
          <h1 class="studio-title">{{ agentName }}</h1>
          <span class="studio-badge">Draft</span>
        </div>
        <div class="header-right">
          <button class="header-button icon-button">⋮</button>
          <button class="header-button icon-button">⟲</button>
          <button class="header-button icon-button">↻</button>
          <button class="header-button">Test</button>
          <button class="header-button primary">Save</button>
          <button v-if="!isOnboarding" class="header-button primary">Publish</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="studio-content">
      <!-- Left Sidebar -->
      <div class="left-sidebar">
        <div class="copilot-panel">
          <div class="copilot-header">
            <span class="copilot-icon">✨</span>
            <span class="copilot-title">AI Copilot</span>
            <button class="close-button">×</button>
          </div>

          <div v-if="!isLoaded" class="copilot-body skeleton">
            <!-- Skeleton state -->
            <div class="skeleton-text skeleton-line"></div>
            <div class="skeleton-text skeleton-line short"></div>
          </div>

          <div v-else class="copilot-body loaded">
            <!-- Agent Description Block -->
            <div class="description-block">
              <p class="copilot-description">
                {{ agentDescription }}
              </p>
            </div>

            <!-- Status Messages -->
            <div class="copilot-status">
              <div class="status-item thinking">
                <span class="status-spinner"></span>
                <span class="status-text">Thinking...</span>
              </div>
              <p class="status-note">Checking AI Agent setup and guardrails...</p>
              <p class="status-note">Validating instructions and safety parameters...</p>
            </div>

            <!-- Input Area -->
            <div class="copilot-input">
              <input type="text" placeholder="Ask a question" />
            </div>
          </div>
        </div>
      </div>

      <!-- Center Canvas -->
      <div class="center-canvas">
        <div class="canvas-grid">
          <!-- Skeleton Cards (shown initially) -->
          <div v-if="!isLoaded" class="skeleton-cards">
            <div class="skeleton-card" style="top: 120px; left: 180px"></div>
            <div class="skeleton-card" style="top: 80px; left: 380px"></div>
            <div class="skeleton-card" style="top: 180px; left: 580px"></div>
          </div>

          <!-- Actual Cards (shown after loading) -->
          <div v-else class="canvas-cards">
            <!-- AI Agent Card -->
            <div class="agent-card studio-card" style="top: 80px; left: 150px">
              <div class="card-header">
                <span class="card-label">AI Agent</span>
                <button class="card-menu">⋮</button>
              </div>
              <div class="card-body">
                <div class="card-title">Agent</div>
                <div class="card-subtitle">
                  DAART Therapy Studio offers<br />personalized mental health care
                </div>
              </div>
              <div class="connection-dot right"></div>
            </div>

            <!-- Bookings Skill Card -->
            <div class="skill-card studio-card" style="top: 80px; left: 420px">
              <div class="card-header">
                <span class="card-icon skill-icon">◆</span>
                <span class="card-label">Skill</span>
                <span class="card-badge">Draft</span>
                <button class="card-menu">⋮</button>
              </div>
              <div class="card-body">
                <div class="card-title">Bookings</div>
                <div class="card-actions">
                  actions: Missing connections
                </div>
              </div>
              <div class="connection-dot left"></div>
              <div class="connection-dot right"></div>
            </div>

            <!-- SMS Skill Card -->
            <div class="skill-card studio-card" style="top: 180px; left: 520px">
              <div class="card-header">
                <span class="card-icon skill-icon">◆</span>
                <span class="card-label">Skill</span>
                <span class="card-badge">Draft</span>
                <button class="card-menu">⋮</button>
              </div>
              <div class="card-body">
                <div class="card-title">Send confirmation SMS</div>
                <div class="card-subtitle">Send confirmation for appointments</div>
                <div class="card-actions">
                  actions: Missing connections
                </div>
              </div>
              <div class="connection-dot left"></div>
            </div>
          </div>
        </div>

        <!-- Bottom Toolbar -->
        <div class="canvas-toolbar">
          <button class="toolbar-button">🔍</button>
          <button class="toolbar-button">@</button>
          <button class="toolbar-button">⤢</button>
          <button class="toolbar-button">↺</button>
          <button class="toolbar-button">?</button>
        </div>

        <!-- Add Button -->
        <button class="add-fab">+</button>
      </div>

      <!-- Right Sidebar -->
      <div class="right-sidebar">
        <div v-if="!isLoaded" class="instructions-skeleton">
          <div class="skeleton-text skeleton-line"></div>
          <div class="skeleton-text skeleton-line"></div>
          <div class="skeleton-text skeleton-line short"></div>
        </div>

        <div v-else class="instructions-panel">
          <div class="instructions-header">
            <span class="instructions-icon">◆</span>
            <span class="instructions-title">Skill</span>
            <span class="instructions-badge">Draft</span>
            <button class="close-button">×</button>
          </div>

          <div class="instructions-body">
            <h3 class="instructions-heading">Instructions</h3>
            <p class="instructions-text">
              Outline each step and action the agent should take to complete this task.
            </p>

            <div class="instructions-editor">
              <div class="editor-toolbar">
                <button>B</button>
                <button>I</button>
                <button>S</button>
                <button>🔗</button>
                <button>☰</button>
                <button>≡</button>
              </div>

              <ol class="instructions-list">
                <li>📋 <strong>Retrieve Calendars</strong> — Use <span class="highlight">List Events</span> to get all calendar IDs and the primary one.</li>
                <li>📋 <strong>Collect Details</strong> — Gather necessary information (purpose, preferred datetime, email).</li>
                <li>⚠ <strong>Check Availability</strong> — Use <span class="highlight">List Event</span> to find open slots within business hours and present up to three available options.</li>
                <li><strong>Execute Action</strong> —
                  <ul>
                    <li>a. Schedule: use <span class="highlight">Create Event</span></li>
                    <li>b. Modify: use <span class="highlight">Update Events</span></li>
                    <li>c. Cancel: use <span class="highlight">Delete Events</span></li>
                  </ul>
                </li>
                <li>📧 <strong>Send Confirmation</strong> — Deliver confirmation (schedule) or receipt (modify/cancel) via <span class="highlight">Send SMS</span> or <span class="highlight">Send Email</span> with relevant appointment info.</li>
              </ol>

              <div class="advanced-mode">
                <span>Advanced Mode</span>
                <button class="cancel-button">Cancel</button>
                <button class="update-button">Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showBackConfirmation" class="confirmation-overlay">
      <div class="confirmation-dialog">
        <h3 class="dialog-title">Go back to guided setup?</h3>
        <p class="dialog-message">
          You've started configuring your agent in the advanced builder.
          Going back means you'll lose this work and need to reconfigure everything in the guided flow.
        </p>
        <div class="dialog-actions">
          <button @click="cancelGoBack" class="dialog-button secondary">
            Stay here
          </button>
          <button @click="confirmGoBack" class="dialog-button primary">
            Go back anyway
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentStore } from '../stores/agent'

const router = useRouter()
const agentStore = useAgentStore()

const isLoaded = ref(false)
const hasUnsavedWork = ref(false)
const showBackConfirmation = ref(false)

const agentName = computed(() => agentStore.name || 'New AI Agent')
const agentDescription = computed(() =>
  `A receptionist that manages Google Calendar appointments, can schedule, reschedule, and send confirmations.`
)

// Check if user is in onboarding mode (hasn't completed onboarding yet)
const isOnboarding = computed(() => !agentStore.hasCompletedOnboarding)

// Track if user has made any changes
// In a real implementation, this would track actual edits to cards, connections, etc.
// For now, we'll set it to true after the loading completes (simulating that they've "entered" the builder)
const markAsModified = () => {
  hasUnsavedWork.value = true
}

// Navigate back to guided setup with confirmation if needed
const goBackToGuidedSetup = () => {
  if (hasUnsavedWork.value) {
    showBackConfirmation.value = true
  } else {
    router.push('/builder')
  }
}

// Confirm going back (lose work)
const confirmGoBack = () => {
  showBackConfirmation.value = false
  router.push('/builder')
}

// Cancel going back (stay in studio)
const cancelGoBack = () => {
  showBackConfirmation.value = false
}

// Simulate loading transition after 2 seconds
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
    // Mark as modified after loading completes
    // This simulates that the user has "entered" the advanced builder
    setTimeout(() => {
      markAsModified()
    }, 1000)
  }, 2000)
})
</script>

<style scoped>
.agent-studio {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--dt-color-surface-secondary);
  overflow: hidden;
}

/* Header */
.studio-header {
  background: var(--dt-color-surface-primary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  padding: var(--dt-space-400) var(--dt-space-500);
  flex-shrink: 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
}

.studio-title {
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.studio-badge {
  padding: 2px 8px;
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-200);
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
}

.header-right {
  display: flex;
  gap: var(--dt-space-300);
}

.header-button {
  padding: var(--dt-space-300) var(--dt-space-400);
  background: transparent;
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-button:hover {
  background: var(--dt-color-surface-secondary);
}

.header-button.icon-button {
  padding: var(--dt-space-300);
}

.header-button.primary {
  background: var(--dt-color-purple-400);
  border-color: var(--dt-color-purple-400);
  color: white;
}

.header-button.primary:hover {
  background: var(--dt-color-purple-500);
}

.back-arrow-button {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.15s ease;
  display: flex;
  align-items: center;
  margin-right: var(--dt-space-350);
}

.back-arrow-button:hover {
  color: var(--dt-color-purple-400);
}

/* Main Content */
.studio-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Sidebar */
.left-sidebar {
  width: 280px;
  background: var(--dt-color-surface-secondary);
  border-right: 1px solid var(--dt-color-border-subtle);
  padding: var(--dt-space-400);
  overflow-y: auto;
}

.copilot-panel {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.copilot-header {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: var(--dt-space-400);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  background: white;
}

.copilot-icon {
  font-size: 16px;
  color: var(--dt-color-purple-600);
}

.copilot-title {
  flex: 1;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-semibold);
  color: var(--dt-color-foreground-primary);
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.copilot-body {
  padding: var(--dt-space-400);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  flex: 1;
  overflow-y: auto;
}

.copilot-body.skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-350);
}

.copilot-body.loaded {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* Description Block */
.description-block {
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-300);
  padding: var(--dt-space-400);
  margin-bottom: var(--dt-space-400);
}

.copilot-description {
  font-size: var(--dt-font-size-200);
  line-height: 1.5;
  color: var(--dt-color-foreground-primary);
  margin: 0;
}

/* Status Section */
.copilot-status {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  padding-bottom: var(--dt-space-400);
}

.status-item {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
}

.status-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--dt-color-border-moderate);
  border-top-color: var(--dt-color-purple-400);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-text {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
  font-weight: var(--dt-font-weight-medium);
}

.status-note {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
  margin: 0;
  padding-left: calc(16px + var(--dt-space-300));
}

/* Input Area */
.copilot-input {
  padding: var(--dt-space-400);
  border-top: 1px solid var(--dt-color-border-subtle);
  background: var(--dt-color-surface-primary);
}

.copilot-input input {
  width: 100%;
  padding: var(--dt-space-350) var(--dt-space-400);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-400);
  font-size: var(--dt-font-size-200);
  background: white;
}

.copilot-input input:focus {
  outline: none;
  border-color: var(--dt-color-purple-400);
}

/* Center Canvas */
.center-canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.canvas-grid {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    var(--dt-color-surface-secondary);
  background-size: 20px 20px;
  position: relative;
}

/* Skeleton Cards */
.skeleton-cards {
  position: relative;
  width: 100%;
  height: 100%;
}

.skeleton-card {
  position: absolute;
  width: 180px;
  height: 120px;
  background: var(--dt-color-surface-secondary);
  border: 2px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-400);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Canvas Cards */
.canvas-cards {
  position: relative;
  width: 100%;
  height: 100%;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.studio-card {
  position: absolute;
  width: 200px;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-400);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: var(--dt-space-350);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  background: white;
}

.card-icon {
  font-size: 14px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agent-icon {
  background: var(--dt-color-blue-100);
  border-radius: 4px;
}

.skill-icon {
  color: var(--dt-color-purple-400);
}

.card-label {
  flex: 1;
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
}

.card-badge {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
  background: var(--dt-color-surface-secondary);
  padding: 2px 6px;
  border-radius: var(--dt-size-radius-200);
}

.card-menu {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--dt-color-foreground-secondary);
  padding: 0;
}

.card-body {
  padding: var(--dt-space-400);
}

.card-title {
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-semibold);
  color: var(--dt-color-foreground-primary);
  margin-bottom: var(--dt-space-300);
}

.card-subtitle {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.4;
  margin-bottom: var(--dt-space-300);
}

.card-actions {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
}

/* Connection Dots */
.connection-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  border: 2px solid var(--dt-color-border-moderate);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}

.connection-dot.left {
  left: -6px;
}

.connection-dot.right {
  right: -6px;
}

/* Connection Lines */
.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Canvas Toolbar */
.canvas-toolbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--dt-space-300);
  background: white;
  padding: var(--dt-space-300);
  border-radius: var(--dt-size-radius-400);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-button {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--dt-color-border-moderate);
  background: white;
  border-radius: var(--dt-size-radius-300);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.toolbar-button:hover {
  background: var(--dt-color-surface-secondary);
}

/* Add FAB */
.add-fab {
  position: absolute;
  bottom: 80px;
  right: 40px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--dt-color-purple-400);
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-fab:hover {
  background: var(--dt-color-purple-500);
}

/* Right Sidebar */
.right-sidebar {
  width: 380px;
  background: var(--dt-color-surface-primary);
  border-left: 1px solid var(--dt-color-border-subtle);
  padding: var(--dt-space-400);
  overflow-y: auto;
}

.instructions-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
}

.instructions-panel {
  background: white;
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  overflow: hidden;
}

.instructions-header {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: var(--dt-space-400);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.instructions-icon {
  font-size: 14px;
  color: var(--dt-color-purple-400);
}

.instructions-title {
  flex: 1;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-semibold);
}

.instructions-badge {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
  background: var(--dt-color-surface-secondary);
  padding: 2px 6px;
  border-radius: var(--dt-size-radius-200);
}

.instructions-body {
  padding: var(--dt-space-400);
}

.instructions-heading {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-semibold);
  margin: 0 0 var(--dt-space-300) 0;
}

.instructions-text {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.5;
  margin: 0 0 var(--dt-space-400) 0;
}

.instructions-editor {
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  padding: var(--dt-space-400);
}

.editor-toolbar {
  display: flex;
  gap: var(--dt-space-300);
  margin-bottom: var(--dt-space-400);
  padding-bottom: var(--dt-space-400);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.editor-toolbar button {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid var(--dt-color-border-moderate);
  background: white;
  border-radius: var(--dt-size-radius-200);
  cursor: pointer;
  font-size: var(--dt-font-size-100);
}

.instructions-list {
  font-size: var(--dt-font-size-200);
  line-height: 1.6;
  color: var(--dt-color-foreground-primary);
  padding-left: var(--dt-space-500);
  margin: 0 0 var(--dt-space-400) 0;
}

.instructions-list li {
  margin-bottom: var(--dt-space-350);
}

.instructions-list ul {
  margin-top: var(--dt-space-300);
}

.highlight {
  background: var(--dt-color-blue-100);
  padding: 2px 4px;
  border-radius: var(--dt-size-radius-200);
  font-size: var(--dt-font-size-100);
}

.advanced-mode {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding-top: var(--dt-space-400);
  border-top: 1px solid var(--dt-color-border-subtle);
}

.advanced-mode span {
  flex: 1;
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
}

.cancel-button, .update-button {
  padding: var(--dt-space-300) var(--dt-space-400);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  cursor: pointer;
}

.cancel-button {
  background: white;
  border: 1px solid var(--dt-color-border-moderate);
  color: var(--dt-color-foreground-primary);
}

.update-button {
  background: var(--dt-color-purple-400);
  border: none;
  color: white;
}

/* Skeleton Styles */
.skeleton-text {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--dt-size-radius-200);
}

.skeleton-line {
  height: 16px;
  margin-bottom: var(--dt-space-300);
}

.skeleton-line.short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Confirmation Dialog */
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.confirmation-dialog {
  background: var(--dt-color-surface-primary);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-500);
  max-width: 480px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-title {
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-semibold);
  color: var(--dt-color-foreground-primary);
  margin: 0 0 var(--dt-space-400) 0;
}

.dialog-message {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.5;
  margin: 0 0 var(--dt-space-500) 0;
}

.dialog-actions {
  display: flex;
  gap: var(--dt-space-300);
  justify-content: flex-end;
}

.dialog-button {
  padding: var(--dt-space-350) var(--dt-space-500);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.dialog-button.secondary {
  background: var(--dt-color-surface-primary);
  border-color: var(--dt-color-border-moderate);
  color: var(--dt-color-foreground-primary);
}

.dialog-button.secondary:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.dialog-button.primary {
  background: var(--dt-color-purple-400);
  color: white;
  border-color: var(--dt-color-purple-400);
}

.dialog-button.primary:hover {
  background: var(--dt-color-purple-500);
  border-color: var(--dt-color-purple-500);
}
</style>
