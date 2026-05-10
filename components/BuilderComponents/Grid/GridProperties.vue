<script setup>
import {ref, watch} from "vue";
import {usePageBuilderStore} from "~/stores/pageBuilder";

const props = defineProps({
  component: {type: Object, required: true},
});
const store = usePageBuilderStore();

const gridProps = ref({});

watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === "grid") {
      gridProps.value = {...newComponent.props};
    }
  },
  {immediate: true, deep: true},
);

function selectColumns(value) {
  if (value >= 2 && value <= 4) {
    gridProps.value.columns = value;
    store.updateComponentProps(props.component.id, {...gridProps.value});
  }
}
</script>

<template>
  <div class="bg-surface-card p-4 rounded-lg border border-surface-border">
    <h3 class="font-medium text-surface-color mb-2">Grid Properties</h3>
    <label class="block text-sm font-medium text-surface-secondary-color mb-1"
      >Columns</label
    >
    <div class="flex gap-2 mt-2">
      <div
        v-for="n in [2, 3, 4]"
        :key="n"
        class="flex-1 px-0 py-2 rounded border text-center cursor-pointer select-none transition-all"
        :class="
          gridProps.columns === n
            ? 'bg-primary-50 text-primary-700 border-primary-500 shadow font-semibold'
            : 'bg-surface-card text-surface-color border-surface-border hover:bg-surface-hover hover:border-primary-300'
        "
        @click="selectColumns(n)"
      >
        {{ n }}
      </div>
    </div>
  </div>
</template>
