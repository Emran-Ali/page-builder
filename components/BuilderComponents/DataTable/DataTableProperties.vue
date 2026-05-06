<script setup>
import { ref, watch, nextTick } from 'vue'
import { usePageBuilderStore } from '~/stores/pageBuilder'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const store = usePageBuilderStore()
const dataTableProps = ref({})

// Watch for component prop changes and sync state
watch(
  () => props.component?.props,
  (newProps) => {
    if (newProps && props.component.type === 'datatable') {
      dataTableProps.value = { ...newProps }
    }
  },
  { immediate: true, deep: true }
)

// Update function
const updateDataTableProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, dataTableProps.value)
  }
}

// Edit content function
const editDataTableContent = async () => {
  if (props.component) {
    // Enable editing mode
    store.enableComponentEditing(props.component.id)

    // Wait for the next tick to ensure the inputs are rendered
    await nextTick()

    // Focus the first input (header cell)
    const firstInput = document.querySelector(
      `[data-component-id="${props.component.id}"] input`
    )
    if (firstInput) {
      firstInput.focus()
      firstInput.select()
    }
  }
}

// Finish editing function
const finishEditingContent = () => {
  if (props.component) {
    store.disableComponentEditing(props.component.id)
  }
}

// Add new row
const addRow = () => {
  if (props.component) {
    const currentData = [...props.component.props.data]
    const newRow = {}

    // Initialize empty values for each column field
    props.component.props.columns.forEach((col) => {
      newRow[col.field] = 'New Value'
    })

    currentData.push(newRow)

    store.updateComponentProps(props.component.id, {
      ...dataTableProps.value,
      data: currentData,
    })
  }
}

// Remove last row
const removeRow = () => {
  if (props.component && props.component.props.data.length > 1) {
    const currentData = [...props.component.props.data]
    currentData.pop()

    store.updateComponentProps(props.component.id, {
      ...dataTableProps.value,
      data: currentData,
    })
  }
}

// Add new column with equal width distribution
const addColumn = () => {
  if (props.component) {
    const currentColumns = [...props.component.props.columns]
    const currentData = [...props.component.props.data]

    const newFieldName = `field${currentColumns.length + 1}`
    const totalColumns = currentColumns.length + 1
    const equalWidth = `width: ${Math.floor(100 / totalColumns)}%`

    // Update existing columns to have equal width
    currentColumns.forEach((column) => {
      column.style = equalWidth
      column.sortable = dataTableProps.value.sortable || false
    })

    const newColumn = {
      field: newFieldName,
      header: `Header ${currentColumns.length + 1}`,
      sortable: dataTableProps.value.sortable || false,
      style: equalWidth,
    }

    currentColumns.push(newColumn)

    // Add the new field to all existing data rows
    currentData.forEach((row) => {
      row[newFieldName] = 'New Data'
    })

    store.updateComponentProps(props.component.id, {
      ...dataTableProps.value,
      columns: currentColumns,
      data: currentData,
    })
  }
}

// Remove last column and redistribute widths
const removeColumn = () => {
  if (props.component && props.component.props.columns.length > 1) {
    const currentColumns = [...props.component.props.columns]
    const currentData = [...props.component.props.data]

    const removedColumn = currentColumns.pop()
    const totalColumns = currentColumns.length
    const equalWidth = `width: ${Math.floor(100 / totalColumns)}%`

    // Update remaining columns to have equal width
    currentColumns.forEach((column) => {
      column.style = equalWidth
    })

    // Remove the field from all data rows
    currentData.forEach((row) => {
      delete row[removedColumn.field]
    })

    store.updateComponentProps(props.component.id, {
      ...dataTableProps.value,
      columns: currentColumns,
      data: currentData,
    })
  }
}

// Update global sortable for all columns
const updateGlobalSortable = () => {
  if (props.component) {
    const currentColumns = [...props.component.props.columns]
    const isGlobalSortable = dataTableProps.value.sortable

    // Update sortable property for all columns
    currentColumns.forEach((column) => {
      column.sortable = isGlobalSortable
    })

    store.updateComponentProps(props.component.id, {
      ...dataTableProps.value,
      columns: currentColumns,
    })
  }
}
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200">
    <h3 class="font-medium text-gray-900 mb-4">DataTable Settings</h3>

    <div class="space-y-4">
      <!-- Content Editing -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <div class="space-y-2">
          <Button
            v-if="
              props.component && !store.isComponentEditing(props.component.id)
            "
            @click="editDataTableContent"
            severity="secondary"
            outlined
            size="small"
            class="mt-2 w-full flex items-center justify-center gap-2"
          >
            <BaseLucide name="Edit" :size="16" />
            Edit Content
          </Button>
          <Button
            v-if="
              props.component && store.isComponentEditing(props.component.id)
            "
            @click="finishEditingContent"
            severity="success"
            size="small"
            class="mt-2 w-full flex items-center justify-center gap-2"
          >
            <BaseLucide name="Check" :size="16" />
            Done Editing
          </Button>

          <div class="grid grid-cols-2 gap-2">
            <Button
              @click="addRow"
              severity="success"
              size="small"
              class="flex-1 flex items-center justify-center gap-2"
              outlined
            >
              Add Row
            </Button>
            <Button
              @click="removeRow"
              severity="danger"
              size="small"
              class="flex-1 flex items-center justify-center gap-2"
              :disabled="props.component?.props?.data?.length <= 1"
              outlined
            >
              Remove Row
            </Button>
            <Button
              @click="addColumn"
              severity="success"
              size="small"
              class="flex-1 flex items-center justify-center gap-2"
              outlined
            >
              Add Column
            </Button>
            <Button
              @click="removeColumn"
              severity="danger"
              size="small"
              class="flex-1 flex items-center justify-center gap-2"
              :disabled="props.component?.props?.columns?.length <= 1"
              outlined
            >
              Remove Column
            </Button>
          </div>
        </div>
      </div>

      <!-- Table Appearance -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Appearance
        </label>
        <div class="space-y-3">
          <!-- Size -->
          <div>
            <label class="block text-xs text-gray-500 mb-1">Size</label>
            <Select
              v-model="dataTableProps.size"
              @update:model-value="updateDataTableProps"
              class="w-full rounded-none"
              size="small"
              :options="[
                { label: 'Small', value: 'small' },
                { label: 'Normal', value: 'normal' },
                { label: 'Large', value: 'large' },
              ]"
              option-label="label"
              option-value="value"
              placeholder="Select Size"
            />
          </div>

          <!-- Boolean Options -->
          <div class="space-y-2">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="dataTableProps.showGridlines"
                type="checkbox"
                class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4"
                @change="updateDataTableProps"
              />
              <span class="ml-2 text-sm text-gray-700">Show gridlines</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="dataTableProps.stripedRows"
                type="checkbox"
                class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4"
                @change="updateDataTableProps"
              />
              <span class="ml-2 text-sm text-gray-700">Striped rows</span>
            </label>
            <label class="flex items-center cursor-pointer">
              <input
                v-model="dataTableProps.sortable"
                type="checkbox"
                class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4"
                @change="updateGlobalSortable"
              />
              <span class="ml-2 text-sm text-gray-700"
                >Sortable columns (global)</span
              >
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
