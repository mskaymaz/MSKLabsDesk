/**
 * MSKLabsDesk — Destek Bilet Durumları ve Doğrulama Sözlüğü
 */

export const TICKET_STATUSES = [
  'unverified',
  'new',
  'open',
  'read',
  'in_progress',
  'resolved',
  'closed',
  'rejected',
  'cancelled',
  'spam'
] as const;

export type TicketStatusType = typeof TICKET_STATUSES[number];

export function isValidTicketStatus(status?: string | null): status is TicketStatusType {
  if (!status) return false;
  return (TICKET_STATUSES as readonly string[]).includes(status);
}
