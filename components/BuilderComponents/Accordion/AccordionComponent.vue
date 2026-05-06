<script setup>
import { computed } from 'vue'
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'
import {
  headingClassMap,
  paragraphBaseClass,
} from '../../../utils/headingClasses'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  sectionTitle: {
    type: String,
    default: 'Accordion Title',
  },
  sectionTitleTag: {
    type: String,
    default: 'h2',
  },
  sectionDescription: {
    type: String,
    default:
      'This is your paragraph text. You can customize the content through the properties panel.',
  },
  value: {
    type: [String, Array, Number],
    default: 0,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  panels: {
    type: Array,
    default: () => [
      {
        header: 'Header I',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      },
      {
        header: 'Header II',
        content:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.',
      },
      {
        header: 'Header III',
        content:
          'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.',
      },
    ],
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:props'])

const hasSectionTitle = computed(
  () => props.sectionTitle && props.sectionTitle.trim().length > 0
)
const hasSectionDescription = computed(
  () => props.sectionDescription && props.sectionDescription.trim().length > 0
)

const sectionHeadingClass = computed(
  () => headingClassMap[props.sectionTitleTag] || headingClassMap.h2
)

const getParagraphs = (text) => {
  if (!text) return []
  return text
    .split('\n')
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

const normalizedValue = computed(() => {
  if (props.multiple) {
    if (!props.value) return []
    if (Array.isArray(props.value)) return props.value.map((v) => String(v))
    return [String(props.value)]
  }
  const v = Array.isArray(props.value) ? props.value[0] : props.value
  if (v === null || v === undefined || v === '') return null
  return String(v)
})

const handleAccordionChange = (val) => {
  emit('update:props', { value: val })
}
</script>

<template>
  <div
    :data-component-id="id"
    class="w-full"
    :class="{
      'relative border-2 border-dashed border-blue-500 rounded-md p-3 opacity-75':
        isEditing,
    }"
  >
    <div class="">
      <component
        :is="sectionTitleTag"
        v-if="hasSectionTitle || isEditing"
        class="outline-none"
        :class="[
          sectionHeadingClass,
          {
            'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
              isEditing,
            'border-blue-500': isEditing && document.activeElement === $el,
            'text-gray-400 italic': isEditing && !hasSectionTitle,
            'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
          },
        ]"
        :contenteditable="isEditing"
        @blur="emit('update:props', { sectionTitle: $event.target.innerText })"
      >
        {{ sectionTitle || (isEditing ? 'Enter section title...' : '') }}
      </component>

      <div
        v-if="hasSectionDescription || isEditing"
        class="text-base text-gray-600 outline-none"
      :class="{
          'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
            isEditing,
          'border-blue-500': isEditing && document.activeElement === $el,
          'text-gray-400 italic': isEditing && !hasSectionDescription,
          'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
      }"
        :contenteditable="isEditing"
        @blur="
          emit('update:props', { sectionDescription: $event.target.innerText })
        "
      >
        <template v-if="sectionDescription">
          <p
            v-for="(para, idx) in getParagraphs(sectionDescription)"
            :key="idx"
            :class="paragraphBaseClass"
          >
            {{ para }}
          </p>
        </template>
        <p v-else class="text-gray-400 italic">
          {{ isEditing ? 'Enter a short description for this section...' : '' }}
        </p>
      </div>
    </div>

    <Accordion
      v-if="panels && panels.length"
      class="space-y-3"
      :multiple="multiple"
      :value="normalizedValue"
      :disabled="isEditing"
      @update:value="handleAccordionChange"
    >
      <AccordionPanel
        v-for="(panel, index) in panels"
        :key="index"
        :value="String(index)"
        :pt="{
          root: '!border !rounded-lg !overflow-hidden !text-sm',
        }"
      >
        <AccordionHeader
          :pt="{
            root:
              '!mb-0 !py-3 !px-4 !bg-white !text-[#222222] ' +
              (headingClassMap.h4 || ''),
          }"
        >
          {{ panel.header || `Header ${index + 1}` }}
        </AccordionHeader>
        <AccordionContent
          :pt="{
            content: '!text-sm !text-[#585D69] !bg-white !px-4 !pb-4',
          }"
      >
          <p :class="paragraphBaseClass">
            {{ panel.content || 'Description goes here.' }}
          </p>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <div
      v-else
      class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 italic"
    >
      No panels configured. Add panels in the properties panel.
    </div>
  </div>
</template>
