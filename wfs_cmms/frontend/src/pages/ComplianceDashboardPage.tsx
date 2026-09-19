import { COMPLIANCE_DASHBOARD_PATHS } from "../api/paths";
import { LockedPathPanel } from "../components/LockedPathPanel";

export function ComplianceDashboardPage() {
  return <LockedPathPanel title="Compliance Dashboard" paths={COMPLIANCE_DASHBOARD_PATHS} />;
}
