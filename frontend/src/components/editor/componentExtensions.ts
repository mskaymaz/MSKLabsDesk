import { Node, mergeAttributes } from '@tiptap/core';

// 1. Vurgu / Callout Kutusu (Bilgi, İpucu, Uyarı)
export const CalloutBlock = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: (el) => el.getAttribute('data-callout-type') || 'info',
        renderHTML: (attrs) => ({
          'data-callout-type': attrs.type,
          class: `content-callout callout-${attrs.type}`,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-callout-type]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },
});

// 2. Akordeon Başlığı (Details Summary)
export const DetailsSummary = Node.create({
  name: 'detailsSummary',
  content: 'text*',
  defining: true,

  parseHTML() {
    return [{ tag: 'summary' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['summary', mergeAttributes({ class: 'faq-summary' }, HTMLAttributes), 0];
  },
});

// 3. Akordeon / SSS Bloğu (HTML5 <details>)
export const DetailsBlock = Node.create({
  name: 'details',
  group: 'block',
  content: 'detailsSummary block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'details' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['details', mergeAttributes({ class: 'faq-details' }, HTMLAttributes), 0];
  },
});

// 4. Kart Sütunu (Grid Column / Card)
export const GridColumn = Node.create({
  name: 'gridColumn',
  content: 'block+',
  defining: true,

  parseHTML() {
    return [{ tag: 'div[data-type="grid-col"]' }, { tag: 'div.editor-card' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes({ class: 'editor-card', 'data-type': 'grid-col' }, HTMLAttributes), 0];
  },
});

// 5. Çoklu Kart Izgarası (Grid Block - 2'li veya 3'lü)
export const GridBlock = Node.create({
  name: 'gridBlock',
  group: 'block',
  content: 'gridColumn+',
  defining: true,

  addAttributes() {
    return {
      cols: {
        default: 2,
        parseHTML: (el) => parseInt(el.getAttribute('data-cols') || '2', 10),
        renderHTML: (attrs) => ({
          'data-cols': attrs.cols,
          class: `editor-grid editor-grid-${attrs.cols}`,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-cols]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0];
  },
});
