import React, {useState} from 'react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import Link from 'next/link';

import {IconButton} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import CaptchaComponent from '../common/captcha.component';
import {useStyles} from './register.style';

import {useAuthHook} from 'src/hooks/auth.hook';
import {generateKey} from 'src/lib/crypto';

type RegisterComponentProps = {};

export const RegisterFormComponent: React.FC<RegisterComponentProps> = props => {
  const style = useStyles();

  const {register} = useAuthHook();
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [username, setUsername] = useState('');
  const [seed, setSeed] = useState('');
  const [key, setKey] = useState('');
  const [confirm, enableConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mnemonicCopied, setMnemonicCopied] = useState(false);

  const getCaptchaVerification = (isVerified: boolean) => {
    setCaptchaVerified(isVerified);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const toggleMnemonicCopied = () => {
    setMnemonicCopied(!mnemonicCopied);
  };

  const createKey = () => {
    setSubmitted(true);

    const valid = username && username.length >= 6;

    if (valid && captchaVerified) {
      const {mnemonic, key} = generateKey(username);

      setSeed(mnemonic);
      setKey(key);
      enableConfirm(true);
    }
  };

  const signIn = () => {
    if (mnemonicCopied) {
      register({
        name: username,
        id: key,
      });
    }
  };

  return (
    <div className={style.root}>
      <div className={style.header}>
        <Typography variant="h1" className={style.title}>
          Sign In
        </Typography>
        <Link href="/">
          <IconButton className={style.back} aria-label="back" color="secondary" size="medium">
            <ArrowBackIcon />
          </IconButton>
        </Link>
      </div>

      {!confirm && (
        <div>
          <form noValidate autoComplete="off" className={style.form}>
            <FormControl className={style.username} fullWidth>
              <TextField
                id="public_key"
                onChange={handleNameChange}
                error={submitted && username.length < 6}
                helperText={
                  submitted && username.length < 6
                    ? 'Username must be filled and has 6 character or more'
                    : ''
                }
                fullWidth
                hiddenLabel
                placeholder="Username"
                variant="outlined"
                color="secondary"
                margin="dense"
                type="text"
              />
              <div className={style.captcha}>
                <CaptchaComponent getCaptchaVerification={getCaptchaVerification} />
              </div>
            </FormControl>

            <Button
              onClick={createKey}
              variant="contained"
              disabled={!captchaVerified}
              color="primary"
              size="large"
              fullWidth
              className={style.signIn}>
              Create Account
            </Button>
          </form>
        </div>
      )}
      {confirm && (
        <div className={style.confirm}>
          <TextField
            id="mnemonic_seed"
            value={seed}
            helperText={'*copy this mnemonic to your polkadot extension'}
            disabled
            fullWidth
            hiddenLabel
            multiline
            rows={2}
            variant="outlined"
            color="secondary"
            margin="dense"
            type="text"
            InputProps={{
              endAdornment: (
                <CopyToClipboard text={seed}>
                  <IconButton size="medium" color="secondary">
                    <FileCopyIcon />
                  </IconButton>
                </CopyToClipboard>
              ),
            }}
          />

          <FormControlLabel
            className={style.copy}
            control={
              <Checkbox
                checked={mnemonicCopied}
                onChange={toggleMnemonicCopied}
                name="copy-mnemonic"
              />
            }
            label="i’ve copy my mnemonic"
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            className={style.signIn}
            onClick={signIn}>
            Get Started
          </Button>
        </div>
      )}
    </div>
  );
};
