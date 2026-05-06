<template>
  <div :class="`${taskStyle ? '' : 'qnstl'}`">
    <ClientOnly>
      <!-- Visual Editor -->
      <div v-if="!htmlMode">
        <Editor
          ref="editorRef"
          :model-value="modelValue"
          theme="snow"
          :placeholder="placeholder"
          :modules="editorModules"
          :pt="pt"
          class="!border !border-gray-200 rounded-md"
          @update:model-value="emit('update:modelValue', $event)"
          @paste="handlePaste"
        >
          <template #toolbar>
            <span class="ql-formats">
              <select class="ql-header">
                <option value="1">H1</option>
                <option value="2">H2</option>
                <option value="3">H3</option>
                <option value="4">H4</option>
                <option selected>Text</option>
              </select>
            </span>
            <span class="ql-formats">
              <button class="ql-bold" />
              <button class="ql-italic" />
              <button class="ql-underline" />
            </span>
            <span class="ql-formats">
              <button class="ql-link" />
              <button
                v-if="imageInput"
                title="Insert Image"
                @click.prevent="triggerFileInput"
              >
                <i class="pi pi-image text-gray-600" />
              </button>
            </span>
            <span class="ql-formats">
              <button class="ql-list" value="ordered" />
              <button class="ql-list" value="bullet" />
            </span>
            <span class="ql-formats">
              <select class="ql-align">
                <option selected />
                <option value="center" />
                <option value="right" />
                <option value="justify" />
              </select>
            </span>
            <span class="ql-formats">
              <button
                title="Toggle HTML View"
                class="html-toggle-btn"
                :class="{ active: htmlMode }"
                @click.prevent="toggleHtmlMode"
              >
                <i class="pi pi-code" />
              </button>
            </span>
          </template>
        </Editor>
      </div>

      <!-- HTML Code Editor -->
      <div
        v-else
        class="html-editor-container !border !border-gray-200 rounded-md"
      >
        <div
          class="html-toolbar !border-b !border-gray-200 p-2 bg-gray-50 dark:bg-gray-800 rounded-t-md"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
              >HTML Source</span
            >
            <Button size="small" @click.prevent="toggleHtmlMode">
              <i class="pi pi-eye mr-1" />
              Visual
            </Button>
          </div>
        </div>
        <textarea
          v-model="content"
          :placeholder="placeholder"
          class="w-full min-h-[300px] p-4 bg-transparent border-none outline-none resize-none font-mono text-sm"
          @input="onHtmlInput"
        />
      </div>
    </ClientOnly>

    <input
      ref="fileInput"
      type="file"
      class="hidden"
      accept="image/*"
      @change="handleFileUpload"
    />
    <div v-if="uploading" class="loader-line -mt-[2px]" />

    <div class="my-2">
      <slot name="attachments" />
    </div>
    <div class="flex justify-end my-2">
      <slot name="actions" :uploading="uploading" />
    </div>
  </div>
</template>

<script setup>
import Editor from 'primevue/editor'
import Quill from 'quill'
import { usePageCrudStore } from '~/layers/page-builder/stores/page-crud'

if (import.meta.client) {
  // Register custom image blot to preserve styles
  const Image = Quill.import('formats/image')
  class CustomImage extends Image {
    static create(value) {
      let src = value
      let style = null
      if (typeof value === 'object' && value !== null) {
        src = value.src
        style = value.style
      }
      const node = super.create(src)
      if (style) {
        node.setAttribute('style', style)
      }
      return node
    }

    static value(node) {
      const src = node.getAttribute('src')
      const style = node.getAttribute('style')
      if (style) {
        return { src, style }
      }
      return src
    }
  }
  CustomImage.blotName = 'image'
  CustomImage.tagName = 'IMG'
  Quill.register(CustomImage, true)

  // Register custom break blot for better newline handling
  const Embed = Quill.import('blots/embed')
  class SmartBreak extends Embed {
    static create() {
      return document.createElement('br')
    }
    static value() {
      return true
    }
  }
  SmartBreak.blotName = 'break'
  SmartBreak.tagName = 'BR'
  Quill.register(SmartBreak, true)
}

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Start writing...',
  },
  attachments: {
    type: Array,
    default: () => [],
  },
  imageInput: {
    type: Boolean,
    default: true,
  },
  taskStyle: {
    type: Boolean,
    default: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  uploadEndpoint: {
    type: String,
    default: 'page-image',
  },
  maxFileSizeMB: {
    type: Number,
    default: 5,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'update:attachments',
  'upload-success',
  'upload-error',
])

