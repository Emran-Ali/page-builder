<script setup>
import {ref, watch, computed} from "vue";
import {usePageBuilderStore} from "@stores/pageBuilder";
import Slider from "primevue/slider";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const store = usePageBuilderStore();
const textProps = ref({});

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === "text") {
      textProps.value = {...newComponent.props};
    }
  },
  {immediate: true, deep: true},
);

// Update function with real-time updates
const updateTextProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, textProps.value);
  }
};

// Set text alignment function
const setTextAlign = (alignment) => {
  textProps.value.textAlign = alignment;
  updateTextProps();
};

// Font weight options
const fontWeightOptions = [
  {label: "Light", value: "300"},
  {label: "Normal", value: "normal"},
  {label: "Medium", value: "500"},
  {label: "Semi Bold", value: "600"},
  {label: "Bold", value: "bold"},
  {label: "Extra Bold", value: "800"},
  {label: "XX-Bold", value: "900"},
];

// Element type options
const elementTypeOptions = [
  {label: "🏷️ H1", value: "h1"},
  {label: "🏷️ H2", value: "h2"},
  {label: "🏷️ H3", value: "h3"},
  {label: "🏷️ H4", value: "h4"},
  {label: "🏷️ H5", value: "h5"},
  {label: "🏷️ H6", value: "h6"},
  {label: "📝 Paragraph", value: "p"},
  {label: "📄 Span", value: "span"},
];

// Computed values for sliders - simplified approach
const fontSizeValue = computed({
  get: () => parseInt(textProps.value.fontSize?.replace("px", "") || "16"),
  set: (value) => {
    textProps.value.fontSize = `${value}px`;
    updateTextProps();
  },
});

const lineHeightValue = computed({
  get: () => parseFloat(textProps.value.lineHeight || "1.5"),
  set: (value) => {
    textProps.value.lineHeight = value.toString();
    updateTextProps();
  },
});

const letterSpacingValue = computed({
  get: () => parseInt(textProps.value.letterSpacing?.replace("px", "") || "0"),
  set: (value) => {
    textProps.value.letterSpacing = `${value}px`;
    updateTextProps();
  },
});

const paddingHorizontalValue = computed({
  get: () =>
    parseInt(textProps.value.paddingHorizontal?.replace("px", "") || "0"),
  set: (value) => {
    textProps.value.paddingHorizontal = `${value}px`;
    updateTextProps();
  },
});

const paddingVerticalValue = computed({
  get: () =>
    parseInt(textProps.value.paddingVertical?.replace("px", "") || "0"),
  set: (value) => {
    textProps.value.paddingVertical = `${value}px`;
    updateTextProps();
  },
});

const marginHorizontalValue = computed({
  get: () =>
    parseInt(textProps.value.marginHorizontal?.replace("px", "") || "0"),
  set: (value) => {
    textProps.value.marginHorizontal = `${value}px`;
    updateTextProps();
  },
});

const marginVerticalValue = computed({
  get: () => parseInt(textProps.value.marginVertical?.replace("px", "") || "0"),
  set: (value) => {
    textProps.value.marginVertical = `${value}px`;
    updateTextProps();
  },
});

// Get default heading styles
const getHeadingDefaults = (elementType) => {
  switch (elementType) {
    case "h1":
      return {fontSize: "32px", fontWeight: "bold"}; // 2rem = 32px
    case "h2":
      return {fontSize: "24px", fontWeight: "bold"}; // 1.5rem = 24px
    case "h3":
      return {fontSize: "20px", fontWeight: "bold"}; // 1.25rem = 20px
    case "h4":
      return {fontSize: "18px", fontWeight: "bold"}; // 1.125rem = 18px
    case "h5":
      return {fontSize: "16px", fontWeight: "bold"}; // 1rem = 16px
    case "h6":
      return {fontSize: "14px", fontWeight: "bold"}; // 0.875rem = 14px
    default:
      return {fontSize: "16px", fontWeight: "normal"};
  }
};

