import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:2000/api";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout
  withCredentials: true, // Enable cookies for CORS
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest", // Help with CORS preflight
  },
  // Additional CORS configuration
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
});

// Track refresh token promise to prevent multiple concurrent refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<{ status: string; message: string }> | null = null;

// Request interceptor for CSRF protection
apiClient.interceptors.request.use(
  (config) => {
    // Add CSRF token if available (only on client side)
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");
      if (csrfToken) {
        config.headers["X-CSRF-TOKEN"] = csrfToken;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Return the full response, let the fetcher handle data extraction
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth endpoints to prevent loops
    const isAuthEndpoint =
      originalRequest.url?.includes("/login") ||
      originalRequest.url?.includes("/register") ||
      originalRequest.url?.includes("/refresh");

    // Check if it's a token expired error and not already retrying
    if (
      error.response?.status === 401 &&
      error.response?.data?.status === "token_expired" &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;

      // If already refreshing, wait for that promise
      if (isRefreshing && refreshPromise) {
        try {
          await refreshPromise;
          return apiClient(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Start refresh process
      isRefreshing = true;
      refreshPromise = apiClient.post("/account/refresh");

      try {
        await refreshPromise;
        isRefreshing = false;
        refreshPromise = null;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshPromise = null;

        // Refresh failed, redirect to login only if not already on login page
        if (
          typeof window !== "undefined" &&
          typeof window.location !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // For other 401 errors, redirect to login only if not already on login page
    if (error.response?.status === 401 && !isAuthEndpoint) {
      if (
        typeof window !== "undefined" &&
        typeof window.location !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
