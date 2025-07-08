<script setup lang="ts">
interface JournalData {
    id: string;
    pageId: string;
    date: string;
    day: number;
    leap: number;
    session: number;
    characters: string[];
    npcs: string[];
    locations: string[];
    content: Array<{
        type: string;
        paragraph?: {
            rich_text: Array<{
                type: string;
                text: {
                    content: string;
                    link: string | null;
                },
                plain_text: string;
            }>;
        };
    }>;
}

const route = useRoute()
const id = route.params.id as string

// Single API call to get all journal data
const { data: journal, pending, error } = await useFetch<JournalData>(`/api/journals/${id}`, {
    key: `journal-${id}`,
    lazy: true,
    server: false
})
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="pending" class="space-y-4">
            <SkeletonBlock :height="'h-96'" />
        </div>
        <div v-else-if="error" class="text-red-500">
            Error: {{ error }}
        </div>
        <div v-else-if="journal" class="space-y-8">
            <!-- Header -->
            <div class="bg-nier-primary text-nier-text-inverse px-6 py-4 shadow-nier">
                <h1 class="text-3xl font-bold mb-2 font-nier">Session {{ journal.session }}</h1>
                <p class="text-lg opacity-80">Day {{ journal.day }} - Time Leap {{ journal.leap }}</p>
            </div>

            <!-- Details -->
            <div class="bg-nier-bg-primary border border-nier-primary p-6">
                <div class="space-y-4">
                    <div v-if="journal.characters.length" class="flex gap-4">
                        <span class="font-semibold min-w-32">Characters</span>
                        <span class="opacity-80">{{ journal.characters.join(', ') }}</span>
                    </div>
                    <div v-if="journal.npcs.length" class="flex gap-4">
                        <span class="font-semibold min-w-32">NPCs</span>
                        <span class="opacity-80">{{ journal.npcs.join(', ') }}</span>
                    </div>
                    <div v-if="journal.locations.length" class="flex gap-4">
                        <span class="font-semibold min-w-32">Locations</span>
                        <span class="opacity-80">{{ journal.locations.join(', ') }}</span>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="bg-nier-bg-primary border border-nier-primary p-6">
                <h2 class="text-xl font-bold mb-4 font-nier">Content</h2>
                <div class="space-y-4 font-content text-lg leading-relaxed">
                    <div v-for="(block, index) in journal.content" :key="index">
                        <!-- Paragraph -->
                        <div v-if="block.type === 'paragraph'" class="whitespace-pre-wrap font-alt-content text-lg leading-relaxed">
                            <template v-for="(text, textIndex) in block.paragraph?.rich_text || []" :key="textIndex">
                                <span>{{ text.plain_text }}</span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Back button -->
            <div class="flex justify-end">
                <NuxtLink to="/" class="nier-button-small">
                    Back to Timeline
                </NuxtLink>
            </div>
        </div>
        <div v-else class="text-center text-nier-primary opacity-70">
            Journal not found.
        </div>
    </div>
</template>

<style scoped>
.nier-button-small {
    background-color: theme('colors.nier.secondary');
    color: theme('colors.nier.primary');
    padding: 0.5rem 1rem;
    text-transform: uppercase;
    font-weight: 600;
    transition: all 0.2s ease;
    border: 1px solid theme('colors.nier.primary');
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.15);
}

.nier-button-small:hover {
    opacity: 0.9;
    transform: translateY(-1px);
}
</style> 