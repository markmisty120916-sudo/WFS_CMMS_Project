import type { EngineRegistryEntry } from "../../types/engineContracts";
import { driverEngineHandler, driverEngineMetadata } from "./driverEngine";

export const driverRegistryEntry: EngineRegistryEntry = {
  name: driverEngineMetadata.name,
  engine: {
    metadata: driverEngineMetadata,
    handler: driverEngineHandler,
  },
};
