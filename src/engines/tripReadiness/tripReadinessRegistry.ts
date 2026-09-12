import type { EngineRegistryEntry } from "../../types/engineContracts";
import {
  tripReadinessEngineHandler,
  tripReadinessEngineMetadata,
} from "./tripReadinessEngine";

export const tripReadinessRegistryEntry: EngineRegistryEntry = {
  name: tripReadinessEngineMetadata.name,
  engine: {
    metadata: tripReadinessEngineMetadata,
    handler: tripReadinessEngineHandler,
  },
};
