/**
 * MSKLabsDesk — Google Sheets'ten Cloudflare D1'e Veri Aktarım Betiği
 * Kullanım: node scripts/import_google_sheets.js <destek_csv> <abone_csv>
 */

import fs from 'fs';
import path from 'path';

function generateSqlFromCsv(ticketsCsvPath, subscribersCsvPath) {
  let sqlStatements = ['-- MSKLabsDesk Data Import Migration'];

  if (fs.existsSync(ticketsCsvPath)) {
    const rawTickets = fs.readFileSync(ticketsCsvPath, 'utf-8');
    const lines = rawTickets.split('\n').filter(l => l.trim());
    const header = lines[0].split(',');

    lines.slice(1).forEach((line, index) => {
      const parts = line.split(',');
      if (parts.length >= 4) {
        const id = `MSK-MIG-${1000 + index}`;
        const name = parts[0]?.trim() || 'Misafir';
        const email = parts[1]?.trim() || 'bilgi@msklabs.org';
        const subject = parts[2]?.trim() || 'Genel Destek';
        const content = parts[3]?.trim() || '';

        sqlStatements.push(
          `INSERT INTO messages (id, sender_name, sender_email, subject, content, category, status) VALUES ('${id}', '${name.replace(/'/g, "''")}', '${email.replace(/'/g, "''")}', '${subject.replace(/'/g, "''")}', '${content.replace(/'/g, "''")}', 'general', 'open');`
        );
      }
    });
  }

  if (fs.existsSync(subscribersCsvPath)) {
    const rawSubs = fs.readFileSync(subscribersCsvPath, 'utf-8');
    const lines = rawSubs.split('\n').filter(l => l.trim());

    lines.slice(1).forEach((line, index) => {
      const email = line.trim();
      if (email && email.includes('@')) {
        const id = `sub_mig_${index}_${Math.random().toString(36).substring(2, 6)}`;
        sqlStatements.push(
          `INSERT OR IGNORE INTO subscribers (id, email, status, source) VALUES ('${id}', '${email.replace(/'/g, "''")}', 'active', 'google_sheets_import');`
        );
      }
    });
  }

  const outputPath = path.join(process.cwd(), 'backend', 'migrations', '0002_import_data.sql');
  fs.writeFileSync(outputPath, sqlStatements.join('\n'));
  console.log(`✅ Migration SQL üretildi: ${outputPath}`);
}

const [ticketsFile, subsFile] = process.argv.slice(2);
generateSqlFromCsv(ticketsFile || '', subsFile || '');
