<script setup>
import { ref, watch } from 'vue'
import { usePageBuilderStore } from '~/stores/pageBuilder'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
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
    if (newComponent && newComponent.type === 'teacherfinderblock') {
      localProps.value = { ...newComponent.props }
    }
  },
  { immediate: true, deep: true }
)

const headingOptions = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
]

const areaOptions = [
  { label: 'Los Angeles Metro', value: 'California' },
  { label: 'San Francisco Bay Area', value: 'San Francisco Bay Area' },
  { label: 'Portland Metro', value: 'Portland, Oregon' },
]

const itemsPerPageOptions = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
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
        </div>
      </div>

      <!-- Search Settings -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-2">Initial Area</label>
            <Dropdown
              :model-value="localProps.initialArea || 'California'"
              :options="areaOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              size="small"
              placeholder="Select an Area"
              @update:model-value="updateProp('initialArea', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">
              Teachers Per Page
            </label>
            <Dropdown
              :model-value="localProps.itemsPerPage || 5"
              :options="itemsPerPageOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              size="small"
              @update:model-value="updateProp('itemsPerPage', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- No custom styles needed - using inline Tailwind classes -->
