import React, { useState } from 'react';

import { signIn } from 'next-auth/client';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { Keyring } from '@polkadot/keyring';
import type { KeyringPair } from '@polkadot/keyring/types';
import { mnemonicGenerate } from '@polkadot/util-crypto';

import DialogTitle from '../common/DialogTitle.component';
import CaptchaComponent from '../common/captcha.component';
import ShowIf from '../common/show-if.component';
import LoginMethod from './login-method.component';
import { useStyles } from './login.style';

import JsonIcon from 'src/images/json-icon.svg';
import KeyIcon from 'src/images/key-icon.svg';
import PassPhraseIcon from 'src/images/passphrase-icon.svg';
import { uniqueNamesGenerator, adjectives, colors } from 'unique-names-generator';

export type SeedType = 'json' | 'bip' | 'raw';

export interface AddressState {
  seed: string;
  seedType: SeedType;
}

type Props = {
  allowAnonymous?: boolean;
};

export default function LoginComponent({ allowAnonymous = true }: Props) {
  const style = useStyles();

  const [shouldShowLoginMethod, showLoginMethod] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showLoginAnonymouslyDialog, setShowLoginAnonymouslyDialog] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [address, storeAddress] = useState<AddressState>({
    seed: '',
    seedType: 'bip'
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const toggleLogin = (method: SeedType | null) => {
    if (method) {
      storeAddress({
        seedType: method,
        seed: ''
      });
      showLoginMethod(true);
    } else {
      showLoginMethod(false);
    }
  };

  const saveData = (data: string) => {
    showLoginMethod(false);
    storeAddress({
      ...address,
      seed: data
    });
  };

  const createAccount = () => {
    setShowCreateAccount(true);
  };

  const closeCreateAccount = () => {
    setShowCreateAccount(false);
    setCaptchaVerified(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setAccountName(value);
  };

  const login = () => {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    const seed = mnemonicGenerate();

    const pair: KeyringPair = keyring.createFromUri(seed + '//hard', { name: accountName });

    signIn('credentials', {
      address: pair.address,
      name: accountName,
      anonymous: false
    });
  };

  const showLoginAnonymously = () => {
    setShowLoginAnonymouslyDialog(true);
  };

  const closeLoginAnonymously = () => {
    setShowLoginAnonymouslyDialog(false);
  };

  const loginAnonymous = () => {
    const randomName: string = uniqueNamesGenerator({
      dictionaries: [adjectives, colors],
      separator: ' '
    });

    signIn('credentials', {
      address: null,
      name: randomName,
      anonymous: true
    });
  };

  const getCaptchaVerification = (isVerified: boolean) => {
    setCaptchaVerified(isVerified);
  };

  return (
    <>
      <Paper className={style.paper} variant="elevation" elevation={2}>
        <Grid item>
          <Typography className={style.title} component="h1" variant="h4">
            Log in
          </Typography>
          <div className={style.action}>
            <ButtonGroup orientation="vertical" fullWidth>
              <Button
                onClick={() => toggleLogin('bip')}
                className={style.buttonIcon}
                color="default"
                size="large"
                fullWidth={true}
                variant="contained"
                startIcon={<PassPhraseIcon />}>
                Passphrase
              </Button>
              <Button
                onClick={() => toggleLogin('json')}
                className={style.buttonIcon}
                color="default"
                size="large"
                fullWidth={true}
                variant="contained"
                startIcon={<JsonIcon />}>
                JSON
              </Button>
              <Button
                onClick={() => toggleLogin('raw')}
                className={style.buttonIcon}
                color="default"
                size="large"
                fullWidth={true}
                variant="contained"
                startIcon={<KeyIcon />}>
                Private Key
              </Button>
              <Button className={style.button} color="default" size="large" variant="contained" fullWidth={true}>
                Remind me how this works again?
              </Button>
            </ButtonGroup>
          </div>
        </Grid>

        <Grid item>
          <div className={style.action}>
            <Button color="secondary" fullWidth={true} size="large" variant="contained" onClick={createAccount}>
              Create A New Account
            </Button>
            <ShowIf condition={allowAnonymous}>
              <Button className={style.lightButton} fullWidth={true} size="large" variant="contained" onClick={showLoginAnonymously}>
                Get In Anonymously
              </Button>
            </ShowIf>
          </div>
        </Grid>
      </Paper>

      <LoginMethod show={shouldShowLoginMethod} method={address.seedType} onSave={saveData} onCancel={() => toggleLogin(null)} />

      <Dialog open={showCreateAccount} onClose={closeCreateAccount} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="name" onClose={closeCreateAccount}>
          Create a new Account.
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            onChange={handleNameChange}
            variant="filled"
            color="secondary"
            margin="dense"
            id="name"
            label="What's your name?"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogContent>
          <CaptchaComponent getCaptchaVerification={getCaptchaVerification} />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={accountName.length === 0 || !captchaVerified}
            onClick={login}
            variant="contained"
            color="secondary"
            fullWidth
            className={style.btnCreateAccount}>
            Get in
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showLoginAnonymouslyDialog} onClose={closeLoginAnonymously} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="name" onClose={closeLoginAnonymously}>
          Please verify the reCAPTCHA first.
        </DialogTitle>
        <DialogContent>
          <CaptchaComponent getCaptchaVerification={getCaptchaVerification} />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!captchaVerified}
            className={style.lightButton}
            fullWidth={true}
            size="large"
            variant="contained"
            onClick={loginAnonymous}>
            Get in anonymously
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
