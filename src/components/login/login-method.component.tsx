import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

import ShowIf from '../common/show-if.component';
import JSONForm from './method-json.component';
import KeyForm from './method-key.component';
import PassphraseForm from './method-passphrase.component';

export type s = 'json' | 'passphrase' | 'key';

type Props = {
  show: boolean;
  method: string;
  onSave: (data) => void;
  onCancel: () => void;
};

export default function LoginComponent({ show, method, onSave, onCancel }: Props) {
  const [disableSubmit, setNext] = React.useState(true);
  const [credential, storeCredential] = React.useState({});

  const saveData = data => {
    setNext(false);
    storeCredential(data);
  };

  return (
    <>
      <Dialog open={show} onClose={onCancel} fullWidth={true} maxWidth="xs">
        <ShowIf condition={method === 'json'}>
          <JSONForm onClose={onCancel} onSave={saveData} />
        </ShowIf>
        <ShowIf condition={method === 'passphrase'}>
          <PassphraseForm onClose={onCancel} onSave={saveData} />
        </ShowIf>
        <ShowIf condition={method === 'key'}>
          <KeyForm onClose={onCancel} onSave={saveData} />
        </ShowIf>

        <DialogActions>
          <Button variant="contained" onClick={() => onSave(credential)} color="secondary" fullWidth={true} disabled={disableSubmit}>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
