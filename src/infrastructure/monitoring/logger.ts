/**
 * Logger Utility
 * 
 * Centralized logging system with different log levels
 * Supports console logging in development and can be extended
 * to send logs to external services in production
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private log(level: LogLevel, message: string, error?: Error, context?: LogContext) {
    if (!this.isDevelopment && level === "debug") {
      return; // Skip debug logs in production
    }

    const timestamp = new Date().toISOString();
    // Log entry structure for future logging service integration
    // const logEntry = {
    //   timestamp,
    //   level,
    //   message,
    //   ...(error && {
    //     error: {
    //       name: error.name,
    //       message: error.message,
    //       stack: error.stack,
    //     },
    //   }),
    //   ...context,
    // };

    switch (level) {
      case "error":
        console.error(`[${timestamp}] ERROR:`, message, error || "", context || "");
        break;
      case "warn":
        console.warn(`[${timestamp}] WARN:`, message, context || "");
        break;
      case "info":
        console.info(`[${timestamp}] INFO:`, message, context || "");
        break;
      case "debug":
        console.debug(`[${timestamp}] DEBUG:`, message, context || "");
        break;
    }

    // In production, you could send logs to external service
    // if (process.env.NODE_ENV === "production") {
    //   this.sendToLogService(logEntry);
    // }
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, undefined, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, undefined, context);
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log("error", message, error, context);
  }

  debug(message: string, context?: LogContext) {
    this.log("debug", message, undefined, context);
  }

  // API-specific logging methods
  apiRequest(method: string, url: string, data?: unknown) {
    this.debug(`API Request: ${method} ${url}`, { method, url, data });
  }

  apiResponse(method: string, url: string, status: number, data?: unknown) {
    if (status >= 400) {
      this.warn(`API Response: ${method} ${url} - ${status}`, { method, url, status, data });
    } else {
      this.debug(`API Response: ${method} ${url} - ${status}`, { method, url, status });
    }
  }
}

export const logger = new Logger();

