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
              <p class="prompt-subtitle">Turn hours of routine support work into automated conversations</p>
              <p class="prompt-value-prop">Your staff spends hours on appointment scheduling, insurance questions, and form collection. Let AI handle it while you focus on patient care.</p>
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
              <div class="free-trial-notice">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                  <path d="M8 1L10.5 6L16 6.75L12 10.5L13 16L8 13.25L3 16L4 10.5L0 6.75L5.5 6L8 1Z" fill="currentColor"/>
                </svg>
                <span>Free to build and test • No credit card required • Deploy when you're ready</span>
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
  'Answer billing questions and process refunds',
  'Schedule appointments via phone and email',
  'Handle prescription refill requests',
  'Collect patient intake forms before visits'
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

// Mock suggested goals (healthcare context from PDF)
const suggestedGoals = ref([
  {
    id: 1,
    title: 'Patient Support Agent',
    description: 'Answers common questions about hours, insurance, and doctors.',
    usedBy: 'Healthcare clinics, hospitals',
    usageStats: '150+ practices saved 1,800 hours this month',
    features: [
      'Reduce front desk calls by 60% with instant answers',
      'Let patients get info 24/7 without waiting on hold',
      'Free up staff to focus on in-person patient care'
    ],
    conversation: [
      { type: 'agent', text: 'Hi! How can I help you today?' },
      { type: 'user', text: 'What are your hours?' },
      { type: 'agent', text: 'We\'re open Monday-Friday, 8am-6pm.' },
      { type: 'user', text: 'Do you accept Blue Cross insurance?' },
      { type: 'agent', text: 'Yes! We accept Blue Cross, Aetna, and UnitedHealthcare.' },
      { type: 'user', text: 'Great, can I see Dr. Martinez?' },
      { type: 'agent', text: 'Dr. Martinez is available. Would you like to schedule an appointment?' }
    ],
    showBadge: false
  },
  {
    id: 2,
    title: 'Appointment Scheduler',
    description: 'Books, reschedules, and cancels patient visits using Google Calendar or EMR tools.',
    usedBy: 'Medical practices, wellness centers',
    usageStats: '320+ practices reduced no-shows by 40%',
    features: [
      'Save 2+ hours per day of staff phone time',
      'Reduce no-shows by 40% with automated reminders',
      'Let patients book 24/7 without calling your office'
    ],
    conversation: [
      { type: 'agent', text: 'I can help you schedule an appointment. What type of visit do you need?' },
      { type: 'user', text: 'I need to see Dr. Smith for a checkup' },
      { type: 'agent', text: 'I have availability on Tuesday at 2pm or Thursday at 10am. Which works better for you?' },
      { type: 'user', text: 'Tuesday at 2pm works' },
      { type: 'agent', text: 'Perfect! I\'ve booked you for Tuesday at 2pm with Dr. Smith. You\'ll receive a confirmation email shortly.' },
      { type: 'user', text: 'Thanks!' },
      { type: 'agent', text: 'You\'re welcome! Please arrive 10 minutes early to check in.' }
    ],
    showBadge: true,
    badgeText: 'Popular',
    badgeKind: 'success'
  },
  {
    id: 3,
    title: 'Prescription Refill Coordinator',
    description: 'Handles refill requests and forwards approvals to providers.',
    usedBy: 'Pharmacies, medical offices',
    usageStats: '85+ pharmacies handle 24/7 refills automatically',
    features: [
      'Handle refill requests 24/7 without staff involvement',
      'Reduce pharmacy callback time by 70%',
      'Improve patient satisfaction with instant responses'
    ],
    conversation: [
      { type: 'agent', text: 'Hi! Need help with a prescription refill?' },
      { type: 'user', text: 'Yes, I need to refill my blood pressure medication' },
      { type: 'agent', text: 'I can help with that. What\'s the medication name?' },
      { type: 'user', text: 'Lisinopril 10mg' },
      { type: 'agent', text: 'Got it. I\'ll forward this to Dr. Johnson for approval.' },
      { type: 'user', text: 'How long will it take?' },
      { type: 'agent', text: 'Usually within 24 hours. You\'ll get a text when it\'s ready at your pharmacy.' }
    ],
    showBadge: false
  },
  {
    id: 4,
    title: 'Billing & Claims Helper',
    description: 'Explains charges, checks insurance coverage, and guides patients through claims.',
    usedBy: 'Billing departments, insurance offices',
    usageStats: '120+ practices cut billing calls by 50%',
    features: [
      'Reduce billing inquiry calls by 50%',
      'Resolve simple questions instantly without transfers',
      'Improve collections with clear payment guidance'
    ],
    conversation: [
      { type: 'agent', text: 'How can I help with your billing question?' },
      { type: 'user', text: 'I got a bill for $250. Is that right?' },
      { type: 'agent', text: 'Let me check that for you.' },
      { type: 'agent', text: 'Your insurance covered 80% of your visit. Your copay is $25, and the remaining $225 is for the lab work.' },
      { type: 'user', text: 'Why wasn\'t the lab work covered?' },
      { type: 'agent', text: 'Lab work requires separate authorization from your insurance. Would you like me to help you file an appeal?' }
    ],
    showBadge: false
  },
  {
    id: 5,
    title: 'Pre-Visit Intake Assistant',
    description: 'Collects patient info and forms before appointments.',
    usedBy: 'Hospitals, specialty clinics',
    usageStats: '95+ clinics save 15 min per appointment',
    features: [
      'Save 10-15 minutes per appointment on paperwork',
      'Reduce wait times with pre-completed forms',
      'Improve data accuracy with digital collection'
    ],
    conversation: [
      { type: 'agent', text: 'Hi Sarah! Your appointment is coming up. Let me help you complete your intake forms - it\'ll only take 2 minutes.' },
      { type: 'user', text: 'Okay, what do you need?' },
      { type: 'agent', text: 'First, have you had any changes to your medications since your last visit?' },
      { type: 'user', text: 'No, still the same' },
      { type: 'agent', text: 'Perfect. Any new allergies or health conditions?' },
      { type: 'user', text: 'Nope, all good' },
      { type: 'agent', text: 'Great! Your forms are complete. See you tomorrow at 10am!' }
    ],
    showBadge: false
  },
  {
    id: 6,
    title: 'Follow-Up & Reminder Bot',
    description: 'Sends visit reminders, surveys, and medication alerts to keep patients engaged.',
    usedBy: 'Primary care, chronic care management',
    usageStats: '200+ practices reduced no-shows by 30%',
    features: [
      'Reduce no-shows by up to 30% with smart reminders',
      'Boost patient engagement and medication adherence',
      'Collect feedback automatically to improve care'
    ],
    conversation: [
      { type: 'agent', text: 'Hi John! Reminder: Your appointment with Dr. Martinez is tomorrow at 10am.' },
      { type: 'user', text: 'Thanks! I\'ll be there' },
      { type: 'agent', text: 'Great! Please arrive 10 minutes early to check in.' },
      { type: 'user', text: 'What should I bring?' },
      { type: 'agent', text: 'Just your insurance card and ID. We have all your medical records on file.' },
      { type: 'user', text: 'Perfect, thanks' },
      { type: 'agent', text: 'See you tomorrow! Reply STOP if you need to cancel.' }
    ],
    showBadge: false
  }
])

function startBuilding() {
  if (userPrompt.value.trim()) {
    router.push({ name: 'ConversationalBuilder', query: { goal: userPrompt.value } })
  }
}

function selectGoal(goal) {
  router.push({ name: 'ConversationalBuilder', query: { goal: goal.title } })
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
</script>

<style scoped>
.starting-point {
  min-height: 100vh;
  padding: var(--dt-space-550) var(--dt-space-550);
  background: var(--dt-color-surface-secondary);
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

.free-trial-notice {
  display: flex;
  align-items: center;
  gap: var(--dt-space-350);
  justify-content: center;
  margin-top: var(--dt-space-500);
  padding: var(--dt-space-400);
  font-size: var(--dt-font-size-100);
  color: var(--dt-color-foreground-success);
  border-radius: var(--dt-size-radius-300);
  background: var(--dt-color-surface-success-subtle);
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
  max-width: 900px;
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
