<script setup>
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { ref, watch } from 'vue'
import { usePageBuilderStore } from '~/stores/pageBuilder'
import TeacherSelectionDialog from './OfflineTeacherSelectionDialog.vue'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const areaOptions = [
  { label: 'Los Angeles Metro', value: 'California' },
  { label: 'San Francisco Bay Area', value: 'San Francisco Bay Area' },
  { label: 'Portland Metro', value: 'Portland, Oregon' },
]

const store = usePageBuilderStore()
const localProps = ref({})
const showTeacherDialog = ref(false)
const commonStore = useCommonStore()
const disciplines = computed(() => commonStore.getAllDisciplines)

const selectedArea = ref('California')
const selectedDisciplines = ref([])

watch(
  () => props.component,
  (newComponent) => {
    if (newComponent && newComponent.type === 'offlineteacherlist') {
      localProps.value = { ...newComponent.props }
    }
  },
  { immediate: true, deep: true }
)

const updateProps = () => {
  if (props.component) {
    store.updateComponentProps(props.component.id, localProps.value)
  }
}

const updateProp = (key, value) => {
  localProps.value[key] = value
  updateProps()
}

const headingOptions = [
  { label: 'Heading 1', value: 'h1' },
  { label: 'Heading 2', value: 'h2' },
  { label: 'Heading 3', value: 'h3' },
]

const severityOptions = [
  { label: 'Primary', value: 'primary' },
  { label: 'Secondary', value: 'secondary' },
  // { label: 'Success', value: 'success' },
  // { label: 'Info', value: 'info' },
  // { label: 'Warning', value: 'warning' },
  // { label: 'Help', value: 'help' },
  // { label: 'Danger', value: 'danger' },
]

const variantOptions = [
  { label: 'Filled', value: 'filled' },
  { label: 'Outlined', value: 'outlined' },
  { label: 'Text', value: 'text' },
]

const viewModeOptions = [
  { label: 'Grid View', value: 'grid' },
  { label: 'List View', value: 'list' },
]

const itemsPerPageOptions = [
  { label: '4', value: 4 },
  { label: '8', value: 8 },
  { label: '12', value: 12 },
  { label: '16', value: 16 },
  { label: '20', value: 20 },
  { label: '24', value: 24 },
]

const removeTeacher = (index) => {
  if (localProps.value.teachers && localProps.value.teachers[index]) {
    localProps.value.teachers.splice(index, 1)
    updateProps()
  }
}

const addButton = () => {
  if (!localProps.value.buttons) localProps.value.buttons = []
  localProps.value.buttons.push({
    label: 'New Button',
    link: '#',
    severity: 'primary',
    variant: 'filled',
  })
  updateProps()
}

const removeButton = (index) => {
  if (localProps.value.buttons && localProps.value.buttons[index]) {
    localProps.value.buttons.splice(index, 1)
    updateProps()
  }
}

const updateButton = (index, key, value) => {
  if (localProps.value.buttons && localProps.value.buttons[index]) {
    localProps.value.buttons[index][key] = value
    updateProps()
  }
}

const openTeacherDialog = () => {
  showTeacherDialog.value = true
}

// Map API teacher data to store format
const mapApiTeacherToStoreFormat = (apiTeacher) => {
  // Get first 3 disciplines
  const disciplines =
    apiTeacher.teacherDisciplines
      ?.slice(0, 3)
      ?.map((d) => d.name)
      ?.join(', ') || ''

  // Get first language
  const language = apiTeacher.teacherLanguages?.[0]?.language || 'English'

  // Create fallback image text from first name
  const imageText = apiTeacher.firstName?.charAt(0)?.toUpperCase() || 'T'

  return {
    id: apiTeacher.id,
    slug: apiTeacher.slug,
    image: apiTeacher.avatarUrl || '',
    name: `${apiTeacher.firstName || ''} ${apiTeacher.lastName ? apiTeacher.lastName.charAt(0).toUpperCase() + '.' : ''}`.trim(),
    discipline: disciplines,
    rating: apiTeacher.rating?.toString() || '0',
    ratingCount: apiTeacher.ratingCount?.toString() || '0',
    students: apiTeacher.totalStudents?.toString() || '0',
    profileSummary: apiTeacher.profileSummary || '',
    language: language,
    imageText: imageText,
  }
}

const handleTeacherSelection = (selectedTeachers) => {
  // Map API data to store format
  const mappedTeachers = selectedTeachers.map(mapApiTeacherToStoreFormat)

  // Update local props with mapped teachers
  localProps.value.teachers = mappedTeachers

  updateProps()

  // Close dialog
  showTeacherDialog.value = false

  console.log('Teachers selected and mapped:', mappedTeachers)
}

const handleDialogCancel = () => {
  showTeacherDialog.value = false
  console.log('Dialog cancelled')
}
onMounted(() => {
  commonStore.fetchAllDisciplines()
})
</script>

