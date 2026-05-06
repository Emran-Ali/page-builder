<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  id: String,
  data: Array,
  columns: Array,
  size: String,
  showGridlines: Boolean,
  stripedRows: Boolean,
  sortable: Boolean,
  tableStyle: String,
  styling: Object,
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:props'])

// Create reactive data for editing
const editableData = ref(JSON.parse(JSON.stringify(props.data || [])))
const editableColumns = ref(JSON.parse(JSON.stringify(props.columns || [])))

// Controlled sort state so we can disable/restore sorting based on isEditing
const sortField = ref(null)
const sortOrder = ref(null)
const multiSortMeta = ref(null)

// Cache to restore sorting after editing ends
const cachedSortField = ref(null)
const cachedSortOrder = ref(null)
const cachedMultiSortMeta = ref(null)

// Watch for prop changes
watch(
  () => props.data,
  (newData) => {
    if (newData) {
      editableData.value = JSON.parse(JSON.stringify(newData))
    }
  },
  { deep: true }
)

watch(
  () => props.columns,
  (newColumns) => {
    if (newColumns) {
      editableColumns.value = JSON.parse(JSON.stringify(newColumns))
    }
  },
  { deep: true }
)

// Update functions
const updateData = () => {
  emit('update:props', {
    data: editableData.value,
    columns: editableColumns.value,
  })
}

const updateColumnHeader = (colIndex, newHeader) => {
  editableColumns.value[colIndex].header = newHeader
}

// Use the actual data object instead of row index to avoid sorting conflicts
const updateCellValue = (dataObj, field, newValue) => {
  // Find the row in editableData by matching the data object
  const rowIndex = editableData.value.findIndex((row) => row === dataObj)
  if (rowIndex !== -1) {
    editableData.value[rowIndex][field] = newValue
  }
}

const saveChanges = () => {
  updateData()
}

// Handle sort event (ignored during editing)
const onSort = (event) => {
  console.log('onSort')
  if (props.isEditing) return
  sortField.value = event.sortField ?? null
  sortOrder.value = event.sortOrder ?? null
  multiSortMeta.value = event.multiSortMeta ?? null
}

// When editing starts, clear active sort so typing doesn't resort rows.
// When editing ends, restore prior sort state.
watch(
  () => props.isEditing,
  (nowEditing) => {
    if (nowEditing) {
      cachedSortField.value = sortField.value
      cachedSortOrder.value = sortOrder.value
      cachedMultiSortMeta.value = multiSortMeta.value

      sortField.value = null
      sortOrder.value = null
      multiSortMeta.value = null
    } else {
      sortField.value = cachedSortField.value
      sortOrder.value = cachedSortOrder.value
      multiSortMeta.value = cachedMultiSortMeta.value
    }
  }
)
</script>

<template>
  <div class="w-full" :data-component-id="id">
    <DataTable
      :key="id"
      :value="editableData"
      :size="size"
      :showGridlines="showGridlines"
      :stripedRows="stripedRows"
      :sortField="sortField"
      :sortOrder="sortOrder"
      :multiSortMeta="multiSortMeta"
      @sort="onSort"
    >
      <Column
        v-for="(col, colIndex) in editableColumns"
        :key="col.field"
        :field="col.field"
        :style="col.style || ''"
        :sortable="!isEditing && (col.sortable || sortable)"
      >
        <template #header>
          <input
            v-if="isEditing"
            :key="`header-${col.field}`"
            :value="col.header"
            @input="updateColumnHeader(colIndex, $event.target.value)"
            @blur="saveChanges"
            @keyup.enter="saveChanges"
            class="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 font-semibold"
          />
          <span v-else class="font-semibold">{{ col.header }}</span>
        </template>
        <template #body="slotProps">
          <input
            v-if="isEditing"
            :key="`cell-${slotProps.index}-${col.field}`"
            :value="slotProps.data[col.field]"
            @input="
              updateCellValue(slotProps.data, col.field, $event.target.value)
            "
            @blur="saveChanges"
            @keyup.enter="saveChanges"
            class="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
          />
          <span v-else>{{ slotProps.data[col.field] }}</span>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
