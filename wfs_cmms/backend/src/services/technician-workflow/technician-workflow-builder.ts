import { asRecord, asString } from "../../core/validation/dto.schema";
import { parseCompleteWorkflowDto } from "./dto/complete-workflow.dto";
import { parseStartWorkflowDto } from "./dto/start-workflow.dto";
import { parseTechnicianActionDto } from "./dto/technician-action.dto";
import { parseUpdateWorkflowStepDto } from "./dto/update-workflow-step.dto";

export function parseWorkflowStart(input: unknown) {
  return parseStartWorkflowDto(input);
}

export function parseWorkflowStepUpdate(input: unknown) {
  return parseUpdateWorkflowStepDto(input);
}

export function parseWorkflowComplete(input: unknown) {
  return parseCompleteWorkflowDto(input);
}

export function parseWorkflowAction(input: unknown) {
  return parseTechnicianActionDto(input);
}

export function parseWorkflowListQuery(input: unknown): { status: string; asset_id: string } {
  if (input === undefined) {
    return { status: "", asset_id: "" };
  }
  const record = asRecord(input);
  if (record === null) {
    return { status: "", asset_id: "" };
  }
  return {
    status: asString(record.status),
    asset_id: asString(record.asset_id),
  };
}
