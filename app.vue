<template>
  <div class="min-h-screen bg-pattern text-primary-text font-mono">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-center border-b border-[#454138] pb-4 uppercase tracking-wider nier-heading">
          Corposcape Campaign Journal
        </h1>
        <nav class="mt-6">
          <ul class="flex justify-center gap-4 w-full max-w-3xl mx-auto">
            <li v-for="item in menuItems" :key="item.name" class="flex-1">
              <NuxtLink :to="item.path" class="nier-button flex items-center w-full" :class="{ 'active': route.path === item.path }">
                <div class="w-4 h-4 border border-[#454138] mr-3 flex-shrink-0"></div>
                <span>{{ item.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </header>
      <NuxtPage />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap');

:root {
  --primary-color: #454138;
  --text-color: #454138;
  --bg-color: #d1cdb7;
  --grid-color: #ccc8b1;
  --button-bg: #bab5a1;
}

body {
  font-family: 'Share Tech Mono', monospace;
  color: var(--text-color);
}

.bg-pattern {
  background-color: var(--bg-color);
  background-image: linear-gradient(to right, var(--grid-color) 1px, rgba(204, 200, 177, 0) 1px), 
                    linear-gradient(to bottom, var(--grid-color) 1px, rgba(204, 200, 177, 0) 1px);
  background-size: 20px 20px;
}

h1, h2, h3, h4, h5, h6, .nier-button {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
}

.nier-heading {
  text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.25);
  position: relative;
}

.nier-heading::before,
.nier-heading::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  border: 1px solid var(--primary-color);
}

.nier-heading::before {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}

.nier-heading::after {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}

.nier-button {
  background-color: var(--button-bg);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 120px;
  position: relative;
  overflow: hidden;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
}

.nier-button::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0;
  background-color: var(--primary-color);
  transition: width 0.2s ease-in-out;
  z-index: 0;
}

.nier-button:hover::before {
  width: 100%;
}

.nier-button > * {
  position: relative;
  z-index: 1;
}

.nier-button:hover {
  color: var(--button-bg);
}

.nier-button.active {
  background-color: var(--primary-color);
  color: var(--button-bg);
}

.container {
  position: relative;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
}
</style>

<script setup>
const route = useRoute()
const menuItems = [
  { name: 'HOME', path: '/' },
  { name: 'CHARS', path: '/chars' },
  { name: 'NPCS', path: '/npcs' },
  { name: 'MAP', path: '/map' },
  { name: 'JOURNAL', path: '/journal' }
]
</script>
