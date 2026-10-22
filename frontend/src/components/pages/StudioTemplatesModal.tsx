import React from 'react';
import { LayoutTemplate, X, ArrowRight } from 'lucide-react';
import type { StudioBlock } from '../../types';

export interface StudioTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (blocks: StudioBlock[], templateName: string) => void;
}

interface TemplatePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  blockCount: number;
  tags: string[];
  blocks: StudioBlock[];
}

export const STUDIO_TEMPLATES: TemplatePreset[] = [
  {
    id: 'landing',
    name: 'Kurumsal Karşılama (Landing)',
    badge: 'Popüler',
    description: 'Etkileyici karşılama başlığı, 3 sütunlu özellik kartları, plan tablosu ve eylem çağrısı.',
    blockCount: 4,
    tags: ['Hero', 'Özellikler', 'Karşılaştırma', 'CTA'],
    blocks: [
      {
        id: 'tmpl_land_hero',
        type: 'hero',
        title_tr: 'Geleceğin Dijital Çözümlerini Birlikte İnşa Edelim',
        title_en: 'Building the Future of Digital Solutions Together',
        title_ar: 'نبني معاً مستقبل الحلول الرقمية',
        subtitle_tr: 'MSK Labs, açık kaynak felsefesi ve yüksek performanslı modern web teknolojileriyle kurumsal inovasyon sunar.',
        subtitle_en: 'MSK Labs delivers enterprise innovation through open source philosophy and high-performance modern web technologies.',
        subtitle_ar: 'تقدم إم إس كيه لابس ابتكاراً مؤسسياً بفلسفة المصدر المفتوح والتقنيات الحديثة.',
        badge_text: 'MSK Labs 2026',
        badge_text_en: 'MSK Labs 2026',
        badge_text_ar: 'إم إس كيه لابس 2026',
        btn_primary_text: 'Hemen Keşfet',
        btn_primary_text_en: 'Explore Now',
        btn_primary_text_ar: 'اكتشف الآن',
        btn_primary_link: '#',
        btn_secondary_text: 'Daha Fazla Bilgi',
        btn_secondary_text_en: 'Learn More',
        btn_secondary_text_ar: 'معرفة المزيد',
        padding_y: 'lg',
        bg_variant: 'default',
        align: 'center',
      },
      {
        id: 'tmpl_land_feat',
        type: 'features_grid',
        title_tr: 'Neden MSK Labs?',
        title_en: 'Why MSK Labs?',
        title_ar: 'لماذا إم إس كيه لابس؟',
        subtitle_tr: 'Güçlü mimari, tavizsiz güvenlik ve küresel ölçeklenebilirlik.',
        subtitle_en: 'Robust architecture, uncompromising security, and global scalability.',
        subtitle_ar: 'بنية تحتية قوية وأمان صارم وقابلية توسع عالمية.',
        grid_columns: 3,
        padding_y: 'md',
        items: [
          {
            id: 'it_lf1',
            title: 'Modern Edge Mimarisi',
            title_tr: 'Modern Edge Mimarisi',
            title_en: 'Modern Edge Architecture',
            title_ar: 'بنية الحوسبة السحابية الطرفية',
            text: 'Cloudflare Workers ve D1 tabanlı sıfır gecikmeli küresel dağıtım.',
            text_tr: 'Cloudflare Workers ve D1 tabanlı sıfır gecikmeli küresel dağıtım.',
            text_en: 'Sub-millisecond global delivery based on Workers and D1.',
            text_ar: 'توزيع عالمي فائق السرعة عبر التقنيات الطرفية المتقدمة.',
          },
          {
            id: 'it_lf2',
            title: 'Doğal Çok Dilli ve RTL',
            title_tr: 'Doğal Çok Dilli ve RTL',
            title_en: 'Native Multilingual & RTL',
            title_ar: 'دعم متعدد اللغات وRTL أصيل',
            text: 'Türkçe, İngilizce ve Arapça dillerinde kusursuz tipografi ve canlı çeviri.',
            text_tr: 'Türkçe, İngilizce ve Arapça dillerinde kusursuz tipografi ve canlı çeviri.',
            text_en: 'Flawless typography and live translation for TR, EN, and AR.',
            text_ar: 'طباعة متقنة وترجمة فورية للتركية والإنجليزية والعربية.',
          },
          {
            id: 'it_lf3',
            title: 'Kurumsal Güvenlik',
            title_tr: 'Kurumsal Güvenlik',
            title_en: 'Enterprise Security',
            title_ar: 'أمان مؤسسي متكامل',
            text: 'RBAC yetkilendirme, rate-limiting ve uçtan uca denetim izi.',
            text_tr: 'RBAC yetkilendirme, rate-limiting ve uçtan uca denetim izi.',
            text_en: 'RBAC authorization, rate-limiting, and end-to-end audit trail.',
            text_ar: 'صلاحيات دقيقة وتأمين متقدم ضد الهجمات السيبرانية.',
          },
        ],
      },
      {
        id: 'tmpl_land_pricing',
        type: 'comparison_table',
        title_tr: 'Şeffaf Paket Karşılaştırması',
        title_en: 'Transparent Plan Comparison',
        title_ar: 'مقارنة الخطط الشفافة',
        subtitle_tr: 'İhtiyacınıza uygun ölçeklenebilir ve özgür seçenekler.',
        subtitle_en: 'Scalable and free options tailored to your needs.',
        subtitle_ar: 'خيارات مرنة ومناسبة لاحتياجاتك البرمجية.',
        padding_y: 'md',
        items: [
          {
            id: 'it_lp1',
            title: 'Topluluk Sürümü',
            title_tr: 'Topluluk Sürümü',
            title_en: 'Community Edition',
            title_ar: 'نسخة المجتمع',
            price: 'Ücretsiz',
            price_en: 'Free',
            price_ar: 'مجاناً',
            badge: 'Açık Kaynak',
            badge_en: 'Open Source',
            badge_ar: 'مصدر مفتوح',
            highlight: false,
            text: 'Temel CMS Özellikleri\nTopluluk Desteği\nDüzenli Güvenlik Yamaları',
            text_tr: 'Temel CMS Özellikleri\nTopluluk Desteği\nDüzenli Güvenlik Yamaları',
            text_en: 'Core CMS Features\nCommunity Support\nRegular Security Patches',
            text_ar: 'الميزات الأساسية\nدعم المجتمع\nتحديثات دورية',
          },
          {
            id: 'it_lp2',
            title: 'Profesyonel Pro',
            title_tr: 'Profesyonel Pro',
            title_en: 'Professional Pro',
            title_ar: 'النسخة الاحترافية',
            price: '$0 / Özgür',
            price_en: '$0 / Freedom',
            price_ar: '$0 / حر',
            badge: 'Önerilen',
            badge_en: 'Recommended',
            badge_ar: 'موصى به',
            highlight: true,
            text: 'Tüm Sayfa Şablonları\nGemini AI Canlı Çeviri\nÖncelikli Teknik Destek\nSınırsız Revizyon Geçmişi',
            text_tr: 'Tüm Sayfa Şablonları\nGemini AI Canlı Çeviri\nÖncelikli Teknik Destek\nSınırsız Revizyon Geçmişi',
            text_en: 'All Templates\nGemini AI Live Translation\nPriority Support\nUnlimited Revision History',
            text_ar: 'جميع القوالب\nترجمة الذكاء الاصطناعي\nدعم فني ذو أولوية\nسجل مراجعات غير محدود',
          },
        ],
      },
      {
        id: 'tmpl_land_cta',
        type: 'cta_banner',
        title_tr: 'Hemen Başlayın ve Projenizi Büyütün',
        title_en: 'Get Started Today and Scale Your Project',
        title_ar: 'ابدأ اليوم وطور مشروعك البرمجي',
        subtitle_tr: 'Ekibimizle doğrudan iletişime geçerek kurumsal entegrasyonu hızlandırın.',
        subtitle_en: 'Accelerate enterprise integration by getting in touch directly with our engineering team.',
        subtitle_ar: 'تواصل مباشرة مع فريقنا الهندسي لتسريع دمج الحلول الرقمية.',
        btn_primary_text: 'İletişime Geç',
        btn_primary_text_en: 'Contact Us',
        btn_primary_text_ar: 'اتصل بنا',
        btn_primary_link: '/contact.html',
        padding_y: 'md',
        align: 'center',
      },
    ],
  },
  {
    id: 'about',
    name: 'Hakkımızda & Vizyon',
    badge: 'Kurumsal',
    description: 'Misyon ve vizyon açıklamaları, temel kurumsal değerler ve detaylı ekosistem manifestosu.',
    blockCount: 3,
    tags: ['Hero', 'Değerler', 'İletişim'],
    blocks: [
      {
        id: 'tmpl_abt_hero',
        type: 'hero',
        title_tr: 'Biz Kimiz? MSK Labs Ekosistemi',
        title_en: 'Who We Are: MSK Labs Ecosystem',
        title_ar: 'من نحن: منظومة إم إس كيه لابس',
        subtitle_tr: 'Teknolojiye yön veren açık kaynak araçlar, modern CMS mimarisi ve bağımsız dijital çözümler üretiyoruz.',
        subtitle_en: 'We build technology-shaping open source tools, modern CMS architectures, and sovereign digital solutions.',
        subtitle_ar: 'نطور أدوات مفتوحة المصدر وبنية تحتية للمحتوى الرقمي المستقل.',
        badge_text: 'Vizyon & Değerler',
        padding_y: 'lg',
        align: 'center',
      },
      {
        id: 'tmpl_abt_values',
        type: 'features_grid',
        title_tr: 'Temel İlkelerimiz',
        title_en: 'Our Core Principles',
        title_ar: 'مبادئنا الجوهرية',
        subtitle_tr: 'Yazılım üretiminde bizi rehberlik eden ana felsefemiz.',
        subtitle_en: 'The core philosophy guiding our engineering practices.',
        subtitle_ar: 'الفلسفة الهندسية التي توجه عملنا وتطويرنا.',
        grid_columns: 3,
        padding_y: 'md',
        items: [
          {
            id: 'it_av1',
            title: 'Şeffaflık & Özgürlük',
            title_tr: 'Şeffaflık & Özgürlük',
            title_en: 'Transparency & Freedom',
            title_ar: 'الشفافية والحرية',
            text: 'Verileriniz ve kodlarınız her zaman sizin denetiminizdedir.',
            text_tr: 'Verileriniz ve kodlarınız her zaman sizin denetiminizdedir.',
            text_en: 'Your data and code remain under your sovereign control.',
            text_ar: 'بياناتك وشيفراتك البرمجية دائماً تحت سيادتك الكاملة.',
          },
          {
            id: 'it_av2',
            title: 'Yüksek Performans',
            title_tr: 'Yüksek Performans',
            title_en: 'High Performance',
            title_ar: 'أداء فائق',
            text: 'Milisaniyelik yanıt süreleri ve optimize edilmiş hafif yapay zeka entegrasyonu.',
            text_tr: 'Milisaniyelik yanıt süreleri ve optimize edilmiş hafif yapay zeka entegrasyonu.',
            text_en: 'Sub-millisecond response times and lightweight AI integration.',
            text_ar: 'استجابة فائقة السرعة وتكامل ذكي خفيف وفعال.',
          },
          {
            id: 'it_av3',
            title: 'Sürekli İnovasyon',
            title_tr: 'Sürekli İnovasyon',
            title_en: 'Continuous Innovation',
            title_ar: 'ابتكار مستمر',
            text: 'Modern web standartlarını proaktif şekilde takip edip sisteme dahil ederiz.',
            text_tr: 'Modern web standartlarını proaktif şekilde takip edip sisteme dahil ederiz.',
            text_en: 'Proactively adopting modern web standards and architectural excellence.',
            text_ar: 'متابعة حثيثة لأحدث المعايير والتقنيات الرقمية المتقدمة.',
          },
        ],
      },
      {
        id: 'tmpl_abt_contact',
        type: 'contact_card',
        title_tr: 'Bizimle Tanışın',
        title_en: 'Get in Touch With Us',
        title_ar: 'تواصل معنا وتعرف علينا',
        subtitle_tr: 'Sorularınız ve ortak projeleriniz için buradayız.',
        subtitle_en: 'We are here for your questions and collaborative projects.',
        subtitle_ar: 'نحن هنا للإجابة على استفساراتكم والتعاون المشترك.',
        padding_y: 'md',
      },
    ],
  },
  {
    id: 'contact',
    name: 'İletişim & Destek',
    badge: 'İletişim',
    description: 'Resmi iletişim kanalları, destek saatleri, sıkça sorulan sorular ve bilet oluşturma çağrısı.',
    blockCount: 4,
    tags: ['Hero', 'İletişim Kutusu', 'SSS', 'CTA'],
    blocks: [
      {
        id: 'tmpl_cnt_hero',
        type: 'hero',
        title_tr: 'Size Nasıl Yardımcı Olabiliriz?',
        title_en: 'How Can We Help You?',
        title_ar: 'كيف يمكننا مساعدتك؟',
        subtitle_tr: 'Teknik destek, iş birliği ve kurumsal sorularınız için ekibimiz hazır.',
        subtitle_en: 'Our engineering team is ready for your technical support, collaboration, and inquiries.',
        subtitle_ar: 'فريقنا الهندسي مستعد لتقديم الدعم الفني والإجابة على استفساراتكم.',
        badge_text: 'Destek Hattı',
        padding_y: 'md',
        align: 'center',
      },
      {
        id: 'tmpl_cnt_card',
        type: 'contact_card',
        title_tr: 'Doğrudan İletişim Kanalları',
        title_en: 'Direct Communication Channels',
        title_ar: 'قنوات التواصل المباشرة',
        subtitle_tr: 'Resmi e-posta ve destek merkezimiz üzerinden hızlı yanıt alın.',
        subtitle_en: 'Get rapid response through our official email and support center.',
        subtitle_ar: 'احصل على استجابة سريعة عبر قنواتنا الرسمية.',
        padding_y: 'md',
      },
      {
        id: 'tmpl_cnt_faq',
        type: 'faq_accordion',
        title_tr: 'İletişim Öncesi Sıkça Sorulanlar',
        title_en: 'Frequently Asked Before Contacting',
        title_ar: 'الأسئلة الشائعة قبل التواصل',
        subtitle_tr: 'En sık karşılaşılan soruların yanıtlarını inceleyin.',
        subtitle_en: 'Check answers to the most common inquiries.',
        subtitle_ar: 'اطلع على إجابات الاستفسارات الأكثر شيوعاً.',
        padding_y: 'md',
        items: [
          {
            id: 'it_cf1',
            title: 'Destek taleplerine ne kadar sürede yanıt verilir?',
            title_tr: 'Destek taleplerine ne kadar sürede yanıt verilir?',
            title_en: 'How fast do you respond to support tickets?',
            title_ar: 'ما هي سرعة الاستجابة لطلبات الدعم؟',
            text: 'Talepler mesai saatleri içinde ortalama 2-4 saat arasında yanıtlanmaktadır.',
            text_tr: 'Talepler mesai saatleri içinde ortalama 2-4 saat arasında yanıtlanmaktadır.',
            text_en: 'Requests are answered within 2-4 business hours on average.',
            text_ar: 'تتم الإجابة على الطلبات خلال ساعتين إلى 4 ساعات عمل بالمتوسط.',
          },
          {
            id: 'it_cf2',
            title: 'Özel yazılım ve kurumsal entegrasyon yapıyor musunuz?',
            title_tr: 'Özel yazılım ve kurumsal entegrasyon yapıyor musunuz?',
            title_en: 'Do you provide custom software and enterprise integration?',
            title_ar: 'هل تقدمون برمجيات مخصصة وتكاملاً مؤسسياً؟',
            text: 'Evet, kurumsal ihtiyaçlara özel Cloudflare Edge mimarileri ve CMS entegrasyonları sağlıyoruz.',
            text_tr: 'Evet, kurumsal ihtiyaçlara özel Cloudflare Edge mimarileri ve CMS entegrasyonları sağlıyoruz.',
            text_en: 'Yes, we provide custom Cloudflare Edge architectures and CMS solutions for enterprise needs.',
            text_ar: 'نعم، نقدم حلولاً متقدمة مخصصة وفقاً لاحتياجات المؤسسات والشركات.',
          },
        ],
      },
      {
        id: 'tmpl_cnt_cta',
        type: 'cta_banner',
        title_tr: 'Destek Bileti Gönderin',
        title_en: 'Submit a Support Ticket',
        title_ar: 'أرسل تذكرة دعم فني',
        subtitle_tr: 'Yönetim panelinden doğrudan bilet açarak durumunuzu anlık takip edin.',
        subtitle_en: 'Open a ticket directly from the portal and track resolution in real time.',
        subtitle_ar: 'افتح تذكرة دعم مباشرة وتابع حالتها في الوقت الفعلي.',
        btn_primary_text: 'Bilet Oluştur',
        btn_primary_text_en: 'Open Ticket',
        btn_primary_text_ar: 'فتح تذكرة',
        btn_primary_link: '/contact.html',
        padding_y: 'md',
      },
    ],
  },
  {
    id: 'faq',
    name: 'Sıkça Sorulan Sorular (SSS)',
    badge: 'Bilgi',
    description: 'Kapsamlı akordeon soru-cevap listesi ve ek bilgi destek kutuları.',
    blockCount: 3,
    tags: ['Hero', 'Akordeon SSS', 'İletişim'],
    blocks: [
      {
        id: 'tmpl_faq_hero',
        type: 'hero',
        title_tr: 'Sıkça Sorulan Sorular',
        title_en: 'Frequently Asked Questions',
        title_ar: 'الأسئلة الأكثر تكراراً',
        subtitle_tr: 'MSK Labs platformu, lisanslama, güvenlik ve kullanım hakkında tüm merak ettikleriniz.',
        subtitle_en: 'Everything you want to know about MSK Labs platform, licensing, and security.',
        subtitle_ar: 'كل ما تريد معرفته عن منصة إم إس كيه لابس والترخيص والأمان.',
        badge_text: 'Bilgi Merkezi',
        padding_y: 'md',
        align: 'center',
      },
      {
        id: 'tmpl_faq_list',
        type: 'faq_accordion',
        title_tr: 'Merak Edilen Konular',
        title_en: 'Common Topics',
        title_ar: 'المواضيع الشائعة',
        padding_y: 'md',
        items: [
          {
            id: 'it_q1',
            title: 'Platform hangi teknolojiler üzerine inşa edilmiştir?',
            title_tr: 'Platform hangi teknolojiler üzerine inşa edilmiştir?',
            title_en: 'What technologies is the platform built upon?',
            title_ar: 'ما هي التقنيات التي بنيت عليها المنصة؟',
            text: 'Cloudflare Workers (Edge Serverless), D1 SQL veritabanı, R2 nesne depolama ve React TypeScript.',
            text_tr: 'Cloudflare Workers (Edge Serverless), D1 SQL veritabanı, R2 nesne depolama ve React TypeScript.',
            text_en: 'Cloudflare Workers (Edge Serverless), D1 SQL database, R2 object storage, and React TypeScript.',
            text_ar: 'تقنيات كلاودفلير الطرفية بدون خادم وقاعدة بيانات D1 وتخزين R2 ورياكت تايب سكريبت.',
          },
          {
            id: 'it_q2',
            title: 'Verilerim nerede barındırılır?',
            title_tr: 'Verilerim nerede barındırılır?',
            title_en: 'Where is my data hosted?',
            title_ar: 'أين يتم استضافة بياناتي؟',
            text: 'Verileriniz küresel Cloudflare Edge ağı üzerinde şifreli ve yüksek erişilebilirlikle saklanır.',
            text_tr: 'Verileriniz küresel Cloudflare Edge ağı üzerinde şifreli ve yüksek erişilebilirlikle saklanır.',
            text_en: 'Your data is securely stored encrypted on Cloudflare global edge network with high availability.',
            text_ar: 'يتم تخزين بياناتك مشفرة وبأعلى درجات الأمان على شبكة كلاودفلير العالمية.',
          },
          {
            id: 'it_q3',
            title: 'Yapay zeka çevirileri nasıl denetlenir?',
            title_tr: 'Yapay zeka çevirileri nasıl denetlenir?',
            title_en: 'How are AI translations verified?',
            title_ar: 'كيف يتم التحقق من ترجمات الذكاء الاصطناعي؟',
            text: 'Gemini 1.5 Flash ile çok aşamalı HTML etiket korumalı ve anlam kayması kontrollü pipeline kullanılır.',
            text_tr: 'Gemini 1.5 Flash ile çok aşamalı HTML etiket korumalı ve anlam kayması kontrollü pipeline kullanılır.',
            text_en: 'A multi-step HTML preservation pipeline with context verification powered by Gemini 1.5 Flash.',
            text_ar: 'نظام فحص متعدد المراحل يحافظ على وسوم HTML وتناسق المعنى المؤسسي الدقيق.',
          },
        ],
      },
      {
        id: 'tmpl_faq_contact',
        type: 'contact_card',
        title_tr: 'Cevabınızı Bulamadınız mı?',
        title_en: 'Did not find your answer?',
        title_ar: 'ألم تجد إجابة لاستفسارك؟',
        subtitle_tr: 'Uzman ekibimiz sorularınızı yanıtlamak için her zaman hazır.',
        subtitle_en: 'Our specialist team is always ready to answer your questions.',
        subtitle_ar: 'فريقنا المتخصص مستعد دائماً للإجابة على جميع تساؤلاتك.',
        padding_y: 'md',
      },
    ],
  },
];

