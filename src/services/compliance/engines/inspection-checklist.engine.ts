import {
  freezeInspectionChecklist,
  type InspectionChecklist,
  type InspectionInstance,
} from "../compliance.interface";

export class InspectionChecklistEngine {
  build(instance: InspectionInstance, voice_enabled: boolean, multilingual_enabled: boolean): InspectionChecklist {
    const items: string[] = [];
    if (instance.type === "DOT") {
      items.push("DOT");
    }
    if (instance.type === "school_district") {
      items.push("school_district");
    }
    if (instance.type === "custom") {
      items.push("custom");
    }
    return freezeInspectionChecklist({
      tenant_id: instance.tenant_id,
      inspection_id: instance.inspection_id,
      type: instance.type,
      items,
      voice_enabled,
      multilingual_enabled,
    });
  }
}
