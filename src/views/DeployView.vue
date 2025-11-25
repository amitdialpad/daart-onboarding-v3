<template>
  <div class="deploy-view">
    <!-- Header -->
    <div class="deploy-header">
      <div class="header-content">
        <h1 class="deploy-title">Deploy Your Agent</h1>
        <span class="status-badge" :class="deploymentStatus === 'live' ? 'badge-success' : 'badge-neutral'">
          {{ statusText }}
        </span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="deploy-content">
      <!-- Not Deployed State -->
      <div v-if="deploymentStatus === 'draft'">
        <!-- Step 1: Channel Selection -->
        <div class="intercom-section">
          <h2 class="intercom-section-title">Choose Deployment Channel</h2>
          <p class="intercom-section-description">Select where your agent will be available to users</p>

          <div class="intercom-option-grid">
            <div
              v-for="channel in channels"
              :key="channel.id"
              @click="!channel.disabled && (selectedChannel = channel.id)"
              :class="['intercom-option-card', {
                selected: selectedChannel === channel.id,
                'opacity-50 cursor-not-allowed': channel.disabled
              }]"
            >
              <div class="intercom-option-icon">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h14v10H3V5zm2 2v6h10V7H5z" fill="currentColor"/>
                </svg>
              </div>
              <h3 class="intercom-option-title">{{ channel.name }}</h3>
              <p class="intercom-option-description">{{ channel.description }}</p>
              <span v-if="channel.disabled" class="intercom-badge intercom-badge-neutral" style="margin-top: var(--dt-space-300)">
                Coming Soon
              </span>
            </div>
          </div>
        </div>

        <!-- Step 2: Configuration -->
        <div v-if="selectedChannel" class="intercom-section">
          <h2 class="intercom-section-title">Configure Deployment</h2>
          <p class="intercom-section-description">Set up how your agent will behave</p>

          <div class="intercom-card" style="max-width: 800px;">
            <div style="display: flex; flex-direction: column; gap: var(--dt-space-500);">
              <div>
                <label class="intercom-label">Greeting Message</label>
                <textarea
                  v-model="config.greetingMessage"
                  class="intercom-input intercom-textarea"
                  rows="2"
                  placeholder="Hi! I'm your AI assistant. How can I help you today?"
                ></textarea>
              </div>

              <div>
                <label class="intercom-label">Working Hours</label>
                <select v-model="config.workingHours" class="intercom-input">
                  <option value="24/7">24/7 - Always available</option>
                  <option value="business">Business hours only</option>
                  <option value="custom">Custom schedule</option>
                </select>
              </div>

              <div>
                <label class="intercom-label">Fallback Behavior</label>
                <select v-model="config.fallbackBehavior" class="intercom-input">
                  <option value="escalate">Escalate to human support</option>
                  <option value="apologize">Apologize and provide contact info</option>
                  <option value="retry">Ask user to rephrase</option>
                </select>
              </div>

              <div>
                <label class="intercom-label">
                  Escalation Threshold
                  <span class="intercom-label-optional">(optional)</span>
                </label>
                <p class="intercom-page-description" style="margin-bottom: var(--dt-space-300);">
                  Number of failed attempts before escalating
                </p>
                <select v-model="config.escalationThreshold" class="intercom-input">
                  <option value="1">After 1 failed attempt</option>
                  <option value="2">After 2 failed attempts</option>
                  <option value="3">After 3 failed attempts</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Installation Code -->
        <div v-if="selectedChannel === 'chat'" class="intercom-section">
          <h2 class="intercom-section-title">Install Widget</h2>
          <p class="intercom-section-description">Add this code snippet to your website</p>

          <div class="intercom-card" style="max-width: 800px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--dt-space-400);">
              <span style="font-weight: var(--dt-font-weight-medium); color: var(--dt-color-foreground-secondary);">HTML</span>
              <button @click="copyCode" class="intercom-button intercom-button-secondary">
                {{ codeCopied ? 'Copied!' : 'Copy Code' }}
              </button>
            </div>
            <pre style="background: #f5f5f5; padding: var(--dt-space-450); border-radius: 8px; overflow-x: auto; font-family: 'Monaco', 'Courier New', monospace; font-size: 13px; line-height: 1.5; color: #333;"><code>{{ installationCode }}</code></pre>

            <div class="intercom-divider"></div>

            <h4 style="font-size: var(--dt-font-size-300); font-weight: var(--dt-font-weight-bold); margin: 0 0 var(--dt-space-400);">
              Installation Instructions
            </h4>
            <ol style="margin: 0; padding-left: var(--dt-space-550); color: var(--dt-color-foreground-secondary); line-height: 1.8;">
              <li>Copy the code snippet above</li>
              <li>Paste it before the closing &lt;/body&gt; tag in your HTML</li>
              <li>Save and deploy your website</li>
              <li>The chat widget will appear in the bottom-right corner</li>
            </ol>
          </div>
        </div>

        <!-- Deploy Button -->
        <div v-if="selectedChannel" style="margin-top: var(--dt-space-700); display: flex; justify-content: flex-start;">
          <button @click="confirmDeploy" class="intercom-button intercom-button-primary" style="font-size: var(--dt-font-size-300); padding: 14px 32px;">
            Go Live Now
          </button>
        </div>
      </div>

      <!-- Deployed State -->
      <div v-else>
        <div class="intercom-card" style="text-align: center; margin: 0 auto var(--dt-space-700);">
          <div style="width: 64px; height: 64px; background: var(--dt-color-green-100); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--dt-space-500); font-size: 32px;">
            ✓
          </div>
          <h2 style="font-size: 28px; font-weight: var(--dt-font-weight-bold); margin: 0 0 var(--dt-space-300); color: var(--dt-color-foreground-primary);">
            Your Agent is Live!
          </h2>
          <p style="font-size: var(--dt-font-size-300); color: var(--dt-color-foreground-secondary); margin: 0;">
            {{ agentName }} is now deployed and handling conversations on {{ getChannelName(selectedChannel) }}
          </p>
        </div>

        <div class="intercom-card">
          <h3 class="intercom-card-title" style="margin-bottom: var(--dt-space-500);">Deployment Details</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--dt-space-550) var(--dt-space-600);">
            <div>
              <span style="font-size: var(--dt-font-size-100); color: var(--dt-color-foreground-secondary); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: var(--dt-space-300);">Channel</span>
              <span style="font-size: var(--dt-font-size-200); font-weight: var(--dt-font-weight-medium); color: var(--dt-color-foreground-primary);">{{ getChannelName(selectedChannel) }}</span>
            </div>
            <div>
              <span style="font-size: var(--dt-font-size-100); color: var(--dt-color-foreground-secondary); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: var(--dt-space-300);">Deployed</span>
              <span style="font-size: var(--dt-font-size-200); font-weight: var(--dt-font-weight-medium); color: var(--dt-color-foreground-primary);">{{ deployedAt }}</span>
            </div>
            <div>
              <span style="font-size: var(--dt-font-size-100); color: var(--dt-color-foreground-secondary); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: var(--dt-space-300);">Status</span>
              <span class="intercom-badge intercom-badge-success">Live</span>
            </div>
            <div>
              <span style="font-size: var(--dt-font-size-100); color: var(--dt-color-foreground-secondary); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: var(--dt-space-300);">Greeting</span>
              <span style="font-size: var(--dt-font-size-200); font-weight: var(--dt-font-weight-medium); color: var(--dt-color-foreground-primary);">{{ config.greetingMessage }}</span>
            </div>
          </div>

          <div class="intercom-divider"></div>

          <div style="display: flex; gap: var(--dt-space-400); flex-wrap: wrap;">
            <button @click="viewMonitor" class="intercom-button intercom-button-primary">
              View Performance
            </button>
            <button @click="goToTest" class="intercom-button intercom-button-secondary">
              Test Agent
            </button>
            <button @click="handleUpdate" class="intercom-button intercom-button-secondary">
              Update Configuration
            </button>
            <button @click="handleUnpublish" class="intercom-button intercom-button-ghost" style="color: var(--dt-color-red-500);">
              Unpublish
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAgentStore } from '../stores/agent'

