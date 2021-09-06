import {
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
} from '@udecode/plate';
import {
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from '@udecode/plate-basic-marks';
import {getPlatePluginType, useEventEditorId, useStoreEditorRef} from '@udecode/plate-core';
import {ToolbarMark} from '@udecode/plate-toolbar';

import React from 'react';

import {FormatBold, FormatItalic, FormatStrikethrough, FormatUnderlined} from '@material-ui/icons';

export const plugins = [
  createBoldPlugin(),
  createItalicPlugin(),
  createUnderlinePlugin(),
  createStrikethroughPlugin(),
];

export const ToolbarButtonsMarks = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'));

  return (
    <>
      <ToolbarMark type={getPlatePluginType(editor, MARK_BOLD)} icon={<FormatBold />} />
      <ToolbarMark type={getPlatePluginType(editor, MARK_ITALIC)} icon={<FormatItalic />} />
      <ToolbarMark type={getPlatePluginType(editor, MARK_UNDERLINE)} icon={<FormatUnderlined />} />
      <ToolbarMark
        type={getPlatePluginType(editor, MARK_STRIKETHROUGH)}
        icon={<FormatStrikethrough />}
      />
    </>
  );
};
