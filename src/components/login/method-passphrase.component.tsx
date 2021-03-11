import React from 'react';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '../common/DialogTitle.component';

type Props = {
  onClose: () => void;
  onSave: (data) => void;
};

export default function PassphraseForm(props: Props) {
  return (
    <>
      <DialogTitle id="passphrase" onClose={props.onClose}>
        Use Mnemonic Phrase
      </DialogTitle>
      <DialogContent>
        <TextField autoFocus color="secondary" margin="normal" id="phrase" label="Type in your mnemonic phrase" type="text" fullWidth />
      </DialogContent>
    </>
  );
}
