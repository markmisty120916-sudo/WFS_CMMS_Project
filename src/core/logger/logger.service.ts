/**
 * LoggerModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4 / TENANT-ISOLATION §2
 * JSON-only structured logs. No console.log. No global state.
 */

import { createCorrelationId } from "./correlation-id";
import type { AuditLogHook, EventBusHook, LogRecord, LogWriter, Logger } from "./logger.interface";
import type { LoggerContext } from "./logger-context";
import type { LogLevel } from "./log-levels";
import { isLogLevelEnabled } from "./log-levels";

export type LoggerServiceOptions = {
  context: LoggerContext;
  writer: LogWriter;
  auditLogHook: AuditLogHook;
  eventBusHook: EventBusHook;
  minLevel: LogLevel;
};

export class LoggerService implements Logger {
  private readonly context: LoggerContext;
  private readonly writer: LogWriter;
  private readonly auditLogHook: AuditLogHook;
  private readonly eventBusHook: EventBusHook;
  private readonly minLevel: LogLevel;

  constructor(options: LoggerServiceOptions) {
    if (options.context.tenant_id === "") {
      throw new Error("tenant_id required");
    }
    if (options.context.user_id === "") {
      throw new Error("user_id required");
    }
    if (options.context.role === "") {
      throw new Error("role required");
    }
    if (options.context.timestamp === "") {
      throw new Error("timestamp required");
    }

    let correlation_id = options.context.correlation_id;
    if (correlation_id === "") {
      correlation_id = createCorrelationId({
        tenant_id: options.context.tenant_id,
        user_id: options.context.user_id,
        timestamp: options.context.timestamp,
      });
    }

    this.context = {
      tenant_id: options.context.tenant_id,
      user_id: options.context.user_id,
      role: options.context.role,
      correlation_id,
      timestamp: options.context.timestamp,
    };
    this.writer = options.writer;
    this.auditLogHook = options.auditLogHook;
    this.eventBusHook = options.eventBusHook;
    this.minLevel = options.minLevel;
  }

  withContext(context: LoggerContext): LoggerService {
    return new LoggerService({
      context,
      writer: this.writer,
      auditLogHook: this.auditLogHook,
      eventBusHook: this.eventBusHook,
      minLevel: this.minLevel,
    });
  }

  trace(message: string): void {
    this.emit("trace", message);
  }

  debug(message: string): void {
    this.emit("debug", message);
  }

  info(message: string): void {
    this.emit("info", message);
  }

  warn(message: string): void {
    this.emit("warn", message);
  }

  error(message: string): void {
    this.emit("error", message);
  }

  fatal(message: string): void {
    this.emit("fatal", message);
  }

  private emit(level: LogLevel, message: string): void {
    if (isLogLevelEnabled(level, this.minLevel) === false) {
      return;
    }

    const record: LogRecord = {
      level,
      message,
      tenant_id: this.context.tenant_id,
      user_id: this.context.user_id,
      role: this.context.role,
      correlation_id: this.context.correlation_id,
      timestamp: this.context.timestamp,
    };

    this.writer.write(JSON.stringify(record));
    this.auditLogHook.write(record);
    this.eventBusHook.publish(record);
  }
}
