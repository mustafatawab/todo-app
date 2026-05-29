import axios from "axios";

const getCsrfToken = async () => {
  if (typeof document == undefined) return null;

  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};

let isRefresing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:9000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase();

  if (method && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = getCsrfToken();

    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status == 401 && !originalRequest._isRetry) {
      if (
        originalRequest.url?.includes("/api/auth/refresh-token") ||
        originalRequest.url?.includes("/api/auth/login") ||
        originalRequest.url?.includes("/api/auth/register")
      ) {
        return Promise.reject(error);
      }

      if (isRefresing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers["x-csrf-token"] = token;
            }

            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._isRetry = true;

      isRefresing = true;

      try {
        const refreshResponse = await api.post("/api/auth/refresh-token");

        const newCsrfToken = refreshResponse.data.csrfToken;

        if (newCsrfToken && originalRequest.headers) {
          originalRequest.headers["x-csrf-token"] = newCsrfToken;
        }

        processQueue(null, newCsrfToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:session-expired"));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefresing = false;
      }
    }

    return Promise.reject(error);
  },
);
