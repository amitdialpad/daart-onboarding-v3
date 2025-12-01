<template>
  <div class="path-choice-card">
    <h3 class="choice-heading">How would you like to configure your agent?</h3>

    <div class="choice-boxes">
      <!-- Box 1: Guided Path -->
      <div
        class="choice-box guided-box"
        @click="handlePathSelection('guided')"
      >
        <div class="box-header">
          <h4 class="box-title">Guide me step by step</h4>
        </div>

        <div class="box-content">
          <p class="box-description">
            Answer a few questions and we'll set everything up for you
          </p>

          <!-- Simple illustration of conversational flow -->
          <div class="illustration conversational-flow">
            <div class="flow-step" style="animation-delay: 0s">
              <div class="flow-icon ai-icon">✨</div>
              <div class="flow-message ai-message">What are your business hours?</div>
            </div>
            <div class="flow-step reverse" style="animation-delay: 0.4s">
              <div class="flow-message user-message">Monday-Friday, 9 AM - 5 PM</div>
            </div>
            <div class="flow-step" style="animation-delay: 0.8s">
              <div class="flow-icon ai-icon">✨</div>
              <div class="flow-message ai-message">Great! How long are appointments?</div>
            </div>
            <div class="flow-step reverse" style="animation-delay: 1.2s">
              <div class="flow-message user-message">30 minutes typically</div>
            </div>
            <div class="flow-step" style="animation-delay: 1.6s">
              <div class="flow-icon ai-icon">✨</div>
              <div class="flow-message ai-message">Perfect! Setting that up now...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Box 2: Advanced Builder with Canvas Preview -->
      <div
        class="choice-box advanced-box"
        @click="handlePathSelection('advanced')"
      >
        <div class="box-header">
          <h4 class="box-title">I'll configure it myself</h4>
        </div>

        <div class="box-content">
          <p class="box-description">
            Jump into the advanced builder with your agent pre-configured
          </p>

          <!-- Dynamic Canvas Preview (Agent Studio style) -->
          <div class="canvas-preview">
            <div class="canvas-workspace">
              <!-- Agent card -->
              <div class="studio-card agent-card">
                <div class="card-header">
                  <span class="card-icon">💬</span>
                  <span class="card-type">AI Agent</span>
                </div>
                <div class="card-content">
                  <div class="card-title">Agent</div>
                  <div class="card-description">{{ agentName }}</div>
                </div>
              </div>

              <!-- Skill cards (show first 2-3 skills) -->
              <div
                v-for="(skill, index) in visibleSkills"
                :key="index"
                class="studio-card skill-card"
                :style="{ top: `${40 + index * 35}px`, left: `${120 + index * 50}px` }"
              >
                <div class="card-header">
                  <span class="card-icon">◆</span>
                  <span class="card-type">Skill</span>
                  <span class="card-status">Draft</span>
                </div>
                <div class="card-content">
                  <div class="card-title">{{ skill.label }}</div>
                  <div class="card-description">{{ skill.description }}</div>
                </div>
              </div>
            </div>

            <div class="canvas-footer">
              <span class="canvas-hint">Visual workflow builder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAgentStore } from '../../stores/agent'

const emit = defineEmits(['path-selected'])

const agentStore = useAgentStore()

// Get agent name for preview
const agentName = computed(() => agentStore.name || 'Your Agent')

// Map skills to visual cards for Canvas preview (show first 2-3 only)
const visibleSkills = computed(() => {
  const skillCardMap = {
    'appointment_scheduler': {
      label: 'Bookings',
      description: 'Help customers with all booking related requests'
    },
    'form_collector': {
      label: 'Collect Forms',
      description: 'Collect and process forms from customers'
    },
    'billing_helper': {
      label: 'Billing',
      description: 'Answer billing and payment questions'
    },
    'question_answering': {
      label: 'Q&A',
      description: 'Answer common customer questions'
    },
    'prescription_refills': {
      label: 'Prescriptions',
      description: 'Handle prescription refill requests'
    },
    'reminders': {
      label: 'Reminders',
      description: 'Send reminders and notifications'
    },
    'routing': {
      label: 'Routing',
      description: 'Route inquiries to the right team'
    },
    'custom': {
      label: 'Custom',
      description: 'Perform custom tasks'
    }
  }

  // Show only first 2 skills to keep preview clean
  return agentStore.skills.slice(0, 2).map(skill => {
    const mapped = skillCardMap[skill.type]
    return mapped || { label: skill.type, description: 'Custom skill' }
  })
})

