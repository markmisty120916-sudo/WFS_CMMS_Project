import { GLOBAL_DASHBOARD_PATHS } from "../api/paths";
import { LockedPathPanel } from "../components/LockedPathPanel";

export function GlobalDashboardPage() {
  return <LockedPathPanel title="Global Dashboard" paths={GLOBAL_DASHBOARD_PATHS} />;
}
