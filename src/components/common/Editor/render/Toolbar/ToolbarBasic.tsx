import {
  BlockToolbarButton,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  getPluginType,
} from '@udecode/plate';

import React from 'react';

import {FormatQuote, Looks3, Looks4, Looks5, Looks6, LooksOne, LooksTwo} from '@material-ui/icons';

import {usePlateEditorRef} from '../../store';

export const ToolbarBasicButtons = () => {
  const editor = usePlateEditorRef()!;

  return (
    <>
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H1)} icon={<LooksOne />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H2)} icon={<LooksTwo />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H3)} icon={<Looks3 />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H4)} icon={<Looks4 />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H5)} icon={<Looks5 />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_H6)} icon={<Looks6 />} />
      <BlockToolbarButton type={getPluginType(editor, ELEMENT_BLOCKQUOTE)} icon={<FormatQuote />} />
    </>
  );
};