const handlePathSelection = (path) => {
  if (path === 'guided') {
    emit('path-selected', 'Guide me step by step')
  } else {
    emit('path-selected', "I'll configure it myself in the advanced builder")
  }
}
</script>

<style scoped>
.path-choice-card {
  padding: var(--dt-space-500);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
}

.choice-heading {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  line-height: 1.4;
  margin: 0;
  text-align: center;
}

.choice-boxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--dt-space-500);
}

.choice-box {
  background: var(--dt-color-surface-primary);
  border: 2px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-500);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  min-height: 320px;
}

.choice-box:hover {
  border-color: var(--dt-color-purple-400);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.choice-box:active {
  transform: translateY(0);
}

.box-header {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
}

.box-title {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-semibold);
  color: var(--dt-color-foreground-primary);
  margin: 0;
}

.box-content {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
  flex: 1;
}

.box-description {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.5;
  margin: 0;
}

/* Conversational Flow Illustration */
.illustration {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--dt-space-350);
}

.flow-step {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-350);
  opacity: 0;
  animation: messageSlideIn 0.4s ease-out forwards;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.flow-step.reverse {
  flex-direction: row-reverse;
}

.flow-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-semibold);
  flex-shrink: 0;
}

.ai-icon {
  background: rgba(255, 255, 255, 0.9);
  color: var(--dt-color-purple-600);
  font-size: 18px;
}

.user-icon {
  background: transparent;
  color: var(--dt-color-foreground-secondary);
  font-size: 16px;
}

.flow-message {
  padding: var(--dt-space-350) var(--dt-space-400);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-100);
  line-height: 1.4;
  max-width: 200px;
}

.ai-message {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
}

.user-message {
  background: var(--dt-color-blue-100);
  color: var(--dt-color-foreground-primary);
}

/* Canvas Preview - Agent Studio Style */
.canvas-preview {
  flex: 1;
  background:
    radial-gradient(circle, rgba(0, 0, 0, 0.03) 1px, transparent 1px),
    var(--dt-color-surface-secondary);
  background-size: 16px 16px;
  border-radius: var(--dt-size-radius-300);
  padding: var(--dt-space-400);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-350);
  position: relative;
  overflow: hidden;
}

.canvas-workspace {
  flex: 1;
  position: relative;
  min-height: 180px;
}

/* Studio Card (Agent and Skill cards) */
.studio-card {
  position: absolute;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  padding: var(--dt-space-350);
  min-width: 140px;
  max-width: 160px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: transform 0.15s ease;
}

.studio-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.agent-card {
  top: 20px;
  left: 20px;
}

.skill-card {
  /* Positioned dynamically via inline styles */
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--dt-space-300);
  margin-bottom: var(--dt-space-300);
  padding-bottom: var(--dt-space-300);
  border-bottom: 1px solid var(--dt-color-border-subtle);
}

.card-icon {
  font-size: 12px;
  line-height: 1;
}

.card-type {
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  flex: 1;
}

.card-status {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
  background: var(--dt-color-surface-secondary);
  padding: 2px 6px;
  border-radius: var(--dt-size-radius-200);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
}

.card-title {
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-semibold);
  color: var(--dt-color-foreground-primary);
  line-height: 1.3;
}

.card-description {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.canvas-footer {
  padding-top: var(--dt-space-300);
  border-top: 1px solid var(--dt-color-border-subtle);
  text-align: center;
}

.canvas-hint {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
  font-style: italic;
}

/* Responsive */
@media (max-width: 1024px) {
  .choice-boxes {
    grid-template-columns: 1fr;
  }

  .choice-box {
    min-height: auto;
  }
}
</style>
