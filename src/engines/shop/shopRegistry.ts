import type { EngineRegistryEntry } from "../../types/engineContracts";
import { shopEngineHandler, shopEngineMetadata } from "./shopEngine";

export const shopRegistryEntry: EngineRegistryEntry = {
  name: shopEngineMetadata.name,
  engine: {
    metadata: shopEngineMetadata,
    handler: shopEngineHandler,
  },
};
