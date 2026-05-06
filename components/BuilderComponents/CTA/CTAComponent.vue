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
  header: {
    type: String,
    default: "Ready to start your musical journey?",
  },
  title: {
    type: String,
    default:
      "We have expert teachers who teach in all styles of music; experts in Jazz, Classical, Pop, and more.",
  },
  buttons: {
    type: Array,
    default: () => [
      {
        label: "Find Your Tutor",
        link: "#",
        severity: "primary",
        variant: "filled",
        target: "_self",
      },
    ],
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:props"]);

const store = usePageBuilderStore();
const isPreview = computed(() => store.isPreview);

const hasHeader = computed(
  () => props.header && props.header.trim().length > 0,
);
const hasTitle = computed(() => props.title && props.title.trim().length > 0);
const hasButtons = computed(() => props.buttons && props.buttons.length > 0);

const updateHeader = (event) => {
  emit("update:props", {header: event.target.innerText});
};

const updateTitle = (event) => {
  emit("update:props", {title: event.target.innerText});
};

const handleButtonClick = (button) => {
  if (props.isEditing) return;
  if (!isPreview.value) return;
  if (button.link) {
    if (button.target === "_blank") {
      window.open(button.link, "_blank");
    } else {
      window.location.href = button.link;
    }
  }
};
</script>

<template>
  <div
    :data-component-id="id"
    class="w-full box-border flex flex-col items-center justify-center text-center px-4 py-10 md:py-14 lg:py-16 bg-white rounded-lg border border-[#E5E7EB]"
  >
    <!-- Header -->
    <h2
      v-if="hasHeader || isEditing"
      :class="[
        headingClassMap.h2,
        'outline-none leading-tight w-[40%]',
        {
          'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
            isEditing,
          'border-blue-500': isEditing && document.activeElement === $el,
          'text-gray-400 italic': isEditing && !hasHeader,
          'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
        },
      ]"
      :contenteditable="isEditing"
      @blur="updateHeader"
    >
      {{ header || (isEditing ? "Enter header..." : "") }}
    </h2>

    <!-- Title / Description -->
    <p
      v-if="hasTitle || isEditing"
      :class="[
        paragraphBaseClass,
        'max-w-4xl outline-none whitespace-pre-wrap w-[60%] mt-2',
        {
          'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
            isEditing,
          'border-blue-500': isEditing && document.activeElement === $el,
          'text-gray-400 italic': isEditing && !hasTitle,
          'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
        },
      ]"
      :contenteditable="isEditing"
      @blur="updateTitle"
    >
      {{ title || (isEditing ? "Enter description..." : "") }}
    </p>

    <!-- Buttons -->
    <div
      v-if="hasButtons || isEditing"
      class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-2"
    >
      <Button
        v-for="(button, index) in buttons"
        :key="index"
        :label="button.label || 'Button'"
        :severity="button.severity || 'primary'"
        :variant="button.variant || 'filled'"
        :disabled="isEditing"
        size="small"
        rounded
        class="w-full !px-4"
        :class="{
          'pointer-events-none opacity-75': isEditing,
        }"
        @click="handleButtonClick(button)"
      />

      <div
        v-if="isEditing && buttons.length === 0"
        class="text-sm text-gray-400 italic border border-dashed border-gray-300 rounded p-2 text-center"
      >
        No buttons configured
      </div>
    </div>
  </div>
</template>

<!-- No custom styles needed - using inline Tailwind classes -->
