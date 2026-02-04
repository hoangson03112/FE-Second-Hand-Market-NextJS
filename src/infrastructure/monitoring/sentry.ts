/**
 * Sentry Error Tracking
 *
 * Integration with Sentry for error tracking and monitoring
 * Falls back gracefully if Sentry is not configured
 */

import { logger } from "./logger";

declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, options?: { contexts?: Record<string, unknown> }) => void;
      captureMessage: (message: string, options?: { level?: string; contexts?: Record<string, unknown> }) => void;
      setUser: (user: { id?: string; email?: string; username?: string } | null) => void;
    };
  }
}

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
  if (typeof window !== "undefined" && window.Sentry) {
    try {
      window.Sentry.captureException(error, {
        contexts: {
          custom: context || {},
        },
      });
    } catch (sentryError) {
      console.error("Failed to capture exception to Sentry:", sentryError);
    }
  } else if (process.env.NODE_ENV === "development") {
    // Fallback: log via centralized logger in development
    logger.error("Sentry not configured. Error occurred", error, context);
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
  if (typeof window !== "undefined" && window.Sentry) {
    try {
      window.Sentry.captureMessage(message, {
        level,
        contexts: {
          custom: context || {},
        },
      });
    } catch (sentryError) {
      console.error("Failed to capture message to Sentry:", sentryError);
    }
  } else if (process.env.NODE_ENV === "development") {
    logger.debug(`[Sentry ${level}]: ${message}`, context);
  }
}

/**
 * Set user context for Sentry
 * @param user - User information
 */
export function setUserContext(user: { id?: string; email?: string; username?: string }): void {
  if (typeof window !== "undefined" && window.Sentry) {
    try {
      window.Sentry.setUser(user);
    } catch (sentryError) {
      console.error("Failed to set user context in Sentry:", sentryError);
    }
  }
}

/**
 * Clear user context from Sentry
 */
export function clearUserContext(): void {
  if (typeof window !== "undefined" && window.Sentry) {
    try {
      window.Sentry.setUser(null);
    } catch (sentryError) {
      console.error("Failed to clear user context in Sentry:", sentryError);
    }
  }
}

