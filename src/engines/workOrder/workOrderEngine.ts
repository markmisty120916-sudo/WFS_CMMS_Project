import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const workOrderEngineMetadata: EngineMetadata = {
  name: "workOrder",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const workOrderEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
