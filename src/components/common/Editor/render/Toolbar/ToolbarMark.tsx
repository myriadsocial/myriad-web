import {
  getPluginType,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  MarkToolbarButton,
} from '@udecode/plate';

import React from 'react';

import {FormatBold, FormatItalic, FormatStrikethrough, FormatUnderlined} from '@material-ui/icons';

import {usePlateEditorRef} from '../../store';

export const ToolbarMarksButtons = () => {
  const editor = usePlateEditorRef()!;

  return (
    <>
      <MarkToolbarButton type={getPluginType(editor, MARK_BOLD)} icon={<FormatBold />} />
      <MarkToolbarButton type={getPluginType(editor, MARK_ITALIC)} icon={<FormatItalic />} />
      <MarkToolbarButton type={getPluginType(editor, MARK_UNDERLINE)} icon={<FormatUnderlined />} />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<FormatStrikethrough />}
      />
    </>
  );
};
