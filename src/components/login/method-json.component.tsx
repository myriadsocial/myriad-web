import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';

import { encodeAddress, decodeAddress } from '@polkadot/keyring';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import { isHex, hexToU8a } from '@polkadot/util';

import DialogTitle from '../common/DialogTitle.component';
import CaptchaComponent from '../common/captcha.component';

type Props = {
  onClose: () => void;
  onSave: (data: string) => void;
};

export default function JsonForm(props: Props) {
  const [pair, setPair] = React.useState<KeyringPair$Json | undefined>(undefined);
  const [captchaVerified, setCaptchaVerified] = useState(false);

  React.useEffect(() => {
    if (pair && isValidAddressPolkadotAddress(pair.address)) {
      console.log('should logged in');
    }
  }, [pair]);

  const isValidAddressPolkadotAddress = (address: string) => {
    try {
      encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

      return true;
    } catch (error) {
      return false;
    }
  };

  const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();

    if (e.target.files?.length) {
      fileReader.onloadend = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result) {
          setPair(JSON.parse(result.toString()));
        }
      };
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const getCaptchaVerification = (isVerified: boolean) => {
    setCaptchaVerified(isVerified);
  };

  return (
    <>
      <DialogTitle id="json-title" onClose={props.onClose}>
        Import Keystore JSON File
      </DialogTitle>
      <DialogContent>
        <label htmlFor="btn-upload">
          <input id="btn-upload" name="btn-upload" style={{ display: 'none' }} type="file" onChange={handleFileChosen} />
          <Button
            disabled={!captchaVerified}
            className="btn-choose"
            variant="contained"
            color="secondary"
            fullWidth={true}
            component="span">
            Choose File
          </Button>
        </label>
      </DialogContent>
      <DialogContent>
        <CaptchaComponent getCaptchaVerification={getCaptchaVerification} />
      </DialogContent>
    </>
  );
}
