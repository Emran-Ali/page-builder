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
    if (newComponent && newComponent.type === 'searchofflineteacher') {
      localProps.value = { ...newComponent.props }
    }
  },
  { immediate: true, deep: true }
)

const areaOptions = [
  { label: 'Los Angeles Metro', value: 'California' },
  { label: 'San Francisco Bay Area', value: 'San Francisco Bay Area' },
  { label: 'Portland Metro', value: 'Portland, Oregon' },
]

const headingOptions = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
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

      <!-- Area Configuration -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-2"
              >Select Initial Area</label
            >
            <Dropdown
              :model-value="localProps.initialArea || 'California'"
              :options="areaOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              size="small"
              @update:model-value="updateProp('initialArea', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
