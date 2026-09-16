/**
 * AIMI Voice NLP Engine
 * Master Blueprint V2 / VOICE-COMMANDS / EVENT-BUS-SPEC §17
 * Emits voice.command.received. Payload includes original_text, translated_text, detected_language.
 */

import type { IncomingEvent } from "../../core/event-bus/event.interface";
import type { DtoRole } from "../../core/dto/base.dto";
import type { SupportedLanguage } from "../multilingual-nlp/multilingual-inputs.interface";
import type { VoiceOutput } from "./voice-output.interface";

export function incomingEventFromVoiceReceived(output: VoiceOutput): IncomingEvent {
  return {
    event_id: output.voice_inputs.workorder_id + ":received:" + output.voice_timestamp,
    event_type: "voice.command.received",
    event_source: "voice-nlp-engine",
    event_payload: {
      original_text: output.original_text,
      translated_text: output.translated_text,
      detected_language: output.detected_language,
      command_type: output.command_type,
      workorder_id: output.voice_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.voice_timestamp,
  };
}

export function incomingEventFromVoiceTranslated(output: VoiceOutput): IncomingEvent {
  return {
    event_id: output.voice_inputs.workorder_id + ":translated:" + output.voice_timestamp,
    event_type: "voice.command.translated",
    event_source: "voice-nlp-engine",
    event_payload: {
      original_text: output.original_text,
      translated_text: output.translated_text,
      detected_language: output.detected_language,
      command_type: output.command_type,
      workorder_id: output.voice_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.voice_timestamp,
  };
}

export function incomingEventFromVoiceProcessed(output: VoiceOutput): IncomingEvent {
  return {
    event_id: output.voice_inputs.workorder_id + ":processed:" + output.voice_timestamp,
    event_type: "voice.command.processed",
    event_source: "voice-nlp-engine",
    event_payload: {
      original_text: output.original_text,
      translated_text: output.translated_text,
      detected_language: output.detected_language,
      command_type: output.command_type,
      workorder_id: output.voice_inputs.workorder_id,
    },
    tenant_id: output.tenant_id,
    user_id: output.user_id,
    role: output.role,
    timestamp: output.voice_timestamp,
  };
}

export function incomingEventFromVoiceFailed(
  tenant_id: string,
  user_id: string,
  role: DtoRole,
  timestamp: string,
  workorder_id: string,
  original_text: string,
  detected_language: SupportedLanguage,
): IncomingEvent {
  return {
    event_id: workorder_id + ":failed:" + timestamp,
    event_type: "voice.command.failed",
    event_source: "voice-nlp-engine",
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
