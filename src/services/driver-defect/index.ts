export { DriverDefectModule } from "./driver-defect.module";
export { DriverDefectService } from "./driver-defect.service";
export type { DriverDefectServiceOptions } from "./driver-defect.service";
export type {
  DriverDefect,
  DriverDefectActionResult,
  DriverDefectBuildResult,
  DriverDefectListQuery,
  DriverDefectListResult,
  DriverDefectPhoto,
  DriverDefectStatusQuery,
  DriverDefectWriteInput,
} from "./driver-defect.interface";
export {
  freezeDriverDefect,
  freezeDriverDefectActionResult,
  freezeDriverDefectListResult,
  freezeDriverDefectPhoto,
} from "./driver-defect.interface";
export {
  applyDriverDefectCreate,
  applyDriverDefectSoftDelete,
  parseDriverDefectCreate,
  parseDriverDefectListQuery,
  parseDriverDefectStatus,
  parseDriverDefectUpdate,
} from "./driver-defect-builder";
export {
  canCreateDriverDefect,
  canManageDriverDefect,
  canPublishDriverDefectEvent,
  canReadDriverDefect,
  driverDefectCreateError,
  driverDefectManageError,
  driverDefectReadError,
  driverDefectTenantError,
  isCodedDriverDefectSeverity,
} from "./driver-defect-rules";
export { driverDefectAuditLogId, incomingEventFromDriverDefectCreated } from "./driver-defect-events";
export type { DriverDefectAuditAction } from "./driver-defect-events";
export { parseCreateDriverDefectDto } from "./dto/create-driver-defect.dto";
export { parseUpdateDriverDefectDto } from "./dto/update-driver-defect.dto";
export { parseDriverDefectStatusDto } from "./dto/driver-defect-status.dto";
export {
  DRIVER_DEFECT_API_BASE,
  DRIVER_DEFECT_API_HEADERS,
  DRIVER_DEFECT_API_ROUTES,
} from "./api/driver-defect.api.contract";
export type {
  DriverDefectApiMethod,
  DriverDefectApiOperation,
  DriverDefectApiRoute,
} from "./api/driver-defect.api.contract";
export { isDriverDefectApiAllowed } from "./api/driver-defect.api.permissions";
export { DriverDefectIntakeEngine } from "./engines/driver-defect-intake.engine";
export { DriverDefectSeverityEngine } from "./engines/driver-defect-severity.engine";
export { DriverDefectRoutingEngine } from "./engines/driver-defect-routing.engine";
export { DriverDefectPredictiveEngine } from "./engines/driver-defect-predictive.engine";
export { DriverDefectHistoryEngine } from "./engines/driver-defect-history.engine";
export { DriverDefectAimiAdapter } from "./adapters/driver-defect-aimi.adapter";
export { DriverDefectTelematicsAdapter } from "./adapters/driver-defect-telematics.adapter";
export { asBooleanFlag, asDeletedAt, asFieldString, normalizeTenantId } from "./utils/driver-defect-normalizer";
export { mapDriverDefectPhotoRow, mapDriverDefectRow } from "./utils/driver-defect-mapper";
export { filterDefectsByAsset, filterDefectsByStatus } from "./utils/driver-defect-filters";
