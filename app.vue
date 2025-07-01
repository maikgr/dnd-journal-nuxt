<template>
  <div class="min-h-screen bg-pattern text-primary-text font-mono">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-center border-b border-nier-primary pb-4 uppercase tracking-wider nier-title">
          Corposcape Campaign Journal
        </h1>
        <nav class="mt-6">
          <ul class="flex justify-center gap-4 w-full max-w-3xl mx-auto">
            <li v-for="item in menuItems" :key="item.name" class="flex-1">
              <MenuButton :text="item.name" :linkPath="item.path" :isActive="route.path === item.path" :fwIcon="item.fwIcon" />
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
@import "tailwindcss";

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
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.25);
  position: relative;
}

.nier-title {
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
  { name: 'HOME', path: '/', fwIcon: ['fas', 'house'] },
  { name: 'CHARS', path: '/chars', fwIcon: ['fas', 'users'] },
  { name: 'NPCS', path: '/npcs', fwIcon: ['fas', 'masks-theater'] },
  { name: 'MAP', path: '/map', fwIcon: ['fas', 'map'] },
  { name: 'JOURNAL', path: '/journals', fwIcon: ['fas', 'book'] }
]
</script>
