<script setup>
import {ref, watch} from "vue";
import {usePageBuilderStore} from "@stores/pageBuilder";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const store = usePageBuilderStore();

// Local reactive data
const localProps = ref({});

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === "gridblock") {
      localProps.value = {...newComponent.props};
    }
  },
  {immediate: true, deep: true},
);

// Update props function
const updateProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, localProps.value);
  }
};

// Update simple props
const updatePropsKey = (key, value) => {
  localProps.value[key] = value;
  updateProps();
};

// Grid item management
const addItem = () => {
  if (!localProps.value.items) {
    localProps.value.items = [];
  }

  // Get the next item number for placeholder text
  const itemNumber = localProps.value.items.length + 1;

  localProps.value.items.push({
    title: `Your Title Here ${itemNumber}`,
    paragraph:
      "This is your paragraph text. You can customize the content through the properties panel.",
    imageSrc: "https://placehold.co/600x400",
    imageAlt: `Grid item ${itemNumber}`,
    link: "#",
    linkText: "Read more",
    linkTarget: "_self",
  });
  updateProps();
};

const removeItem = (index) => {
  if (localProps.value.items && localProps.value.items[index]) {
    localProps.value.items.splice(index, 1);
    updateProps();
  }
};

const updateItem = (index, key, value) => {
  if (localProps.value.items && localProps.value.items[index]) {
    localProps.value.items[index][key] = value;
    updateProps();
  }
};

const headingOptions = [
  {label: "Heading 1", value: "h1"},
  {label: "Heading 2", value: "h2"},
  {label: "Heading 3", value: "h3"},
];

// Button management
const addButton = () => {
  if (!localProps.value.buttons) {
    localProps.value.buttons = [];
  }
  localProps.value.buttons.push({
    label: "New Button",
    link: "",
    severity: "primary",
    variant: "filled",
    target: "_self",
  });
  updateProps();
};

const removeButton = (index) => {
  if (localProps.value.buttons && localProps.value.buttons[index]) {
    localProps.value.buttons.splice(index, 1);
    updateProps();
  }
};

const updateButton = (index, field, value) => {
  if (localProps.value.buttons && localProps.value.buttons[index]) {
    localProps.value.buttons[index][field] = value;
    updateProps();
  }
};

const severityOptions = [
  {label: "Primary", value: "primary"},
  {label: "Secondary", value: "secondary"},
];

const variantOptions = [
  {label: "Filled", value: "filled"},
  {label: "Outlined", value: "outlined"},
  {label: "Text", value: "text"},
];

const alignmentOptions = [
  {label: "Left", value: "left"},
  {label: "Center", value: "center"},
  {label: "Right", value: "right"},
];
</script>

