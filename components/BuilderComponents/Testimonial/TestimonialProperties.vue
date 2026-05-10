<script setup>
import {ref, watch} from "vue";
import {usePageBuilderStore} from "~/stores/pageBuilder";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

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
    if (newComponent && newComponent.type === "testimonial") {
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

// Watchers for immediate updates
const updateProp = (key, value) => {
  localProps.value[key] = value;
  updateProps();
};
</script>

<template>
  <div class="max-h-[80vh] overflow-y-auto space-y-4">
    <h3 class="text-lg font-semibold mb-4">Content Settings</h3>

    <div class="space-y-6">
      <!-- Quote Content -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-2">Quote Text</label>
            <Textarea
              :model-value="localProps.quote"
              placeholder="Enter testimonial quote"
              rows="4"
              class="w-full"
              size="small"
              @update:model-value="updateProp('quote', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Author Information -->
      <div class="bg-white p-4 rounded-lg border border-gray-200">
        <h4 class="font-medium text-gray-900 mb-3">Author Information</h4>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-2"> Name</label>
            <InputText
              :model-value="localProps.authorName"
              placeholder="Enter author name"
              class="w-full"
              size="small"
              @update:model-value="updateProp('authorName', $event)"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2"> Role</label>
            <InputText
              :model-value="localProps.authorRole"
              placeholder="Enter author role or location"
              class="w-full"
              size="small"
              @update:model-value="updateProp('authorRole', $event)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-3"> Upload Image</label>
            <SharedFileUpload
              :model-value="localProps.authorImage"
              image-version="thumb"
              @update:model-value="updateProp('authorImage', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- No custom styles needed - using inline Tailwind classes -->
