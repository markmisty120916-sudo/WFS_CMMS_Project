import { SILENT_MASTER_KEY_PATHS } from "../api/paths";
import { LockedPathPanel } from "../components/LockedPathPanel";

export function SilentMasterKeyDashboardPage() {
  return <LockedPathPanel title="Silent Master Key Dashboard" paths={SILENT_MASTER_KEY_PATHS} />;
}
