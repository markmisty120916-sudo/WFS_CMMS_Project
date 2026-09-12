/**
 * AIMI Engine — API
 * WFS Universal CMMS
 * Scaffold only. No business logic.
 */

import type {
  EngineHandler,
  EngineMetadata,
  EngineRequest,
  EngineResponse,
} from "../../types/engineContracts";

export enum API_ENGINE {}

export interface ApiEnginePlaceholder {
  placeholder?: unknown;
}

export class ApiEngine {}

export const apiEngineMetadata: EngineMetadata = {
  name: "api",
  version: "0.0.0",
  description: "",
  dependencies: [],
};

export const apiEngineHandler: EngineHandler = (
  request: EngineRequest,
  context
): Promise<EngineResponse> => {
  void request;
  void context;
  throw new Error("Not implemented");
};
