<template>
  <div class="min-h-screen bg-nier-bg-primary font-mono text-nier-text-primary bg-pattern">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-center border-b border-nier-primary pb-4 uppercase tracking-wider nier-title">
          Corposcape Journal
        </h1>
        <!-- Desktop Navigation -->
        <nav class="hidden md:block mt-6">
          <ul class="flex justify-center gap-4 w-full max-w-3xl mx-auto">
            <li v-for="item in menuItems" :key="item.name" class="flex-1">
              <MenuButton :text="item.name" :linkPath="item.path" :isActive="route.path === item.path" :fwIcon="item.fwIcon" />
            </li>
          </ul>
        </nav>
      </header>
      <NuxtPage />
    </div>

    <!-- Mobile Navigation -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-nier-bg-primary border-t border-nier-primary shadow-nier-top">
      <ul class="flex justify-around items-center">
        <li v-for="item in menuItems" :key="item.name">
          <NuxtLink 
            :to="item.path" 
            class="flex flex-col items-center p-2 text-nier-text-primary hover:text-nier-primary transition-colors w-16"
            :class="{ 'bg-nier-primary text-nier-bg-primary': route.path === item.path }"
          >
            <font-awesome-icon :icon="item.fwIcon" class="w-6 h-6" :class="{ 'text-nier-bg-primary': route.path === item.path }" />
            <span class="text-xs mt-1" :class="{ 'text-nier-bg-primary': route.path === item.path }">{{ item.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@500;600;700&display=swap');

.bg-pattern {
  background-image: linear-gradient(to right, theme('colors.nier.grid') 1px, transparent 1px),
                    linear-gradient(to bottom, theme('colors.nier.grid') 1px, transparent 1px);
  background-size: 20px 20px;
}

h1, h2, h3, h4, h5, h6 {
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
  border: 1px solid theme('colors.nier.primary');
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
  background: linear-gradient(90deg, transparent, theme('colors.nier.primary'), transparent);
}

/* Add bottom padding on mobile to account for the navigation bar */
@media (max-width: 768px) {
  .container {
    padding-bottom: 5rem;
  }
}
</style>

<script setup>
const route = useRoute()
const menuItems = [
  { name: 'HOME', path: '/', fwIcon: ['fas', 'house'] },
  { name: 'CHARS', path: '/characters', fwIcon: ['fas', 'users'] },
  { name: 'PEOPLE', path: '/npcs', fwIcon: ['fas', 'masks-theater'] },
  { name: 'MAP', path: '/locations', fwIcon: ['fas', 'map'] },
  { name: 'LOG', path: '/journals', fwIcon: ['fas', 'book'] }
]
</script>
