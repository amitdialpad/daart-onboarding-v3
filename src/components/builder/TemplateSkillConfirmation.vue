<template>
  <div class="template-skill-confirmation">
    <!-- Heading -->
    <h3 class="confirmation-heading">
      Great! we're going to build an agent that focus on {{ agentGoal }}.
      So far, this agent is going to be able to:
    </h3>

    <!-- Capabilities List (checkmarks) -->
    <div class="capabilities-list">
      <div v-for="(capability, index) in capabilities" :key="index" class="capability-item">
        <span class="checkmark">✓</span>
        <span class="capability-text">{{ capability }}</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <button
        @click="handleContinue"
        class="continue-button primary"
      >
        Continue
      </button>

      <button
        v-if="!showAdditionalSkills"
        @click="showAdditionalSkills = true"
        class="continue-button secondary"
      >
        Add more skills
      </button>
    </div>

    <!-- Additional Skills Section (Progressive Disclosure) -->
    <div v-if="showAdditionalSkills" class="additional-skills-section">
      <p class="additional-skills-text">
        Select any additional skills you'd like to add:
      </p>

      <!-- Additional Skills Checkboxes -->
      <div class="skill-options">
        <label
          v-for="skill in additionalSkills"
          :key="skill.id"
          class="skill-option"
          :class="{ selected: isSelected(skill.id) }"
        >
          <input
            type="checkbox"
            :value="skill.id"
            :checked="isSelected(skill.id)"
            @change="toggleSkill(skill.id)"
            class="skill-checkbox"
          />
          <span class="skill-label">{{ skill.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  agentGoal: {
    type: String,
    required: true
  },
  preSelectedSkills: {
    type: Array,
    required: true,
    // Array of skill IDs like ['appointment_scheduler', 'reminders']
  },
  additionalSkills: {
    type: Array,
    required: true,
    // Array of { id: string, label: string } for additional skills
  }
})

const emit = defineEmits(['continue'])

const showAdditionalSkills = ref(false)
const selectedAdditionalSkills = ref([])

// Map skills to their capabilities
const skillCapabilities = {
  'appointment_scheduler': [
    'Connect with a calendar',
    'Collect appointment details and check availability',
    'Book and cancel appointments',
    'Send confirmations'
  ],
  'reminders': [
    'Send reminders'
  ],
  'form_collector': [
    'Collect forms'
  ],
  'billing_helper': [
    'Answer billing questions'
  ],
  'question_answering': [
    'Answer common questions'
  ],
  'prescription_refills': [
    'Handle prescription refills'
  ],
  'routing': [
    'Route inquiries to the right team'
  ],
  'custom': [
    'Perform custom tasks'
  ]
}

// Get all capabilities from pre-selected skills
const capabilities = computed(() => {
  const allCapabilities = []
  props.preSelectedSkills.forEach(skillId => {
    const skillCaps = skillCapabilities[skillId] || []
    allCapabilities.push(...skillCaps)
  })
  return allCapabilities
})

const isSelected = (skillId) => {
  return selectedAdditionalSkills.value.includes(skillId)
}

const toggleSkill = (skillId) => {
  const index = selectedAdditionalSkills.value.indexOf(skillId)
  if (index > -1) {
    selectedAdditionalSkills.value.splice(index, 1)
  } else {
    selectedAdditionalSkills.value.push(skillId)
  }
}

const handleContinue = () => {
  // Emit all skills (pre-selected + newly selected additional ones)
  const allSkills = [...props.preSelectedSkills, ...selectedAdditionalSkills.value]
  emit('continue', allSkills)
}
</script>

<style scoped>
.template-skill-confirmation {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  padding: var(--dt-space-400);
  max-width: 600px;
}

.confirmation-heading {
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  line-height: 1.4;
  margin: 0 0 var(--dt-space-400) 0;
}

.capabilities-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-350);
  margin-bottom: var(--dt-space-400);
}

.capability-item {
  display: flex;
  align-items: flex-start;
  gap: var(--dt-space-350);
  padding: var(--dt-space-400);
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-300);
}

.checkmark {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dt-color-green-200);
  color: var(--dt-color-green-600);
  border-radius: 50%;
  font-size: 14px;
  font-weight: var(--dt-font-weight-bold);
}

.capability-text {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  font-weight: var(--dt-font-weight-normal);
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: var(--dt-space-400);
  align-items: center;
}

.additional-skills-section {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
  margin-top: var(--dt-space-400);
  animation: slideIn 0.2s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.additional-skills-text {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.5;
  margin: 0;
}

.skill-options {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-350);
}

.skill-option {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
  padding: var(--dt-space-400) var(--dt-space-450);
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  cursor: pointer;
  transition: all 0.15s ease;
}

.skill-option:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.skill-option.selected {
  background: var(--dt-color-purple-100);
  border-color: var(--dt-color-purple-300);
}

.skill-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.skill-label {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  font-weight: var(--dt-font-weight-normal);
  cursor: pointer;
  user-select: none;
}

.continue-button {
  padding: var(--dt-space-450) var(--dt-space-500);
  border: none;
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-button.primary {
  background: var(--dt-color-purple-400);
  color: white;
}

.continue-button.primary:hover {
  background: var(--dt-color-purple-500);
}

.continue-button.secondary {
  background: transparent;
  color: var(--dt-color-purple-400);
  border: 1px solid var(--dt-color-purple-400);
}

.continue-button.secondary:hover {
  background: var(--dt-color-purple-100);
  border-color: var(--dt-color-purple-500);
  color: var(--dt-color-purple-500);
}

.continue-button:active {
  transform: scale(0.98);
}
</style>
