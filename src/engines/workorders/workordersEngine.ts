import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const workordersEngineMetadata: EngineMetadata = {
  name: "workorders",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const workordersEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
