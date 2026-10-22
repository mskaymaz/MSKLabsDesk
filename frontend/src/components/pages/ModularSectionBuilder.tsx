import React from 'react';
import { Plus, Trash2, HelpCircle, Layers, Mail, Sparkles } from 'lucide-react';

export interface ModularItem {
  id: string;
  title: string;
  text: string;
  icon?: string;
}

export interface PageSection {
  id: string;
  type: 'faq' | 'features' | 'contact_card' | 'hero';
  title: string;
  subtitle?: string;
  items: ModularItem[];
}

export interface ModularSectionBuilderProps {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
  lang: 'tr' | 'en' | 'ar';
}

export const ModularSectionBuilder: React.FC<ModularSectionBuilderProps> = ({
  sections,
  onChange,
  lang,
}) => {
  const isRtl = lang === 'ar';

  const addSection = (type: PageSection['type']) => {
    const newSection: PageSection = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      title:
        type === 'faq'
          ? (lang === 'tr' ? 'Sıkça Sorulan Sorular' : lang === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة')
          : type === 'features'
          ? (lang === 'tr' ? 'Temel İlkelerimiz' : lang === 'en' ? 'Core Principles' : 'المبادئ الأساسية')
          : type === 'contact_card'
          ? (lang === 'tr' ? 'İletişim Kanalları' : lang === 'en' ? 'Contact Channels' : 'قنوات الاتصال')
          : (lang === 'tr' ? 'Sayfa Başlığı & Slogan' : lang === 'en' ? 'Page Hero & Slogan' : 'عنوان الصفحة والشعار'),
      subtitle: '',
      items: [
        {
          id: `item_${Date.now()}_1`,
          title:
            type === 'faq'
              ? (lang === 'tr' ? 'Örnek Soru 1' : lang === 'en' ? 'Sample Question 1' : 'سؤال توضيحي 1')
              : (lang === 'tr' ? 'Özellik / İlke Başlığı' : lang === 'en' ? 'Feature Title' : 'عنوان الميزة'),
          text:
            type === 'faq'
              ? (lang === 'tr' ? 'Bu soruya ait detaylı açıklama buraya yazılır.' : lang === 'en' ? 'Detailed explanation goes here.' : 'تكتب الإجابة المفصلة هنا.')
              : (lang === 'tr' ? 'İlke veya özelliğin detaylı açıklaması.' : lang === 'en' ? 'Detailed feature description.' : 'وصف مفصل للميزة أو المبدأ.'),
          icon: type === 'features' ? 'Shield' : undefined,
        },
      ],
    };
    onChange([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    onChange(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, patch: Partial<PageSection>) => {
    onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const addItem = (sectionId: string) => {
    onChange(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        const newItem: ModularItem = {
          id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          title: lang === 'tr' ? 'Yeni Madde / Soru' : lang === 'en' ? 'New Item / Question' : 'بند جديد / سؤال',
          text: lang === 'tr' ? 'Açıklama metni...' : lang === 'en' ? 'Description text...' : 'نص الشرح...',
        };
        return { ...s, items: [...s.items, newItem] };
      })
    );
  };

  const removeItem = (sectionId: string, itemId: string) => {
    onChange(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        return { ...s, items: s.items.filter((it) => it.id !== itemId) };
      })
    );
  };

  const updateItem = (sectionId: string, itemId: string, patch: Partial<ModularItem>) => {
    onChange(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
        };
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Üst Blok Ekleme Araç Çubuğu */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 16px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Sayfaya Modüler Blok Ekle:
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => addSection('faq')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <HelpCircle size={14} className="text-cyan" />
            <span>+ SSS Akordeonu</span>
          </button>
          <button
            type="button"
            onClick={() => addSection('features')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Layers size={14} className="text-emerald" />
            <span>+ Özellik / İlke Kartları</span>
          </button>
          <button
            type="button"
            onClick={() => addSection('contact_card')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Mail size={14} className="text-amber" />
            <span>+ İletişim Kutusu</span>
          </button>
          <button
            type="button"
            onClick={() => addSection('hero')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={14} className="text-purple" />
            <span>+ Hero Slogan</span>
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <div
          style={{
            padding: '36px 20px',
            textAlign: 'center',
            background: 'var(--bg-card)',
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-muted)',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px' }}>
            Henüz modüler blok eklenmedi. Yukarıdaki butonları kullanarak SSS akordeonları veya özellik kartları ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        sections.map((section) => (
          <div
            key={section.id}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {/* Bölüm Başlığı ve Aksiyonlar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                <span
                  className="admin-badge admin-badge-cyan"
                  style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: 700 }}
                >
                  {section.type === 'faq'
                    ? 'SSS Akordeonu'
                    : section.type === 'features'
                    ? 'Özellik / İlke Kartları'
                    : section.type === 'contact_card'
                    ? 'İletişim Kutusu'
                    : 'Hero Slogan'}
                </span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  placeholder="Bölüm Başlığı"
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    fontWeight: 700,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="admin-btn admin-btn-danger admin-btn-sm"
                title="Bölümü Sil"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {/* Alt Başlık / Açıklama */}
            <div>
              <input
                type="text"
                value={section.subtitle || ''}
                onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                placeholder="İsteğe bağlı bölüm alt açıklaması..."
                style={{
                  width: '100%',
                  fontSize: '12px',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'var(--text-secondary)',
                }}
              />
            </div>

            {/* Bölüm Maddeleri / Kartları */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              {section.items.map((item, itIdx) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
                      #{itIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(section.id, item.id, { title: e.target.value })}
                      placeholder={section.type === 'faq' ? 'Soru Başlığı' : 'Madde / Kart Başlığı'}
                      style={{
                        flex: 1,
                        fontSize: '13px',
                        fontWeight: 600,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(section.id, item.id)}
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      title="Maddeyi Sil"
                      style={{ padding: '4px 8px' }}
                    >
                      <Trash2 size={12} className="text-rose" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={item.text}
                    onChange={(e) => updateItem(section.id, item.id, { text: e.target.value })}
                    placeholder={section.type === 'faq' ? 'Soruya ait cevap...' : 'Maddeye ait açıklama metni...'}
                    style={{
                      width: '100%',
                      fontSize: '12px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: 'var(--text-primary)',
                      resize: 'vertical',
                    }}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addItem(section.id)}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '4px',
                }}
              >
                <Plus size={13} />
                <span>{section.type === 'faq' ? '+ Yeni Soru Ekle' : '+ Yeni Madde Ekle'}</span>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
