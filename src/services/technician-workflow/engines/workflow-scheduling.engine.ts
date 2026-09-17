import type { ContextDto } from "../../../core/dto/context.dto";
import type { RoutingOutput } from "../../../aimi/routing/routing-output.interface";
import type { SchedulingOutput } from "../../../aimi/scheduling/scheduling-output.interface";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { TechnicianWorkflowAimiAdapter } from "../adapters/technician-workflow-aimi.adapter";
import type { WorkflowInstance } from "../technician-workflow.interface";

export class WorkflowSchedulingEngine {
  private readonly adapter: TechnicianWorkflowAimiAdapter;

  constructor(adapter: TechnicianWorkflowAimiAdapter) {
    this.adapter = adapter;
  }

  async assign(
    dto: ContextDto,
    workflow: WorkflowInstance,
    severity: SeverityOutput | null,
    routing: RoutingOutput | null,
    contextInput: unknown,
  ): Promise<SchedulingOutput | null> {
    return this.adapter.schedule(dto, workflow, severity, routing, contextInput);
  }
}
