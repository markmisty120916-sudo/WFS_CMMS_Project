import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const pmEngineMetadata: EngineMetadata = {
  name: "pm",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const pmEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
