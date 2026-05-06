export type PaginationMetaType = {
  totalCount: number
  totalPages: number
  currentPage: number
  perPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  editRequestCount?: number
  newRequestCount?: number
}

export const usePagination = defineStore('pagination', {
  state: () => ({
    paginationMeta: null as null | PaginationMetaType,
  }),
  getters: {
    getPaginationMeta: (state) => state.paginationMeta,
  },
  actions: {
    setPaginationMeta(payload: PaginationMetaType) {
      this.paginationMeta = payload
    },
  },
})
