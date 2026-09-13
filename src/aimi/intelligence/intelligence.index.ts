/**
 * AIMI Engine — Intelligence
 * WFS Universal CMMS
 * Scaffold only. No business logic.
 */

export {
  intelligenceRegister,
  intelligenceRegistry,
  intelligenceUnregister,
} from "./intelligence.registry";
export {
  IntelligenceContract,
  IntelligenceContractPlaceholder,
  INTELLIGENCE_CONTRACT,
} from "./intelligence.contract";
export {
  IntelligenceCreateRequest,
  IntelligenceQuery,
  IntelligenceResult,
  IntelligenceTypesPlaceholder,
  IntelligenceUpdateRequest,
  INTELLIGENCE_TYPE,
} from "./intelligence.types";
export {
  IntelligenceSchema,
  IntelligenceSchemaPlaceholder,
  intelligenceSchema,
  INTELLIGENCE_SCHEMA,
} from "./intelligence.schema";
export {
  IntelligenceBootstrap,
  IntelligenceBootstrapPlaceholder,
  intelligenceInit,
  INTELLIGENCE_BOOTSTRAP,
} from "./intelligence.bootstrap";

export const intelligenceEnginePlaceholders = {};
