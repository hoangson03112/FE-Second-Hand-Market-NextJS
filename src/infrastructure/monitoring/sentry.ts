/**
 * Sentry Error Tracking Configuration
 * 
 * Install: npm install @sentry/nextjs
 * Setup: npx @sentry/wizard@latest -i nextjs
 */

// Uncomment when Sentry is installed
/*
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: process.env.NODE_ENV === "development",
  
  // Replay can be used to record user sessions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Filter out sensitive data
  beforeSend(event, hint) {
    // Remove sensitive information
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.authorization;
    }
    return event;
  },
  
  // Ignore certain errors
  ignoreErrors: [
    // Browser extensions
    "top.GLOBALS",
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "atomicFindClose",
    // Network errors
    "NetworkError",
    "Failed to fetch",
    "Network request failed",
  ],
});
*/

export const captureException = (error: Error, context?: Record<string, unknown>) => {
  // Uncomment when Sentry is installed
  // Sentry.captureException(error, { extra: context });
  console.error("Error captured:", error, context);
};

export const captureMessage = (message: string, level: "info" | "warning" | "error" = "info") => {
  // Uncomment when Sentry is installed
  // Sentry.captureMessage(message, level);
  console.log(`[${level.toUpperCase()}]`, message);
};

