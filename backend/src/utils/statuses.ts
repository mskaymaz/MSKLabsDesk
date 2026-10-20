/**
 * MSKLabsDesk — Destek Bilet Durumları ve Doğrulama Sözlüğü
 */

export const TICKET_STATUSES = [
  'new',
  'open',
  'in_progress',
  'resolved',
  'closed',
  'rejected',
  'spam'
] as const;

export type TicketStatusType = typeof TICKET_STATUSES[number];

export function isValidTicketStatus(status?: string | null): status is TicketStatusType {
  if (!status) return false;
  return (TICKET_STATUSES as readonly string[]).includes(status);
}
