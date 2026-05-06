<script setup>
import {usePageBuilderStore} from "@stores/pageBuilder";
import TableComponent from "@components/BuilderComponents/Table/TableComponent.vue";
import CardComponent from "@components/BuilderComponents/Card/CardComponent.vue";
import GridComponent from "@components/BuilderComponents/Grid/GridComponent.vue";
import DataTableComponent from "@components/BuilderComponents/DataTable/DataTableComponent.vue";
import TextComponent from "@components/BuilderComponents/Text/TextComponent.vue";
import ImageComponent from "@components/BuilderComponents/Image/ImageComponent.vue";
import ButtonComponent from "@components/BuilderComponents/Button/ButtonComponent.vue";
import AccordionComponent from "@components/BuilderComponents/Accordion/AccordionComponent.vue";
import TestimonialComponent from "@components/BuilderComponents/Testimonial/TestimonialComponent.vue";

const props = defineProps({
  component: {type: Object, required: true},
  isEditing: {type: Boolean, default: false},
  depth: {type: Number, default: 0}, // Track nesting depth
});

const emit = defineEmits(["drag-start"]);

const store = usePageBuilderStore();

const componentMap = {
  table: TableComponent,
  card: CardComponent,
  grid: GridComponent,
  datatable: DataTableComponent,
  text: TextComponent,
  image: ImageComponent,
  button: ButtonComponent,
  accordion: AccordionComponent,
  testimonial: TestimonialComponent,
};

// Get the actual editing state from the component data
const isComponentEditing = computed(() => {
  return props.component.isEditing || false;
});

const isPreview = computed(() => store.isPreview);

// Prevent infinite nesting
const maxDepth = 5;
const canNest = computed(() => props.depth < maxDepth);

const selectComponent = (event) => {
  if (!isPreview.value) {
    event.stopPropagation();
    store.selectComponent(props.component.id);
  }
};

// Drag functionality for canvas components (depth 0)
const handleDragStart = (event) => {
  if (isPreview.value || props.depth > 0) {
    event.preventDefault();
    return;
  }

  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("component-id", props.component.id);

  setTimeout(() => {
    event.target.style.opacity = "0.5";
  }, 0);

  emit("drag-start", props.component.id);
};

const handleDragEnd = (event) => {
  event.target.style.opacity = "1";
};
</script>

<template>
  <div
    class="component-wrapper"
    :class="{
      selected: store.selectedComponent === props.component.id && !isPreview,
      'max-depth': !canNest,
      draggable: depth === 0 && !isPreview,
    }"
    :draggable="depth === 0 && !isPreview"
    @click="selectComponent"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <component
      :is="componentMap[component.type]"
      v-bind="component.props"
      :id="component.id"
      :is-editing="isComponentEditing"
      :depth="depth + 1"
      :can-nest="canNest"
      @update:props="store.updateComponentProps(component.id, $event)"
    />
  </div>
</template>

<style scoped>
.component-wrapper {
  transition: all 0.1s ease;
}

.component-wrapper.selected {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.component-wrapper.draggable {
  cursor: move;
}

.max-depth {
  opacity: 0.6;
  pointer-events: none;
}
</style>
