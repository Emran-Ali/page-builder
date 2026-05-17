import {defineStore} from "pinia";
import {wrapApiCall} from "../utils/handle-try-catch";
import {getUserAxios} from "../utils/userAxios";
import {usePagination} from "./pagination";

export const usePageCrudStore = defineStore("pageCrud", {
  state: () => ({
    pages: [] as any[],
    currentPage: {
      id: "",
    },
  }),

  getters: {},

  actions: {
    async listPages(params: any) {
      const axios = getUserAxios();
      const paginationStore = usePagination();

      const response = await wrapApiCall("getPage", async () => {
        return await axios.get(`/api/pages/`, {params});
      });

      if (response?.data) {
        this.pages = response?.data?.data || [];
        // Update pagination metadata
        const paginationData = response?.data?.pagination;
        if (paginationData) {
          paginationStore.setPaginationMeta({
            totalCount: paginationData.total,
            totalPages: paginationData.totalPages,
            currentPage: paginationData.page,
            perPage: paginationData.limit,
            hasNextPage: paginationData.page < paginationData.totalPages,
            hasPreviousPage: paginationData.page > 1,
          });
        }
      }
    },

    async getPage(slug: string) {
      const axios = getUserAxios();

      const response = await wrapApiCall("getPage", async () => {
        return await axios.get(`/api/pages/slug/${slug}`);
      });
      this.currentPage = response?.data?.data;
    },

    async getPageById(id: string) {
      const axios = getUserAxios();

      const response = await wrapApiCall("getPage", async () => {
        return await axios.get(`/api/pages/${id}`);
      });
      this.currentPage = response?.data?.data;
    },

    async deletePage(id: number) {
      const axios = getUserAxios();

      const response = await wrapApiCall("deletePage", async () => {
        return await axios.delete(`/api/pages/${id}`);
      });

      return response;
    },

    async savePage(page: any) {
      const axios = getUserAxios();

      const response = await wrapApiCall("savePage", async () => {
        return await axios.patch(`/api/pages/${this.currentPage?.id}`, {
          pageJson: page,
        });
      });

      return response;
    },

    async uploadFile({
      file,
      url,
      config,
      showSuccessToast = true,
    }: {
      file: FormData;
      url: string;
      config?: any;
      showSuccessToast: boolean;
    }) {
      const axios = getUserAxios();
      const {handleSuccess} = useGlobalStore();

      return wrapApiCall("uploadFile", async () => {
        {
          const response = await axios.post(`/api/file-upload/${url}`, file);

          if (showSuccessToast) {
            handleSuccess({
              message: response?.data?.message || "File uploaded successfully",
            });
          }
          return response?.data;
        }
      });
    },
  },
});
