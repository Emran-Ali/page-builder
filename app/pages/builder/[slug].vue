<script setup>
import Canvas from "~/components/PageBuilder/Canvas.vue";
import PropertyPanel from "~/components/PageBuilder/PropertyPanel.vue";
import Toolbar from "~/components/PageBuilder/Toolbar.vue";
import Sidebar from "~/components/PageBuilder/Sidebar.vue";

import {useTheme} from "~/themes/useTheme";
import {usePageCrudStore} from "~/layers/page-builder/stores/page-crud";
import {usePageBuilderStore} from "~/layers/page-builder/stores/pageBuilder";

useTheme();

// Set page meta
definePageMeta({
  title: "Droptik",
  layout: "false",
});

const {slug} = useRoute().params;
const store = usePageBuilderStore();
const pageCrudStore = usePageCrudStore();
const {is} = useGlobalStore();

const currentPage = computed(() => pageCrudStore.currentPage);

onMounted(async () => {
  try {
    await pageCrudStore.getPage(slug);
    if (currentPage.value?.pageJson) {
      store.loadPage(currentPage.value?.pageJson, false);
    }
  } catch (error) {
    console.error("Error loading page:", error);
    navigateTo("/404");
  }
});

const isPreview = computed(() => store.isPreview);
</script>

<template>
  <div
    v-if="is('verifyAdmin')"
    class="h-screen flex flex-col bg-gray-100 items-center justify-center spinner-wrapper"
  >
    <ProgressSpinner style="width: 50px; height: 50px" />
    <p class="paragraph mt-4">Verifying admin access...</p>
  </div>
  <div v-else class="h-screen flex flex-col bg-gray-100">
    <Toolbar />

    <div class="flex-1 flex overflow-hidden">
      <Sidebar v-if="!isPreview" />

      <div
        v-if="is('getPage')"
        class="flex-1 flex flex-col items-center justify-center spinner-wrapper"
      >
        <ProgressSpinner style="width: 50px; height: 50px" />
        <p class="paragraph mt-4">Loading page content...</p>
      </div>

      <!-- Canvas -->
      <div v-else class="flex-1 flex flex-col">
        <Canvas />
      </div>

      <!-- Property Panel -->
      <PropertyPanel v-if="!isPreview" />
    </div>
  </div>
</template>

<style scoped>
.spinner-wrapper {
  --p-progressspinner-color-one: #000000;
  --p-progressspinner-color-two: #000000;
  --p-progressspinner-color-three: #000000;
  --p-progressspinner-color-four: #000000;
}
</style>
