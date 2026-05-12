<template>
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Hi <span class="text-blue-600">{{ user?.name }}</span>, Welcome to Page Builder
        </h2>
        <p class="text-xl text-gray-600">Create and manage pages with ease</p>
      </div>

      <!-- Please add feature of page builder here -->
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default-with-nav",
});

const auth = useAuthStore();

const user = computed(() => auth.user);
</script>
