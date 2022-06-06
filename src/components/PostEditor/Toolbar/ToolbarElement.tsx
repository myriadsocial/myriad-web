import {ELEMENT_BLOCKQUOTE} from '@udecode/plate-block-quote';
import {getPlatePluginType, useEventEditorId, useStoreEditorRef} from '@udecode/plate-core';
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@udecode/plate-heading';
import {ToolbarElement} from '@udecode/plate-toolbar';

import React from 'react';

import {FormatQuote, Looks3, Looks4, Looks5, Looks6, LooksOne, LooksTwo} from '@material-ui/icons';

export const ToolbarElementList: React.FC = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'));

  return (
    <>
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H1)} icon={<LooksOne />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H2)} icon={<LooksTwo />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H3)} icon={<Looks3 />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H4)} icon={<Looks4 />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H5)} icon={<Looks5 />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H6)} icon={<Looks6 />} />
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
    </>
  );
};
