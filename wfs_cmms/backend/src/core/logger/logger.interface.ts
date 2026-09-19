/**
 * LoggerModule — Core
 * Master Blueprint V2 / BACKEND-STRUCTURE §4 / TENANT-ISOLATION §2
 * JSON log contract plus AuditLog and EventBus hooks. No EventBus categories invented.
 */

import type { LogLevel } from "./log-levels";
import type { LoggerContext } from "./logger-context";

export type LogRecord = {
  level: LogLevel;
  message: string;
  tenant_id: string;
  user_id: string;
  role: LoggerContext["role"];
  correlation_id: string;
  timestamp: string;
};

export type LogWriter = {
  write(recordJson: string): void;
};

export type AuditLogHook = {
  write(record: LogRecord): void;
};

export type EventBusHook = {
  publish(record: LogRecord): void;
};

export type Logger = {
  trace(message: string): void;
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
};
