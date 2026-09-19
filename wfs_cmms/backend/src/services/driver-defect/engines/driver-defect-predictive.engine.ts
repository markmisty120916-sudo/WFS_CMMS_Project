import type { ContextDto } from "../../../core/dto/context.dto";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { DriverDefectAimiAdapter } from "../adapters/driver-defect-aimi.adapter";
import { DriverDefectTelematicsAdapter } from "../adapters/driver-defect-telematics.adapter";
import type { DriverDefect } from "../driver-defect.interface";

export class DriverDefectPredictiveEngine {
  private readonly adapter: DriverDefectAimiAdapter;
  private readonly telematicsAdapter: DriverDefectTelematicsAdapter;

  constructor(adapter: DriverDefectAimiAdapter, telematicsAdapter: DriverDefectTelematicsAdapter) {
    this.adapter = adapter;
    this.telematicsAdapter = telematicsAdapter;
  }

  async forecast(
    dto: ContextDto,
    defect: DriverDefect,
    severity: SeverityOutput | null,
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    const signals = await this.telematicsAdapter.loadSignals(defect.asset_id);
    return this.adapter.forecast(dto, defect, severity, signals, contextInput);
  }
}
