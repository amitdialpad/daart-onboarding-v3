<template>
  <div id="app" class="daart-v3">
    <AppLayout v-if="shouldShowLayout">
      <RouterView />
    </AppLayout>
    <RouterView v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useAgentStore } from './stores/agent'
import AppLayout from './layouts/AppLayout.vue'

const route = useRoute()
const agentStore = useAgentStore()

const shouldShowLayout = computed(() => {
  // Hide layout on starting point page
  if (route.meta.hideLayout) return false

  // Hide layout during onboarding (any route when not completed)
  if (!agentStore.hasCompletedOnboarding) {
    return false
  }

  // Show layout everywhere else
  return true
})
</script>

<style>
/* Global app styles */
#app {
  min-height: 100vh;
  background-color: var(--dt-color-surface-primary);
}

.daart-v3 {
  font-family: var(--dt-font-family-sans);
  color: var(--dt-color-foreground-primary);
}
</style>
