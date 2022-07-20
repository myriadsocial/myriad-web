import {usePlateEditorRef} from '@udecode/plate-core';
import {ToolbarButton, ToolbarButtonProps} from '@udecode/plate-ui-toolbar';

import React, {useState} from 'react';

import {Dialog} from '@material-ui/core';

import {insertEmoji} from 'components/common/Editor/plugins/EmojiPicker/transforms/insertEmoji';
import Picker, {IEmojiData} from 'emoji-picker-react';

export interface EmojiToolbarButtonProps extends ToolbarButtonProps {
  accept?: string;
}

export const EmojiPickerToolbarButton = ({id, ...props}: EmojiToolbarButtonProps) => {
  const editor = usePlateEditorRef(id)!;

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleEmojiSelect = (event: any, data: IEmojiData) => {
    insertEmoji(editor, data);

    handleClose();
  };

  return (
    <>
      <ToolbarButton
        onMouseDown={async event => {
          if (!editor) return;

          event.preventDefault();

          setOpen(true);
        }}
        {...props}
      />

      <Dialog open={open} onClose={handleClose}>
        <Picker onEmojiClick={handleEmojiSelect} native={true} />
      </Dialog>
    </>
  );
};
