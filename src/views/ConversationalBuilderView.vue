<template>
  <div class="builder-view">
    <!-- Simple Header -->
    <ProgressBar
      @preview-agent="showPreview = true"
      @save-and-exit="handleSaveAndExit"
    />

    <!-- Two-column layout: Steps sidebar + Conversation -->
    <div class="builder-content">
      <!-- Left: Steps Sidebar (only show during onboarding, hide after Step 6) -->
      <aside v-if="shouldShowStepsSidebar" class="steps-sidebar">
        <LoadingProgress
          title="Building Your Agent"
          :items="stepItems"
        />
      </aside>

      <!-- Right: Conversation area -->
      <main class="conversation-area" :class="{ 'full-width': !shouldShowStepsSidebar }">
        <div class="chat-messages" ref="messagesContainer">
          <ChatMessage
            v-for="message in conversationStore.allMessages"
            :key="message.id"
            :message="message"
            @action-clicked="handleActionClick"
            @document-submitted="handleDocumentSubmit"
            @skills-selected="handleSkillsSelected"
          />
        </div>

        <!-- Message Input (shown when user needs to type answers) -->
        <MessageInput
          v-if="shouldShowMessageInput"
          @send-message="handleUserMessage"
        />
      </main>
    </div>

    <!-- Preview Modal -->
    <PreviewModal
      :is-open="showPreview"
      @close="showPreview = false"
      @test-agent="handleTestAgent"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversation'
import { useAgentStore } from '../stores/agent'
import ChatMessage from '../components/builder/ChatMessage.vue'
import MessageInput from '../components/builder/MessageInput.vue'
import ProgressBar from '../components/builder/ProgressBar.vue'
import PreviewModal from '../components/builder/PreviewModal.vue'
import LoadingProgress from '../components/builder/LoadingProgress.vue'

const showPreview = ref(false)

// Define the 6 steps for the sidebar
const stepItems = [
  { label: 'Agent Foundation & Skills', description: 'Define your company context and the specific tasks you want your agent to handle' },
  { label: 'Enable Connections', description: 'Connect tools and platforms your agent needs to access' },
  { label: 'Safety & Guardrails', description: 'Set boundaries to ensure your agent operates safely' },
  { label: 'Validate & Refine', description: 'Review progress and make improvements' },
  { label: 'Design Conversations', description: 'Build conversation flows for key interactions' },
  { label: 'Test Agent', description: 'Validate everything works as expected' }
]

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const agentStore = useAgentStore()

const messagesContainer = ref(null)

// Only show steps sidebar during onboarding (hide after completion)
const shouldShowStepsSidebar = computed(() => {
  return !agentStore.hasCompletedOnboarding
})

// Show message input when user needs to type answers
const shouldShowMessageInput = computed(() => {
  const state = conversationStore.currentState
  return state === 'pro_asking_missing' ||
         state === 'beginner_phase_1' ||
         state === 'pro_configuring_form_collector' ||
         state === 'pro_configuring_billing' ||
         state === 'pro_configuring_question_answering' ||
         state === 'pro_configuring_prescription_refills' ||
         state === 'pro_configuring_reminders' ||
         state === 'pro_configuring_custom'
})

// Helper function to scroll to bottom
const scrollToBottom = (smooth = true) => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTo({
      top: messagesContainer.value.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    })
  }
}

// Helper function to scroll to show latest content
const scrollToShowLatest = (smooth = true) => {
  if (messagesContainer.value) {
    // Get the last child element (latest message)
    const lastMessage = messagesContainer.value.lastElementChild
    if (lastMessage) {
      // Scroll the last message into view
      lastMessage.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'end'
      })
    }
  }
}

// Watch for new messages and scroll to show them
watch(
  () => conversationStore.messages.length,
  () => {
    nextTick(() => {
      setTimeout(() => {
        scrollToShowLatest()
      }, 100)
    })
  }
)

// Initialize conversation when component mounts
onMounted(() => {
  const agentGoal = route.query.goal || agentStore.goal

  if (!agentGoal) {
    // No goal provided, redirect back to starting point
    window.location.href = '/'
    return
  }

  // If agent is already deployed, redirect to overview instead of showing builder
  if (agentStore.status === 'deployed') {
    router.push(`/agent/${agentStore.id}/overview`)
    return
  }

  // Initialize agent and conversation
  if (!agentStore.id) {
    agentStore.initializeAgent(agentGoal)
  }

  if (conversationStore.messages.length === 0) {
    conversationStore.initializeConversation(agentGoal)
  }

  // Always scroll to bottom when mounting (whether first time or returning from other pages)
  // This ensures users see the latest conversation when agent is not deployed
  // Use multiple attempts with different delays to ensure scroll happens
  nextTick(() => {
    // Immediate scroll attempt
    scrollToBottom(false)

    // Second attempt after short delay
    setTimeout(() => {
      scrollToBottom(false)
    }, 100)

    // Third attempt after longer delay to ensure all content is rendered
    setTimeout(() => {
      scrollToBottom(false)
    }, 500)
  })
})

