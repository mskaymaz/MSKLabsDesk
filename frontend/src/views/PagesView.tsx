import React, { useState, useEffect } from 'react';
import { Plus, Search, Lock, Edit3, Trash2, Layers } from 'lucide-react';
import type { SitePage, PageFormData } from '../types';
import { api } from '../services/api';
import { slugifyTurkish } from '../utils/slugify';
import { PageStudioView } from './PageStudioView';

export const PagesView: React.FC = () => {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<SitePage | null>(null);
  const [aiTranslating, setAiTranslating] = useState(false);

  const [formData, setFormData] = useState<PageFormData>({
    slug: '',
    title_tr: '',
    title_en: '',
    title_ar: '',
    summary_tr: '',
    summary_en: '',
    summary_ar: '',
    content_tr: '',
    content_en: '',
    content_ar: '',
    hero_image: '',
    meta_keywords: '',
    status: 'published',
    display_order: 0,
  });

  const loadPages = async () => {
    setLoading(true);
    try {
      const res = await api.getPages();
      setPages(res.pages || []);
    } catch (err) {
      console.error('Kurumsal sayfalar yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const openNewPageStudio = () => {
    setEditingPage(null);
    setFormData({
      slug: '',
      title_tr: '',
      title_en: '',
      title_ar: '',
      summary_tr: '',
      summary_en: '',
      summary_ar: '',
      content_tr: '',
      content_en: '',
      content_ar: '',
      hero_image: '',
      meta_keywords: '',
      status: 'published',
      display_order: pages.length + 1,
    });
    setIsStudioOpen(true);
  };

  const openEditPageStudio = (page: SitePage) => {
    setEditingPage(page);
    let meta: any = {};
    try {
      if (page.meta_json) meta = JSON.parse(page.meta_json);
    } catch {}

    setFormData({
      slug: page.slug,
      title_tr: page.title_tr || '',
      title_en: page.title_en || '',
      title_ar: page.title_ar || '',
      summary_tr: page.summary_tr || '',
      summary_en: page.summary_en || '',
      summary_ar: page.summary_ar || '',
      content_tr: page.content_tr || '',
      content_en: page.content_en || '',
      content_ar: page.content_ar || '',
      hero_image: page.hero_image || '',
      meta_keywords: meta.seo_keywords || '',
      status: page.status || 'published',
      display_order: page.display_order || 0,
    });
    setIsStudioOpen(true);
  };

  const handleAiTranslate = async () => {
    if (!formData.title_tr || !formData.content_tr) {
      alert('AI çeviri yapabilmek için önce Türkçe başlık ve içerik doldurulmalıdır.');
      return;
    }

    setAiTranslating(true);
    try {
      const res = await api.translatePage({
        title_tr: formData.title_tr,
        content_tr: formData.content_tr,
        summary_tr: formData.summary_tr,
      });

      if (res.success && res.translation) {
        const tr = res.translation;
        setFormData((prev) => ({
          ...prev,
          title_en: tr.title_en || prev.title_en,
          title_ar: tr.title_ar || prev.title_ar,
          summary_tr: tr.summary_tr || prev.summary_tr,
          summary_en: tr.summary_en || prev.summary_en,
          summary_ar: tr.summary_ar || prev.summary_ar,
          content_en: tr.content_en || prev.content_en,
          content_ar: tr.content_ar || prev.content_ar,
          meta_keywords: tr.meta_keywords || prev.meta_keywords,
        }));
        alert('İçerikler Gemini AI ile İngilizce ve Arapça dillerine başarıyla çevrildi.');
      }
    } catch (err: any) {
      alert(err.message || 'AI çeviri sırasında bir hata oluştu.');
    } finally {
      setAiTranslating(false);
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_tr || !formData.content_tr) {
      alert('Lütfen en azından Türkçe başlık ve içerik alanlarını doldurunuz.');
      return;
    }

    let finalSlug = formData.slug ? formData.slug.trim().toLowerCase() : '';
    if (!finalSlug && formData.title_tr) {
      finalSlug = slugifyTurkish(formData.title_tr);
    }
    if (!editingPage && !finalSlug) {
      finalSlug = `sayfa-${Date.now()}`;
    }

    try {
      let finalMeta: Record<string, any> = {};
      try { if (formData.meta_json) finalMeta = JSON.parse(formData.meta_json); } catch {}
      finalMeta.seo_keywords = formData.meta_keywords || finalMeta.seo_keywords;
      const payload = { ...formData, slug: finalSlug, meta_json: JSON.stringify(finalMeta) };

      if (editingPage) {
        await api.updatePage(editingPage.id, payload);
      } else {
        await api.createPage(payload);
      }

      setIsStudioOpen(false);
      await loadPages();
    } catch (err: any) {
      alert(err.message || 'Sayfa kaydedilirken hata oluştu.');
    }
  };

  const handleToggleStatus = async (page: SitePage) => {
    const nextStatus = page.status === 'published' ? 'draft' : 'published';
    try {
      await api.updatePageStatus(page.id, nextStatus);
      await loadPages();
    } catch (err: any) {
      alert(err.message || 'Durum güncellenemedi.');
    }
  };

  const handleDeletePage = async (page: SitePage) => {
    if (page.is_system) {
      alert(`"${page.title_tr}" sistem sayfasıdır ve silinemez. Dilerseniz durumunu "Taslak" yapabilirsiniz.`);
      return;
    }

    if (!window.confirm(`"${page.title_tr}" kurumsal sayfasını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await api.deletePage(page.id);
      await loadPages();
    } catch (err: any) {
      alert(err.message || 'Sayfa silinemedi.');
    }
  };

  // Filtreleme
  const filteredPages = pages.filter((p) => {
    const matchesSearch =
      p.title_tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPublished = pages.filter((p) => p.status === 'published').length;
  const totalDraft = pages.filter((p) => p.status === 'draft').length;

  return (
    <div className="view-container animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Üst Başlık ve Aksiyon Alanı */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers className="text-cyan" size={24} />
            <span>Kurumsal Sayfalar (CMS)</span>
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
            Ana Sayfa, Hakkımızda, SSS, İletişim ve tüm kurumsal sayfaları 3 dilli düzenleyin ve yayına alın.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewPageStudio}
          className="admin-btn admin-btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} />
          <span>Yeni Kurumsal Sayfa Ekle</span>
        </button>
      </div>

      {/* İstatistik Rozetleri & Arama Çubuğu */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sayfa adı veya slug ara..."
              className="admin-input"
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`admin-btn admin-btn-sm ${statusFilter === 'all' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            >
              Tümü ({pages.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('published')}
              className={`admin-btn admin-btn-sm ${statusFilter === 'published' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            >
              Yayında ({totalPublished})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('draft')}
              className={`admin-btn admin-btn-sm ${statusFilter === 'draft' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            >
              Taslak ({totalDraft})
            </button>
          </div>
        </div>

        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Toplam <strong>{filteredPages.length}</strong> sayfa listeleniyor
        </span>
      </div>

      {/* Sayfa Listesi Tablosu */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Kurumsal sayfalar yükleniyor...
          </div>
        ) : filteredPages.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Arama kriterlerine uygun sayfa bulunamadı.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '12px 16px' }}>Sayfa / Başlık</th>
                <th style={{ padding: '12px 16px' }}>Tip</th>
                <th style={{ padding: '12px 16px' }}>Diller</th>
                <th style={{ padding: '12px 16px' }}>Durum</th>
                <th style={{ padding: '12px 16px' }}>Son Güncelleme</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Eylemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page) => {
                const hasEn = Boolean(page.title_en && page.content_en);
                const hasAr = Boolean(page.title_ar && page.content_ar);

                return (
                  <tr
                    key={page.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {/* Başlık & Slug */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '14px' }}>
                          {page.title_tr}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                          /{page.slug}
                        </span>
                      </div>
                    </td>

                    {/* Tip */}
                    <td style={{ padding: '14px 16px' }}>
                      {page.is_system ? (
                        <span
                          className="admin-badge admin-badge-purple"
                          style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Lock size={10} />
                          Sistem
                        </span>
                      ) : (
                        <span className="admin-badge admin-badge-cyan" style={{ fontSize: '10px' }}>
                          Özel
                        </span>
                      )}
                    </td>

                    {/* Dil Doluluk Rozetleri (Kesinlikle Yalın TR, EN, AR - Bayrak Emojisi Yasak) */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span className="admin-badge admin-badge-emerald" style={{ fontSize: '10px', fontWeight: 800 }}>
                          TR
                        </span>
                        <span
                          className={`admin-badge ${hasEn ? 'admin-badge-emerald' : 'admin-badge-gray'}`}
                          style={{ fontSize: '10px', fontWeight: 800, opacity: hasEn ? 1 : 0.4 }}
                        >
                          EN
                        </span>
                        <span
                          className={`admin-badge ${hasAr ? 'admin-badge-emerald' : 'admin-badge-gray'}`}
                          style={{ fontSize: '10px', fontWeight: 800, opacity: hasAr ? 1 : 0.4 }}
                        >
                          AR
                        </span>
                      </div>
                    </td>

                    {/* Durum */}
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(page)}
                        className={`admin-badge ${page.status === 'published' ? 'admin-badge-emerald' : 'admin-badge-amber'}`}
                        style={{ cursor: 'pointer', border: 'none' }}
                        title="Durumu Değiştirmek İçin Tıklayın"
                      >
                        {page.status === 'published' ? 'Yayında' : 'Taslak'}
                      </button>
                    </td>

                    {/* Son Güncelleme */}
                    <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      {page.updated_at ? new Date(page.updated_at).toLocaleDateString('tr-TR') : '—'}
                    </td>

                    {/* Eylemler */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => openEditPageStudio(page)}
                          className="admin-btn admin-btn-secondary admin-btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          title="Sayfayı Düzenle"
                        >
                          <Edit3 size={13} />
                          <span>Düzenle</span>
                        </button>

                        {!page.is_system && (
                          <button
                            type="button"
                            onClick={() => handleDeletePage(page)}
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            title="Sayfayı Sil"
                            style={{ padding: '6px 8px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Gelişmiş Kurumsal Sayfa Stüdyosu */}
      <PageStudioView
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        editingPage={editingPage}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSavePage}
        onAiTranslate={handleAiTranslate}
        aiTranslating={aiTranslating}
        allPages={pages}
        onSelectPage={openEditPageStudio}
      />
    </div>
  );
};
