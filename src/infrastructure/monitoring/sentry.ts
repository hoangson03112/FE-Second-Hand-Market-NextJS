/**
 * Sentry Error Tracking
 * 
 * Integration with Sentry for error tracking and monitoring
 * Falls back gracefully if Sentry is not configured
 */

interface ErrorContext {
  [key: string]: unknown;
}

/**
 * Capture an exception to Sentry
 * @param error - The error to capture
 * @param context - Additional context about the error
 */
export function captureException(error: Error, context?: ErrorContext): void {
  // Check if Sentry is available
  if (typeof window !== "undefined" && (window as any).Sentry) {
    try {
      (window as any).Sentry.captureException(error, {
        contexts: {
          custom: context || {},
        },
      });
    } catch (sentryError) {
      console.error("Failed to capture exception to Sentry:", sentryError);
    }
  } else {
    // Fallback: log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Sentry not configured. Error:", error, "Context:", context);
    }
  }
}

/**
 * Capture a message to Sentry
 * @param message - The message to capture
 * @param level - The severity level (default: 'info')
 * @param context - Additional context
 */
export function captureMessage(
  message: string,
  level: "debug" | "info" | "warning" | "error" | "fatal" = "info",
  context?: ErrorContext
): void {
  if (typeof window !== "undefined" && (window as any).Sentry) {
    try {
      (window as any).Sentry.captureMessage(message, {
        level,
        contexts: {
          custom: context || {},
        },
      });
    } catch (sentryError) {
      console.error("Failed to capture message to Sentry:", sentryError);
    }
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Sentry ${level}]:`, message, context || "");
    }
  }
}

/**
 * Set user context for Sentry
 * @param user - User information
 */
export function setUserContext(user: { id?: string; email?: string; username?: string }): void {
  if (typeof window !== "undefined" && (window as any).Sentry) {
    try {
      (window as any).Sentry.setUser(user);
    } catch (sentryError) {
      console.error("Failed to set user context in Sentry:", sentryError);
    }
  }
}

/**
 * Clear user context from Sentry
 */
export function clearUserContext(): void {
  if (typeof window !== "undefined" && (window as any).Sentry) {
    try {
      (window as any).Sentry.setUser(null);
    } catch (sentryError) {
      console.error("Failed to clear user context in Sentry:", sentryError);
    }
  }
}

