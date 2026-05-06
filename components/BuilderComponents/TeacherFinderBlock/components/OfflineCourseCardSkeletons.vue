<script setup lang="ts">
// Define props to control how many skeleton items to show
defineProps({
  count: {
    type: Number,
    default: 3,
  },
})
</script>

<template>
  <!-- Left column with card skeletons -->

  <div v-for="index in count" :key="index" class="mb-4">
    <div
      class="p-5 w-full mb-2 border rounded-lg bg-white dark:bg-surface-card cursor-pointer"
    >
      <div class="flex gap-3 justify-between max-lg:flex-col">
        <div class="gap-3 flex max-sm:flex-col">
          <!-- Avatar skeleton -->
          <div
            class="w-[180px] max-lg:w-[100px] h-[180px] max-lg:h-[100px] max-lg:min-w-[100px] min-w-[150px] aspect-square overflow-hidden rounded-md animate-pulse bg-gray-200 dark:bg-gray-700"
          ></div>

          <div class="sm:py-2 w-full">
            <!-- Title skeleton -->
            <div class="flex items-center gap-2 flex-wrap">
              <div
                class="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
              <div
                class="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              ></div>
              <div
                class="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              ></div>
              <div
                class="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            </div>

            <!-- Discipline skeleton -->
            <div
              class="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"
            ></div>

            <!-- Mobile price section skeleton -->
            <div class="hidden max-lg:block mt-2">
              <div class="flex items-start justify-between">
                <div
                  class="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                ></div>
                <div
                  class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
                ></div>
              </div>
              <div
                class="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"
              ></div>
            </div>

            <!-- Desktop student info and rating skeleton -->
            <div class="max-lg:hidden">
              <div class="flex items-center my-4 flex-wrap">
                <div class="flex items-center gap-2">
                  <div
                    class="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                  <div
                    class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                </div>
                <div
                  class="h-7 w-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-2"
                ></div>
                <div class="flex items-center gap-2">
                  <div
                    class="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                  <div class="flex items-center gap-1">
                    <div
                      v-for="star in 5"
                      :key="star"
                      class="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                    ></div>
                  </div>
                  <div
                    class="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                </div>
              </div>
              <!-- Description skeleton -->
              <div class="space-y-2 max-w-[485px]">
                <div
                  class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                ></div>
                <div
                  class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile student info and description skeleton -->
        <div class="hidden max-lg:block">
          <div class="flex items-center mb-2 flex-wrap">
            <div class="flex items-center gap-2">
              <div
                class="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
              <div
                class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            </div>
            <div
              class="h-7 w-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-2"
            ></div>
            <div class="flex items-center gap-2">
              <div
                class="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
              <div class="flex items-center gap-1">
                <div
                  v-for="star in 5"
                  :key="star"
                  class="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                ></div>
              </div>
              <div
                class="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            </div>
          </div>
          <!-- Description skeleton -->
          <div class="space-y-2 max-w-[485px]">
            <div
              class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            ></div>
            <div
              class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            ></div>
          </div>
        </div>

        <!-- Right column price and buttons skeleton -->
        <div
          class="w-[200px] max-lg:w-full min-w-[160px] flex flex-col justify-between"
        >
          <div class="max-lg:hidden">
            <div class="flex items-start justify-between">
              <div
                class="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
              <div
                class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
              ></div>
            </div>
            <div
              class="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"
            ></div>
          </div>

          <div class="flex flex-col gap-3 max-lg:flex-row mt-auto">
            <div
              class="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            ></div>
            <div
              class="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
