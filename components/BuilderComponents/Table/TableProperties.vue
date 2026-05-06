<script setup>
import { usePageBuilderStore } from '~/stores/pageBuilder'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const store = usePageBuilderStore()
const tableProps = ref({})

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === 'table') {
      tableProps.value = { ...newComponent.props }
    }
  },
  { immediate: true, deep: true }
)

// Update function
const updateTableProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, tableProps.value)
  }
}

// Edit content function
const editTableContent = async () => {
  if (props.component) {
    // Enable editing mode
    store.enableComponentEditing(props.component.id)

    // Wait for the next tick to ensure the inputs are rendered
    await nextTick()

    // Focus the first table cell input (header cell)
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

const updateTableDimensions = () => {
  if (props.component) {
    const currentData = [...props.component.props.data]
    const targetRows = tableProps.value.rows
    const targetColumns = tableProps.value.columns

    if (targetRows < 2 || targetColumns < 2) {
      alert('Rows and columns must be at least 2')
      return
    }

    // Create new data array with proper dimensions
    const newData = []

    // Handle rows
    for (let rowIndex = 0; rowIndex < targetRows; rowIndex++) {
      const row = []

      // Handle columns
      for (let colIndex = 0; colIndex < targetColumns; colIndex++) {
        if (
          currentData[rowIndex] &&
          currentData[rowIndex][colIndex] !== undefined
        ) {
          // Use existing data
          row.push(currentData[rowIndex][colIndex])
        } else {
          // Add new data
          if (rowIndex === 0) {
            row.push(`Header ${colIndex + 1}`)
          } else {
            row.push(`Row ${rowIndex} Col ${colIndex + 1}`)
          }
        }
      }
      newData.push(row)
    }

    // Update the component with new data and dimensions
    store.updateComponentProps(props.component.id, {
      ...tableProps.value,
      data: newData,
      rows: targetRows,
      columns: targetColumns,
    })
  }
}

const addRow = () => {
  if (props.component) {
    const currentData = [...props.component.props.data]
    const newRow = Array(tableProps.value.columns).fill('New Row')
    currentData.push(newRow)

    tableProps.value.rows = tableProps.value.rows + 1

    store.updateComponentProps(props.component.id, {
      ...tableProps.value,
      data: currentData,
      rows: tableProps.value.rows,
    })
  }
}

const removeRow = () => {
  if (props.component && tableProps.value.rows > 2) {
    const currentData = [...props.component.props.data]
    currentData.pop()

    tableProps.value.rows = tableProps.value.rows - 1

    store.updateComponentProps(props.component.id, {
      ...tableProps.value,
      data: currentData,
      rows: tableProps.value.rows,
    })
  }
}

const addColumn = () => {
  if (props.component) {
    const currentData = [...props.component.props.data]
    currentData.forEach((row, index) => {
      if (index === 0) {
        row.push(`Header ${row.length + 1}`)
      } else {
        row.push('New Column')
      }
    })

    tableProps.value.columns = tableProps.value.columns + 1

    store.updateComponentProps(props.component.id, {
      ...tableProps.value,
      data: currentData,
      columns: tableProps.value.columns,
    })
  }
}

const removeColumn = () => {
  if (props.component && tableProps.value.columns > 2) {
    const currentData = [...props.component.props.data]
    currentData.forEach((row) => {
      row.pop()
    })

    tableProps.value.columns = tableProps.value.columns - 1

    store.updateComponentProps(props.component.id, {
      ...tableProps.value,
      data: currentData,
      columns: tableProps.value.columns,
    })
  }
}
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200">
    <h3 class="font-medium text-gray-900 mb-4">Table Settings</h3>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Dimensions
        </label>
        <div class="flex gap-2">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Rows</label>
            <InputNumber
              v-model.number="tableProps.rows"
              type="number"
              min="2"
              max="20"
              size="small"
              inputClass="w-full rounded-none"
            />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Columns</label>
            <InputNumber
              v-model.number="tableProps.columns"
              type="number"
              min="2"
              max="10"
              size="small"
              inputClass="w-full rounded-none"
            />
          </div>
        </div>
        <Button
          @click="updateTableDimensions"
          severity="primary"
          size="small"
          class="mt-2 w-full flex items-center justify-center gap-2"
        >
          <BaseLucide name="RefreshCw" :size="16" />
          Update Dimensions
        </Button>

        <Button
          v-if="
            props.component && !store.isComponentEditing(props.component.id)
          "
          @click="editTableContent"
          severity="secondary"
          outlined
          size="small"
          class="mt-2 w-full flex items-center justify-center gap-2"
        >
          <BaseLucide name="Edit" :size="16" />
          Edit Content
        </Button>

        <Button
          v-if="props.component && store.isComponentEditing(props.component.id)"
          @click="finishEditingContent"
          severity="success"
          size="small"
          class="mt-2 w-full flex items-center justify-center gap-2"
        >
          <BaseLucide name="Check" :size="16" />
          Done Editing
        </Button>

        <div class="mt-3 space-y-2">
          <div class="flex gap-2">
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
              :disabled="tableProps.rows <= 2"
              outlined
            >
              Remove Row
            </Button>
          </div>
          <div class="flex gap-2">
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
              :disabled="tableProps.columns <= 2"
              outlined
            >
              Remove Column
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Styling
        </label>
        <div class="space-y-2">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="tableProps.styling.bordered"
              type="checkbox"
              class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4"
              @change="updateTableProps"
            />
            <span class="ml-2 text-sm text-gray-700">Bordered</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="tableProps.styling.striped"
              type="checkbox"
              class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4"
              @change="updateTableProps"
            />
            <span class="ml-2 text-sm text-gray-700">Striped rows</span>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Header colors
        </label>
        <div class="flex gap-2 items-center justify-between">
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Label
            </label>
            <input
              v-model="tableProps.styling.headerLabelColor"
              type="color"
              class="w-full h-10 rounded border border-gray-300 cursor-pointer"
              @change="updateTableProps"
            />
          </div>
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Background
            </label>
            <input
              v-model="tableProps.styling.headerBg"
              type="color"
              class="w-full h-10 rounded border border-gray-300 cursor-pointer"
              @change="updateTableProps"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
