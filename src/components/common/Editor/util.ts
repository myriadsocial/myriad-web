import {
  createPlateEditor as baseCreatePlateEditor,
  CreatePlateEditorOptions,
  createPluginFactory as baseCreatePluginFactory,
  createPlugins,
  createTEditor,
  NoInfer,
  PlatePlugin,
  PlatePluginComponent,
  PluginOptions,
} from '@udecode/plate';

import {EditorValue, Editor, MyOverrideByKey, MyPlatePlugin} from './Editor.interface';

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
