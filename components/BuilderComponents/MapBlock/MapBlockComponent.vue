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
  mapSrc: {
    type: String,
    default: '',
  },
  mapTitle: {
    type: String,
    default: 'Location map',
  },
  buttons: {
    type: Array,
    default: () => [],
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:props'])

const hasTitle = computed(() => props.title && props.title.trim().length > 0)
const hasParagraph = computed(
  () => props.paragraph && props.paragraph.trim().length > 0
)
const hasMap = computed(() => props.mapSrc && props.mapSrc.trim().length > 0)
const hasButtons = computed(() => props.buttons && props.buttons.length > 0)

const headingClass = computed(
  () => headingClassMap[props.titleTag] || headingClassMap.h2
)

const getParagraphs = (text) => {
  if (!text) return []
  return text
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

const updateTitle = (event) => {
  emit('update:props', { title: event.target.innerText })
}

const updateParagraph = (event) => {
  emit('update:props', { paragraph: event.target.innerText })
}

const getButtonHoverClasses = (button) => {
  const variant = button.variant || 'filled'
  if (variant === 'filled') return 'hover:brightness-95'
  if (variant === 'outlined')
    return 'hover:!text-black hover:!ring-1 hover:!ring-black'
  return 'hover:underline hover:!text-black'
}

const handleButtonClick = (button) => {
  if (props.isEditing) return
  if (button.link) {
    window.location.href = button.link
  }
}
</script>

<template>
  <div :data-component-id="id" class="w-full box-border">
    <div class="flex flex-col">
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

      <!-- Map -->
      <div class="w-full mb-6">
        <div
          v-if="hasMap"
          class="w-full aspect-video rounded-2xl overflow-hidden"
        >
          <iframe
            :src="mapSrc"
            :title="mapTitle || 'Location map'"
            class="w-full h-full border-0"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
        <div
          v-else-if="isEditing"
          class="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl min-h-[220px] text-gray-500 italic"
        >
          <p>No map configured</p>
        </div>
      </div>

      <!-- Buttons -->
      <div
        v-if="hasButtons || isEditing"
        class="flex flex-wrap gap-3"
        :class="{ 'pointer-events-none opacity-75': isEditing }"
      >
        <Button
          v-for="(button, index) in buttons"
          :key="index"
          :label="button.label || 'Button'"
          :severity="button.severity || 'primary'"
          :variant="button.variant || 'filled'"
          :disabled="isEditing"
          size="small"
          rounded
          class="!px-4"
          :class="getButtonHoverClasses(button)"
          @click="handleButtonClick(button)"
        />

        <div
          v-if="isEditing && buttons.length === 0"
          class="px-4 py-2 border-2 border-dashed border-gray-300 rounded text-gray-400 italic text-center bg-gray-50"
        >
          No buttons configured
        </div>
      </div>
    </div>
  </div>
</template>
