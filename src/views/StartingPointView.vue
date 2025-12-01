<template>
  <div class="starting-point">
    <div class="container">
      <div class="content">
        <!-- Success Banner -->
        <transition name="fade">
          <div v-if="showSavedBanner" class="success-banner">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor"/>
            </svg>
            <span>Your progress has been saved. Pick up where you left off by continuing below.</span>
            <button @click="dismissBanner" class="dismiss-button">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </transition>

        <!-- Prompt Section -->
        <transition name="fade">
          <div class="prompt-section">
            <div :class="{ 'blur-background': isFocused }">
              <h2 class="d-headline--sm d-fc-primary prompt-title">Build an AI Agent</h2>
              <p class="prompt-value-prop">Describe the agent's objectives and main responsibilities, and we will create it for you.</p>
            </div>

            <div class="prompt-card">
              <textarea
                v-model="userPrompt"
                :placeholder="isFocused ? '' : (animatedPlaceholder + (isTyping ? '|' : ''))"
                class="prompt-textarea"
                rows="4"
                @input="autoGrowTextarea"
                @focus="handleFocus"
                @blur="handleBlur"
              ></textarea>
              <div class="prompt-actions">
                <button
                  class="d-btn d-btn--primary d-btn--lg"
                  @click="startBuilding"
                  :disabled="!userPrompt.trim()"
                >
                  Start Building
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Suggested Goals -->
        <div :class="['suggested-goals', 'd-mt48', { 'blur-background': isFocused }]">
          <h3 class="templates-heading">
            Start with a template
          </h3>

          <div class="goals-grid-inline">
            <div
              v-for="goal in suggestedGoals"
              :key="goal.id"
              class="goal-pill"
              @click="selectGoal(goal)"
            >
              {{ goal.title }}
              <span v-if="goal.showBadge" :class="`d-badge d-badge--${goal.badgeKind}`" style="margin-left: var(--dt-space-300);">
                {{ goal.badgeText }}
              </span>
            </div>
          </div>

          <div class="create-manually-link">
            <button @click="createManually" class="link-button">
              Create manually
            </button>
          </div>
        </div>

        <!-- New to AI Agents Section -->
        <div :class="['resources-section', { 'blur-background': isFocused }]">
          <h3 class="resources-heading">New to AI Agents?</h3>
          <div class="resources-grid">
            <div class="resource-card">
              <h4 class="resource-title">Video demo</h4>
            </div>
            <div class="resource-card">
              <h4 class="resource-title">Case study</h4>
            </div>
            <div class="resource-card">
              <h4 class="resource-title">Video guide</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const userPrompt = ref('')
const currentPlaceholder = ref(0)
const animatedPlaceholder = ref('')
const isTyping = ref(false)
const isFocused = ref(false)
const showSavedBanner = ref(false)

// Rotating placeholder examples
const placeholders = [
  'What do you want your agent to do?',
  'Answer customer questions and route inquiries',
  'Schedule meetings and send reminders',
  'Screen candidates and collect applications',
  'Qualify leads and book demos',
  'Update CRM records and sync data'
]

// Typewriter animation for placeholder
let typingInterval = null
let placeholderTimeout = null

function typewriterEffect() {
  const targetText = placeholders[currentPlaceholder.value]
  let charIndex = 0

  // Clear previous animation
  animatedPlaceholder.value = ''
  isTyping.value = true

  // Type out characters one by one
  typingInterval = setInterval(() => {
    if (charIndex < targetText.length) {
      animatedPlaceholder.value = targetText.substring(0, charIndex + 1)
      charIndex++
    } else {
      // Finished typing, wait before moving to next placeholder
      clearInterval(typingInterval)
      isTyping.value = false

      placeholderTimeout = setTimeout(() => {
        currentPlaceholder.value = (currentPlaceholder.value + 1) % placeholders.length
        typewriterEffect()
      }, 3000) // Wait 3 seconds before next placeholder
    }
  }, 50) // Type one character every 50ms
}

onMounted(() => {
  // Check if user just saved their progress
  if (route.query.saved === 'true') {
    showSavedBanner.value = true

    // Auto-dismiss banner after 8 seconds
    setTimeout(() => {
      showSavedBanner.value = false
      // Clean up the URL query parameter
      router.replace({ path: '/', query: {} })
    }, 8000)
  }

  typewriterEffect()
})

onUnmounted(() => {
  if (typingInterval) {
    clearInterval(typingInterval)
  }
  if (placeholderTimeout) {
    clearTimeout(placeholderTimeout)
  }
})

