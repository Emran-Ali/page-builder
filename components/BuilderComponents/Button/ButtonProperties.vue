<script setup>
import { usePageBuilderStore } from '~/stores/pageBuilder'
import Slider from 'primevue/slider'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const store = usePageBuilderStore()
const buttonProps = ref({})

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === 'button') {
      buttonProps.value = { ...newComponent.props }
    }
  },
  { immediate: true, deep: true }
)

// Update function with real-time updates
const updateButtonProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, buttonProps.value)
  }
}

// Set button variant function
const setButtonVariant = (variant) => {
  buttonProps.value.variant = variant
  updateButtonProps()
}

// Set button size function
const setButtonSize = (size) => {
  buttonProps.value.size = size
  updateButtonProps()
}

// Set button alignment function
const setButtonAlignment = (alignment) => {
  buttonProps.value.alignment = alignment
  updateButtonProps()
}

// Set button severity function
const setButtonSeverity = (severity) => {
  buttonProps.value.severity = severity
  updateButtonProps()
}

// Set button target function
const setButtonTarget = (target) => {
  buttonProps.value.target = target
  updateButtonProps()
}

// Options for dropdowns
const severityOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  { label: 'Success', value: 'success' },
  { label: 'Info', value: 'info' },
  { label: 'Warn', value: 'warn' },
  { label: 'Help', value: 'help' },
  { label: 'Danger', value: 'danger' },
  { label: 'Contrast', value: 'contrast' },
]

const variantOptions = [
  { label: 'Filled', value: 'filled' },
  { label: 'Outlined', value: 'outlined' },
  { label: 'Text', value: 'text' },
]

const sizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Normal', value: 'normal' },
  { label: 'Large', value: 'large' },
]

const targetOptions = [
  { label: 'Same Window', value: '_self' },
  { label: 'New Window', value: '_blank' },
]

const alignmentOptions = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]

// Computed values for sliders
const marginHorizontalValue = computed({
  get: () =>
    parseInt(buttonProps.value.marginHorizontal?.replace('px', '') || '0'),
  set: (value) => {
    buttonProps.value.marginHorizontal = `${value}px`
    updateButtonProps()
  },
})

const marginVerticalValue = computed({
  get: () =>
    parseInt(buttonProps.value.marginVertical?.replace('px', '') || '0'),
  set: (value) => {
    buttonProps.value.marginVertical = `${value}px`
    updateButtonProps()
  },
})

const paddingHorizontalValue = computed({
  get: () =>
    parseInt(buttonProps.value.paddingHorizontal?.replace('px', '') || '0'),
  set: (value) => {
    buttonProps.value.paddingHorizontal = `${value}px`
    updateButtonProps()
  },
})