const editorRef = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const htmlMode = ref(false)

// Upload composables

const { handleSuccess, handleErrors } = useGlobalStore()
const { uploadFile } = usePageCrudStore()

const pt = {
  content: props.taskStyle
    ? `text-sm min-h-[300px] !px-4 !border-none`
    : `min-h-[150px] !py-2 !px-1`,
  toolbar: '!border-t-0 !border-b !border-gray-200 !flex flex-wrap z-50',
}

const content = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

async function handleFileUpload(event) {
  const file = event.target?.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    handleErrors({ message: 'Please select an image file' })
    return
  }

  // Validate file size
  const fileSizeInMB = file.size / (1024 * 1024)
  if (fileSizeInMB > props.maxFileSizeMB) {
    handleErrors({
      message: `File size exceeds the maximum limit of ${props.maxFileSizeMB}MB`,
    })
    return
  }

  try {
    uploading.value = true
    uploadProgress.value = 0

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)

    // Upload configuration with progress tracking
    const axiosConfig = {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      },
    }

    // Upload file
    const response = await uploadFile({
      file: formData,
      url: props.uploadEndpoint,
      config: axiosConfig,
    })

    const fileUrl = response?.data
    // Access Quill instance robustly
    let quill = null
    if (editorRef.value) {
      if (typeof editorRef.value.getQuill === 'function') {
        quill = editorRef.value.getQuill()
      } else if (editorRef.value.quill) {
        quill = editorRef.value.quill
      } else {
        // Fallback to finding by DOM
        const editorEl = editorRef.value.$el
          ? editorRef.value.$el.querySelector('.ql-container')
          : null
        if (editorEl) {
          quill = Quill.find(editorEl)
        }
      }
    }

    if (fileUrl && quill) {
      const range = quill.getSelection(true)
      const index = range ? range.index : 0

      // Use the custom blot structure
      quill.insertEmbed(
        index,
        'image',
        {
          src: fileUrl,
          style:
            'max-width: 95%; height: auto; border-radius: 12px; margin: 10px 6px; display: block;',
        },
        'user'
      )
      quill.setSelection(index + 1, 'silent')

      const newAttachments = [
        ...props.attachments,
        { fileUrl, fileName: file.name },
      ]
      emit('update:attachments', newAttachments)
      emit('upload-success', { fileUrl, fileName: file.name })

      handleSuccess({
        message: `Image uploaded and inserted successfully. URL: ${fileUrl}`,
      })
    } else if (!fileUrl) {
      handleErrors({ message: 'Upload completed but no file URL received' })
    }
  } catch (error) {
    console.error('Upload error:', error)
    handleErrors({ message: 'Failed to upload image' })

    // Recovery: if editor exists, ensure we still have current content
    const editor = editorRef.value?.$el?.querySelector('.ql-editor')
    if (editor) {
      emit('update:modelValue', editor.innerHTML)
    }

    emit('upload-error', error)
  } finally {
    event.target.value = ''
    uploading.value = false
    uploadProgress.value = 0
  }
}

function triggerFileInput(event) {
  event.preventDefault()
  fileInput.value.click()
}

