import Image from '@tiptap/extension-image';
import { Extension } from '@tiptap/core';
import '@tiptap/extension-text-style';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
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

// 2. Metin Saran ve Satır Açan Özel Resim Eklentisi (Word-style Image Wrap)
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
      // Metni Saran - Sola Yaslı
      style = 'float: left; margin: 0 16px 12px 0; max-width: 48%; border-radius: 6px;';
    } else if (layout === 'right') {
      // Metni Saran - Sağa Yaslı
      style = 'float: right; margin: 0 0 12px 16px; max-width: 48%; border-radius: 6px;';
    } else if (layout === 'full') {
      // Tam Genişlik
      style = 'display: block; width: 100%; margin: 16px auto; border-radius: 6px; clear: both;';
    } else {
      // Satır Açan Ortalı Blok
      style = 'display: block; margin: 16px auto; max-width: 100%; border-radius: 6px; clear: both;';
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
