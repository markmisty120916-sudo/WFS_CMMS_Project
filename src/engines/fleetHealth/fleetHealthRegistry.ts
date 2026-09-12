import type { EngineRegistryEntry } from "../../types/engineContracts";
import {
  fleetHealthEngineHandler,
  fleetHealthEngineMetadata,
} from "./fleetHealthEngine";

export const fleetHealthRegistryEntry: EngineRegistryEntry = {
  name: fleetHealthEngineMetadata.name,
  engine: {
    metadata: fleetHealthEngineMetadata,
    handler: fleetHealthEngineHandler,
  },
};
