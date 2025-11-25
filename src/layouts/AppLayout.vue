<template>
  <div class="app-layout">
    <!-- Left Navigation Sidebar -->
    <aside class="app-sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-logo">DAART</h1>
        <div class="agent-selector">
          <span class="agent-name">{{ agentName }}</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <router-link
          :to="overviewPath"
          class="nav-item"
          :class="{ active: isActiveOverview, disabled: !canAccessOverview }"
          @click.prevent="!canAccessOverview && $event.preventDefault()"
        >
          <span class="nav-label">Overview</span>
        </router-link>

        <div class="nav-divider"></div>

        <router-link :to="buildPath" class="nav-item" :class="{ active: isActiveBuild }">
          <span class="nav-label">Agent Studio</span>
          <span v-if="!agentStore.hasCompletedOnboarding && isActive('/builder')" class="nav-badge">In Progress</span>
        </router-link>

        <router-link
          to="/test-mode"
          class="nav-item"
          :class="{ active: isActive('/test-mode'), disabled: !canAccessTest }"
          @click.prevent="!canAccessTest && $event.preventDefault()"
        >
          <span class="nav-label">Test</span>
        </router-link>

        <router-link
          to="/deploy"
          class="nav-item"
          :class="{ active: isActive('/deploy'), disabled: !canAccessDeploy }"
          @click.prevent="!canAccessDeploy && $event.preventDefault()"
        >
          <span class="nav-label">Deploy</span>
        </router-link>

        <router-link
          to="/monitor"
          class="nav-item"
          :class="{ active: isActive('/monitor'), disabled: !canAccessMonitor }"
          @click.prevent="!canAccessMonitor && $event.preventDefault()"
        >
          <span class="nav-label">Monitor</span>
          <span v-if="showNotDeployedBadge" class="nav-badge status-badge">Not Deployed</span>
        </router-link>

        <div class="nav-divider"></div>

        <router-link
          to="/knowledge"
          class="nav-item"
          :class="{ active: isActive('/knowledge'), disabled: !canAccessAdvanced }"
          @click.prevent="!canAccessAdvanced && $event.preventDefault()"
        >
          <span class="nav-label">Knowledge</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="footer-link">Help & Docs</button>
        <button class="footer-link">Settings</button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAgentStore } from '../stores/agent'

const route = useRoute()
const agentStore = useAgentStore()

const agentName = computed(() => agentStore.name || 'My Agent')

const overviewPath = computed(() => {
  const agentId = agentStore.name?.toLowerCase().replace(/\s+/g, '-') || '1'
  return `/agent/${agentId}/overview`
})

const buildPath = computed(() => {
  // After onboarding, "Build" goes to Agent Studio
  // During onboarding, "Build" goes to conversational builder
  return agentStore.hasCompletedOnboarding ? '/agent-studio' : '/builder'
})

const isActive = (path) => {
  return route.path.startsWith(path)
}

// Specific active state checks to prevent overlap
const isActiveOverview = computed(() => {
  // Only active for /agent/:id/overview paths, not /agent-studio
  return route.path.includes('/agent/') && route.path.includes('/overview')
})

const isActiveBuild = computed(() => {
  // Active for /builder or /agent-studio
  return route.path.startsWith('/builder') || route.path.startsWith('/agent-studio')
})

// Access control based on agent status
// Status flow: 'draft' → 'in_progress' → 'ready' → 'deployed'
const canAccessOverview = computed(() => {
  // Can view overview once onboarding is complete
  return agentStore.hasCompletedOnboarding
})

const canAccessTest = computed(() => {
  // Can test once agent is ready (onboarding complete)
  return agentStore.hasCompletedOnboarding
})

const canAccessDeploy = computed(() => {
  // Can deploy once agent is ready (onboarding complete)
  return agentStore.hasCompletedOnboarding
})

const canAccessMonitor = computed(() => {
  // Can only monitor once deployed
  return agentStore.status === 'deployed'
})

const canAccessAdvanced = computed(() => {
  // Advanced features (Agent Studio, Knowledge) available after onboarding
  return agentStore.hasCompletedOnboarding
})

const showNotDeployedBadge = computed(() => {
  // Show "Not Deployed" badge when agent is ready but not yet deployed
  return agentStore.hasCompletedOnboarding && agentStore.status !== 'deployed'
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--dt-color-surface-secondary);
}

/* Sidebar */
.app-sidebar {
  width: 240px;
  background: var(--dt-color-surface-primary);
  border-right: 1px solid var(--dt-color-border-subtle);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}

.sidebar-header {
  padding: var(--dt-space-500);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.sidebar-logo {
  margin: 0 0 var(--dt-space-400);
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-bold);
  color: var(--dt-color-purple-400);
}

.agent-selector {
  padding: var(--dt-space-300);
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-300);
  cursor: pointer;
  transition: background 0.2s ease;
}

.agent-selector:hover {
  background: var(--dt-color-surface-tertiary);
}

.agent-name {
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: var(--dt-space-400) 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: var(--dt-space-350) var(--dt-space-500);
  text-decoration: none;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover:not(.disabled) {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
}

.nav-item.active {
  background: var(--dt-color-purple-50);
  color: var(--dt-color-purple-500);
  border-left-color: var(--dt-color-purple-500);
  font-weight: var(--dt-font-weight-bold);
  border-left-width: 4px;
}

.nav-item.disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  padding: 2px 8px;
  background: var(--dt-color-purple-100);
  color: var(--dt-color-purple-600);
  font-size: 10px;
  font-weight: var(--dt-font-weight-medium);
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-badge.status-badge {
  background: var(--dt-color-red-100);
  color: var(--dt-color-red-600);
}

.nav-hint {
  font-size: 10px;
  color: var(--dt-color-foreground-tertiary);
  font-style: italic;
}

.nav-divider {
  height: 1px;
  background: var(--dt-color-border-subtle);
  margin: var(--dt-space-400) var(--dt-space-500);
}

/* Footer */
.sidebar-footer {
  padding: var(--dt-space-400) var(--dt-space-500);
  border-top: 1px solid var(--dt-color-border-subtle);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
}

.footer-link {
  padding: var(--dt-space-300);
  background: transparent;
  border: none;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-medium);
  text-align: left;
  cursor: pointer;
  border-radius: var(--dt-size-radius-300);
  transition: all 0.2s ease;
}

.footer-link:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
}

/* Main Content */
.app-main {
  flex: 1;
  overflow-y: auto;
  min-width: 0;
  background: #f9f9f9;
  margin-left: 240px;
}

/* Responsive */
@media (max-width: 768px) {
  .app-sidebar {
    width: 60px;
  }

  .sidebar-logo,
  .agent-selector,
  .nav-label,
  .sidebar-footer {
    display: none;
  }

  .nav-item {
    justify-content: center;
    padding: var(--dt-space-350) var(--dt-space-300);
    font-size: var(--dt-font-size-100);
  }
}
</style>
