import {ELEMENT_BLOCKQUOTE} from '@udecode/plate-block-quote';
import {getPlatePluginType, useEventEditorId, useStoreEditorRef} from '@udecode/plate-core';
<<<<<<< HEAD
import {
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
} from '@udecode/plate-heading';
=======
>>>>>>> 2181b09b (MYR-717: init editor)
import {ToolbarElement} from '@udecode/plate-toolbar';

import React from 'react';

<<<<<<< HEAD
import {FormatQuote, Looks3, Looks4, Looks5, Looks6, LooksOne, LooksTwo} from '@material-ui/icons';
=======
import {FormatQuote} from '@material-ui/icons';
>>>>>>> 2181b09b (MYR-717: init editor)

export const ToolbarElementList = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'));

  return (
    <>
<<<<<<< HEAD
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H1)} icon={<LooksOne />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H2)} icon={<LooksTwo />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H3)} icon={<Looks3 />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H4)} icon={<Looks4 />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H5)} icon={<Looks5 />} />
      <ToolbarElement type={getPlatePluginType(editor, ELEMENT_H6)} icon={<Looks6 />} />
=======
>>>>>>> 2181b09b (MYR-717: init editor)
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
    </>
  );
};
