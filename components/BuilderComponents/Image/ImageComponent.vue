<script setup>
import { computed } from 'vue'
import Image from 'primevue/image'

const props = defineProps({
  id: String,
  src: {
    type: String,
    default:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMiIgcng9IjQiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgUGxhY2Vob2xkZXI8L3RleHQ+Cjwvc3ZnPgo=',
  },
  alt: {
    type: String,
    default: 'Image',
  },
  width: {
    type: String,
    default: '300px',
  },
  height: {
    type: String,
    default: '200px',
  },

  opacity: {
    type: Number,
    default: 1,
  },
  marginHorizontal: {
    type: String,
    default: '0px',
  },
  marginVertical: {
    type: String,
    default: '0px',
  },
  paddingHorizontal: {
    type: String,
    default: '0px',
  },
  paddingVertical: {
    type: String,
    default: '0px',
  },
  alignment: {
    type: String,
    default: 'left',
  },
  caption: {
    type: String,
    default: '',
  },
  showCaption: {
    type: Boolean,
    default: false,
  },

  captionOverlay: {
    type: Boolean,
    default: true,
  },
  captionTextAlign: {
    type: String,
    default: 'left',
  },
  captionBackgroundColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.7)',
  },
  captionPadding: {
    type: String,
    default: '16px',
  },

  captionFontSize: {
    type: String,
    default: '14px',
  },
  captionColor: {
    type: String,
    default: '#ffffff',
  },
  captionStyle: {
    type: String,
    default: 'normal',
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  preview: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:props'])

// Handle caption editing
const updateCaption = (event) => {
  emit('update:props', { caption: event.target.innerText })
}

// Computed styles for the container
const containerStyles = computed(() => ({
  textAlign: props.alignment,
  paddingLeft: props.paddingHorizontal,
  paddingRight: props.paddingHorizontal,
  paddingTop: props.paddingVertical,
  paddingBottom: props.paddingVertical,
  marginLeft: props.marginHorizontal,
  marginRight: props.marginHorizontal,
  marginTop: props.marginVertical,
  marginBottom: props.marginVertical,
}))

// Computed styles for the image
const imageStyles = computed(() => ({
  width: props.width,
  height: props.height,
  maxWidth: '100%', // Prevent overflow
  maxHeight: '100%', // Prevent overflow
  opacity: props.opacity,
  display: 'block',
  margin:
    props.alignment === 'center'
      ? '0 auto'
      : props.alignment === 'right'
        ? '0 0 0 auto'
        : '0',
}))

// Computed styles for the caption
const captionStyles = computed(() => {
  if (props.captionOverlay) {
    return {
      fontSize: props.captionFontSize,
      color: props.captionColor,
      fontStyle: props.captionStyle,
      lineHeight: '1.4',
      backgroundColor: props.captionBackgroundColor,
      padding: props.captionPadding,
      backdropFilter: 'blur(4px)',
      width: '100%',
      wordWrap: 'break-word',
    }
  } else {
    return {
      fontSize: props.captionFontSize,
      color: props.captionColor,

      fontStyle: props.captionStyle,
      lineHeight: '1.5',
      maxWidth: '100%',
    }
  }
})

// Computed styles for overlay caption positioning
const overlayPositionStyles = computed(() => {
  if (!props.captionOverlay) return {}

  return {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    zIndex: 10,
    textAlign: props.captionTextAlign,
  }
})

// Handle image error
const handleImageError = (event) => {
  console.warn('Image failed to load:', props.src)
  // Use a different fallback image to avoid infinite loop
  const fallbackSvg =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmVmMmYyIiBzdHJva2U9IiNmODcxNzEiIHN0cm9rZS13aWR0aD0iMiIgcng9IjQiLz4KICA8dGV4dCB4PSI1MCUiIHk9IjQwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjIwIiBmaWxsPSIjZGMzNjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4p2MPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5MTVhNWQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPgo='
  // Only set fallback if it's not already the fallback to prevent infinite loop
  if (event.target.src !== fallbackSvg) {
    event.target.src = fallbackSvg
  }
}
</script>

<template>
  <div
    :data-component-id="id"
    :style="containerStyles"
    class="relative max-w-full overflow-hidden"
  >
    <!-- Image wrapper for better control -->
    <div
      class="relative max-w-full overflow-hidden"
      :class="{ block: !captionOverlay }"
    >
      <Image
        :src="getImageVersions(src).optimized"
        :alt="alt"
        :style="imageStyles"
        :preview="preview"
        class="max-w-full transition-all duration-300 hover:scale-[1.01] block"
        @error="handleImageError"
      />

      <!-- Overlay Caption -->
      <div
        v-if="showCaption && caption && captionOverlay"
        :style="{ ...captionStyles, ...overlayPositionStyles }"
        :contenteditable="isEditing"
        @blur="updateCaption"
        class="font-system tracking-wide antialiased break-words hyphens-auto transition-all duration-200 text-shadow-md backdrop-blur-sm hover:backdrop-blur-md hover:bg-black/80 hover:-translate-y-px hover:shadow-lg"
        :class="{
          'outline-none border-2 border-blue-500/50 bg-white/95 text-gray-800 min-h-[2em] min-w-[100px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10':
            isEditing,
          'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
        }"
      >
        {{ caption }}
      </div>
    </div>
  </div>
</template>
