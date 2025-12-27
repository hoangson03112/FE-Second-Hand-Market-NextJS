/**
 * Infrastructure Layer Exports
 * 
 * Centralized exports for all infrastructure modules
 * This makes it easy to import infrastructure utilities
 */

// Monitoring
export { captureException, captureMessage } from "./monitoring/sentry";
export { trackPageView, trackEvent, identifyUser } from "./monitoring/analytics";
export { logger } from "./monitoring/logger";

// Storage
export { storage } from "./storage/localStorage";
export { sessionStorage } from "./storage/sessionStorage";

// API (if you want to use the new axios client)
// export { default as apiClient } from "./api/axios-client";

