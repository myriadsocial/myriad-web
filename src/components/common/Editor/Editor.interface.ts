import {
  AutoformatRule,
  Decorate,
  DecorateEntry,
  DOMHandler,
  EDescendant,
  EElement,
  EElementEntry,
  EElementOrText,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_HR,
  ELEMENT_IMAGE,
  ELEMENT_LI,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,
  ELEMENT_UL,
  EMarks,
  ENode,
  ENodeEntry,
  EText,
  ETextEntry,
  InjectComponent,
  InjectProps,
  KeyboardHandler,
  OnChange,
  OverrideByKey,
  PlateEditor,
  PlatePlugin,
  PlatePluginInsertData,
  PlatePluginProps,
  PlateProps,
  PluginOptions,
  SerializeHtml,
  TElement,
  TImageElement,
  TLinkElement,
  TMediaEmbedElement,
  TMentionElement,
  TNodeEntry,
  TReactEditor,
  TText,
  TTodoListItemElement,
  WithOverride,
  TComboboxItem,
} from '@udecode/plate';

import {ELEMENT_EMOJI, TEmojiElement} from './plugins/EmojiPicker';
import {ELEMENT_HASHTAG, THashtagElement} from './plugins/Hashtag';
import {TImageListElement, ELEMENT_IMAGE_LIST} from './plugins/ImageList';
import {ELEMENT_SHOW_MORE} from './plugins/ShowMore';

import {CSSProperties} from 'styled-components';

/**
 * Text
 */

export type EmptyText = {
  text: '';
};

export type PlainText = {
  text: string;
};

export interface RichText extends TText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  kbd?: boolean;
  subscript?: boolean;
  backgroundColor?: CSSProperties['backgroundColor'];
  fontFamily?: CSSProperties['fontFamily'];
  color?: CSSProperties['color'];
  fontSize?: CSSProperties['fontSize'];
  fontWeight?: CSSProperties['fontWeight'];
}

/**
 * Inline Elements
 */

export interface LinkElement extends TLinkElement {
  type: typeof ELEMENT_LINK;
  children: RichText[];
}

export interface MentionElement extends TMentionElement {
  type: typeof ELEMENT_MENTION;
  children: [EmptyText];
}

export interface EmojiElement extends TEmojiElement {
  type: typeof ELEMENT_EMOJI;
  children: [EmptyText];
}

export interface HashtagElement extends THashtagElement {
  type: typeof ELEMENT_HASHTAG;
  children: [EmptyText];
}

export interface ShowMoreElement extends TElement {
  type: typeof ELEMENT_SHOW_MORE;
  children: [EmptyText];
}

export type InlineElement =
  | LinkElement
  | MentionElement
  | HashtagElement
  | EmojiElement
  | ShowMoreElement;
export type InlineDescendant = InlineElement | RichText;
export type InlineChildren = InlineDescendant[];

/**
 * Block props
 */

export interface IndentProps {
  indent?: number;
}

export interface IndentListProps extends IndentProps {
  listStart?: number;
  listStyleType?: string;
}

export interface LineHeightProps {
  lineHeight?: CSSProperties['lineHeight'];
}

export interface MyAlignProps {
  textAlign?: CSSProperties['textAlign'];
}

export interface BlockElement extends TElement, IndentListProps, LineHeightProps {
  id?: string;
}

/**
 * Blocks
 */

export interface ParagraphElement extends BlockElement {
  type: typeof ELEMENT_PARAGRAPH;
  children: InlineChildren;
}

export interface H1Element extends BlockElement {
  type: typeof ELEMENT_H1;
  children: InlineChildren;
}

export interface H2Element extends BlockElement {
  type: typeof ELEMENT_H2;
  children: InlineChildren;
}

export interface H3Element extends BlockElement {
  type: typeof ELEMENT_H3;
  children: InlineChildren;
}

export interface BlockquoteElement extends BlockElement {
  type: typeof ELEMENT_BLOCKQUOTE;
  children: InlineChildren;
}

export interface CodeBlockElement extends BlockElement {
  type: typeof ELEMENT_CODE_BLOCK;
  children: CodeLineElement[];
}

