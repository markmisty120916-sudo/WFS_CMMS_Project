import type { ContextDto } from "../../../core/dto/context.dto";
import type { SeverityOutput } from "../../../aimi/severity/severity-output.interface";
import { DriverDefectAimiAdapter } from "../adapters/driver-defect-aimi.adapter";
import type { DriverDefect } from "../driver-defect.interface";

export class DriverDefectSeverityEngine {
  private readonly adapter: DriverDefectAimiAdapter;

  constructor(adapter: DriverDefectAimiAdapter) {
    this.adapter = adapter;
  }

  async classify(dto: ContextDto, defect: DriverDefect, contextInput: unknown): Promise<SeverityOutput | null> {
    return this.adapter.classify(dto, defect, contextInput);
  }
}
