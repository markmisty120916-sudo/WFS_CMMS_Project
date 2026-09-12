import type { EngineRegistryEntry } from "../../types/engineContracts";
import { workOrderEngineHandler, workOrderEngineMetadata } from "./workOrderEngine";

export const workOrderRegistryEntry: EngineRegistryEntry = {
  name: workOrderEngineMetadata.name,
  engine: {
    metadata: workOrderEngineMetadata,
    handler: workOrderEngineHandler,
  },
};
