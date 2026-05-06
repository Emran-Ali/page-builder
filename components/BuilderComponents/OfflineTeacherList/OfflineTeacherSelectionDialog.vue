<script setup lang="ts">
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import {usePagination} from "@layers/page-builder/stores/pagination";
import {useTeacherListStore} from "@layers/page-builder/stores/teacher-list";
import type {TableColumn} from "@types/table.type";

import {useDebounceFn} from "@vueuse/core";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  filterDisciplines: {
    type: Array,
    default: () => [],
  },
  filterArea: {
    type: String,
    default: "",
  },
});

const columns: TableColumn[] = [
  {
    field: "avatarUrl",
    header: "",
    type: "image",
  },
  {
    field: "firstName",
    header: "Name",
    type: "text",
    sortable: true,
  },
  {
    field: "email",
    header: "Email",
    type: "text",
    sortable: true,
  },
  {
    field: "ratingCount",
    header: "Rating Count",
    type: "rating",
    class: "!pl-2",
    sortable: true,
    sortField: "rattingCount",
  },
  {
    field: "earning",
    header: "Earnings",
    type: "text",
    sortable: true,
  },
  {
    field: "totalStudents",
    header: "Students",
    type: "text",
    sortable: true,
    sortField: "totalStudent",
  },
  {
    field: "totalSubscribers",
    header: "Subscription",
    type: "text",
    sortable: true,
  },
];

const {is} = useGlobalStore();

const teacherStore = useTeacherListStore();
const paginationStore = usePagination();

// Local state for search, sort, and pagination (without URL updates)
const localSearchQuery = ref("");

const localSortField = ref<string | null>(null);
const localSortOrder = ref<"asc" | "desc" | null>(null);
const localCurrentPage = ref(1);

// Selection state management
const selectedTeacherIds = ref<Set<string | number>>(new Set());
const selectedTeachers = ref<Record<string, unknown>[]>([]);

// Computed properties
const teachers = computed(() => teacherStore.getTeachers);
const paginationMeta = computed(() => paginationStore.getPaginationMeta);

const emit = defineEmits(["update:visible", "select-teachers", "cancel"]);

const closeDialog = () => {
  // Reset local state when closing
  localSearchQuery.value = "";

  localSortField.value = null;
  localSortOrder.value = null;
  localCurrentPage.value = 1;
  selectedTeacherIds.value.clear();
  selectedTeachers.value = [];

  emit("update:visible", false);
  emit("cancel");
};

const selectTeachers = () => {
  console.log("Selected Teachers:", selectedTeachers.value);
  emit("select-teachers", selectedTeachers.value);
  emit("update:visible", false);
};

// Selection handlers
const handleTableSelection = (selectedRows: Record<string, unknown>[]) => {
  // Get current page teacher IDs
  const currentPageTeacherIds = new Set(
    (teachers.value as Record<string, unknown>[])?.map((t) => t.id) || [],
  );

  // Remove current page teachers from selectedTeacherIds first
  currentPageTeacherIds.forEach((id) => {
    if (id) selectedTeacherIds.value.delete(id as string | number);
  });

  // Add newly selected teachers from current page
  selectedRows.forEach((teacher) => {
    if (teacher.id) {
      selectedTeacherIds.value.add(teacher.id as string | number);
    }
  });

  // Update selectedTeachers array by syncing
  syncSelectedTeachers();
};

// Sync selected teachers when data changes (pagination, search, etc.)
const syncSelectedTeachers = () => {
  const teacherList = teachers.value as Record<string, unknown>[];
  if (teacherList && Array.isArray(teacherList)) {
    // Find teachers from current page that are selected
    const currentPageSelectedTeachers = teacherList.filter(
      (teacher) =>
        teacher.id &&
        selectedTeacherIds.value.has(teacher.id as string | number),
    );

    // Merge with existing selected teachers, avoiding duplicates
    const existingTeachers = selectedTeachers.value.filter(
      (existingTeacher) =>
        !teacherList.some(
          (currentTeacher) => currentTeacher.id === existingTeacher.id,
        ),
    );

    selectedTeachers.value = [
      ...existingTeachers,
      ...currentPageSelectedTeachers,
    ];
  }
};

// Local pagination handlers (without URL updates)
const handleGoNextPage = () => {
  if (paginationMeta.value?.hasNextPage) {
    localCurrentPage.value += 1;
    fetchTeachersWithLocalParams();
  }
};

const handleGoPreviousPage = () => {
  if (paginationMeta.value?.hasPreviousPage && localCurrentPage.value > 1) {
    localCurrentPage.value -= 1;
    fetchTeachersWithLocalParams();
  }
};

// Handle sorting from table (local sorting without URL update)
const handleSort = (field: string, order: "asc" | "desc" | null) => {
  localSortField.value = order ? field : null;
  localSortOrder.value = order;
  localCurrentPage.value = 1; // Reset to first page when sorting

  // Call the API with local search and sort parameters
  fetchTeachersWithLocalParams();

  console.log("Sorting by:", field, "Order:", order);
};

// Debounced search function
const debouncedSearch = useDebounceFn(() => {
  localCurrentPage.value = 1; // Reset to first page when searching
  fetchTeachersWithLocalParams();
}, 400);

// Handle search input (local search without URL update)
const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  localSearchQuery.value = target.value;

  // Call debounced search
  debouncedSearch();
};

// Clear search
const clearLocalSearch = () => {
  localSearchQuery.value = "";
  localCurrentPage.value = 1;
  fetchTeachersWithLocalParams();
};

