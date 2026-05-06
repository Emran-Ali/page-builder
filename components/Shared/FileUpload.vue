<script setup lang="ts">
import {ref, watch} from "vue";
import {getImageVersions} from "@utils/file-versions";
import type {AxiosRequestConfig} from "axios";
import InputText from "primevue/inputtext";

const emit = defineEmits(["update:model-value"]);
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    imageVersion?: "original" | "optimized" | "thumb";
  }>(),
  {
    modelValue: "",
    imageVersion: "original",
  },
);

const isUploading = ref(false);
const uploadProgress = ref(0);
const activeTab = ref("upload");
const imageUrl = ref(props.modelValue);

// Update imageUrl when modelValue changes from outside
watch(
  () => props.modelValue,
  (newVal) => {
    imageUrl.value = newVal;
  },
);

// Logic to switch tab if initialized with a URL
if (props.modelValue && props.modelValue.startsWith("http")) {
  activeTab.value = "link";
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  // Upload the file immediately
  isUploading.value = true;
  uploadProgress.value = 0;

  try {
    const formData = new FormData();
    formData.append("file", file!);

    const response = await uploadFile({
      file: formData,
      url: "page-builder",
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: {loaded: number; total?: number}) => {
          if (progressEvent.total) {
            uploadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
          }
        },
      },
      showSuccessToast: true,
    });

    // Extract URL from response
    const fileUrl = response?.data || null;

    if (fileUrl) {
      // Set the attachment field value
      const finalUrl = getImageVersions(fileUrl)[props.imageVersion];
      imageUrl.value = finalUrl;
      emit("update:model-value", finalUrl);
      // Stay on upload tab
      activeTab.value = "upload";
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  } finally {
    // Reset input value
    if (target) {
      target.value = "";
    }
    isUploading.value = false;
  }
}

async function uploadFile({
  file,
  url,
  config,
  showSuccessToast = true,
}: {
  file: FormData;
  url: string;
  config?: AxiosRequestConfig;
  showSuccessToast: boolean;
}) {
  const token = useCookie("_admin_token").value;
  const axios = getAdminAxios();
  const {handleSuccess} = useGlobalStore();

  return wrapApiCall("uploadFile", async () => {
    {
      const response = await axios.post(`/file-upload/${url}`, file, {
        ...config,
        headers: {
          Authorization: `Bearer ${token}`,
          ...config?.headers,
        },
      });

      if (showSuccessToast) {
        handleSuccess({
          message: response?.data?.message || "File uploaded successfully",
        });
      }
      return response?.data;
    }
  });
}

const clearImage = () => {
  imageUrl.value = "";
  emit("update:model-value", "");
};
</script>

<template>
  <div class="w-full space-y-4">
    <!-- Image Preview -->
    <div
      v-if="imageUrl"
      class="relative group aspect-video rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center p-1"
    >
      <img
        :src="imageUrl"
        class="max-w-full max-h-full object-contain rounded"
        alt="Preview"
      />
      <div
        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
      >
        <button
          type="button"
          class="p-1.5 bg-white rounded-full shadow-lg hover:bg-red-50 text-red-600 transition-colors"
          title="Remove image"
          @click="clearImage"
        >
          <BaseLucide name="Trash2" :size="16" />
        </button>
      </div>
    </div>

    <!-- Toggle Controls -->
    <div class="flex p-1 bg-gray-100 rounded-lg max-w-fit mx-auto">
      <button
        type="button"
        :class="[
          'flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
          activeTab === 'upload'
            ? 'bg-white text-black shadow-sm'
            : 'text-gray-500 hover:text-gray-700',
        ]"
        @click="activeTab = 'upload'"
      >
        <BaseLucide name="Upload" :size="14" />
        Upload
      </button>
      <button
        type="button"
        :class="[
          'flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
          activeTab === 'link'
            ? 'bg-white text-black shadow-sm'
            : 'text-gray-500 hover:text-gray-700',
        ]"
        @click="activeTab = 'link'"
      >
        <BaseLucide name="Link" :size="14" />
        Link
      </button>
    </div>

    <!-- Upload Area -->
    <div v-if="activeTab === 'upload'" class="space-y-3">
      <label
        class="relative flex flex-col items-center justify-center w-full min-h-[100px] border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer group"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <div
            class="p-2 mb-2 rounded-full bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform"
          >
            <BaseLucide name="UploadCloud" :size="20" class="text-gray-400" />
          </div>
          <p class="text-xs font-medium text-gray-700">Click to upload</p>
          <p class="mt-1 text-[10px] text-gray-400">
            PNG, JPG or JPEG (Max 10MB)
          </p>
        </div>
        <input
          type="file"
          class="hidden"
          :disabled="isUploading"
          accept=".png,.jpg,.jpeg"
          @change="handleFileUpload"
        />

        <!-- Upload Progress Overlay -->
        <div
          v-if="isUploading"
          class="absolute inset-0 bg-white/80 rounded-xl flex flex-col items-center justify-center p-4"
        >
          <div class="w-full max-w-[120px]">
            <div
              class="flex items-center justify-between text-[10px] text-gray-600 mb-1"
            >
              <span>Uploading...</span>
              <span>{{ uploadProgress }}%</span>
            </div>
            <ProgressBar
              :value="uploadProgress"
              :show-value="false"
              :pt="{
                root: {class: '!h-1.5 rounded-full bg-gray-100'},
                value: {class: '!h-1.5 rounded-full bg-primary'},
              }"
            />
          </div>
        </div>
      </label>
    </div>

    <!-- Link Area -->
    <div
      v-if="activeTab === 'link'"
      class="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <BaseLucide name="Link" :size="14" />
        </span>
        <InputText
          v-model="imageUrl"
          placeholder="Paste image URL here..."
          class="w-full !pl-9"
          size="small"
          @update:model-value="emit('update:model-value', $event)"
        />
      </div>
      <p class="text-[10px] text-gray-400 px-1">
        Supports direct image links from CDNs or web
      </p>
    </div>
  </div>
</template>
