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
const listItemProps = ref({});

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === "listitem") {
      listItemProps.value = {...newComponent.props};
    }
  },
  {immediate: true, deep: true},
);

// Update function with real-time updates
const updateListItemProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, listItemProps.value);
  }
};

const updateProp = (key, value) => {
  listItemProps.value[key] = value;
  updateListItemProps();
};

const addItem = () => {
  if (!listItemProps.value.items) {
    listItemProps.value.items = [];
  }

  // Get the next item number for placeholder text
  const itemNumber = listItemProps.value.items.length + 1;

  listItemProps.value.items.push(`List item ${itemNumber}`);
  updateListItemProps();
};

const removeItem = (index) => {
  if (listItemProps.value.items && listItemProps.value.items[index]) {
    listItemProps.value.items.splice(index, 1);
    updateListItemProps();
  }
};

const updateItem = (index, value) => {
  if (listItemProps.value.items && listItemProps.value.items[index]) {
    listItemProps.value.items[index] = value;
    updateListItemProps();
  }
};

const headingOptions = [
  {label: "Heading 1", value: "h1"},
  {label: "Heading 2", value: "h2"},
  {label: "Heading 3", value: "h3"},
];

const listStyleOptions = [
  {label: "Circle (Filled)", value: "disc"},
  {label: "Circle (Outline)", value: "circle"},
  {label: "Square", value: "square"},
  {label: "Numeric", value: "decimal"},
];
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-6">
    <h3 class="font-medium text-gray-900 mb-4">List Item Settings</h3>

    <!-- Heading Section -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Heading Level
        </label>
        <Dropdown
          :model-value="listItemProps.titleTag || 'h2'"
          :options="headingOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          size="small"
          @update:model-value="updateProp('titleTag', $event)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Title</label
        >
        <InputText
          v-model="listItemProps.title"
          type="text"
          placeholder="Enter title"
          class="w-full rounded-[5px]"
          size="small"
          @input="updateProp('title', $event.target.value)"
        />
      </div>
    </div>

    <!-- Paragraph Section -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Paragraph
        </label>
        <Textarea
          v-model="listItemProps.paragraph"
          rows="3"
          class="w-full rounded-[5px]"
          size="small"
          placeholder="Enter paragraph (press Enter for new line)"
          @input="updateProp('paragraph', $event.target.value)"
        />
      </div>
    </div>

    <!-- List Style Section -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          List Style
        </label>
        <Dropdown
          :model-value="listItemProps.listStyle || 'disc'"
          :options="listStyleOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          size="small"
          @update:model-value="updateProp('listStyle', $event)"
        />
      </div>
    </div>

    <!-- List Items Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-800">List Items</h4>

        <Button variant="outlined" size="small" @click="addItem">
          <BaseLucide name="Plus" :size="16" />
        </Button>
      </div>

      <div
        v-if="listItemProps.items && listItemProps.items.length > 0"
        class="space-y-4"
      >
        <div
          v-for="(item, index) in listItemProps.items"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <div class="flex items-center justify-between">
            <h5 class="font-medium text-gray-700">Item {{ index + 1 }}</h5>
            <Button
              severity="danger"
              text
              size="small"
              class="flex items-center gap-1"
              @click="removeItem(index)"
            >
              <BaseLucide name="Trash2" :size="16" />
            </Button>
          </div>

          <!-- List Item Content -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <InputText
              type="text"
              class="w-full rounded-[5px]"
              size="small"
              placeholder="Enter list item"
              :value="item"
              @input="updateItem(index, $event.target.value)"
            />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-4 text-gray-500">
        No list items added yet. Click "Add Item" to get started.
      </div>
    </div>
  </div>
</template>