const router = useRouter()
const agentStore = useAgentStore()

const agentName = computed(() => agentStore.name || 'AI Agent')

const deploymentStatus = ref('draft') // draft | live
const selectedChannel = ref(null)
const codeCopied = ref(false)

const config = ref({
  greetingMessage: "Hi! I'm your AI assistant. How can I help you today?",
  workingHours: '24/7',
  fallbackBehavior: 'escalate',
  escalationThreshold: '2'
})

const deployedAt = ref(null)

// Initialize from agent store on mount
onMounted(() => {
  if (agentStore.deployment.channel) {
    // Agent is deployed, load the deployment info
    selectedChannel.value = agentStore.deployment.channel
    deployedAt.value = agentStore.deployment.deployedAt
    config.value = { ...agentStore.deployment.config }
    deploymentStatus.value = 'live'
  }
})

const channels = [
  {
    id: 'chat',
    name: 'Chat Widget',
    icon: '',
    description: 'Add a chat widget to your website for instant support',
    disabled: false
  },
  {
    id: 'email',
    name: 'Email',
    icon: '',
    description: 'Handle customer emails automatically',
    disabled: true
  },
  {
    id: 'phone',
    name: 'Phone',
    icon: '',
    description: 'Answer phone calls with AI voice agent',
    disabled: true
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '',
    description: 'Deploy in your Slack workspace',
    disabled: true
  }
]

