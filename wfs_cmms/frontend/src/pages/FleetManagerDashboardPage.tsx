import { FLEET_MANAGER_PATHS } from "../api/paths";
import { LockedPathPanel } from "../components/LockedPathPanel";

export function FleetManagerDashboardPage() {
  return <LockedPathPanel title="Fleet Manager Dashboard" paths={FLEET_MANAGER_PATHS} />;
}
