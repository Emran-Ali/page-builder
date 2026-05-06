<script setup>
import { computed } from 'vue'
import {
  headingClassMap,
  paragraphBaseClass,
} from '../../../utils/headingClasses'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  titleTag: {
    type: String,
    default: 'h2',
  },
  paragraph: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
  listStyle: {
    type: String,
    default: 'disc',
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:props'])

// Computed properties
const hasTitle = computed(() => props.title && props.title.trim().length > 0)
const hasParagraph = computed(
  () => props.paragraph && props.paragraph.trim().length > 0
)
const hasItems = computed(() => props.items && props.items.length > 0)

// Split paragraph text into multiple paragraphs by newline
const getParagraphs = (text) => {
  if (!text) return []
  return text
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

// Update handlers
const updateTitle = (event) => {
  emit('update:props', { title: event.target.innerText })
}

const updateParagraph = (event) => {
  // Get all text content and preserve newlines
  const text = event.target.innerText || ''
  emit('update:props', { paragraph: text })
}

const updateItem = (index, event) => {
  if (!props.items[index]) return
  const updatedItems = [...props.items]
  updatedItems[index] = event.target.innerText
  emit('update:props', { items: updatedItems })
}

// Heading class helper
const titleHeadingClass = computed(
  () => headingClassMap[props.titleTag] || headingClassMap.h2
)

// Bullet color
const bulletColor = '#585D69'
</script>

<template>
  <div
    :data-component-id="id"
    class="w-full box-border"
    :class="{
      'border-2 border-dashed border-blue-300 rounded-lg p-4': isEditing,
    }"
  >
    <!-- Title -->
    <component
      :is="titleTag"
      v-if="hasTitle || isEditing"
      class="outline-none"
      :class="[
        titleHeadingClass,
        {
          'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
            isEditing,
          'border-blue-500': isEditing && document.activeElement === $el,
          'text-gray-400 italic': isEditing && !hasTitle,
          'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
        },
      ]"
      :contenteditable="isEditing"
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

    <!-- List -->
    <ul
      v-if="hasItems || isEditing"
      :class="{
        'border border-dashed border-gray-300 rounded p-4 min-h-[2em]':
          isEditing && !hasItems,
      }"
    >
      <li v-for="(item, index) in items" :key="index" class="flex items-start">
        <!-- SVG Bullet Point -->
        <template v-if="listStyle === 'disc'">
          <svg
            class="mt-1.5 h-3 w-3 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="14" height="14" rx="7" :fill="bulletColor" />
          </svg>
        </template>
        <template v-else-if="listStyle === 'square'">
          <svg
            class="mt-1.5 h-3 w-3 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="14" height="14" rx="2" :fill="bulletColor" />
          </svg>
        </template>
        <template v-else-if="listStyle === 'circle'">
          <svg
            class="mt-1.5 h-3 w-3 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="13"
              height="13"
              rx="6.5"
              :stroke="bulletColor"
            />
          </svg>
        </template>
        <template v-else-if="listStyle === 'decimal'">
          <span
            class="mt-1.5 h-3 w-3 shrink-0 text-sm font-medium flex items-center justify-center"
            :style="{ color: bulletColor }"
          >
            {{ index + 1 }}.
          </span>
        </template>
        <template v-else>
          <svg
            class="mt-1.5 h-3 w-3 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="14" height="14" rx="7" :fill="bulletColor" />
          </svg>
        </template>

        <!-- List Item Content -->
        <p
          class="ml-3 outline-none"
          :class="[
            paragraphBaseClass,
            '!mb-3',
            {
              'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                isEditing,
              'border-blue-500': isEditing && document.activeElement === $el,
              'text-gray-400 italic': isEditing && !item,
              'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50':
                isEditing,
            },
          ]"
          :contenteditable="isEditing"
          @blur="updateItem(index, $event)"
        >
          {{ item || (isEditing ? 'Enter list item...' : '') }}
        </p>
      </li>

      <!-- Empty state for editing -->
      <li v-if="isEditing && items.length === 0" class="flex items-start">
        <template v-if="listStyle === 'disc'">
          <svg
            class="mt-1.5 h-3 w-3 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="14" height="14" rx="7" :fill="bulletColor" />
          </svg>
        </template>
        <template v-else-if="listStyle === 'square'">
          <svg
            class="mt-1.5 h-3 w-3 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="14" height="14" rx="2" :fill="bulletColor" />
          </svg>
        </template>
        <template v-else-if="listStyle === 'circle'">
          <svg
            class="mt-1.5 h-3 w-3 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="13"
              height="13"
              rx="6.5"
              :stroke="bulletColor"
            />
          </svg>
        </template>
        <template v-else-if="listStyle === 'decimal'">
          <span
            class="mt-1.5 h-3 w-3 shrink-0 text-sm font-medium flex items-center justify-center"
            :style="{ color: bulletColor }"
          >
            1.
          </span>
        </template>
        <template v-else>
          <svg
            class="mt-1.5 h-3 w-3 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="14" height="14" rx="7" :fill="bulletColor" />
          </svg>
        </template>
        <p
          class="ml-3 outline-none text-gray-400 italic border border-dashed border-gray-300 min-h-[1em] p-1 rounded"
          :class="paragraphBaseClass"
          :contenteditable="isEditing"
          @blur="updateItem(0, $event)"
        >
          Enter list item...
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* No custom styles needed - using inline SVG and Tailwind classes */
</style>
