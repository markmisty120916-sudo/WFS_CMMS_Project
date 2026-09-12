import type { EngineRegistryEntry } from "../../types/engineContracts";
import {
  telematicsEngineHandler,
  telematicsEngineMetadata,
} from "./telematicsEngine";

export const telematicsRegistryEntry: EngineRegistryEntry = {
  name: telematicsEngineMetadata.name,
  engine: {
    metadata: telematicsEngineMetadata,
    handler: telematicsEngineHandler,
  },
};
