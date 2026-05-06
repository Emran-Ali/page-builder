<script setup lang="ts">
import RatingEmptyStar from '~/components/base/icons/RatingEmptyStarIcon.vue'
import RatingFullStar from '~/components/base/icons/RatingFullStarIcon.vue'
import RatingHalfStar from '~/components/base/icons/RatingHalfStarIcon.vue'
import { usePageBuilderStore } from '~/layers/page-builder/stores/pageBuilder'

const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const authStore = useAuthStore()
const savedTeacherStore = useSavedTeacher()
const { is } = useGlobalStore()

const studentId = computed(() => {
  return authStore.getStudentProfileId
})

const emit = defineEmits<{
  (e: 'book', teacherSlug: string): void
}>()

function handleBook() {
  if (!isPreview.value) return
  emit('book', props.course?.teacher?.slug)
}

const saveTeacherIds = computed(() => savedTeacherStore.getFavouriteTeacherIds)

const isSaved = computed(() => {
  return (
    saveTeacherIds.value?.some(
      (item: number) => item == props.course?.teacherId
    ) ?? false
  )
})

// Education computed properties
const displayedEducations = computed(() =>
  (props.course?.teacher?.education || []).slice(0, 4)
)

const hasMoreEducations = computed(
  () => (props.course?.teacher?.education || []).length > 4
)

const remainingEducations = computed(() =>
  (props.course?.teacher?.education || []).slice(4)
)

const remainingEducationNames = computed(() =>
  remainingEducations.value.map((item) => item.degree).join(', ')
)

// Background colors for education items
const educationColors = [
  '#F7F3D1', // Light yellow
  '#D1E9F7', // Light blue
  '#E8F5E8', // Light green
  '#F5E8F5', // Light purple
]

const displayedDisciplines = computed(() =>
  (props.course?.teacher?.teacherDisciplines || []).slice(0, 4)
)

const hasMoreDisciplines = computed(
  () => (props.course?.teacher?.teacherDisciplines || []).length > 4
)

const remainingDisciplines = computed(() =>
  (props.course?.teacher?.teacherDisciplines || []).slice(4)
)

const remainingDisciplineNames = computed(() =>
  remainingDisciplines.value.map((item) => item?.discipline?.name).join(', ')
)

const store = usePageBuilderStore()
const isPreview = computed(() => store.isPreview)

const handleAddRemove = async (teacherId: number) => {
  if (!isPreview.value) return
  try {
    if (!studentId.value) {
      const route = useRoute()
      const fullPath = route.fullPath
      return await navigateTo(`/login?redirect=${encodeURIComponent(fullPath)}`)
    }

    if (!isSaved.value) {
      await savedTeacherStore.addFavouriteTeacher(teacherId)
    } else {
      await savedTeacherStore.removeFavouriteTeacher(teacherId)
    }
  } catch (error) {
    console.log(error)
  }
}
const handleTeacherNameClick = (slug: string) => {
  if (!isPreview.value) return

  if (!slug) return

  navigateTo(`/teacher-profile/${slug}`)
}
</script>

