import { isValidUUID } from './leads';

export interface ValidationError {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface TaskData {
  title?: string;
  description?: string;
  due_date?: string;
  reminder_at?: string;
  lead_id?: string;
  sales_id?: string;
  priority?: string;
  status?: string;
}

export function validateTask(data: TaskData): ValidationError {
  const errors: Record<string, string> = {};

  const title = data.title;
  const leadId = data.lead_id;
  const salesId = data.sales_id;
  const dueDate = data.due_date;
  const reminderAt = data.reminder_at;
  const priority = data.priority;
  const status = data.status;

  if (title !== undefined) {
    if (!title || title.trim().length === 0) {
      errors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (title.trim().length > 255) {
      errors.title = 'Title exceeds the 255 character maximum';
    }
  }

  if (leadId !== undefined && leadId !== null && leadId !== '') {
    if (!isValidUUID(leadId)) {
      errors.lead_id = 'Provided lead_id is not a valid UUID';
    }
  }

  if (salesId !== undefined && salesId !== null && salesId !== '') {
    if (!isValidUUID(salesId)) {
      errors.sales_id = 'Provided sales_id is not a valid UUID';
    }
  }

  let parsedDueDate: Date | null = null;
  let parsedReminderAt: Date | null = null;

  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    const d = new Date(dueDate);
    if (isNaN(d.getTime())) {
      errors.due_date = 'due_date is not in a valid ISO format';
    } else {
      parsedDueDate = d;
    }
  }

  if (reminderAt !== undefined && reminderAt !== null && reminderAt !== '') {
    const d = new Date(reminderAt);
    if (isNaN(d.getTime())) {
      errors.reminder_at = 'reminder_at is not in a valid ISO format';
    } else {
      parsedReminderAt = d;
    }
  }

  if (parsedDueDate && parsedReminderAt) {
    if (parsedReminderAt.getTime() >= parsedDueDate.getTime()) {
      errors.reminder_at = 'The reminder time is set equal to or after the task due date';
    }
  }

  if (priority !== undefined && priority !== null && priority !== '') {
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    if (!validPriorities.includes(priority.toUpperCase())) {
      errors.priority = 'priority must be one of LOW, MEDIUM, HIGH, URGENT';
    }
  }

  if (status !== undefined && status !== null && status !== '') {
    const validStatuses = ['OPEN', 'OVERDUE', 'COMPLETED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      errors.status = 'status must be one of OPEN, OVERDUE, COMPLETED';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
