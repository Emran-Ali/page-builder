<script setup>
import { computed } from 'vue'
import {
  headingClassMap,
  paragraphBaseClass,
} from '../../../utils/headingClasses'
import OfflineTeacher from './components/OfflineTeacher.vue'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  // Title properties
  title: {
    type: String,
    default: '',
  },
  titleTag: {
    type: String,
    default: 'h2',
  },
  titleFontSize: {
    type: String,
    default: '32px',
  },
  titleFontWeight: {
    type: String,
    default: 'bold',
  },
  titleColor: {
    type: String,
    default: '#000000',
  },
  titleAlign: {
    type: String,
    default: 'left',
  },
  titleMarginBottom: {
    type: String,
    default: '16px',
  },

  // Paragraph properties
  paragraph: {
    type: String,
    default: '',
  },

  initialArea: {
    type: String,
    default: 'California',
  },

  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:props'])

// Helpers
const getParagraphs = (text) => {
  if (!text) return []
  return text
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

// Handle content updates
const updateTitle = (event) => {
  emit('update:props', { title: event.target.innerText })
}

const updateParagraph = (event) => {
  emit('update:props', { paragraph: event.target.innerText })
}

// Check if content exists
const hasTitle = computed(() => props.title && props.title.trim().length > 0)
const hasParagraph = computed(
  () => props.paragraph && props.paragraph.trim().length > 0
)

const headingClass = computed(
  () => headingClassMap[props.titleTag] || headingClassMap.h2
)
</script>

<template>
  <div :data-component-id="id" class="w-full box-border">
    <!-- Editing Mode Label -->
    <div
      v-if="isEditing"
      class="absolute -top-3 left-2 z-10 rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white"
    >
      Search Offline Teacher
    </div>
    <!-- Content Section -->
    <div class="content-section flex flex-col">
      <!-- Title -->
      <component
        :is="titleTag"
        v-if="hasTitle || isEditing"
        :contenteditable="isEditing"
        :class="[
          'outline-none',
          headingClass,
          {
            'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
              isEditing,
            'border-blue-500': isEditing && document.activeElement === $el,
            'text-gray-400 italic': isEditing && !hasTitle,
            'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
          },
        ]"
        @blur="updateTitle"
      >
        {{ title || (isEditing ? 'Enter title...' : '') }}
      </component>

      <!-- Paragraph -->
      <div
        v-if="hasParagraph || isEditing"
        class="outline-none"
        :class="{
          'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
            isEditing,
          'border-blue-500': isEditing && document.activeElement === $el,
          'text-gray-400 italic': isEditing && !hasParagraph,
          'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
        }"
        :contenteditable="isEditing"
        @blur="updateParagraph"
      >
        <template v-if="paragraph">
          <p
            v-for="(para, idx) in getParagraphs(paragraph)"
            :key="idx"
            :class="paragraphBaseClass"
          >
            {{ para }}
          </p>
        </template>
        <p v-else class="text-gray-400 italic">
          {{ isEditing ? 'Enter paragraph text...' : '' }}
        </p>
      </div>

      <!-- Search offline teacher -->

      <OfflineTeacher :initial-area="initialArea" />
    </div>
  </div>
</template>

<style scoped>
/* Responsive Design */
@media (max-width: 768px) {
}

/* Print Styles */
@media print {
  .editing-mode::before {
    display: none;
  }

  .editing-mode {
    border: none;
  }
}
</style>
