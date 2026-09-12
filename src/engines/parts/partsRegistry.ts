import type { EngineRegistryEntry } from "../../types/engineContracts";
import { partsEngineHandler, partsEngineMetadata } from "./partsEngine";

export const partsRegistryEntry: EngineRegistryEntry = {
  name: partsEngineMetadata.name,
  engine: {
    metadata: partsEngineMetadata,
    handler: partsEngineHandler,
  },
};
