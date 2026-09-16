/**
 * AIMI Multilingual NLP Engine
 * Master Blueprint V2 / multilingual.md §15 / EVENT-BUS-SPEC §17
 * Emits voice.command.translated. Payload includes original_text, translated_text, detected_language.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { MultilingualOutput } from "./multilingual-output.interface";
import type { SupportedLanguage } from "./multilingual-inputs.interface";

export function incomingEventFromMultilingualTranslated(output: MultilingualOutput): IncomingEvent {
  return {
    event_id: output.multilingual_inputs.workorder_id + ":translated:" + output.multilingual_timestamp,
    event_type: "voice.command.translated",
    event_source: "multilingual-nlp-engine",
    event_payload: {
      original_text: output.original_text,
      translated_text: output.translated_text,
      detected_language: output.detected_language,
      command_type: output.command_type,
      command_target: output.command_target,
      workorder_id: output.multilingual_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.multilingual_timestamp,
  };
}

export function incomingEventFromMultilingualProcessed(output: MultilingualOutput): IncomingEvent {
  return {
    event_id: output.multilingual_inputs.workorder_id + ":processed:" + output.multilingual_timestamp,
    event_type: "voice.command.processed",
    event_source: "multilingual-nlp-engine",
    event_payload: {
      original_text: output.original_text,
      translated_text: output.translated_text,
      detected_language: output.detected_language,
      command_type: output.command_type,
      command_target: output.command_target,
      workorder_id: output.multilingual_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.multilingual_timestamp,
  };
}

export function incomingEventFromMultilingualFailed(
  tenant_id: string,
  user_id: string,
  role: MultilingualOutput["role"],
  timestamp: string,
  workorder_id: string,
  original_text: string,
  detected_language: SupportedLanguage,
): IncomingEvent {
  return {
    event_id: workorder_id + ":failed:" + timestamp,
    event_type: "voice.command.failed",
    event_source: "multilingual-nlp-engine",
    event_payload: {
      original_text,
      translated_text: "",
      detected_language,
      workorder_id,
    },
    tenant_id,
    user_id,
    role,
    timestamp,
  };
}
