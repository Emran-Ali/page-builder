<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-blue-600">Page Builder</h1>
          </div>
          <div class="flex items-center gap-4">
            <span v-if="auth.user" class="text-gray-700">{{
              auth.user.name
            }}</span>
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Page Builder
        </h2>
        <p class="text-xl text-gray-600">Create and manage pages with ease</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          to="/builder/new"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <div class="text-3xl mb-2">➕</div>
          <h3 class="text-xl font-semibold mb-2">Create New Page</h3>
          <p class="text-gray-600">Start building a new page from scratch</p>
        </NuxtLink>

        <NuxtLink
          to="/pages"
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <div class="text-3xl mb-2">📄</div>
          <h3 class="text-xl font-semibold mb-2">View All Pages</h3>
          <p class="text-gray-600">Manage and view your existing pages</p>
        </NuxtLink>

        <div
          class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <div class="text-3xl mb-2">⚙️</div>
          <h3 class="text-xl font-semibold mb-2">Settings</h3>
          <p class="text-gray-600">Configure your account and preferences</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const auth = useAuthStore();

const handleLogout = async () => {
  await auth.logout();
};
</script>
