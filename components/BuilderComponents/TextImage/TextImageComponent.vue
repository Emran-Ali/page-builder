<script setup>
import {computed} from "vue";
import Button from "primevue/button";
import {
  headingClassMap,
  paragraphBaseClass,
} from "../../../utils/headingClasses";
import {usePageBuilderStore} from "@layers/page-builder/stores/pageBuilder";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  // Title properties
  title: {
    type: String,
    default: "",
  },
  titleTag: {
    type: String,
    default: "h2",
  },
  titleFontSize: {
    type: String,
    default: "32px",
  },
  titleFontWeight: {
    type: String,
    default: "bold",
  },
  titleColor: {
    type: String,
    default: "#000000",
  },
  titleAlign: {
    type: String,
    default: "left",
  },
  titleMarginBottom: {
    type: String,
    default: "16px",
  },

  // Paragraph properties
  paragraph: {
    type: String,
    default: "",
  },
  paragraphAlign: {
    type: String,
    default: "left",
  },
  paragraphFontSize: {
    type: String,
    default: "14px",
  },

  // Media properties
  mediaType: {
    type: String,
    default: "image", // 'image' or 'video'
  },
  imageSrc: {
    type: String,
    default: "",
  },
  imageAlt: {
    type: String,
    default: "Image",
  },
  videoSrc: {
    type: String,
    default: "",
  },
  videoAlt: {
    type: String,
    default: "",
  },

  // Button properties
  buttons: {
    type: Array,
    default: () => [],
  },
  buttonAlignment: {
    type: String,
    default: "left",
  },
  buttonSpacing: {
    type: String,
    default: "12px",
  },

  // Responsive breakpoint
  mobileBreakpoint: {
    type: String,
    default: "768px",
  },

  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:props"]);

const store = usePageBuilderStore();
const isPreview = computed(() => store.isPreview);

const buttonContainerStyles = computed(() => ({
  textAlign: props.buttonAlignment,
  display: "flex",
  flexWrap: "wrap",
  gap: props.buttonSpacing,
  justifyContent:
    props.buttonAlignment === "center"
      ? "center"
      : props.buttonAlignment === "right"
        ? "flex-end"
        : "flex-start",
}));

// Helpers
const getParagraphs = (text) => {
  if (!text) return [];
  return text
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};

// Handle content updates
const updateTitle = (event) => {
  emit("update:props", {title: event.target.innerText});
};

const updateParagraph = (event) => {
  emit("update:props", {paragraph: event.target.innerText});
};

const handleButtonClick = (button) => {
  if (!isPreview.value) return;

  if (button.link) {
    if (button.target === "_blank") {
      window.open(button.link, "_blank");
    } else {
      window.location.href = button.link;
    }
  }
};

// Handle image error
const handleImageError = () => {
  console.warn("Image failed to load:", props.imageSrc);
  // You can set a fallback image here if needed
};

// Convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // If it's already an embed URL, return as is
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  return url;
};

// Check if content exists
const hasTitle = computed(() => props.title && props.title.trim().length > 0);
const hasParagraph = computed(
  () => props.paragraph && props.paragraph.trim().length > 0,
);
const hasImage = computed(
  () =>
    props.mediaType === "image" &&
    props.imageSrc &&
    props.imageSrc.trim().length > 0,
);
const hasVideo = computed(
  () =>
    props.mediaType === "video" &&
    props.videoSrc &&
    props.videoSrc.trim().length > 0,
);
const hasMedia = computed(() => hasImage.value || hasVideo.value);
const videoEmbedUrl = computed(() => {
  if (hasVideo.value && props.videoSrc) {
    return getYouTubeEmbedUrl(props.videoSrc);
  }
  return "";
});
const hasButtons = computed(() => props.buttons && props.buttons.length > 0);

const headingClass = computed(
  () => headingClassMap[props.titleTag] || headingClassMap.h2,
);

const getButtonHoverClasses = (button) => {
  const variant = button.variant || "filled";
  if (variant === "filled") return "hover:brightness-95";
  if (variant === "outlined")
    return "hover:!text-black hover:!ring-1 hover:!ring-black";
  return "hover:underline hover:!text-black";
};
</script>

