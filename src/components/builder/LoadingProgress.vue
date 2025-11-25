<template>
  <div class="loading-progress">
    <div class="progress-header">
      <span class="progress-title">{{ title }}</span>
    </div>

    <div class="progress-items">
      <div
        v-for="(item, index) in itemsWithStatus"
        :key="index"
        :class="['progress-item', item.status]"
      >
        <div class="progress-icon">
          <span v-if="item.status === 'completed'" class="completed-dot"></span>
          <span v-else-if="item.status === 'in_progress'" class="active-dot"></span>
          <span v-else class="dot"></span>
        </div>
        <div class="progress-content">
          <div class="progress-label">{{ item.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useConversationStore } from '../../stores/conversation'

const props = defineProps({
  title: {
    type: String,
    default: 'Configuring your agent...'
  },
  items: {
    type: Array,
    required: true,
    // Each item: { label: string, description: string }
  }
})

const conversationStore = useConversationStore()

// Compute status for each item based on current phase
const itemsWithStatus = computed(() => {
  const currentPhase = conversationStore.currentPhase.number

  return props.items.map((item, index) => {
    const phaseNumber = index + 1
    let status = 'pending'

    if (phaseNumber < currentPhase) {
      status = 'completed'
    } else if (phaseNumber === currentPhase) {
      status = 'in_progress'
    }

    return {
      ...item,
      status
    }
  })
})
</script>

<style scoped>
.loading-progress {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-500);
}

.progress-header {
  margin-bottom: var(--dt-space-500);
  padding-bottom: var(--dt-space-400);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.progress-title {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-semibold);
  color: var(--dt-color-foreground-primary);
}

.progress-items {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
}

.progress-item {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-350);
  transition: opacity 0.3s ease;
}

.progress-item.pending {
  opacity: 0.5;
}

.progress-item.in_progress {
  opacity: 1;
}

.progress-item.completed {
  opacity: 0.8;
}

.progress-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-250);
}

.progress-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.completed-dot {
  width: 8px;
  height: 8px;
  background: var(--dt-color-foreground-primary);
  border-radius: 50%;
}

.active-dot {
  width: 8px;
  height: 8px;
  background: var(--dt-color-foreground-primary);
  border-radius: 50%;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--dt-color-border-moderate);
  border-radius: 50%;
}

.progress-label {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  font-weight: var(--dt-font-weight-semibold);
  line-height: 1.4;
}

.progress-description {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
  font-weight: var(--dt-font-weight-normal);
  line-height: 1.4;
}
</style>
