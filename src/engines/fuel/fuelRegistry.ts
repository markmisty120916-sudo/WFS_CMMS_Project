import type { EngineRegistryEntry } from "../../types/engineContracts";
import { fuelEngineHandler, fuelEngineMetadata } from "./fuelEngine";

export const fuelRegistryEntry: EngineRegistryEntry = {
  name: fuelEngineMetadata.name,
  engine: {
    metadata: fuelEngineMetadata,
    handler: fuelEngineHandler,
  },
};
