<script setup>
import { computed } from "vue";

const props = defineProps({
  id: String,
  content: {
    type: String,
    default: "Sample Text",
  },
  elementType: {
    type: String,
    default: "p",
  },
  fontSize: {
    type: String,
    default: "16px",
  },
  fontWeight: {
    type: String,
    default: "normal",
  },
  isItalic: {
    type: Boolean,
    default: false,
  },
  isUnderline: {
    type: Boolean,
    default: false,
  },
  textAlign: {
    type: String,
    default: "left",
  },
  lineHeight: {
    type: String,
    default: "1.5",
  },
  letterSpacing: {
    type: String,
    default: "0px",
  },
  textColor: {
    type: String,
    default: "#000000",
  },
  backgroundColor: {
    type: String,
    default: "transparent",
  },
  paddingHorizontal: {
    type: String,
    default: "0px",
  },
  paddingVertical: {
    type: String,
    default: "0px",
  },
  marginHorizontal: {
    type: String,
    default: "0px",
  },
  marginVertical: {
    type: String,
    default: "0px",
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:props"]);

// Computed styles
const textStyles = computed(() => ({
  fontSize: props.fontSize,
  fontWeight: props.fontWeight,
  fontStyle: props.isItalic ? "italic" : "normal",
  textDecoration: props.isUnderline ? "underline" : "none",
  textAlign: props.textAlign,
  lineHeight: props.lineHeight,
  letterSpacing: props.letterSpacing,
  color: props.textColor,
  backgroundColor: props.backgroundColor,
  paddingLeft: props.paddingHorizontal,
  paddingRight: props.paddingHorizontal,
  paddingTop: props.paddingVertical,
  paddingBottom: props.paddingVertical,
  marginLeft: props.marginHorizontal,
  marginRight: props.marginHorizontal,
  marginTop: props.marginVertical,
  marginBottom: props.marginVertical,
}));

// Handle content editing
const updateContent = (event) => {
  emit("update:props", { content: event.target.innerText });
};
</script>

<template>
  <component
    :is="elementType"
    :data-component-id="id"
    :style="textStyles"
    :contenteditable="isEditing"
    @blur="updateContent"
    class="text-component outline-none"
    :class="{
      'editing-mode': isEditing,
      'focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50': isEditing,
    }"
  >
    {{ content }}
  </component>
</template>

<style scoped>
.text-component[contenteditable="true"] {
  border: 1px dashed #cbd5e0;
  min-height: 1em;
}

.text-component[contenteditable="true"]:focus {
  border-color: #3b82f6;
  outline: none;
}

.editing-mode {
  cursor: text;
}
</style>
