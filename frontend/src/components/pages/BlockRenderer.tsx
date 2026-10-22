import React from 'react';
import {
  CheckCircle2, HelpCircle, Mail, Send, Megaphone, ArrowRight,
  Sparkles, Phone, Clock, ExternalLink, Check,
} from 'lucide-react';
import type { StudioBlock } from '../../types';
import { getLang } from '../../utils/langHelpers';
import { RichTextEditor } from '../ui/RichTextEditor';

export interface BlockRendererProps {
  block: StudioBlock;
  lang: 'tr' | 'en' | 'ar';
  device?: 'desktop' | 'tablet' | 'mobile';
  isInteractive?: boolean;
  onUpdateBlock?: (patch: Partial<StudioBlock>) => void;
  editorRef?: React.MutableRefObject<any>;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  lang,
  device = 'desktop',
  isInteractive = false,
  onUpdateBlock,
  editorRef,
}) => {
  const isRtl = lang === 'ar';
  const isMobile = device === 'mobile';
  const isEditing = isInteractive && Boolean(onUpdateBlock);

  const title = getLang(block, 'title', lang);
  const subtitle = getLang(block, 'subtitle', lang);
  const content = getLang(block, 'content', lang);

  const primaryBtnText = getLang(block, 'btn_primary_text', lang, lang === 'tr' ? 'Hemen Keşfet' : lang === 'en' ? 'Explore Now' : 'اكتشف الآن');
  const secondaryBtnText = getLang(block, 'btn_secondary_text', lang, lang === 'tr' ? 'Daha Fazla Bilgi' : lang === 'en' ? 'Learn More' : 'معرفة المزيد');
  const badge = getLang(block, 'badge_text', lang, block.badge_text || 'MSK Labs');

  const getItemTitle = (it: any) => getLang(it, 'title', lang, it.title || '');
  const getItemText = (it: any) => getLang(it, 'text', lang, it.text || '');
  const getItemPrice = (it: any) => getLang(it, 'price', lang, it.price || '');
  const getItemBadge = (it: any) => getLang(it, 'badge', lang, it.badge);

  const handleTextChange = (field: string, val: string) => {
    if (onUpdateBlock) onUpdateBlock({ [lang === 'tr' ? `${field}_tr` : `${field}_${lang}`]: val } as any);
  };

  const handleItemChange = (itemId: string, itemField: string, val: string) => {
    if (!onUpdateBlock || !block.items) return;
    const targetField = lang === 'tr' ? `${itemField}_tr` : `${itemField}_${lang}`;
    const updated = block.items.map((it) => {
      if (it.id !== itemId) return it;
      const patch: any = { [targetField]: val };
      if (lang === 'tr') patch[itemField] = val;
      return { ...it, ...patch };
    });
    onUpdateBlock({ items: updated });
  };

  const InlineCanvasText: React.FC<{
    as?: any;
    value: string;
    onSave: (val: string) => void;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
  }> = ({ as: Component = 'span', value, onSave, className, style, placeholder }) => {
    if (!isEditing) return <Component className={className} style={style}>{value || placeholder}</Component>;
    return (
      <Component
        contentEditable
        suppressContentEditableWarning
        className={`${className || ''} inline-canvas-editable`}
        style={{ ...style, outline: 'none', cursor: 'text', borderRadius: '4px', padding: '1px 4px' }}
        title="Tıklayarak doğrudan düzenleyin"
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const txt = e.currentTarget.textContent || '';
          if (txt !== value) onSave(txt);
        }}
      >
        {value || placeholder}
      </Component>
    );
  };

  const InlineEditable = ({ as = 'span', value, field, className, style, placeholder }: any) => (
    <InlineCanvasText as={as} value={value} onSave={(txt) => handleTextChange(field, txt)} className={className} style={style} placeholder={placeholder} />
  );

  const InlineItemEditable = ({ as = 'span', value, itemId, itemField, className, style, placeholder }: any) => (
    <InlineCanvasText as={as} value={value} onSave={(txt) => handleItemChange(itemId, itemField, txt)} className={className} style={style} placeholder={placeholder} />
  );

  const getPaddingStyle = () =>
    block.padding_y === 'none' ? '0' : block.padding_y === 'sm' ? '16px 0' : block.padding_y === 'lg' ? (isMobile ? '36px 0' : '64px 0') : (isMobile ? '24px 0' : '40px 0');

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

  const getBorderRadius = () =>
    block.border_radius === 'none' ? '0' : block.border_radius === 'sm' ? '6px' : block.border_radius === 'lg' ? '20px' : block.border_radius === 'full' ? '9999px' : '12px';

  const containerStyle: React.CSSProperties = {
    padding: getPaddingStyle(),
    borderRadius: getBorderRadius(),
    direction: isRtl ? 'rtl' : 'ltr',
    textAlign: block.type === 'rich_text' ? undefined : (block.align || (isRtl ? 'right' : 'left')),
    fontFamily: isRtl ? "'Segoe UI', Tahoma, Arial, sans-serif" : undefined,
    ...getBgStyle(),
  };

  switch (block.type) {
    case 'hero': {
      return (
        <section style={{ ...containerStyle, padding: isMobile ? '28px 16px' : '48px 24px', textAlign: block.align || 'center' }}>
          {(badge || isEditing) && (
            <span className="admin-badge admin-badge-purple" style={{ marginBottom: '14px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} />
              <InlineEditable as="span" value={badge} field="badge_text" placeholder="Rozet Metni" />
            </span>
          )}
          <h1 style={{ fontSize: isMobile ? '1.75rem' : '2.5rem', fontWeight: 800, margin: '0 0 14px 0', lineHeight: 1.25, color: 'var(--text-primary)' }}>
            <InlineEditable as="span" value={title} field="title" placeholder="Başlık giriniz..." />
          </h1>
          {(subtitle || isEditing) && (
            <p style={{ fontSize: isMobile ? '1rem' : '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
              <InlineEditable as="span" value={subtitle} field="subtitle" placeholder="Alt başlık / açıklama giriniz..." />
            </p>
          )}
          <div style={{ display: 'flex', gap: '12px', justifyContent: block.align === 'left' ? 'flex-start' : block.align === 'right' ? 'flex-end' : 'center', flexWrap: 'wrap' }}>
            <button type="button" className="admin-btn admin-btn-primary" style={{ padding: '9px 24px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <InlineEditable as="span" value={primaryBtnText} field="btn_primary_text" placeholder="Birincil Buton" />
              <ArrowRight size={14} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
            </button>
            <button type="button" className="admin-btn admin-btn-secondary" style={{ padding: '9px 20px', fontSize: '13px' }}>
              <InlineEditable as="span" value={secondaryBtnText} field="btn_secondary_text" placeholder="İkincil Buton" />
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
          {(title || subtitle || isEditing) && (
            <div style={{ textAlign: block.align || 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                <InlineEditable as="span" value={title} field="title" placeholder="Izgara Başlığı" />
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
                <InlineEditable as="span" value={subtitle} field="subtitle" placeholder="Alt başlık..." />
              </p>
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
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  <InlineItemEditable as="span" value={getItemTitle(it)} itemId={it.id} itemField="title" placeholder="Kart Başlığı" />
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.55 }}>
                  <InlineItemEditable as="span" value={getItemText(it)} itemId={it.id} itemField="text" placeholder="Kart açıklaması..." />
                </p>
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
          {(title || subtitle || isEditing) && (
            <div style={{ textAlign: block.align || 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                <InlineEditable as="span" value={title} field="title" placeholder="SSS Başlığı" />
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
                <InlineEditable as="span" value={subtitle} field="subtitle" placeholder="SSS Alt başlığı..." />
              </p>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(block.items || []).map((it) => (
              <details
                key={it.id}
                open={true}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                }}
              >
                <summary style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span><InlineItemEditable as="span" value={getItemTitle(it)} itemId={it.id} itemField="title" placeholder="Soru..." /></span>
                  <HelpCircle size={15} className="text-cyan" />
                </summary>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '10px 0 0 0', lineHeight: 1.6 }}>
                  <InlineItemEditable as="span" value={getItemText(it)} itemId={it.id} itemField="text" placeholder="Cevap..." />
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
          {(title || subtitle || isEditing) && (
            <div style={{ textAlign: block.align || 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                <InlineEditable as="span" value={title} field="title" placeholder="Karşılaştırma Başlığı" />
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
                <InlineEditable as="span" value={subtitle} field="subtitle" placeholder="Açıklama..." />
              </p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : `repeat(${(block.items || []).length || 3}, minmax(0, 1fr))`, gap: '16px' }}>
            {(block.items || []).map((it) => {
              const itemBadge = getItemBadge(it);
              return (
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
                  {itemBadge && (
                    <span className="admin-badge admin-badge-cyan" style={{ position: 'absolute', top: '12px', right: isRtl ? 'auto' : '12px', left: isRtl ? '12px' : 'auto', fontSize: '10px' }}>
                      <InlineItemEditable as="span" value={itemBadge} itemId={it.id} itemField="badge" />
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                    <InlineItemEditable as="span" value={getItemTitle(it)} itemId={it.id} itemField="title" placeholder="Plan Adı" />
                  </h3>
                  <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent-primary)', marginBottom: '12px' }}>
                    <InlineItemEditable as="span" value={getItemPrice(it) || '$0'} itemId={it.id} itemField="price" placeholder="$0" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginBottom: '16px' }}>
                    {getItemText(it).split('\n').filter(Boolean).map((bullet: string, bIdx: number) => (
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
              );
            })}
          </div>
        </section>
      );
    }

    case 'contact_card': {
      return (
        <section style={{ ...containerStyle, padding: '24px 20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
            <InlineEditable as="span" value={title} field="title" placeholder="İletişim Başlığı" />
          </h3>
          {(subtitle || isEditing) && (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
              <InlineEditable as="span" value={subtitle} field="subtitle" placeholder="İletişim açıklaması..." />
            </p>
          )}
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
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    <InlineItemEditable as="span" value={getItemTitle(it)} itemId={it.id} itemField="title" placeholder="Kanal" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    <InlineItemEditable as="span" value={getItemText(it)} itemId={it.id} itemField="text" placeholder="Değer" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    case 'cta_banner': {
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
          <h2 style={{ fontSize: isMobile ? '1.35rem' : '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 10px 0' }}>
            <InlineEditable as="span" value={title} field="title" placeholder="Çağrı Başlığı" />
          </h2>
          {(subtitle || isEditing) && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
              <InlineEditable as="span" value={subtitle} field="subtitle" placeholder="Açıklama..." />
            </p>
          )}
          <button type="button" className="admin-btn admin-btn-primary" style={{ padding: '8px 24px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Send size={14} />
            <InlineEditable as="span" value={primaryBtnText} field="btn_primary_text" placeholder="Aksiyon Butonu" />
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
            <InlineEditable as="span" value={title || 'Sayfa Ortası Reklam Yuvası'} field="title" />
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
          {(title || isEditing) && (
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
              <InlineEditable as="span" value={title} field="title" placeholder="Bölüm Başlığı (Opsiyonel)" />
            </h2>
          )}
          {isEditing ? (
            <div style={{ marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
              <RichTextEditor
                value={content || ''}
                onChange={(html) => handleTextChange('content', html)}
                dir={isRtl ? 'rtl' : 'ltr'}
                placeholder="Metin ve görsellerinizi buraya girin (üst biçimlendirme çubuğunu kullanın)..."
                editorRef={editorRef}
                hideToolbar={true}
                hideHeader={true}
              />
            </div>
          ) : (
            <div
              className="rich-editor-content-area tiptap-content"
              style={{ fontSize: '14px', lineHeight: 1.75 }}
              dangerouslySetInnerHTML={{ __html: content || '<p style="color:var(--text-muted); font-style:italic;">(İçerik henüz girilmedi...)</p>' }}
            />
          )}
        </section>
      );
    }
  }
};
