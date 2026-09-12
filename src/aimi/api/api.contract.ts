/**
 * AIMI Engine — API
 * WFS Universal CMMS
 * Scaffold only. No business logic.
 */

import type { EngineRegistryEntry } from "../../types/engineContracts";
import {
  apiEngineHandler,
  apiEngineMetadata,
} from "./api.engine";

export enum API_CONTRACT {}

export interface ApiContract {
  placeholder?: unknown;
}

export class ApiContractPlaceholder {}

export const apiRegistryEntry: EngineRegistryEntry = {
  name: apiEngineMetadata.name,
  engine: {
    metadata: apiEngineMetadata,
    handler: apiEngineHandler,
  },
};
