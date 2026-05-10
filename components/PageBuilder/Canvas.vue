<script setup>
import {usePageBuilderStore} from "~/stores/pageBuilder";
import BaseLucide from "../../../components/base/Lucide.vue";
import DraggableItem from "./DraggableItem.vue";

const store = usePageBuilderStore();
const canvasRef = ref(null);
const isDragOver = ref(false);
const dragOverIndex = ref(-1);
const draggedComponentIndex = ref(-1);

const components = computed(() => store.currentPage.components);

const isAnyGridDragOver = computed(() => store.isAnyGridDragOver);

const handleDragOver = (event) => {
  if (isAnyGridDragOver.value) {
    return;
  }
  event.preventDefault();
  isDragOver.value = true;

  // Calculate drop index based on mouse position
  if (components.value.length > 0) {
    const rect = canvasRef.value.getBoundingClientRect();
    const y = event.clientY - rect.top;

    // Find the component we're hovering over
    let newIndex = -1;

    const componentElements = canvasRef.value.querySelectorAll(
      ".component-container",
    );

    for (let i = 0; i < componentElements.length; i++) {
      const elementRect = componentElements[i].getBoundingClientRect();
      const elementY = elementRect.top - rect.top;
      const elementHeight = elementRect.height;

      if (y < elementY + elementHeight / 2) {
        newIndex = i;
        break;
      }
    }

    if (newIndex === -1) {
      newIndex = components.value.length;
    }

    dragOverIndex.value = newIndex;
  } else {
    dragOverIndex.value = 0;
  }
};

const handleDragLeave = (event) => {
  if (!canvasRef.value.contains(event.relatedTarget)) {
    isDragOver.value = false;
    dragOverIndex.value = -1;
  }
};

const handleDrop = (event) => {
  if (isAnyGridDragOver.value) {
    return;
  }
  event.preventDefault();
  isDragOver.value = false;

  const componentType = event.dataTransfer.getData("component-type");
  const draggedComponentId = event.dataTransfer.getData("component-id");

  if (componentType) {
    // Adding new component from sidebar
    const insertIndex =
      dragOverIndex.value >= 0 ? dragOverIndex.value : components.value.length;
    store.addComponent(componentType, null, insertIndex);
  } else if (draggedComponentId) {
    // Reordering existing component
    const currentIndex = components.value.findIndex(
      (c) => c.id === draggedComponentId,
    );
    let newIndex = dragOverIndex.value;

    if (currentIndex !== -1 && newIndex !== -1 && currentIndex !== newIndex) {
      // Adjust index if moving down
      if (newIndex > currentIndex) {
        newIndex--;
      }
      store.moveComponent(draggedComponentId, newIndex);
    }
  }

  dragOverIndex.value = -1;
  draggedComponentIndex.value = -1;
};

const handleCanvasClick = (event) => {
  if (event.target === canvasRef.value) {
    store.selectComponent(null);
  }
};

const handleComponentDragStart = (componentId) => {
  draggedComponentIndex.value = components.value.findIndex(
    (c) => c.id === componentId,
  );
};

watch(
  () => store.isAnyGridDragOver,
  (newValue) => {
    if (newValue) {
      // A grid is handling the drag, reset canvas state
      isDragOver.value = false;
      dragOverIndex.value = -1;
    }
  },
);
</script>

<template>
  <div class="h-full bg-[#F7F7F8] overflow-auto">
    <div
      ref="canvasRef"
      class="min-h-full p-8 relative mx-auto"
      :style="{
        maxWidth: store.currentPage.settings.maxWidth
          ? `${store.currentPage.settings.maxWidth.value}${store.currentPage.settings.maxWidth.unit}`
          : '1200px',
      }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="handleCanvasClick"
    >
      <!-- Drop placeholder -->
      <div
        v-if="components.length === 0 && !isDragOver"
        class="flex items-center justify-center h-64 text-gray-500"
      >
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <BaseLucide name="Palette" :size="48" class="text-gray-400" />
          </div>

          <p class="text-medium">Drag components from the sidebar to begin</p>
        </div>
      </div>

      <!-- Components with drop zones -->
      <template v-for="(component, index) in components" :key="component.id">
        <!-- Drop zone above component -->
        <div
          v-if="isDragOver && dragOverIndex === index"
          class="drop-indicator"
        >
          <div class="drop-line" />
          <div class="drop-label">Drop here</div>
        </div>

        <!-- Component -->
        <div class="mb-12 component-container">
          <DraggableItem
            :component="component"
            @drag-start="handleComponentDragStart"
          />
        </div>
      </template>

      <!-- Drop zone at the end -->
      <div
        v-if="isDragOver && dragOverIndex === components.length"
        class="drop-indicator"
      >
        <div class="drop-line" />
        <div class="drop-label">Drop here</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scaleY(0.5);
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

.drop-indicator {
  @apply relative my-4 flex items-center justify-center;
  animation: fadeIn 0.2s ease-in-out;
  min-height: 40px;
}

.drop-line {
  @apply absolute inset-x-0 h-0.5 bg-blue-500 rounded;
  top: 50%;
  transform: translateY(-50%);
}

.drop-label {
  @apply bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10;
}

.component-container {
  @apply transition-all duration-200 ease-in-out;
}

:deep(.rte-content) {
  word-break: normal;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 100%;
}
</style>