// Handle user message
const handleUserMessage = (message) => {
  conversationStore.addUserMessage(message)

  // Scroll to show latest content
  nextTick(() => {
    setTimeout(() => {
      scrollToShowLatest()
    }, 50)
  })

  // Process the message based on current state
  processUserInput(message)
}

// Handle action button clicks (e.g., "Go step by step", connection selections)
const handleActionClick = (action) => {
  conversationStore.addUserMessage(action)

  // Scroll to show latest content after user clicks an action
  // This ensures new content loads in view without manual scrolling
  nextTick(() => {
    setTimeout(() => {
      scrollToShowLatest()
    }, 50)
  })

  // Process action based on current state
  processAction(action)
}

// Handle document submission
const handleDocumentSubmit = (documentText) => {
  conversationStore.addUserMessage("*Document pasted*")
  handleProPath(documentText)
}

// Handle test agent button
const handleTestAgent = () => {
  router.push('/test-mode')
}

// Process user input based on conversation state
const processUserInput = (input) => {
  const state = conversationStore.currentState

  // Simulate AI thinking
  conversationStore.setWaitingForAI(true)

  setTimeout(() => {
    // Handle different states
    if (state === 'asking_path') {
      // Detect path selection from message
      if (input.toLowerCase().includes('step')) {
        conversationStore.selectPath('beginner')
      } else if (input.toLowerCase().includes('whole') || input.toLowerCase().includes('plan')) {
        conversationStore.selectPath('pro')
      }
    } else if (state === 'beginner_phase_1') {
      // Handle Phase 1 questions
      handleBeginnerPhase1(input)
    } else if (state === 'pro_asking_missing') {
      // Handle pro path question answers
      handleProQuestionAnswers(input)
    } else if (state === 'pro_configuring_form_collector') {
      // Handle form collector configuration
      handleFormCollectorConfig(input)
    } else if (state === 'pro_configuring_billing') {
      // Handle billing helper configuration
      handleBillingHelperConfig(input)
    } else if (state === 'pro_configuring_question_answering') {
      handleSkillConfig(input, 'question_answering')
    } else if (state === 'pro_configuring_prescription_refills') {
      handleSkillConfig(input, 'prescription_refills')
    } else if (state === 'pro_configuring_reminders') {
      handleSkillConfig(input, 'reminders')
    } else if (state === 'pro_configuring_custom') {
      handleSkillConfig(input, 'custom')
    } else if (state === 'beginner_phase_2') {
      // Handle Phase 2 - Connections
      handleBeginnerPhase2(input)
    } else if (state === 'beginner_phase_3') {
      // Handle Phase 3 - Guardrails
      handleBeginnerPhase3(input)
    } else if (state === 'beginner_phase_4') {
      // Handle Phase 4 - Validation
      handleBeginnerPhase4(input)
    } else if (state === 'beginner_phase_5') {
      // Handle Phase 5 - Optional skills
      handleBeginnerPhase5(input)
    } else if (state === 'pro_gathering_info') {
      // Handle pro path input
      handleProPath(input)
    } else if (state === 'pro_phase_2') {
      handleProPhase2(input)
    } else if (state === 'pro_phase_3') {
      handleProPhase3(input)
    } else if (state === 'pro_phase_4') {
      handleProPhase4(input)
    }

    conversationStore.setWaitingForAI(false)
  }, 1000)
}

