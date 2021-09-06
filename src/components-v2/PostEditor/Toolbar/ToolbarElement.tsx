import {ELEMENT_BLOCKQUOTE} from '@udecode/plate-block-quote';
import {getPlatePluginType, useEventEditorId, useStoreEditorRef} from '@udecode/plate-core';
import {ToolbarElement} from '@udecode/plate-toolbar';

import React from 'react';

import {FormatQuote} from '@material-ui/icons';

export const ToolbarElementList = () => {
  const editor = useStoreEditorRef(useEventEditorId('focus'));

  return (
    <>
      <ToolbarElement
        type={getPlatePluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
    </>
  );
};
