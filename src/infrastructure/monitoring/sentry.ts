

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


export function captureException(error: Error, context?: ErrorContext): void {

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

    logger.error("Sentry not configured. Error occurred", error, context);
  }
}


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


export function setUserContext(user: { id?: string; email?: string; username?: string }): void {
  if (typeof window !== "undefined" && window.Sentry) {
    try {
      window.Sentry.setUser(user);
    } catch (sentryError) {
      console.error("Failed to set user context in Sentry:", sentryError);
    }
  }
}


export function clearUserContext(): void {
  if (typeof window !== "undefined" && window.Sentry) {
    try {
      window.Sentry.setUser(null);
    } catch (sentryError) {
      console.error("Failed to clear user context in Sentry:", sentryError);
    }
  }
}

