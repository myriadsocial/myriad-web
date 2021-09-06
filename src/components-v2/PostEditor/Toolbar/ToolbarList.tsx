import {getPlatePluginType, useEventEditorId, useStoreEditorRef} from '@udecode/plate-core';
import {ELEMENT_OL, ELEMENT_UL} from '@udecode/plate-list';
import {ToolbarList} from '@udecode/plate-list-ui';

import React from 'react';

import {FormatListBulleted, FormatListNumbered} from '@material-ui/icons';

export const ToolbarButtonsList = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'));

  return (
    <>
      <ToolbarList type={getPlatePluginType(editor, ELEMENT_UL)} icon={<FormatListBulleted />} />
      <ToolbarList type={getPlatePluginType(editor, ELEMENT_OL)} icon={<FormatListNumbered />} />
    </>
  );
};