export const StudioTemplatesModal: React.FC<StudioTemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  if (!isOpen) return null;

  const handleSelect = (tmpl: TemplatePreset) => {
    if (confirm(`"${tmpl.name}" şablonu tuval üzerine yüklensin mi?\nMevcut bloklar değiştirilecektir (Geri alabilirsiniz).`)) {
      onApplyTemplate(tmpl.blocks, tmpl.name);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        style={{
          width: '840px',
          maxWidth: '96vw',
          maxHeight: '90vh',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Başlık */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <LayoutTemplate size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Hazır Sayfa Şablonları (Presets)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Kurumsal sayfalarınız için önceden tasarlanmış, çok dilli ve optimize edilmiş blok setleri.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-btn-icon" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Şablon Kartları Izgarası */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {STUDIO_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'all 0.15s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="admin-badge admin-badge-cyan" style={{ fontSize: '10px' }}>
                    {tmpl.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {tmpl.blockCount} Blok Seti
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  {tmpl.name}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                  {tmpl.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {tmpl.tags.map((tg, idx) => (
                    <span key={idx} style={{ fontSize: '10px', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelect(tmpl)}
                className="admin-btn admin-btn-primary admin-btn-sm"
                style={{ width: '100%', padding: '8px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <span>Şablonu Tuvale Uygula</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
