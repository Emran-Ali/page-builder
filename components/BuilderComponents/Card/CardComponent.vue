<script setup>
const props = defineProps({
  id: String,
  title: String,
  content: String,
  image: String,
  imagePosition: {
    type: String,
    default: 'top',
  },
  styling: Object,
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const paddingClass = computed(() => {
  const padding = props.styling.padding || 'medium'
  const paddingMap = {
    none: 'p-0',
    xsmall: 'p-1',
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4',
    xlarge: 'p-5',
    xxlarge: 'p-6',
  }
  return paddingMap[padding] || paddingMap.large
})

const alignmentClass = computed(() => {
  const alignment = props.styling.alignment || 'center'
  const alignmentMap = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }
  return alignmentMap[alignment] || alignmentMap.center
})

const handleImageError = (event) => {
  event.target.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgNzVMMTc1IDEyNUgxMjVWNzVaIiBmaWxsPSIjRDFENUU5Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVMMjI1IDEyNUgxNzVWNzVaIiBmaWxsPSIjRDFENUU5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmaWxsPSIjNkI3MjgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+'
}
</script>

<template>
  <div
    :class="[
      'w-full max-w-md bg-white overflow-hidden',
      alignmentClass,
      props.styling.rounded ? 'rounded-lg' : '',
      props.styling.shadow
        ? 'shadow-[0_3px_10px_rgb(0,0,0,0.2)]'
        : 'border border-gray-200',
    ]"
  >
    <!-- Image Section for Top Position -->
    <div
      v-if="props.image && props.imagePosition === 'top'"
      class="relative overflow-hidden"
      :class="props.styling.rounded ? 'rounded-t-lg' : ''"
    >
      <div class="aspect-video bg-gray-100">
        <img
          :src="getImageVersions(props.image).optimized"
          :alt="props.title"
          class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          @error="handleImageError"
        />
      </div>
    </div>

    <!-- Content Container -->
    <div :class="paddingClass">
      <div
        :class="[
          'flex',
          props.imagePosition === 'left' && props.image ? 'gap-4' : '',
        ]"
      >
        <!-- Side Image for Left Position -->
        <div
          v-if="props.image && props.imagePosition === 'left'"
          class="w-2/5 relative overflow-hidden rounded-lg flex-shrink-0"
        >
          <div class="aspect-square bg-gray-100">
            <img
              :src="getImageVersions(props.image).optimized"
              :alt="props.title"
              class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              @error="handleImageError"
            />
          </div>
        </div>

        <!-- Content Section -->
        <div
          :class="[
            'flex-1 min-w-0',
            // Add vertical spacing consistency
            'flex flex-col',
          ]"
        >
          <!-- Title -->
          <div class="mb-3">
            <h3 class="text-xl font-bold text-gray-900 leading-tight">
              {{ props.title }}
            </h3>
          </div>

          <!-- Content -->
          <div class="mb-4 flex-1">
            <p class="text-gray-600 leading-relaxed">
              {{ props.content }}
            </p>
          </div>

          <!-- Action Area -->
          <div class="flex justify-end mt-auto">
            <Button label="Learn More" size="small" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
