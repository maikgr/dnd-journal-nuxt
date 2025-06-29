<template>
  <div class="space-y-8">
    <!-- Stats Section -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="stats-card col-span-1 md:col-span-3">
        <h2 class="card-header">Campaign Statistics</h2>
        <div class="card-content grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="stat-item">
            <p class="text-sm opacity-70">Last Played</p>
            <p class="text-xl">2024-03-20</p>
          </div>
          <div class="stat-item">
            <p class="text-sm opacity-70">Total Sessions</p>
            <p class="text-xl">12</p>
          </div>
          <div class="stat-item">
            <p class="text-sm opacity-70">PCs</p>
            <p class="text-xl">4</p>
          </div>
          <div class="stat-item">
            <p class="text-sm opacity-70">NPCs</p>
            <p class="text-xl">24</p>
          </div>
          <div class="stat-item">
            <p class="text-sm opacity-70">Locations</p>
            <p class="text-xl">15</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Sessions Section -->
    <section class="recent-sessions nier-section">
      <h2 class="section-header">Recent Sessions</h2>
      <div class="space-y-4">
        <div class="session-card">
          <h3 class="card-header flex justify-between items-center">
            <span>The Haunted Mines</span>
            <span class="text-sm">2024-03-20</span>
          </h3>
          <div class="card-content">
            <p class="text-sm mb-2 opacity-80">
              The party ventured deep into the abandoned mines of Mount Shadowpeak, 
              discovering ancient dwarven ruins and encountering hostile spirits...
            </p>
            <div class="flex justify-between items-center">
              <div class="text-sm opacity-70">
                Players: Alice, Bob, Charlie, David
              </div>
              <button class="nier-button-small">Read more...</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Active Quests Section -->
    <section class="quests nier-section">
      <h2 class="section-header">Active Quests</h2>
      <div class="space-y-2">
        <div class="quest-item">
          <h3 class="card-header">The Lost Artifact</h3>
          <div class="card-content">
            <p class="text-sm opacity-80">Find the ancient artifact in the Shadowpeak mines</p>
            <div class="flex items-center mt-1">
              <span class="text-xs px-2 py-1 bg-[#454138] text-[#bab5a1]">In Progress</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stats-card, .session-card, .quest-item {
  position: relative;
  border: 1px solid #454138;
}

.card-header {
  background-color: #454138;
  color: #bab5a1;
  padding: 0.75rem 1rem;
  font-weight: 600;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.25);
}

.card-content {
  background-color: #d1cdb7;
  color: #454138;
  padding: 1rem;
}

.section-header {
  position: relative;
  font-size: 1.25rem;
  font-weight: 600;
  padding-left: 1rem;
  margin-bottom: 1rem;
  color: #454138;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
}

.section-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: #454138;
}

.section-header::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #454138;
}

.nier-section .section-header::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid #454138;
  right: -4px;
  top: -4px;
  border-left: none;
  border-bottom: none;
  background: none;
}

.nier-section .section-header::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid #454138;
  left: -4px;
  bottom: -4px;
  border-right: none;
  border-top: none;
  background: none;
}

.stat-item {
  background-color: #d1cdb7;
  border: 1px solid #454138;
  padding: 0.75rem;
}

.nier-button-small {
  background-color: #bab5a1;
  color: #454138;
  padding: 0.25rem 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  transition: all 0.2s ease;
  border: 1px solid #454138;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
}

.nier-button-small:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.text-primary {
  color: var(--primary-color);
}
</style>

<script setup>
const cardClasses = "bg-[#bab5a1] p-4 rounded border border-[#454138]"
const statItemClasses = "p-3 bg-[#bab5a1] rounded border border-[#454138]"
const readMoreClasses = "px-3 py-1 text-sm bg-[#d1cdb7] hover:bg-[#ccc8b1] rounded transition-colors"
</script> 