import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from 'axios';
import { notify } from '@/utils/notify';


const ACCESS_TOKEN_KEY = 'turon_access_token';
const REFRESH_TOKEN_KEY = 'turon_refresh_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null): void {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string | null): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function clearSession(): void {
  setAccessToken(null);
  setRefreshToken(null);
}

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    Accept: 'application/json'
  }
});


http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    const user = import.meta.env.VITE_API_BASIC_AUTH_USER;
    const pass = import.meta.env.VITE_API_BASIC_AUTH_PASS;

    if (user && pass) {
      config.headers.set('Authorization', `Basic ${btoa(`${user}:${pass}`)}`);
    }
  }
  return config;
});


let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

function resolvePendingQueue(): void {
  pendingQueue.forEach((resolve) => resolve());
  pendingQueue = [];
}


async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    return false;
  } catch {
    return false;
  }
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (!error.response) {
      notify.error("Tarmoq bilan bog'lanishda xatolik yuz berdi. Internet aloqasini tekshiring.");
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        const refreshed = await tryRefreshToken();
        isRefreshing = false;
        resolvePendingQueue();

        if (refreshed) {
          return http(originalRequest);
        }

        clearSession();
        notify.error('Sessiya muddati tugagan. Iltimos, qaytadan tizimga kiring.');
        return Promise.reject(error);
      }

      return new Promise((resolve) => {
        pendingQueue.push(() => resolve(http(originalRequest)));
      });
    }

    if (status === 403) {
      notify.error("Sizda ushbu amalni bajarish uchun ruxsat yo'q.");
    } else if (status >= 500) {
      notify.error('Serverda xatolik yuz berdi. Birozdan so\'ng qaytadan urinib ko\'ring.');
    } else if (status === 404) {
      notify.warning('So\'ralgan ma\'lumot topilmadi.');
    } else if (status >= 400) {
      const detail = extractErrorMessage(error);
      notify.error(detail || "So'rovda xatolik yuz berdi.");
    }

    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { detail?: string; message?: string; error?: string }
      | undefined;
    return data?.detail || data?.message || data?.error || null;
  }
  return null;
}