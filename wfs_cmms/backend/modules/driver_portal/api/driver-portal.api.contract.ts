export const DRIVER_PORTAL_API_BASE = "/v1/driver";

export const DRIVER_PORTAL_API_HEADERS = Object.freeze({
  authorization: "Authorization",
  tenant: "X-Tenant-Id",
  content_type: "Content-Type",
});

export type DriverPortalApiMethod = "GET" | "POST";

export type DriverPortalApiOperation =
  | "assigned_vehicle"
  | "dvir"
  | "dvir_submit"
  | "defect"
  | "defect_submit"
  | "inspections"
  | "workorders"
  | "aimi_safety"
  | "pm"
  | "compliance"
  | "telematics"
  | "note_added"
  | "photo_added"
  | "alert_acknowledged";

export type DriverPortalApiRoute = {
  readonly method: DriverPortalApiMethod;
  readonly path: string;
  readonly operation: DriverPortalApiOperation;
};

export const DRIVER_PORTAL_API_ROUTES: readonly DriverPortalApiRoute[] = Object.freeze([
  Object.freeze({ method: "GET" as const, path: "/driver/assigned-vehicle", operation: "assigned_vehicle" as const }),
  Object.freeze({ method: "GET" as const, path: "/driver/dvir", operation: "dvir" as const }),
  Object.freeze({ method: "POST" as const, path: "/driver/dvir", operation: "dvir_submit" as const }),
  Object.freeze({ method: "GET" as const, path: "/driver/defect", operation: "defect" as const }),
  Object.freeze({ method: "POST" as const, path: "/driver/defect", operation: "defect_submit" as const }),
  Object.freeze({ method: "GET" as const, path: "/driver/inspections", operation: "inspections" as const }),
  Object.freeze({ method: "GET" as const, path: "/driver/workorders", operation: "workorders" as const }),
  Object.freeze({ method: "GET" as const, path: "/driver/aimi-safety", operation: "aimi_safety" as const }),
  Object.freeze({ method: "GET" as const, path: "/driver/pm", operation: "pm" as const }),
  Object.freeze({ method: "GET" as const, path: "/driver/compliance", operation: "compliance" as const }),
  Object.freeze({ method: "GET" as const, path: "/driver/telematics", operation: "telematics" as const }),
  Object.freeze({ method: "POST" as const, path: "/driver/note", operation: "note_added" as const }),
  Object.freeze({ method: "POST" as const, path: "/driver/photo", operation: "photo_added" as const }),
  Object.freeze({ method: "POST" as const, path: "/driver/alert-ack", operation: "alert_acknowledged" as const }),
]);
