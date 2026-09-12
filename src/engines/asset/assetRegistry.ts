import type { EngineRegistryEntry } from "../../types/engineContracts";
import { assetEngineHandler, assetEngineMetadata } from "./assetEngine";

export const assetRegistryEntry: EngineRegistryEntry = {
  name: assetEngineMetadata.name,
  engine: {
    metadata: assetEngineMetadata,
    handler: assetEngineHandler,
  },
};
