// Leads Validation rules compatible with the backend
import { isValidEmail } from './auth';

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  return phoneRegex.test(phone);
}

export interface ValidationError {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface LeadData {
  phone?: string;
  name?: string;
  email?: string | null;
  source?: string;
  status?: string;
  priority?: string;
  assigned_to_id?: string | null;
  next_follow_up?: string | null;
}

export function validateLead(data: LeadData): ValidationError {
  const errors: Record<string, string> = {};

  const name = data.name?.trim() || '';
  const phone = data.phone?.trim() || '';
  const email = data.email?.trim() || '';
  const assignedToId = data.assigned_to_id;
  const nextFollowUp = data.next_follow_up;

  // Name is optional in API but let's make sure it doesn't just contain spaces if provided
  if (data.name !== undefined && name.length === 0) {
    // Note: The API defaults name to '--', so technically empty name is allowed by API, but we'll accept it
  }

  // Phone is mandatory and must match the pattern /^\+?[0-9\s\-()]{7,20}$/
  if (!phone) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Phone must be between 7 to 20 digits and can include +, spaces, hyphens, and parentheses';
  }

  // Email is optional but must be valid if provided
  if (email && !isValidEmail(email)) {
    errors.email = 'Invalid email address';
  }

  // assigned_to_id must be a valid UUID if provided
  if (assignedToId && !isValidUUID(assignedToId)) {
    errors.assigned_to_id = 'Assigned sales agent must be a valid UUID';
  }

  // next_follow_up must be a valid date if provided
  if (nextFollowUp) {
    const d = new Date(nextFollowUp);
    if (isNaN(d.getTime())) {
      errors.next_follow_up = 'Invalid follow-up date';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Leads Assignment Validation
export interface LeadAssignmentData {
  lead_id: string;
  sales_id: string;
}

export function validateLeadAssignment(data: LeadAssignmentData): ValidationError {
  const errors: Record<string, string> = {};

  if (!data.lead_id) {
    errors.lead_id = 'Lead ID is required';
  } else if (!isValidUUID(data.lead_id)) {
    errors.lead_id = 'Lead ID must be a valid UUID';
  }

  if (!data.sales_id) {
    errors.sales_id = 'Sales Agent ID is required';
  } else if (!isValidUUID(data.sales_id)) {
    errors.sales_id = 'Sales Agent ID must be a valid UUID';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
