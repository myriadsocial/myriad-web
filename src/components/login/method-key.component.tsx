import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

import DialogTitle from '../common/DialogTitle.component';

type Props = {
  onClose: () => void;
  onSave: (data) => void;
};

export default function KeyForm({ onClose, onSave }: Props) {
  return (
    <>
      <DialogTitle id="key-title" onClose={onClose}>
        Paste Private Key
      </DialogTitle>
      <DialogContent>
        <TextField
          onChange={e => onSave(e.target.value)}
          multiline
          rows={4}
          color="secondary"
          autoFocus
          margin="dense"
          id="key"
          label="Input your private key"
          type="text"
          fullWidth
        />
      </DialogContent>
    </>
  );
}
