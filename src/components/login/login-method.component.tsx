import React from 'react';

import { signIn } from 'next-auth/client';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FormHelperText from '@material-ui/core/FormHelperText';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { Keyring } from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';

import DialogTitle from '../common/DialogTitle.component';
import ShowIf from '../common/show-if.component';
import JSONForm from './method-json.component';
import KeyForm from './method-key.component';
import PassphraseForm from './method-passphrase.component';

import FileSaver from 'file-saver';

const useStyles = makeStyles({
  help: {
    padding: '0 12px',
    marginBottom: 12
  },
  backup: {
    marginBottom: 12
  }
});

export type seedType = 'json' | 'bip' | 'raw';

type Props = {
  show: boolean;
  method: seedType;
  onSave: (data: string) => void;
  onCancel: () => void;
};

type AccountAddress = {
  seed: string;
  name: string;
  password: string;
};

export default function LoginComponent({ show, method, onSave, onCancel }: Props) {
  const style = useStyles();
  const [step, setActiveStep] = React.useState(1);
  const [address, setAddress] = React.useState<AccountAddress>({
    seed: '',
    password: '',
    name: ''
  });
  const [{ isConfirmPasswordValid, confirmPassword }, setConfirmPassword] = React.useState({
    isConfirmPasswordValid: false,
    confirmPassword: ''
  });
  const [enableSubmit, setEnableSubmit] = React.useState(false);
  const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });

  React.useEffect(() => {
    if (method === 'bip' && address.password.length > 0) {
      if (address.password !== confirmPassword) {
        setEnableSubmit(false);
      } else {
        setEnableSubmit(true);
      }
    }
  }, [method, address.password, confirmPassword]);

  const saveSeed = (value: string) => {
    if (value.length) {
      setAddress({
        ...address,
        seed: value.trim()
      });
      setEnableSubmit(true);
    } else {
      setEnableSubmit(false);
    }
  };

  const downloadAccount = (): void => {
    const seedUri = address.seed + '//hard//' + address.password;

    const pair: KeyringPair = keyring.createFromUri(seedUri, { name: address.name });

    const blob = new Blob([JSON.stringify(pair.toJson())], { type: 'application/json; charset=utf-8' });

    FileSaver.saveAs(blob, `${pair.address}.json`);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setAddress({
      ...address,
      password: value
    });
  };

  const handleConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setConfirmPassword({
      confirmPassword: value,
      isConfirmPasswordValid: value === address.password
    });
  };

  const handleNext = () => {
    if (step < 2) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
      setEnableSubmit(false);
    } else {
      setAddress({
        ...address,
        password: ''
      });
    }
  };

  const handleSubmit = () => {
    const seedUri = address.seed + '//hard//' + address.password;

    const pair: KeyringPair = keyring.createFromUri(seedUri, { name: address.name });

    signIn('credentials', {
      address: pair.address,
      anonymous: false,
      callbackUrl: process.env.NEXT_PUBLIC_APP_URL + '/home',
      redirect: true
    });
  };

  const cancel = () => {
    setAddress({
      ...address,
      name: '',
      seed: '',
      password: ''
    });
    setActiveStep(1);
    onCancel();
  };

  return (
    <>
      <Dialog open={show} onClose={cancel} fullWidth={true} maxWidth="xs">
        {step === 1 && (
          <>
            <ShowIf condition={method === 'json'}>
              <JSONForm onClose={cancel} onSave={saveSeed} />
              <FormHelperText variant="outlined" className={style.help}>
                The private key for your account is derived from this seed. This seed must be kept secret as anyone in its possession has
                access to the funds of this account. If you validate, use the seed of the session account as the "--key" parameter of your
                node.
              </FormHelperText>
            </ShowIf>
            <ShowIf condition={method === 'bip'}>
              <PassphraseForm close={cancel} save={saveSeed} />
              <FormHelperText variant="outlined" className={style.help}>
                The private key for your account is derived from this phrase. This phrase must be kept secret as anyone in its possession
                has access to the funds of this account.
              </FormHelperText>
            </ShowIf>
            <ShowIf condition={method === 'raw'}>
              <KeyForm close={cancel} save={saveSeed} />
            </ShowIf>

            <DialogActions>
              <Button variant="contained" onClick={handleNext} color="secondary" fullWidth={true} disabled={!enableSubmit}>
                {' '}
                Next
              </Button>
            </DialogActions>
          </>
        )}

        {step === 2 && (
          <>
            <DialogTitle id="user-title" onClose={close}>
              Set Account Password
            </DialogTitle>
            <DialogContent>
              <TextField
                onChange={handlePassword}
                value={address.password}
                color="secondary"
                variant="filled"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
              />
              <TextField
                onChange={handleConfirmPassword}
                value={confirmPassword}
                error={!isConfirmPasswordValid && address.password.length > 0}
                color="secondary"
                variant="filled"
                margin="normal"
                required
                fullWidth
                name="confirm_password"
                label="Confirm Password"
                type="password"
                id="confirm_password"
              />
            </DialogContent>

            <FormHelperText variant="outlined" className={style.help}>
              The private key for your account is encrypted with this password. This is required to authenticate any transaction made.
            </FormHelperText>

            <Link className={style.backup} component="button" variant="h6" color="textPrimary" onClick={downloadAccount}>
              Create a backup file for this account.
            </Link>

            <DialogActions>
              <Button variant="contained" onClick={handleSubmit} color="secondary" fullWidth={true} disabled={!enableSubmit}>
                Sign In
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
