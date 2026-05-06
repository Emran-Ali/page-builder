<script setup>
import {computed} from "vue";
import {usePageBuilderStore} from "@stores/pageBuilder";
import BaseLucide from "../../../components/base/Lucide.vue";

const store = usePageBuilderStore();

const categorizedComponents = computed(() => {
  const categories = {};

  store.componentLibrary.forEach((component) => {
    const category = component.category || "General";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(component);
  });

  return Object.entries(categories).map(([name, components]) => ({
    name,
    components,
  }));
});

const totalComponents = computed(() => store.currentPage.components.length);

const handleDragStart = (event, component) => {
  event.dataTransfer.setData("component-type", component.id);
  event.dataTransfer.effectAllowed = "copy";

  // Visual feedback
  event.target.style.opacity = "0.5";

  // Store the dragged component type
  store.draggedComponent = component.id;
  store.draggedComponentFrom = "sidebar"; // <-- set drag source
};

const handleDragEnd = (event) => {
  event.target.style.opacity = "1";
  store.draggedComponent = null;
  store.draggedComponentFrom = null; // <-- clear drag source
};
</script>

<template>
  <div class="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Components</h2>
      <p class="text-sm text-gray-600">Drag components to the canvas</p>
    </div>

    <!-- Component Library -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="space-y-4">
        <!-- Group components by category -->
        <div
          v-for="category in categorizedComponents"
          :key="category.name"
          class="space-y-2"
        >
          <h3 class="text-sm font-medium text-gray-700 uppercase tracking-wide">
            {{ category.name }}
          </h3>

          <div class="grid grid-cols-1 gap-2">
            <div
              v-for="component in category.components"
              :key="component.id"
              class="component-item p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:shadow-md transition-shadow"
              :draggable="true"
              @dragstart="handleDragStart($event, component)"
              @dragend="handleDragEnd"
            >
              <div class="text-center">
                <div class="flex justify-center mb-2">
                  <!-- Image icon (URL/path or imported asset) -->
                  <img
                    v-if="
                      component.icon &&
                      typeof component.icon === 'string' &&
                      (component.icon.startsWith('/') ||
                        component.icon.startsWith('http') ||
                        component.icon.startsWith('data:') ||
                        component.icon.includes('.png') ||
                        component.icon.includes('.svg') ||
                        component.icon.includes('.jpg') ||
                        component.icon.includes('.jpeg'))
                    "
                    :src="component.icon"
                    alt=""
                    class="text-gray-600 rounded-lg w-full h-full object-contain"
                  />
                  <!-- Lucide icon -->
                  <BaseLucide
                    v-else
                    :name="component.icon"
                    :size="24"
                    class="text-gray-600"
                  />
                </div>
                <div class="text-sm font-medium text-gray-900">
                  {{ component.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Component Count -->
    <div class="p-4 border-t border-gray-200 bg-white">
      <div class="text-sm text-gray-600">
        <span class="font-medium">{{ totalComponents }}</span> components on
        canvas
      </div>
    </div>
  </div>
</template>

<style scoped>
.component-item {
  transition: all 0.2s ease;
}

.component-item:hover {
  transform: translateY(-1px);
}

.component-item:active {
  transform: translateY(0);
}
</style>