<template>
  <div
    class="p-5 w-full border rounded-lg bg-white dark:bg-surface-card dark:text-primary-50 cursor-pointer transition-all duration-300 ease-in-out"
  >
    <div
      class="flex gap-3 items-start max-sm:flex-col pb-4"
      @click="handleTeacherNameClick(course?.teacher?.slug)"
    >
      <div class="flex justify-between flex-row sm:hidden gap-2">
        <div
          class="w-[180px] block sm:hidden max-lg:w-[100px] h-[180px] max-lg:h-[100px] max-lg:min-w-[100px] min-w-[150px] aspect-square overflow-hidden rounded-md center"
        >
          <img
            :src="getImageVersions(course?.teacher?.avatarUrl).thumb"
            alt="course image"
            class="w-full h-full object-cover"
          />
        </div>

        <div>
          <div class="flex sm:hidden items-center gap-2 flex-wrap">
            <h2 class="title">
              {{
                course?.teacher?.firstName +
                ' ' +
                course?.teacher?.lastName[0] +
                '.'
              }}
            </h2>
            <BaseGlobalIcon class="text-blue-500" component-name="BadgeIcon" />
          </div>
          <div class="flex sm:hidden items-center my-3 flex-wrap">
            <div
              v-if="course?.studentCount > 0"
              class="flex items-center gap-2"
            >
              <BaseGlobalIcon component-name="DocBadgeIcon" />

              <p class="paragraph_secondary">
                {{ course?.studentCount }} Students
              </p>
            </div>

            <Divider
              v-if="course?.studentCount > 0"
              class="h-4"
              layout="vertical"
            />

            <div
              v-if="course.totalRatingCount > 0"
              class="flex items-center gap-2"
            >
              <p class="paragraph">{{ course.rating }}</p>
              <div class="flex items-center gap-1 text-surface-color pb-0.5">
                <template v-for="i in 5" :key="i">
                  <RatingFullStar
                    v-if="i <= Math.floor(Number(course?.rating))"
                  />
                  <RatingHalfStar
                    v-else-if="i - 0.5 <= Number(course?.rating)"
                  />
                  <RatingEmptyStar v-else />
                </template>
              </div>
              <p class="paragraph">({{ course?.totalRatingCount }})</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="mr-2 w-[160px] max-lg:w-[100px] h-[160px] max-lg:h-[100px] max-lg:min-w-[100px] min-w-[150px] aspect-square overflow-hidden rounded-md center hidden sm:block"
      >
        <img
          :src="getImageVersions(course?.teacher?.avatarUrl).thumb"
          alt="course image"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="w-full flex justify-between items-start">
        <div>
          <div class="hidden sm:flex items-center gap-2 flex-wrap">
            <h2 class="title">
              {{
                course?.teacher?.firstName +
                ' ' +
                course?.teacher?.lastName[0] +
                '.'
              }}
            </h2>
            <BaseGlobalIcon class="text-blue-500" component-name="BadgeIcon" />
          </div>

          <div class="hidden sm:flex items-center my-3 flex-wrap">
            <div
              v-if="course?.studentCount > 0"
              class="flex items-center gap-2"
            >
              <BaseGlobalIcon component-name="DocBadgeIcon" />

              <p class="paragraph_secondary">
                {{ course?.studentCount || 0 }} Students
              </p>
            </div>

            <Divider
              v-if="course?.studentCount > 0"
              class="h-6"
              layout="vertical"
            />

            <div
              v-if="course?.totalRatingCount > 0"
              class="flex items-center gap-2"
            >
              <p class="paragraph">{{ course.rating }}</p>
              <div class="flex items-center gap-1 text-surface-color pb-0.5">
                <template v-for="i in 5" :key="i">
                  <RatingFullStar
                    v-if="i <= Math.floor(Number(course?.rating))"
                  />
                  <RatingHalfStar
                    v-else-if="i - 0.5 <= Number(course?.rating)"
                  />
                  <RatingEmptyStar v-else />
                </template>
              </div>
              <p class="paragraph">({{ course?.totalRatingCount }})</p>
            </div>
          </div>

          <div
            v-if="props.course?.teacher?.education"
            class="my-1.5 flex flex-wrap gap-2"
          >
            <span
              v-for="(education, index) in displayedEducations"
              :key="education?.id"
              class="w-fit flex items-center gap-1 text-xs sm:text-sm text-black rounded-sm px-2 py-1"
              :style="{ backgroundColor: educationColors[index] }"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.625L1.90625 9.5L2.72656 5.98438L0.0078125 3.61719L3.59375 3.3125L5 0.0078125L6.40625 3.3125L9.99219 3.61719L7.27344 5.98438L8.09375 9.5L5 7.625Z"
                  fill="black"
                />
              </svg>
              {{ education?.degree }}
            </span>

            <span
              v-if="hasMoreEducations"
              v-tooltip.top="{
                value: remainingEducationNames,
                pt: {
                  arrow: {
                    style: {
                      borderBottomColor: 'var(--p-primary-color)',
                    },
                  },
                  text: '!bg-primary !font-normal !text-sm !text-white',
                },
              }"
              class="w-fit flex items-center gap-1 text-xs sm:text-sm text-black bg-[#F5F5F4] rounded-sm px-2 py-1 cursor-pointer hover:bg-[#E5E5E5] transition-colors"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.625L1.90625 9.5L2.72656 5.98438L0.0078125 3.61719L3.59375 3.3125L5 0.0078125L6.40625 3.3125L9.99219 3.61719L7.27344 5.98438L8.09375 9.5L5 7.625Z"
                  fill="black"
                />
              </svg>
              +{{ remainingEducations.length }}
            </span>
          </div>
          <!-- 
          <div class="flex flex-wrap gap-2">
            <p
              v-for="discipline in course?.teacher?.teacherDisciplines"
              :key="discipline.id"
              class="w-fit flex items-center gap-1 text-xs sm:text-sm text-black bg-[#F5F5F4] rounded-md px-2 py-1"
            >
              <img
                :src="discipline.discipline.logo"
                alt="logo"
                class="h-4 w-5"
              />
              <span> {{ discipline.discipline.name }}</span>
            </p>
          </div> -->
          <p
            class="paragraph_secondary mt-1.5 max-w-[485px] flex flex-wrap gap-2"
          >
            <span
              v-for="discipline in displayedDisciplines"
              :key="discipline?.id"
              class="w-fit flex items-center gap-1 text-xs sm:text-sm text-black bg-[#F5F5F4] rounded-sm px-2 py-1"
            >
              <svg
                width="7"
                height="11"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 0.499756H6V2.49194H4.00781V7.50757C4.00781 8.05444 3.80469 8.52319 3.39844 8.91382C3.00781 9.30444 2.53906 9.49976 1.99219 9.49976C1.44531 9.49976 0.976562 9.30444 0.585938 8.91382C0.195312 8.52319 0 8.05444 0 7.50757C0 6.96069 0.195312 6.49194 0.585938 6.10132C0.976562 5.69507 1.44531 5.49194 1.99219 5.49194C2.32031 5.49194 2.65625 5.58569 3 5.77319V0.499756Z"
                  fill="black"
                />
              </svg>

              {{ discipline?.discipline?.name }}
            </span>

            <span
              v-if="hasMoreDisciplines"
              v-tooltip.top="{
                value: remainingDisciplineNames,
                pt: {
                  arrow: {
                    style: {
                      borderBottomColor: 'var(--p-primary-color)',
                    },
                  },
                  text: '!bg-primary !font-normal !text-sm !text-white',
                },
              }"
              class="w-fit flex items-center gap-1 text-xs sm:text-sm text-black bg-[#F5F5F4] rounded-sm px-2 py-1 cursor-pointer hover:bg-[#E5E5E5] transition-colors"
            >
              <svg
                width="7"
                height="11"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 0.499756H6V2.49194H4.00781V7.50757C4.00781 8.05444 3.80469 8.52319 3.39844 8.91382C3.00781 9.30444 2.53906 9.49976 1.99219 9.49976C1.44531 9.49976 0.976562 9.30444 0.585938 8.91382C0.195312 8.52319 0 8.05444 0 7.50757C0 6.96069 0.195312 6.49194 0.585938 6.10132C0.976562 5.69507 1.44531 5.49194 1.99219 5.49194C2.32031 5.49194 2.65625 5.58569 3 5.77319V0.499756Z"
                  fill="black"
                />
              </svg>

              +{{ remainingDisciplines.length }}
            </span>
          </p>

          <p class="paragraph_secondary max-w-[485px] mt-4">
            {{
              course?.teacher?.profileSummary
                ?.split(' ')
                .slice(0, 15)
                .join(' ')
            }}<span
              v-if="course?.teacher?.profileSummary?.split(' ').length > 15"
              >...</span
            >
          </p>
        </div>
        <div class="hidden sm:block mt-2">
          <div class="flex items-start">
            <Button
              v-if="isSaved"
              icon="pi pi-heart"
              severity="secondary"
              rounded
              :disabled="
                is('removeFavouriteTeacher') || is('addFavouriteTeacher')
              "
              :class="[isSaved ? 'bg-pear/50' : '']"
              aria-label="Bookmark"
              @click="handleAddRemove(props.course?.teacherId)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row mt-4">
      <Button
        label="Book Appointment"
        size="small"
        class="w-full"
        @click="handleBook"
      />
      <Button
        size="small"
        variant="outlined"
        class="w-full"
        :disabled="is('removeFavouriteTeacher') || is('addFavouriteTeacher')"
        @click="handleAddRemove(props.course?.teacherId)"
      >
        {{ isSaved ? 'Remove from favorite' : 'Add to favorite' }}</Button
      >
    </div>
  </div>
</template>