// Process action button clicks
const processAction = (action) => {
  const state = conversationStore.currentState

  conversationStore.setWaitingForAI(true)

  // Check for global actions FIRST (before the setTimeout)
  if (action === 'Test agent now') {
    // Mark onboarding as complete and navigate immediately
    agentStore.completeOnboarding()
    router.push('/test-mode')
    return
  } else if (action === 'Check out Visual Studio') {
    // Change state FIRST to prevent re-showing VS preview
    conversationStore.currentState = 'pro_vs_opened'

    // Navigate directly to workflow builder
    router.push('/workflow-builder')
    return
  } else if (action === 'Keep building') {
    conversationStore.setWaitingForAI(true)
    // Continue to validation phase
    conversationStore.addAIMessage("Great! Let's continue building...")
    setTimeout(() => {
      moveToProPhase4()
      conversationStore.setWaitingForAI(false)
    }, 1000)
    return
  } else if (action === 'Continue to validation') {
    conversationStore.setWaitingForAI(true)
    // From VS opened state, go to validation
    setTimeout(() => {
      moveToProPhase4()
      conversationStore.setWaitingForAI(false)
    }, 500)
    return
  }

  setTimeout(() => {
    if (action === 'Guide me step by step') {
      // User chose guided path - start configuring skills
      // (Step 1 was already announced before skill selection)
      conversationStore.addAIMessage("Great! Let's configure your skills.")

      setTimeout(() => {
        conversationStore.currentlyConfiguringSkill = 0
        askSkillConfigQuestions()
      }, 800)

      conversationStore.setWaitingForAI(false)
      return
    } else if (action === "I'll configure it myself in the advanced builder") {
      // User chose to go directly to Agent Studio
      conversationStore.addAIMessage("Opening Agent Studio...")

      // Mark onboarding as complete (they're skipping it)
      agentStore.completeOnboarding()

      // Navigate to Agent Studio
      router.push('/agent-studio')
      return
    } else if (action === 'Go step by step') {
      conversationStore.selectPath('beginner')
    } else if (action === 'Confirm whole plan') {
      // User confirmed the plan from the initial view, proceed with pro path directly
      conversationStore.selectPath('pro')
    } else if (state === 'pro_gathering_info') {
      // Handle pro path options
      if (action === 'Answer questions') {
        // User wants to answer questions - ask them and transition to asking state
        conversationStore.currentState = 'pro_asking_missing'
        conversationStore.addAIMessage(
          "Great! Let's collect the key details:\n\nScheduling Parameters:\n• What are your preferred business hours? (e.g., Monday-Friday, 9 AM - 5 PM EST)\n• What's the default appointment duration?\n• What buffer time between appointments?"
        )
      } else if (action === 'Paste a document') {
        // Show document input
        conversationStore.addAIMessage(
          null, // No text content
          'document-input' // Show DocumentInput component
        )
      } else if (action === 'Cancel document paste') {
        // User cancelled - show options again
        conversationStore.addAIMessage(
          "No problem! Would you like to:",
          'text',
          ['Answer questions', 'Paste a document']
        )
      }
    } else if (state === 'beginner_phase_2') {
      // Connection selections
      handleBeginnerPhase2(action)
    } else if (state === 'beginner_phase_3') {
      // Guardrail selections
      handleBeginnerPhase3(action)
    } else if (state === 'beginner_phase_4') {
      // Validation selections
      handleBeginnerPhase4(action)
    } else if (state === 'beginner_phase_5') {
      // Optional skills selections
      handleBeginnerPhase5(action)
    } else if (state === 'pro_phase_5') {
      // Design conversations selections (same as beginner)
      handleBeginnerPhase5(action)
    } else if (state === 'beginner_phase_6' || state === 'pro_phase_6') {
      // Test/Launch actions
      if (action === 'Start testing') {
        conversationStore.addAIMessage("Opening test mode...")

        // Navigate immediately to prevent layout flash
        // Mark onboarding as complete just before navigation
        agentStore.completeOnboarding()
        router.push('/test-mode')
      } else if (action === 'Open Agent Studio') {
        conversationStore.addAIMessage("Opening Agent Studio...")

        // Navigate to Agent Studio
        agentStore.completeOnboarding()
        router.push('/agent-studio')
      } else if (action === 'Save and get demo link') {
        conversationStore.addAIMessage("Generating your demo link...")

        // Generate a demo link based on agent name
        const agentId = agentStore.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        const timestamp = Date.now().toString(36)
        const demoLink = `https://daart-demo.com/${agentId}-${timestamp}`

        setTimeout(() => {
          conversationStore.addAIMessage(
            `Your agent is ready! Here's your demo link:\n\n${demoLink}\n\nShare this with your team to try the agent. The link will remain active for 30 days.\n\nWhat would you like to do next?`,
            'text',
            ['View agent overview', 'Test agent now']
          )
        }, 1500)
      } else if (action === 'Back to overview') {
        conversationStore.addAIMessage("Returning to overview...")
        setTimeout(() => {
          conversationStore.addAIMessage(
            "Your agent is built and ready! You can continue building or deploy when ready."
          )
        }, 1000)
      } else if (action === 'View agent overview') {
        // Show the agent configuration modal
        showPreview.value = true
      } else if (action === 'Deploy agent') {
        conversationStore.addAIMessage("Opening deployment wizard...")
        // Navigate immediately to prevent layout flash
        agentStore.completeOnboarding()
        router.push('/deploy')
      } else if (action === 'Test agent now') {
        conversationStore.addAIMessage("Opening test mode...")
        // Navigate immediately to prevent layout flash
        agentStore.completeOnboarding()
        router.push('/test-mode')
      } else if (action === 'Monitor performance') {
        conversationStore.addAIMessage("Opening performance monitor...")
        // Navigate immediately to prevent layout flash
        agentStore.completeOnboarding()
        router.push('/monitor')
      }
    } else if (state === 'pro_phase_2') {
      handleProPhase2(action)
    } else if (state === 'pro_phase_3') {
      handleProPhase3(action)
    } else if (state === 'pro_phase_4') {
      handleProPhase4(action)
    }

    conversationStore.setWaitingForAI(false)
  }, 1000)
}

