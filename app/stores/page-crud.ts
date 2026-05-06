import { defineStore } from 'pinia'
import { wrapApiCall } from '../utils/handle-try-catch'
import { getUserAxios } from '../utils/userAxios'

export const usePageCrudStore = defineStore('pageCrud', {
  state: () => ({
    currentPage: {
      id: '',
    },
  }),

  getters: {},

  actions: {
    async getPage(slug: string) {
      const { getTokenFromCookie } = useAuthStore()
      const token = getTokenFromCookie()
      const axios = getUserAxios()

      const response = await wrapApiCall('getPage', async () => {
        return await axios.get(`/pages/slug/${slug}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      })
      this.currentPage = response?.data?.data
    },

    async savePage(page: any) {
      const { getTokenFromCookie } = useAuthStore()
      const token = getTokenFromCookie()
      const axios = getUserAxios()

      const response = await wrapApiCall('savePage', async () => {
        return await axios.patch(
          `/pages/${this.currentPage?.id}`,
          {
            pageJson: page,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      })

      return response
    },

    async uploadFile({
      file,
      url,
      config,
      showSuccessToast = true,
    }: {
      file: FormData
      url: string
      config?: any
      showSuccessToast: boolean
    }) {
      const axios = getUserAxios()
      const { handleSuccess } = useGlobalStore()
      const { getTokenFromCookie } = useAuthStore()
      const token = getTokenFromCookie()

      return wrapApiCall('uploadFile', async () => {
        {
          const response = await axios.post(`/file-upload/${url}`, file, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            onUploadProgress: config?.onUploadProgress,
          })

          if (showSuccessToast) {
            handleSuccess({
              message: response?.data?.message || 'File uploaded successfully',
            })
          }
          return response?.data
        }
      })
    },
  },
})