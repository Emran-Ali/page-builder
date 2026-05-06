<script setup>
import { usePageCrudStore } from '../../stores/page-crud'
import { usePageBuilderStore } from '../../stores/pageBuilder'

const store = usePageBuilderStore()
const pageCrudStore = usePageCrudStore()
const config = useRuntimeConfig()
const { confirm, confirmDialogRef } = useConfirmationDialog()

const isSaving = ref(false)
const showSaveSuccess = ref(false)
const showImportModal = ref(false)
const importJsonText = ref('')
const showMaxWidthModal = ref(false)
const maxWidthValue = ref(store.currentPage.settings.maxWidth?.value || 1200)
const maxWidthUnit = ref(store.currentPage.settings.maxWidth?.unit || 'px')

const isPreview = computed(() => store.isPreview)

const togglePreview = () => {
  store.togglePreview()
}

const clearPage = () => {
  confirm({
    header: `Confirm Clearing the Page`,
    message: `Are you sure you want to clear all components? This action cannot be undone.`,
    type: 'danger',
    onAccept: () => {
      store.clearPage()
    },
  })
}

// const loadDemoPage = () => {
//   if (
//     confirm(
//       'Load the demo landing page? This will replace all current components.'
//     )
//   ) {
//     store.loadDemoPage()
//   }
// }

