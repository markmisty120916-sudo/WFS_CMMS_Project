import {
  freezeInspectionResult,
  type InspectionCompleteInput,
  type InspectionInstance,
  type InspectionResult,
} from "../compliance.interface";

export class InspectionResultEngine {
  build(instance: InspectionInstance, complete: InspectionCompleteInput): InspectionResult {
    return freezeInspectionResult({
      tenant_id: instance.tenant_id,
      inspection_id: instance.inspection_id,
      asset_id: instance.asset_id,
      findings: complete.findings,
      result: complete.result,
    });
  }
}
