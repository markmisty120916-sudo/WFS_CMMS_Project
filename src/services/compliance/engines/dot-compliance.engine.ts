import type { InspectionTemplate } from "../compliance.interface";
import { filterDotTemplates } from "../utils/compliance-filters";

export class DotComplianceEngine {
  filterDot(templates: readonly InspectionTemplate[]): readonly InspectionTemplate[] {
    return filterDotTemplates(templates);
  }

  isDotType(type: string): boolean {
    if (type === "DOT") {
      return true;
    }
    return false;
  }
}
