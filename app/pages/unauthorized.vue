<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 text-red-500">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          You don't have permission to access this page. Please contact an
          administrator.
        </p>
      </div>

      <div class="mt-8 space-y-4">
        <Button @click="goBack" class="w-full" size="small"> Go Back </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
usePageMeta({
  title: 'Access Denied',
  description: 'Access Denied',
  keywords: 'Access Denied',
})
definePageMeta({
  layout: false,
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>
