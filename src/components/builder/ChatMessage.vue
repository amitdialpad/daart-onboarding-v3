<template>
  <div :class="['chat-message', message.sender]">
    <!-- Message bubble -->
    <div class="message-bubble">
      <!-- Validation Card (special type) -->
      <ValidationCard
        v-if="message.type === 'validation'"
        :improvements="message.improvements || []"
        @apply-all="$emit('action-clicked', 'Apply all')"
        @review-each="$emit('action-clicked', 'Review each')"
      />

      <!-- Visual Studio Preview (special type) -->
      <VisualStudioPreview
        v-else-if="message.type === 'visual-studio'"
        @check-vs="$emit('action-clicked', 'Check out Visual Studio')"
        @keep-building="$emit('action-clicked', 'Keep building')"
      />

      <!-- Whole Plan View (special type) -->
      <WholePlanView
        v-else-if="message.type === 'whole-plan'"
        @confirm="$emit('action-clicked', 'Confirm whole plan')"
        @cancel="$emit('action-clicked', 'Go step by step')"
      />

      <!-- Document Input (special type) -->
      <DocumentInput
        v-else-if="message.type === 'document-input'"
        @submit="(doc) => $emit('document-submitted', doc)"
        @cancel="$emit('action-clicked', 'Cancel document paste')"
      />

      <!-- Loading Progress (special type) -->
      <LoadingProgress
        v-else-if="message.type === 'loading-progress'"
        :title="message.title"
        :items="message.progressItems || []"
      />

      <!-- Progress Tracker (persistent overview) -->
      <LoadingProgress
        v-else-if="message.type === 'progress-tracker'"
        :title="message.title"
        :items="message.progressItems || []"
      />

      <!-- Template Skill Confirmation (shows capabilities + additional skills) -->
      <TemplateSkillConfirmation
        v-else-if="message.type === 'template-skill-confirmation'"
        :agentGoal="message.agentGoal"
        :preSelectedSkills="message.preSelectedSkills || []"
        :additionalSkills="message.additionalSkills || []"
        @continue="(allSkills) => $emit('template-skills-confirmed', allSkills)"
      />

      <!-- Skill Selector (multi-select) -->
      <SkillSelector
        v-else-if="message.type === 'skill-selector'"
        :skills="message.skills || []"
        @continue="(selectedSkills) => $emit('skills-selected', selectedSkills)"
      />

      <!-- Path Choice Card (guided vs advanced builder) -->
      <PathChoiceCard
        v-else-if="message.type === 'path-choice'"
        @path-selected="(path) => $emit('action-clicked', path)"
      />

      <!-- Simple Loading (special type) -->
      <div v-else-if="message.type === 'simple-loading'" class="simple-loading">
        <div class="loading-spinner"></div>
        <span class="loading-text">{{ message.content }}</span>
      </div>

      <!-- Regular text content -->
      <div v-else :class="['message-text', { 'step-announcement': isStepAnnouncement }]">
        {{ message.content }}
      </div>
    </div>

    <!-- Action buttons (for selections like "Go step by step", calendar options, etc.) -->
    <!-- Only show for regular text messages, not for special components that have their own buttons -->
    <div
      v-if="message.actions && message.actions.length > 0 && message.type === 'text'"
      class="message-actions"
    >
      <button
        v-for="(action, index) in message.actions"
        :key="index"
        @click="$emit('action-clicked', action)"
        class="action-button"
      >
        {{ action }}
      </button>
    </div>

    <!-- Suggestion chips (for quick responses) -->
    <SuggestionChips
      v-if="message.suggestions && message.suggestions.length > 0"
      :suggestions="message.suggestions"
      @chip-clicked="$emit('suggestion-clicked', $event)"
    />

    <!-- Timestamp (optional, can be shown on hover) -->
    <div class="message-timestamp">
      {{ formatTime(message.timestamp) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ValidationCard from './ValidationCard.vue'
import VisualStudioPreview from './VisualStudioPreview.vue'
import WholePlanView from './WholePlanView.vue'
import DocumentInput from './DocumentInput.vue'
import LoadingProgress from './LoadingProgress.vue'
import SkillSelector from './SkillSelector.vue'
import TemplateSkillConfirmation from './TemplateSkillConfirmation.vue'
import PathChoiceCard from './PathChoiceCard.vue'
import SuggestionChips from './SuggestionChips.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
})

defineEmits(['action-clicked', 'document-submitted', 'skills-selected', 'template-skills-confirmed', 'suggestion-clicked'])

// Check if message is a step announcement
const isStepAnnouncement = computed(() => {
  return props.message.content && /^Step \d+ of \d+:/.test(props.message.content)
})

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.chat-message {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  animation: fadeIn 0.3s ease-in;
  margin-bottom: var(--dt-space-400);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* AI messages (left-aligned) */
.chat-message.ai {
  align-self: flex-start;
  max-width: 85%;
}

/* User messages (left-aligned) */
.chat-message.user {
  align-self: flex-start;
  max-width: 85%;
}

.message-bubble {
  padding: var(--dt-space-450) var(--dt-space-500);
  border-radius: var(--dt-size-radius-400);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-350);
}

/* AI message styling - clean white card */
.chat-message.ai .message-bubble {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* User message styling - with color */
.chat-message.user .message-bubble {
  background: var(--dt-color-purple-100);
  border: 1px solid var(--dt-color-purple-200);
}

.message-text {
  font-size: var(--dt-font-size-200);
  line-height: 1.5;
  color: var(--dt-color-foreground-primary);
  white-space: pre-wrap;
  word-wrap: break-word;
  font-weight: var(--dt-font-weight-normal);
}

/* Step announcement styling - make it bold */
.message-text.step-announcement {
  font-weight: var(--dt-font-weight-bold);
  font-size: var(--dt-font-size-300);
}

.message-actions {
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-400);
  margin-top: var(--dt-space-400);
  margin-left: var(--dt-space-550);
  position: relative;
}

.action-button {
  padding: var(--dt-space-400) var(--dt-space-450);
  padding-right: var(--dt-space-600); /* Reserve space for arrow to prevent width jump */
  background: var(--dt-color-surface-primary);
  border: 1.5px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  text-align: left;
  position: relative;
}

/* Arrow on hover */
.action-button::after {
  content: '→';
  position: absolute;
  right: var(--dt-space-450);
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.action-button:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.action-button:hover::after {
  opacity: 1;
}

.action-button:active {
  transform: scale(0.98);
}

.message-timestamp {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
  margin-top: var(--dt-space-300);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.chat-message:hover .message-timestamp {
  opacity: 1;
}

/* Timestamp alignment */
.chat-message.ai .message-timestamp {
  text-align: left;
}

.chat-message.user .message-timestamp {
  text-align: left;
}

/* Simple Loading State */
.simple-loading {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  padding: var(--dt-space-500);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--dt-color-border-subtle);
  border-top-color: var(--dt-color-foreground-secondary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: var(--dt-font-size-300);
  color: var(--dt-color-foreground-secondary);
  font-weight: var(--dt-font-weight-normal);
}
</style>
