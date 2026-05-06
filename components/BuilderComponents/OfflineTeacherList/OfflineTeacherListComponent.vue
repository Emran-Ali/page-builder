<script setup>
import Button from "primevue/button";
import {computed, ref, watch} from "vue";
import RatingEmptyStarIcon from "@components/base/icons/RatingEmptyStarIcon.vue";
import RatingFullStarIcon from "@components/base/icons/RatingFullStarIcon.vue";
import RatingHalfStarIcon from "@components/base/icons/RatingHalfStarIcon.vue";
import VarifiedTickMarkIcon from "@components/base/icons/VarifiedTickMarkIcon.vue";
import QueryOfflineTeacherForm from "@components/views/OfflineLesson/QueryOfflineTeacherForm.vue";
import {usePageBuilderStore} from "@layers/page-builder/stores/pageBuilder";
import {
  headingClassMap,
  paragraphBaseClass,
} from "../../../utils/headingClasses";

const props = defineProps({
  id: {type: String, default: ""},
  title: {type: String, default: ""},
  titleTag: {type: String, default: "h2"},
  paragraph: {type: String, default: ""},
  teachers: {
    type: Array,
    default: () => [],
  },
  buttons: {
    type: Array,
    default: () => [],
  },
  viewMode: {type: String, default: "grid"}, // 'grid' or 'list'
  isEditing: {type: Boolean, default: false},
  itemsPerPage: {type: Number, default: 12},
});

const emit = defineEmits(["update:props"]);

const store = usePageBuilderStore();
const isPreview = computed(() => store.isPreview);

const currentPage = ref(1);
const teacherSlug = ref("");
const showOfflineQueryForm = ref(false);
const paginatedTeachers = computed(() => {
  if (!hasTeachers.value) return [];
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.teachers.slice(start, end);
});

const getActualIndex = (localIndex) => {
  return hasTeachers.value
    ? (currentPage.value - 1) * props.itemsPerPage + localIndex
    : 0;
};

const pagination = computed(() => {
  const totalItems = props.teachers.length;
  const totalPages = Math.ceil(totalItems / props.itemsPerPage);
  return {
    currentPage: currentPage.value,
    totalPages: totalPages,
    hasNextPage: currentPage.value < totalPages,
    hasPreviousPage: currentPage.value > 1,
  };
});

const handlePageChange = (page) => {
  currentPage.value = page;
  const el = document.querySelector(`[data-component-id="${props.id}"]`);
  if (el) {
    el.scrollIntoView({behavior: "smooth", block: "start"});
  }
};

watch(
  () => props.teachers,
  () => {
    currentPage.value = 1;
  },
  {deep: true},
);

const hasTitle = computed(() => props.title && props.title.trim().length > 0);
const hasParagraph = computed(
  () => props.paragraph && props.paragraph.trim().length > 0,
);
const hasTeachers = computed(() => props.teachers && props.teachers.length > 0);
const hasButtons = computed(() => props.buttons && props.buttons.length > 0);

const headingClass = computed(
  () => headingClassMap[props.titleTag] || headingClassMap.h2,
);

const getParagraphs = (text) => {
  if (!text) return [];
  return text
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
};

const updateTitle = (event) => {
  emit("update:props", {title: event.target.innerText});
};

const updateParagraph = (event) => {
  emit("update:props", {paragraph: event.target.innerText});
};

const updateTeacher = (index, key, value) => {
  const updated = [...props.teachers];
  updated[index] = {...updated[index], [key]: value};
  emit("update:props", {teachers: updated});
};

