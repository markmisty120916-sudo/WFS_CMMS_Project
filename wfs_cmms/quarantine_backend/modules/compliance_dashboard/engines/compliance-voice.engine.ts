import { isComplianceVoiceEventType } from "../adapters/aimi.adapter";
import type { ComplianceVoiceItem } from "../compliance-dashboard.interface";
import { asField, payloadRecord } from "../compliance-dashboard.repository";

export function buildVoiceCompliance(
  tenant_id: string,
  events: readonly Readonly<Record<string, unknown>>[],
): readonly ComplianceVoiceItem[] {
  const items: ComplianceVoiceItem[] = [];
  let index = 0;
  while (index < events.length) {
    const row = events[index];
    if (asField(row, "tenant_id") === tenant_id) {
      const event_type = asField(row, "event_type");
      if (isComplianceVoiceEventType(event_type) === true) {
        const payload = payloadRecord(row);
        items.push(
          Object.freeze({
            tenant_id,
            event_id: asField(row, "event_id"),
            event_type,
            asset_id: asField(payload, "asset_id"),
            timestamp: asField(row, "timestamp"),
          }),
        );
      }
    }
    index = index + 1;
  }
  return items;
}
