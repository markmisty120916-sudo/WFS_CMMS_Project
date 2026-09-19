import type { Database } from "../../../core/database/database.interface";
import { createPreparedStatement } from "../../../core/database/prepared-statement";
import { freezePartsAvailability, type PartsAvailability } from "../parts-request.interface";
import { mapWorkorderLinkRow } from "../utils/parts-request-mapper";
import {
  asFieldString,
  isQuantityCovered,
  normalizeTenantId,
} from "../utils/parts-request-normalizer";
import type { WorkorderLink } from "../parts-request.interface";

export class PartsRequestInventoryAdapter {
  private readonly tenant_id: string;
  private readonly database: Database;

  constructor(tenant_id: string, database: Database) {
    this.tenant_id = normalizeTenantId(tenant_id);
    this.database = database;
  }

  async loadQuantity(part_id: string): Promise<string | null> {
    if (part_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT tenant_id, quantity FROM Parts WHERE tenant_id = $1 AND part_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, part_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const row = result.rows[0];
    if (asFieldString(row.tenant_id) !== this.tenant_id) {
      return null;
    }
    return asFieldString(row.quantity);
  }

  async loadWorkorder(workorder_id: string): Promise<WorkorderLink | null> {
    if (workorder_id === "") {
      return null;
    }
    const statement = createPreparedStatement(
      "SELECT workorder_id, tenant_id, asset_id, source, severity FROM Workorders WHERE tenant_id = $1 AND workorder_id = $2 AND deleted_at IS NULL",
      [this.tenant_id, workorder_id],
    );
    const result = await this.database.execute(statement);
    if (result.rows.length === 0) {
      return null;
    }
    const mapped = mapWorkorderLinkRow(this.tenant_id, result.rows[0]);
    if (mapped.success === false || mapped.value === null) {
      return null;
    }
    return mapped.value;
  }

  availability(part_id: string, quantity_on_hand: string, requested: string): PartsAvailability {
    return freezePartsAvailability({
      tenant_id: this.tenant_id,
      part_id,
      quantity_on_hand,
      requested,
      available: isQuantityCovered(quantity_on_hand, requested),
    });
  }
}
