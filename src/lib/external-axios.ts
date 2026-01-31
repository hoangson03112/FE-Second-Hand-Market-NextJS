/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { captureException } from "@/infrastructure/monitoring/sentry";
import { logger } from "@/infrastructure/monitoring/logger";

let circuitBreakerOpen = false;
let failureCount = 0;
const FAILURE_THRESHOLD = 3;
const CIRCUIT_RESET_TIME = 30000;
const pendingRequests = new Map<string, Promise<any>>();
console.log(process.env.NEXT_PUBLIC_GHN_SHOP_ID);

export const externalApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GHN_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Token: process.env.NEXT_PUBLIC_GHN_TOKEN,
  },
});

externalApiClient.interceptors.request.use(
  (config) => {
    if (circuitBreakerOpen) {
      const error = new Error("Circuit breaker is open - too many failures");
      captureException(error, {
        context: "external_api_circuit_breaker",
        url: config.url,
      });
      return Promise.reject(error);
    }
    if (process.env.NODE_ENV === "development") {
      logger.apiRequest(
        config.method?.toUpperCase() || "GET",
        config.url || ""
      );
    }

    return config;
  },
  (error) => {
    captureException(error as Error, {
      context: "external_api_request_error",
    });
    return Promise.reject(error);
  }
);

externalApiClient.interceptors.response.use(
  (response) => {
    failureCount = 0;

    if (process.env.NODE_ENV === "development") {
      logger.apiResponse(
        response.config.method?.toUpperCase() || "GET",
        response.config.url || "",
        response.status
      );
    }

    return response.data;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retry?: number };

    // Track failure
    failureCount++;

    // Open circuit breaker if threshold reached
    if (failureCount >= FAILURE_THRESHOLD) {
      circuitBreakerOpen = true;

      // Reset circuit breaker after timeout
      setTimeout(() => {
        circuitBreakerOpen = false;
        failureCount = 0;
        logger.info("Circuit breaker reset");
      }, CIRCUIT_RESET_TIME);

      logger.error("Circuit breaker opened", error as Error, {
        failureCount,
        url: config?.url,
      });
    }

    // Log error
    logger.apiResponse(
      config?.method?.toUpperCase() || "GET",
      config?.url || "",
      error.response?.status || 0
    );

    // Track error in Sentry
    captureException(error as Error, {
      context: "external_api_error",
      status: error.response?.status,
      url: config?.url,
      failureCount,
    });

    // Retry logic for network errors and 5xx errors
    const shouldRetry =
      !config?._retry && // Haven't retried yet
      (!error.response || error.response.status >= 500) && // Network error or server error
      config; // Config exists

    if (shouldRetry) {
      config._retry = (config._retry || 0) + 1;

      if (config._retry <= 2) {
        // Max 2 retries
        const retryDelay = Math.min(
          1000 * Math.pow(2, config._retry - 1),
          5000
        );

        logger.info(`Retrying request (attempt ${config._retry})`, {
          url: config.url,
          delay: retryDelay,
        });

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return externalApiClient(config);
      }
    }

    return Promise.reject(error);
  }
);

export async function dedupedRequest<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const cacheKey = `${config?.method || "GET"}:${url}`;

  // Check if request is already pending
  if (pendingRequests.has(cacheKey)) {
    logger.info(`Deduplicating request to ${url}`);
    return pendingRequests.get(cacheKey)!;
  }

  // Make new request - support all HTTP methods
  const promise = externalApiClient.request<T>({
    url,
    ...config,
  }).finally(() => {
    // Remove from pending after completion
    pendingRequests.delete(cacheKey);
  }) as Promise<T>;

  // Store pending request
  pendingRequests.set(cacheKey, promise);

  return promise;
}

const requestTimestamps: number[] = [];
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;

export async function rateLimitedRequest<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const now = Date.now();

  // Clean old timestamps
  const recentRequests = requestTimestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  // Check rate limit
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    const error = new Error("Rate limit exceeded - too many requests");
    logger.warn("Rate limit exceeded", { url });
    throw error;
  }

  // Add current timestamp
  requestTimestamps.length = 0;
  requestTimestamps.push(...recentRequests, now);

  // Make request with deduplication
  return dedupedRequest<T>(url, config);
}

export default externalApiClient;
