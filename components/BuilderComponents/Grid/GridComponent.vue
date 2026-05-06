<script setup>
import { computed, ref } from "vue";
import { usePageBuilderStore } from "~/stores/pageBuilder";
import RecursiveComponentRenderer from "~/components/PageBuilder/RecursiveComponentRenderer.vue";

const props = defineProps({
  id: { type: String, required: true },
  columns: { type: Number, required: true },
  children: { type: Array, required: true },
  depth: { type: Number, default: 0 },
  canNest: { type: Boolean, default: true },
});

const store = usePageBuilderStore();
const isDragOver = ref(false);
const isPreview = computed(() => store.isPreview);

const childComponents = computed(() => {
  return props.children.filter(Boolean);
});

// Add click handler for selecting the grid itself
const selectGrid = (event) => {
  // Only select grid if clicking on the grid container directly (not on children)
  if (event.target === event.currentTarget) {
    store.selectComponent(props.id);
  }
};

function onDragEnter(e) {
  console.log("onDragEnter", e);
  if (store.draggedComponentFrom === "sidebar") {
    e.preventDefault();

    // Only activate drag over if we're directly entering this grid (not a nested one)
    if (e.target === e.currentTarget) {
      e.stopPropagation(); // Prevent bubbling to parent grids
      isDragOver.value = true;
      store.isAnyGridDragOver = true;
      store.activeGridId = props.id; // Track which grid is active
    }
  }
}

function onDragOver(e) {
  console.log("onDragOver", e);
  if (store.draggedComponentFrom === "sidebar") {
    e.preventDefault();
    e.stopPropagation();
  }
}

function onDragLeave(e) {
  console.log("onDragLeave", e);
  // Only set isDragOver to false if we're actually leaving the grid container
  // Check if the relatedTarget (where we're moving to) is not a child of this grid
  const gridElement = e.currentTarget;
  const relatedTarget = e.relatedTarget;

  // If relatedTarget is null or not contained within the grid, we're leaving
  if (!relatedTarget || !gridElement.contains(relatedTarget)) {
    isDragOver.value = false;
    // Only reset global state if this was the active grid
    if (store.activeGridId === props.id) {
      store.isAnyGridDragOver = false;
      store.activeGridId = null;
    }
  }
}

function onDrop(e) {
  console.log("onDrop", e);
  if (store.draggedComponentFrom === "sidebar" && props.canNest) {
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer.getData("component-type");

    // Prevent infinite nesting of grids
    if (componentType === "grid" && props.depth >= 3) {
      console.warn("Maximum grid nesting depth reached");
      isDragOver.value = false;
      store.isAnyGridDragOver = false;
      return;
    }

    store.addComponentToGrid(props.id, componentType);
    isDragOver.value = false;
    store.isAnyGridDragOver = false;
    store.activeGridId = null;
    store.draggedComponentFrom = null;
  }
}
</script>

<template>
  <div
    class="droptik-flex-grid"
    :style="{ '--columns': columns, padding: isPreview ? '0' : '8px' }"
    @dragenter="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
    @click="selectGrid"
    :class="{
      'ring-2 ring-green-500':
        isDragOver && !isPreview && store.activeGridId === props.id,
      // 'ring-2 ring-blue-500':
      //   store.selectedComponent === props.id &&
      //   !isPreview &&
      //   !(depth > 0 && childComponents.length > 0),
      'border-2 border-gray-300 border-dashed':
        childComponents.length > 0 && !isPreview,
      'nested-grid': depth > 0,
      'disabled-nesting': !canNest,
    }"
  >
    <div
      v-if="childComponents.length === 0 && !isPreview"
      class="grid-placeholder"
    >
      {{ columns }} columns grid
      <small v-if="!canNest">(Max nesting reached)</small>
    </div>

    <RecursiveComponentRenderer
      v-else
      v-for="child in childComponents"
      :key="child.id"
      :component="child"
      :depth="depth"
    />
  </div>
</template>

<style scoped>
.droptik-flex-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  min-height: 80px;
  transition: all 0.2s ease;
}

.droptik-flex-grid > * {
  flex: 1 1 calc(100% / var(--columns) - 16px);
  min-width: 220px;
  box-sizing: border-box;
}

.nested-grid {
  min-height: 60px;
}

.disabled-nesting {
  opacity: 0.7;
  pointer-events: none;
}

.grid-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: 2px dashed #d1d5db;
  padding: 16px;
  color: #6b7280;
  font-size: 14px;
  min-height: 100px;
  width: 100%;
}
</style>