// Business-focused templates with pre-selected skills
const suggestedGoals = ref([
  {
    id: 1,
    title: 'AI Receptionist',
    description: 'Handles incoming calls, answers questions, and routes inquiries to the right team.',
    preSelectedSkills: ['answer_common_questions', 'routing'],
    showBadge: false
  },
  {
    id: 2,
    title: 'Scheduling Assistant',
    description: 'Books, reschedules, and cancels appointments with calendar integration.',
    preSelectedSkills: ['appointment_scheduler', 'reminders'],
    showBadge: true,
    badgeText: 'Popular',
    badgeKind: 'success'
  },
  {
    id: 3,
    title: 'Recruiting Agent',
    description: 'Screens candidates, schedules interviews, and answers hiring questions.',
    preSelectedSkills: ['appointment_scheduler', 'form_collector'],
    showBadge: false
  },
  {
    id: 4,
    title: 'Account Manager',
    description: 'Handles customer inquiries, tracks orders, and provides account updates.',
    preSelectedSkills: ['answer_common_questions', 'custom'],
    showBadge: false
  },
  {
    id: 5,
    title: 'CRM Buddy',
    description: 'Updates records, logs interactions, and syncs data with your CRM.',
    preSelectedSkills: ['form_collector', 'custom'],
    showBadge: false
  },
  {
    id: 6,
    title: 'Sales Support Agent',
    description: 'Qualifies leads, answers product questions, and schedules demos.',
    preSelectedSkills: ['answer_common_questions', 'appointment_scheduler'],
    showBadge: false
  }
])

function startBuilding() {
  if (userPrompt.value.trim()) {
    // Check if we have a selected template
    const selectedTemplate = selectedTemplateId.value
      ? suggestedGoals.value.find(g => g.id === selectedTemplateId.value)
      : null

    let agentName = ''
    const queryParams = { goal: userPrompt.value }

    if (selectedTemplate) {
      // For templates, use the template title as agent name (2-3 words)
      agentName = selectedTemplate.title
      queryParams.template = selectedTemplate.id
      queryParams.preSelectedSkills = JSON.stringify(selectedTemplate.preSelectedSkills)
    } else {
      // For free-form input, extract first 2-3 words
      const words = userPrompt.value.trim().split(/\s+/)
      agentName = words.slice(0, Math.min(3, words.length)).join(' ')
      // Capitalize first letter
      agentName = agentName.charAt(0).toUpperCase() + agentName.slice(1)
    }

    queryParams.agentName = agentName

    router.push({ name: 'ConversationalBuilder', query: queryParams })
  }
}

// Track selected template for short name extraction
const selectedTemplateId = ref(null)

function selectGoal(goal) {
  // Track which template was selected for name extraction
  selectedTemplateId.value = goal.id

  // Fill textarea with template description
  userPrompt.value = `I want to build ${goal.title.toLowerCase()}. ${goal.description}`

  // Focus textarea so user can see and edit
  const textarea = document.querySelector('.prompt-textarea')
  if (textarea) {
    textarea.focus()
    // Scroll to textarea
    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// Auto-grow textarea
function autoGrowTextarea(event) {
  const textarea = event.target
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

// Handle focus/blur for textarea
function handleFocus() {
  isFocused.value = true
  // Pause the typewriter animation
  if (typingInterval) {
    clearInterval(typingInterval)
  }
  if (placeholderTimeout) {
    clearTimeout(placeholderTimeout)
  }
}

function handleBlur() {
  isFocused.value = false
  // Resume typewriter animation if textarea is empty
  if (!userPrompt.value.trim()) {
    typewriterEffect()
  }
}

// Dismiss success banner
function dismissBanner() {
  showSavedBanner.value = false
  // Clean up the URL query parameter
  router.replace({ path: '/', query: {} })
}

// Navigate to Agent Studio for manual creation
function createManually() {
  router.push('/studio')
}
</script>

<style scoped>
.starting-point {
  min-height: 100vh;
  padding: var(--dt-space-550) var(--dt-space-550);
  background:
    radial-gradient(circle, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    var(--dt-color-surface-secondary);
  background-size: 20px 20px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Success Banner */
.success-banner {
  display: flex;
  align-items: center;
  gap: var(--dt-space-400);
  padding: var(--dt-space-450) var(--dt-space-500);
  background: var(--dt-color-green-100);
  border: 1px solid var(--dt-color-green-300);
  border-radius: var(--dt-size-radius-400);
  color: var(--dt-color-green-700);
  margin: 0 auto var(--dt-space-600);
  max-width: 700px;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  position: relative;
}

.success-banner svg:first-child {
  flex-shrink: 0;
  color: var(--dt-color-green-600);
}

.success-banner span {
  flex: 1;
}

.dismiss-button {
  padding: var(--dt-space-200);
  background: transparent;
  border: none;
  color: var(--dt-color-green-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dt-size-radius-200);
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.dismiss-button:hover {
  background: var(--dt-color-green-200);
}

.prompt-section {
  max-width: 700px;
  margin: 0 auto var(--dt-space-600);
  text-align: center;
}

.prompt-title {
  margin-bottom: 0;
  font-size: 48px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.prompt-subtitle {
  font-size: var(--dt-font-size-300);
  color: var(--dt-color-foreground-primary);
  margin: var(--dt-space-300) 0 0 0;
  line-height: 1.5;
  font-weight: var(--dt-font-weight-medium);
}

.prompt-value-prop {
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  margin: var(--dt-space-400) auto 0;
  line-height: 1.6;
  max-width: 600px;
  font-weight: var(--dt-font-weight-normal);
}

.prompt-description {
  margin-bottom: var(--dt-space-550);
  line-height: 1.6;
}

.prompt-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-default);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-550);
  margin-top: var(--dt-space-600);
  box-shadow: var(--dt-shadow-300);
}

.prompt-textarea {
  width: 100%;
  min-height: 120px;
  max-height: 300px;
  padding: var(--dt-space-500);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-300);
  font-family: var(--dt-font-family-body);
  font-size: var(--dt-font-size-200);
  line-height: var(--dt-font-line-height-300);
  resize: none;
  overflow-y: auto;
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-secondary);
  transition: all 0.2s ease;
}

.prompt-textarea:focus {
  outline: none !important;
  border-color: var(--dt-color-border-strong);
  background: var(--dt-color-surface-primary);
  box-shadow: none;
}

.prompt-textarea::placeholder {
  color: var(--dt-color-foreground-placeholder);
  transition: opacity 0.3s ease;
}

.prompt-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: var(--dt-space-450);
  gap: var(--dt-space-450);
}

.improve-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--dt-space-300);
  padding: var(--dt-space-400) var(--dt-space-425);
  background: transparent;
  border: none;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  transition: color 0.2s ease;
  border-radius: var(--dt-size-radius-300);
}

