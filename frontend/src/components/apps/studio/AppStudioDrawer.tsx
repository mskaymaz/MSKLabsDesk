import React from 'react';
import type { AppItem, AppStoreLinks } from '../../../types';
import type { StudioSectionType } from './types';
import { AppStudioFeaturesDrawer } from './AppStudioFeaturesDrawer';

interface AppStudioDrawerProps {
  selectedSection: StudioSectionType | null;
  app: AppItem;
  onChangeApp: (app: AppItem) => void;
  onClose: () => void;
}

export const AppStudioDrawer: React.FC<AppStudioDrawerProps> = ({
  selectedSection,
  app,
  onChangeApp,
  onClose,
}) => {
  if (!selectedSection) return null;

  // Başlıklar
  const sectionTitles: Record<StudioSectionType, { title: string; desc: string }> = {
    header: {
      title: 'Başlık, İkon ve Meta Bilgileri',
      desc: 'Uygulama adı, logo simgesi, kategori ve platform rozetlerini düzenleyin.',
    },
    description: {
      title: 'Uygulama Tanıtım ve Açıklama Metni',
      desc: 'Kullanıcılara sunulacak detaylı metinleri TR, EN ve AR dillerinde girin.',
    },
    features: {
      title: 'Öne Çıkan Özellikler ve Kartlar',
      desc: 'Vitrin sayfasındaki 3xN özellik kartlarını yönetin.',
    },
    store_links: {
      title: 'İndirme ve Mağaza Kanalları',
      desc: 'Google Play, GitHub APK, Drive, App Store ve Web bağlantılarını yapılandırın.',
    },
    guide: {
      title: 'Kullanım Kılavuzu (PDF) Bağlantısı',
      desc: 'Uygulama rehber belgesinin doğrudan indirme bağlantısını belirleyin.',
    },
    versions: {
      title: 'Sürüm ve Paket Yönetimi',
      desc: 'Uygulamanın yayınlanmış sürümleri ve doğrudan indirme paketleri.',
    },
  };

  const currentMeta = sectionTitles[selectedSection];

  const updateStoreLink = (key: keyof AppStoreLinks, val: string) => {
    const updatedLinks = {
      ...(app.store_links || {}),
      [key]: val,
    };
    onChangeApp({
      ...app,
      store_links: updatedLinks,
      guide_url: key === 'guide_url' ? val : app.guide_url,
    });
  };

  return (
    <div className="w-full lg:w-[460px] border-l border-slate-800 bg-slate-900/95 backdrop-blur-md flex flex-col h-full z-20 shadow-2xl">
      {/* Çekmece Üst Başlık */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div>
          <h2 className="text-sm font-bold text-slate-100">{currentMeta.title}</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">{currentMeta.desc}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Paneli Kapat"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Çekmece Gövdesi (Kaydırılabilir) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 1. HEADER SECTION */}
        {selectedSection === 'header' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                İkon URL (Web veya Yerel Varlık)
              </label>
              <input
                type="text"
                value={app.icon_url || ''}
                onChange={(e) => onChangeApp({ ...app, icon_url: e.target.value })}
                placeholder="assets/img/apps/haydinamaza.png veya https://..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* TR / EN / AR İsimler */}
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
              <span className="text-xs font-bold text-slate-300">Uygulama İsimleri</span>
              <div>
                <label className="block text-[11px] text-emerald-400 font-semibold mb-1">TR (Türkçe)</label>
                <input
                  type="text"
                  value={app.name_tr || app.name || ''}
                  onChange={(e) => onChangeApp({ ...app, name_tr: e.target.value, name: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-sky-400 font-semibold mb-1">EN (English)</label>
                <input
                  type="text"
                  value={app.name_en || ''}
                  onChange={(e) => onChangeApp({ ...app, name_en: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div dir="rtl">
                <label className="block text-[11px] text-emerald-400 font-semibold mb-1">AR (العربية)</label>
                <input
                  type="text"
                  value={app.name_ar || ''}
                  onChange={(e) => onChangeApp({ ...app, name_ar: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Kategori, Platform, Durum */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kategori</label>
                <select
                  value={app.category || 'Mobil'}
                  onChange={(e) => onChangeApp({ ...app, category: e.target.value })}
                  className="w-full px-2.5 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Mobil">Mobil</option>
                  <option value="Masaüstü">Masaüstü</option>
                  <option value="Web">Web</option>
                  <option value="Kütüphane">Kütüphane</option>
                  <option value="Araçlar">Araçlar</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Platform</label>
                <select
                  value={app.platform || 'Android'}
                  onChange={(e) => onChangeApp({ ...app, platform: e.target.value })}
                  className="w-full px-2.5 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                  <option value="Android & iOS">Android & iOS</option>
                  <option value="Windows">Windows</option>
                  <option value="Web">Web</option>
                  <option value="Cross-Platform">Çapraz Platform</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Yayın Durumu</label>
                <select
                  value={app.status || 'active'}
                  onChange={(e) => onChangeApp({ ...app, status: e.target.value as any })}
                  className="w-full px-2.5 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="active">Yayında (Aktif)</option>
                  <option value="in_development">Geliştiriliyor</option>
                  <option value="planned">Planlanıyor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Sıralama (Order)</label>
                <input
                  type="number"
                  value={app.sort_order ?? 0}
                  onChange={(e) => onChangeApp({ ...app, sort_order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-2.5 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. DESCRIPTION SECTION */}
        {selectedSection === 'description' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                TR (Türkçe) Açıklama Metni
              </label>
              <textarea
                rows={5}
                value={app.description_tr || app.description || ''}
                onChange={(e) => onChangeApp({ ...app, description_tr: e.target.value, description: e.target.value })}
                placeholder="Uygulamanın detaylı tanıtımını girin..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-sky-400 mb-1">
                EN (English) Description Text
              </label>
              <textarea
                rows={5}
                value={app.description_en || ''}
                onChange={(e) => onChangeApp({ ...app, description_en: e.target.value })}
                placeholder="Enter app description in English..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div dir="rtl">
              <label className="block text-xs font-bold text-emerald-400 mb-1">
                AR (العربية) نص الوصف
              </label>
              <textarea
                rows={5}
                value={app.description_ar || ''}
                onChange={(e) => onChangeApp({ ...app, description_ar: e.target.value })}
                placeholder="أدخل وصف التطبيق باللغة العربية..."
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* 3. FEATURES SECTION */}
        {selectedSection === 'features' && (
          <AppStudioFeaturesDrawer
            featureCards={app.feature_cards || []}
            onChangeFeatureCards={(cards) => onChangeApp({ ...app, feature_cards: cards })}
          />
        )}

        {/* 4. STORE LINKS SECTION */}
        {selectedSection === 'store_links' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <span>▶️</span> Google Play Mağaza URL
              </label>
              <input
                type="url"
                value={app.store_links?.google_play || ''}
                onChange={(e) => updateStoreLink('google_play', e.target.value)}
                placeholder="https://play.google.com/store/apps/details?id=..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <span>🐙</span> GitHub Doğrudan APK URL
              </label>
              <input
                type="url"
                value={app.store_links?.github || ''}
                onChange={(e) => updateStoreLink('github', e.target.value)}
                placeholder="https://github.com/.../app.apk"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <span>📁</span> Google Drive Alternatif APK URL
              </label>
              <input
                type="url"
                value={app.store_links?.google_drive || ''}
                onChange={(e) => updateStoreLink('google_drive', e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <span>🍏</span> Apple App Store URL (Varsa)
              </label>
              <input
                type="url"
                value={app.store_links?.app_store || ''}
                onChange={(e) => updateStoreLink('app_store', e.target.value)}
                placeholder="Boş bırakılırsa standart prosedür notu gösterilir"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <span>🌐</span> Web / PWA Çalıştırma URL
              </label>
              <input
                type="url"
                value={app.store_links?.web_url || ''}
                onChange={(e) => updateStoreLink('web_url', e.target.value)}
                placeholder="https://..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <span>🪟</span> Windows Store URL
              </label>
              <input
                type="url"
                value={app.store_links?.windows_store || ''}
                onChange={(e) => updateStoreLink('windows_store', e.target.value)}
                placeholder="ms-windows-store://..."
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* 5. GUIDE SECTION */}
        {selectedSection === 'guide' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kullanım Kılavuzu PDF İndirme Bağlantısı
              </label>
              <input
                type="url"
                value={app.guide_url || app.store_links?.guide_url || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChangeApp({
                    ...app,
                    guide_url: val,
                    store_links: {
                      ...(app.store_links || {}),
                      guide_url: val,
                    },
                  });
                }}
                placeholder="https://msklabs.org/docs/haydinamaza-rehber.pdf"
                className="w-full px-3 py-2 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Bu alana geçerli bir PDF linki girildiğinde, vitrin sayfasındaki "Kullanım Kılavuzu İndir" butonu aktif hale gelir. Boş bırakıldığında kullanıcıya hazırlık aşamasında olduğu bildirilir.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