// Fetch teachers with local parameters (without updating URL)
const fetchTeachersWithLocalParams = () => {
  // Build query parameters for API call
  const params = new URLSearchParams();

  // Always add status=APPROVED
  params.append("status", "APPROVED");
  params.append("isOffline", "true");

  if (localSearchQuery.value && localSearchQuery.value.length >= 2) {
    params.append("search", localSearchQuery.value);
  }

  if (localSortField.value && localSortOrder.value) {
    params.append("sortBy", localSortField.value);
    params.append("sortOrder", localSortOrder.value);
  }

  // Handle area filter
  if (props.filterArea) {
    params.append("area", props?.filterArea);
  }

  // Handle disciplineIds filter
  if (props.filterDisciplines && props.filterDisciplines.length > 0) {
    params.append("disciplineIds", props.filterDisciplines.join(","));
  }

  // Add pagination parameters
  params.append("page", localCurrentPage.value.toString());

  // Call the teacher store to fetch with these parameters
  teacherStore.fetchTeachers(params.toString());
};

// Watch for dialog visibility changes
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      // Reset local state when dialog opens
      localSearchQuery.value = "";

      localSortField.value = null;
      localSortOrder.value = null;
      localCurrentPage.value = 1;
      selectedTeacherIds.value.clear();
      selectedTeachers.value = [];

      // Fetch initial data
      fetchTeachersWithLocalParams();
    }
  },
);

// Watch for data changes to maintain selection sync
watch(teachers, () => {
  syncSelectedTeachers();
});

// Watch for filter changes to refetch if dialog is visible
watch(
  () => [props.filterArea, props.filterDisciplines],
  () => {
    if (props.visible) {
      localCurrentPage.value = 1;
      fetchTeachersWithLocalParams();
    }
  },
  {deep: true},
);

onMounted(() => {
  // Initial fetch if dialog is already visible
  if (props.visible) {
    fetchTeachersWithLocalParams();
  }
});
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    header="Select Teachers"
    :style="{width: '70rem', minHeight: '90vh'}"
    @update:visible="emit('update:visible', $event)"
  >
    <!-- Custom search input (not using global table search to avoid URL updates) -->
    <div class="mb-4 flex gap-4 items-center mt-4">
      <div class="relative flex-1">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <i class="pi pi-search text-gray-400 text-sm" />
        </div>
        <input
          :value="localSearchQuery"
          type="text"
          placeholder="Search teachers by name, email..."
          class="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:border-1 text-sm text-gray-700"
          @input="handleSearchInput"
        />
        <div
          v-if="localSearchQuery"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <button
            type="button"
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="clearLocalSearch"
          >
            <i class="pi pi-times text-sm" />
          </button>
        </div>
      </div>
    </div>

    <BaseDataTableGlobalTable
      :columns="columns"
      :data="teachers"
      :loading="is('teacherListStore')"
      :search="{enabled: false}"
      :disable-url-updates="true"
      :external-selected-ids="selectedTeacherIds"
      :total-selected-count="selectedTeachers.length"
      selection-mode="multiple"
      @sort="handleSort"
      @row:selection="handleTableSelection"
    />

    <div
      v-if="paginationMeta?.totalPages && paginationMeta?.totalPages > 1"
      class="flex items-center justify-between pt-6"
    >
      <p class="paragraph_secondary">
        Page {{ paginationMeta?.currentPage }} of
        {{ paginationMeta?.totalPages }}
      </p>

      <div class="flex items-center gap-4">
        <Button
          :disabled="!paginationMeta?.hasPreviousPage"
          class="btn_light"
          variant="outlined"
          size="small"
          @click.prevent="handleGoPreviousPage"
        >
          <BaseLucide name="ChevronLeft" />
          Previous
        </Button>
        <Button
          :disabled="!paginationMeta?.hasNextPage"
          class="btn_primary"
          variant="outlined"
          size="small"
          @click.prevent="handleGoNextPage"
          >Next
          <BaseLucide name="ChevronRight" />
        </Button>
      </div>
    </div>

    <!-- Selected Teachers Section -->
    <div v-if="selectedTeachers.length > 0" class="mt-6">
      <h3 class="text-lg font-semibold mb-4">
        Selected Teachers ({{ selectedTeachers.length }})
      </h3>
      <div class="grid grid-cols-1 gap-2">
        <div
          v-for="teacher in selectedTeachers"
          :key="teacher.id as string"
          class="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50"
        >
          <div class="flex items-center gap-3">
            <img
              v-if="teacher.avatarUrl"
              :src="teacher.avatarUrl as string"
              :alt="(teacher.firstName as string) || 'Teacher'"
              class="w-8 h-8 rounded-full object-cover"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center"
            >
              <i class="pi pi-user text-gray-600 text-sm" />
            </div>
            <div class="flex flex-col">
              <span class="font-medium"
                >{{ teacher.firstName }} {{ teacher.lastName }}</span
              >
              <span class="text-sm text-gray-500">{{ teacher.email }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-2 mt-6">
        <Button
          label="Cancel"
          size="small"
          severity="secondary"
          variant="outlined"
          @click="closeDialog"
        />
        <Button
          :label="
            selectedTeachers.length > 0
              ? `Select Teachers (${selectedTeachers.length})`
              : 'Select Teachers'
          "
          :disabled="selectedTeachers.length === 0"
          size="small"
          @click="selectTeachers"
        />
      </div>
    </div>
  </Dialog>
</template>
