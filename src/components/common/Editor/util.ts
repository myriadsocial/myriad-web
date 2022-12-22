import {
  createPlateEditor as baseCreatePlateEditor,
  CreatePlateEditorOptions,
  createPluginFactory as baseCreatePluginFactory,
  createPlugins,
  createTEditor,
  ELEMENT_PARAGRAPH,
  NoInfer,
  PlatePlugin,
  PlatePluginComponent,
  PluginOptions,
} from '@udecode/plate';

import {EditorValue, Editor, MyOverrideByKey, MyPlatePlugin} from './Editor.interface';

import {serialize} from 'components/PostCreate/formatter';

/**
 * Utils
 */
export const createEditor = () => createTEditor() as Editor;
export const createPlateEditor = (options: CreatePlateEditorOptions<EditorValue, Editor> = {}) =>
  baseCreatePlateEditor<EditorValue, Editor>(options);
export const createPluginFactory = <P = PluginOptions>(
  defaultPlugin: PlatePlugin<NoInfer<P>, EditorValue, Editor>,
) => baseCreatePluginFactory(defaultPlugin);
export const createEditorPlugins = (
  plugins: MyPlatePlugin[],
  options?: {
    components?: Record<string, PlatePluginComponent>;
    overrideByKey?: MyOverrideByKey;
  },
) => createPlugins<EditorValue, Editor>(plugins, options);

export const initial: EditorValue = [
  {
    type: ELEMENT_PARAGRAPH,
    children: [{text: ''}],
  },
];

export const checkEditor = (editor: EditorValue) => {
  const checker = [];
  const value = JSON.parse(serialize(editor).text);
  value.map((v: any) => {
    if (v.type === 'p') {
      checker.push(v.children[0].text !== '');
    } else if (v.type === 'img' || v.type === 'media_embed') {
      checker.push(v.url !== '');
    } else if (v.type === 'ol' || v.type === 'ul') {
      checker.push(v.children[0].children[0].children[0].text !== '');
    }
  });

  return checker.includes(true);
};
