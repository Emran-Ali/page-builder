<script setup>
import { ref, watch } from 'vue'
import { usePageBuilderStore } from '~/stores/pageBuilder'
import RTEditor from './RTEditor.vue'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const store = usePageBuilderStore()
const rteProps = ref({})

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === 'rte') {
      rteProps.value = { ...newComponent.props }
    }
  },
  { immediate: true, deep: true }
)

const updateRTEProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, rteProps.value)
  }
}

const updateProp = (key, value) => {
  rteProps.value[key] = value
  updateRTEProps()
}
</script>

<template>
  <div
    class="bg-white p-4 rounded-lg border border-gray-200 space-y-6 max-h-[80vh] overflow-y-auto"
  >
    <h3 class="font-medium text-gray-900 mb-4">Content</h3>

    <RTEditor
      :model-value="rteProps.content"
      placeholder="Enter rich text content..."
      :task-style="true"
      @update:model-value="updateProp('content', $event)"
    />
  </div>
</template>
