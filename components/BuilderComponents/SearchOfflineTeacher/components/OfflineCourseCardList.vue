<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import OfflineCourseCardFluid from './OfflineCourseCardFluid.vue'

type Props = {
  courses: any[]
}

const emit = defineEmits<{
  (e: 'on-book', teacherId: number, lessonId: number): void
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

function handleBook(teacherId: number, lessonId: number) {
  emit('on-book', teacherId, lessonId)
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
            @book="handleBook"
          />
        </div>
      </div>
    </div>
  </div>
</template>
