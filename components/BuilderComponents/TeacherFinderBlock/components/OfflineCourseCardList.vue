<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import OfflineCourseCardFluid from './OfflineCourseCardFluid.vue'

type Props = {
  courses: any[]
  isEdit: boolean
}

const emit = defineEmits<{
  (e: 'on-book', teacherSlug: string): void
}>()

// Set default values
const props = defineProps<Props>()

// Component state
const activeCard = ref<number>(0)
const activeCardContent = ref<number>(0)
const cardRefs = ref<HTMLElement[]>([])

// Event Handlers
const handleOnMouseEnter = (index: number) => {
  activeCard.value = index
  activeCardContent.value = index
}

const setCardRef = (el: any, index: number) => {
  if (el) {
    cardRefs.value[index] = el
  }
}

function handleBook(teacherSlug: string) {
  emit('on-book', teacherSlug)
}
</script>

<template>
  <div class="flex flex-col">
    <div
      v-for="(course, index) in props.courses"
      :key="course.id"
      class="mb-4 last:mb-0"
    >
      <div class="flex flex-col lg:flex-row items-start">
        <div
          :ref="(el) => setCardRef(el, index)"
          class="w-full"
          @mouseenter="handleOnMouseEnter(index)"
        >
          <OfflineCourseCardFluid
            :class="[{ ' ring-1 ring-primary-500': activeCard === index }]"
            :course="course"
            :is-edit="isEdit"
            @book="handleBook"
          />
        </div>
      </div>
    </div>
  </div>
</template>
