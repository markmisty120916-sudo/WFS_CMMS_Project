import type { ContextDto } from "../../../core/dto/context.dto";
import type { RoutingOutput } from "../../../aimi/routing/routing-output.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { TechnicianWorkflowAimiAdapter } from "../adapters/technician-workflow-aimi.adapter";
import type { WorkflowInstance } from "../technician-workflow.interface";

export class WorkflowRoutingEngine {
  private readonly adapter: TechnicianWorkflowAimiAdapter;

  constructor(adapter: TechnicianWorkflowAimiAdapter) {
    this.adapter = adapter;
  }

  async assign(
    dto: ContextDto,
    workflow: WorkflowInstance,
    severity: SeverityOutput | null,
    contextInput: unknown,
  ): Promise<RoutingOutput | null> {
    return this.adapter.route(dto, workflow, severity, contextInput);
  }
}
