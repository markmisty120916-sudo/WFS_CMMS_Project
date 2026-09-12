import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const shopEngineMetadata: EngineMetadata = {
  name: "shop",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const shopEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
