export interface InspectionFindingDto {
  tenant_id: string;
  finding_id?: string;
}

export interface ComplianceStatusDto {
  tenant_id: string;
  status?: string;
}
