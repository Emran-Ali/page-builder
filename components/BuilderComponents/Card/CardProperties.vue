<script setup>
import {ref, watch} from "vue";
import {usePageBuilderStore} from "@stores/pageBuilder";

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
});

const store = usePageBuilderStore();
const cardProps = ref({});

// Watch for component prop changes
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === "card") {
      cardProps.value = {...newComponent.props};
    }
  },
  {immediate: true, deep: true},
);

// Update function
const updateCardProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, cardProps.value);
  }
};

// Set alignment function
const setAlignment = (alignment) => {
  cardProps.value.styling.alignment = alignment;
  updateCardProps();
};
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200">
    <h3 class="font-medium text-gray-900 mb-4">Card Settings</h3>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <InputText
          v-model="cardProps.title"
          type="text"
          class="w-full rounded-[5px]"
          size="small"
          @update:model-value="updateCardProps"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <Textarea
          v-model="cardProps.content"
          rows="3"
          class="w-full rounded-[5px]"
          size="small"
          @update:model-value="updateCardProps"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image URL
        </label>
        <InputText
          v-model="cardProps.image"
          type="url"
          placeholder="https://example.com/image.jpg"
          class="w-full rounded-[5px]"
          size="small"
          @update:model-value="updateCardProps"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Image Position
        </label>
        <Select
          v-model="cardProps.imagePosition"
          class="w-full rounded-[5px]"
          size="small"
          @update:model-value="updateCardProps"
          :options="[
            {label: 'Top', value: 'top'},
            {label: 'Left', value: 'left'},
          ]"
          option-label="label"
          option-value="value"
          placeholder="Select Image Position"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Styling
        </label>
        <div class="space-y-2">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="cardProps.styling.shadow"
              type="checkbox"
              class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4 cursor-pointer"
              @change="updateCardProps"
            />
            <span class="ml-2 text-sm text-gray-700">Shadow</span>
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="cardProps.styling.rounded"
              type="checkbox"
              class="rounded border-gray-300 accent-gray-900 focus:ring-gray-900 w-4 h-4 cursor-pointer"
              @change="updateCardProps"
            />
            <span class="ml-2 text-sm text-gray-700">Rounded corners</span>
          </label>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Alignment
        </label>
        <div class="flex gap-2">
          <div
            @click="setAlignment('left')"
            :class="[
              'flex-1 p-2 border rounded cursor-pointer transition-colors text-center rounded-[5px]',
              cardProps.styling.alignment === 'left'
                ? 'border-gray-500 bg-gray-100 text-gray-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            <div class="text-sm">Left</div>
            <div class="text-xs mt-1">⊣</div>
          </div>
          <div
            @click="setAlignment('center')"
            :class="[
              'flex-1 p-2 border rounded cursor-pointer transition-colors text-center',
              cardProps.styling.alignment === 'center'
                ? 'border-gray-500 bg-gray-100 text-gray-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            <div class="text-sm">Center</div>
            <div class="text-xs mt-1">⊢⊣</div>
          </div>
          <div
            @click="setAlignment('right')"
            :class="[
              'flex-1 p-2 border rounded cursor-pointer transition-colors text-center',
              cardProps.styling.alignment === 'right'
                ? 'border-gray-500 bg-gray-100 text-gray-700 font-semibold'
                : 'border-gray-300 hover:border-gray-400',
            ]"
          >
            <div class="text-sm">Right</div>
            <div class="text-xs mt-1">⊢</div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Padding
        </label>
        <Select
          v-model="cardProps.styling.padding"
          class="w-full rounded-[5px]"
          size="small"
          @update:model-value="updateCardProps"
          :options="[
            {label: 'None', value: 'none'},
            {label: 'X-Small', value: 'xsmall'},
            {label: 'Small', value: 'small'},
            {label: 'Medium', value: 'medium'},
            {label: 'Large', value: 'large'},
            {label: 'X-Large', value: 'xlarge'},
            {label: 'XX-Large', value: 'xxlarge'},
          ]"
          option-label="label"
          option-value="value"
          placeholder="Select Padding"
        />
      </div>
    </div>
  </div>
</template>
