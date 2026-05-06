<script setup lang="ts">
interface Discipline {
  id: number
  name: string
  logo: string
}

const props = defineProps({
  disciplineOptions: {
    type: Array as () => Discipline[],
    required: true,
  },
  maxSelections: {
    type: Number,
    default: null, // null means unlimited
  },
  showSelectAll: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['filter-change'])

const router = useRouter()
const route = useRoute()

// State management
const selectedDisciplines = ref<Set<number>>(new Set())
const isAllSelected = ref(false)

// Parse query params to get selected discipline IDs
const parseQueryDisciplineIds = (): number[] => {
  const { disciplineIds } = route.query

  if (!disciplineIds) return []

  if (Array.isArray(disciplineIds)) {
    return disciplineIds.map((id) => Number(id)).filter((id) => !isNaN(id))
  }

  // Handle comma-separated string
  if (typeof disciplineIds === 'string') {
    return disciplineIds
      .split(',')
      .map((id) => Number(id))
      .filter((id) => !isNaN(id))
  }

  return []
}

// Sync selections from URL query params
const syncSelectedFiltersFromQueryParams = () => {
  const ids = parseQueryDisciplineIds()

  selectedDisciplines.value.clear()
  ids.forEach((id) => {
    const foundDiscipline = props.disciplineOptions.find(
      (item) => item.id === id
    )
    if (foundDiscipline) {
      selectedDisciplines.value.add(id)
    }
  })

  // Update select all state
  isAllSelected.value =
    selectedDisciplines.value.size === props.disciplineOptions.length
}

// Toggle individual discipline selection
const handleToggleDiscipline = (id: number) => {
  // Check max selections limit
  if (
    props.maxSelections &&
    !selectedDisciplines.value.has(id) &&
    selectedDisciplines.value.size >= props.maxSelections
  ) {
    // Optionally show a message that max selections reached
    console.warn(`Maximum ${props.maxSelections} disciplines can be selected`)
    return
  }

  // Toggle selection
  if (selectedDisciplines.value.has(id)) {
    selectedDisciplines.value.delete(id)
  } else {
    selectedDisciplines.value.add(id)
  }

  // Update select all state
  isAllSelected.value =
    selectedDisciplines.value.size === props.disciplineOptions.length

  updateQueryParams()
}

const updateQueryParams = () => {
  const selectedIds = Array.from(selectedDisciplines.value).sort(
    (a, b) => a - b
  )

  const queryParams: Record<string, any> = {
    ...route.query,
    page: 1,
  }

  if (selectedIds.length > 0) {
    queryParams.disciplineIds = selectedIds.join(',')
  } else {
    delete queryParams.disciplineIds
  }

  router.replace({ query: queryParams })

  emit('filter-change', {
    disciplineIds: selectedIds,
    ...queryParams,
  })
}

const clearAllSelections = () => {
  selectedDisciplines.value.clear()
  isAllSelected.value = false
  updateQueryParams()
}

const isDisciplineSelected = (id: number): boolean => {
  return selectedDisciplines.value.has(id)
}

const selectedCount = computed(() => selectedDisciplines.value.size)

const hasSelections = computed(() => selectedCount.value > 0)

onMounted(() => {
  syncSelectedFiltersFromQueryParams()
})

watch(
  () => route.query.disciplineIds,
  () => {
    syncSelectedFiltersFromQueryParams()
  }
)
</script>

<template>
  <div class="rounded-lg px-4 py-6 my-4 bg-surface-section">
    <div class="flex flex-wrap gap-3">
      <div v-for="discipline in disciplineOptions" :key="discipline.id">
        <div
          :class="[
            'inline-flex items-center border border-1 rounded-full px-4 py-1.5 gap-2',
            'cursor-pointer transition-all duration-200 select-none',

            {
              'bg-black text-white border-black shadow-lg':
                isDisciplineSelected(discipline.id),
              'bg-white text-gray-700 border-gray-300 hover:border-gray-400':
                !isDisciplineSelected(discipline.id),
              'opacity-50 cursor-not-allowed':
                props.maxSelections &&
                !isDisciplineSelected(discipline.id) &&
                selectedCount >= props.maxSelections,
            },
          ]"
          :title="discipline.name"
          @click="handleToggleDiscipline(discipline.id)"
        >
          <img
            :src="discipline.logo"
            :alt="`${discipline.name} logo`"
            :class="[
              'h-4 w-4 transition-all duration-200',
              { 'filter invert': isDisciplineSelected(discipline.id) },
            ]"
          />

          <span class="font-medium text-sm">{{ discipline.name }}</span>
        </div>
      </div>
    </div>

    <div class="flex justify-end items-center">
      <button
        v-if="hasSelections"
        class="text-sm text-gray-600 hover:text-gray-800 underline transition-colors"
        @click="clearAllSelections"
      >
        Clear all
      </button>
    </div>

    <div
      v-if="props.maxSelections && selectedCount >= props.maxSelections"
      class="mt-3 text-sm text-amber-600 flex items-center gap-1"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <span>Maximum {{ props.maxSelections }} disciplines can be selected</span>
    </div>
  </div>
</template>

<style scoped>
input[type='checkbox']:indeterminate {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3E%3Cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3E%3C/svg%3E");
  background-color: #2563eb;
  border-color: #2563eb;
}
</style>