const statusText = computed(() => {
  return deploymentStatus.value === 'live' ? 'Live' : 'Not Deployed'
})

const installationCode = computed(() => {
  const agentId = agentName.value.toLowerCase().replace(/\s+/g, '-')
  return `<script>
  (function() {
    var daart = document.createElement('script');
    daart.type = 'text/javascript';
    daart.async = true;
    daart.src = 'https://cdn.daart.ai/widget.js';
    daart.setAttribute('data-agent-id', '${agentId}');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(daart, s);
  })();
<\/script>`
})

const getChannelName = (channelId) => {
  const channel = channels.find(c => c.id === channelId)
  return channel ? channel.name : 'Unknown'
}

const goBack = () => {
  router.push('/builder')
}

const goToTest = () => {
  router.push('/test-mode')
}

const viewMonitor = () => {
  router.push('/monitor')
}

const copyCode = () => {
  navigator.clipboard.writeText(installationCode.value)
  codeCopied.value = true
  setTimeout(() => {
    codeCopied.value = false
  }, 2000)
}

const confirmDeploy = () => {
  // Deploy agent in store (persists deployment info)
  agentStore.deployAgent(selectedChannel.value, config.value)

  // Update local state
  deploymentStatus.value = 'live'
  deployedAt.value = agentStore.deployment.deployedAt

  // Celebrate!
  setTimeout(() => {
    alert('Congratulations! Your agent is now live and ready to help customers.')
  }, 300)
}

const handleUpdate = () => {
  deploymentStatus.value = 'draft'
}

const handleUnpublish = () => {
  if (confirm('Are you sure you want to unpublish your agent? It will stop handling conversations immediately.')) {
    // Unpublish in store
    agentStore.unpublishAgent()

    // Update local state
    deploymentStatus.value = 'draft'
    deployedAt.value = null
    selectedChannel.value = null
  }
}
</script>

<style scoped>
.deploy-view {
  min-height: 100vh;
  background: var(--dt-color-surface-secondary);
}

/* Header */
.deploy-header {
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
  gap: var(--dt-space-500);
}

.deploy-title {
  margin: 0;
  font-size: var(--dt-font-size-400);
  font-weight: var(--dt-font-weight-medium);
  color: var(--dt-color-foreground-primary);
}

.status-badge {
  padding: var(--dt-space-200) var(--dt-space-350);
  border-radius: var(--dt-size-radius-200);
  font-size: 11px;
  font-weight: var(--dt-font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.badge-success {
  background: var(--dt-color-green-100);
  color: var(--dt-color-green-600);
}

.status-badge.badge-neutral {
  background: var(--dt-color-surface-secondary);
  color: var(--dt-color-foreground-secondary);
}

/* Content */
.deploy-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--dt-space-600);
}

/* Minimal additional styles - most styling comes from intercom-styles.css */
.opacity-50 {
  opacity: 0.5;
}

.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
