<script setup>
import Canvas from "@components/PageBuilder/Canvas.vue";
import {usePageBuilderStore} from "~/stores/pageBuilder";

const {slug} = useRoute().params;

const store = usePageBuilderStore();

// Fetch page data from API
const {
  data: pageData,
  pending,
  error,
} = await useAsyncData(`page-${slug}`, async () => {
  const {$axios} = useNuxtApp();

  const response = await $axios.get(`/pages/slug/${slug}`);

  if (response?.data?.data?.pageJson) {
    store.loadPage(response?.data?.data?.pageJson);
  }
  return response?.data?.data;
});

const pageImage = computed(() => {
  if (!pageData.value?.featuredImage) return "";
  return getImageVersions(pageData.value.featuredImage).optimized;
});

usePageMeta(() => ({
  title:
    pageData.value?.seoTitle && pageData.value?.seoTitle.trim()
      ? pageData.value.seoTitle.trim()
      : pageData.value?.title?.trim() || "Default Title",
  description:
    pageData.value?.seoDescription && pageData.value?.seoDescription.trim()
      ? pageData.value.seoDescription.trim()
      : pageData.value?.excerpt?.trim() || "",
  keywords:
    pageData.value?.seoKeywords && pageData.value?.seoKeywords.trim()
      ? pageData.value.seoKeywords.trim()
      : "",
  ogImage: pageImage.value || undefined,
  schema: pageData.value?.schema || {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageData.value?.seoTitle || pageData.value?.title || "",
    description:
      pageData.value?.seoDescription || pageData.value?.excerpt || "",
    image: pageImage.value || undefined,
  },
}));

const decodeHtmlEntities = (html) => {
  if (!html) return "";
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
};
</script>

<template>
  <div v-if="pending" class="flex flex-col items-center py-16">
    <ProgressSpinner style="width: 50px; height: 50px" />
    <p class="paragraph mt-4">Loading page content...</p>
  </div>
  <div v-else-if="pageData?.pageJson">
    <!-- Content state -->
    <div class="mx-auto">
      <Canvas />
    </div>
  </div>
  <div v-else>
    <BaseContainer class="py-8 md:py-12">
      <!-- Loading state -->
      <div v-if="pending" class="flex flex-col items-center py-16">
        <ProgressSpinner style="width: 50px; height: 50px" />
        <p class="paragraph mt-4">Loading page content...</p>
      </div>

      <!-- Error state - redirect to 404 -->
      <div v-else-if="error">
        {{ navigateTo("/404") }}
      </div>

      <!-- Content state -->
      <div v-else-if="pageData" class="max-w-4xl mx-auto">
        <!-- Page header -->
        <div class="mb-8">
          <h1 class="heading mb-4">{{ pageData.title }}</h1>
          <p v-if="pageData.excerpt" class="paragraph_secondary mb-6">
            {{ pageData.excerpt }}
          </p>
        </div>

        <!-- Featured image (if available) -->
        <div v-if="pageData.featuredImage" class="mb-8">
          <div class="max-w-full overflow-hidden rounded-lg shadow-md">
            <img
              :src="getImageVersions(pageData.featuredImage).optimized"
              :alt="pageData.title"
              class="w-full h-auto object-cover object-center mx-auto"
            />
          </div>
        </div>

        <!-- Rich text content -->
        <BaseCardWrapper>
          <div
            class="rich-text-content"
            v-html="decodeHtmlEntities(pageData.content)"
          />
        </BaseCardWrapper>
      </div>

      <!-- Not found state - redirect to 404 -->
      <div v-else>
        {{ navigateTo("/404") }}
      </div>
    </BaseContainer>
  </div>
</template>

<style scoped>
.rich-text-content {
  word-break: keep-all;
  overflow-wrap: normal;
  white-space: normal;
  max-width: 100%;
}

/* Headings */
.rich-text-content :deep(h1) {
  @apply text-2xl sm:text-3xl font-semibold text-surface-color mt-6 mb-4;
}

.rich-text-content :deep(h2) {
  @apply text-xl sm:text-2xl font-semibold text-surface-color mt-5 mb-3;
}

.rich-text-content :deep(h3) {
  @apply text-lg sm:text-xl font-medium text-surface-color mt-4 mb-2;
}

.rich-text-content :deep(h4),
.rich-text-content :deep(h5),
.rich-text-content :deep(h6) {
  @apply text-base sm:text-lg font-medium text-surface-color mt-3 mb-2;
}

/* Paragraphs */
.rich-text-content :deep(p) {
  @apply text-xs sm:text-sm font-normal text-surface-color mb-4;
  word-break: normal;
  overflow-wrap: break-word;
  white-space: normal;
}

/* Lists */
.rich-text-content :deep(ul),
.rich-text-content :deep(ol) {
  @apply mb-4 pl-6;
}

.rich-text-content :deep(ol) {
  @apply list-decimal;
}

.rich-text-content :deep(ul) {
  @apply list-disc;
}

.rich-text-content :deep(li) {
  @apply text-xs sm:text-sm font-normal text-surface-color mb-2;
}

/* Text formatting */
.rich-text-content :deep(strong) {
  @apply font-bold;
}

.rich-text-content :deep(em) {
  @apply italic;
}

.rich-text-content :deep(u) {
  @apply underline;
}

/* Links */
.rich-text-content :deep(a) {
  @apply text-primary-500 hover:underline;
}

/* Images */
.rich-text-content :deep(img) {
  @apply max-w-full h-auto my-4 rounded mx-auto block;
}

/* Center image containers if present */
.rich-text-content :deep(p:has(img)) {
  @apply text-center;
}

.rich-text-content :deep(figure) {
  @apply text-center my-4;
}

/* Tables */
.rich-text-content :deep(table) {
  @apply max-w-full block overflow-x-auto my-4 border-collapse;
}

.rich-text-content :deep(th),
.rich-text-content :deep(td) {
  @apply border p-2;
}

/* Code blocks */
.rich-text-content :deep(pre) {
  @apply max-w-full overflow-x-auto p-4 my-4 bg-gray-100 dark:bg-gray-800 rounded-md font-mono text-sm;
}

/* Blockquotes */
.rich-text-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-4 italic my-6;
}

/* Quill editor specific classes */
.rich-text-content :deep(.ql-font-monospace) {
  @apply font-mono;
}

.rich-text-content :deep(.ql-font-sans-serif) {
  @apply font-sans;
}

.rich-text-content :deep(.ql-font-serif) {
  @apply font-serif;
}

/* Quill text alignment classes */
.rich-text-content :deep(.ql-align-center) {
  @apply text-center;
}

.rich-text-content :deep(.ql-align-right) {
  @apply text-right;
}

.rich-text-content :deep(.ql-align-justify) {
  @apply text-justify;
}
</style>
