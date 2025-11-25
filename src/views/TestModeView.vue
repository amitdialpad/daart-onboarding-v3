<template>
  <div class="test-mode-view">
    <!-- Header -->
    <div class="test-header">
      <div class="header-content">
        <h1 class="test-title">Test Your Agent</h1>
        <button @click="resetConversation" class="reset-button">Reset</button>
      </div>
    </div>

    <!-- Split view: Agent chat + Info panel -->
    <div class="test-container">
      <!-- Left: Agent chat -->
      <div class="agent-chat">
        <div class="chat-messages" ref="messagesContainer">
          <div
            v-for="message in testMessages"
            :key="message.id"
            :class="['test-message', message.sender]"
          >
            <div class="message-bubble">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-timestamp">{{ formatTime(message.timestamp) }}</div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <input
            v-model="userInput"
            @keypress.enter="sendMessage"
            placeholder="Type your message as if you're a patient..."
            class="message-input"
          />
          <button @click="sendMessage" class="send-button" :disabled="!userInput.trim()">
            Send
          </button>
        </div>
      </div>

      <!-- Right: Info panel -->
      <div class="info-panel">
        <h3 class="panel-title">Testing Tips</h3>

        <div class="tip-section">
          <h4 class="tip-header">Try these scenarios:</h4>
          <ul class="tip-list">
            <li>Ask to book an appointment</li>
            <li>Request a specific provider</li>
            <li>Check available times</li>
            <li>Reschedule an existing appointment</li>
            <li>Ask about office hours</li>
          </ul>
        </div>

        <div class="tip-section">
          <h4 class="tip-header">What to watch for:</h4>
          <ul class="tip-list">
            <li>Does it verify identity?</li>
            <li>Does it respect business hours?</li>
            <li>Does it apply buffer times?</li>
            <li>Does it handle unavailable slots gracefully?</li>
          </ul>
        </div>

        <div class="agent-info">
          <h4 class="info-header">Agent Configuration</h4>
          <div class="info-item">
            <span class="info-label">Name:</span>
            <span class="info-value">{{ agentName }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Purpose:</span>
            <span class="info-value">{{ agentGoal }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Connections:</span>
            <span class="info-value">{{ connectionCount }} configured</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentStore } from '../stores/agent'

const router = useRouter()
const agentStore = useAgentStore()

const testMessages = ref([
  {
    id: '1',
    sender: 'agent',
    content: "Hi! I'm your appointment scheduling assistant. I can help you book, reschedule, or check appointments. How can I help you today?",
    timestamp: new Date()
  }
])

const userInput = ref('')
const messagesContainer = ref(null)

const agentName = computed(() => agentStore.name || 'AI Agent')
const agentGoal = computed(() => agentStore.goal || 'Appointment scheduling')
const connectionCount = computed(() => agentStore.connections?.length || 0)

const sendMessage = () => {
  if (!userInput.value.trim()) return

  // Add user message
  testMessages.value.push({
    id: Date.now().toString(),
    sender: 'user',
    content: userInput.value,
    timestamp: new Date()
  })

  const input = userInput.value.toLowerCase()
  userInput.value = ''

  // Simulate agent response
  setTimeout(() => {
    let response = ''

    if (input.includes('book') || input.includes('appointment') || input.includes('schedule')) {
      response = "I'd be happy to help you book an appointment. Can you tell me what type of appointment you need?"
    } else if (input.includes('available') || input.includes('when') || input.includes('time')) {
      response = "Let me check our availability. We have slots available Monday through Thursday, 9 AM to 5 PM, and Friday 9 AM to 12 PM. What day works best for you?"
    } else if (input.includes('cancel') || input.includes('reschedule')) {
      response = "I can help you reschedule. First, let me verify your identity. Can you provide your date of birth?"
    } else if (input.includes('hours') || input.includes('open')) {
      response = "Our office hours are Monday-Thursday 9 AM - 5 PM, and Friday 9 AM - 12 PM. We're closed on weekends and major holidays."
    } else if (input.includes('provider') || input.includes('doctor')) {
      response = "We have several providers available. Dr. Martinez specializes in pediatrics, and Dr. Chen specializes in cardiology. Which would you prefer?"
    } else {
      response = "I understand. Can you provide more details about what you need help with?"
    }

    testMessages.value.push({
      id: Date.now().toString(),
      sender: 'agent',
      content: response,
      timestamp: new Date()
    })

    scrollToBottom()
  }, 800)

  scrollToBottom()
}

const resetConversation = () => {
  testMessages.value = [
    {
      id: Date.now().toString(),
      sender: 'agent',
      content: "Hi! I'm your appointment scheduling assistant. I can help you book, reschedule, or check appointments. How can I help you today?",
      timestamp: new Date()
    }
  ]
}

const goBack = () => {
  // If deployed, go to overview. If not deployed (still building), go back to builder
  const isDeployed = agentStore.status === 'deployed'
  if (isDeployed) {
    router.push(`/agent/${agentStore.id}/overview`)
  } else {
    router.push('/builder')
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.test-mode-view {
  min-height: 100vh;
  background: var(--dt-color-surface-secondary);
}

/* Header */
.test-header {
  background: var(--dt-color-surface-primary);
  border-bottom: 1px solid var(--dt-color-border-subtle);
  padding: var(--dt-space-500) var(--dt-space-550);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
}

.reset-button {
  padding: var(--dt-space-300) var(--dt-space-450);
  background: transparent;
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button:hover {
  background: var(--dt-color-surface-secondary);
  border-color: var(--dt-color-border-strong);
}

.test-title {
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

/* Container */
.test-container {
  display: flex;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: var(--dt-space-600);
  gap: var(--dt-space-500);
}

/* Agent Chat (Left) */
.agent-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--dt-space-550);
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-450);
}

.test-message {
  display: flex;
  max-width: 70%;
  animation: fadeIn 0.3s ease;
}

.test-message.user {
  align-self: flex-end;
}

.test-message.agent {
  align-self: flex-start;
}

.message-bubble {
  padding: var(--dt-space-400);
  border-radius: var(--dt-size-radius-400);
}

.test-message.agent .message-bubble {
  background: var(--dt-color-surface-secondary);
  border: 1px solid var(--dt-color-border-subtle);
}

.test-message.user .message-bubble {
  background: var(--dt-color-purple-200);
}

.message-text {
  font-size: var(--dt-font-size-200);
  line-height: 1.5;
  color: var(--dt-color-foreground-primary);
  margin-bottom: var(--dt-space-200);
}

.message-timestamp {
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-tertiary);
}

.chat-input {
  display: flex;
  gap: var(--dt-space-300);
  padding: var(--dt-space-500);
  border-top: 1px solid var(--dt-color-border-subtle);
}

.message-input {
  flex: 1;
  padding: var(--dt-space-400);
  border: 1px solid var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-family: var(--dt-font-family-sans);
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-primary);
}

