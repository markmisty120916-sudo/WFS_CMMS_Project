import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const safetyEngineMetadata: EngineMetadata = {
  name: "safety",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const safetyEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
