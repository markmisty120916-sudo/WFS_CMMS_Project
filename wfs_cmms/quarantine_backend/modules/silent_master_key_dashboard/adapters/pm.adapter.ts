import { PM_API_ROUTES } from "../../../../src/services/pm/api/pm.api.contract";
import { isPmApiAllowed } from "../../../../src/services/pm/api/pm.api.permissions";

export const SILENT_MASTER_KEY_PM_ROUTES = PM_API_ROUTES;
export { isPmApiAllowed as isSilentMasterKeyPmApiAllowed };
