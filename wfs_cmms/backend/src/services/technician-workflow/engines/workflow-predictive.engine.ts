import type { ContextDto } from "../../../core/dto/context.dto";
import type { PredictiveOutput } from "../../../aimi/predictive/predictive-output.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { TechnicianWorkflowAimiAdapter } from "../adapters/technician-workflow-aimi.adapter";
import { TechnicianWorkflowTelematicsAdapter } from "../adapters/technician-workflow-telematics.adapter";
import type { WorkflowInstance } from "../technician-workflow.interface";

export class WorkflowPredictiveEngine {
  private readonly adapter: TechnicianWorkflowAimiAdapter;
  private readonly telematicsAdapter: TechnicianWorkflowTelematicsAdapter;

  constructor(
    adapter: TechnicianWorkflowAimiAdapter,
    telematicsAdapter: TechnicianWorkflowTelematicsAdapter,
  ) {
    this.adapter = adapter;
    this.telematicsAdapter = telematicsAdapter;
  }

  async forecast(
    dto: ContextDto,
    workflow: WorkflowInstance,
    severity: SeverityOutput | null,
    contextInput: unknown,
  ): Promise<PredictiveOutput | null> {
    const signals = await this.telematicsAdapter.loadSignals(workflow.asset_id);
    return this.adapter.forecast(dto, workflow, severity, signals, contextInput);
  }
}