// Handle beginner Phase 1 questions
const handleBeginnerPhase1 = (input) => {
  const questionIndex = conversationStore.currentPhase.currentQuestionIndex

  // Phase 1 has 5 questions
  const phase1Questions = [
    {
      field: 'purpose',
      nextQuestion: "Perfect. Now let's talk about how customers will book these appointments. Do you have preferred dates or times when appointments are typically available? For instance, maybe you prioritize weekday mornings, or avoid Fridays?",
    },
    {
      field: 'businessHours',
      nextQuestion: "That makes sense. What about appointment duration — how long do these typically last?",
    },
    {
      field: 'appointmentDuration',
      nextQuestion: "Good. Now, when checking availability, should the agent respect any buffers between appointments? For example, 10 minutes between patients for notes and prep?",
    },
    {
      field: 'bufferTime',
      nextQuestion: "Got it. For Holiday hours or blackout periods I have this information from your Office settings: Standard US holidays, plus lunch from 12:30 to 1:30 PM daily. Is that ok?",
    },
    {
      field: 'blackoutPeriods',
      nextQuestion: null, // Last question - move to next phase
    },
  ]

  if (questionIndex < phase1Questions.length) {
    const currentQ = phase1Questions[questionIndex]

    // Save the answer
    const updateData = {}
    updateData[currentQ.field] = input
    agentStore.updateFoundation(updateData)

    // Update milestone with context summary
    if (questionIndex === 0) {
      conversationStore.updateMilestone({
        current: `Goal: ${agentStore.goal}`,
        contextSummary: 'Context: in progress',
      })
    }

    // Move to next question or next phase
    conversationStore.currentPhase.currentQuestionIndex++

    if (currentQ.nextQuestion) {
      // Ask next question
      conversationStore.addAIMessage(currentQ.nextQuestion)
    } else {
      // Phase 1 complete, move to Phase 2
      moveToPhase2()
    }
  }
}

// Handle Phase 2: Connections
const handleBeginnerPhase2 = (input) => {
  const questionIndex = conversationStore.currentPhase.currentQuestionIndex

  if (questionIndex === 0) {
    // Calendar system selected
    agentStore.addConnection({ type: 'calendar', name: input })

    conversationStore.addAIMessage("Great! Now for video meetings, which service do you use?", 'text', [
      'Zoom',
      'Microsoft Teams',
      'Google Meet',
      'Other'
    ])
    conversationStore.currentPhase.currentQuestionIndex++
  } else if (questionIndex === 1) {
    // Video service selected
    agentStore.addConnection({ type: 'video', name: input })

    // Move to Phase 3
    moveToPhase3()
  }
}

// Handle Phase 3: Safety & Guardrails
const handleBeginnerPhase3 = (input) => {
  const questionIndex = conversationStore.currentPhase.currentQuestionIndex

  if (questionIndex === 0) {
    // Asking about verification method
    agentStore.updateGuardrails({ identityVerification: input })

    conversationStore.addAIMessage(
      "Got it. Any business rules? For example, limits on new patients per day or provider-specific rules?"
    )
    conversationStore.currentPhase.currentQuestionIndex++
  } else if (questionIndex === 1) {
    // Business rules
    agentStore.updateGuardrails({ businessRules: [input] })

    // Move to Phase 4
    moveToPhase4()
  }
}

// Handle Phase 4: Validation
const handleBeginnerPhase4 = (input) => {
  const inputLower = input.toLowerCase()

  if (inputLower.includes('apply')) {
    // Apply all improvements
    conversationStore.addAIMessage("Applying all improvements...")

    setTimeout(() => {
      conversationStore.addAIMessage(
        "All improvements applied! Your agent is configured and optimized."
      )

      setTimeout(() => {
        // Check if pro or beginner path
        if (conversationStore.userPath === 'pro') {
          moveToProPhase5()
        } else {
          moveToPhase5()
        }
      }, 1000)
    }, 2000)
  } else if (inputLower.includes('skip')) {
    // Skip validation improvements
    conversationStore.addAIMessage("Skipping improvements for now. Your agent is ready to proceed!")

    setTimeout(() => {
      // Check if pro or beginner path
      if (conversationStore.userPath === 'pro') {
        moveToProPhase5()
      } else {
        moveToPhase5()
      }
    }, 800)
  } else if (inputLower.includes('review')) {
    // Review each individually
    conversationStore.addAIMessage("Let's review each improvement individually. Which one would you like to start with?", 'text', [
      'Buffer conflict resolution',
      'Timezone display enhancement',
      'New patient cap alert',
      'Specialty routing fallback',
      'Apply all and continue'
    ])
  }
}

