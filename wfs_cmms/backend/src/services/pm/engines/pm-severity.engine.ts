import type { ContextDto } from "../../../core/dto/context.dto";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { PmAimiAdapter } from "../adapters/pm-aimi.adapter";
import type { PmCompleteInput, PmSchedule } from "../pm.interface";

export class PmSeverityEngine {
  private readonly adapter: PmAimiAdapter;

  constructor(adapter: PmAimiAdapter) {
    this.adapter = adapter;
  }

  async assign(
    dto: ContextDto,
    schedule: PmSchedule,
    complete: PmCompleteInput,
    contextInput: unknown,
  ): Promise<SeverityOutput | null> {
    return this.adapter.classifyOnComplete(dto, schedule, complete, contextInput);
  }
}
