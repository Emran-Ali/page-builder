<script setup>
import {computed} from "vue";
import {usePageBuilderStore} from "@stores/pageBuilder";
import TableProperties from "../BuilderComponents/Table/TableProperties.vue";
import DataTableProperties from "../BuilderComponents/DataTable/DataTableProperties.vue";
import CardProperties from "../BuilderComponents/Card/CardProperties.vue";
import GridProperties from "../BuilderComponents/Grid/GridProperties.vue";
import TextProperties from "../BuilderComponents/Text/TextProperties.vue";
import ImageProperties from "../BuilderComponents/Image/ImageProperties.vue";
import ButtonProperties from "../BuilderComponents/Button/ButtonProperties.vue";
import AccordionProperties from "../BuilderComponents/Accordion/AccordionProperties.vue";
import TextImageProperties from "../BuilderComponents/TextImage/TextImageProperties.vue";
import TestimonialProperties from "../BuilderComponents/Testimonial/TestimonialProperties.vue";
import GridBlockProperties from "../BuilderComponents/GridBlock/GridBlockProperties.vue";
import CTAProperties from "../BuilderComponents/CTA/CTAProperties.vue";
import ListItemProperties from "../BuilderComponents/ListItem/ListItemProperties.vue";
import MapBlockProperties from "../BuilderComponents/MapBlock/MapBlockProperties.vue";
import TeacherListProperties from "../BuilderComponents/TeacherList/TeacherListProperties.vue";
import OfflineTeacherListProperties from "../BuilderComponents/OfflineTeacherList/OfflineTeacherListProperties.vue";
import SearchOfflineTeacherProperties from "../BuilderComponents/SearchOfflineTeacher/SearchOfflineTeacherProperties.vue";
import TeacherFinderBlockProperties from "../BuilderComponents/TeacherFinderBlock/TeacherFinderBlockProperties.vue";
import RTEProperties from "../BuilderComponents/RTF/RTEProperties.vue";
import ComponentActions from "./ComponentActions.vue";

const store = usePageBuilderStore();

const selectedComponent = computed(() => store.getSelectedComponent);

// Component registry for dynamic loading
const componentPropertyMap = {
  table: TableProperties,
  datatable: DataTableProperties,
  card: CardProperties,
  grid: GridProperties,
  text: TextProperties,
  image: ImageProperties,
  button: ButtonProperties,
  accordion: AccordionProperties,
  textimage: TextImageProperties,
  testimonial: TestimonialProperties,
  gridblock: GridBlockProperties,
  cta: CTAProperties,
  listitem: ListItemProperties,
  mapblock: MapBlockProperties,
  teacherlist: TeacherListProperties,
  offlineteacherlist: OfflineTeacherListProperties,
  searchofflineteacher: SearchOfflineTeacherProperties,
  teacherfinderblock: TeacherFinderBlockProperties,
  rte: RTEProperties,
};

// Get the appropriate property component for the selected component type
const getPropertyComponent = (componentType) => {
  return componentPropertyMap[componentType] || null;
};
</script>

<template>
  <div class="w-1/5 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Properties</h2>
      <p class="text-sm text-gray-600">
        {{
          selectedComponent
            ? `Edit ${selectedComponent.type}`
            : "Select a component"
        }}
      </p>
    </div>

    <!-- Properties Form -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="!selectedComponent" class="text-center py-8">
        <div class="flex justify-center mb-4">
          <BaseLucide name="Settings" :size="32" class="text-gray-400" />
        </div>
        <p class="text-gray-500 text-sm">
          Select a component to edit its properties
        </p>
      </div>

      <div v-else class="space-y-6">
        <!-- Component Info -->
        <!-- <div class="bg-white p-4 rounded-lg border border-gray-200">
          <h3 class="font-medium text-gray-900 mb-2">Component Info</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <div>
              Type:
              <span class="font-medium">{{ selectedComponent.type }}</span>
            </div>
            <div>
              ID:
              <span class="font-mono text-xs">{{ selectedComponent.id }}</span>
            </div>
          </div>
        </div> -->

        <!-- Dynamic Component Properties -->
        <component
          :is="getPropertyComponent(selectedComponent.type)"
          v-if="getPropertyComponent(selectedComponent.type)"
          :component="selectedComponent"
        />

        <!-- Fallback for unsupported component types -->
        <div v-else class="bg-white p-4 rounded-lg border border-gray-200">
          <h3 class="font-medium text-gray-900 mb-2">Properties</h3>
          <p class="text-sm text-gray-500">
            No properties panel available for
            {{ selectedComponent.type }} components.
          </p>
        </div>

        <!-- Common Actions -->
        <ComponentActions :component="selectedComponent" />
      </div>
    </div>
  </div>
</template>
