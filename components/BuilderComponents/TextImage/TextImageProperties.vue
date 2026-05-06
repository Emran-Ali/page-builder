<script setup>
import { ref, watch, computed } from 'vue'
import { usePageBuilderStore } from '~/stores/pageBuilder'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const store = usePageBuilderStore()

// Local reactive data
const localProps = ref({})

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === 'textimage') {
      localProps.value = { ...newComponent.props }
    }
  },
  { immediate: true, deep: true }
)

// Button management
const addButton = () => {
  if (!localProps.value.buttons) {
    localProps.value.buttons = []
  }
  localProps.value.buttons.push({
    label: 'New Button',
    link: '',
    severity: 'primary',
    variant: 'filled',
    target: '_self',
  })
  updateProps()
}

const removeButton = (index) => {
  localProps.value.buttons.splice(index, 1)
  updateProps()
}

const updateButton = (index, field, value) => {
  if (localProps.value.buttons[index]) {
    localProps.value.buttons[index][field] = value
    updateProps()
  }
}

const severityOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
]

const variantOptions = [
  { label: 'Filled', value: 'filled' },
  { label: 'Outlined', value: 'outlined' },
  { label: 'Text', value: 'text' },
]

const headingOptions = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
]

const textAlignOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]

// Update props function
const updateProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, localProps.value)
  }
}

// Watchers for immediate updates
const updateProp = (key, value) => {
  localProps.value[key] = value
  updateProps()
}

// Media type management
const activeMediaTab = computed(() => localProps.value.mediaType || 'image')

const updateMediaType = (type) => {
  localProps.value.mediaType = type
  updateProps()
}
</script>

<template>
  <div class="max-h-[80vh] overflow-y-auto space-y-4">
    <h3 class="text-lg font-semibold mb-4">Content Settings</h3>

    <div class="space-y-6">
      <!-- Title Content -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-2">Heading Level</label>
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
            <label class="block text-sm font-medium mb-2">Title Text</label>
            <InputText
              :model-value="localProps.title"
              placeholder="Enter title"
              class="w-full"
              size="small"
              @update:model-value="updateProp('title', $event)"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-2">Text Align</label>
              <Dropdown
                :model-value="localProps.titleAlign || 'left'"
                :options="textAlignOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                size="small"
                @update:model-value="updateProp('titleAlign', $event)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2"
                >Bottom Gap (px)</label
              >
              <InputText
                :model-value="localProps.titleMarginBottom || '16px'"
                placeholder="16px"
                class="w-full"
                size="small"
                @update:model-value="updateProp('titleMarginBottom', $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Paragraph Content -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-2">Paragraph Text</label>
            <Textarea
              :model-value="localProps.paragraph"
              placeholder="Enter paragraph text"
              rows="4"
              class="w-full"
              size="small"
              @update:model-value="updateProp('paragraph', $event)"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium mb-2">Text Align</label>
              <Dropdown
                :model-value="localProps.paragraphAlign || 'left'"
                :options="textAlignOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                size="small"
                @update:model-value="updateProp('paragraphAlign', $event)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2"
                >Font Size (px)</label
              >
              <InputText
                :model-value="localProps.paragraphFontSize || '14px'"
                placeholder="14px"
                class="w-full"
                size="small"
                @update:model-value="updateProp('paragraphFontSize', $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Media Content (Image/Video) -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <label class="block text-sm font-medium mb-3">Media</label>

        <!-- Tab Navigation -->
        <div class="flex gap-2 mb-4 border-b border-gray-200">
          <button
            type="button"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors',
              activeMediaTab === 'image'
                ? 'text-black border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-600',
            ]"
            @click="updateMediaType('image')"
          >
            Image
          </button>
          <button
            type="button"
            :class="[
              'px-4 py-2 text-sm font-medium transition-colors',
              activeMediaTab === 'video'
                ? 'text-black border-b-2 border-gray-600'
                : 'text-gray-600 hover:text-gray-600',
            ]"
            @click="updateMediaType('video')"
          >
            Video
          </button>
        </div>

        <!-- Image Tab Content -->
        <div v-if="activeMediaTab === 'image'" class="space-y-3">
          <SharedFileUpload
            :model-value="localProps.imageSrc"
            image-version="optimized"
            @update:model-value="updateProp('imageSrc', $event)"
          />
          <!-- <div>
            <label class="block text-sm font-medium mb-2">Image URL</label>
            <InputText
              :model-value="localProps.imageSrc || ''"
              placeholder="Enter image URL"
              class="w-full"
              size="small"
              @update:model-value="updateProp('imageSrc', $event)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Alt Text</label>
            <InputText
              :model-value="localProps.imageAlt || ''"
              placeholder="Enter alt text"
              class="w-full"
              size="small"
              @update:model-value="updateProp('imageAlt', $event)"
            />
          </div> -->
        </div>

        <!-- Video Tab Content -->
        <div v-if="activeMediaTab === 'video'" class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-2"
              >YouTube Video URL</label
            >
            <InputText
              :model-value="localProps.videoSrc || ''"
              placeholder="https://www.youtube.com/watch?v=..."
              class="w-full"
              size="small"
              @update:model-value="updateProp('videoSrc', $event)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Alt Text</label>
            <InputText
              :model-value="localProps.videoAlt || ''"
              placeholder="Enter alt text"
              class="w-full"
              size="small"
              @update:model-value="updateProp('videoAlt', $event)"
            />
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
            :options="textAlignOptions"
            option-label="label"
            option-value="value"
            class="w-full"
            size="small"
            @update:model-value="updateProp('buttonAlignment', $event)"
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
