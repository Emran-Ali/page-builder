<script setup>
import Image from 'primevue/image'

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
  quote: {
    type: String,
    default:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever.",
  },
  authorName: {
    type: String,
    default: 'Wade Warren',
  },
  authorRole: {
    type: String,
    default: 'Naperville',
  },
  authorImage: {
    type: String,
    default: '',
  },

  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:props'])

const updateQuote = (event) => {
  emit('update:props', { quote: event.target.innerText })
}

const updateAuthorName = (event) => {
  emit('update:props', { authorName: event.target.innerText })
}

const updateAuthorRole = (event) => {
  emit('update:props', { authorRole: event.target.innerText })
}

const handleImageError = (_event) => {
  console.warn('Author image failed to load:', props.authorImage)
}
</script>

<template>
  <div
    :data-component-id="id"
    class="box-border flex flex-col items-start gap-4 px-8 py-8 w-full bg-[#FBFFF0] border border-[#D2FB54] rounded-lg"
  >
    <!-- Quote Icon -->
    <div class="text-2xl leading-none mb-2">
      <svg
        width="68"
        height="47"
        viewBox="0 0 68 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12.6281 10.587C13.7116 10.3252 14.8191 10.1933 15.93 10.194C24.7275 10.194 31.8572 18.342 31.8572 28.389C31.8572 38.439 24.7275 46.587 15.93 46.587C7.1325 46.587 0 38.442 0 28.389C0 28.095 0.005625 27.798 0.0196875 27.504H0C0 12.339 10.8 0 24.075 0V6.108C19.7691 6.108 15.7978 7.782 12.6281 10.587ZM48.2738 10.587C49.3369 10.329 50.4394 10.194 51.57 10.194C60.3675 10.194 67.5 18.342 67.5 28.389C67.5 38.439 60.3675 46.587 51.57 46.587C42.7725 46.587 35.6428 38.442 35.6428 28.389C35.6428 28.095 35.6484 27.798 35.6625 27.504H35.6428C35.6428 12.339 46.4428 0 59.7178 0V6.108C55.4091 6.108 51.4434 7.782 48.2738 10.587Z"
          fill="#D2FB54"
        />
      </svg>
    </div>

    <!-- Quote Text -->
    <p
      class="text-xl leading-relaxed text-gray-800 font-medium italic mb-2 m-0"
      :class="{
        'outline-2 outline-dashed outline-blue-500 outline-offset-2 rounded':
          isEditing,
        'outline-2 outline-solid outline-blue-600 bg-white/50':
          isEditing && document.activeElement === $el,
      }"
      :contenteditable="isEditing"
      @blur="updateQuote"
    >
      {{ quote }}
    </p>

    <!-- Author Section -->
    <div class="flex items-center gap-4 mt-auto">
      <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <Image
          v-if="authorImage"
          :src="authorImage"
          alt="Author"
          image-class="author-image"
          @error="handleImageError"
        />
        <div
          v-else
          class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400"
        >
          <i class="pi pi-user" />
        </div>
      </div>

      <div class="flex flex-col">
        <h4
          class="text-base font-bold text-gray-900 m-0"
          :class="{
            'outline-2 outline-dashed outline-blue-500 outline-offset-2 rounded':
              isEditing,
            'outline-2 outline-solid outline-blue-600 bg-white/50':
              isEditing && document.activeElement === $el,
          }"
          :contenteditable="isEditing"
          @blur="updateAuthorName"
        >
          {{ authorName }}
        </h4>
        <p
          class="text-sm text-gray-500 m-0"
          :class="{
            'outline-2 outline-dashed outline-blue-500 outline-offset-2 rounded':
              isEditing,
            'outline-2 outline-solid outline-blue-600 bg-white/50':
              isEditing && document.activeElement === $el,
          }"
          :contenteditable="isEditing"
          @blur="updateAuthorRole"
        >
          {{ authorRole }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.author-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
