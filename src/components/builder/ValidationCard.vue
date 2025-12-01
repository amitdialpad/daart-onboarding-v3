<template>
  <div class="validation-container">
    <!-- Header -->
    <div class="validation-header">
      <h3>Validation Complete</h3>
      <p class="validation-subtitle">
        Found {{ improvements.length }} improvements that could enhance your agent
      </p>
    </div>

    <!-- Improvement Cards -->
    <div class="improvements-list">
      <div
        v-for="(improvement, index) in improvements"
        :key="index"
        class="improvement-card"
        :class="{ expanded: expandedCards[index] }"
      >
        <button
          @click="toggleCard(index)"
          class="card-header"
        >
          <div class="card-header-left">
            <span class="card-number">{{ index + 1 }}</span>
            <div class="card-title-group">
              <h4 class="card-title">{{ improvement.title }}</h4>
              <span class="card-badge" :class="improvement.type">
                {{ improvement.type }}
              </span>
            </div>
          </div>
          <span class="expand-icon">
            {{ expandedCards[index] ? '−' : '+' }}
          </span>
        </button>

        <div v-if="expandedCards[index]" class="card-content">
          <p class="card-description">{{ improvement.description }}</p>

          <div v-if="improvement.details" class="card-details">
            <p class="details-label">What this means:</p>
            <p class="details-text">{{ improvement.details }}</p>
          </div>

          <div v-if="improvement.impact" class="card-impact">
            <div class="impact-label">Impact:</div>
            <div class="impact-text">{{ improvement.impact }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="validation-actions">
      <button
        @click="$emit('apply-all')"
        class="action-button primary"
      >
        Apply All Improvements
      </button>
      <button
        @click="$emit('review-each')"
        class="action-button secondary"
      >
        Review Each Individually
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  improvements: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['apply-all', 'review-each'])

// Track which cards are expanded
const expandedCards = ref({})

const toggleCard = (index) => {
  expandedCards.value[index] = !expandedCards.value[index]
}
</script>

<style scoped>
.validation-container {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-500);
  padding: var(--dt-space-450);
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-400);
  margin: var(--dt-space-300) 0;
}

/* Header */
.validation-header {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
}

.validation-header h3 {
  margin: 0;
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.validation-subtitle {
  margin: 0;
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.5;
}

/* Improvements List */
.improvements-list {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
}

/* Improvement Card */
.improvement-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  overflow: hidden;
  transition: all 0.2s ease;
}

.improvement-card:hover {
  border-color: var(--dt-color-border-moderate);
  box-shadow: var(--dt-shadow-100);
}

.improvement-card.expanded {
  border-color: var(--dt-color-purple-300);
}

/* Card Header (Clickable) */
.card-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--dt-space-450);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
}

.card-header:hover {
  background: var(--dt-color-surface-secondary);
}

.card-header-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
}

.card-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--dt-color-purple-100);
  color: var(--dt-color-purple-500);
  border-radius: 50%;
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-bold);
  flex-shrink: 0;
}

.card-title-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-200);
}

.card-title {
  margin: 0;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  line-height: 1.4;
}

.card-badge {
  display: inline-block;
  padding: 2px var(--dt-space-300);
  border-radius: var(--dt-size-radius-200);
  font-size: 11px;
  font-weight: var(--dt-font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.card-badge.optimization {
  background: var(--dt-color-blue-100);
  color: var(--dt-color-blue-500);
}

.card-badge.safety {
  background: var(--dt-color-red-100);
  color: var(--dt-color-red-500);
}

.card-badge.ux {
  background: var(--dt-color-purple-100);
  color: var(--dt-color-purple-500);
}

.card-badge.enhancement {
  background: var(--dt-color-green-100);
  color: var(--dt-color-green-500);
}

.expand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 20px;
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.improvement-card.expanded .expand-icon {
  transform: rotate(180deg);
}

/* Card Content (Expandable) */
.card-content {
  padding: 0 var(--dt-space-450) var(--dt-space-450);
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-description {
  margin: 0 0 var(--dt-space-400);
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  line-height: 1.6;
}

.card-details {
  padding: var(--dt-space-400);
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-300);
  margin-bottom: var(--dt-space-400);
}

.details-label {
  margin: 0 0 var(--dt-space-200);
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.details-text {
  margin: 0;
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  line-height: 1.6;
}

.card-impact {
  display: flex;
  gap: var(--dt-space-300);
  padding: var(--dt-space-300);
  background: var(--dt-color-green-100);
  border-left: 3px solid var(--dt-color-green-400);
  border-radius: var(--dt-size-radius-300);
}

.impact-label {
  font-size: var(--dt-font-size-100);
  font-weight: var(--dt-font-weight-bold);
  color: var(--dt-color-green-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.impact-text {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-primary);
  line-height: 1.5;
}

/* Actions */
.validation-actions {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-300);
  padding-top: var(--dt-space-400);
  border-top: 1px solid var(--dt-color-border-subtle);
}

.action-button {
  width: 100%;
  padding: var(--dt-space-400) var(--dt-space-450);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
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

.action-button.secondary {
  background: var(--dt-color-surface-primary);
  border-color: var(--dt-color-border-moderate);
  color: var(--dt-color-foreground-primary);
}

.action-button.secondary:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.action-button.tertiary {
  background: transparent;
  border-color: transparent;
  color: var(--dt-color-foreground-secondary);
}

.action-button.tertiary:hover {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-primary);
}

.action-button:active {
  transform: scale(0.98);
}
</style>
