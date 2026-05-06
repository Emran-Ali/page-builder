import { defineStore } from 'pinia'
import { wrapApiCall } from '~/utils/handle-try-catch'
import { getAdminAxios } from '../utils/adminAxios'

export const usePageCrudStore = defineStore('pageCrud', {
  state: () => ({
    currentPage: {
      id: '',
    },
  }),

  getters: {},

  actions: {
    async getPage(slug: string) {
      const token = useCookie('_admin_token').value
      const axios = getAdminAxios()

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
      const token = useCookie('_admin_token').value
      const axios = getAdminAxios()

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
      const axios = getAdminAxios()
      const { handleSuccess } = useGlobalStore()
      const token = useCookie('_admin_token').value

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
