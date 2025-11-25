import { defineStore } from 'pinia'

export const useAgentStore = defineStore('agent', {
  state: () => ({
    // Agent basic info
    id: null,
    name: 'New AI Agent',
    goal: '',
    status: 'draft', // 'draft' | 'in_progress' | 'ready' | 'deployed'

    // Onboarding state
    hasCompletedOnboarding: false,

    // Phase 1: Agent Foundation & Skills (Multi-skill support)
    skills: [], // Array of skill objects: [{ type: 'appointment_scheduler', config: {...} }, { type: 'form_collector', config: {...} }]
    foundation: {
      purpose: '', // Legacy field - now derived from skills
      businessHours: '',
      appointmentDuration: '',
      bufferTime: '',
      blackoutPeriods: '',
    },

    // Phase 2: Connections
    connections: [],

    // Phase 3: Safety & Guardrails
    guardrails: {
      safetyRules: [],
      identityVerification: '',
      businessRules: [],
    },

    // Phase 4: Validation
    validation: {
      status: 'pending', // 'pending' | 'running' | 'completed'
      improvements: [],
      appliedImprovements: [],
    },

    // Phase 5: Additional Tasks (optional)
    additionalTasks: [],

    // Phase 6: Testing
    testing: {
      testResults: [],
      demoLink: '',
    },

    // Deployment
    deployment: {
      channel: null, // 'chat' | 'email' | 'phone' | 'slack'
      deployedAt: null,
      config: {
        greetingMessage: "Hi! I'm your AI assistant. How can I help you today?",
        workingHours: '24/7',
        fallbackBehavior: 'escalate',
        escalationThreshold: '2'
      }
    },

    // Metadata
    createdAt: null,
    lastModified: null,
  }),

  getters: {
    // Check if agent has been configured
    isConfigured: (state) => {
      return (
        state.foundation.purpose &&
        state.connections.length > 0 &&
        state.guardrails.safetyRules.length > 0
      )
    },

    // Get completion percentage
    completionPercentage: (state) => {
      const totalSteps = 6
      let completedSteps = 0

      if (state.foundation.purpose) completedSteps++
      if (state.connections.length > 0) completedSteps++
      if (state.guardrails.safetyRules.length > 0) completedSteps++
      if (state.validation.status === 'completed') completedSteps++
      if (state.additionalTasks.length > 0) completedSteps++
      if (state.testing.demoLink) completedSteps++

      return Math.round((completedSteps / totalSteps) * 100)
    },

    // Get agent summary
    summary: (state) => ({
      name: state.name,
      goal: state.goal,
      status: state.status,
      connections: state.connections.length,
      tasks: 1 + state.additionalTasks.length,
      completion: state.completionPercentage,
    }),
  },

  actions: {
    // Initialize new agent
    initializeAgent(goal) {
      this.id = Date.now().toString()
      this.goal = goal
      // Generate name from goal - capitalize first letter and remove any "I want to" prefix
      const cleanedGoal = goal
        .replace(/^(I want to|I'd like to|I need to)\s+/i, '')
        .trim()
      this.name = cleanedGoal.charAt(0).toUpperCase() + cleanedGoal.slice(1)
      this.status = 'in_progress'
      this.createdAt = new Date()
      this.lastModified = new Date()
    },

    // Update agent name
    updateName(name) {
      this.name = name
      this.lastModified = new Date()
    },

    // Update foundation data
    updateFoundation(data) {
      this.foundation = { ...this.foundation, ...data }
      this.lastModified = new Date()
    },

    // Add skill to agent (multi-skill support)
    addSkill(skillType, config = {}) {
      const skill = {
        id: Date.now().toString() + Math.random(),
        type: skillType, // 'appointment_scheduler', 'form_collector', 'billing_helper', etc.
        config: config, // Skill-specific configuration
        addedAt: new Date()
      }
      this.skills.push(skill)
      this.lastModified = new Date()

      // Update purpose to reflect multiple skills
      this.updatePurposeFromSkills()
    },

    // Update skill configuration
    updateSkillConfig(skillId, config) {
      const skill = this.skills.find(s => s.id === skillId)
      if (skill) {
        skill.config = { ...skill.config, ...config }
        this.lastModified = new Date()
      }
    },

    // Remove skill
    removeSkill(skillId) {
      this.skills = this.skills.filter(s => s.id !== skillId)
      this.lastModified = new Date()
      this.updatePurposeFromSkills()
    },

    // Generate purpose description from skills
    updatePurposeFromSkills() {
      if (this.skills.length === 0) {
        this.foundation.purpose = ''
        return
      }

      const skillNames = this.skills.map(skill => {
        const typeMap = {
          'appointment_scheduler': 'Appointment scheduling',
          'form_collector': 'Form collection',
          'billing_helper': 'Billing & claims assistance',
          'customer_support': 'Customer support',
          'refund_processor': 'Refund processing'
        }
        return typeMap[skill.type] || skill.type
      })

      this.foundation.purpose = skillNames.join(', ')
    },

    // Add connection
    addConnection(connection) {
      this.connections.push({
        id: Date.now().toString(),
        type: connection.type, // 'google_calendar', 'zoom', etc.
        name: connection.name,
        status: 'connected',
        connectedAt: new Date(),
      })
      this.lastModified = new Date()
    },

    // Update guardrails
    updateGuardrails(data) {
      this.guardrails = { ...this.guardrails, ...data }
      this.lastModified = new Date()
    },

    // Add validation improvement
    addValidationImprovement(improvement) {
      this.validation.improvements.push(improvement)
      this.lastModified = new Date()
    },

    // Apply validation improvement
    applyImprovement(improvementId) {
      const improvement = this.validation.improvements.find(
        (i) => i.id === improvementId
      )
      if (improvement) {
        this.validation.appliedImprovements.push(improvement)
      }
      this.lastModified = new Date()
    },

    // Set validation status
    setValidationStatus(status) {
      this.validation.status = status
      this.lastModified = new Date()
    },

    // Add additional task
    addAdditionalTask(task) {
      this.additionalTasks.push(task)
      this.lastModified = new Date()
    },

    // Set demo link
    setDemoLink(link) {
      this.testing.demoLink = link
      this.lastModified = new Date()
    },

    // Update agent status
    updateStatus(status) {
      this.status = status
      this.lastModified = new Date()
    },

    // Complete onboarding
    completeOnboarding() {
      this.hasCompletedOnboarding = true
      this.lastModified = new Date()
    },

    // Deploy agent
    deployAgent(channel, config) {
      this.deployment.channel = channel
      this.deployment.deployedAt = new Date().toLocaleString()
      this.deployment.config = { ...config }
      this.status = 'deployed'
      this.hasCompletedOnboarding = true
      this.lastModified = new Date()
    },

    // Update deployment config
    updateDeploymentConfig(config) {
      this.deployment.config = { ...this.deployment.config, ...config }
      this.lastModified = new Date()
    },

    // Unpublish agent
    unpublishAgent() {
      this.deployment.channel = null
      this.deployment.deployedAt = null
      this.status = 'ready'
      this.lastModified = new Date()
    },

    // Reset agent
    resetAgent() {
      this.$reset()
    },
  },
})
