<script setup>
import {ref, watch, computed} from "vue";
import {usePageBuilderStore} from "~/stores/pageBuilder";
import Slider from "primevue/slider";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const store = usePageBuilderStore();
const imageProps = ref({});

// Unit selection for dimensions
const widthUnit = ref("px");
const heightUnit = ref("px");

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === "image") {
      imageProps.value = {...newComponent.props};
      // Initialize units based on existing values
      if (imageProps.value.width) {
        widthUnit.value = imageProps.value.width.includes("%") ? "%" : "px";
      }
      if (imageProps.value.height) {
        heightUnit.value = imageProps.value.height.includes("%") ? "%" : "px";
      }
    }
  },
  {immediate: true, deep: true},
);

// Update function with real-time updates
const updateImageProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, imageProps.value);
  }
};

// Set caption style function
const setCaptionStyle = (style) => {
  imageProps.value.captionStyle = style;
  updateImageProps();
};

// Set caption text alignment function
const setCaptionTextAlign = (alignment) => {
  imageProps.value.captionTextAlign = alignment;
  updateImageProps();
};

// Set image alignment function
const setImageAlignment = (alignment) => {
  imageProps.value.alignment = alignment;
  updateImageProps();
};

// Alignment options
const alignmentOptions = [
  {label: "Left", value: "left"},
  {label: "Center", value: "center"},
  {label: "Right", value: "right"},
];

// Caption text alignment options
const captionTextAlignOptions = [
  {label: "Left", value: "left"},
  {label: "Center", value: "center"},
  {label: "Right", value: "right"},
];

// Computed values for sliders with unit support
const widthValue = computed({
  get: () => {
    const value = imageProps.value.width || "300px";
    return parseInt(value.replace(/[px%]/g, "") || 300);
  },
  set: (value) => {
    imageProps.value.width = `${value}${widthUnit.value}`;
    updateImageProps();
  },
});

const heightValue = computed({
  get: () => {
    const value = imageProps.value.height || "200px";
    return parseInt(value.replace(/[px%]/g, "") || 200);
  },
  set: (value) => {
    imageProps.value.height = `${value}${heightUnit.value}`;
    updateImageProps();
  },
});

// Unit change handlers
const changeWidthUnit = (unit) => {
  widthUnit.value = unit;
  const currentValue = widthValue.value;
  imageProps.value.width = `${currentValue}${unit}`;
  updateImageProps();
};

const changeHeightUnit = (unit) => {
  heightUnit.value = unit;
  const currentValue = heightValue.value;
  imageProps.value.height = `${currentValue}${unit}`;
  updateImageProps();
};

const opacityValue = computed({
  get: () => imageProps.value.opacity || 1,
  set: (value) => {
    imageProps.value.opacity = value;
    updateImageProps();
  },
});

const paddingHorizontalValue = computed({
  get: () =>
    parseInt(imageProps.value.paddingHorizontal?.replace("px", "") || "0"),
  set: (value) => {
    imageProps.value.paddingHorizontal = `${value}px`;
    updateImageProps();
  },
});

const paddingVerticalValue = computed({
  get: () =>
    parseInt(imageProps.value.paddingVertical?.replace("px", "") || "0"),
  set: (value) => {
    imageProps.value.paddingVertical = `${value}px`;
    updateImageProps();
  },
});

const marginHorizontalValue = computed({
  get: () =>
    parseInt(imageProps.value.marginHorizontal?.replace("px", "") || "0"),
  set: (value) => {
    imageProps.value.marginHorizontal = `${value}px`;
    updateImageProps();
  },
});

const marginVerticalValue = computed({
  get: () =>
    parseInt(imageProps.value.marginVertical?.replace("px", "") || "0"),
  set: (value) => {
    imageProps.value.marginVertical = `${value}px`;
    updateImageProps();
  },
});

const captionFontSizeValue = computed({
  get: () =>
    parseInt(imageProps.value.captionFontSize?.replace("px", "") || "14"),
  set: (value) => {
    imageProps.value.captionFontSize = `${value}px`;
    updateImageProps();
  },
});

const captionPaddingValue = computed({
  get: () =>
    parseInt(imageProps.value.captionPadding?.replace("px", "") || "16"),
  set: (value) => {
    imageProps.value.captionPadding = `${value}px`;
    updateImageProps();
  },
});

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Create a URL for the uploaded file
    const fileUrl = URL.createObjectURL(file);
    imageProps.value.src = fileUrl;
    updateImageProps();
  }
};

