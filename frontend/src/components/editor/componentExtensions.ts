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

  addNodeView() {
    return ({ getPos, editor }) => {
      const dom = document.createElement('summary');
      dom.className = 'faq-summary';

      const contentDOM = document.createElement('span');
      contentDOM.className = 'faq-summary-text';
      contentDOM.style.flex = '1';
      contentDOM.style.outline = 'none';

      const toggleBtn = document.createElement('span');
      toggleBtn.className = 'faq-toggle-icon';
      toggleBtn.contentEditable = 'false';
      toggleBtn.title = 'Aç / Kapat';
      toggleBtn.innerHTML = '▾';

      const getParentDetailsInfo = () => {
        if (typeof getPos !== 'function') return null;
        const pos = getPos();
        if (typeof pos !== 'number') return null;
        const $pos = editor.state.doc.resolve(pos);
        const parentPos = $pos.before($pos.depth);
        const detailsNode = editor.state.doc.nodeAt(parentPos);
        if (detailsNode && detailsNode.type.name === 'details') {
          return { parentPos, detailsNode };
        }
        return null;
      };

      const toggleOpen = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const info = getParentDetailsInfo();
        if (info) {
          const nextOpen = !info.detailsNode.attrs.open;
          editor.view.dispatch(
            editor.state.tr.setNodeMarkup(info.parentPos, undefined, {
              ...info.detailsNode.attrs,
              open: nextOpen,
            })
          );
          toggleBtn.innerHTML = nextOpen ? '▾' : '▸';
        }
      };

      toggleBtn.addEventListener('click', toggleOpen);

      dom.addEventListener('click', (e) => {
        if (e.target === toggleBtn || toggleBtn.contains(e.target as globalThis.Node)) return;
        const info = getParentDetailsInfo();
        if (info && !info.detailsNode.attrs.open) {
          toggleOpen(e);
        }
      });

      setTimeout(() => {
        const info = getParentDetailsInfo();
        if (info) {
          toggleBtn.innerHTML = info.detailsNode.attrs.open ? '▾' : '▸';
        }
      }, 0);

      dom.appendChild(contentDOM);
      dom.appendChild(toggleBtn);

      return {
        dom,
        contentDOM,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'detailsSummary') return false;
          const info = getParentDetailsInfo();
          if (info) {
            toggleBtn.innerHTML = info.detailsNode.attrs.open ? '▾' : '▸';
          }
          return true;
        },
      };
    };
  },
});

// 3. Akordeon Bloğu (HTML5 <details>)
export const DetailsBlock = Node.create({
  name: 'details',
  group: 'block',
  content: 'detailsSummary block+',
  defining: true,

  addAttributes() {
    return {
      open: {
        default: true,
        parseHTML: (el) => (el.hasAttribute('open') ? el.getAttribute('open') !== 'false' : true),
        renderHTML: (attrs) => (attrs.open ? { open: 'true' } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'details' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['details', mergeAttributes({ class: 'faq-details' }, HTMLAttributes), 0];
  },

  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement('details');
      dom.className = 'faq-details';
      if (node.attrs.open) {
        dom.setAttribute('open', 'true');
      }

      return {
        dom,
        contentDOM: dom,
        update: (updatedNode) => {
          if (updatedNode.type.name !== 'details') return false;
          if (updatedNode.attrs.open) {
            dom.setAttribute('open', 'true');
          } else {
            dom.removeAttribute('open');
          }
          return true;
        },
      };
    };
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
