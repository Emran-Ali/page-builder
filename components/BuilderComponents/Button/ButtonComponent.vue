<script setup>
import { computed } from "vue";
import Button from "primevue/button";

const props = defineProps({
  id: String,
  label: {
    type: String,
    default: "Button",
  },
  severity: {
    type: String,
    default: "primary",
  },
  variant: {
    type: String,
    default: "filled",
  },
  size: {
    type: String,
    default: "normal",
  },
  raised: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  link: {
    type: String,
    default: "",
  },
  target: {
    type: String,
    default: "_self",
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  alignment: {
    type: String,
    default: "left",
  },
  marginHorizontal: {
    type: String,
    default: "0px",
  },
  marginVertical: {
    type: String,
    default: "0px",
  },
  paddingHorizontal: {
    type: String,
    default: "0px",
  },
  paddingVertical: {
    type: String,
    default: "0px",
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:props", "click"]);

// Computed styles for wrapper
const wrapperStyles = computed(() => ({
  marginLeft: props.marginHorizontal,
  marginRight: props.marginHorizontal,
  marginTop: props.marginVertical,
  marginBottom: props.marginVertical,
  paddingLeft: props.paddingHorizontal,
  paddingRight: props.paddingHorizontal,
  paddingTop: props.paddingVertical,
  paddingBottom: props.paddingVertical,
  width: props.fullWidth ? "100%" : "auto",
  display: props.fullWidth ? "block" : null,
  textAlign: props.alignment,
}));

// Computed alignment class
const alignmentClass = computed(() => {
  const alignmentMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  return alignmentMap[props.alignment] || alignmentMap.left;
});

// Handle button click
const handleClick = (event) => {
  if (props.isEditing) {
    event.preventDefault();
    return;
  }

  emit("click", event);

  if (props.link) {
    if (props.target === "_blank") {
      window.open(props.link, "_blank");
    } else {
      window.location.href = props.link;
    }
  }
};

// Computed button props
const buttonProps = computed(() => {
  const baseProps = {
    label: props.label,
    severity: props.severity === "primary" ? undefined : props.severity,
    variant: props.variant === "filled" ? undefined : props.variant,
    size: props.size === "normal" ? undefined : props.size,
    raised: props.raised || undefined,
    rounded: props.rounded || undefined,
    disabled: props.disabled || props.isEditing,
  };

  return baseProps;
});
</script>

<template>
  <div
    :data-component-id="id"
    :style="wrapperStyles"
    class="button-component"
    :class="[
      alignmentClass,
      {
        'editing-mode': isEditing,
        'cursor-pointer': !isEditing && !disabled,
        'opacity-75': isEditing,
      },
    ]"
  >
    <Button
      v-bind="buttonProps"
      @click="handleClick"
      :style="{ width: fullWidth ? '100%' : 'auto' }"
      :class="{
        'w-full': fullWidth,
        'pointer-events-none': isEditing,
      }"
    />
  </div>
</template>

<style scoped>
.button-component.editing-mode {
  position: relative;
}

.button-component.editing-mode::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px dashed #3b82f6;
  border-radius: 4px;
  pointer-events: none;
  z-index: 1;
}

.editing-mode {
  cursor: move !important;
}

/* Responsive button styling */
@media (max-width: 640px) {
  .button-component {
    width: 100%;
  }

  .button-component .p-button {
    width: 100%;
  }
}
</style>
