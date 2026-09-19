import { PM_API_ROUTES } from "@/services/pm/api/pm.api.contract";
import { isPmApiAllowed } from "@/services/pm/api/pm.api.permissions";

export const PARTS_MANAGER_PM_ROUTES = PM_API_ROUTES;
export { isPmApiAllowed as isPartsManagerPmApiAllowed };
