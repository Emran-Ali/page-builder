<script setup>
import {usePageBuilderStore} from "@stores/pageBuilder";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const store = usePageBuilderStore();

const duplicateComponent = () => {
  if (props.component) {
    store.duplicateComponent(props.component.id);
  }
};

const deleteComponent = () => {
  if (props.component) {
    store.deleteComponent(props.component.id);
  }
};
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200">
    <h3 class="font-medium text-gray-900 mb-4">Actions</h3>
    <div class="space-y-2">
      <Button
        @click="duplicateComponent"
        severity="secondary"
        size="small"
        class="w-full flex items-center justify-center gap-2"
      >
        <BaseLucide name="Copy" :size="16" />
        Duplicate
      </Button>
      <Button
        @click="deleteComponent"
        severity="danger"
        size="small"
        class="w-full flex items-center justify-center gap-2"
      >
        <BaseLucide name="Trash2" :size="16" />
        Delete
      </Button>
    </div>
  </div>
</template>
