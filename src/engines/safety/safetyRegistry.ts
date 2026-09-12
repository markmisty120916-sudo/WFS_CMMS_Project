import type { EngineRegistryEntry } from "../../types/engineContracts";
import { safetyEngineHandler, safetyEngineMetadata } from "./safetyEngine";

export const safetyRegistryEntry: EngineRegistryEntry = {
  name: safetyEngineMetadata.name,
  engine: {
    metadata: safetyEngineMetadata,
    handler: safetyEngineHandler,
  },
};
