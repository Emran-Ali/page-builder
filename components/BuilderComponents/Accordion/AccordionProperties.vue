<script setup>
import {ref, watch} from "vue";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import {usePageBuilderStore} from "@stores/pageBuilder";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const store = usePageBuilderStore();
const accordionProps = ref({});

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === "accordion") {
      accordionProps.value = {...newComponent.props};
    }
  },
  {immediate: true, deep: true},
);

// Update function with real-time updates
const updateAccordionProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, accordionProps.value);
  }
};

const addPanel = () => {
  if (!accordionProps.value.panels) {
    accordionProps.value.panels = [];
  }
  accordionProps.value.panels.push({
    header: `Accordion Header ${accordionProps.value.panels.length + 1}`,
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  });
  updateAccordionProps();
};

const removePanel = (index) => {
  if (accordionProps.value.panels && accordionProps.value.panels.length > 1) {
    accordionProps.value.panels.splice(index, 1);
    updateAccordionProps();
  }
};

const updatePanel = (index, field, value) => {
  if (accordionProps.value.panels && accordionProps.value.panels[index]) {
    accordionProps.value.panels[index][field] = value;
    updateAccordionProps();
  }
};

const updateProp = (key, value) => {
  accordionProps.value[key] = value;
  updateAccordionProps();
};

const headingOptions = [
  {label: "Heading 1", value: "h1"},
  {label: "Heading 2", value: "h2"},
  {label: "Heading 3", value: "h3"},
];
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-6">
    <h3 class="font-medium text-gray-900 mb-4">Accordion Settings</h3>

    <!-- Section Heading -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Heading Level
        </label>
        <Dropdown
          :model-value="accordionProps.sectionTitleTag || 'h2'"
          :options="headingOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          size="small"
          @update:model-value="updateProp('sectionTitleTag', $event)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Title</label
        >
        <InputText
          v-model="accordionProps.sectionTitle"
          type="text"
          placeholder="Enter title"
          class="w-full rounded-[5px]"
          size="small"
          @input="updateProp('sectionTitle', $event.target.value)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <Textarea
          v-model="accordionProps.sectionDescription"
          rows="3"
          class="w-full rounded-[5px]"
          size="small"
          placeholder="Enter description"
          @input="updateProp('sectionDescription', $event.target.value)"
        />
      </div>
    </div>

    <!-- Panels Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-800">Panels</h4>

        <Button variant="outlined" size="small" @click="addPanel"
          ><BaseLucide name="Plus" :size="16"
        /></Button>
      </div>

      <div
        v-if="accordionProps.panels && accordionProps.panels.length > 0"
        class="space-y-4"
      >
        <div
          v-for="(panel, index) in accordionProps.panels"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <div class="flex items-center justify-between">
            <h5 class="font-medium text-gray-700">Panel {{ index + 1 }}</h5>
            <Button
              v-if="accordionProps.panels.length > 1"
              severity="danger"
              text
              size="small"
              class="flex items-center gap-1"
              @click="removePanel(index)"
            >
              <BaseLucide name="Trash2" :size="16" />
            </Button>
          </div>

          <!-- Panel Header -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Header
            </label>
            <InputText
              type="text"
              class="w-full rounded-[5px]"
              size="small"
              placeholder="Panel header"
              :value="panel.header"
              @input="updatePanel(index, 'header', $event.target.value)"
            />
          </div>

          <!-- Panel Content -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <Textarea
              rows="4"
              class="w-full rounded-[5px]"
              size="small"
              placeholder="Panel content"
              :value="panel.content"
              @input="updatePanel(index, 'content', $event.target.value)"
            />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-4 text-gray-500">
        No panels added yet. Click "Add Panel" to get started.
      </div>
    </div>
  </div>
</template>
