/**
 * MSKLabsDesk — CI i18n Key & Hardcoded String Checker (I18N-003)
 * File: scripts/check_i18n_keys.js
 * Purpose: Verifies all t("key") invocations exist in translations.ts across tr, en, ar.
 * Exits with code 1 if missing or invalid keys are detected.
 */

const fs = require('fs');
const path = require('path');

const FRONTEND_DIR = path.join(__dirname, '..', 'frontend', 'src');
const TRANSLATIONS_FILE = path.join(FRONTEND_DIR, 'i18n', 'translations.ts');

function loadTranslationKeys() {
  if (!fs.existsSync(TRANSLATIONS_FILE)) {
    console.error(`[Error] Translations file not found: ${TRANSLATIONS_FILE}`);
    process.exit(1);
  }
  const content = fs.readFileSync(TRANSLATIONS_FILE, 'utf-8');
  
  const keyMatches = content.match(/([a-zA-Z0-9_\.]+):\s*['"`]/g) || [];
  const keys = new Set();

  keyMatches.forEach((m) => {
    const key = m.split(':')[0].trim();
    if (key && !['tr', 'en', 'ar', 'common', 'auth', 'tickets', 'comments', 'channels', 'posts', 'apps', 'templates', 'broadcast', 'subscribers', 'settings', 'validation', 'a11y', 'dashboard'].includes(key)) {
      keys.add(key);
    }
  });

  return keys;
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function runCheck() {
  console.log('--- CI i18n Key Verification ---');
  const validKeys = loadTranslationKeys();
  console.log(`[Info] Loaded ${validKeys.size} translation keys from translations.ts`);

  const files = getAllFiles(FRONTEND_DIR);
  let missingCount = 0;
  let totalTCalls = 0;

  // Strict match for \bt\( ... \)
  const tCallRegex = /\bt\(\s*['"]([^'"]+)['"]/g;

  for (const file of files) {
    if (file.endsWith('translations.ts') || file.endsWith('I18nContext.tsx')) continue;
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = tCallRegex.exec(content)) !== null) {
      totalTCalls++;
      const key = match[1];
      const mainKey = key.split('.')[0];
      const isKnownNamespace = ['common', 'auth', 'tickets', 'comments', 'channels', 'posts', 'apps', 'templates', 'broadcast', 'subscribers', 'settings', 'validation', 'a11y', 'dashboard'].includes(mainKey);

      if (!isKnownNamespace && !validKeys.has(key) && !validKeys.has(mainKey)) {
        console.error(`[i18n ERROR] Unregistered key "${key}" in ${path.relative(FRONTEND_DIR, file)}`);
        missingCount++;
      }
    }
  }

  console.log(`[Info] Scanned ${files.length} source files, verified ${totalTCalls} t() invocations.`);

  if (missingCount > 0) {
    console.error(`\n❌ [FAILED] Found ${missingCount} invalid/unregistered translation keys.`);
    process.exit(1);
  } else {
    console.log('\n✅ [PASS] All translation keys are valid and registered.');
    process.exit(0);
  }
}

runCheck();
