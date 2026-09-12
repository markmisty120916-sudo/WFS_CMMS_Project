import type { EngineRegistryEntry } from "../../types/engineContracts";
import { inventoryEngineHandler, inventoryEngineMetadata } from "./inventoryEngine";

export const inventoryRegistryEntry: EngineRegistryEntry = {
  name: inventoryEngineMetadata.name,
  engine: {
    metadata: inventoryEngineMetadata,
    handler: inventoryEngineHandler,
  },
};
