<template>
  <div class="skill-selector">
    <div class="skill-options">
      <label
        v-for="skill in skills"
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

    <button
      @click="handleContinue"
      :disabled="selectedSkills.length === 0"
      class="continue-button"
    >
      Continue with selected skills
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  skills: {
    type: Array,
    required: true,
    // Array of { id: string, label: string }
  }
})

const emit = defineEmits(['continue'])

const selectedSkills = ref([])

const isSelected = (skillId) => {
  return selectedSkills.value.includes(skillId)
}

const toggleSkill = (skillId) => {
  const index = selectedSkills.value.indexOf(skillId)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  } else {
    selectedSkills.value.push(skillId)
  }
}

const handleContinue = () => {
  if (selectedSkills.value.length > 0) {
    emit('continue', selectedSkills.value)
  }
}
</script>

<style scoped>
.skill-selector {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  padding: var(--dt-space-400);
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
  background: var(--dt-color-purple-400);
  border: none;
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.continue-button:hover:not(:disabled) {
  background: var(--dt-color-purple-500);
}

.continue-button:disabled {
  background: var(--dt-color-surface-moderate);
  color: var(--dt-color-foreground-disabled);
  cursor: not-allowed;
}

.continue-button:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