// Handle Phase 5: Optional Skills
const handleBeginnerPhase5 = (input) => {
  const lowerInput = input.toLowerCase()

  // Check if user is done adding capabilities
  if (lowerInput.includes('test') || lowerInput.includes('skip') || lowerInput.includes('done')) {
    conversationStore.addAIMessage("Great! Your agent is ready to test.")
    setTimeout(() => {
      moveToPhase6()
    }, 800)
    return
  }

  // Check for specific capabilities
  if (lowerInput.includes('email') || lowerInput.includes('confirmation')) {
    conversationStore.addAIMessage("Added email confirmations to your agent.")
    agentStore.addSkill('email_confirmations', { enabled: true })
  } else if (lowerInput.includes('sms') || lowerInput.includes('reminder')) {
    conversationStore.addAIMessage("Added SMS reminders to your agent.")
    agentStore.addSkill('sms_reminders', { enabled: true })
  } else if (lowerInput.includes('reschedule') || lowerInput.includes('flow')) {
    conversationStore.addAIMessage("Added reschedule flows to your agent.")
    agentStore.addSkill('reschedule_flows', { enabled: true })
  } else {
    // Fallback - acknowledge and ask if they want more
    conversationStore.addAIMessage(`Got it! I'll add ${input} to your agent.`)
  }

  // Ask if they want to add more capabilities
  setTimeout(() => {
    conversationStore.addAIMessage("Would you like to add more capabilities?", 'text', [
      'Add email confirmations',
      'Add SMS reminders',
      'Add reschedule flows',
      "Done - let's test"
    ])
  }, 800)
}

// Move to Phase 2: Connections
const moveToPhase2 = () => {
  conversationStore.currentPhase.number = 2
  conversationStore.currentPhase.name = 'Enable Connections'
  conversationStore.currentPhase.status = 'in_progress'
  conversationStore.currentPhase.currentQuestionIndex = 0

  // Update milestone
  conversationStore.updateMilestone({
    completed: 'Goal and context defined',
    current: 'Connections: in progress',
  })

  // Move state
  conversationStore.currentState = 'beginner_phase_2'

  // Announce step
  conversationStore.addAIMessage(
    "Step 2 of 6: Enable Connections"
  )

  // Ask about calendar systems
  setTimeout(() => {
    conversationStore.addAIMessage(
      "Which calendar system do your providers use?",
      'text',
      ['Google Calendar', 'Microsoft Calendar', 'Other']
    )
  }, 500)
}

// Move to Phase 3: Guardrails
const moveToPhase3 = () => {
  conversationStore.currentPhase.number = 3
  conversationStore.currentPhase.name = 'Safety & Guardrails'
  conversationStore.currentPhase.status = 'in_progress'
  conversationStore.currentPhase.currentQuestionIndex = 0

  // Update milestone
  conversationStore.updateMilestone({
    completed: 'Connections added',
    current: 'Safety rules: in progress',
  })

  conversationStore.currentState = 'beginner_phase_3'

  // Announce step
  conversationStore.addAIMessage(
    "Step 3 of 6: Safety & Guardrails"
  )

  setTimeout(() => {
    conversationStore.addAIMessage(
      "Now let's set up safety rules. For identity verification, what method works best?",
      'text',
      ['Date of birth', 'Last 4 of phone', 'Account PIN', 'None needed']
    )
  }, 500)
}

// Move to Phase 4: Validation
const moveToPhase4 = () => {
  conversationStore.currentPhase.number = 4
  conversationStore.currentPhase.name = 'Validate & Refine'
  conversationStore.currentPhase.status = 'in_progress'
  conversationStore.currentPhase.currentQuestionIndex = 0

  conversationStore.updateMilestone({
    completed: 'Safety rules configured',
    current: 'Validation: in progress',
  })

  conversationStore.currentState = 'beginner_phase_4'

  // Announce step
  conversationStore.addAIMessage(
    "Step 4 of 6: Validate & Refine"
  )

  setTimeout(() => {
    conversationStore.addAIMessage("Running validation...")
  }, 500)

  // Simulate validation
  setTimeout(() => {
    // Add validation card with improvements
    const improvements = [
      {
        title: 'Buffer conflict resolution',
        type: 'optimization',
        description: "You've set a 15-minute buffer between appointments and a 12:30-1:30 PM lunch break.",
        details: "I recommend adding a 5-minute prep buffer before the first afternoon appointment (at 1:30 PM) to prevent back-to-back scheduling issues.",
        impact: "Prevents double-booking issues and gives staff time to prepare for afternoon appointments"
      },
      {
        title: 'Timezone display enhancement',
        type: 'ux',
        description: "For patients in different time zones, the agent should display times in both the patient's local time AND your office time.",
        details: "This reduces confusion when patients book appointments, especially if they're calling from Mountain or Eastern time zones while your office is in Pacific time.",
        impact: "Reduces booking errors and patient confusion by 40%"
      },
      {
        title: 'New patient cap alert',
        type: 'safety',
        description: "Your 5-new-patient-per-day cap should trigger proactive messaging.",
        details: "When only 1-2 slots remain for new patients, the agent should immediately offer next-day alternatives rather than showing unavailable times.",
        impact: "Improves patient experience and reduces frustration from seeing 'unavailable' times"
      },
      {
        title: 'Specialty routing fallback',
        type: 'enhancement',
        description: "When Dr. Martinez (pediatrics) or Dr. Chen (cardiology) are unavailable, the agent lacks clear guidance.",
        details: "The agent should explicitly ask if the patient wants to wait for that specialist or see a general practitioner for non-urgent cases.",
        impact: "Ensures patients get appropriate care routing and reduces missed appointment opportunities"
      }
    ]

    conversationStore.addAIMessage(
      null, // No text content, ValidationCard will render
      'validation',
      null,
      improvements // Pass improvements as extra data
    )
  }, 2000)
}