const getButtonHoverClasses = (button) => {
  const variant = button.variant || "filled";
  if (variant === "filled") return "hover:brightness-95";
  if (variant === "outlined")
    return "hover:!text-black hover:!ring-1 hover:!ring-black";
  return "hover:underline hover:!text-black";
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

const handleBookLessonClick = (slug) => {
  if (!isPreview.value) return;
  if (!slug) return;
  teacherSlug.value = slug;
  showOfflineQueryForm.value = true;
};

const handleTeacherNameClick = (slug) => {
  if (!isPreview.value) return;
  if (!slug) return;

  navigateTo(`/teacher-profile/${slug}?teachingMode=offline`);
};
</script>

<template>
  <div :data-component-id="id" class="w-full box-border">
    <div class="flex flex-col">
      <!-- Title -->
      <component
        :is="titleTag"
        v-if="hasTitle || isEditing"
        :contenteditable="isEditing"
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
          >
            {{ para }}
          </p>
        </template>
        <p v-else class="text-gray-400 italic">
          {{ isEditing ? "Enter paragraph text..." : "" }}
        </p>
      </div>

      <!-- Teacher Grid View -->
      <div
        v-if="viewMode === 'grid'"
        class="border border-gray-200 rounded-lg px-4 py-6"
      >
        <div
          v-if="hasTeachers || isEditing"
          class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 mb-6"
        >
          <div
            v-for="(teacher, localIndex) in hasTeachers
              ? paginatedTeachers
              : [
                  {
                    image: '',
                    name: 'Jonah Hill',
                    discipline: 'Guitar, Voice, Songwriting',
                    rating: '4.9',
                    students: '230',
                    price: '20',
                    profileSummary: '',
                    language: '',
                  },
                ]"
            :key="localIndex"
            class="flex flex-col items-start justify-between h-full rounded-lg cursor-pointer"
            @click="handleTeacherNameClick(teacher.slug)"
          >
            <!-- Teacher Image -->
            <div class="w-full mb-5">
              <img
                v-if="teacher.image"
                :src="teacher.image"
                alt="Teacher Photo"
                class="rounded-lg aspect-square object-cover w-full"
              />
              <div
                v-else
                class="rounded-lg aspect-square w-full bg-gray-200 flex items-center justify-center text-6xl font-bold text-gray-400"
                :contenteditable="isEditing"
                @blur="
                  updateTeacher(
                    getActualIndex(localIndex),
                    'imageText',
                    $event.target.innerText,
                  )
                "
              >
                {{
                  teacher.imageText ||
                  (teacher.name ? teacher.name.charAt(0) : "3")
                }}
              </div>
            </div>

            <!-- Rating -->
            <div
              v-if="teacher.ratingCount > 0"
              class="inline-flex items-center justify-start text-sm mb-2"
            >
              <div
                class="outline-none"
                :class="{
                  'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                    isEditing,
                  'text-gray-400 italic': isEditing && !teacher.rating,
                }"
                :contenteditable="isEditing"
                @blur="
                  updateTeacher(
                    getActualIndex(localIndex),
                    'rating',
                    $event.target.innerText,
                  )
                "
              >
                {{ teacher.rating || (isEditing ? "4.9" : "4.9") }}
              </div>
              <div class="flex mx-4">
                <template v-for="i in 5" :key="i">
                  <!-- Full star -->
                  <RatingFullStarIcon
                    v-if="i <= Math.floor(teacher.rating)"
                    custom-class="h-3.5 w-3.5"
                  />

                  <!-- Half star -->
                  <RatingHalfStarIcon
                    v-else-if="i - 0.5 <= teacher.rating"
                    custom-class="h-3.5 w-3.5"
                  />

                  <!-- Empty star -->
                  <RatingEmptyStarIcon v-else custom-class="h-3.5 w-3.5" />
                </template>
              </div>
              <div
                class="outline-none"
                :class="{
                  'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                    isEditing,
                  'text-gray-400 italic': isEditing && !teacher.students,
                }"
                :contenteditable="isEditing"
                @blur="
                  updateTeacher(
                    getActualIndex(localIndex),
                    'students',
                    $event.target.innerText,
                  )
                "
              >
                ({{ teacher.ratingCount || (isEditing ? "0" : "0") }})
              </div>
            </div>

            <!-- Teacher Name -->
            <div class="inline-flex items-center justify-start mb-2">
              <h2
                class="text-[#222] mr-2 font-medium outline-none"
                :class="{
                  'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                    isEditing,
                  'text-gray-400 italic': isEditing && !teacher.name,
                }"
                :contenteditable="isEditing"
                @blur="
                  updateTeacher(
                    getActualIndex(localIndex),
                    'name',
                    $event.target.innerText,
                  )
                "
              >
                {{ teacher.name || (isEditing ? "Jonah Hill" : "Jonah Hill") }}
              </h2>
              <div className="mx-2">
                <VarifiedTickMarkIcon />
              </div>
            </div>

            <!-- Discipline -->
            <p
              :class="[
                paragraphBaseClass,
                'outline-none',
                {
                  'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                    isEditing,
                  'text-gray-400 italic': isEditing && !teacher.discipline,
                },
              ]"
              :contenteditable="isEditing"
              @blur="
                updateTeacher(
                  getActualIndex(localIndex),
                  'discipline',
                  $event.target.innerText,
                )
              "
            >
              {{
                teacher.discipline ||
                (isEditing
                  ? "Guitar, Voice, Songwriting"
                  : "Guitar, Voice, Songwriting")
              }}
            </p>

            <!-- Price -->
            <!-- <p class="mt-2">
              <span
                class="text-black font-medium outline-none"
                :class="{
                  'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                    isEditing,
                  'text-gray-400 italic': isEditing && !teacher.price,
                }"
                :contenteditable="isEditing"
                @blur="
                  updateTeacher(
                    getActualIndex(localIndex),
                    'price',
                    $event.target.innerText
                  )
                "
              >
                ${{ teacher.price || (isEditing ? '$20' : '$20') }}
              </span>
              <span class="text-[#585D69] text-sm"> / lesson</span>
            </p> -->
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="hasTeachers && pagination.totalPages > 1" class="mt-4">
          <SharedPagination
            :current-page="pagination.currentPage"
            :total-pages="pagination.totalPages"
            :has-next-page="pagination.hasNextPage"
            :has-previous-page="pagination.hasPreviousPage"
            @page-change="handlePageChange"
          />
        </div>
        <!-- Buttons -->
        <div
          v-if="hasButtons || isEditing"
          class="flex flex-wrap gap-3 mt-6"
          :class="{'pointer-events-none opacity-75': isEditing}"
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
            class="!px-4"
            :class="getButtonHoverClasses(button)"
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

      <!-- Teacher List View -->
      <div v-if="viewMode === 'list'" class="space-y-4">
        <div v-if="hasTeachers || isEditing" class="space-y-4 mb-6">
          <div
            v-for="(teacher, localIndex) in hasTeachers
              ? paginatedTeachers
              : [
                  {
                    image: '',
                    name: 'Irene',
                    discipline:
                      'Guitar, Voice, Songwriting, Piano, Bass Guitar',
                    rating: '4.9',
                    students: '229',
                    price: '20',
                    profileSummary:
                      'With over 10 years of musical experience, Chloe has been teaching songwriting, voice, and guitar for two years.',
                    language: 'English & Spanish',
                    lessons: '11',
                  },
                ]"
            :key="localIndex"
            class="flex flex-col sm:flex-row sm:gap-4 p-6 border border-gray-200 rounded-lg"
          >
            <!-- Teacher Image and Button -->
            <div class="flex-shrink-0 flex flex-col items-start">
              <div class="mb-4">
                <img
                  v-if="teacher.image"
                  :src="teacher.image"
                  alt="Teacher Photo"
                  class="rounded-lg w-40 h-40 sm:w-48 sm:h-48 object-cover"
                />
                <div
                  v-else
                  class="rounded-lg w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 flex items-center justify-center text-6xl font-bold text-gray-400"
                  :contenteditable="isEditing"
                  @blur="
                    updateTeacher(
                      getActualIndex(localIndex),
                      'imageText',
                      $event.target.innerText,
                    )
                  "
                >
                  {{
                    teacher.imageText ||
                    (teacher.name ? teacher.name.charAt(0) : "1")
                  }}
                </div>
              </div>

              <!-- Book Lesson Button -->
              <Button
                :label="`Query for In-person Lesson`"
                size="small"
                rounded
                class="!hidden sm:!block"
                :disabled="isEditing"
                @click="handleBookLessonClick(teacher.slug)"
              />
            </div>

            <!-- Teacher Info -->
            <div class="flex-1 min-w-0">
              <!-- Name and Badges -->
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <h3
                  class="text-lg sm:text-xl font-semibold text-gray-900 outline-none"
                  :class="{
                    'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                      isEditing,
                    'text-gray-400 italic': isEditing && !teacher.name,
                    'cursor-pointer hover:underline': isPreview,
                  }"
                  :contenteditable="isEditing"
                  @blur="
                    updateTeacher(
                      getActualIndex(localIndex),
                      'name',
                      $event.target.innerText,
                    )
                  "
                  @click="handleTeacherNameClick(teacher.slug)"
                >
                  {{ teacher.name || (isEditing ? "Irene" : "Irene") }}
                </h3>
                <VarifiedTickMarkIcon />
                <BaseBadge class="bg-pear" label="Best Seller" />
              </div>

              <!-- Discipline -->
              <p
                :class="[
                  paragraphBaseClass,
                  'outline-none',
                  {
                    'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                      isEditing,
                    'text-gray-400 italic': isEditing && !teacher.discipline,
                  },
                ]"
                :contenteditable="isEditing"
                @blur="
                  updateTeacher(
                    getActualIndex(localIndex),
                    'discipline',
                    $event.target.innerText,
                  )
                "
              >
                {{
                  teacher.discipline ||
                  (isEditing
                    ? "Guitar, Voice, Songwriting, Piano, Bass Guitar"
                    : "Guitar, Voice, Songwriting, Piano, Bass Guitar")
                }}
              </p>

              <!-- Stats -->
              <div
                class="flex flex-wrap items-center gap-3 sm:gap-6 text-sm text-gray-600 mb-3"
              >
                <div class="flex items-center gap-1">
                  <BaseLucide :size="16" name="Users" class="mr-2" />
                  <span
                    class="outline-none"
                    :class="{
                      'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                        isEditing,
                    }"
                    :contenteditable="isEditing"
                    @blur="
                      updateTeacher(
                        getActualIndex(localIndex),
                        'students',
                        $event.target.innerText,
                      )
                    "
                  >
                    {{ teacher.students || "229" }}
                  </span>
                  <span>Students</span>
                </div>
                <Divider class="h-5 mx-0" layout="vertical" />
                <div class="flex items-center gap-2">
                  <span
                    class="outline-none"
                    :class="{
                      'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                        isEditing,
                    }"
                    :contenteditable="isEditing"
                    @blur="
                      updateTeacher(
                        getActualIndex(localIndex),
                        'rating',
                        $event.target.innerText,
                      )
                    "
                  >
                    {{ teacher.rating || "4.9" }}
                  </span>
                  <div class="flex">
                    <template v-for="i in 5" :key="i">
                      <RatingFullStarIcon
                        v-if="i <= Math.floor(teacher.rating)"
                        custom-class="h-3.5 w-3.5"
                      />
                      <RatingHalfStarIcon
                        v-else-if="i - 0.5 <= teacher.rating"
                        custom-class="h-3.5 w-3.5"
                      />
                      <RatingEmptyStarIcon v-else custom-class="h-3.5 w-3.5" />
                    </template>
                  </div>
                  <span>({{ teacher.ratingCount || "0" }})</span>
                </div>
              </div>

              <!-- Profile Summary -->
              <p
                :class="[
                  paragraphBaseClass,
                  'outline-none',
                  {
                    'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                      isEditing,
                    'text-gray-400 italic':
                      isEditing && !teacher.profileSummary,
                  },
                ]"
                :contenteditable="isEditing"
                @blur="
                  updateTeacher(
                    getActualIndex(localIndex),
                    'profileSummary',
                    $event.target.innerText,
                  )
                "
              >
                {{
                  teacher.profileSummary ||
                  (isEditing
                    ? "With over 10 years of musical experience, Chloe has been teaching songwriting, voice, and guitar for two years."
                    : "With over 10 years of musical experience, Chloe has been teaching songwriting, voice, and guitar for two years.")
                }}
              </p>

              <!-- Language -->
              <p :class="paragraphBaseClass">
                <span>{{ teacher.name || "Chloe Bennett" }} Speaks</span>
                <span
                  class="outline-none ml-1 font-medium"
                  :class="{
                    'border border-dashed border-gray-300 min-h-[1em] p-1 rounded':
                      isEditing,
                    'text-gray-400 italic': isEditing && !teacher.language,
                  }"
                  :contenteditable="isEditing"
                  @blur="
                    updateTeacher(
                      getActualIndex(localIndex),
                      'language',
                      $event.target.innerText,
                    )
                  "
                >
                  {{
                    teacher.language ||
                    (isEditing ? "English & Spanish" : "English & Spanish")
                  }}
                </span>
              </p>
              <!-- Book Lesson Button -->
              <Button
                :label="'Query for In-person Lesson'"
                size="small"
                rounded
                class="!block !w-full sm:!hidden !mt-4"
                :disabled="isEditing"
                @click="handleBookLessonClick(teacher.slug)"
              />
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="hasTeachers && pagination.totalPages > 1" class="mt-4 mb-8">
          <SharedPagination
            :current-page="pagination.currentPage"
            :total-pages="pagination.totalPages"
            :has-next-page="pagination.hasNextPage"
            :has-previous-page="pagination.hasPreviousPage"
            @page-change="handlePageChange"
          />
        </div>

        <!-- Buttons for List View -->
        <div
          v-if="hasButtons || isEditing"
          class="flex flex-wrap gap-3 mt-6"
          :class="{'pointer-events-none opacity-75': isEditing}"
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
            :class="getButtonHoverClasses(button)"
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
    <Dialog
      v-model:visible="showOfflineQueryForm"
      modal
      :block-scroll="true"
      header="Submit In-person Lesson Query"
      :style="{width: '40rem', maxWidth: '95vw'}"
    >
      <QueryOfflineTeacherForm
        :teacher-slug="teacherSlug"
        @on-close="showOfflineQueryForm = false"
      />
    </Dialog>
  </div>
</template>
