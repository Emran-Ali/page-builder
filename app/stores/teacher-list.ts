import { usePagination } from './pagination'
import { getUserAxios } from '../utils/userAxios'
import { wrapApiCall } from '../utils/handle-try-catch'

export const useTeacherListStore = defineStore('teacherListStore', {
  state: () => ({
    teachers: [],
  }),
  getters: {
    getTeachers: (state) => state.teachers,
  },
  actions: {
    async fetchTeachers(query?: string) {
      const { getTokenFromCookie } = useAuthStore()
      const token = getTokenFromCookie()
      const axios = getUserAxios()

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