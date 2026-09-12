import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const fuelEngineMetadata: EngineMetadata = {
  name: "fuel",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const fuelEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
