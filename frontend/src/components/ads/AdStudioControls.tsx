import React, { useState, useMemo } from 'react';
import {
  Monitor,
  Smartphone,
  Maximize2,
  Sliders,
  Pin,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  AlertCircle,
} from 'lucide-react';
import type { AdPlacementSetting, AdDeviceConfig } from '../../types';
import { Switch } from '../ui/Input';
import { ADSENSE_MASTER_CATALOG, getEnabledPresets } from '../../utils/adDimensions';

interface AdStudioControlsProps {
  ad: AdPlacementSetting;
  onChange: (updated: AdPlacementSetting) => void;
  activeDevice: 'desktop' | 'mobile';
  onDeviceChange: (device: 'desktop' | 'mobile') => void;
  enabledPresets?: string[];
}

const MARGIN_ITEMS: Array<{ key: keyof AdDeviceConfig; label: string }> = [
  { key: 'margin_top', label: 'Üst (T)' },
  { key: 'margin_right', label: 'Sağ (R)' },
  { key: 'margin_bottom', label: 'Alt (B)' },
  { key: 'margin_left', label: 'Sol (L)' },
];

export const AdStudioControls: React.FC<AdStudioControlsProps> = ({
  ad,
  onChange,
  activeDevice,
  onDeviceChange,
  enabledPresets,
}) => {
  const currentConfig: AdDeviceConfig = activeDevice === 'desktop' ? ad.desktop : ad.mobile;
  const isMobile = activeDevice === 'mobile';

  const slotKey = ad.slot_key || '';
  const isVerticalSlot = slotKey.includes('sidebar_left') || slotKey.includes('sidebar_right');

  const [extraCustomPresets, setExtraCustomPresets] = useState<Array<{ value: string; label: string }>>([]);

  const updateConfigField = (field: keyof AdDeviceConfig, val: any) => {
    onChange({
      ...ad,
      [activeDevice]: { ...currentConfig, [field]: val },
    });
  };

  // Aktif filtrelenmiş ebat listesi
  const presets = useMemo(() => {
    const activeKeys = enabledPresets || getEnabledPresets();
    const catalogFiltered = ADSENSE_MASTER_CATALOG.filter((item) => activeKeys.includes(item.key));

    const list: Array<{ value: string; label: string }> = [];

    // RESPONSIVE her zaman en başta
    list.push({ value: 'RESPONSIVE', label: 'RESPONSIVE — Otomatik / Esnek' });

    catalogFiltered.forEach((item) => {
      if (item.key !== 'RESPONSIVE' && item.key !== 'CUSTOM') {
        list.push({ value: item.key, label: item.label });
      }
    });

    // Kullanıcının "Şablon Yap" ile eklediği özel ebatlar
    extraCustomPresets.forEach((item) => {
      if (!list.some((existing) => existing.value === item.value)) {
        list.push(item);
      }
    });

    // Eğer mevcut preset listede yoksa kaybolmaması için ekle
    if (
      currentConfig.preset_size &&
      currentConfig.preset_size !== 'CUSTOM' &&
      !list.some((existing) => existing.value === currentConfig.preset_size)
    ) {
      list.push({
        value: currentConfig.preset_size,
        label: `${currentConfig.preset_size} (Mevcut)`,
      });
    }

    // CUSTOM her zaman en sonda
    list.push({ value: 'CUSTOM', label: 'CUSTOM — Özel Boyut Girişi' });

    return list;
  }, [enabledPresets, currentConfig.preset_size, extraCustomPresets]);

  const handleSaveCustomAsPreset = () => {
    const w = Number(currentConfig.custom_width);
    const h = Number(currentConfig.custom_height);
    if (!w || !h || w <= 0 || h <= 0) return;

    const newKey = `${w}x${h}`;
    const newEntry = { value: newKey, label: `${newKey} — Özel Şablon` };

    if (!extraCustomPresets.some((p) => p.value === newKey)) {
      setExtraCustomPresets((prev) => [...prev, newEntry]);
    }

    updateConfigField('preset_size', newKey);
  };

  return (
    <div
      style={{
        background: 'var(--bg-card, #1e293b)',
        border: '1px solid var(--border-subtle, #334155)',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* 1. ÜST SATIR: Client ID + Slot ID + (Sağda) Cihaz Butonları & Cihaz Aktifliği */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        {/* Sol: Client ID & Slot ID */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              Client ID:
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="ca-pub-1234567890"
              value={ad.ad_client || ''}
              onChange={(e) => onChange({ ...ad, ad_client: e.target.value })}
              style={{ width: '190px', fontSize: '0.8rem', padding: '4px 8px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              Slot ID:
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Örn: 9876543210"
              value={ad.ad_slot || ''}
              onChange={(e) => onChange({ ...ad, ad_slot: e.target.value })}
              style={{ width: '120px', fontSize: '0.8rem', padding: '4px 8px' }}
            />
          </div>

          {/* Sayfa Kapsamı ve Filtreleme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              Kapsam:
            </label>
            <select
              className="form-select"
              value={ad.target_scope || 'all'}
              onChange={(e) => onChange({ ...ad, target_scope: e.target.value as any })}
              style={{ fontSize: '0.78rem', padding: '4px 8px', width: '150px' }}
            >
              <option value="all">🌐 Tüm Sitede</option>
              <option value="home">🏠 Ana Sayfa</option>
              <option value="blog">📖 Blog Sayfaları</option>
              <option value="apps">📱 Uygulamalar</option>
              <option value="corporate">ℹ️ İletişim &amp; Kurumsal</option>
              <option value="custom">🎯 Belirli Sayfa (URL)</option>
            </select>
          </div>

          {ad.target_scope === 'custom' && (
            <input
              type="text"
              className="form-input"
              placeholder="/contact.html, /about.html"
              value={(ad.target_paths || []).join(', ')}
              onChange={(e) => onChange({
                ...ad,
                target_paths: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })}
              style={{ width: '160px', fontSize: '0.76rem', padding: '4px 6px' }}
              title="Gösterilecek sayfalar (virgülle ayrılmış)"
            />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }} title="Bu sayfalarda kesinlikle gizle">Hariç:</span>
            <input
              type="text"
              className="form-input"
              placeholder="Örn: /about.html"
              value={(ad.excluded_paths || []).join(', ')}
              onChange={(e) => onChange({
                ...ad,
                excluded_paths: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })}
              style={{ width: '115px', fontSize: '0.74rem', padding: '4px 6px' }}
              title="Hariç tutulacak (gizlenecek) sayfalar (virgülle ayrılmış)"
            />
          </div>
        </div>

        {/* Sağ: Masaüstü/Mobil Dönüşüm ve Aktiflik */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'inline-flex', background: 'var(--bg-secondary, #0f172a)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle, #334155)' }}>
            <button
              type="button"
              onClick={() => onDeviceChange('desktop')}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', fontSize: '0.78rem',
                fontWeight: activeDevice === 'desktop' ? 700 : 500,
                background: activeDevice === 'desktop' ? 'var(--accent-primary, #6366f1)' : 'transparent',
                color: activeDevice === 'desktop' ? '#ffffff' : 'var(--text-primary)',
                border: 'none', borderRadius: '4px', cursor: 'pointer',
              }}
            >
              <Monitor size={12} />
              <span>Masaüstü (Web)</span>
            </button>
            <button
              type="button"
              onClick={() => onDeviceChange('mobile')}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', fontSize: '0.78rem',
                fontWeight: activeDevice === 'mobile' ? 700 : 500,
                background: activeDevice === 'mobile' ? 'var(--accent-primary, #6366f1)' : 'transparent',
                color: activeDevice === 'mobile' ? '#ffffff' : 'var(--text-primary)',
                border: 'none', borderRadius: '4px', cursor: 'pointer',
              }}
            >
              <Smartphone size={12} />
              <span>Mobil</span>
            </button>
          </div>

          {/* Dikey reklam mobilde seçilmişse kilitli bilgi rozeti; değilse normal switch */}
          {isVerticalSlot && isMobile ? (
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'rgba(234, 179, 8, 0.15)',
                color: '#eab308',
                fontWeight: 700,
              }}
            >
              Mobilde Gizli
            </span>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: currentConfig.is_enabled ? 'var(--accent-emerald, #10b981)' : 'var(--text-secondary)' }}>
                {currentConfig.is_enabled ? 'Açık' : 'Kapalı'}
              </span>
              <Switch
                checked={Boolean(currentConfig.is_enabled)}
                onChange={(e) => updateConfigField('is_enabled', e.target.checked)}
                aria-label="Cihaz aktiflik anahtarı"
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. ALT SATIR: Dikey reklam mobildeyse açıklama paneli; değilse kontroller */}
      {isVerticalSlot && isMobile ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-secondary, #0f172a)',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid rgba(234, 179, 8, 0.3)',
          }}
        >
          <AlertCircle size={15} color="#eab308" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
            <strong>Dikey Yan Sütun Reklamı:</strong> Bu yerleşim (120x600 / 160x600) web vitrininde mobil ekranlarda otomatik olarak gizlenir (<code>display: none</code>). Yalnızca masaüstü görünümde yayınlanır.
          </span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            background: 'var(--bg-secondary, #0f172a)',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle, #334155)',
            opacity: currentConfig.is_enabled ? 1 : 0.65,
          }}
        >
          {/* Ebat Şablonu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <Maximize2 size={13} color="var(--accent-primary)" />
              Ebat:
            </label>
            <select
              className="form-select"
              value={currentConfig.preset_size || 'RESPONSIVE'}
              onChange={(e) => updateConfigField('preset_size', e.target.value)}
              style={{ width: '235px', fontSize: '0.8rem', padding: '4px 8px', fontWeight: 600 }}
            >
              {presets.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Özel Boyut Girişi ve [Şablon Yap] */}
          {currentConfig.preset_size === 'CUSTOM' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="number"
                min={50}
                max={1400}
                className="form-input"
                placeholder="W"
                value={currentConfig.custom_width || ''}
                onChange={(e) => updateConfigField('custom_width', Number(e.target.value) || null)}
                style={{ width: '58px', fontSize: '0.8rem', padding: '3px 4px', textAlign: 'center' }}
                title="Genişlik (W px)"
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>x</span>
              <input
                type="number"
                min={30}
                max={1000}
                className="form-input"
                placeholder="H"
                value={currentConfig.custom_height || ''}
                onChange={(e) => updateConfigField('custom_height', Number(e.target.value) || null)}
                style={{ width: '58px', fontSize: '0.8rem', padding: '3px 4px', textAlign: 'center' }}
                title="Yükseklik (H px)"
              />
              {Boolean(currentConfig.custom_width && currentConfig.custom_height) && (
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={handleSaveCustomAsPreset}
                  style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', padding: '3px 6px' }}
                  title="Şablon listesine ekle"
                >
                  <Plus size={11} />
                  <span>Şablon Yap</span>
                </button>
              )}
            </div>
          )}

          {/* 4 Yönlü Marj Spinbox'ları */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <Sliders size={13} color="var(--accent-primary)" />
              Marjlar:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {MARGIN_ITEMS.map((item) => (
                <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}:</span>
                  <input
                    type="number"
                    min={0}
                    max={120}
                    className="form-input"
                    value={(currentConfig as any)[item.key] ?? 0}
                    onChange={(e) => updateConfigField(item.key, Math.max(0, Number(e.target.value) || 0))}
                    style={{ width: '46px', fontSize: '0.78rem', padding: '2px 3px', textAlign: 'center' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Hizalama */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Hizala:</span>
            <div style={{ display: 'inline-flex', background: 'var(--bg-card)', borderRadius: '4px', padding: '1px', border: '1px solid var(--border-subtle)' }}>
              {(['left', 'center', 'right'] as const).map((al) => (
                <button
                  key={al}
                  type="button"
                  onClick={() => updateConfigField('align', al)}
                  style={{
                    padding: '2px 5px',
                    background: (currentConfig.align || 'center') === al ? 'var(--accent-primary)' : 'transparent',
                    color: (currentConfig.align || 'center') === al ? '#fff' : 'var(--text-primary)',
                    border: 'none', borderRadius: '3px', cursor: 'pointer', display: 'flex',
                  }}
                  title={al === 'left' ? 'Sola' : al === 'right' ? 'Sağa' : 'Ortala'}
                >
                  {al === 'left' && <AlignLeft size={11} />}
                  {al === 'center' && <AlignCenter size={11} />}
                  {al === 'right' && <AlignRight size={11} />}
                </button>
              ))}
            </div>
          </div>

          {/* Sticky (Sadece Masaüstü) */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Pin size={12} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>Sticky:</span>
              <Switch
                checked={Boolean(currentConfig.is_sticky)}
                onChange={(e) => updateConfigField('is_sticky', e.target.checked)}
                aria-label="Sticky toggle"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
