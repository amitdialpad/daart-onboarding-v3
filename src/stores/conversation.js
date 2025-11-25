import { defineStore } from 'pinia'
import { useAgentStore } from './agent'

// Conversation states for the state machine
export const ConversationState = {
  // Initial
  SHOWING_PLAN: 'showing_plan',
  ASKING_PATH: 'asking_path',

  // Beginner Path
  BEGINNER_PHASE_1: 'beginner_phase_1',
  BEGINNER_PHASE_2: 'beginner_phase_2',
  BEGINNER_PHASE_3: 'beginner_phase_3',
  BEGINNER_PHASE_4: 'beginner_phase_4',
  BEGINNER_PHASE_5: 'beginner_phase_5',
  BEGINNER_PHASE_6: 'beginner_phase_6',

  // Pro Path
  PRO_GATHERING_INFO: 'pro_gathering_info',
  PRO_CONFIGURING: 'pro_configuring',
  PRO_SKILL_SELECTION: 'pro_skill_selection',
  PRO_ASKING_MISSING: 'pro_asking_missing',
  PRO_PHASE_2: 'pro_phase_2',
  PRO_PHASE_4: 'pro_phase_4',
  PRO_PHASE_6: 'pro_phase_6',
}

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    // Current state
    currentState: ConversationState.SHOWING_PLAN,
    userPath: null, // 'beginner' | 'pro'

    // Multi-skill selection tracking
    selectedSkills: [], // Array of selected skill types
    currentlyConfiguringSkill: null, // Current skill being configured

    // Message history
    messages: [],

    // Current phase tracking
    currentPhase: {
      number: 1,
      name: 'Agent Foundation & Skills',
      status: 'pending', // 'pending' | 'in_progress' | 'completed'
      currentQuestionIndex: 0,
    },

    // Milestone tracking
    milestones: {
      goal: '',
      contextSummary: '',
      completed: [],
      current: '',
      upcoming: [
        'Add tools connections',
        'Add safety and behavior guides (guardrails)',
        'Validate',
        'Add more tasks (optional)',
        'Test',
      ],
    },

    // UI state
    isWaitingForAI: false,
    isProcessing: false,
  }),

  getters: {
    // Get all messages
    allMessages: (state) => state.messages,

    // Check if waiting for user input
    isWaitingForUser: (state) => !state.isWaitingForAI && !state.isProcessing,

    // Get current milestone status
    milestoneStatus: (state) => ({
      goal: state.milestones.goal,
      contextSummary: state.milestones.contextSummary,
      completed: state.milestones.completed,
      current: state.milestones.current,
      upcoming: state.milestones.upcoming,
    }),
  },

  actions: {
    // Add a message to the conversation
    addMessage(message) {
      const newMessage = {
        id: Date.now().toString(),
        timestamp: new Date(),
        ...message,
      }
      this.messages.push(newMessage)
    },

    // Add AI message
    addAIMessage(content, type = 'text', actions = null, improvements = null, progressItems = null, title = null, skills = null) {
      this.addMessage({
        sender: 'ai',
        content,
        type,
        actions,
        improvements, // For validation cards
        progressItems, // For loading progress
        title, // For loading progress title
        skills, // For skill selector
      })
    },

    // Update a specific message by ID
    updateMessage(messageId, updates) {
      const message = this.messages.find(m => m.id === messageId)
      if (message) {
        Object.assign(message, updates)
      }
    },

    // Add user message
    addUserMessage(content) {
      this.addMessage({
        sender: 'user',
        content,
        type: 'text',
      })
    },

    // Initialize conversation with the initial plan
    initializeConversation(agentGoal) {
      this.messages = []
      this.milestones.goal = agentGoal

      // CRITICAL FIX: Initialize agent in agent store immediately
      // This ensures goal is persisted even if user skips to advanced builder
      const agentStore = useAgentStore()
      agentStore.initializeAgent(agentGoal)

      // Add welcoming introduction
      this.addAIMessage(
        `Perfect! Let's build your ${agentGoal} agent.`
      )

      // Announce Step 1
      setTimeout(() => {
        this.addAIMessage(
          "Step 1 of 6: Agent Foundation & Skills"
        )
      }, 500)

      // Explain what we're doing
      setTimeout(() => {
        this.addAIMessage(
          "First, let's define what your agent can do. You can give it multiple skills - like scheduling appointments AND answering questions. This is what makes your agent powerful!"
        )
      }, 1100)

      // Show skill selection with suggested skills + option to add custom
      setTimeout(() => {
        this.addAIMessage(
          "What skills should your agent have? Select all that apply:",
          'skill-selector',
          null, // actions
          null, // improvements
          null, // progressItems
          null, // title
          [ // Common skills - user can also add custom ones
            { id: 'appointment_scheduler', label: 'Schedule appointments' },
            { id: 'form_collector', label: 'Collect forms' },
            { id: 'billing_helper', label: 'Answer billing questions' },
            { id: 'question_answering', label: 'Answer common questions' },
            { id: 'prescription_refills', label: 'Handle prescription refills' },
            { id: 'reminders', label: 'Send reminders' },
            { id: 'custom', label: "Something else (I'll describe it)" }
          ]
        )
      }, 1400)

      this.currentState = ConversationState.PRO_SKILL_SELECTION
    },

    // Select user path (beginner or pro)
    selectPath(path) {
      this.userPath = path

      if (path === 'beginner') {
        this.currentState = ConversationState.BEGINNER_PHASE_1
        this.currentPhase.status = 'in_progress'
        this.milestones.current = `Goal: ${this.milestones.goal}`

        // Start Phase 1 - just ask the first question
        this.addAIMessage(
          "Great! Let's start with the basics."
        )

        setTimeout(() => {
          this.addAIMessage(
            "What's the main purpose of appointments in your business?"
          )
        }, 800)
      } else if (path === 'pro') {
        this.currentState = ConversationState.PRO_CONFIGURING
        this.currentPhase.status = 'in_progress'

        // Start with Step 1 immediately
        setTimeout(() => {
          this.addAIMessage(
            "Step 1 of 6: Agent Foundation & Skills"
          )
        }, 300)

        setTimeout(() => {
          this.addAIMessage(
            "What skills should your agent have?",
            'skill-selector',
            null, // actions
            null, // improvements
            null, // progressItems
            null, // title
            [ // skills
              { id: 'appointment_scheduler', label: 'Schedule appointments' },
              { id: 'form_collector', label: 'Collect forms' },
              { id: 'billing_helper', label: 'Answer billing questions' }
            ]
          )
          this.currentState = ConversationState.PRO_SKILL_SELECTION
        }, 600)
      }
    },

    // Update milestone
    updateMilestone(update) {
      if (update.current) {
        this.milestones.current = update.current
      }
      if (update.contextSummary) {
        this.milestones.contextSummary = update.contextSummary
      }
      if (update.completed) {
        this.milestones.completed.push(update.completed)
      }
    },

    // Set waiting state
    setWaitingForAI(waiting) {
      this.isWaitingForAI = waiting
    },

    // Set processing state
    setProcessing(processing) {
      this.isProcessing = processing
    },

    // Update progress tracker phase status
    updateProgressTracker(phaseNumber, status) {
      // Find the progress tracker message
      const trackerMessage = this.messages.find(m => m.type === 'progress-tracker')
      if (trackerMessage && trackerMessage.progressItems) {
        // Update the specific phase status
        trackerMessage.progressItems[phaseNumber - 1].status = status
      }
    },

    // Complete current step and move to next
    completePhaseAndMoveNext(nextPhaseNumber, nextPhaseName) {
      const currentPhaseNum = this.currentPhase.number

      // Add completion message for current step
      this.addAIMessage(
        `✓ Step ${currentPhaseNum} complete!`
      )

      // Update to next step
      this.currentPhase.number = nextPhaseNumber
      this.currentPhase.name = nextPhaseName
      this.currentPhase.status = 'in_progress'

      // Announce next step
      setTimeout(() => {
        this.addAIMessage(
          `Step ${nextPhaseNumber} of 6: ${nextPhaseName}`
        )
      }, 500)
    },

    // Clear conversation
    clearConversation() {
      this.messages = []
      this.currentState = ConversationState.SHOWING_PLAN
      this.userPath = null
      this.currentPhase = {
        number: 1,
        name: 'Agent Foundation & Skills',
        status: 'pending',
        currentQuestionIndex: 0,
      }
      this.milestones = {
        goal: '',
        contextSummary: '',
        completed: [],
        current: '',
        upcoming: [
          'Add tools connections',
          'Add safety and behavior guides (guardrails)',
          'Validate',
          'Add more tasks (optional)',
          'Test',
        ],
      }
    },
  },
})
