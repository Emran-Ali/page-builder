<script setup>
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import {ref, watch} from "vue";
import {usePageBuilderStore} from "~/stores/pageBuilder";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const store = usePageBuilderStore();
const localProps = ref({});

watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === "mapblock") {
      localProps.value = {...newComponent.props};
    }
  },
  {immediate: true, deep: true},
);

const updateProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, localProps.value);
  }
};

const updateProp = (key, value) => {
  localProps.value[key] = value;
  updateProps();
};

const normalizeMapInput = (raw) => {
  if (!raw) return "";
  const iframeMatch = raw.match(/<iframe[^>]*src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1].trim();
  }
  return raw.trim();
};

const addButton = () => {
  if (!localProps.value.buttons) {
    localProps.value.buttons = [];
  }
  localProps.value.buttons.push({
    label: "New Button",
    link: "#",
    severity: "primary",
    variant: "filled",
  });
  updateProps();
};

const removeButton = (index) => {
  if (localProps.value.buttons && localProps.value.buttons[index]) {
    localProps.value.buttons.splice(index, 1);
    updateProps();
  }
};

const updateButton = (index, key, value) => {
  if (localProps.value.buttons && localProps.value.buttons[index]) {
    localProps.value.buttons[index][key] = value;
    updateProps();
  }
};

const headingOptions = [
  {label: "Heading 1", value: "h1"},
  {label: "Heading 2", value: "h2"},
  {label: "Heading 3", value: "h3"},
];

const severityOptions = [
  {label: "Primary", value: "primary"},
  {label: "Secondary", value: "secondary"},
  // { label: 'Success', value: 'success' },
  // { label: 'Info', value: 'info' },
  // { label: 'Warning', value: 'warning' },
  // { label: 'Help', value: 'help' },
  // { label: 'Danger', value: 'danger' },
];

const variantOptions = [
  {label: "Filled", value: "filled"},
  {label: "Outlined", value: "outlined"},
  {label: "Text", value: "text"},
];
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-6">
    <h3 class="font-medium text-gray-900 mb-4">Map Block Settings</h3>

    <!-- Heading -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Heading Level
        </label>
        <Dropdown
          :model-value="localProps.titleTag || 'h2'"
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
          v-model="localProps.title"
          type="text"
          placeholder="Enter title"
          class="w-full rounded-[5px]"
          size="small"
          @input="updateProp('title', $event.target.value)"
        />
      </div>
    </div>

    <!-- Paragraph -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Paragraph
        </label>
        <Textarea
          v-model="localProps.paragraph"
          rows="3"
          class="w-full rounded-[5px]"
          size="small"
          placeholder="Enter paragraph (press Enter for new line)"
          @input="updateProp('paragraph', $event.target.value)"
        />
      </div>
    </div>

    <!-- Map -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Map Embed URL or iframe
        </label>
        <InputText
          v-model="localProps.mapSrc"
          type="text"
          placeholder="Paste embed URL or iframe"
          class="w-full rounded-[5px]"
          size="small"
          @input="updateProp('mapSrc', normalizeMapInput($event.target.value))"
        />
      </div>
    </div>

    <!-- Buttons -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-800">Buttons</h4>
        <Button variant="outlined" size="small" @click="addButton">
          <BaseLucide name="Plus" :size="16" />
        </Button>
      </div>

      <div
        v-if="localProps.buttons && localProps.buttons.length > 0"
        class="space-y-4"
      >
        <div
          v-for="(button, index) in localProps.buttons"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <div class="flex items-center justify-between">
            <h5 class="font-medium text-gray-700">Button {{ index + 1 }}</h5>
            <Button
              severity="danger"
              text
              size="small"
              class="flex items-center gap-1"
              @click="removeButton(index)"
            >
              <BaseLucide name="Trash2" :size="16" />
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Label
              </label>
              <InputText
                type="text"
                class="w-full rounded-[5px]"
                size="small"
                placeholder="Button label"
                :value="button.label"
                @input="updateButton(index, 'label', $event.target.value)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <InputText
                type="text"
                class="w-full rounded-[5px]"
                size="small"
                placeholder="https://example.com"
                :value="button.link"
                @input="updateButton(index, 'link', $event.target.value)"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <Dropdown
                :model-value="button.severity || 'primary'"
                :options="severityOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                size="small"
                @update:model-value="updateButton(index, 'severity', $event)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Variant
              </label>
              <Dropdown
                :model-value="button.variant || 'filled'"
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
      </div>

      <div v-else class="text-center py-4 text-gray-500">
        No buttons configured. Click "Add" to create one.
      </div>
    </div>
  </div>
</template>
