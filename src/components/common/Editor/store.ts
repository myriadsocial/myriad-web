/**
 * Plate store, Slate context
 */
import {
  getPlateActions,
  getPlateEditorRef as getPlateEditorRefBase,
  getPlateSelectors,
  getTEditor,
  useEditorRef as useEditorRefBase,
  useEditorState as useEditorStateBase,
  usePlateEditorRef as usePlateEditorRefBase,
  usePlateEditorState as usePlateEditorStateBase,
  usePlateSelectors,
} from '@udecode/plate';

import {EditorValue, Editor} from './Editor.interface';

export const getEditor = (editor: Editor) => getTEditor<EditorValue, Editor>(editor);
export const useEditorRef = () => useEditorRefBase<EditorValue, Editor>();
export const useEditorState = () => useEditorStateBase<EditorValue, Editor>();
export const usePlateEditorRef = (id?: string) => usePlateEditorRefBase<EditorValue, Editor>(id);
export const getPlateEditorRef = (id?: string) => getPlateEditorRefBase<EditorValue, Editor>(id);
export const usePlateEditorState = (id?: string) =>
  usePlateEditorStateBase<EditorValue, Editor>(id);
export const useEditorSelectors = (id?: string) => usePlateSelectors<EditorValue, Editor>(id);
export const getEditorSelectors = (id?: string) => getPlateSelectors<EditorValue, Editor>(id);
export const getEditorActions = (id?: string) => getPlateActions<EditorValue, Editor>(id);