// Check if current element is using heading defaults
const isUsingHeadingDefaults = () => {
  if (
    !["h1", "h2", "h3", "h4", "h5", "h6"].includes(textProps.value.elementType)
  ) {
    return false;
  }
  const defaults = getHeadingDefaults(textProps.value.elementType);
  return (
    textProps.value.fontSize === defaults.fontSize &&
    textProps.value.fontWeight === defaults.fontWeight
  );
};

// Handle element type changes with automatic defaults
const changeElementType = (elementType) => {
  textProps.value.elementType = elementType;

  // Always apply defaults when changing to headings
  const isHeading = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(elementType);
  if (isHeading) {
    const defaults = getHeadingDefaults(elementType);
    textProps.value.fontSize = defaults.fontSize;
    textProps.value.fontWeight = defaults.fontWeight;
  } else {
    // Reset to normal for non-headings
    textProps.value.fontSize = "16px";
    textProps.value.fontWeight = "normal";
  }

  updateTextProps();
};
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-6">
    <h3 class="font-medium text-gray-900 mb-4">Text Settings</h3>

    <!-- Content Section -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Content</label
        >
        <div class="space-y-2">
          <Textarea
            v-model="textProps.content"
            class="w-full rounded-[5px]"
            size="small"
            placeholder="Enter text content..."
            @update:model-value="updateTextProps"
            rows="4"
          />
        </div>
      </div>

      <!-- Element Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Element Type</label
        >
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="option in elementTypeOptions"
            :key="option.value"
            @click="changeElementType(option.value)"
            :class="[
              'p-2 border rounded cursor-pointer transition-colors text-center text-sm',
              textProps.elementType === option.value
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-surface-border hover:border-primary-300',
            ]"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Typography Section -->
    <div class="border-t pt-4">
      <h4 class="font-medium text-gray-900 mb-3">Typography</h4>

      <!-- Font Size -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-surface-secondary-color">
            Font Size: {{ fontSizeValue }}px
          </label>
          <span
            v-if="isUsingHeadingDefaults()"
            class="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded"
          >
            Using {{ textProps.elementType.toUpperCase() }} default
          </span>
        </div>
        <Slider v-model="fontSizeValue" :min="8" :max="72" class="w-full" />
      </div>

      <!-- Font Weight -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <label class="text-sm font-medium text-surface-secondary-color"
            >Font Weight</label
          >
          <span
            v-if="isUsingHeadingDefaults()"
            class="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded"
          >
            Using {{ textProps.elementType.toUpperCase() }} default
          </span>
        </div>
        <Select
          v-model="textProps.fontWeight"
          @change="updateTextProps"
          class="w-full rounded-[5px]"
          size="small"
          :options="fontWeightOptions"
          option-label="label"
          option-value="value"
        />
      </div>

      <!-- Text Style -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Text Style</label
        >
        <div class="flex gap-2">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="textProps.isItalic"
              type="checkbox"
              class="rounded border-gray-300 accent-primary-500 focus:ring-primary-500"
              @change="updateTextProps"
            />
            <span class="ml-2 text-sm text-gray-700 italic">I Italic</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="textProps.isUnderline"
              type="checkbox"
              class="rounded border-gray-300 accent-primary-500 focus:ring-primary-500"
              @change="updateTextProps"
            />
            <span class="ml-2 text-sm text-gray-700 underline"
              >U Underline</span
            >
          </label>
        </div>
      </div>

      <!-- Text Alignment -->
      <div class="mb-4 text-sm">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Text Alignment</label
        >
        <div class="grid grid-cols-2 gap-2">
          <div
            @click="setTextAlign('left')"
            :class="[
              'p-2 border rounded cursor-pointer transition-colors text-center',
              textProps.textAlign === 'left'
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-surface-border hover:border-primary-300',
            ]"
          >
            Left
          </div>
          <div
            @click="setTextAlign('center')"
            :class="[
              'p-2 border rounded cursor-pointer transition-colors text-center',
              textProps.textAlign === 'center'
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-surface-border hover:border-primary-300',
            ]"
          >
            Center
          </div>
          <div
            @click="setTextAlign('right')"
            :class="[
              'p-2 border rounded cursor-pointer transition-colors text-center',
              textProps.textAlign === 'right'
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-surface-border hover:border-primary-300',
            ]"
          >
            Right
          </div>
          <div
            @click="setTextAlign('justify')"
            :class="[
              'p-2 border rounded cursor-pointer transition-colors text-center',
              textProps.textAlign === 'justify'
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-surface-border hover:border-primary-300',
            ]"
          >
            Justify
          </div>
        </div>
      </div>

      <!-- Line Height -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-4">
          📐 Line Height: {{ lineHeightValue }}
        </label>
        <Slider
          v-model="lineHeightValue"
          :min="0.8"
          :max="3"
          :step="0.1"
          class="w-full"
        />
      </div>

      <!-- Letter Spacing -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-4">
          Letter Spacing: {{ letterSpacingValue }}px
        </label>
        <Slider
          v-model="letterSpacingValue"
          :min="-5"
          :max="10"
          class="w-full"
        />
      </div>
    </div>

    <!-- Colors Section -->
    <div class="border-t pt-4">
      <h4 class="font-medium text-gray-900 mb-3">Colors</h4>

      <!-- Text Color -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Text Color</label
        >
        <div class="flex gap-2 items-center">
          <input
            v-model="textProps.textColor"
            type="color"
            class="w-12 h-8 border border-gray-300 rounded-[5px] cursor-pointer"
            @input="updateTextProps"
          />
          <InputText
            v-model="textProps.textColor"
            type="text"
            class="flex-1 px-3 border border-gray-300 rounded-[5px] focus:ring-primary-500 focus:border-primary-500"
            size="small"
            @input="updateTextProps"
          />
        </div>
      </div>

      <!-- Background Color -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Background Color</label
        >
        <div class="flex gap-2 items-center">
          <input
            v-model="textProps.backgroundColor"
            type="color"
            class="w-12 h-8 border border-gray-300 rounded-[5px] cursor-pointer"
            @input="updateTextProps"
          />
          <InputText
            v-model="textProps.backgroundColor"
            type="text"
            class="flex-1 px-3 border border-gray-300 rounded-[5px] focus:ring-primary-500 focus:border-primary-500"
            size="small"
            placeholder="transparent"
            @input="updateTextProps"
          />
        </div>
      </div>
    </div>

    <!-- Spacing Section -->
    <div class="border-t pt-4">
      <h4 class="font-medium text-gray-900 mb-3">Spacing</h4>

      <!-- Padding -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3"
          >Padding</label
        >

        <div class="space-y-4">
          <div>
            <label class="block text-xs text-gray-600 mb-4">
              Horizontal: {{ paddingHorizontalValue }}px
            </label>
            <Slider
              v-model="paddingHorizontalValue"
              :min="0"
              :max="100"
              class="w-full blue-slider"
            />
          </div>

          <div>
            <label class="block text-xs text-gray-600 mb-4">
              Vertical: {{ paddingVerticalValue }}px
            </label>
            <Slider
              v-model="paddingVerticalValue"
              :min="0"
              :max="100"
              class="w-full blue-slider"
            />
          </div>
        </div>
      </div>

      <!-- Margin -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-3"
          >Margin</label
        >

        <div class="space-y-3">
          <div>
            <label class="block text-xs text-gray-600 mb-4">
              Horizontal: {{ marginHorizontalValue }}px
            </label>
            <Slider
              v-model="marginHorizontalValue"
              :min="0"
              :max="100"
              class="w-full blue-slider"
            />
          </div>

          <div>
            <label class="block text-xs text-gray-600 mb-4">
              Vertical: {{ marginVerticalValue }}px
            </label>
            <Slider
              v-model="marginVerticalValue"
              :min="0"
              :max="100"
              class="w-full blue-slider"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
