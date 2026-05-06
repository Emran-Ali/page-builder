<script setup lang="ts">
import BookAppointment from "@components/views/OfflineLesson/BookAppointment.vue";
import {useSavedTeacher} from "@pinia/student-store/saved-teacher";
import OfflineCourseCardList from "./OfflineCourseCardList.vue";
import OfflineCourseCardSkeletons from "./OfflineCourseCardSkeletons.vue";
import OfflineLessonFilter from "./OfflineLessonFilter.vue";
import SelectZip from "./SelectZip.vue";

defineProps({
  initialArea: {
    type: String,
    default: "California",
  },
});

const showSubmitForm = ref(false);

const isZipAvailable = ref(false);
const selectedZipCodes = ref<string[]>([]);
const selectedArea = ref("");
const selectedTeacher = ref<number | null>(null);
const selectedLesson = ref<number | null>(null);

const route = useRoute();
const router = useRouter();
const commonStore = useCommonStore();
const lessonStore = useLessonStore();
const {is} = useGlobalStore();
const authStore = useAuthStore();
const offlineStore = useOfflineAvailabilityStore();
const saveTeacherStore = useSavedTeacher();

const disciplines = computed(() => commonStore.disciplines);
const lessons = computed(() => lessonStore.getOfflineLessons);
const hasLessons = computed(() => lessons.value && lessons.value.length > 0);
const studentProfileId = computed(() => authStore.getStudentProfileId);

const pagination = computed(() => {
  const metaData = (lessonStore.getMeta as Record<string, any>) || {};
  return {
    currentPage: metaData.currentPage || 1,
    totalPages: metaData.totalPages || 1,
    hasNextPage: metaData.hasNextPage || false,
    hasPreviousPage: metaData.hasPreviousPage || false,
  };
});

const handleFilterChange = (queryParams: any) => {
  const {type, ...rest} = queryParams;

  lessonStore.fetchOfflineLessons({
    page: 1,
    limit: 5,
    area: selectedArea.value,
    zipCodes: selectedZipCodes.value,
    ...rest,
  });
};

const handlePageChange = (page: any) => {
  if (page === pagination.value.currentPage) return;
  const queryParams = {...route.query, page: page};
  router.replace({
    query: queryParams,
  });
  lessonStore.fetchOfflineLessons({
    limit: 5,
    area: selectedArea.value,
    zipCodes: selectedZipCodes.value,
    ...queryParams,
  });
};

const searchTutor = async (area: string, zipCodes: string[]) => {
  if (zipCodes.length > 0) {
    isZipAvailable.value = true;
    selectedArea.value = area;
    selectedZipCodes.value = zipCodes;
    console.log("selected zipcode: ", selectedZipCodes.value, area, zipCodes);

    lessonStore.fetchOfflineLessons({
      area: selectedArea.value,
      zipCodes: selectedZipCodes.value,
      limit: 5,
      page: 1,
    });
  } else {
    isZipAvailable.value = false;
  }
};

const bookTeacher = (teacherId?: number | Event, lessonId?: number) => {
  if (typeof teacherId === "number") {
    selectedTeacher.value = teacherId;
  } else {
    selectedTeacher.value = null;
  }
  selectedLesson.value = lessonId || null;
  showSubmitForm.value = true;
};

const handleSubmitBooking = async (
  contactNumber: string,
  message: string,
  email: string,
  name: string,
  disciplines: string[],
) => {
  const data = {
    area: selectedArea.value,
    zipCodes: selectedZipCodes.value,
    teacherId: selectedTeacher.value || undefined,
    lessonId: selectedLesson.value || undefined,
    contactNumber,
    message,
    email,
    name,
    disciplines,
    studentId: studentProfileId.value || null,
  };

  console.log("data", data);
  try {
    await offlineStore.bookAppointment(data);
    showSubmitForm.value = false;
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await commonStore.fetchAllDisciplines();
  if (studentProfileId.value) {
    await saveTeacherStore.fetchFavouriteTeachers();
  }
});
</script>

<template>
  <SelectZip :initial-area="initialArea" @on-search="searchTutor" />

  <div>
    <OfflineLessonFilter
      v-if="isZipAvailable"
      :discipline-options="disciplines"
      @filter-change="handleFilterChange"
    />

    <!--  Course Cards  -->
    <div>
      <OfflineCourseCardSkeletons v-if="is('fetchOfflineLessons')" :count="3" />
      <template v-else>
        <OfflineCourseCardList
          v-if="hasLessons && isZipAvailable"
          :courses="lessons"
          @on-book="bookTeacher"
        />
        <div
          v-if="isZipAvailable && !hasLessons"
          class="bg-white dark:bg-surface-card rounded-lg border p-8 mt-4 w-full"
        >
          <div
            class="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <div
              class="flex flex-col md:flex-row gap-4 items-center justify-between"
            >
              <i
                class="pi pi-comments text-4xl text-gray-400 dark:text-gray-600 mb-4"
              />
              <div class="flex flex-col">
                <h3
                  class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1"
                >
                  Get in touch
                </h3>

                <p class="text-gray-600 dark:text-gray-400 paragraph">
                  Looks like we don't have a teacher offering in this area.
                </p>
              </div>
            </div>
            <Button
              label="Submit Query"
              severity="primary"
              size="small"
              @click="bookTeacher"
            />
          </div>
        </div>
      </template>
    </div>

    <div v-if="hasLessons">
      <SharedPagination
        :current-page="pagination.currentPage"
        :total-pages="pagination.totalPages"
        :has-next-page="pagination.hasNextPage"
        :has-previous-page="pagination.hasPreviousPage"
        @page-change="handlePageChange"
      />
    </div>
  </div>

  <Dialog
    v-model:visible="showSubmitForm"
    modal
    header="Submit In-person Lesson Query"
    :style="{width: '40rem'}"
  >
    <BookAppointment @book-appointment="handleSubmitBooking" />
  </Dialog>
</template>
