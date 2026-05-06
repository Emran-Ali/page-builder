<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  id: String,
  rows: Number,
  columns: Number,
  data: Array,
  styling: Object,
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:props"]);

const editableData = ref(JSON.parse(JSON.stringify(props.data)));

watch(
  () => props.data,
  (newData) => {
    editableData.value = JSON.parse(JSON.stringify(newData));
  },
  { deep: true }
);

const updateData = () => {
  emit("update:props", {
    data: editableData.value,
    rows: editableData.value.length,
    columns: editableData.value[0].length,
  });
};
</script>

<template>
  <div class="w-full" :data-component-id="id">
    <div class="overflow-x-auto">
      <table
        :class="[
          'w-full',
          props.styling.bordered ? 'border border-gray-300' : '',
          props.styling.striped ? 'table-striped' : '',
        ]"
      >
        <thead>
          <tr
            :style="{
              backgroundColor: props.styling.headerBg,
              color: props.styling.headerLabelColor,
            }"
            class="font-semibold"
          >
            <th
              v-for="(header, colIndex) in props.data[0]"
              :key="colIndex"
              :class="[
                'px-4 py-2 text-left',
                props.styling.bordered ? 'border-b border-gray-300' : '',
              ]"
            >
              <input
                v-if="isEditing"
                v-model="editableData[0][colIndex]"
                @blur="updateData"
                @keyup.enter="updateData"
                class="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
              />
              <span v-else>{{ header }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in props.data.slice(1)"
            :key="rowIndex"
            :class="[
              props.styling.striped && rowIndex % 2 === 1 ? 'bg-gray-50' : '',
            ]"
          >
            <td
              v-for="(cell, colIndex) in row"
              :key="colIndex"
              :class="[
                'px-4 py-2',
                props.styling.bordered ? 'border-b border-gray-300' : '',
              ]"
            >
              <input
                v-if="isEditing"
                v-model="editableData[rowIndex + 1][colIndex]"
                @blur="updateData"
                @keyup.enter="updateData"
                class="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
              />
              <span v-else>{{ cell }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-striped tbody tr:nth-child(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