// Handle URL input
const handleUrlInput = () => {
  updateImageProps();
};
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-6">
    <h3 class="font-medium text-gray-900 mb-4">Image Settings</h3>

    <!-- Source Section -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image Source
        </label>
        <div class="space-y-3">
          <!-- URL Input -->
          <div>
            <label class="block text-xs text-gray-600 mb-2">Image URL</label>
            <InputText
              v-model="imageProps.src"
              type="url"
              class="w-full rounded-[5px]"
              size="small"
              placeholder="https://picsum.photos/300/200"
              @input="handleUrlInput"
            />
          </div>

          <!-- File Upload -->
          <!-- <div>
            <label class="block text-xs text-gray-600 mb-1">
              Or upload a file
            </label>
            <input
              type="file"
              accept="image/*"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              @change="handleFileUpload"
            />
          </div> -->
        </div>
      </div>

      <!-- Alt Text -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Alt Text
        </label>
        <InputText
          v-model="imageProps.alt"
          type="text"
          class="w-full rounded-[5px]"
          size="small"
          placeholder="Describe the image..."
          @input="updateImageProps"
        />
      </div>

      <!-- Preview Option -->
      <div>
        <label class="flex items-center cursor-pointer">
          <input
            v-model="imageProps.preview"
            type="checkbox"
            class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4 cursor-pointer"
            @change="updateImageProps"
          />
          <span class="ml-2 text-sm text-gray-700">
            Enable preview (click to zoom)
          </span>
        </label>
      </div>
    </div>

    <!-- Caption Section -->
    <div class="border-t pt-4">
      <h4 class="font-medium text-gray-900 mb-3">Caption</h4>

      <!-- Show Caption Toggle -->
      <div class="mb-4">
        <label class="flex items-center cursor-pointer">
          <input
            v-model="imageProps.showCaption"
            type="checkbox"
            class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4 cursor-pointer"
            @change="updateImageProps"
          />
          <span class="ml-2 text-sm text-gray-700">Show caption</span>
        </label>
      </div>

      <!-- Caption Controls (shown only when caption is enabled) -->
      <div v-if="imageProps.showCaption" class="space-y-4">
        <!-- Caption Text -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Caption Text
          </label>
          <Textarea
            v-model="imageProps.caption"
            rows="3"
            class="w-full rounded-[5px]"
            size="small"
            placeholder="Enter image caption..."
            @input="updateImageProps"
          />
        </div>

        <!-- Caption Font Size -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Font Size: {{ captionFontSizeValue }}px
          </label>
          <Slider
            v-model="captionFontSizeValue"
            :min="10"
            :max="24"
            class="w-full"
          />
        </div>

        <!-- Caption Style -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Font Style
          </label>
          <div class="grid grid-cols-2 gap-2">
            <div
              @click="setCaptionStyle('normal')"
              :class="[
                'p-2 border rounded cursor-pointer transition-colors text-center text-sm',
                imageProps.captionStyle === 'normal'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                  : 'border-gray-300 hover:border-gray-400',
              ]"
            >
              Normal
            </div>
            <div
              @click="setCaptionStyle('italic')"
              :class="[
                'p-2 border rounded cursor-pointer transition-colors text-center text-sm italic',
                imageProps.captionStyle === 'italic'
                  ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                  : 'border-gray-300 hover:border-gray-400',
              ]"
            >
              Italic
            </div>
          </div>
        </div>

        <!-- Caption Color -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Text Color
          </label>
          <div class="flex gap-2 items-center">
            <input
              v-model="imageProps.captionColor"
              type="color"
              class="w-12 h-8 border border-gray-300 rounded-[5px] cursor-pointer"
              @input="updateImageProps"
            />
            <InputText
              v-model="imageProps.captionColor"
              type="text"
              class="flex-1 px-3 border border-gray-300 rounded-[5px] focus:ring-primary-500 focus:border-primary-500"
              size="small"
              @input="updateImageProps"
            />
          </div>
        </div>

        <!-- Caption Overlay -->
        <div>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="imageProps.captionOverlay"
              type="checkbox"
              class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4 cursor-pointer"
              @change="updateImageProps"
            />
            <span class="ml-2 text-sm text-gray-700"
              >Show as overlay on image</span
            >
          </label>
        </div>

        <!-- Overlay Options (shown only when overlay is enabled) -->
        <div v-if="imageProps.captionOverlay" class="space-y-4">
          <!-- Caption Text Alignment -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Text Alignment
            </label>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="align in captionTextAlignOptions"
                :key="align.value"
                @click="setCaptionTextAlign(align.value)"
                :class="[
                  'p-2 border rounded cursor-pointer transition-colors text-center text-sm',
                  imageProps.captionTextAlign === align.value
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-gray-300 hover:border-gray-400',
                ]"
              >
                {{ align.label }}
              </div>
            </div>
          </div>

          <!-- Overlay Background Color -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Overlay Background
            </label>
            <div class="flex gap-2 items-center">
              <input
                v-model="imageProps.captionBackgroundColor"
                type="color"
                class="w-12 h-8 border border-gray-300 rounded-[5px] cursor-pointer"
                @input="updateImageProps"
              />
              <InputText
                v-model="imageProps.captionBackgroundColor"
                type="text"
                class="flex-1 px-3 border border-gray-300 rounded-[5px] focus:ring-primary-500 focus:border-primary-500"
                size="small"
                placeholder="rgba(0, 0, 0, 0.7)"
                @input="updateImageProps"
              />
            </div>
          </div>

          <!-- Overlay Padding -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Overlay Padding: {{ captionPaddingValue }}px
            </label>
            <Slider
              v-model="captionPaddingValue"
              :min="8"
              :max="32"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Dimensions Section -->
    <div class="border-t pt-4">
      <h4 class="font-medium text-gray-900 mb-3">Dimensions</h4>

      <!-- Width -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Width: {{ widthValue }}{{ widthUnit }}
        </label>
        <Slider
          v-model="widthValue"
          :min="widthUnit === 'px' ? 50 : 10"
          :max="widthUnit === 'px' ? 1000 : 100"
          class="w-full"
        />
        <div class="flex justify-end mt-2">
          <button
            @click="changeWidthUnit('px')"
            :class="[
              'px-3 py-1 border rounded-md text-sm',
              widthUnit === 'px'
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            px
          </button>
          <button
            @click="changeWidthUnit('%')"
            :class="[
              'px-3 py-1 border rounded-md text-sm ml-2',
              widthUnit === '%'
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            %
          </button>
        </div>
      </div>

      <!-- Height -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Height: {{ heightValue }}{{ heightUnit }}
        </label>
        <Slider
          v-model="heightValue"
          :min="heightUnit === 'px' ? 50 : 10"
          :max="heightUnit === 'px' ? 600 : 100"
          class="w-full"
        />
        <div class="flex justify-end mt-2">
          <button
            @click="changeHeightUnit('px')"
            :class="[
              'px-3 py-1 border rounded-md text-sm',
              heightUnit === 'px'
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            px
          </button>
          <button
            @click="changeHeightUnit('%')"
            :class="[
              'px-3 py-1 border rounded-md text-sm ml-2',
              heightUnit === '%'
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            %
          </button>
        </div>
      </div>
    </div>

    <!-- Styling Section -->
    <div class="border-t pt-4">
      <h4 class="font-medium text-gray-900 mb-3">Styling</h4>

      <!-- Opacity -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Opacity: {{ Math.round(opacityValue * 100) }}%
        </label>
        <Slider
          v-model="opacityValue"
          :min="0"
          :max="1"
          :step="0.1"
          class="w-full"
        />
      </div>
    </div>

    <!-- Layout Section -->
    <div class="border-t pt-4">
      <h4 class="font-medium text-gray-900 mb-3">Layout</h4>

      <!-- Alignment -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Alignment
        </label>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="align in alignmentOptions"
            :key="align.value"
            @click="setImageAlignment(align.value)"
            :class="[
              'p-2 border rounded cursor-pointer transition-colors text-center text-sm',
              imageProps.alignment === align.value
                ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            {{ align.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Spacing Section -->
    <div class="border-t pt-4">
      <h4 class="font-medium text-gray-900 mb-3">Spacing</h4>

      <!-- Padding -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Padding
        </label>
        <div class="space-y-4">
          <div>
            <label class="block text-xs text-gray-600 mb-2">
              Horizontal: {{ paddingHorizontalValue }}px
            </label>
            <Slider
              v-model="paddingHorizontalValue"
              :min="0"
              :max="100"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-2">
              Vertical: {{ paddingVerticalValue }}px
            </label>
            <Slider
              v-model="paddingVerticalValue"
              :min="0"
              :max="100"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Margin -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Margin
        </label>
        <div class="space-y-4">
          <div>
            <label class="block text-xs text-gray-600 mb-2">
              Horizontal: {{ marginHorizontalValue }}px
            </label>
            <Slider
              v-model="marginHorizontalValue"
              :min="0"
              :max="100"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-600 mb-2">
              Vertical: {{ marginVerticalValue }}px
            </label>
            <Slider
              v-model="marginVerticalValue"
              :min="0"
              :max="100"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
