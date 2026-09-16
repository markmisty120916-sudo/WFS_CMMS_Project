/**
 * LoggerModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4
 * Factory only. No Nest runtime. No global logger instance.
 */

import { LoggerService, type LoggerServiceOptions } from "./logger.service";

export class LoggerModule {
  static create(options: LoggerServiceOptions): LoggerService {
    return new LoggerService(options);
  }
}

export { LoggerService } from "./logger.service";
export type { LoggerServiceOptions } from "./logger.service";
export type { Logger, LogRecord, LogWriter, AuditLogHook, EventBusHook } from "./logger.interface";
export type { LoggerContext, LoggerRole } from "./logger-context";
export { createCorrelationId } from "./correlation-id";
export type { CorrelationIdInput } from "./correlation-id";
export type { LogLevel } from "./log-levels";
export { isLogLevelEnabled, logLevelRank } from "./log-levels";
