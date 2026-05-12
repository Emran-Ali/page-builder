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
      
      <!-- Hero Section -->
      <section class="mb-20">
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
          <h1 class="text-5xl font-bold mb-6">Build Dynamic Pages Effortlessly</h1>
          <p class="text-xl mb-8 max-w-3xl mx-auto">
            The ultimate page builder for creating stunning, SEO-optimized pages with drag-and-drop simplicity
          </p>
          <div class="flex gap-4 justify-center">
            <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started
            </button>
            <button class="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
              View Demo
            </button>
          </div>
        </div>
      </section>

      <!-- Features Grid -->
      <section class="mb-20">
        <h2 class="text-4xl font-bold text-center mb-12 text-gray-900">Powerful Features</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Drag & Drop Builder</h3>
            <p class="text-gray-600">Intuitive drag-and-drop interface to build pages without coding knowledge</p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Custom HTML Support</h3>
            <p class="text-gray-600">Add full custom HTML with proper rendering of internal and external links</p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Proper Height Rendering</h3>
            <p class="text-gray-600">HTML content renders perfectly without iframe height issues</p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Robust Components</h3>
            <p class="text-gray-600">Highly customizable components with extensive configuration options</p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Map Components</h3>
            <p class="text-gray-600">Integrated map components for location-based content</p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">SEO Optimized</h3>
            <p class="text-gray-600">Schema markup, OG images, meta descriptions for perfect SEO</p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">Server Side Rendering</h3>
            <p class="text-gray-600">All pages are server-side rendered for optimal performance</p>
          </div>

          <div class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-3">TypeScript & ORM</h3>
            <p class="text-gray-600">Built with TypeScript and TypeORM for type safety</p>
          </div>
        </div>
      </section>

      <!-- Why I Built This Section -->
      <section class="mb-20 bg-gray-50 rounded-3xl p-12">
        <h2 class="text-4xl font-bold text-center mb-12 text-gray-900">Why I Built This Page Builder</h2>
        <div class="max-w-4xl mx-auto">
          <div class="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 class="text-2xl font-semibold mb-4 text-blue-600">Solving Real Problems</h3>
              <p class="text-gray-700 mb-4">
                I built this page builder to solve a common challenge: creating dynamic pages in websites without technical complexity. Users need to:
              </p>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-blue-500 mr-2">✓</span>
                  Add pages with internal and external links seamlessly
                </li>
                <li class="flex items-start">
                  <span class="text-blue-500 mr-2">✓</span>
                  Include custom data and content easily
                </li>
                <li class="flex items-start">
                  <span class="text-blue-500 mr-2">✓</span>
                  Maintain SEO optimization without technical knowledge
                </li>
              </ul>
            </div>
            <div>
              <h3 class="text-2xl font-semibold mb-4 text-purple-600">Learning & Growth</h3>
              <p class="text-gray-700 mb-4">
                This project represents my journey in full-stack development, showcasing skills I've mastered:
              </p>
              <ul class="space-y-2 text-gray-700">
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Modern web development with Vue.js/Nuxt.js
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  Database design with TypeORM
                </li>
                <li class="flex items-start">
                  <span class="text-purple-500 mr-2">✓</span>
                  API development and server-side rendering
                </li>
              </ul>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
            <h3 class="text-2xl font-bold mb-4">Open Source Project</h3>
            <p class="text-lg mb-6">
              This page builder is completely open source! I believe in sharing knowledge and building tools that benefit the entire community.
            </p>
            <div class="flex gap-4 justify-center">
              <button class="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                View on GitHub
              </button>
              <button class="border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                Contribute
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="text-center">
        <h2 class="text-4xl font-bold mb-6 text-gray-900">Ready to Build Amazing Pages?</h2>
        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users creating stunning, SEO-optimized pages with our powerful builder
        </p>
        <button class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transition">
          Start Building Now
        </button>
      </section>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const auth = useAuthStore();

const user = computed(() => auth.user);
</script>
