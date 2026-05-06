<script setup lang="ts">
import {regions} from "public/regions";
import QueryOfflineTeacherForm from "@components/views/OfflineLesson/QueryOfflineTeacherForm.vue";
import {usePageBuilderStore} from "@layers/page-builder/stores/pageBuilder";
import {useSavedTeacher} from "@pinia/student-store/saved-teacher";
import OfflineCourseCardList from "./OfflineCourseCardList.vue";
import OfflineCourseCardSkeletons from "./OfflineCourseCardSkeletons.vue";

const props = defineProps({
  initialArea: {
    type: String,
    default: "California",
  },
  itemsPerPage: {
    type: Number,
    default: 5,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const selectedArea = ref(props?.initialArea);

const teacherSlug = ref("");
const showOfflineQueryForm = ref(false);

const lessonStore = useLessonStore();
const {is} = useGlobalStore();
const authStore = useAuthStore();
const saveTeacherStore = useSavedTeacher();
const store = usePageBuilderStore();
const isPreview = computed(() => store.isPreview);

const lessons = computed(() => lessonStore.getOfflineTeachers);
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

const handlePageChange = (page: any) => {
  if (page === pagination.value.currentPage) return;

  lessonStore.fetchOfflineTeachers({
    limit: props.itemsPerPage,
    area: selectedArea.value,
    page: page,
  });
};

const searchTutor = async () => {
  if (!selectedArea.value) return;

  lessonStore.fetchOfflineTeachers({
    area: selectedArea.value,
    page: 1,
    limit: props.itemsPerPage,
  });
};

const bookTeacher = (slug?: string) => {
  if (!isPreview.value) return;
  if (!slug) return;
  teacherSlug.value = slug;
  showOfflineQueryForm.value = true;
};

watch(
  () => props.initialArea,
  (newArea) => {
    selectedArea.value = newArea;
    searchTutor();
  },
);

watch(
  () => props.itemsPerPage,
  () => {
    searchTutor();
  },
);

onMounted(async () => {
  lessonStore.fetchOfflineTeachers({
    area: selectedArea.value,
    page: 1,
    limit: props.itemsPerPage,
  });
  if (studentProfileId.value) {
    await saveTeacherStore.fetchFavouriteTeachers();
  }
});
</script>

<template>
  <BaseContainer class="bg-white px-4 py-6 rounded-lg">
    <!-- Area and sub region -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <label class="block mb-2 font-semibold">Select Location</label>
        <Select
          v-model="selectedArea"
          :options="regions"
          option-label="area"
          option-value="value"
          placeholder="Select an Area"
          class="w-full"
          size="small"
        />
      </div>

      <div class="flex items-end">
        <Button
          severity="primary"
          :disabled="!selectedArea || is('fetchOfflineTeachers')"
          size="small"
          @click="searchTutor"
        >
          Search Teacher
        </Button>
      </div>
    </div>
  </BaseContainer>

  <div class="mt-6">
    <!--  Course Cards  -->
    <div>
      <OfflineCourseCardSkeletons
        v-if="is('fetchOfflineTeachers')"
        :count="2"
      />
      <template v-else>
        <OfflineCourseCardList
          v-if="hasLessons"
          :courses="lessons"
          :is-edit="isEdit"
          @on-book="bookTeacher"
        />
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

    <Dialog
      v-model:visible="showOfflineQueryForm"
      modal
      :block-scroll="true"
      header="Request In-person Lesson"
      :style="{width: '40rem', maxWidth: '95vw'}"
    >
      <QueryOfflineTeacherForm
        :teacher-slug="teacherSlug"
        @on-close="showOfflineQueryForm = false"
      />
    </Dialog>
  </div>
</template>
