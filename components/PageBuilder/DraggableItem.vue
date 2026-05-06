<script setup>
import { usePageBuilderStore } from '~/stores/pageBuilder'
import ComponentRenderer from './ComponentRenderer.vue'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['drag-start'])

const store = usePageBuilderStore()
const isHovered = ref(false)
const isDragging = ref(false)

const isPreview = computed(() => store.isPreview)
const isSelected = computed(
  () => store.selectedComponent === props.component.id
)

const selectComponent = () => {
  if (!isPreview.value) {
    store.selectComponent(props.component.id)
  }
}

const updateComponentProps = (newProps) => {
  store.updateComponentProps(props.component.id, newProps)
}

const handleDragStart = (event) => {
  if (isPreview.value || props.component.isEditing) {
    event.preventDefault()
    return
  }

  isDragging.value = true
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('component-id', props.component.id)

  // Add a slight opacity to the dragged element
  setTimeout(() => {
    event.target.style.opacity = '0.5'
  }, 0)

  emit('drag-start', props.component.id)
}

const handleDragEnd = (event) => {
  isDragging.value = false
  event.target.style.opacity = '1'
}

const handleDragOver = (event) => {
  if (isPreview.value || props.component.isEditing) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
}
</script>

<template>
  <div
    :class="[
      'component-wrapper group',
      {
        'component-selected': isSelected && !isPreview,
        'component-hover': isHovered && !isSelected && !isPreview,
        'component-dragging': isDragging,
        'cursor-move': !isPreview && !component.isEditing,
      },
    ]"
    :draggable="!isPreview && !component.isEditing"
    @mouseenter="!isPreview && (isHovered = true)"
    @mouseleave="!isPreview && (isHovered = false)"
    @click="selectComponent"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @dragover="handleDragOver"
  >
    <!-- Drag Handle -->
    <!-- <div
      v-if="!isPreview && (isSelected || isHovered)"
      class="component-handle"
      title="Drag to reorder"
    >
      ⋮⋮
    </div> -->

    <!-- Component Renderer -->
    <ComponentRenderer
      :component="component"
      :is-editing="component.isEditing"
      @update:props="updateComponentProps"
    />
  </div>
</template>

<style scoped>
.component-selected {
  @apply ring-2 ring-blue-500;
}

.component-hover {
  @apply ring-2 ring-gray-300;
}

.component-wrapper {
  @apply relative transition-all duration-200 ease-in-out;
}

.component-wrapper.component-dragging {
  @apply transform scale-105 shadow-lg border-2 border-gray-300 bg-gray-100;
}
</style>