const paddingVerticalValue = computed({
  get: () =>
    parseInt(buttonProps.value.paddingVertical?.replace('px', '') || '0'),
  set: (value) => {
    buttonProps.value.paddingVertical = `${value}px`
    updateButtonProps()
  },
})
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-6">
    <h3 class="font-medium text-gray-900 mb-4">Button Settings</h3>

    <!-- Content Section -->
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Button Text
        </label>
        <InputText
          v-model="buttonProps.label"
          @input="updateButtonProps"
          type="text"
          class="w-full rounded-[5px]"
          size="small"
          placeholder="Enter button text"
        />
      </div>
    </div>

    <!-- Style Section -->
    <div class="space-y-4">
      <h4 class="font-medium text-gray-800">Style</h4>

      <!-- Color Theme -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Color Theme
        </label>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="option in severityOptions"
            :key="option.value"
            @click="setButtonSeverity(option.value)"
            :class="[
              'px-3 py-2 text-sm rounded-md border cursor-pointer transition-colors',
              buttonProps.severity === option.value
                ? 'bg-primary-50 border-primary-200 text-primary-700 font-semibold'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
            ]"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Variant -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Style Variant
        </label>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="option in variantOptions"
            :key="option.value"
            @click="setButtonVariant(option.value)"
            :class="[
              'px-3 py-2 text-sm rounded-md border cursor-pointer transition-colors text-center',
              buttonProps.variant === option.value
                ? 'bg-primary-50 border-primary-200 text-primary-700 font-semibold'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
            ]"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Size -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Button Size
        </label>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="option in sizeOptions"
            :key="option.value"
            @click="setButtonSize(option.value)"
            :class="[
              'px-3 py-2 text-sm rounded-md border cursor-pointer transition-colors text-center',
              buttonProps.size === option.value
                ? 'bg-primary-50 border-primary-200 text-primary-700 font-semibold'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
            ]"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Alignment -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Alignment
        </label>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="option in alignmentOptions"
            :key="option.value"
            @click="setButtonAlignment(option.value)"
            :class="[
              'px-3 py-2 text-sm rounded-md border cursor-pointer transition-colors text-center',
              buttonProps.alignment === option.value
                ? 'bg-primary-50 border-primary-200 text-primary-700 font-semibold'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
            ]"
          >
            {{ option.label }}
          </div>
        </div>
      </div>

      <!-- Style Options -->
      <div class="space-y-3">
        <div class="flex items-center">
          <input
            v-model="buttonProps.raised"
            @change="updateButtonProps"
            type="checkbox"
            id="raised"
            class="h-4 w-4 accent-gray-900 focus:ring-gray-900 border-gray-300 rounded"
          />
          <label for="raised" class="ml-2 text-sm text-gray-700 cursor-pointer">
            Raised Style
          </label>
        </div>

        <div class="flex items-center">
          <input
            v-model="buttonProps.rounded"
            @change="updateButtonProps"
            type="checkbox"
            id="rounded"
            class="h-4 w-4 accent-gray-900 focus:ring-gray-900 border-gray-300 rounded"
          />
          <label
            for="rounded"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Rounded Corners
          </label>
        </div>

        <div class="flex items-center">
          <input
            v-model="buttonProps.disabled"
            @change="updateButtonProps"
            type="checkbox"
            id="disabled"
            class="h-4 w-4 accent-gray-900 focus:ring-gray-900 border-gray-300 rounded"
          />
          <label
            for="disabled"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Disabled
          </label>
        </div>

        <div class="flex items-center">
          <input
            v-model="buttonProps.fullWidth"
            @change="updateButtonProps"
            type="checkbox"
            id="fullWidth"
            class="h-4 w-4 accent-gray-900 focus:ring-gray-900 border-gray-300 rounded"
          />
          <label
            for="fullWidth"
            class="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Full Width
          </label>
        </div>
      </div>
    </div>

    <!-- Link Action Section -->
    <div class="space-y-4">
      <h4 class="font-medium text-gray-800">Link Action</h4>

      <!-- Link URL -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Link URL (optional)
        </label>
        <InputText
          v-model="buttonProps.link"
          @input="updateButtonProps"
          type="url"
          class="w-full rounded-[5px]"
          size="small"
          placeholder="https://example.com"
        />
      </div>

      <!-- Link Target (only show if link is provided) -->
      <div v-if="buttonProps.link">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Link Target
        </label>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div
            v-for="option in targetOptions"
            :key="option.value"
            @click="setButtonTarget(option.value)"
            :class="[
              'px-3 py-2 rounded-md border cursor-pointer transition-colors text-center',
              buttonProps.target === option.value
                ? 'bg-primary-50 border-primary-200 text-primary-700 font-semibold'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50',
            ]"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Spacing Section -->
    <div class="space-y-4">
      <h4 class="font-medium text-gray-800">Spacing</h4>

      <!-- Margin -->
      <div>
        <h5 class="text-sm font-medium text-gray-700 mb-3">Margin</h5>

        <div class="space-y-4">
          <!-- Horizontal Margin -->
          <div>
            <label class="block text-sm text-gray-600 mb-2">
              Horizontal: {{ marginHorizontalValue }}px
            </label>
            <Slider
              v-model="marginHorizontalValue"
              :min="0"
              :max="100"
              :step="1"
              class="w-full"
            />
          </div>

          <!-- Vertical Margin -->
          <div>
            <label class="block text-sm text-gray-600 mb-2">
              Vertical: {{ marginVerticalValue }}px
            </label>
            <Slider
              v-model="marginVerticalValue"
              :min="0"
              :max="100"
              :step="1"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Padding -->
      <div>
        <h5 class="text-sm font-medium text-gray-700 mb-3">Padding</h5>

        <div class="space-y-4">
          <!-- Horizontal Padding -->
          <div>
            <label class="block text-sm text-gray-600 mb-2">
              Horizontal: {{ paddingHorizontalValue }}px
            </label>
            <Slider
              v-model="paddingHorizontalValue"
              :min="0"
              :max="50"
              :step="1"
              class="w-full"
            />
          </div>

          <!-- Vertical Padding -->
          <div>
            <label class="block text-sm text-gray-600 mb-2">
              Vertical: {{ paddingVerticalValue }}px
            </label>
            <Slider
              v-model="paddingVerticalValue"
              :min="0"
              :max="50"
              :step="1"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
