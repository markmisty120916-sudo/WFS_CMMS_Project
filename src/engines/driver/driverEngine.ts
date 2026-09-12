import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const driverEngineMetadata: EngineMetadata = {
  name: "driver",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const driverEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
