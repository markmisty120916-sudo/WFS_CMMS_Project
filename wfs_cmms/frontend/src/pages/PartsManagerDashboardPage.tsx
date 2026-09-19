import { PARTS_MANAGER_PATHS } from "../api/paths";
import { LockedPathPanel } from "../components/LockedPathPanel";

export function PartsManagerDashboardPage() {
  return <LockedPathPanel title="Parts Manager Dashboard" paths={PARTS_MANAGER_PATHS} />;
}