<template>
  <div :data-component-id="id" class="w-full box-border">
    <!-- Editing Mode Label -->
    <div
      v-if="isEditing"
      class="absolute -top-3 left-2 z-10 rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white"
    >
      Hero Block
    </div>
    <!-- Content Section -->
    <div class="content-section flex flex-col">
      <!-- Title -->
      <component
        :is="titleTag"
        v-if="hasTitle || isEditing"
        :contenteditable="isEditing"
        :style="{textAlign: titleAlign, marginBottom: titleMarginBottom}"
        :class="[
          'outline-none',
          headingClass,
          {
            'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
              isEditing,
            'border-blue-500': isEditing && document.activeElement === $el,
            'text-gray-400 italic': isEditing && !hasTitle,
            'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
          },
        ]"
        @blur="updateTitle"
      >
        {{ title || (isEditing ? "Enter title..." : "") }}
      </component>

      <!-- Paragraph -->
      <div
        v-if="hasParagraph || isEditing"
        class="outline-none"
        :style="{textAlign: paragraphAlign, fontSize: paragraphFontSize}"
        :class="{
          'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
            isEditing,
          'border-blue-500': isEditing && document.activeElement === $el,
          'text-gray-400 italic': isEditing && !hasParagraph,
          'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
        }"
        :contenteditable="isEditing"
        @blur="updateParagraph"
      >
        <template v-if="paragraph">
          <p
            v-for="(para, idx) in getParagraphs(paragraph)"
            :key="idx"
            :class="paragraphBaseClass"
            :style="{textAlign: paragraphAlign, fontSize: paragraphFontSize}"
          >
            {{ para }}
          </p>
        </template>
        <p v-else class="text-gray-400 italic">
          {{ isEditing ? "Enter paragraph text..." : "" }}
        </p>
      </div>

      <!-- Media Section (Image or Video) -->
      <div v-if="hasMedia || isEditing" class="media-section w-full mb-6">
        <!-- Image Display -->
        <img
          v-if="hasImage"
          :src="imageSrc"
          :alt="imageAlt"
          class="block w-full h-auto object-contain rounded-2xl"
          @error="handleImageError"
        />

        <!-- Video Display -->
        <div
          v-else-if="hasVideo"
          class="w-full aspect-video rounded-2xl overflow-hidden"
        >
          <iframe
            :src="videoEmbedUrl"
            class="w-full h-full"
            frameborder="0"
            allow="
              accelerometer;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
            "
            allowfullscreen
          ></iframe>
        </div>

        <!-- Placeholder for editing mode -->
        <div
          v-else-if="isEditing"
          class="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg min-h-[200px] text-gray-500 italic w-full"
        >
          <p>No {{ mediaType === "video" ? "video" : "image" }} configured</p>
        </div>
      </div>
      <!-- Buttons -->

      <div
        v-if="hasButtons || isEditing"
        :style="buttonContainerStyles"
        class="button-container mt-auto"
      >
        <Button
          v-for="(button, index) in buttons"
          :key="index"
          :label="button.label || 'Button'"
          :severity="button.severity || 'primary'"
          :variant="button.variant || 'filled'"
          size="small"
          rounded
          :class="[
            getButtonHoverClasses(button),
            {
              'pointer-events-none': isEditing,
              'opacity-75': isEditing,
            },
          ]"
          @click="handleButtonClick(button)"
        />
        <div
          v-if="isEditing && buttons.length === 0"
          class="px-4 py-2 border-2 border-dashed border-gray-300 rounded text-gray-400 italic text-center bg-gray-50"
        >
          No buttons configured
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Editing Mode Label - Now handled by template div */

/* Responsive Design */
@media (max-width: 768px) {
  .button-container {
    flex-direction: column;
    align-items: stretch;
  }

  .button-container :deep(.p-button) {
    width: 100%;
    margin-bottom: 0.5rem;
  }
}

/* Print Styles */
@media print {
  .editing-mode::before {
    display: none;
  }

  .editing-mode {
    border: none;
  }
}
</style>