const savePage = async () => {
  isSaving.value = true

  try {
    await pageCrudStore.savePage(store.currentPage)

    showSaveSuccess.value = true
    setTimeout(() => {
      showSaveSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('Error saving page:', error)
    alert('Error saving page. Please try again.')
  } finally {
    isSaving.value = false
  }
}

// const exportJSON = () => {
//   const pageData = store.getPageJSON
//   const jsonString = JSON.stringify(pageData, null, 2)

//   // Create download link
//   const blob = new Blob([jsonString], { type: 'application/json' })
//   const url = URL.createObjectURL(blob)
//   const link = document.createElement('a')
//   link.href = url
//   link.download = `page-${pageData.pageId}.json`
//   document.body.appendChild(link)
//   link.click()
//   document.body.removeChild(link)
//   URL.revokeObjectURL(url)
// }

// const importJSON = () => {
//   showImportModal.value = true
//   importJsonText.value = ''
// }

const handleImport = () => {
  try {
    const pageData = JSON.parse(importJsonText.value)

    console.log('pageData', pageData)

    // Validate the JSON structure
    if (!pageData.components) {
      throw new Error('Invalid JSON format')
    }

    // Load the page data
    store.currentPage = {
      components: pageData.components,
      settings: pageData.settings || { theme: 'default', responsive: true },
    }

    store.selectedComponent = null
    showImportModal.value = false

    alert('Page imported successfully!')
  } catch (error) {
    alert('Error importing JSON: ' + error.message)
  }
}

const openMaxWidthModal = () => {
  maxWidthValue.value = store.currentPage.settings.maxWidth?.value || 1200
  maxWidthUnit.value = store.currentPage.settings.maxWidth?.unit || 'px'
  showMaxWidthModal.value = true
}

const goBack = () => {
  navigateTo(`${config.public.adminUrl}pages`, { external: true })
}

const updateMaxWidth = () => {
  store.updatePageSettings({
    maxWidth: {
      value: maxWidthValue.value,
      unit: maxWidthUnit.value,
    },
  })
  showMaxWidthModal.value = false
}
</script>

<template>
  <div
    class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6"
  >
    <!-- Left side - Page info -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center gap-2">
        <div
          class="flex items-center justify-center w-8 h-8 bg-black rounded-lg"
        >
          <BaseLucide name="Palette" :size="20" class="text-white" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-black">Craft Music</h1>
          <p class="text-xs text-gray-600 -mt-1">Page Builder</p>
        </div>
      </div>
    </div>

    <!-- Center - Actions -->
    <div class="flex items-center space-x-2">
      <Button
        severity="secondary"
        :outlined="true"
        size="small"
        class="flex items-center gap-2"
        @click="goBack"
      >
        <BaseLucide name="ArrowLeft" :size="16" />
        Back to admin
      </Button>
      <Button
        :severity="isPreview ? 'success' : 'secondary'"
        :outlined="!isPreview"
        size="small"
        class="flex items-center gap-2"
        @click="togglePreview"
      >
        <BaseLucide :name="isPreview ? 'EyeOff' : 'Eye'" :size="16" />
        {{ isPreview ? 'Exit Preview' : 'Preview' }}
      </Button>

      <Button
        severity="secondary"
        outlined
        size="small"
        class="flex items-center gap-2"
        @click="openMaxWidthModal"
      >
        <BaseLucide name="Maximize2" :size="16" />
        Canvas width
      </Button>
      <!-- 
      <Button
        severity="success"
        outlined
        size="small"
        class="flex items-center gap-2"
        @click="loadDemoPage"
      >
        <BaseLucide name="Target" :size="16" />
        Demo Page
      </Button> -->

      <Button
        severity="danger"
        outlined
        size="small"
        class="flex items-center gap-2"
        @click="clearPage"
      >
        <BaseLucide name="Trash2" :size="16" />
        Clear All
      </Button>
    </div>

    <!-- Right side - Save/Load -->
    <div class="flex items-center space-x-2">
      <!-- <Button
        severity="secondary"
        outlined
        size="small"
        class="flex items-center gap-2"
        @click="exportJSON"
      >
        <BaseLucide name="Download" :size="16" />
        Export JSON
      </Button>

      <Button
        severity="secondary"
        outlined
        size="small"
        class="flex items-center gap-2"
        @click="importJSON"
      >
        <BaseLucide name="Upload" :size="16" />
        Import JSON
      </Button> -->

      <Button
        :disabled="isSaving"
        severity="primary"
        size="small"
        class="flex items-center gap-2"
        @click="savePage"
      >
        <BaseLucide
          :name="isSaving ? 'Loader2' : 'Save'"
          :size="16"
          :class="{ 'animate-spin': isSaving }"
        />
        {{ isSaving ? 'Saving...' : 'Save Page' }}
      </Button>
    </div>

    <SharedBaseConfirmationDialog ref="confirmDialogRef" />
    <!-- Import Modal -->
    <div
      v-if="showImportModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Import JSON</h3>
        <textarea
          v-model="importJsonText"
          rows="10"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Paste your JSON here..."
        />
        <div class="mt-4 flex justify-end space-x-2">
          <Button
            severity="secondary"
            outlined
            size="small"
            @click="showImportModal = false"
          >
            Cancel
          </Button>
          <Button severity="primary" size="small" @click="handleImport">
            Import
          </Button>
        </div>
      </div>
    </div>

    <!-- Max Width Modal -->
    <div
      v-if="showMaxWidthModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Page Max Width</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Width Value</label
            >
            <InputNumber
              v-model.number="maxWidthValue"
              type="number"
              min="100"
              max="2000"
              class="w-full"
              placeholder="Enter width value"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Unit</label
            >
            <select
              v-model="maxWidthUnit"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="px">Pixels (px)</option>
              <option value="%">Percentage (%)</option>
            </select>
          </div>
          <div class="text-sm text-gray-500">
            Current setting: {{ maxWidthValue }}{{ maxWidthUnit }}
          </div>
        </div>
        <div class="mt-6 flex justify-end space-x-2">
          <Button
            severity="secondary"
            outlined
            size="small"
            @click="showMaxWidthModal = false"
          >
            Cancel
          </Button>
          <Button severity="primary" size="small" @click="updateMaxWidth">
            Update
          </Button>
        </div>
      </div>
    </div>

    <!-- Save Success Toast -->
    <div
      v-if="showSaveSuccess"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300 flex items-center gap-2"
    >
      <BaseLucide name="CheckCircle" :size="16" class="text-white" />
      Page saved successfully!
    </div>
  </div>
</template>
