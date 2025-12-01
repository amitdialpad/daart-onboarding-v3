<template>
  <div class="message-input-container">
    <div class="input-wrapper">
      <!-- Text area for user input -->
      <textarea
        v-model="message"
        @keydown.enter.exact.prevent="handleSend"
        @keydown.enter.shift.exact="handleNewLine"
        placeholder="Reply or answer question..."
        :disabled="disabled"
        ref="textarea"
        rows="1"
        class="message-textarea"
      />

      <!-- Send button -->
      <button
        @click="handleSend"
        :disabled="disabled || !message.trim()"
        class="send-button"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 10L2 2L5 10L2 18L18 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  initialText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['send-message', 'improve'])

const message = ref('')
const textarea = ref(null)

// Watch for external text changes (from suggestion chips)
watch(() => props.initialText, (newText) => {
  if (newText) {
    // Append with comma if there's already text
    if (message.value.trim()) {
      message.value = message.value.trim() + ', ' + newText
    } else {
      message.value = newText
    }

    // Focus and move cursor to end
    nextTick(() => {
      if (textarea.value) {
        textarea.value.focus()
        const length = textarea.value.value.length
        textarea.value.setSelectionRange(length, length)
        autoResize()
      }
    })
  }
})

// Auto-focus textarea when component mounts
onMounted(() => {
  nextTick(() => {
    if (textarea.value && !props.disabled) {
      textarea.value.focus()
    }
  })
})

// Auto-resize textarea
const autoResize = () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
}

watch(message, () => {
  nextTick(() => autoResize())
})

// Handle send
const handleSend = () => {
  if (!message.value.trim() || props.disabled) return

  emit('send-message', message.value.trim())
  message.value = ''

  nextTick(() => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'
      textarea.value.focus() // Refocus after sending
    }
  })
}

// Handle improve (future feature)
const handleImprove = () => {
  if (!message.value.trim() || props.disabled) return

  // For now, just send the message
  // In the future, this could trigger an AI improvement flow
  emit('improve', message.value.trim())
  emit('send', message.value.trim())
  message.value = ''

  nextTick(() => {
    if (textarea.value) {
      textarea.value.style.height = 'auto'
      textarea.value.focus() // Refocus after improving
    }
  })
}

// Handle new line (Shift + Enter)
const handleNewLine = () => {
  message.value += '\n'
}
</script>

<style scoped>
.message-input-container {
  padding: var(--dt-space-400) var(--dt-space-550);
  background: var(--dt-color-surface-primary);
  border-top: 1px solid var(--dt-color-border-subtle);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  max-width: 750px;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-350) var(--dt-space-400);
}

.message-textarea {
  flex: 1;
  min-height: 20px;
  max-height: 120px;
  padding: 0;
  border: none;
  font-family: var(--dt-font-family-sans);
  font-size: var(--dt-font-size-200);
  line-height: 1.5;
  color: var(--dt-color-foreground-primary);
  background: transparent;
  resize: none;
  overflow-y: auto;
  outline: none;
}

.message-textarea:focus {
  outline: none;
}

.message-textarea:disabled {
  color: var(--dt-color-foreground-disabled);
  cursor: not-allowed;
}

.message-textarea::placeholder {
  color: var(--dt-color-foreground-tertiary);
}

.send-button {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dt-size-radius-300);
  border: none;
  background: transparent;
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background: var(--dt-color-surface-secondary);
}

.send-button:active:not(:disabled) {
  background: var(--dt-color-surface-moderate);
}

.send-button:disabled {
  color: var(--dt-color-foreground-disabled);
  cursor: not-allowed;
}

.send-button svg {
  width: 18px;
  height: 18px;
}
</style>
