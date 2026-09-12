import type { EngineRegistryEntry } from "../../types/engineContracts";
import {
  workordersEngineHandler,
  workordersEngineMetadata,
} from "./workordersEngine";

export const workordersRegistryEntry: EngineRegistryEntry = {
  name: workordersEngineMetadata.name,
  engine: {
    metadata: workordersEngineMetadata,
    handler: workordersEngineHandler,
  },
};
