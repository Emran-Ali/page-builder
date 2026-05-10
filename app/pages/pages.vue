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
          <NuxtLink
            to="/builder/new"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Create New Page
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Pages List -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        v-if="pages.length === 0"
        class="bg-white rounded-lg shadow-md p-12 text-center"
      >
        <p class="text-gray-500 text-lg mb-4">
          No pages yet. Create your first page!
        </p>
        <NuxtLink
          to="/builder/new"
          class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Create New Page
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="page in pages"
          :key="page.id"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h3 class="text-xl font-semibold mb-2">{{ page.title }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ page.description }}</p>
          <div class="flex gap-2">
            <NuxtLink
              :to="`/builder/${page.slug}`"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-center"
            >
              Edit
            </NuxtLink>
            <button
              @click="deletePage(page.id)"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default-with-nav",
});

const pages = ref([
  {
    id: 1,
    slug: "home",
    title: "Home Page",
    description: "Your main landing page",
  },
]);

const deletePage = (id: number) => {
  if (confirm("Are you sure you want to delete this page?")) {
    pages.value = pages.value.filter((p) => p.id !== id);
  }
};
</script>
