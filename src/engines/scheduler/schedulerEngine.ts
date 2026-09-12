import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const schedulerEngineMetadata: EngineMetadata = {
  name: "scheduler",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const schedulerEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
