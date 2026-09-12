import type { EngineRegistryEntry } from "../../types/engineContracts";
import {
  complianceEngineHandler,
  complianceEngineMetadata,
} from "./complianceEngine";

export const complianceRegistryEntry: EngineRegistryEntry = {
  name: complianceEngineMetadata.name,
  engine: {
    metadata: complianceEngineMetadata,
    handler: complianceEngineHandler,
  },
};
