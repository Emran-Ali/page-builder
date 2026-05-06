import { usePagination } from './pagination'

export const useTeacherListStore = defineStore('teacherListStore', {
  state: () => ({
    teachers: [],
  }),
  getters: {
    getTeachers: (state) => state.teachers,
  },
  actions: {
    async fetchTeachers(query?: string) {
      const token = useCookie('_admin_token').value
      const axios = getAdminAxios()

      const paginationStore = usePagination()

      return wrapApiCall('teacherListStore', async () => {
        const response = await axios.get(`/teacher?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        this.teachers = response.data?.data
        paginationStore.setPaginationMeta(response.data?.meta)
      })
    },
  },
})
