import type { EngineRegistryEntry } from "../../types/engineContracts";
import { breakdownEngineHandler, breakdownEngineMetadata } from "./breakdownEngine";

export const breakdownRegistryEntry: EngineRegistryEntry = {
  name: breakdownEngineMetadata.name,
  engine: {
    metadata: breakdownEngineMetadata,
    handler: breakdownEngineHandler,
  },
};
