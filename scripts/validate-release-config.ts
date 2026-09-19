import { runReleaseBuildValidation } from "../wfs_cmms/backend/modules/global_dashboard_integration/global-dashboard-integration.release-prep";

process.exit(runReleaseBuildValidation(process.env));
