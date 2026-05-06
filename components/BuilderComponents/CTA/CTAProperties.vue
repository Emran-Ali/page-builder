<script setup>
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { ref, watch } from 'vue'
import { usePageBuilderStore } from '~/stores/pageBuilder'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const store = usePageBuilderStore()
const localProps = ref({})

watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === 'cta') {
      localProps.value = { ...newComponent.props }
    }
  },
  { immediate: true, deep: true }
)

const updateProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, localProps.value)
  }
}

const updateProp = (key, value) => {
  localProps.value[key] = value
  updateProps()
}

// Buttons management
const addButton = () => {
  if (!localProps.value.buttons) {
    localProps.value.buttons = []
  }
  localProps.value.buttons.push({
    label: 'Button',
    link: '#',
    severity: 'primary',
    variant: 'filled',
    target: '_self',
  })
  updateProps()
}

const removeButton = (index) => {
  if (localProps.value.buttons && localProps.value.buttons[index]) {
    localProps.value.buttons.splice(index, 1)
    updateProps()
  }
}

const updateButton = (index, key, value) => {
  if (localProps.value.buttons && localProps.value.buttons[index]) {
    localProps.value.buttons[index][key] = value
    updateProps()
  }
}

const severityOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  // { label: 'Success', value: 'success' },
  // { label: 'Info', value: 'info' },
  // { label: 'Warning', value: 'warning' },
  // { label: 'Danger', value: 'danger' },
]

const variantOptions = [
  { label: 'Filled', value: 'filled' },
  { label: 'Outlined', value: 'outlined' },
  // { label: 'Text', value: 'text' },
]
</script>

<template>
  <div class="max-h-[80vh] overflow-y-auto space-y-4">
    <h3 class="text-lg font-semibold mb-4">Content Settings</h3>

    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Header </label>
            <InputText
              :model-value="localProps.header"
              placeholder="Enter header"
              class="w-full"
              size="small"
              @update:model-value="updateProp('header', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Title -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Title </label>
            <Textarea
              :model-value="localProps.title"
              placeholder="Enter title/description"
              rows="3"
              size="small"
              class="w-full"
              @update:model-value="updateProp('title', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-sm font-medium text-gray-900">Buttons</h4>
          <Button variant="outlined" size="small" @click="addButton"
            ><BaseLucide name="Plus" :size="16"
          /></Button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(button, index) in localProps.buttons"
            :key="index"
            class="border rounded-lg p-4 space-y-3"
          >
            <div class="flex justify-between items-center">
              <h5 class="font-medium text-sm">Button {{ index + 1 }}</h5>
              <Button
                severity="danger"
                size="small"
                text
                class="flex items-center gap-2"
                @click="removeButton(index)"
              >
                <BaseLucide name="Trash2" :size="16" />
              </Button>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Label</label>
              <InputText
                :model-value="button.label"
                placeholder="Button label"
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
