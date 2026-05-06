<script setup>
import Button from "primevue/button";
import {computed} from "vue";
import {usePageBuilderStore} from "@layers/page-builder/stores/pageBuilder";
import {
  headingClassMap,
  paragraphBaseClass,
} from "../../../utils/headingClasses";

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  // Section heading
  sectionTitle: {
    type: String,
    default: "",
  },
  sectionTitleTag: {
    type: String,
    default: "h2",
  },
  sectionDescription: {
    type: String,
    default: "",
  },
  // Grid items array
  items: {
    type: Array,
    default: () => [],
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
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:props"]);

const store = usePageBuilderStore();
const isPreview = computed(() => store.isPreview);

// Handle content updates
const updateItemTitle = (index, event) => {
  if (!props.items[index]) return;
  const updatedItems = [...props.items];
  updatedItems[index] = {
    ...updatedItems[index],
    title: event.target.innerText,
  };
  emit("update:props", {items: updatedItems});
};

const handleLinkClick = (item) => {
  if (props.isEditing) return;
  if (!isPreview.value) return;

  if (item.link) {
    if (item.linkTarget === "_blank") {
      window.open(item.link, "_blank");
    } else {
      window.location.href = item.link;
    }
  }
};

// Handle image error
const handleImageError = () => {
  console.warn("Image failed to load");
};

// Split paragraph text into multiple paragraphs by newline
const getParagraphs = (text) => {
  if (!text) return [];
  return text
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};

// Heading helpers
const hasSectionTitle = computed(
  () => props.sectionTitle && props.sectionTitle.trim().length > 0,
);
const hasSectionDescription = computed(
  () => props.sectionDescription && props.sectionDescription.trim().length > 0,
);

const updateSectionTitle = (event) => {
  emit("update:props", {sectionTitle: event.target.innerText});
};

const sectionHeadingClass = computed(
  () => headingClassMap[props.sectionTitleTag] || headingClassMap.h2,
);

// Button functionality
const hasButtons = computed(() => props.buttons && props.buttons.length > 0);

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

const getButtonHoverClasses = (button) => {
  const variant = button.variant || "filled";
  if (variant === "filled") return "hover:brightness-95";
  if (variant === "outlined")
    return "hover:!text-black hover:!ring-1 hover:!ring-black";
  return "hover:underline hover:!text-black";
};
</script>

<template>
  <!-- Section Heading -->
  <div class="col-span-full">
    <component
      :is="sectionTitleTag"
      v-if="hasSectionTitle || isEditing"
      class="outline-none"
      :class="[
        sectionHeadingClass,
        {
          'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
            isEditing,
          'border-blue-500': isEditing && document.activeElement === $el,
          'text-gray-400 italic': isEditing && !hasSectionTitle,
          'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
        },
      ]"
      :contenteditable="isEditing"
      @blur="updateSectionTitle"
    >
      {{ sectionTitle || (isEditing ? "Enter section title..." : "") }}
    </component>

    <div
      v-if="hasSectionDescription || isEditing"
      class="outline-none"
      :class="{
        'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
          isEditing,
        'border-blue-500': isEditing && document.activeElement === $el,
        'text-gray-400 italic': isEditing && !hasSectionDescription,
        'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
      }"
    >
      <template v-if="sectionDescription">
        <p
          v-for="(para, idx) in getParagraphs(sectionDescription)"
          :key="idx"
          :class="paragraphBaseClass"
        >
          {{ para }}
        </p>
      </template>
      <p v-else class="text-gray-400 italic">
        {{
          isEditing ? "Enter a short description for this grid section..." : ""
        }}
      </p>
    </div>
  </div>

  <div
    :data-component-id="id"
    class="w-full box-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10"
    :class="{
      'relative border-2 border-dashed border-blue-500 rounded-lg p-2':
        isEditing,
    }"
  >
    <!-- Editing Mode Label -->
    <div
      v-if="isEditing"
      class="absolute -top-3 left-2 z-10 rounded-md bg-blue-500 px-2 py-1 text-xs font-medium text-white"
    >
      Grid Block
    </div>

    <!-- Grid Items -->
    <div v-for="(item, index) in items" :key="index" class="flex flex-col">
      <!-- Image -->
      <div
        v-if="item.imageSrc || isEditing"
        class="w-full bg-gray-100 overflow-hidden aspect-[4/3] mb-4"
      >
        <img
          v-if="item.imageSrc"
          :src="item.imageSrc"
          :alt="item.imageAlt || `Grid item ${index + 1}`"
          class="w-full h-full object-contain sm:object-cover rounded-lg"
          @error="handleImageError"
        />
        <div
          v-else-if="isEditing"
          class="flex items-center justify-center w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 text-gray-500 italic"
        >
          <p class="text-sm">No image configured</p>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col flex-1">
        <!-- Title -->
        <h3
          v-if="item.title || isEditing"
          class="outline-none"
          :class="[
            headingClassMap.h3,

            {
              'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                isEditing,
              'border-blue-500': isEditing && document.activeElement === $el,
              'text-gray-400 italic': isEditing && !item.title,
              'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50':
                isEditing,
            },
          ]"
          :contenteditable="isEditing"
          @blur="updateItemTitle(index, $event)"
        >
          {{ item.title || (isEditing ? "Enter title..." : "") }}
        </h3>

        <!-- Paragraphs -->
        <div
          v-if="item.paragraph || isEditing"
          class="flex-1 outline-none"
          :class="{
            'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
              isEditing,
            'border-blue-500': isEditing && document.activeElement === $el,
            'text-gray-400 italic': isEditing && !item.paragraph,
            'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
          }"
        >
          <div v-if="item.paragraph">
            <p
              v-for="(para, pIdx) in getParagraphs(item.paragraph)"
              :key="pIdx"
              :class="paragraphBaseClass"
            >
              {{ para }}
            </p>
          </div>
          <p v-else class="text-gray-400 italic">
            {{ isEditing ? "Enter paragraph text..." : "" }}
          </p>
        </div>

        <!-- Link/Button -->
        <div v-if="item.link && item.link.trim().length > 0">
          <a
            :href="item.link"
            :target="item.linkTarget || '_self'"
            class="text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
            :class="{
              'pointer-events-none opacity-75': isEditing,
            }"
            style="text-underline-offset: 7px; text-decoration: underline"
            @click.prevent="handleLinkClick(item)"
          >
            {{ item.linkText || "Read more" }}
          </a>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="isEditing && (!items || items.length === 0)"
      class="col-span-full flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
    >
      <p class="text-gray-500 italic">
        No grid items configured. Add items in the properties panel.
      </p>
    </div>
  </div>

  <!-- Buttons Section -->
  <div
    v-if="hasButtons || isEditing"
    :style="buttonContainerStyles"
    class="button-container mt-6"
  >
    <Button
      v-for="(button, index) in buttons"
      :key="index"
      :label="button.label || 'Button'"
      :severity="button.severity || 'primary'"
      :variant="button.variant || 'filled'"
      size="small"
      rounded
      class="!px-4"
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
</template>

<style scoped>
/* Responsive Design for Buttons */
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
  .button-container {
    display: none;
  }
}
</style>
