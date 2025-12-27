/**
 * Centralized Logging System
 * 
 * Provides structured logging with different levels
 * Can be extended to send logs to external services
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private logLevel: LogLevel = this.isDevelopment ? "debug" : "info";

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "warn", "error"];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.info(this.formatMessage("info", message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, context));
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog("error")) {
      console.error(this.formatMessage("error", message, context), error);
      
      // In production, send to error tracking service
      if (!this.isDevelopment && error) {
        // Import here to avoid circular dependencies
        import("./sentry").then(({ captureException }) => {
          captureException(error, context);
        });
      }
    }
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, data?: unknown): void {
    this.debug(`API ${method} ${url}`, { data });
  }

  /**
   * Log API response
   */
  apiResponse(method: string, url: string, status: number, data?: unknown): void {
    if (status >= 400) {
      this.error(`API ${method} ${url} failed`, undefined, { status, data });
    } else {
      this.debug(`API ${method} ${url} success`, { status });
    }
  }

  /**
   * Log user action
   */
  userAction(action: string, context?: LogContext): void {
    this.info(`User action: ${action}`, context);
  }

  /**
   * Log performance metric
   */
  performance(metric: string, duration: number, context?: LogContext): void {
    this.info(`Performance: ${metric}`, { duration: `${duration}ms`, ...context });
  }
}

export const logger = new Logger();

