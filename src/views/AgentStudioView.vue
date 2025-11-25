<template>
  <div class="workflow-builder">
    <!-- Header -->
    <div class="builder-header">
      <div class="header-content">
        <h1 class="builder-title">Agent Studio</h1>
        <div class="header-right">
          <button @click="handleTest" class="action-button">Test</button>
          <button @click="handleSave" class="action-button primary">Save</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="builder-container">
      <!-- Canvas Area -->
      <div class="canvas-container">
        <div class="canvas-grid">
          <!-- Placeholder message -->
          <div class="coming-soon-overlay">
            <div class="coming-soon-card">
              <h2 class="coming-soon-title">Agent Studio</h2>
              <p class="coming-soon-text">
                This is where you'll be able to visually design your agent's conversation flows
                with drag-and-drop nodes, branches, and conditions.
              </p>
              <div class="feature-list">
                <div class="feature-item">Drag-and-drop node editor</div>
                <div class="feature-item">Visual conversation flow design</div>
                <div class="feature-item">Conditional branching logic</div>
                <div class="feature-item">Real-time preview</div>
              </div>
              <p class="coming-soon-note">Coming in the next iteration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentStore } from '../stores/agent'

const router = useRouter()
const agentStore = useAgentStore()

const agentName = computed(() => agentStore.name || 'New AI Agent')
const agentGoal = computed(() => agentStore.goal)
const connections = computed(() => agentStore.connections || [])
const guardrails = computed(() => agentStore.guardrails || {})

const hasCalendarConnection = computed(() =>
  connections.value.some(c => c.type === 'calendar')
)

const hasVideoConnection = computed(() =>
  connections.value.some(c => c.type === 'video')
)

const hasGuardrails = computed(() =>
  guardrails.value.identityVerification ||
  (guardrails.value.businessRules && guardrails.value.businessRules.length > 0)
)

const connectionCount = computed(() => connections.value.length)

const nodeCount = computed(() => {
  let count = 3 // Start, Agent Goal, End
  count += 1 // Skills node
  if (hasGuardrails.value) count += 1 // Safety node
  return count
})

const goBack = () => {
  router.push('/builder')
}

const handleTest = () => {
  router.push('/test-mode')
}

const handleSave = () => {
  // For now, just show a message and stay on the page
  alert('Workflow saved! (This is a placeholder - full editing coming soon)')
  // Stay on the current page - no navigation
}
</script>

<style scoped>
.workflow-builder {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--dt-color-surface-secondary);
}

/* Header */
.builder-header {
  background: var(--dt-color-surface-primary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  padding: var(--dt-space-500) var(--dt-space-550);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  gap: var(--dt-space-500);
}

.builder-title {
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.header-right {
  display: flex;
  gap: var(--dt-space-300);
  flex-shrink: 0;
}

.action-button {
  padding: var(--dt-space-300) var(--dt-space-450);
  background: transparent;
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-button:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.action-button.primary {
  background: var(--dt-color-purple-400);
  border-color: var(--dt-color-purple-400);
  color: var(--dt-color-surface-primary);
}

.action-button.primary:hover {
  background: var(--dt-color-purple-500);
  border-color: var(--dt-color-purple-500);
}

/* Main Container */
.builder-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--dt-space-600);
  width: 100%;
}

/* Canvas Area */
.canvas-container {
  position: relative;
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-400);
  min-height: 600px;
}

.canvas-grid {
  width: 100%;
  min-height: 600px;
  background-image:
    linear-gradient(var(--dt-color-border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--dt-color-border-subtle) 1px, transparent 1px);
  background-size: 20px 20px;
  position: relative;
  border-radius: var(--dt-size-radius-400);
}

.coming-soon-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.coming-soon-card {
  max-width: 500px;
  padding: var(--dt-space-600);
  background: var(--dt-color-surface-primary);
  border: 2px solid var(--dt-color-purple-400);
  border-radius: var(--dt-size-radius-400);
  box-shadow: var(--dt-shadow-400);
  text-align: center;
}

.coming-soon-title {
  margin: 0 0 var(--dt-space-400);
  font-size: var(--dt-font-size-500);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.coming-soon-text {
  margin: 0 0 var(--dt-space-500);
  font-size: var(--dt-font-size-200);
  line-height: 1.6;
  color: var(--dt-color-foreground-secondary);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  margin-bottom: var(--dt-space-500);
  text-align: left;
}

.feature-item {
  padding: var(--dt-space-300);
  background: var(--dt-color-purple-100);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
}

.coming-soon-note {
  margin: 0;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-purple-500);
}
</style>