.improve-btn:hover {
  color: var(--dt-color-foreground-primary);
  background: var(--dt-color-surface-secondary);
}

.suggested-goals {
  max-width: 1200px;
  margin: 0 auto var(--dt-space-700);
  text-align: center;
}

.suggested-goals h2 {
  margin-bottom: var(--dt-space-500);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.suggested-goals p {
  margin-bottom: var(--dt-space-500);
  font-size: 15px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
}

.templates-heading {
  text-align: center;
  margin-bottom: var(--dt-space-300);
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-semibold);
  color: var(--dt-color-foreground-primary);
  letter-spacing: -0.02em;
}

.templates-subtitle {
  text-align: center;
  margin-bottom: var(--dt-space-500);
  font-size: var(--dt-font-size-200);
  color: var(--dt-color-foreground-secondary);
  font-weight: var(--dt-font-weight-normal);
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--dt-space-500);
}

.goal-card {
  padding: var(--dt-space-450);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  background: var(--dt-color-surface-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.goal-card:hover {
  border-color: var(--dt-color-border-default);
  box-shadow: var(--dt-shadow-200);
}

.goals-grid-inline {
  display: flex;
  justify-content: center;
  gap: var(--dt-space-400);
  flex-wrap: wrap;
  max-width: 700px;
  margin: 0 auto;
}

.goal-pill {
  padding: var(--dt-space-400) var(--dt-space-500);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-500);
  background: var(--dt-color-surface-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  min-height: 44px; /* Ensure consistent height across all pills */
}

.goal-pill:hover {
  border-color: var(--dt-color-border-default);
  box-shadow: var(--dt-shadow-200);
  background: var(--dt-color-surface-secondary);
  transform: translateY(-1px);
}

.goal-pill:active {
  transform: translateY(0);
  transition: all 0.1s ease;
}

.create-manually-link {
  text-align: center;
  margin-top: var(--dt-space-500);
}

.link-button {
  background: none;
  border: none;
  color: var(--dt-color-foreground-secondary);
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  cursor: pointer;
  text-decoration: underline;
  padding: var(--dt-space-300);
  transition: color 0.2s ease;
}

.link-button:hover {
  color: var(--dt-color-foreground-primary);
}

/* Fade in/out for prompt section */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}


/* Resources Section */
.resources-section {
  max-width: 700px;
  margin: var(--dt-space-600) auto 0;
  text-align: center;
}

.resources-heading {
  text-align: center;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-semibold);
  color: var(--dt-color-foreground-primary);
  margin-bottom: var(--dt-space-500);
  letter-spacing: -0.02em;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--dt-space-500);
}

@media (max-width: 768px) {
  .resources-grid {
    grid-template-columns: 1fr;
  }
}

.resource-card {
  background: var(--dt-color-surface-primary);
  border: 1px solid var(--dt-color-border-subtle);
  border-radius: var(--dt-size-radius-400);
  padding: var(--dt-space-550);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.resource-card:hover {
  border-color: var(--dt-color-border-default);
  box-shadow: var(--dt-shadow-200);
  transform: translateY(-1px);
}

.resource-title {
  font-size: var(--dt-font-size-200);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-secondary);
  margin: 0;
  text-align: center;
}

/* Blur effect for distraction-free typing */
.blur-background {
  filter: blur(2px);
  opacity: 0.6;
  transition: all 0.3s ease;
  pointer-events: none;
}


@media (max-width: 768px) {
  .goals-grid {
    grid-template-columns: 1fr;
  }

  .prompt-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
