import {ELEMENT_OL, ELEMENT_UL, getPluginType, ListToolbarButton} from '@udecode/plate';

import React from 'react';

import {FormatListBulleted, FormatListNumbered} from '@material-ui/icons';

import {usePlateEditorRef} from '../../store';

export const ToolbarListButtons = () => {
  const editor = usePlateEditorRef()!;

  return (
    <>
      <ListToolbarButton type={getPluginType(editor, ELEMENT_UL)} icon={<FormatListBulleted />} />
      <ListToolbarButton type={getPluginType(editor, ELEMENT_OL)} icon={<FormatListNumbered />} />
    </>
  );
};
