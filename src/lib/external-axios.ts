import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { captureException } from "@/infrastructure/monitoring/sentry";
import { logger } from "@/infrastructure/monitoring/logger";

let circuitBreakerOpen = false;
let failureCount = 0;
const FAILURE_THRESHOLD = 5;
const CIRCUIT_RESET_TIME = 30000;
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * A 4xx means our payload is wrong, not that GHN is down. Counting those toward
 * the breaker (and retrying them) took the whole client offline for 30s over
 * errors that repeating the request can never fix.
 */
function isTransientFailure(error: AxiosError): boolean {
  return !error.response || error.response.status >= 500;
}

// GHN is proxied through our own Route Handler (`/api/ghn`) so the secret GHN
// Token stays server-side and never ships to the browser. On the server (SSR /
// prefetch) a relative URL has no origin, so fall back to an absolute one.
const GHN_PROXY_BASE_URL =
  typeof window === "undefined"
    ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ghn`
    : "/api/ghn";

export const externalApiClient = axios.create({
  baseURL: GHN_PROXY_BASE_URL,
  // 8s x (1 try + 1 retry) keeps the worst case near 17s. The old 15s x 3 tries
  // let a stalled GHN hold the UI for the better part of a minute.
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
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
        config.url || "",
      );
    }

    return config;
  },
  (error) => {
    captureException(error as Error, {
      context: "external_api_request_error",
    });
    return Promise.reject(error);
  },
);

externalApiClient.interceptors.response.use(
  (response) => {
    failureCount = 0;

    if (process.env.NODE_ENV === "development") {
      logger.apiResponse(
        response.config.method?.toUpperCase() || "GET",
        response.config.url || "",
        response.status,
      );
    }

    return response.data;
  },
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retry?: number };
    const transient = isTransientFailure(error);

    // Track failure
    if (transient) failureCount++;

    // Open circuit breaker if threshold reached
    if (transient && failureCount >= FAILURE_THRESHOLD) {
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
      error.response?.status || 0,
    );

    // Track error in Sentry
    captureException(error as Error, {
      context: "external_api_error",
      status: error.response?.status,
      url: config?.url,
      failureCount,
    });

    // Retry once for network errors and 5xx errors. A second retry only ever
    // added latency to requests a user is actively waiting on.
    if (config && transient && !config._retry) {
      config._retry = 1;
      const retryDelay = 500;

      logger.info(`Retrying request (attempt ${config._retry})`, {
        url: config.url,
        delay: retryDelay,
      });

      await new Promise((resolve) => setTimeout(resolve, retryDelay));
      return externalApiClient(config);
    }

    return Promise.reject(error);
  },
);

export async function dedupedRequest<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  // The body has to be part of the key: two POSTs to the same URL with different
  // payloads are different requests, and keying on the URL alone silently handed
  // the second caller the first caller's response.
  const body = config?.data === undefined ? "" : JSON.stringify(config.data);
  const cacheKey = `${config?.method || "GET"}:${url}:${body}`;

  // Check if request is already pending
  if (pendingRequests.has(cacheKey)) {
    logger.info(`Deduplicating request to ${url}`);
    return pendingRequests.get(cacheKey) as Promise<T>;
  }

  // Make new request - support all HTTP methods
  const promise = externalApiClient
    .request<T>({
      url,
      ...config,
    })
    .finally(() => {
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
  config?: AxiosRequestConfig,
): Promise<T> {
  const now = Date.now();

  // Clean old timestamps
  const recentRequests = requestTimestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW,
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
