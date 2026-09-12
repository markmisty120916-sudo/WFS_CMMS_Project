import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const tripReadinessEngineMetadata: EngineMetadata = {
  name: "tripReadiness",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const tripReadinessEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