.message-input:focus {
  outline: none;
  border-color: var(--dt-color-purple-400);
}

.send-button {
  padding: var(--dt-space-400) var(--dt-space-500);
  background: var(--dt-color-purple-400);
  border: none;
  border-radius: var(--dt-size-radius-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-surface-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-button:hover:not(:disabled) {
  background: var(--dt-color-purple-500);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Info Panel (Right) */
.info-panel {
  width: 350px;
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-550);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--dt-space-550);
}

.panel-title {
  margin: 0 0 var(--dt-space-400);
  font-size: var(--dt-font-size-300);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.tip-section {
  padding: var(--dt-space-450);
  background: var(--dt-color-surface-secondary);
  border-radius: var(--dt-size-radius-400);
}

.tip-header,
.info-header {
  margin: 0 0 var(--dt-space-300);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.tip-list {
  margin: 0;
  padding-left: var(--dt-space-500);
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  line-height: 1.6;
}

.tip-list li {
  margin-bottom: var(--dt-space-200);
}

.agent-info {
  padding: var(--dt-space-450);
  background: var(--dt-color-blue-100);
  border-radius: var(--dt-size-radius-400);
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--dt-space-300);
  font-size: var(--dt-font-size-200);
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
}

.info-value {
  color: var(--dt-color-foreground-primary);
  font-weight: var(--dt-font-weight-medium);
}

/* Animations */
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

/* Scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: var(--dt-color-surface-secondary);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-200);
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: var(--dt-color-border-strong);
}

/* Responsive */
@media (max-width: 1024px) {
  .test-container {
    flex-direction: column;
  }

  .info-panel {
    width: 100%;
    max-height: 300px;
    border-right: none;
    border-top: 1px solid var(--dt-color-border-subtle);
  }
}
</style>
