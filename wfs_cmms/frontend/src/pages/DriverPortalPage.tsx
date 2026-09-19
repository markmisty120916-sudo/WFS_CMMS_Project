import { DRIVER_PORTAL_PATHS } from "../api/paths";
import { LockedPathPanel } from "../components/LockedPathPanel";

export function DriverPortalPage() {
  return <LockedPathPanel title="Driver Portal" paths={DRIVER_PORTAL_PATHS} />;
}
