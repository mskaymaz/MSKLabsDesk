/**
 * MSKLabsDesk — App Catalog JSON'dan D1 DB'ye Otomatik Aktarım Betiği
 * Çalıştırma: node scripts/import_apps_catalog.js [app_catalog_json_yolu]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function importAppsCatalog() {
  const catalogPath = process.argv[2] || path.join(__dirname, '../../AllAppReleaseWork/app_catalog.json');
  console.log(`[IMPORT CMS] ${catalogPath} okunuyor...`);

  if (!fs.existsSync(catalogPath)) {
    console.error(`[HATA] ${catalogPath} bulunamadı! Lütfen geçerli bir app_catalog.json yolu belirtin.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(catalogPath, 'utf8');
  const data = JSON.parse(raw);
  const apps = Array.isArray(data) ? data : (data.apps || []);

  let sqlCommands = [];

  apps.forEach((app, index) => {
    const appId = `app_${app.id || app.app_id || index}`;
    const nameTr = (app.name || app.title || 'Uygulama').replace(/'/g, "''");
    const descTr = (app.description || app.summary || '').replace(/'/g, "''");
    const iconUrl = (app.icon_url || app.icon || '').replace(/'/g, "''");
    const category = app.category || 'utility';

    sqlCommands.push(`
      INSERT OR REPLACE INTO apps (id, app_id, name_tr, description_tr, icon_url, category, display_order, is_active)
      VALUES ('${appId}', '${app.app_id || app.id}', '${nameTr}', '${descTr}', '${iconUrl}', '${category}', ${index + 1}, 1);
    `);

    if (app.latest_version || app.download_url || app.version) {
      const verId = `ver_${appId}_1`;
      const verName = app.latest_version || app.version || '1.0.0';
      const dlUrl = (app.download_url || app.apk_url || '#').replace(/'/g, "''");

      sqlCommands.push(`
        INSERT OR REPLACE INTO app_versions (id, app_id, version_name, download_url, platform)
        VALUES ('${verId}', '${appId}', '${verName}', '${dlUrl}', 'android');
      `);
    }
  });

  const tempSqlFile = path.join(__dirname, 'temp_import_apps.sql');
  fs.writeFileSync(tempSqlFile, sqlCommands.join('\n'), 'utf8');

  console.log(`[IMPORT CMS] ${sqlCommands.length} SQL komutu üretildi. D1 DB'ye aktarılıyor...`);

  try {
    const output = execSync(`npx wrangler d1 execute DB --local --file="${tempSqlFile}"`, {
      cwd: path.join(__dirname, '../backend'),
      encoding: 'utf8',
    });
    console.log('[BAŞARILI] Tüm uygulamalar D1 veritabanına başarıyla aktarıldı!');
    console.log(output);
  } catch (err) {
    console.error('[HATA] D1 aktarımı sırasında bir sorun oluştu:', err.message);
  } finally {
    if (fs.existsSync(tempSqlFile)) {
      fs.unlinkSync(tempSqlFile);
    }
  }
}

importAppsCatalog();