async function handlePaste(e) {
  const items = Array.from(e.clipboardData.items)
  const imageItem = items.find((item) => item.type.startsWith('image/'))

  if (imageItem) {
    e.preventDefault()
    e.stopPropagation()
    try {
      uploading.value = true
      const file = imageItem.getAsFile()

      // Create a fake event object for handleFileUpload
      const fakeEvent = {
        target: {
          files: [file],
          value: '',
        },
      }

      await handleFileUpload(fakeEvent)
    } catch (error) {
      console.error('Paste error:', error)
      handleErrors({ message: 'Failed to upload pasted image' })
    } finally {
      uploading.value = false
    }
  }
}

const editorModules = computed(() => {
  return {
    clipboard: {
      matchVisual: false,
    },
    keyboard: {
      bindings: {
        // Handle Enter key to insert a <br> instead of a new paragraph
        linebreak: {
          key: 'Enter',
          handler: function (range, _context) {
            this.quill.insertEmbed(range.index, 'break', true, 'user')
            this.quill.setSelection(range.index + 1, 'silent')
            return false // Interrupt default Enter behavior
          },
        },
        // Also handle Shift+Enter just in case
        shift_linebreak: {
          key: 'Enter',
          shiftKey: true,
          handler: function (range, _context) {
            this.quill.insertEmbed(range.index, 'break', true, 'user')
            this.quill.setSelection(range.index + 1, 'silent')
            return false
          },
        },
      },
    },
  }
})

function toggleHtmlMode() {
  htmlMode.value = !htmlMode.value
}

function onHtmlInput(_event) {
  // Handle HTML input event - content is automatically synced via v-model
}
</script>

<style>
.p-editor span {
  @apply dark:!text-gray-200;
}
.p-editor .p-editor-content .ql-editor {
  @apply !bg-transparent min-h-[150px];
}

.ql-editor {
  padding: 16px 0 !important;
  min-height: 150px;
}

.ql-editor ol li[data-list='bullet']::before {
  content: '\2022';
}

.qnstl .ql-editor.ql-blank::before {
  inset-inline-start: 20px !important;
  font-size: 16px !important;
}

/* Ensure images are properly contained and visible */
:deep(.ql-editor img) {
  max-width: 100% !important;
  height: auto !important;
  object-fit: cover !important;
  object-position: center !important;
  display: block;
  margin: 10px 6px !important;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Fix dropdown overflow and make them open upwards */
:deep(.ql-toolbar) {
  overflow: visible !important;
  position: relative;
}

:deep(.ql-picker-options) {
  top: auto !important;
  bottom: 100% !important;
  margin-bottom: 2px !important;
  z-index: 1000 !important;
  background: white !important;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1) !important;
  border-radius: 4px !important;
}

/* Specific fix for alignment picker which sometimes behaves differently */
:deep(.ql-picker.ql-align .ql-picker-options) {
  width: auto !important;
  min-width: 40px;
}

/* HTML Toggle Button Styles */
.html-toggle-btn {
  @apply transition-colors duration-200;
}

.html-toggle-btn.active {
  @apply bg-blue-500 text-white;
}

.html-toggle-btn:hover {
  @apply bg-gray-100 dark:bg-gray-700;
}

.html-toggle-btn.active:hover {
  @apply bg-blue-600;
}

/* HTML Editor Styles */
.html-editor-container {
  @apply bg-white dark:bg-gray-900;
}

.html-editor-container textarea {
  @apply text-gray-800 dark:text-gray-200;
  @apply bg-white dark:bg-gray-900;
  line-height: 1.5;
}

.html-editor-container textarea:focus {
  @apply outline-none;
}

/* Syntax highlighting hint for HTML in textarea */
.html-editor-container textarea::placeholder {
  @apply text-gray-400 dark:text-gray-500;
}

/* Loader line animation */
.loader-line {
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* custom scrollbar for toolbar */
.ql-toolbar-scroll {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.ql-toolbar-scroll::-webkit-scrollbar {
  height: 4px;
}

.ql-toolbar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.ql-toolbar-scroll::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

/* Ensure toolbar inner elements stay on one line */
.ql-toolbar-scroll .ql-formats {
  @apply !flex !items-center !flex-shrink-0;
}
</style>
