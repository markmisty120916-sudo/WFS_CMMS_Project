import type { ContextDto } from "../../../core/dto/context.dto";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { PmAimiAdapter } from "../adapters/pm-aimi.adapter";
import { PmTelematicsAdapter } from "../adapters/pm-telematics.adapter";
import type { PmSchedule } from "../pm.interface";

export class PmPredictiveLinkEngine {
  private readonly adapter: PmAimiAdapter;
  private readonly telematicsAdapter: PmTelematicsAdapter;

  constructor(adapter: PmAimiAdapter, telematicsAdapter: PmTelematicsAdapter) {
    this.adapter = adapter;
    this.telematicsAdapter = telematicsAdapter;
  }

  async link(
    dto: ContextDto,
    schedule: PmSchedule,
    severity: SeverityOutput | null,
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    const signals = await this.telematicsAdapter.loadSignals(schedule.asset_id);
    return this.adapter.forecastOnComplete(dto, schedule, severity, signals, contextInput);
  }
}
