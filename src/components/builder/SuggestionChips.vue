<template>
  <div class="suggestion-chips">
    <button
      v-for="(suggestion, index) in suggestions"
      :key="index"
      @click="handleChipClick(suggestion)"
      class="suggestion-chip"
    >
      {{ suggestion }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  suggestions: {
    type: Array,
    required: true,
    // Array of suggestion strings
  }
})

const emit = defineEmits(['chip-clicked'])

const handleChipClick = (suggestion) => {
  emit('chip-clicked', suggestion)
}
</script>

<style scoped>
.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--dt-space-300);
  margin-top: var(--dt-space-350);
}

.suggestion-chip {
  padding: var(--dt-space-300) var(--dt-space-400);
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-400);
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.suggestion-chip:hover {
  background: var(--dt-color-purple-100);
  border-color: var(--dt-color-purple-300);
  color: var(--dt-color-purple-600);
}

.suggestion-chip:active {
  transform: scale(0.97);
}
</style>
