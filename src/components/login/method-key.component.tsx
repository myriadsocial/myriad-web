import React, { useState } from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';

import { isHex } from '@polkadot/util';

import DialogTitle from '../common/DialogTitle.component';
import CaptchaComponent from '../common/captcha.component';

type Props = {
  close: () => void;
  save: (value: string) => void;
};

export default function KeyForm({ close, save }: Props) {
  const [value, setValue] = React.useState('');
  const [isValid, setValid] = React.useState(true);
  const [_, setCaptchaVerified] = useState(false);

  const isHexSeed = (seed: string): boolean => {
    return isHex(seed) && seed.length === 66;
  };

  const rawValidate = (seed: string): boolean => {
    return (seed.length > 0 && seed.length <= 32) || isHexSeed(seed);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.value;
    const valid = rawValidate(key);

    setValue(key);
    setValid(valid);

    if (valid) {
      save(key.trim());
    } else {
      save('');
    }
  };

  const getCaptchaVerification = (isVerified: boolean) => {
    setCaptchaVerified(isVerified);
  };

  return (
    <>
      <DialogTitle id="key-title" onClose={close}>
        Paste Private Key
      </DialogTitle>
      <DialogContent>
        <TextField
          value={value}
          error={!isValid}
          onChange={handleChange}
          multiline
          rows={4}
          color="secondary"
          autoFocus
          margin="normal"
          id="key"
          label="Input your private key"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogContent>
        <CaptchaComponent getCaptchaVerification={getCaptchaVerification} />
      </DialogContent>
    </>
  );
}
