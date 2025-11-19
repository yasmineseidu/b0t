/**
 * Browser-Safe Logger for Client Components
 *
 * This logger is safe to use in 'use client' components.
 * It uses the browser's console API instead of Node.js pino library.
 *
 * Usage in client components:
 * import { logger } from '@/lib/logger-client';
 * logger.error({ error }, 'Something went wrong');
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

class ClientLogger {
  private shouldLog(level: LogLevel): boolean {
    if (typeof window === 'undefined') return false;

    const isDevelopment = process.env.NODE_ENV === 'development';
    const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(logLevel as LogLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  private formatMessage(context: LogContext | string, message?: string): string {
    if (typeof context === 'string') {
      return context;
    }
    return message || '';
  }

  private formatContext(context: LogContext | string): LogContext | undefined {
    if (typeof context === 'string') {
      return undefined;
    }
    return context;
  }

  debug(context: LogContext | string, message?: string): void {
    if (!this.shouldLog('debug')) return;

    const msg = this.formatMessage(context, message);
    const ctx = this.formatContext(context);

    if (ctx) {
      console.debug(`[DEBUG] ${msg}`, ctx);
    } else {
      console.debug(`[DEBUG] ${msg}`);
    }
  }

  info(context: LogContext | string, message?: string): void {
    if (!this.shouldLog('info')) return;

    const msg = this.formatMessage(context, message);
    const ctx = this.formatContext(context);

    if (ctx) {
      console.info(`[INFO] ${msg}`, ctx);
    } else {
      console.info(`[INFO] ${msg}`);
    }
  }

  warn(context: LogContext | string, message?: string): void {
    if (!this.shouldLog('warn')) return;

    const msg = this.formatMessage(context, message);
    const ctx = this.formatContext(context);

    if (ctx) {
      console.warn(`[WARN] ${msg}`, ctx);
    } else {
      console.warn(`[WARN] ${msg}`);
    }
  }

  error(context: LogContext | string, message?: string): void {
    if (!this.shouldLog('error')) return;

    const msg = this.formatMessage(context, message);
    const ctx = this.formatContext(context);

    if (ctx) {
      console.error(`[ERROR] ${msg}`, ctx);
    } else {
      console.error(`[ERROR] ${msg}`);
    }
  }
}

export const logger = new ClientLogger();
