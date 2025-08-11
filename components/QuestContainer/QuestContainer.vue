<script setup lang="ts">
const props = defineProps<{
  quest: {
    id: string
    name: string
    number: number
    nextSteps: string
    facts: {
      id: string
      sessionId: string
      sessionDate: string
      summary: string
    }[]
  }
}>()

// Sort facts by date
const sortedFacts = computed(() => {
  return [...props.quest.facts].sort((a, b) => 
    new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
  )
})

// Format date to MMM D, YYYY
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Split next steps into array
const nextStepsList = computed(() => {
  return props.quest.nextSteps?.split('\n').filter(step => step.trim()) || []
})

// Format fact summary to handle bullet points
const formatSummary = (summary: string) => {
  // Check if the summary contains a list (contains semicolons and newlines)
  if (summary.includes(';') && summary.includes('\n')) {
    // Split into prefix and list
    const [prefix, list] = summary.split('\n').map(s => s.trim())
    
    // Split the list by semicolons
    const points = list
      .split(';')
      .map(point => point.trim())
      .filter(point => point.length > 0)

    return {
      prefix,
      points
    }
  }
  return { prefix: summary, points: [] }
}
</script>

<template>
  <div class="quest-item">
    <h3 class="card-header flex items-center gap-2">
      <span class="quest-number">#{{ props.quest.number }}</span>
      {{ props.quest.name }}
    </h3>
    <div class="card-content">
      <!-- Known Facts -->
      <div class="facts-section">
        <h4 class="section-title">Known Facts</h4>
        <div class="facts-timeline">
          <div v-for="fact in sortedFacts" :key="fact.id" class="fact-item">
            <div class="fact-header">
              <div class="fact-date">{{ formatDate(fact.sessionDate) }}</div>
              <NuxtLink 
                :to="`/journals/${fact.sessionId}`" 
                class="session-link" 
                title="View full session notes"
              >
                <span class="session-link-text">View Notes</span>
                <span class="session-link-border"></span>
              </NuxtLink>
            </div>
            <div class="fact-content">
              <template v-if="formatSummary(fact.summary).points.length > 0">
                <p v-if="formatSummary(fact.summary).prefix" class="mb-2">
                  {{ formatSummary(fact.summary).prefix }}
                </p>
                <ul class="fact-bullet-list">
                  <li v-for="(point, index) in formatSummary(fact.summary).points" :key="index">
                    {{ point }}
                  </li>
                </ul>
              </template>
              <template v-else>
                {{ fact.summary }}
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div class="next-steps-section">
        <h4 class="section-title">Next Steps</h4>
        <ul class="next-steps-list">
          <li v-for="(step, index) in nextStepsList" :key="index">
            {{ step.replace(/^-\s*/, '') }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quest-item {
  position: relative;
  border: 1px solid #454138;
  background-color: #d1cdb7;
}

.card-header {
  background-color: #454138;
  color: #bab5a1;
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.25);
}

.quest-number {
  font-family: monospace;
  font-size: 0.9em;
  padding: 0.1rem 0.4rem;
  background-color: rgba(186, 181, 161, 0.2);
  border-radius: 4px;
}

.card-content {
  color: #454138;
  padding: 1rem;
}

.section-title {
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
  color: #454138;
  opacity: 0.8;
}

.facts-section {
  margin-bottom: 1.5rem;
}

.facts-timeline {
  position: relative;
  padding-left: 1rem;
}

.facts-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #454138;
  opacity: 0.3;
}

.fact-item {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.fact-item:last-child {
  margin-bottom: 0;
}

.fact-item::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 0.5rem;
  width: 10px;
  height: 10px;
  border: 2px solid #454138;
  background-color: #d1cdb7;
  border-radius: 50%;
  opacity: 0.6;
}

.fact-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.fact-date {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: #454138;
  opacity: 0.7;
}

.session-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0.15rem 0.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #454138;
  background-color: rgba(69, 65, 56, 0.1);
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.session-link-text {
  position: relative;
  z-index: 2;
}

.session-link-border {
  position: absolute;
  inset: 0;
  border: 1px solid #454138;
  opacity: 0.3;
  transition: all 0.2s ease;
}

.session-link-border::before,
.session-link-border::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border: 1px solid #454138;
  opacity: 0.5;
  transition: all 0.2s ease;
}

.session-link-border::before {
  top: -1px;
  right: -1px;
  border-left: none;
  border-bottom: none;
}

.session-link-border::after {
  bottom: -1px;
  left: -1px;
  border-right: none;
  border-top: none;
}

.session-link:hover {
  background-color: rgba(69, 65, 56, 0.15);
  transform: translateY(-1px);
}

.session-link:hover .session-link-border {
  opacity: 0.6;
}

.session-link:hover .session-link-border::before,
.session-link:hover .session-link-border::after {
  opacity: 0.8;
  width: 6px;
  height: 6px;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .fact-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .session-link {
    margin-left: 0;
    font-size: 0.65rem;
    padding: 0.1rem 0.4rem;
  }
}

.fact-content {
  font-size: 0.95rem;
  line-height: 1.4;
}

.fact-bullet-list {
  list-style: none;
  padding-left: 1rem;
}

.fact-bullet-list li {
  position: relative;
  padding-left: 1rem;
  margin-bottom: 0.25rem;
}

.fact-bullet-list li:last-child {
  margin-bottom: 0;
}

.fact-bullet-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #454138;
  opacity: 0.7;
}

.next-steps-section {
  position: relative;
  margin: 1.5rem -1rem -1rem;
  padding: 1.5rem 1rem 1rem;
  background-color: #454138;
  color: #d1cdb7;
}

.next-steps-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 1rem;
  right: 1rem;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    #bab5a1,
    transparent
  );
  opacity: 0.3;
}

.next-steps-section .section-title {
  color: #bab5a1;
  opacity: 1;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  position: relative;
}

.next-steps-section .section-title::before {
  content: '!';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-family: monospace;
  font-size: 1.1em;
  font-weight: bold;
  color: #bab5a1;
  opacity: 0.7;
}

.next-steps-list {
  list-style: none;
  padding: 0 0 0 0.5rem;
  border-left: 2px solid rgba(186, 181, 161, 0.2);
}

.next-steps-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.next-steps-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #bab5a1;
  opacity: 0.7;
}

.next-steps-list li:last-child {
  margin-bottom: 0;
}

.next-steps-list li:hover {
  color: #ffffff;
  transition: color 0.2s ease;
}
</style>