<template>
  <div class="max-h-[80vh] overflow-y-auto space-y-4">
    <h3 class="text-lg font-semibold mb-4">Content Settings</h3>

    <div class="space-y-6">
      <!-- Section Heading -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Heading Level</label>
            <Dropdown
              :model-value="localProps.sectionTitleTag || 'h2'"
              :options="headingOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              size="small"
              @update:model-value="updatePropsKey('sectionTitleTag', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Title</label>
            <InputText
              :model-value="localProps.sectionTitle"
              placeholder="Enter section title"
              class="w-full"
              size="small"
              @update:model-value="updatePropsKey('sectionTitle', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <Textarea
              :model-value="localProps.sectionDescription"
              placeholder="Enter section description"
              rows="3"
              class="w-full"
              size="small"
              @update:model-value="updatePropsKey('sectionDescription', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Grid Items -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-medium text-gray-900">Grid Items</h4>

          <Button variant="outlined" size="small" @click="addItem"
            ><BaseLucide name="Plus" :size="16"
          /></Button>
        </div>

        <div class="space-y-4">
          <!-- Individual Item Settings -->
          <div
            v-for="(item, index) in localProps.items"
            :key="index"
            class="border rounded-lg p-4 space-y-3"
          >
            <div class="flex justify-between items-center">
              <h5 class="font-medium text-sm">Item {{ index + 1 }}</h5>
              <Button
                severity="danger"
                size="small"
                text
                class="flex items-center gap-2"
                @click="removeItem(index)"
              >
                <BaseLucide name="Trash2" :size="16" />
              </Button>
            </div>

            <!-- Image -->
            <div>
              <label class="block text-sm font-medium mb-3">Upload Image</label>
              <SharedFileUpload
                :model-value="item.imageSrc"
                image-version="thumb"
                @update:model-value="updateItem(index, 'imageSrc', $event)"
              />
            </div>

            <!-- <div>
              <label class="block text-sm font-medium mb-1"
                >Image Alt Text</label
              >
              <InputText
                :model-value="item.imageAlt"
                placeholder="Enter alt text"
                class="w-full"
                size="small"
                @update:model-value="updateItem(index, 'imageAlt', $event)"
              />
            </div> -->

            <!-- Title -->
            <div>
              <label class="block text-sm font-medium mb-1">Title</label>
              <InputText
                :model-value="item.title"
                placeholder="Enter title"
                class="w-full"
                size="small"
                @update:model-value="updateItem(index, 'title', $event)"
              />
            </div>

            <!-- Paragraph -->
            <div>
              <label class="block text-sm font-medium mb-1">Paragraph</label>
              <Textarea
                :model-value="item.paragraph"
                placeholder="Enter paragraph text"
                rows="3"
                class="w-full"
                size="small"
                @update:model-value="updateItem(index, 'paragraph', $event)"
              />
            </div>

            <!-- Link -->
            <div>
              <label class="block text-sm font-medium mb-1">Link URL</label>
              <InputText
                :model-value="item.link"
                placeholder="https://example.com"
                class="w-full"
                size="small"
                @update:model-value="updateItem(index, 'link', $event)"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Link Text</label>
              <InputText
                :model-value="item.linkText"
                placeholder="Read more"
                class="w-full"
                size="small"
                @update:model-value="updateItem(index, 'linkText', $event)"
              />
            </div>
          </div>

          <div
            v-if="!localProps.items || localProps.items.length === 0"
            class="text-center text-gray-500 py-4"
          >
            No items configured. Click "Add Item" to create one.
          </div>
        </div>
      </div>

      <!-- Button Content -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-sm font-medium text-gray-900">Buttons</h4>
          <Button variant="outlined" size="small" @click="addButton"
            ><BaseLucide name="Plus" :size="16"
          /></Button>
        </div>

        <!-- Button Alignment -->
        <div
          v-if="localProps.buttons && localProps.buttons.length > 0"
          class="mb-4"
        >
          <label class="block text-sm font-medium mb-1">Button Alignment</label>
          <Dropdown
            :model-value="localProps.buttonAlignment || 'left'"
            :options="alignmentOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            size="small"
            @update:model-value="updatePropsKey('buttonAlignment', $event)"
          />
        </div>

        <div class="space-y-4">
          <!-- Individual Button Settings -->
          <div
            v-for="(button, index) in localProps.buttons"
            :key="index"
            class="border rounded-lg p-3 space-y-3"
          >
            <div class="flex justify-between items-center">
              <h5 class="font-medium text-sm">Button {{ index + 1 }}</h5>
              <Button
                severity="danger"
                size="small"
                text
                @click="removeButton(index)"
              >
                <BaseLucide name="Trash2" :size="16" />
              </Button>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Label</label>
              <InputText
                :model-value="button.label"
                placeholder="Button text"
                class="w-full"
                size="small"
                @update:model-value="updateButton(index, 'label', $event)"
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Link URL</label>
              <InputText
                :model-value="button.link"
                placeholder="https://example.com"
                class="w-full"
                size="small"
                @update:model-value="updateButton(index, 'link', $event)"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-1">Severity</label>
                <Dropdown
                  :model-value="button.severity"
                  :options="severityOptions"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                  size="small"
                  @update:model-value="updateButton(index, 'severity', $event)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Variant</label>
                <Dropdown
                  :model-value="button.variant"
                  :options="variantOptions"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                  size="small"
                  @update:model-value="updateButton(index, 'variant', $event)"
                />
              </div>
            </div>
          </div>

          <div
            v-if="!localProps.buttons || localProps.buttons.length === 0"
            class="text-center text-gray-500 py-4"
          >
            No buttons configured. Click "Add Button" to create one.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- No custom styles needed - using inline Tailwind classes -->
