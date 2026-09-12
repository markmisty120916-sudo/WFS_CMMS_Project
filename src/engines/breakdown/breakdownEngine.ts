import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export const breakdownEngineMetadata: EngineMetadata = {
  name: "breakdown",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const breakdownEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
