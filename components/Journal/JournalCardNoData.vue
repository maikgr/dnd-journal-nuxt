<template>
  <div class="min-h-[400px] h-[calc(100vh-24rem)] max-h-[600px] bg-nier-bg-primary border border-nier-primary flex flex-col overflow-hidden shadow-nier">
    <!-- Empty Header to match regular card -->
    <div class="bg-nier-primary px-4 py-2 border-b border-nier-primary">
      <span class="text-sm font-mono text-nier-bg-primary opacity-0">[NO DATA]</span>
    </div>

    <!-- Error Content -->
    <div class="flex-1 flex flex-col p-4 min-h-0 relative overflow-hidden">
      <!-- Background Error Text -->
      <div class="absolute inset-0 flex flex-col select-none pointer-events-none opacity-10 leading-none font-mono">
        <template v-for="n in 50" :key="n">
          <!-- Even rows -->
          <div class="whitespace-nowrap text-lg">
            [NO DATA][NO DATA][NO DATA][NO DATA][NO DATA][NO DATA]
          </div>
          <!-- Odd rows -->
          <div class="whitespace-nowrap text-lg">
            DATA][NO DATA][NO DATA][NO DATA][NO DATA][NO DATA][NO
          </div>
        </template>
      </div>

      <!-- Centered Error Message -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-nier-warning font-mono text-4xl">
          [ NO DATA ]
        </div>
      </div>
    </div>
  </div>
</template>