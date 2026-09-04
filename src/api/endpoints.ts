export const ENDPOINTS = {
  atms: {
    list: '/atms/',
    detail: (id: number | string) => `/atms/${id}/`,
    filters: '/atms/filters/',
    export: '/atms/export/',
    exportSingle: (id: number | string) => `/atms/${id}/export/`
  },
  ai: {
    createAnalysis: (id: number | string) => `/ai/atms/${id}/analysis/`,
    jobDetail: (jobId: number | string) => `/ai/jobs/${jobId}/`
  },
  dashboard: {
    root: '/dashboard/'
  },
  maintenance: {
    list: '/maintenance/',
    detail: (id: number | string) => `/maintenance/${id}/`
  }
} as const;
