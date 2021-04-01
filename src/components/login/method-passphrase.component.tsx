import React, { useState } from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

import { mnemonicValidate } from '@polkadot/util-crypto';

import DialogTitle from '../common/DialogTitle.component';
import CaptchaComponent from '../common/captcha.component';

type Props = {
  close: () => void;
  save: (value: string) => void;
};

export default function PassphraseForm({ close, save }: Props) {
  const [mnemonic, setMnemonic] = useState('');
  const [isValidMnemonic, setValidMnemonic] = useState(true);
  const [_, setCaptchaVerified] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const valid = mnemonicValidate(value);

    setMnemonic(value);
    setValidMnemonic(valid);

    if (valid) {
      save(value.trim());
    } else {
      save('');
    }
  };

  const getCaptchaVerification = (isVerified: boolean) => {
    setCaptchaVerified(isVerified);
  };

  return (
    <>
      <DialogTitle id="passphrase" onClose={close}>
        Use Mnemonic Phrase
      </DialogTitle>
      <DialogContent>
        <TextField
          value={mnemonic}
          multiline
          rows={2}
          error={!isValidMnemonic}
          onChange={handleChange}
          autoFocus
          color="secondary"
          margin="normal"
          id="phrase"
          label="Type in your mnemonic phrase"
          type="text"
          variant="filled"
          fullWidth
        />
      </DialogContent>
      <DialogContent>
        <CaptchaComponent getCaptchaVerification={getCaptchaVerification} />
      </DialogContent>
    </>
  );
}
