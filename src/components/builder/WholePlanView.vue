<template>
  <div class="whole-plan-view">
    <!-- Full plan view -->
    <div v-if="!isCollapsed">
      <!-- Phase Overview Header -->
      <div class="phases-header">
        <h3 class="phases-title">6-Phase Build Plan</h3>
        <p class="phases-subtitle">Foundation → Connect → Safety → Validate → Design → Test</p>
      </div>

      <!-- Detailed Phases -->
      <div class="plan-phases">
        <div
          v-for="(phase, index) in phases"
          :key="phase.number"
          class="phase-card"
        >
          <div class="phase-number">Phase {{ phase.number }}</div>
          <h4 class="phase-title">{{ phase.title }}</h4>
          <p class="phase-description">{{ phase.description }}</p>

          <div v-if="phase.items && phase.items.length > 0" class="phase-items">
            <div v-for="item in phase.items" :key="item" class="phase-item">
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Section -->
      <div class="action-section">
        <h4 class="action-title">How would you like to proceed?</h4>
        <div class="action-buttons">
          <button
            @click="handleCancel"
            class="action-btn secondary-action"
            :disabled="isProcessing"
            :class="{ selected: selectedAction === 'cancel' }"
          >
            {{ selectedAction === 'cancel' ? 'Starting guided setup...' : 'Guide me step by step' }}
          </button>
          <button
            @click="handleConfirm"
            class="action-btn primary-action"
            :disabled="isProcessing"
            :class="{ selected: selectedAction === 'confirm' }"
          >
            {{ selectedAction === 'confirm' ? 'Running plan...' : 'Run the whole plan' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Collapsed summary view -->
    <div v-else class="plan-summary">
      <p class="summary-text">
        <strong>{{ selectedAction === 'confirm' ? 'Running' : 'Starting' }} 6-Phase Build Plan:</strong>
        Foundation → Connect → Safety → Validate → Design → Test
      </p>
      <button @click="isCollapsed = false" class="view-details-btn">
        View plan details
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['confirm', 'cancel'])
const isProcessing = ref(false)
const selectedAction = ref(null)
const isCollapsed = ref(false)

const handleConfirm = () => {
  if (isProcessing.value) return
  isProcessing.value = true
  selectedAction.value = 'confirm'
  isCollapsed.value = true
  emit('confirm')
}

const handleCancel = () => {
  if (isProcessing.value) return
  isProcessing.value = true
  selectedAction.value = 'cancel'
  isCollapsed.value = true
  emit('cancel')
}

const phases = [
  {
    number: 1,
    title: 'Agent Foundation & Tasks',
    description: 'Define your company context and the specific tasks you want your agent to handle',
    items: [
      'Company information',
      'Business hours & scheduling rules',
      'Core agent tasks'
    ]
  },
  {
    number: 2,
    title: 'Connect Tools',
    description: 'Connect tools and platforms your agent needs to access',
    items: [
      'Calendar integration (Google Calendar, Outlook)',
      'Video conferencing (Zoom, Google Meet)',
      'CRM or other platforms'
    ]
  },
  {
    number: 3,
    title: 'Safety & Guardrails',
    description: 'Set boundaries to ensure your agent operates safely',
    items: [
      'Safety rules',
      'Identity verification',
      'Business rules & constraints'
    ]
  },
  {
    number: 4,
    title: 'Validate & Refine',
    description: 'Review progress and make improvements',
    items: [
      'Identify gaps',
      'Apply suggested improvements',
      'Finalize configuration'
    ]
  },
  {
    number: 5,
    title: 'Design Conversations',
    description: 'Build conversation flows for key interactions',
    items: [
      'Scheduling flows',
      'Rescheduling logic',
      'Confirmations & follow-ups'
    ]
  },
  {
    number: 6,
    title: 'Test & Launch',
    description: 'Validate everything works as expected',
    items: [
      'Run test scenarios',
      'Generate demo link',
      'Deploy when ready'
    ]
  }
]
</script>

<style scoped>
.whole-plan-view {
  padding: 0;
  margin: var(--dt-space-400) 0;
}

/* Action Section */
.action-section {
  margin-top: var(--dt-space-550);
  padding: var(--dt-space-500);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  text-align: center;
}

.action-title {
  margin: 0 0 var(--dt-space-450);
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.action-buttons {
  display: flex;
  gap: var(--dt-space-350);
  justify-content: center;
  align-items: center;
}

.action-btn {
  padding: var(--dt-space-350) var(--dt-space-500);
  border-radius: var(--dt-size-radius-400);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  border: 1px solid;
  white-space: nowrap;
}

.action-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn.selected {
  opacity: 1;
}

.primary-action {
  border-color: var(--dt-color-purple-400);
  background: var(--dt-color-purple-400);
  color: var(--dt-color-foreground-primary-inverted);
}

.primary-action:hover:not(:disabled) {
  background: var(--dt-color-purple-500);
  border-color: var(--dt-color-purple-500);
}

.secondary-action {
  border-color: var(--dt-color-border-moderate);
  background: var(--dt-color-surface-primary);
  color: var(--dt-color-foreground-primary);
}

.secondary-action:hover:not(:disabled) {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

/* Phase Overview Header */
.phases-header {
  margin-bottom: var(--dt-space-450);
}

.phases-title {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-bold);
  color: var(--dt-color-foreground-primary);
  margin: 0 0 var(--dt-space-300);
  text-align: left;
}

.phases-subtitle {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  margin: 0;
  text-align: left;
}

/* Phase Grid */
.plan-phases {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--dt-space-400);
}

.phase-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-450);
  transition: all 0.2s ease;
}

.phase-card:hover {
  border-color: var(--dt-color-border-moderate);
  box-shadow: var(--dt-shadow-200);
}

.phase-number {
  display: inline-block;
  padding: var(--dt-space-200) var(--dt-space-350);
  background: var(--dt-color-purple-100);
  color: var(--dt-color-purple-600);
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-bold);
  border-radius: var(--dt-size-radius-300);
  margin-bottom: var(--dt-space-350);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.phase-title {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-bold);
  color: var(--dt-color-foreground-primary);
  margin: 0 0 var(--dt-space-300);
}

.phase-description {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.5;
  margin: 0 0 var(--dt-space-400);
}

.phase-items {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-250);
}

.phase-item {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
  padding-left: var(--dt-space-400);
  position: relative;
}

.phase-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--dt-color-purple-400);
  font-weight: bold;
}

/* Plan Summary (collapsed state) */
.plan-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dt-space-450);
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  gap: var(--dt-space-400);
}

.summary-text {
  margin: 0;
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  line-height: 1.5;
}

.summary-text strong {
  font-weight: var(--dt-font-weight-medium);
}

.view-details-btn {
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
  flex-shrink: 0;
}

.view-details-btn:hover {
  background: var(--dt-color-surface-tertiary);
  border-color: var(--dt-color-border-strong);
}

.view-details-btn:active {
  transform: scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .plan-phases {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }

  .plan-summary {
    flex-direction: column;
    text-align: center;
  }

  .view-details-btn {
    width: 100%;
  }
}
</style>
