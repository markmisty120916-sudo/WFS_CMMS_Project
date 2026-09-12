import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const partsEngineMetadata: EngineMetadata = {
  name: "parts",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const partsEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
