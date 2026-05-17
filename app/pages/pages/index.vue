<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-md mb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Pages</h1>
            <p class="text-gray-600 mt-1">Manage your pages</p>
          </div>
          <Button
            label="Create New Page"
            icon="pi pi-plus"
            to="/builder/new"
            class="bg-blue-600 text-white"
            :disabled="isLoading"
          />
        </div>
      </div>
    </div>

    <!-- Pages List -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div v-if="pages.length === 0 && !isLoading">
        <div class="bg-white rounded-lg shadow-md p-12 text-center">
          <p class="text-gray-500 text-lg mb-4">
            No pages yet. Create your first page!
          </p>
          <Button
            label="Create New Page"
            icon="pi pi-plus"
            to="/builder/new"
            class="bg-blue-600 text-white"
          />
        </div>
      </div>

      <div v-else-if="isLoading" class="text-center py-12">
        <Spinner />
      </div>

      <div v-else class="mt-6">
        <DataTable
          :value="pages"
          paginator
          :rows="pagination.perPage"
          :totalRecords="pagination.totalCount"
          :page-links="5"
          :current-page-report-template="'Showing {first} to {last} of {totalRecords} entries'"
          paginatorPosition="bottom"
          :lazy="true"
          @page="onPageChange"
          data-key="id"
        >
          <Column field="title" header="Title" :sortable="true" />
          <Column field="slug" header="Slug" :sortable="true" />
          <Column field="status" header="Status" :sortable="true" />
          <Column field="author.username" header="Author" :sortable="true" />
          <Column field="createdAt" header="Created At" :sortable="true" />
          <Column
            field="actions"
            header="Actions"
            :sortable="false"
            :style="{width: '150px'}"
          >
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button
                  type="button"
                  icon="pi pi-pencil"
                  class="p-2 mr-2"
                  @click="showEditDialog(slotProps.data.id)"
                  :disabled="isLoading"
                />
                <Button
                  type="button"
                  icon="pi pi-trash"
                  class="p-2 text-red-500"
                  label="Delete"
                  @click="confirmDelete(slotProps.data.id)"
                  :disabled="isLoading"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Add/Edit Dialog -->
    <Dialog
      ref="addEditDialog"
      :header="editMode ? 'Edit Page' : 'Add New Page'"
      :visible="dialogVisible"
      :modal="true"
      :style="{width: '90vw', maxWidth: '700px'}"
      @hide="onDialogHide"
    >
      <AddEditPage
        :isEdit="editMode"
        :pageId="editPageId"
        @success="onDialogSuccess"
        @cancel="onDialogCancel"
      />
    </Dialog>
    <BaseConfirmationDialog ref="confirmDialogComponentRef" />
  </div>
</template>

<script setup lang="ts">
import {ref, computed, Ref} from "vue";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import AddEditPage from "../../../components/Shared/AddEditPage.vue";
import BaseConfirmationDialog from "../../../components/Shared/BaseConfirmationDialog.vue";
import {useRouter, useRoute} from "#app";
import {useToast} from "primevue/usetoast";

definePageMeta({
  layout: "default-with-nav",
});

const pageStore = usePageCrudStore();
const paginationStore = usePagination();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const {confirm, confirmDialogRef} = useConfirmationDialog();
// const confirmationService = ConfirmationService();

const dialogVisible = ref(false);
const editMode = ref(false);
const editPageId = ref(null) as Ref<string | null>;
const isLoading = ref(false);

// Pagination computed properties
const pagination = computed(
  () =>
    paginationStore.getPaginationMeta || {
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      perPage: 10,
      hasNextPage: false,
      hasPreviousPage: false,
    },
);

// Pages computed property
const pages = computed(() => pageStore.pages);

// Load pages on mount
const loadPages = async (page = 1) => {
  isLoading.value = true;
  try {
    await pageStore.listPages({
      page,
      limit: pagination.value.perPage,
    });
  } finally {
    isLoading.value = false;
  }
};

const onPageChange = (event: any) => {
  loadPages(event.page + 1); // PrimeVue uses 0-based index
};

const showAddDialog = () => {
  editMode.value = false;
  editPageId.value = null;
  dialogVisible.value = true;
};

const showEditDialog = (id: number) => {
  editMode.value = true;
  editPageId.value = id;
  dialogVisible.value = true;
};

const onDialogHide = () => {
  editMode.value = false;
  editPageId.value = null;
};

const onDialogSuccess = () => {
  dialogVisible.value = false;
  loadPages(paginationStore.getPaginationMeta?.currentPage || 1);
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Page saved successfully",
    life: 3000,
  });
};

const onDialogCancel = () => {
  dialogVisible.value = false;
};

const confirmDelete = (id: number) => {
  confirm({
    message: "Are you sure you want to delete this page?",
    header: "Delete Confirmation",
    onAccept: () => {
      deletePage(id);
    },
    onReject: () => {
      // User cancelled
    },
  });
};

const deletePage = async (id: number) => {
  try {
    await pageStore.deletePage(id);
    loadPages(paginationStore.getPaginationMeta?.currentPage || 1);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Page deleted successfully",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete page",
      life: 3000,
    });
  }
};

// Initial load
onMounted(() => {
  loadPages(1);
});
</script>
