<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center gap-8">
            <NuxtLink to="/" class="text-2xl font-bold text-blue-600">Page Builder</NuxtLink>
            <div class="hidden md:flex gap-4">
              <NuxtLink to="/" class="text-gray-700 hover:text-blue-600 px-3 py-2">Dashboard</NuxtLink>
              <NuxtLink to="/pages" class="text-gray-700 hover:text-blue-600 px-3 py-2">Pages</NuxtLink>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <span v-if="auth.user?.name" class="text-gray-700">{{ auth.user.name }}</span>
            <img v-if="auth.user?.picture" :src="auth.user.picture" :alt="auth.user.name" class="w-10 h-10 rounded-full" />
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
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const auth = useAuthStore();

const handleLogout = async () => {
  await auth.logout();
};
</script>