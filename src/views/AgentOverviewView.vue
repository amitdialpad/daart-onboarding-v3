<template>
  <div class="agent-overview">
    <!-- Header -->
    <div class="overview-header">
      <div class="header-content">
        <h1 class="overview-title">{{ agentName }}</h1>
      </div>
    </div>

    <!-- Content -->
    <div class="overview-content">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Status</div>
          <div class="stat-value" :class="statusClass">{{ statusText }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Connections</div>
          <div class="stat-value">{{ connectionCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Safety Rules</div>
          <div class="stat-value">{{ safetyRulesCount }}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Last Updated</div>
          <div class="stat-value">Just now</div>
        </div>
      </div>

      <!-- Details Section -->
      <div class="details-section">
        <h2 class="section-title">Agent Configuration</h2>

        <div class="detail-card">
          <h3 class="card-title">Goal</h3>
          <p class="card-content">{{ agentGoal || 'Not specified' }}</p>
        </div>

        <div class="detail-card">
          <h3 class="card-title">Foundation</h3>
          <div class="config-grid">
            <div class="config-item">
              <span class="config-label">Purpose:</span>
              <span class="config-value">{{ foundation.purpose || 'Not set' }}</span>
            </div>
            <div class="config-item">
              <span class="config-label">Business Hours:</span>
              <span class="config-value">{{ foundation.businessHours || 'Not set' }}</span>
            </div>
            <div class="config-item">
              <span class="config-label">Appointment Duration:</span>
              <span class="config-value">{{ foundation.appointmentDuration || 'Not set' }}</span>
            </div>
            <div class="config-item">
              <span class="config-label">Buffer Time:</span>
              <span class="config-value">{{ foundation.bufferTime || 'Not set' }}</span>
            </div>
          </div>
        </div>

        <div class="detail-card">
          <h3 class="card-title">Connections</h3>
          <div v-if="connections.length > 0" class="connections-list">
            <div v-for="conn in connections" :key="conn.type" class="connection-item">
              <span class="connection-badge" :class="conn.type">{{ conn.type }}</span>
              <span class="connection-name">{{ conn.name }}</span>
            </div>
          </div>
          <p v-else class="empty-state">No connections configured</p>
        </div>

        <div class="detail-card">
          <h3 class="card-title">Safety & Guardrails</h3>
          <div class="config-grid">
            <div v-if="guardrails.identityVerification" class="config-item">
              <span class="config-label">Identity Verification:</span>
              <span class="config-value">{{ guardrails.identityVerification }}</span>
            </div>
            <div v-if="guardrails.businessRules && guardrails.businessRules.length > 0" class="config-item full-width">
              <span class="config-label">Business Rules:</span>
              <ul class="rules-list">
                <li v-for="(rule, index) in guardrails.businessRules" :key="index">{{ rule }}</li>
              </ul>
            </div>
          </div>
          <p v-if="!guardrails.identityVerification && (!guardrails.businessRules || guardrails.businessRules.length === 0)" class="empty-state">No guardrails configured</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAgentStore } from '../stores/agent'

const route = useRoute()
const router = useRouter()
const agentStore = useAgentStore()

const agentName = computed(() => agentStore.name || 'New AI Agent')
const agentGoal = computed(() => agentStore.goal)
const foundation = computed(() => agentStore.foundation || {})
const connections = computed(() => agentStore.connections || [])
const guardrails = computed(() => agentStore.guardrails || {})

const connectionCount = computed(() => connections.value.length)
const safetyRulesCount = computed(() => {
  let count = 0
  if (guardrails.value.identityVerification) count++
  if (guardrails.value.businessRules && guardrails.value.businessRules.length > 0) {
    count += guardrails.value.businessRules.length
  }
  return count
})

// Check if agent is deployed
const isDeployed = computed(() => agentStore.status === 'deployed')

// Status text and styling
const statusText = computed(() => {
  if (agentStore.status === 'deployed') return 'Deployed'
  if (agentStore.hasCompletedOnboarding) return 'Ready'
  return 'Draft'
})

const statusClass = computed(() => {
  if (agentStore.status === 'deployed') return 'status-deployed'
  if (agentStore.hasCompletedOnboarding) return 'status-ready'
  return 'status-draft'
})

const goBack = () => {
  // If deployed, go to home. If not deployed (still building), go back to builder
  if (isDeployed.value) {
    router.push('/')
  } else {
    router.push('/builder')
  }
}

const goToTest = () => {
  router.push('/test-mode')
}

const goToDeploy = () => {
  router.push('/deploy')
}

const goToMonitor = () => {
  router.push('/monitor')
}

const editAgent = () => {
  // If deployed, warn or prevent editing. For now, always allow going to builder
  router.push('/builder')
}
</script>

<style scoped>
.agent-overview {
  min-height: 100vh;
  background: var(--dt-color-surface-secondary);
}

/* Header */
.overview-header {
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

.back-button {
  padding: var(--dt-space-300) var(--dt-space-450);
  background: transparent;
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.overview-title {
  flex: 1;
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.header-actions {
  display: flex;
  gap: var(--dt-space-300);
}

.action-button {
  padding: var(--dt-space-400) var(--dt-space-500);
  background: transparent;
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: all 0.2s ease;
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

/* Content */
.overview-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--dt-space-600);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--dt-space-500);
  margin-bottom: var(--dt-space-600);
}

.stat-card {
  background: var(--dt-color-surface-primary);
  padding: var(--dt-space-500);
  border-radius: var(--dt-size-radius-400);
  border: 1px solid var(--dt-color-border-subtle);
}

.stat-label {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  margin-bottom: var(--dt-space-200);
}

.stat-value {
  font-size: var(--dt-font-size-500);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.stat-value.status-deployed {
  color: var(--dt-color-green-600);
}

.stat-value.status-ready {
  color: var(--dt-color-purple-500);
}

.stat-value.status-draft {
  color: var(--dt-color-foreground-secondary);
}

/* Details Section */
.details-section {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
}

.section-title {
  margin: 0 0 var(--dt-space-400);
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.detail-card {
  background: var(--dt-color-surface-primary);
  padding: var(--dt-space-550);
  border-radius: var(--dt-size-radius-400);
  border: 1px solid var(--dt-color-border-subtle);
}

.card-title {
  margin: 0 0 var(--dt-space-400);
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.card-content {
  margin: 0;
  font-size: var(--dt-font-size-200);
  line-height: 1.5;
  color: var(--dt-color-foreground-secondary);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--dt-space-400);
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
}

.config-item.full-width {
  grid-column: 1 / -1;
}

.config-label {
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.config-value {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
}

.connections-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
}

.connection-item {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: var(--dt-space-400);
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-300);
}

.connection-badge {
  display: inline-block;
  padding: 4px var(--dt-space-300);
  border-radius: var(--dt-size-radius-200);
  font-size: 11px;
  font-weight: var(--dt-font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.connection-badge.calendar {
  background: var(--dt-color-blue-100);
  color: var(--dt-color-blue-500);
}

.connection-badge.video {
  background: var(--dt-color-purple-100);
  color: var(--dt-color-purple-500);
}

.connection-name {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
}

.rules-list {
  margin: var(--dt-space-300) 0 0;
  padding-left: var(--dt-space-500);
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
}

.rules-list li {
  margin-bottom: var(--dt-space-200);
}

.empty-state {
  margin: 0;
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-tertiary);
  font-style: italic;
}
</style>
