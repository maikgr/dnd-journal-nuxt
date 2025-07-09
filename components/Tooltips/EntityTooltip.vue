<script setup lang="ts">
import CharacterTooltips from './CharacterTooltips.vue'
interface Props {
    // Entity data
    name: string
    charClass?: string
    occupation?: string
    flavor?: string
    species?: string
    // Position and state
    triggerRef?: HTMLElement | null
}

const emit = defineEmits<{
    close: []
}>()

const props = defineProps<Props>()
const isPinned = ref(false)
const tooltipRef = ref<HTMLElement | null>(null)

// Position state
const position = reactive({
    x: 0,
    y: 0
})

// Calculate position based on trigger element
const updatePosition = () => {
    if (!props.triggerRef || !tooltipRef.value) return
    
    const triggerRect = props.triggerRef.getBoundingClientRect()
    const tooltipRect = tooltipRef.value.getBoundingClientRect()
    
    // Initial position below the trigger
    let x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2
    let y = triggerRect.bottom + 8 // 8px offset
    
    // Viewport boundaries
    const viewport = {
        right: window.innerWidth - 8, // 8px margin
        bottom: window.innerHeight - 8
    }
    
    // Adjust if tooltip would overflow viewport
    if (x + tooltipRect.width > viewport.right) {
        x = viewport.right - tooltipRect.width
    }
    if (x < 8) x = 8
    
    // If tooltip would overflow bottom, show above instead
    if (y + tooltipRect.height > viewport.bottom) {
        y = triggerRect.top - tooltipRect.height - 8
    }
    
    position.x = x
    position.y = y
}

const onClick = () => {
    isPinned.value = true
}

const onClose = () => {
    isPinned.value = false
    emit('close')
}

// Click outside handler
const onClickOutside = (event: MouseEvent) => {
    if (!isPinned.value) return
    
    const target = event.target as HTMLElement
    if (!tooltipRef.value?.contains(target) && !props.triggerRef?.contains(target)) {
        isPinned.value = false
        emit('close')
    }
}

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('click', onClickOutside)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    nextTick(updatePosition)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', onClickOutside)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
})

// Watch for trigger ref changes to update position
watch(() => props.triggerRef, () => {
    nextTick(updatePosition)
})
</script>

<template>
    <Teleport to="body">
        <Transition name="tooltip">
            <div
                ref="tooltipRef"
                class="tooltip-container"
                :class="{ 'tooltip-pinned': isPinned }"
                :style="{
                    left: `${position.x}px`,
                    top: `${position.y}px`
                }"
                @click="onClick"
            >
                <div class="tooltip-content">
                    <CharacterTooltips
                        :name="name"
                        :char-class="charClass || ''"
                        :occupation="occupation || ''"
                        :species="species || ''"
                        :flavor="flavor || ''"
                    />
                    <button
                        v-if="isPinned"
                        class="close-button"
                        @click.stop="onClose"
                    >
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                    </button>
                </div>
                <div class="tooltip-arrow" />
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.tooltip-container {
    position: fixed;
    z-index: 1000;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.tooltip-content {
    position: relative;
    background: theme('colors.nier.bg-primary');
    border: 1px solid theme('colors.nier.primary');
    border-radius: 4px;
    min-width: 280px;
    max-width: 400px;
}

.tooltip-arrow {
    position: absolute;
    width: 12px;
    height: 12px;
    background: theme('colors.nier.bg-primary');
    border: 1px solid theme('colors.nier.primary');
    border-right: none;
    border-bottom: none;
    left: 50%;
    top: -6px;
    transform: translateX(-50%) rotate(45deg);
    clip-path: polygon(-5px -5px, 100% -5px, 100% 100%, -5px 100%);
}

.tooltip-pinned .tooltip-content {
    box-shadow: 0 0 0 2px theme('colors.nier.primary');
}

.close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background: theme('colors.nier.primary');
    color: theme('colors.nier.text-inverse');
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
}

.close-button:hover {
    opacity: 1;
}

/* Transition animations */
.tooltip-enter-active,
.tooltip-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.tooltip-enter-from,
.tooltip-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style> 