<template>
  <div class="chat-header">
    <div class="header-content">
      <!-- Left: Agent name -->
      <h1 class="agent-name">{{ agentName }}</h1>

      <!-- Right: Action buttons -->
      <div class="header-actions">
        <button @click="$emit('save-and-exit')" class="save-exit-button">
          Save & Exit
        </button>
        <button @click="$emit('preview-agent')" class="preview-button">
          Preview Agent
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAgentStore } from '../../stores/agent'

defineEmits(['preview-agent', 'save-and-exit'])

const agentStore = useAgentStore()

const agentName = computed(() => agentStore.name || 'New AI Agent')
</script>

<style scoped>
.chat-header {
  background: var(--dt-color-surface-primary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  padding: var(--dt-space-450) var(--dt-space-550);
  gap: var(--dt-space-500);
}

.agent-name {
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-semibold);
  color: var(--dt-color-foreground-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  flex-shrink: 0;
}

.save-exit-button {
  padding: var(--dt-space-300) var(--dt-space-450);
  background: transparent;
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.save-exit-button:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
  color: var(--dt-color-foreground-primary);
}

.save-exit-button:active {
  transform: scale(0.98);
}

.preview-button {
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

.preview-button:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.preview-button:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    padding: var(--dt-space-400) var(--dt-space-450);
  }

  .agent-name {
    font-size: var(--dt-font-size-200);
  }

  .header-actions {
    gap: var(--dt-space-300);
  }

  .save-exit-button,
  .preview-button {
    padding: var(--dt-space-300) var(--dt-space-400);
    font-size: var(--dt-font-size-100);
  }
}
</style>
