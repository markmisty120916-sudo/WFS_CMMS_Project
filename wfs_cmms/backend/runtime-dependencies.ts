import type { Database } from "@/database/database.interface";
import { EventBusService } from "@/event-bus/event-bus.service";
import type { AuditLogHook, Logger } from "@/logger/logger.interface";

export function createRuntimeLogger(): Logger {
  const write = (level: string, message: string): void => {
    console.info(
      '{"level":"' +
        level +
        '","message":"' +
        message +
        '","source":"wfs cmms backend runtime"}',
    );
  };
  return {
    trace(message: string): void {
      write("trace", message);
    },
    debug(message: string): void {
      write("debug", message);
    },
    info(message: string): void {
      write("info", message);
    },
    warn(message: string): void {
      write("warn", message);
    },
    error(message: string): void {
      write("error", message);
    },
    fatal(message: string): void {
      write("fatal", message);
    },
  };
}

export function createRuntimeAuditLogHook(): AuditLogHook {
  return {
    write(): void {
      return;
    },
  };
}

export function createRuntimeDatabase(): Database {
  return {
    async execute() {
      return { rows: [], row_count: 0 };
    },
  };
}

export function createRuntimeEventBus(tenant_id: string, logger: Logger, database: Database): EventBusService {
  const boundTenant = tenant_id === "" ? "unbound" : tenant_id;
  return new EventBusService({
    tenant_id: boundTenant,
    logger,
    database,
    auditLogHook: createRuntimeAuditLogHook(),
    rbacHook: {
      assert(): void {
        return;
      },
    },
    subscribers: [],
  });
}

export function processTenantId(): string {
  const value = process.env.WFS_CMMS_TENANT_ID;
  if (value === undefined) {
    return "";
  }
  return value;
}
