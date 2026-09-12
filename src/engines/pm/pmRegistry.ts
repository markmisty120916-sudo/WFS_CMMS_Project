import type { EngineRegistryEntry } from "../../types/engineContracts";
import { pmEngineHandler, pmEngineMetadata } from "./pmEngine";

export const pmRegistryEntry: EngineRegistryEntry = {
  name: pmEngineMetadata.name,
  engine: {
    metadata: pmEngineMetadata,
    handler: pmEngineHandler,
  },
};