// Move to Phase 5: Optional Skills
const moveToPhase5 = () => {
  conversationStore.currentPhase.number = 5
  conversationStore.currentPhase.name = 'Additional Skills'
  conversationStore.currentPhase.status = 'in_progress'
  conversationStore.currentPhase.currentQuestionIndex = 0

  conversationStore.updateMilestone({
    completed: 'Validation complete',
    current: 'Optional skills',
  })

  conversationStore.currentState = 'beginner_phase_5'

  // Announce step
  conversationStore.addAIMessage(
    "Step 5 of 6: Design Conversations"
  )

  setTimeout(() => {
    conversationStore.addAIMessage(
      "Your agent is ready! Want to add more capabilities?",
      'text',
      ['Add confirmations', 'Add reminders', 'Skip - test now']
    )
  }, 500)
}

// Move to Phase 6: Test
const moveToPhase6 = () => {
  conversationStore.currentPhase.number = 6
  conversationStore.currentPhase.name = 'Test & Launch'
  conversationStore.currentPhase.status = 'in_progress'

  conversationStore.updateMilestone({
    completed: 'Agent configured',
    current: 'Ready to test',
  })

  conversationStore.currentState = 'beginner_phase_6'

  // Update agent status to 'ready' (not yet deployed)
  agentStore.updateStatus('ready')

  // Announce step
  conversationStore.addAIMessage(
    "Step 6 of 6: Test Agent"
  )

  setTimeout(() => {
    conversationStore.addAIMessage(
      "Perfect! Your agent is built and ready to test."
    )
  }, 500)

  // Explain Agent Studio option
  setTimeout(() => {
    conversationStore.addAIMessage(
      "From here, you can test your agent or jump into Agent Studio to visually design and modify the conversation flow with a drag-and-drop interface."
    )
  }, 1200)

  // Show options
  setTimeout(() => {
    conversationStore.addAIMessage(
      "What would you like to do next?",
      'text',
      ['Start testing', 'Open Agent Studio', 'View agent overview']
    )
  }, 2000)
}

// Handle pro path question answers
const handleProQuestionAnswers = (input) => {
  // Parse the user's answers
  conversationStore.addAIMessage("Got it! Processing your scheduling requirements...")

  // Extract structured data from the input (in real implementation, would use AI to parse)
  agentStore.updateFoundation({
    purpose: 'Appointment scheduling and management',
    businessHours: input.includes('hours') ? input : 'Monday-Friday, 9 AM - 5 PM',
    appointmentDuration: '30 minutes',
    bufferTime: '15 minutes',
    blackoutPeriods: 'Standard holidays'
  })

  setTimeout(() => {
    conversationStore.addAIMessage("Perfect! I have all the details I need.")
    conversationStore.setWaitingForAI(false)
    setTimeout(() => {
      moveToProPhase2()
    }, 800)
  }, 1000)
}

// Handle pro path - with or without document
const handleProPath = (documentText = null) => {
  if (documentText) {
    // User pasted a document - parse it
    conversationStore.addAIMessage("Extracting requirements from your document...")

    // Simulate parsing (in real implementation, would use AI to extract structured data)
    agentStore.updateFoundation({
      purpose: 'Medical consultations and appointment management',
      businessHours: 'Monday-Thursday 9am-5pm, Friday 9am-12pm',
      appointmentDuration: '30-45 minutes',
      bufferTime: '15 minutes',
      blackoutPeriods: 'US holidays, lunch 12:30-1:30pm'
    })

    setTimeout(() => {
      conversationStore.addAIMessage("Configuration complete! Found your scheduling rules, business hours, and appointment types.")
      setTimeout(() => {
        moveToProPhase2()
      }, 800)
    }, 1500)
  } else {
    // Using smart defaults
    conversationStore.addAIMessage("Configuring with smart defaults based on your goal...")

    agentStore.updateFoundation({
      purpose: 'Appointment management',
      businessHours: 'Standard business hours',
      appointmentDuration: '30 minutes',
      bufferTime: '15 minutes',
      blackoutPeriods: 'Standard holidays'
    })

    setTimeout(() => {
      conversationStore.addAIMessage("Configuration complete!")
      setTimeout(() => {
        moveToProPhase2()
      }, 800)
    }, 1000)
  }
}

// Pro path Phase 2: Connections (faster)
const moveToProPhase2 = () => {
  conversationStore.currentPhase.number = 2
  conversationStore.currentPhase.name = 'Enable Connections'
  conversationStore.currentState = 'pro_phase_2'

  conversationStore.updateMilestone({
    completed: 'Foundation configured',
    current: 'Connections: in progress'
  })

  // Announce step
  conversationStore.addAIMessage(
    "Step 2 of 6: Enable Connections"
  )

  setTimeout(() => {
    conversationStore.addAIMessage(
      "Which tools do you use?",
      'text',
      ['Google Calendar + Zoom', 'Microsoft Calendar + Teams', 'Custom setup']
    )
  }, 500)
}

