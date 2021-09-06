import {
  ELEMENT_ALIGN_CENTER,
  ELEMENT_ALIGN_JUSTIFY,
  ELEMENT_ALIGN_RIGHT,
} from '@udecode/plate-alignment';
import {ToolbarAlign} from '@udecode/plate-alignment-ui';
import {getPlatePluginType, useEventEditorId, useStoreEditorRef} from '@udecode/plate-core';

import React from 'react';

import {
  FormatAlignCenter,
  FormatAlignJustify,
  FormatAlignLeft,
  FormatAlignRight,
} from '@material-ui/icons';

export const ToolbarButtonsAlign = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'));

  return (
    <>
      <ToolbarAlign icon={<FormatAlignLeft />} />
      <ToolbarAlign
        type={getPlatePluginType(editor, ELEMENT_ALIGN_CENTER)}
        icon={<FormatAlignCenter />}
      />
      <ToolbarAlign
        type={getPlatePluginType(editor, ELEMENT_ALIGN_RIGHT)}
        icon={<FormatAlignRight />}
      />
      <ToolbarAlign
        type={getPlatePluginType(editor, ELEMENT_ALIGN_JUSTIFY)}
        icon={<FormatAlignJustify />}
      />
    </>
  );
};