<template>
  <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-6">
    <h3 class="font-medium text-gray-900 mb-4">
      Offline Teacher List Settings
    </h3>

    <!-- Heading -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Heading Level
        </label>
        <Dropdown
          :model-value="localProps.titleTag || 'h2'"
          :options="headingOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          size="small"
          @update:model-value="updateProp('titleTag', $event)"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2"
          >Title</label
        >
        <InputText
          v-model="localProps.title"
          type="text"
          placeholder="Enter title"
          class="w-full rounded-[5px]"
          size="small"
          @input="updateProp('title', $event.target.value)"
        />
      </div>
    </div>

    <!-- Paragraph -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Paragraph
        </label>
        <Textarea
          v-model="localProps.paragraph"
          rows="3"
          class="w-full rounded-[5px]"
          size="small"
          placeholder="Enter paragraph (press Enter for new line)"
          @input="updateProp('paragraph', $event.target.value)"
        />
      </div>
    </div>

    <!-- View Mode -->
    <div class="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          View Mode
        </label>
        <Dropdown
          :model-value="localProps.viewMode || 'grid'"
          :options="viewModeOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          size="small"
          @update:model-value="updateProp('viewMode', $event)"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select Area
        </label>

        <Select
          v-model="selectedArea"
          :options="areaOptions"
          option-label="label"
          option-value="value"
          placeholder="Select an Area"
          class="w-full"
          size="small"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select Discipline
        </label>

        <MultiSelect
          v-model="selectedDisciplines"
          :options="disciplines"
          class="w-full"
          display="chip"
          option-label="name"
          option-value="id"
          size="small"
          placeholder="Select the discipline items"
          :max-selected-labels="2"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Teachers per page
        </label>
        <Dropdown
          :model-value="localProps.itemsPerPage || 12"
          :options="itemsPerPageOptions"
          option-label="label"
          option-value="value"
          class="w-full"
          size="small"
          @update:model-value="updateProp('itemsPerPage', $event)"
        />
      </div>
      <div />
      <Button size="small" class="w-full" @click="openTeacherDialog">
        <BaseLucide name="Users" :size="16" />
        Select Offline Teachers
      </Button>
    </div>

    <!-- Teachers -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-800">Selected Teachers</h4>
      </div>

      <!-- Selected Teachers Display -->
      <div
        v-if="localProps.teachers && localProps.teachers.length > 0"
        class="space-y-4"
      >
        <div
          v-for="(teacher, index) in localProps.teachers"
          :key="teacher.id || index"
          class="border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img
                v-if="teacher.image"
                :src="teacher.image"
                :alt="teacher.name"
                class="w-10 h-10 rounded-full object-cover"
              />
              <div
                v-else
                class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold"
              >
                {{ teacher.imageText || teacher.name?.charAt(0) || 'T' }}
              </div>
              <div>
                <h5 class="font-medium text-gray-700">{{ teacher.name }}</h5>
                <p class="text-sm text-gray-500">{{ teacher.discipline }}</p>
              </div>
            </div>
            <Button
              severity="danger"
              text
              size="small"
              class="flex items-center gap-1"
              @click="removeTeacher(index)"
            >
              <BaseLucide name="Trash2" :size="16" />
            </Button>
          </div>

          <div class="flex flex-col text-sm gap-2 flex-wrap">
            <div>
              <span class="text-gray-500">Rating:</span>
              <span class="ml-1">{{ teacher.rating }}</span>
            </div>
            <div>
              <span class="text-gray-500">Students:</span>
              <span class="ml-1">{{ teacher.students }}</span>
            </div>
            <div>
              <span class="text-gray-500">Language:</span>
              <span class="ml-1 f">{{ teacher.language }}</span>
            </div>
          </div>

          <div v-if="teacher.profileSummary" class="text-sm text-gray-600">
            <span class="text-gray-500">Summary:</span>
            <p class="mt-1">{{ teacher.profileSummary }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-4 text-gray-500">
        No teachers selected. Click "Select Teachers" to choose from available
        teachers.
      </div>
    </div>

    <!-- Buttons -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-800">Buttons</h4>
        <Button variant="outlined" size="small" @click="addButton">
          <BaseLucide name="Plus" :size="16" />
        </Button>
      </div>

      <div
        v-if="localProps.buttons && localProps.buttons.length > 0"
        class="space-y-4"
      >
        <div
          v-for="(button, index) in localProps.buttons"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 space-y-3"
        >
          <div class="flex items-center justify-between">
            <h5 class="font-medium text-gray-700">Button {{ index + 1 }}</h5>
            <Button
              severity="danger"
              text
              size="small"
              class="flex items-center gap-1"
              @click="removeButton(index)"
            >
              <BaseLucide name="Trash2" :size="16" />
            </Button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Label
              </label>
              <InputText
                type="text"
                class="w-full rounded-[5px]"
                size="small"
                placeholder="Button label"
                :value="button.label"
                @input="updateButton(index, 'label', $event.target.value)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Link URL
              </label>
              <InputText
                type="text"
                class="w-full rounded-[5px]"
                size="small"
                placeholder="https://example.com"
                :value="button.link"
                @input="updateButton(index, 'link', $event.target.value)"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <Dropdown
                :model-value="button.severity || 'primary'"
                :options="severityOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                size="small"
                @update:model-value="updateButton(index, 'severity', $event)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Variant
              </label>
              <Dropdown
                :model-value="button.variant || 'filled'"
                :options="variantOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                size="small"
                @update:model-value="updateButton(index, 'variant', $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-4 text-gray-500">
        No buttons configured. Click "Add" to create one.
      </div>
    </div>

    <!-- Teacher Selection Dialog -->
    <TeacherSelectionDialog
      v-model:visible="showTeacherDialog"
      :filter-disciplines="selectedDisciplines"
      :filter-area="selectedArea"
      @select-teachers="handleTeacherSelection"
      @cancel="handleDialogCancel"
    />
  </div>
</template>
