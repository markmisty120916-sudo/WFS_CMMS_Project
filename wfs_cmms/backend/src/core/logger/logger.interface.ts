export type Logger = {
  trace(message: string): void;
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
};

export type AuditLogHook = {
  write(record: unknown): void;
};
