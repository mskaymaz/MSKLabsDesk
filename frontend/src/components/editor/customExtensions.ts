import Image from '@tiptap/extension-image';
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
    lineHeight: {
      setLineHeight: (height: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
    paragraphSpacing: {
      setParagraphSpacing: (bottomSpacing: string) => ReturnType;
      setIndent: (delta: number) => ReturnType;
    };
    duplicateSelection: {
      duplicateNode: () => ReturnType;
    };
    customImage: {
      setImageWithLayout: (options: {
        src: string;
        alt?: string;
        title?: string;
        layout?: 'left' | 'right' | 'center' | 'full';
        width?: string;
      }) => ReturnType;
    };
  }
}

// 1. Yazı Boyutu (Font Size) Eklentisi
export const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace(/['"]+/g, ''),
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run();
        },
    };
  },
});

// 2. Satır Yüksekliği / Satır Aralığı (Line Height) Eklentisi
export const LineHeight = Extension.create({
  name: 'lineHeight',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) return {};
              return {
                style: `line-height: ${attributes.lineHeight}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight:
        (height: string) =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, { lineHeight: height })
          );
        },
      unsetLineHeight:
        () =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.resetAttributes(type, 'lineHeight')
          );
        },
    };
  },
});

// 3. Paragraf Boşlukları ve Girinti (Paragraph Spacing & Indent) Eklentisi
export const ParagraphSpacing = Extension.create({
  name: 'paragraphSpacing',
  addOptions() {
    return {
      types: ['paragraph', 'heading'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          marginBottom: {
            default: null,
            parseHTML: (element) => element.style.marginBottom || null,
            renderHTML: (attributes) => {
              if (!attributes.marginBottom) return {};
              return {
                style: `margin-bottom: ${attributes.marginBottom}`,
              };
            },
          },
          paddingLeft: {
            default: null,
            parseHTML: (element) => element.style.paddingLeft || null,
            renderHTML: (attributes) => {
              if (!attributes.paddingLeft) return {};
              return {
                style: `padding-left: ${attributes.paddingLeft}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setParagraphSpacing:
        (bottomSpacing: string) =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, { marginBottom: bottomSpacing })
          );
        },
      setIndent:
        (delta: number) =>
        ({ state, commands }) => {
          const { selection } = state;
          const node = selection.$from.parent;
          const currentPadding = parseInt(node.attrs.paddingLeft || '0', 10);
          const newPadding = Math.max(0, currentPadding + delta * 24);
          const paddingVal = newPadding > 0 ? `${newPadding}px` : null;

          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, { paddingLeft: paddingVal })
          );
        },
    };
  },
});

// 4. Seçimi / Bloğu Çoğaltma (Duplicate Selection) Eklentisi
export const DuplicateSelection = Extension.create({
  name: 'duplicateSelection',
  addCommands() {
    return {
      duplicateNode:
        () =>
        ({ state, dispatch }) => {
          const { selection, tr } = state;
          const node = selection.$from.parent;
          if (!node) return false;

          const end = selection.$to.end();
          const nodeCopy = node.copy(node.content);
          if (dispatch) {
            tr.insert(end + 1, nodeCopy);
            dispatch(tr);
          }
          return true;
        },
    };
  },
});

// 5. Metin Saran ve Satır Açan Özel Resim Eklentisi (Word-style Image Wrap)
export const CustomImage = Image.extend({
  name: 'customImage',
  addAttributes() {
    return {
      ...this.parent?.(),
      layout: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-layout') || 'center',
        renderHTML: (attributes) => {
          return { 'data-layout': attributes.layout };
        },
      },
      width: {
        default: 'auto',
        parseHTML: (element) => element.style.width || 'auto',
        renderHTML: (attributes) => {
          return { style: `width: ${attributes.width}` };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const layout = HTMLAttributes['data-layout'] || 'center';
    let style = '';

    if (layout === 'left') {
      style = 'float: left; margin: 4px 18px 14px 0; max-width: 48%; border-radius: 6px;';
    } else if (layout === 'right') {
      style = 'float: right; margin: 4px 0 14px 18px; max-width: 48%; border-radius: 6px;';
    } else if (layout === 'full') {
      style = 'display: block; width: 100%; margin: 18px auto; border-radius: 6px; clear: both;';
    } else {
      style = 'display: block; margin: 18px auto; max-width: 100%; border-radius: 6px; clear: both;';
    }

    const existingStyle = HTMLAttributes.style || '';
    return ['img', { ...HTMLAttributes, style: `${style} ${existingStyle}`.trim() }];
  },
  addCommands() {
    return {
      setImageWithLayout:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
