import type { WorkflowInstance, WorkflowStep } from "../technician-workflow.interface";

export function filterWorkflowsByStatus(
  workflows: readonly WorkflowInstance[],
  status: string,
): readonly WorkflowInstance[] {
  if (status === "") {
    return workflows;
  }
  const filtered: WorkflowInstance[] = [];
  let index = 0;
  while (index < workflows.length) {
    if (workflows[index].status === status) {
      filtered.push(workflows[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterWorkflowsByAsset(
  workflows: readonly WorkflowInstance[],
  asset_id: string,
): readonly WorkflowInstance[] {
  if (asset_id === "") {
    return workflows;
  }
  const filtered: WorkflowInstance[] = [];
  let index = 0;
  while (index < workflows.length) {
    if (workflows[index].asset_id === asset_id) {
      filtered.push(workflows[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterStepsBySkipped(steps: readonly WorkflowStep[], skipped: boolean): readonly WorkflowStep[] {
  const filtered: WorkflowStep[] = [];
  let index = 0;
  while (index < steps.length) {
    const text = steps[index].note_text;
    const is_skipped = text.indexOf("skipped:") === 0;
    if (is_skipped === skipped) {
      filtered.push(steps[index]);
    }
    index = index + 1;
  }
  return filtered;
}
