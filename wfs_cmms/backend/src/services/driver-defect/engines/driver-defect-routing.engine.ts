import type { ContextDto } from "../../../core/dto/context.dto";
import type { DiagnosticsOutput } from "../../../aimi/diagnostics/diagnostics-output.interface";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import type { RoutingOutput } from "../../../aimi/routing/routing-output.interface";
import type { SchedulingOutput } from "../../../aimi/scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { DriverDefectAimiAdapter } from "../adapters/driver-defect-aimi.adapter";
import type { DriverDefect } from "../driver-defect.interface";

export class DriverDefectRoutingEngine {
  private readonly adapter: DriverDefectAimiAdapter;

  constructor(adapter: DriverDefectAimiAdapter) {
    this.adapter = adapter;
  }

  async assign(
    dto: ContextDto,
    defect: DriverDefect,
    severity: SeverityOutput | null,
    contextInput: unknown,
  ): Promise<RoutingOutput | null> {
    return this.adapter.route(dto, defect, severity, contextInput);
  }

  async schedule(
    dto: ContextDto,
    defect: DriverDefect,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    contextInput: unknown,
  ): Promise<SchedulingOutput | null> {
    return this.adapter.schedule(dto, defect, severity, routing, contextInput);
  }

  async diagnose(
    dto: ContextDto,
    defect: DriverDefect,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    scheduling: SchedulingOutput | null,
    predictive: PredictiveOutput | null,
    contextInput: unknown,
  ): Promise<DiagnosticsOutput | null> {
    return this.adapter.diagnose(dto, defect, severity, routing, scheduling, predictive, contextInput);
  }
}
