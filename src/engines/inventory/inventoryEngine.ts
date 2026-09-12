import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const inventoryEngineMetadata: EngineMetadata = {
  name: "inventory",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const inventoryEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
