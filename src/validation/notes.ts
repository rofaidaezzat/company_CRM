import { isValidUUID } from './leads';

export interface ValidationError {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface NoteData {
  lead_id?: string;
  content?: string;
  note_type?: string;
  pinned?: any;
}

export function validateNote(data: NoteData): ValidationError {
  const errors: Record<string, string> = {};

  const leadId = data.lead_id;
  const content = data.content;
  const noteType = data.note_type;
  const pinned = data.pinned;

  if (leadId !== undefined) {
    if (!leadId || leadId.trim() === '') {
      errors.lead_id = 'The lead_id field is missing from the request';
    } else if (!isValidUUID(leadId)) {
      errors.lead_id = 'The provided lead_id is not a valid UUID';
    }
  }

  if (content !== undefined) {
    if (!content || content.trim().length === 0) {
      errors.content = 'Note content is empty or missing';
    } else if (content.length > 5000) {
      errors.content = 'Note content exceeds the 5,000 character maximum';
    }
  }

  if (noteType !== undefined && noteType !== null && noteType !== '') {
    if (noteType !== 'PUBLIC' && noteType !== 'PRIVATE') {
      errors.note_type = 'note_type is not one of PUBLIC or PRIVATE';
    }
  }

  if (pinned !== undefined && pinned !== null && pinned !== '') {
    if (typeof pinned !== 'boolean') {
      errors.pinned = 'The pinned parameter is not a boolean value';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