export interface CodeLineElement extends TElement {
  type: typeof ELEMENT_CODE_LINE;
  children: PlainText[];
}

export interface BulletedListElement extends TElement, BlockElement {
  type: typeof ELEMENT_UL;
  children: ListItemElement[];
}

export interface NumberedListElement extends TElement, BlockElement {
  type: typeof ELEMENT_OL;
  children: ListItemElement[];
}

export interface ListItemElement extends TElement, BlockElement {
  type: typeof ELEMENT_LI;
  children: InlineChildren;
}

export interface TodoListElement extends TTodoListItemElement, BlockElement {
  type: typeof ELEMENT_TODO_LI;
  children: InlineChildren;
}

export interface ImageElement extends TImageElement, BlockElement {
  type: typeof ELEMENT_IMAGE;
  children: [EmptyText];
}

export interface MediaEmbedElement extends TMediaEmbedElement, BlockElement {
  type: typeof ELEMENT_MEDIA_EMBED;
  children: [EmptyText];
}

export interface ImageListElement extends TImageListElement {
  type: typeof ELEMENT_IMAGE_LIST;
  children: [EmptyText];
}

export interface HrElement extends BlockElement {
  type: typeof ELEMENT_HR;
  children: [EmptyText];
}

export type NestableBlock = ParagraphElement;

export type Block = Exclude<Element, InlineElement>;
export type BlockEntry = TNodeEntry<Block>;

export type RootBlock =
  | ParagraphElement
  | H1Element
  | H2Element
  | H3Element
  | BlockquoteElement
  | CodeBlockElement
  | BulletedListElement
  | NumberedListElement
  | TodoListElement
  | ImageElement
  | MediaEmbedElement
  | HrElement
  | LinkElement
  | MentionElement
  | HashtagElement
  | EmojiElement
  | ImageListElement
  | ShowMoreElement;

export type EditorValue = RootBlock[];

/**
 * Editor types
 */

export type Editor = PlateEditor<EditorValue> & {isDragging?: boolean};
export type ReactEditor = TReactEditor<EditorValue>;
export type Node = ENode<EditorValue>;
export type NodeEntry = ENodeEntry<EditorValue>;
export type Element = EElement<EditorValue>;
export type ElementEntry = EElementEntry<EditorValue>;
export type Text = EText<EditorValue>;
export type TextEntry = ETextEntry<EditorValue>;
export type ElementOrText = EElementOrText<EditorValue>;
export type Descendant = EDescendant<EditorValue>;
export type Marks = EMarks<EditorValue>;
export type Mark = keyof Marks;
export type Mentionable = TComboboxItem<MentionDetail>;
export type MentionDetail = {
  name: string;
  username: string;
  avatar?: string;
};

/**
 * Plate types
 */

export type MyDecorate<P = PluginOptions> = Decorate<P, EditorValue, Editor>;
export type MyDecorateEntry = DecorateEntry<EditorValue>;
export type MyDOMHandler<P = PluginOptions> = DOMHandler<P, EditorValue, Editor>;
export type MyInjectComponent = InjectComponent<EditorValue>;
export type MyInjectProps = InjectProps<EditorValue>;
export type MyKeyboardHandler<P = PluginOptions> = KeyboardHandler<P, EditorValue, Editor>;
export type MyOnChange<P = PluginOptions> = OnChange<P, EditorValue, Editor>;
export type MyOverrideByKey = OverrideByKey<EditorValue, Editor>;
export type MyPlatePlugin<P = PluginOptions> = PlatePlugin<P, EditorValue, Editor>;
export type MyPlatePluginInsertData = PlatePluginInsertData<EditorValue>;
export type MyPlatePluginProps = PlatePluginProps<EditorValue>;
export type MyPlateProps = PlateProps<EditorValue, Editor>;
export type MySerializeHtml = SerializeHtml<EditorValue>;
export type MyWithOverride<P = PluginOptions> = WithOverride<P, EditorValue, Editor>;
export type MyAutoformatRule = AutoformatRule<EditorValue, Editor>;
