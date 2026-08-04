export const ENDPOINTS = {
  atms: {
    list: '/atms/',
    detail: (id: number | string) => `/atms/${id}/`,
    filters: '/atms/filters/',
    aiAnalysis: (id: number | string) => `/atms/${id}/ai-analysis/`
  },
  dashboard: {
    root: '/dashboard/'
  },
  maintenance: {
    list: '/maintenance/',
    detail: (id: number | string) => `/maintenance/${id}/`
  }
} as const;
