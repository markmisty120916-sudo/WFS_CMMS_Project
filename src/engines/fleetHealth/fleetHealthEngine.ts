import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const fleetHealthEngineMetadata: EngineMetadata = {
  name: "fleetHealth",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const fleetHealthEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
