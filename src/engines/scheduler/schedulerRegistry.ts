import type { EngineRegistryEntry } from "../../types/engineContracts";
import { schedulerEngineHandler, schedulerEngineMetadata } from "./schedulerEngine";

export const schedulerRegistryEntry: EngineRegistryEntry = {
  name: schedulerEngineMetadata.name,
  engine: {
    metadata: schedulerEngineMetadata,
    handler: schedulerEngineHandler,
  },
};
