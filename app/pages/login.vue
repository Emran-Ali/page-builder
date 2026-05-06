<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h1 class="text-3xl font-bold mb-2 text-center text-gray-900">Page Builder</h1>
      <p class="text-center text-gray-600 mb-8">Sign in to your account</p>

      <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
        {{ errorMessage }}
      </div>

      <button
        @click="loginWithGoogle"
        :disabled="auth.loading"
        class="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
      >
        <svg class="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.7 30.77 0 24 0 14.82 0 6.71 5.48 2.69 13.44l7.98 6.2C12.13 13.09 17.62 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.04h12.42c-.54 2.9-2.18 5.36-4.65 7.02l7.18 5.59C43.93 37.13 46.1 31.3 46.1 24.5z"/><path fill="#FBBC05" d="M10.67 28.64A14.5 14.5 0 019.5 24c0-1.6.27-3.15.75-4.64l-7.98-6.2A23.93 23.93 0 000 24c0 3.77.9 7.34 2.49 10.48l8.18-5.84z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.18-5.59c-2.01 1.35-4.59 2.15-8.72 2.15-6.38 0-11.87-3.59-14.33-8.9l-8.18 5.84C6.71 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
        {{ auth.loading ? 'Logging in...' : 'Login with Google' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const auth = useAuthStore();
const route = useRoute();
const errorMessage = ref('');

onMounted(() => {
  if (route.query.error) {
    errorMessage.value = `Error: ${route.query.error}`;
  }
});

const loginWithGoogle = async () => {
  await auth.loginWithGoogle();
};
</script>