// Handle pro path Phase 2
const handleProPhase2 = (input) => {
  // Save connection based on selection
  if (input.includes('Google')) {
    agentStore.addConnection({ type: 'calendar', name: 'Google Calendar' })
    agentStore.addConnection({ type: 'video', name: 'Zoom' })
  } else if (input.includes('Microsoft')) {
    agentStore.addConnection({ type: 'calendar', name: 'Microsoft Calendar' })
    agentStore.addConnection({ type: 'video', name: 'Microsoft Teams' })
  }

  conversationStore.addAIMessage("Connections configured!")

  setTimeout(() => {
    moveToProPhase3()
  }, 1000)
}

// Pro path Phase 3: Guardrails (faster)
const moveToProPhase3 = () => {
  conversationStore.currentPhase.number = 3
  conversationStore.currentPhase.name = 'Safety & Guardrails'
  conversationStore.currentState = 'pro_phase_3'

  conversationStore.updateMilestone({
    completed: 'Connections added',
    current: 'Safety: in progress'
  })

  // Announce step
  conversationStore.addAIMessage(
    "Step 3 of 6: Safety & Guardrails"
  )

  setTimeout(() => {
    conversationStore.addAIMessage(
      "Quick safety check - verification method?",
      'text',
      ['Date of birth', 'Account PIN', 'Skip verification']
    )
  }, 500)
}

// Handle pro path Phase 3
const handleProPhase3 = (input) => {
  agentStore.updateGuardrails({
    identityVerification: input,
    safetyRules: ['Never invent availability', 'Read back before confirming', 'Keep responses under 10 seconds']
  })

  // Success message for safety
  conversationStore.addAIMessage("Safety configured!")

  setTimeout(() => {
    // Move directly to Phase 4 (Validation)
    moveToProPhase4()
  }, 1000)
}

// Pro path Phase 4: Validation (same as beginner)
const moveToProPhase4 = () => {
  moveToPhase4()
  conversationStore.currentState = 'pro_phase_4'
}

// Handle pro path Phase 4
const handleProPhase4 = (input) => {
  handleBeginnerPhase4(input)
}

// Pro path Phase 5: Design Conversations (now same as beginner)
const moveToProPhase5 = () => {
  conversationStore.currentPhase.number = 5
  conversationStore.currentPhase.name = 'Design Conversations'
  conversationStore.currentPhase.status = 'in_progress'
  conversationStore.currentPhase.currentQuestionIndex = 0

  conversationStore.updateMilestone({
    completed: 'Validation complete',
    current: 'Designing conversations'
  })

  conversationStore.currentState = 'pro_phase_5'

  // Announce step
  conversationStore.addAIMessage(
    "Step 5 of 6: Design Conversations"
  )

  setTimeout(() => {
    conversationStore.addAIMessage(
      "Your agent is ready! Want to add more capabilities?",
      'text',
      ['Add confirmations', 'Add reminders', 'Skip - test now']
    )
  }, 500)
}

// Handle Save & Exit
const handleSaveAndExit = () => {
  // Add a message to indicate saving
  conversationStore.addAIMessage("Saving your progress...")

  // The agent store and conversation store are automatically persisted via Pinia
  // No manual save needed - state is already in localStorage

  // Give visual feedback before navigating
  setTimeout(() => {
    conversationStore.addAIMessage("Progress saved! You can return anytime to continue building.")

    // Navigate back to starting point with saved parameter to show success message
    setTimeout(() => {
      router.push({ path: '/', query: { saved: 'true' } })
    }, 1000)
  }, 500)
}

// Handle multi-skill selection
const handleSkillsSelected = (selectedSkillIds) => {
  // Add skills to agent store
  selectedSkillIds.forEach(skillId => {
    agentStore.addSkill(skillId)
  })

  // Get skill labels for confirmation message
  const skillLabels = agentStore.skills.map(skill => {
    const typeMap = {
      'appointment_scheduler': 'Schedule appointments',
      'form_collector': 'Collect forms',
      'billing_helper': 'Answer billing questions'
    }
    return typeMap[skill.type] || skill.type
  })

  // Acknowledge selection
  conversationStore.addAIMessage(`Great! Your agent will have these skills: ${skillLabels.join(', ')}`)

  // NOW ask for path choice (guided vs advanced) - AFTER skills are selected
  setTimeout(() => {
    conversationStore.addAIMessage(
      "How would you like to configure your agent?",
      'text',
      [
        'Guide me step by step',
        "I'll configure it myself in the advanced builder"
      ]
    )
    conversationStore.currentState = 'asking_path'
  }, 800)
}

