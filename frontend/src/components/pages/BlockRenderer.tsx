import React from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Mail,
  Send,
  Megaphone,
  ArrowRight,
  Sparkles,
  Phone,
  Clock,
  ExternalLink,
  Check,
} from 'lucide-react';
import type { StudioBlock } from '../../types';

export interface BlockRendererProps {
  block: StudioBlock;
  lang: 'tr' | 'en' | 'ar';
  device?: 'desktop' | 'tablet' | 'mobile';
  isInteractive?: boolean;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  lang,
  device = 'desktop',
  isInteractive = false,
}) => {
  const isRtl = lang === 'ar';
  const isMobile = device === 'mobile';

  const title = (lang === 'tr' ? block.title_tr : lang === 'en' ? block.title_en : block.title_ar) || block.title_tr || '';
  const subtitle = (lang === 'tr' ? block.subtitle_tr : lang === 'en' ? block.subtitle_en : block.subtitle_ar) || block.subtitle_tr || '';
  const content = (lang === 'tr' ? block.content_tr : lang === 'en' ? block.content_en : block.content_ar) || block.content_tr || '';

  const getPaddingStyle = () => {
    switch (block.padding_y) {
      case 'none': return '0';
      case 'sm': return '16px 0';
      case 'lg': return isMobile ? '36px 0' : '64px 0';
      case 'md':
      default: return isMobile ? '24px 0' : '40px 0';
    }
  };

  const getBgStyle = (): React.CSSProperties => {
    if (block.bg_image) {
      return {
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.88)), url(${block.bg_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
      };
    }
    switch (block.bg_variant) {
      case 'surface':
        return { background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' };
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12), rgba(99, 102, 241, 0.12))',
          border: '1px solid rgba(2, 132, 199, 0.25)',
        };
      case 'muted':
        return { background: 'transparent' };
      case 'default':
      default:
        return { background: 'var(--bg-card)', border: '1px solid var(--border-color)' };
    }
  };

  const getBorderRadius = () => {
    switch (block.border_radius) {
      case 'none': return '0';
      case 'sm': return '6px';
      case 'lg': return '20px';
      case 'full': return '9999px';
      case 'md':
      default: return '12px';
    }
  };

  const containerStyle: React.CSSProperties = {
    padding: getPaddingStyle(),
    borderRadius: getBorderRadius(),
    direction: isRtl ? 'rtl' : 'ltr',
    textAlign: block.align || (isRtl ? 'right' : 'left'),
    ...getBgStyle(),
  };

  switch (block.type) {
    case 'hero': {
      const primaryBtnText = block.btn_primary_text || (lang === 'tr' ? 'Hemen Keşfet' : lang === 'en' ? 'Explore Now' : 'اكتشف الآن');
      const secondaryBtnText = block.btn_secondary_text || (lang === 'tr' ? 'Daha Fazla Bilgi' : lang === 'en' ? 'Learn More' : 'معرفة المزيد');
      const badge = block.badge_text || 'MSK Labs';

      return (
        <section style={{ ...containerStyle, padding: isMobile ? '28px 16px' : '48px 24px', textAlign: block.align || 'center' }}>
          {badge && (
            <span className="admin-badge admin-badge-purple" style={{ marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} />
              {badge}
            </span>
          )}
          <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 800, margin: '0 0 14px 0', lineHeight: 1.25, color: 'var(--text-primary)' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: isMobile ? '1rem' : '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              {subtitle}
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: block.align === 'left' ? 'flex-start' : block.align === 'right' ? 'flex-end' : 'center', flexWrap: 'wrap' }}>
            <button type="button" className="admin-btn admin-btn-primary" style={{ padding: '9px 24px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span>{primaryBtnText}</span>
              <ArrowRight size={14} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '9px 20px', fontSize: '13px' }}>
              <span>{secondaryBtnText}</span>
            </button>
          </div>
        </section>
      );
    }

    case 'features_grid': {
      const cols = block.grid_columns || 3;
      const gridTemplate = isMobile ? '1fr' : `repeat(${cols}, minmax(0, 1fr))`;

      return (
        <section style={{ ...containerStyle, padding: '24px 16px' }}>
          {(title || subtitle) && (
            <div style={{ textAlign: block.align || 'center', marginBottom: '24px' }}>
              {title && <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>}
              {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>{subtitle}</p>}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '16px' }}>
            {(block.items || []).map((it) => (
              <div
                key={it.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                  <CheckCircle2 size={18} />
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{it.title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>{it.text}</p>
                {it.link && (
                  <span style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    İncele <ExternalLink size={11} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'faq_accordion': {
      return (
        <section style={{ ...containerStyle, padding: '24px 16px' }}>
          {(title || subtitle) && (
            <div style={{ textAlign: block.align || 'center', marginBottom: '20px' }}>
              {title && <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>}
              {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>{subtitle}</p>}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(block.items || []).map((it) => (
              <details
                key={it.id}
                open={!isInteractive}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                }}
              >
                <summary style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{it.title}</span>
                  <HelpCircle size={15} className="text-cyan" />
                </summary>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '10px 0 0 0', lineHeight: 1.6 }}>
                  {it.text}
                </p>
              </details>
            ))}
          </div>
        </section>
      );
    }

    case 'comparison_table': {
      return (
        <section style={{ ...containerStyle, padding: '28px 16px' }}>
          {(title || subtitle) && (
            <div style={{ textAlign: block.align || 'center', marginBottom: '24px' }}>
              {title && <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{title}</h2>}
              {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>{subtitle}</p>}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${(block.items || []).length || 3}, minmax(0, 1fr))`, gap: '16px' }}>
            {(block.items || []).map((it) => (
              <div
                key={it.id}
                style={{
                  background: it.highlight ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-secondary)',
                  border: it.highlight ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                {it.badge && (
                  <span className="admin-badge admin-badge-cyan" style={{ position: 'absolute', top: '12px', right: isRtl ? 'auto' : '12px', left: isRtl ? '12px' : 'auto', fontSize: '10px' }}>
                    {it.badge}
                  </span>
                )}
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>{it.title}</h3>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '12px' }}>
                  {it.price || '$0'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginBottom: '16px' }}>
                  {it.text.split('\n').filter(Boolean).map((bullet, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <Check size={14} className="text-emerald" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
                <button type="button" className={`admin-btn ${it.highlight ? 'admin-btn-primary' : 'admin-btn-secondary'}`} style={{ width: '100%', padding: '8px', fontSize: '12px' }}>
                  {lang === 'tr' ? 'Planı Seç' : lang === 'en' ? 'Select Plan' : 'اختر الخطة'}
                </button>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'contact_card': {
      return (
        <section style={{ ...containerStyle, padding: '24px 20px' }}>
          {title && <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>{title}</h3>}
          {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>{subtitle}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <Mail size={16} className="text-cyan" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>E-Posta</div>
                <a href="mailto:destek@msklabs.org" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)' }}>destek@msklabs.org</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
              <Clock size={16} className="text-emerald" />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Destek Saatleri</div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>Hafta İçi 09:00 - 18:00</span>
              </div>
            </div>
            {(block.items || []).map((it) => (
              <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                <Phone size={16} className="text-purple" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{it.title}</div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{it.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'cta_banner': {
      const btnText = block.btn_primary_text || (lang === 'tr' ? 'İletişime Geç' : lang === 'en' ? 'Get In Touch' : 'اتصل بنا');

      return (
        <section
          style={{
            ...containerStyle,
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.16), rgba(99, 102, 241, 0.16))',
            border: '1px solid rgba(2, 132, 199, 0.35)',
            padding: isMobile ? '24px 16px' : '36px 24px',
            textAlign: block.align || 'center',
          }}
        >
          <h2 style={{ fontSize: isMobile ? '1.35rem' : '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>{title}</h2>
          {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>{subtitle}</p>}
          <button type="button" className="admin-btn admin-btn-primary" style={{ padding: '8px 24px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Send size={14} />
            <span>{btnText}</span>
          </button>
        </section>
      );
    }

    case 'ad_hook': {
      return (
        <section
          style={{
            ...containerStyle,
            border: '2px dashed var(--accent-cyan)',
            background: 'rgba(2, 132, 199, 0.05)',
            padding: '20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Megaphone size={20} className="text-cyan" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            {title || 'Sayfa Ortası Reklam Yuvası'}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            Bağlı Yuva: {block.ad_slot_key || 'ad_in_content'}
          </span>
        </section>
      );
    }

    case 'rich_text':
    default: {
      return (
        <section style={containerStyle}>
          {title && <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h2>}
          <div
            style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--text-primary)' }}
            dangerouslySetInnerHTML={{ __html: content || '<p><em>Metin bloğu içeriği...</em></p>' }}
          />
        </section>
      );
    }
  }
};
