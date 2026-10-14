-- MSKLabsDesk — Support Ticket Email Validation & Deliverability Tracking
-- Migration: 0004_ticket_email_validation.sql

ALTER TABLE messages ADD COLUMN email_status TEXT DEFAULT 'valid';