// Ask configuration questions for current skill
const askSkillConfigQuestions = () => {
  const skillIndex = conversationStore.currentlyConfiguringSkill
  const skill = agentStore.skills[skillIndex]

  if (!skill) {
    // No more skills to configure, move to Phase 2
    setTimeout(() => {
      moveToProPhase2()
    }, 800)
    return
  }

  // Ask skill-specific questions
  if (skill.type === 'appointment_scheduler') {
    conversationStore.addAIMessage("What are your business hours for appointments?")
    conversationStore.currentState = 'pro_asking_missing'
  } else if (skill.type === 'form_collector') {
    conversationStore.addAIMessage("What forms do you need to collect?")
    conversationStore.currentState = 'pro_configuring_form_collector'
  } else if (skill.type === 'billing_helper') {
    conversationStore.addAIMessage("What billing questions should your agent handle?")
    conversationStore.currentState = 'pro_configuring_billing'
  } else if (skill.type === 'question_answering') {
    conversationStore.addAIMessage("What types of questions should your agent be able to answer?")
    conversationStore.currentState = 'pro_configuring_question_answering'
  } else if (skill.type === 'prescription_refills') {
    conversationStore.addAIMessage("How should your agent handle prescription refill requests?")
    conversationStore.currentState = 'pro_configuring_prescription_refills'
  } else if (skill.type === 'reminders') {
    conversationStore.addAIMessage("What types of reminders should your agent send?")
    conversationStore.currentState = 'pro_configuring_reminders'
  } else if (skill.type === 'custom') {
    conversationStore.addAIMessage("Please describe the custom skill you'd like your agent to have:")
    conversationStore.currentState = 'pro_configuring_custom'
  } else {
    // Unknown skill type, skip configuration
    conversationStore.addAIMessage(`Got it! I'll configure ${skill.type} with smart defaults.`)
    setTimeout(() => {
      conversationStore.currentlyConfiguringSkill++
      askSkillConfigQuestions()
    }, 800)
  }
}

// Handle form collector configuration
const handleFormCollectorConfig = (input) => {
  // Save form collection details
  const skillIndex = conversationStore.currentlyConfiguringSkill
  const skill = agentStore.skills[skillIndex]

  if (skill) {
    agentStore.updateSkillConfig(skill.id, {
      forms: input
    })
  }

  conversationStore.addAIMessage(`Got it! Your agent will collect: ${input}`)

  // Move to next skill or next phase
  setTimeout(() => {
    conversationStore.currentlyConfiguringSkill++
    askSkillConfigQuestions()
  }, 800)
}

// Handle billing helper configuration
const handleBillingHelperConfig = (input) => {
  // Save billing configuration
  const skillIndex = conversationStore.currentlyConfiguringSkill
  const skill = agentStore.skills[skillIndex]

  if (skill) {
    agentStore.updateSkillConfig(skill.id, {
      billingQuestions: input
    })
  }

  conversationStore.addAIMessage(`Perfect! Your agent will handle: ${input}`)

  // Move to next skill or next phase
  setTimeout(() => {
    conversationStore.currentlyConfiguringSkill++
    askSkillConfigQuestions()
  }, 800)
}

// Generic handler for other skill configurations
const handleSkillConfig = (input, skillType) => {
  const skillIndex = conversationStore.currentlyConfiguringSkill
  const skill = agentStore.skills[skillIndex]

  if (skill) {
    agentStore.updateSkillConfig(skill.id, {
      config: input
    })
  }

  conversationStore.addAIMessage(`Got it! Your agent will ${skillType === 'custom' ? 'handle that' : `handle ${skillType.replace(/_/g, ' ')}`}.`)

  // Move to next skill or next phase
  setTimeout(() => {
    conversationStore.currentlyConfiguringSkill++
    askSkillConfigQuestions()
  }, 800)
}
</script>

<style scoped>
.builder-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--dt-color-surface-secondary);
  overflow: hidden;
}

/* Two-column layout */
.builder-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left sidebar with steps */
.steps-sidebar {
  width: 400px;
  flex-shrink: 0;
  background: var(--dt-color-surface-primary);
  border-right: 1px solid var(--dt-color-border-subtle);
  overflow-y: auto;
  padding: var(--dt-space-550);
}

.steps-sidebar::-webkit-scrollbar {
  width: 8px;
}

.steps-sidebar::-webkit-scrollbar-track {
  background: var(--dt-color-surface-secondary);
}

.steps-sidebar::-webkit-scrollbar-thumb {
  background: var(--dt-color-border-moderate);
  border-radius: var(--dt-size-radius-200);
}

.steps-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--dt-color-border-strong);
}

/* Right conversation area */
.conversation-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fafafa;
  overflow: hidden;
}

/* Full width when sidebar is hidden */
.conversation-area.full-width {
  max-width: 100%;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--dt-space-600) var(--dt-space-550);
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
}

/* Push messages to bottom when there's not enough content */
.chat-messages > :first-child {
  margin-top: auto;
}

/* Scrollbar styling */
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
  .builder-content {
    flex-direction: column;
  }

  .steps-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--dt-color-border-subtle);
    max-height: 300px;
  }

  .chat-messages {
    padding: var(--dt-space-450);
  }
}
</style>
