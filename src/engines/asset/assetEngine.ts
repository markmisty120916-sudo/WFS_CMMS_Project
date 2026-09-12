import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const assetEngineMetadata: EngineMetadata = {
  name: "asset",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const assetEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
