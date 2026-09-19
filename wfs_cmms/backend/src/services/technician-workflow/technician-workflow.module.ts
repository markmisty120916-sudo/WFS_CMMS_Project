import {
  TechnicianWorkflowService,
  type TechnicianWorkflowServiceOptions,
} from "./technician-workflow.service";

export class TechnicianWorkflowModule {
  static create(options: TechnicianWorkflowServiceOptions): TechnicianWorkflowService {
    return new TechnicianWorkflowService(options);
  }
}

export { TechnicianWorkflowService } from "./technician-workflow.service";
export type { TechnicianWorkflowServiceOptions } from "./technician-workflow.service";
