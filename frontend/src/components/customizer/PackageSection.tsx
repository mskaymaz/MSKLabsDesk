import React, { useState } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';

interface PackageSectionProps {
  onExportJSON: () => void;
  onImportJSON: (json: string) => void;
  onReset: () => void;
}

export const PackageSection: React.FC<PackageSectionProps> = ({
  onExportJSON,
  onImportJSON,
  onReset,
}) => {
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <h4 className="admin-card-title" style={{ fontSize: '0.84rem', marginBottom: '4px' }}>
          Tema Paketini Dışa Aktar (Export)
        </h4>
        <p className="admin-card-desc" style={{ fontSize: '0.74rem', marginBottom: '8px' }}>
          Tüm bu ayarları JSON formatında indirerek başka bir müşteriye veya projeye tek tıkla yükleyebilirsiniz.
        </p>
        <button
          type="button"
          onClick={onExportJSON}
          className="admin-btn admin-btn-primary admin-btn-sm"
          style={{ width: '100%' }}
        >
          <Download size={14} /> JSON Tema Paketini İndir
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <h4 className="admin-card-title" style={{ fontSize: '0.84rem', marginBottom: '4px' }}>
          Tema Paketini İçe Aktar (Import)
        </h4>
        <p className="admin-card-desc" style={{ fontSize: '0.74rem', marginBottom: '6px' }}>
          Elinizdeki tema JSON metnini buraya yapıştırıp sisteme uygulayabilirsiniz:
        </p>
        <textarea
          rows={3}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder='{"accentPrimary": "#3b82f6", ...}'
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            padding: '6px',
            borderRadius: 'var(--radius-sm, 4px)',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-input, rgba(0,0,0,0.2))',
            color: 'var(--text-primary)',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
          <button
            type="button"
            onClick={() => {
              if (!importText.trim()) return;
              try {
                onImportJSON(importText);
                setImportStatus('✅ Tema başarıyla yüklendi.');
                setImportText('');
              } catch (err: any) {
                setImportStatus(`❌ Hata: ${err.message}`);
              }
            }}
            className="admin-btn admin-btn-view admin-btn-sm"
            style={{ flex: 1 }}
          >
            <Upload size={14} /> Temayı Yükle ve Uygula
          </button>
        </div>
        {importStatus && (
          <span className="admin-meta-text" style={{ fontSize: '0.70rem', display: 'block', marginTop: '4px' }}>
            {importStatus}
          </span>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <h4 className="admin-card-title" style={{ fontSize: '0.84rem', marginBottom: '4px' }}>
          Fabrika Ayarlarına Dön
        </h4>
        <button
          type="button"
          onClick={onReset}
          className="admin-btn admin-btn-refresh admin-btn-sm"
          style={{ width: '100%' }}
        >
          <RotateCcw size={14} /> Bu Temanın Varsayılan Ayarlarına Sıfırla
        </button>
      </div>
    </div>
  );
};
