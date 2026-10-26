import Image from '@tiptap/extension-image';
import { Table, TableView, updateColumns } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
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
      setParagraphSpacing: (bottomSpacing: string, topSpacing?: string) => ReturnType;
      setParagraphMarginTop: (topSpacing: string) => ReturnType;
      setParagraphMarginBottom: (bottomSpacing: string) => ReturnType;
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
        layout?: 'left' | 'right' | 'left-block' | 'right-block' | 'center' | 'full';
        width?: string;
      }) => ReturnType;
      updateImageAttributes: (attrs: {
        layout?: 'left' | 'right' | 'left-block' | 'right-block' | 'center' | 'full';
        width?: string;
        alt?: string;
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
          marginTop: {
            default: null,
            parseHTML: (element) => element.style.marginTop || null,
            renderHTML: (attributes) => {
              if (!attributes.marginTop) return {};
              return {
                style: `margin-top: ${attributes.marginTop}`,
              };
            },
          },
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
        (bottomSpacing: string, topSpacing?: string) =>
        ({ commands }) => {
          const attrs: Record<string, string> = { marginBottom: bottomSpacing };
          if (topSpacing !== undefined) attrs.marginTop = topSpacing;
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, attrs)
          );
        },
      setParagraphMarginTop:
        (topSpacing: string) =>
        ({ commands }) => {
          return this.options.types.every((type: string) =>
            commands.updateAttributes(type, { marginTop: topSpacing })
          );
        },
      setParagraphMarginBottom:
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
  addOptions() {
    return {
      ...(this.parent?.() || {}),
      inline: false,
      allowBase64: true,
      HTMLAttributes: {},
      resize: false,
    } as any;
  },
  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },
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
        parseHTML: (element) => element.style.width || element.getAttribute('width') || 'auto',
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
      style = 'float: left; margin: 6px 18px 14px 0; border-radius: 6px;';
    } else if (layout === 'right') {
      style = 'float: right; margin: 6px 0 14px 18px; border-radius: 6px;';
    } else if (layout === 'left-block') {
      style = 'display: block; margin: 14px auto 14px 0; clear: both; border-radius: 6px;';
    } else if (layout === 'right-block') {
      style = 'display: block; margin: 14px 0 14px auto; clear: both; border-radius: 6px;';
    } else if (layout === 'full') {
      style = 'display: block; width: 100%; margin: 18px auto; border-radius: 6px; clear: both;';
    } else {
      style = 'display: block; margin: 18px auto; border-radius: 6px; clear: both;';
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
      updateImageAttributes:
        (attrs) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, attrs);
        },
    };
  },
});

// 6. Stil ve Kenarlık Destekli Özel Hücre Eklentileri (Custom Table Cells with Border/Color)
export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style') || null,
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style') || null,
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});

export class CustomTableView extends TableView {
  constructor(node: any, cellMinWidth: number, view: any, HTMLAttributes: Record<string, any> = {}) {
    super(node, cellMinWidth, view, HTMLAttributes);
    if (node.attrs.style) {
      this.table.style.cssText = node.attrs.style;
    }
  }

  update(node: any) {
    if (node.type !== this.node.type) return false;
    this.node = node;
    updateColumns(node, this.colgroup, this.table, this.cellMinWidth);
    if (node.attrs.style) {
      this.table.style.cssText = node.attrs.style;
    } else {
      this.table.removeAttribute('style');
    }
    return true;
  }
}

export const CustomTable = Table.extend({
  addOptions() {
    const parentOpts = this.parent?.() || {
      HTMLAttributes: {},
      resizable: false,
      renderWrapper: false,
      handleWidth: 5,
      cellMinWidth: 25,
      View: TableView,
      lastColumnResizable: true,
      allowTableNodeSelection: false,
    };
    return {
      ...parentOpts,
      HTMLAttributes: parentOpts.HTMLAttributes || {},
      View: CustomTableView,
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute('style') || null,
        renderHTML: (attributes: Record<string, any>) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
    };
  },
});
