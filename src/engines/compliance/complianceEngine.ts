import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const complianceEngineMetadata: EngineMetadata = {
  name: "compliance",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const complianceEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
