import React, {useState, useEffect, useCallback} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import getConfig from 'next/config';
import Link from 'next/link';

import {Button, Checkbox, FormControlLabel, Grid, Typography, TextField} from '@material-ui/core';

import {useStyles} from './CreateAccounts.style';

import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import {IcEmail, LogoMyriadCircle} from 'src/images/Icons';
import i18n from 'src/locale';
import {RootState} from 'src/reducers';
import {ConfigState} from 'src/reducers/config/reducer';

const {publicRuntimeConfig} = getConfig();

const USERNAME_MAX_LENGTH = 16;
const USERNAME_MIN_LENGTH = 3;
const DISPLAY_NAME_MAX_LENGTH = 22;
const DISPLAY_NAME_MIN_LENGTH = 2;
const DISPLAY_NAME_HELPER_TEXT = i18n.t('Login.Profile.Helper_Text_Name', {
  min_length: DISPLAY_NAME_MIN_LENGTH,
});
const USERNAME_HELPER_TEXT = i18n.t('Login.Profile.Helper_Text_Username', {
  min_length: USERNAME_MIN_LENGTH,
});

type CreateAccountProps = {
  checkUsernameAvailability: (username: string, callback: (available: boolean) => void) => void;
  email: string;
};

export default function CreateAccounts({checkUsernameAvailability, email}: CreateAccountProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const {settings} = useSelector<RootState, ConfigState>(state => state.configState);

  const [account, setAccount] = useState({
    displayName: {
      value: '',
      error: false,
      helper: DISPLAY_NAME_HELPER_TEXT,
    },
    username: {
      value: '',
      error: false,
      helper: USERNAME_HELPER_TEXT,
    },
  });

  useEffect(() => {
    let displayNameHelper = i18n.t('Login.Profile.Helper_Text_Name', {
      min_length: DISPLAY_NAME_MIN_LENGTH,
    });
    let usernameHelper = i18n.t('Login.Profile.Helper_Text_Username', {
      min_length: USERNAME_MIN_LENGTH,
    });

    if (account.displayName.value && account.displayName.value.length < DISPLAY_NAME_MIN_LENGTH) {
      displayNameHelper = i18n.t('Login.Profile.Helper_Validate_Name_Min', {
        min_length: DISPLAY_NAME_MIN_LENGTH,
      });
      console.log({displayNameHelper});
    } else {
      const valid = /^([^"'*\\]*)$/.test(account.displayName.value);
      if (!valid) displayNameHelper = i18n.t('Login.Profile.Helper_Validate_Name_Char');
    }

    if (account.username.value && account.username.value.length < USERNAME_MIN_LENGTH) {
      usernameHelper = i18n.t('Login.Profile.Helper_Validate_Username_Min', {
        min_length: USERNAME_MIN_LENGTH,
      });
    } else {
      const valid = /^[a-zA-Z0-9]+$/.test(account.username.value);
      if (!valid) usernameHelper = i18n.t('Login.Profile.Helper_Validate_Username_Char');
    }

    setAccount(prevSetting => ({
      displayName: {
        ...prevSetting.displayName,
        helper: displayNameHelper,
      },
      username: {
        ...prevSetting.username,
        helper: usernameHelper,
      },
    }));
  }, [settings.language]);

  const handleChangeDisplayName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const displayName = event.target.value;

    setAccount(prevAccount => ({
      ...prevAccount,
      displayName: {
        ...prevAccount.displayName,
        value: displayName.trim().replace(/\s\s+/g, ' '),
      },
    }));
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    let username = event.target.value;

    username = username.toLowerCase();

    setAccount(prevAccount => ({
      ...prevAccount,
      username: {
        ...prevAccount.username,
        value: username.trim(),
      },
    }));
  };

  const validateDisplayName = (): boolean => {
    let error = false;

    if (!account.displayName.value || account.displayName.value.length < DISPLAY_NAME_MIN_LENGTH) {
      error = true;

      setAccount(prevSetting => ({
        ...prevSetting,
        displayName: {
          ...prevSetting.displayName,
          error: true,
          helper: i18n.t('Login.Profile.Helper_Validate_Name_Min', {
            min_length: DISPLAY_NAME_MIN_LENGTH,
          }),
        },
      }));
    } else {
      const valid = /^([^"'*\\]*)$/.test(account.displayName.value);

      if (!valid) {
        error = true;

        setAccount(prevSetting => ({
          ...prevSetting,
          displayName: {
            ...prevSetting.displayName,
            error: true,
            helper: i18n.t('Login.Profile.Helper_Validate_Name_Char'),
          },
        }));
      } else {
        error = false;

        setAccount(prevSetting => ({
          ...prevSetting,
          displayName: {
            ...prevSetting.displayName,
            error: false,
            helper: DISPLAY_NAME_HELPER_TEXT,
          },
        }));
      }
    }

    return !error;
  };

  const validateUsername = (): boolean => {
    let error = false;

    if (!account.username.value || account.username.value.length < USERNAME_MIN_LENGTH) {
      error = true;

      setAccount(prevSetting => ({
        ...prevSetting,
        username: {
          ...prevSetting.username,
          error,
          helper: i18n.t('Login.Profile.Helper_Validate_Username_Min', {
            min_length: USERNAME_MIN_LENGTH,
          }),
        },
      }));
    } else {
      // only allow alphanumeric char
      const valid = /^[a-zA-Z0-9]+$/.test(account.username.value);

      if (!valid) {
        error = true;

        setAccount(prevSetting => ({
          ...prevSetting,
          username: {
            ...prevSetting.username,
            error: true,
            helper: i18n.t('Login.Profile.Helper_Validate_Username_Char'),
          },
        }));
      } else {
        error = false;
        setAccount(prevSetting => ({
          ...prevSetting,
          username: {
            ...prevSetting.username,
            error: false,
            helper: USERNAME_HELPER_TEXT,
          },
        }));
      }
    }

    return !error;
  };

  const validateAccount = (): boolean => {
    const validDisplayName = validateDisplayName();
    const validUsername = validateUsername();

    return validDisplayName && validUsername;
  };

  const handleSubmit = async () => {
    const payload = {
      username: account.username.value,
      name: account.displayName.value,
      email,
      callbackURL: publicRuntimeConfig.appAuthURL + '/login',
    };

    //signup here to API
    //navigate to /magiclink if API call successful
    console.log('the data to be sent: ', {payload});
  };

  const confirmRegisterAccount = useCallback(() => {
    confirm({
      title: i18n.t('Login.Profile.Prompt.Title'),
      description: i18n.t('Login.Profile.Prompt.Subtitle'),
      confirmationText: i18n.t('Login.Profile.Prompt.Btn_Yes'),
      cancellationText: i18n.t('Login.Profile.Prompt.Btn_No'),
      onConfirm: handleSubmit,
    });
  }, [handleSubmit]);

  const handleConfirmation = useCallback(() => {
    const validAccount = validateAccount();

    if (validAccount && email) {
      checkUsernameAvailability(account.username.value, available => {
        if (available) {
          console.log('masuk sini');
          confirmRegisterAccount();
        } else {
          setAccount(prevAccount => ({
            ...prevAccount,
            username: {
              ...prevAccount.username,
              error: true,
              helper: i18n.t('Login.Profile.Helper_Validate_Username_Taken'),
            },
          }));
        }
      });
    }
  }, [email, account]);

  const [termApproved, setTermApproved] = useState(false);

  const toggleTermApproved = () => {
    setTermApproved(!termApproved);
  };

  return (
    <div className={styles.root}>
      <Typography className={styles.textTitle}>Email Used</Typography>
      <div className={styles.wrapperEmail}>
        <IcEmail />
        <Typography className={styles.textEmail}>{email}</Typography>
      </div>
      <Typography className={styles.textTitle}>Selected Instance</Typography>
      <div className={styles.wrapperInstance}>
        <LogoMyriadCircle />
        <div className={styles.wrapperTextInstance}>
          <Typography className={styles.nameInstance}>Myriad</Typography>
          <Typography className={styles.desc}>
            Metaverse hunter for all. Join us to get more metaverse hun...
          </Typography>
          <Typography className={styles.textSeeMore}>See more</Typography>
        </div>
      </div>
      <Typography className={styles.textTitle}>Create New Account</Typography>
      <Typography className={styles.textSetUsername}>
        You can only set your username once, and will be unique for each instance
      </Typography>
      <div className={styles.wrapperForm}>
        <TextField
          id="display-name"
          label={i18n.t('Login.Profile.Placeholder_Display_Name')}
          helperText={account.displayName.helper}
          error={account.displayName.error}
          fullWidth
          variant="outlined"
          onChange={handleChangeDisplayName}
          inputProps={{maxLength: DISPLAY_NAME_MAX_LENGTH}}
        />
        <Typography className={styles.textCharacter} component="span">
          {account.displayName.value.length}/{DISPLAY_NAME_MAX_LENGTH}
        </Typography>
      </div>
      <div className={styles.wrapperForm}>
        <TextField
          id="username"
          label={i18n.t('Login.Profile.Placeholder_Username')}
          helperText={account.username.helper}
          error={account.username.error}
          fullWidth
          variant="outlined"
          onChange={handleChangeUsername}
          inputProps={{maxLength: USERNAME_MAX_LENGTH, style: {textTransform: 'lowercase'}}}
        />
        <Typography className={styles.textCharacter} component="span">
          {account.username.value.length}/{USERNAME_MAX_LENGTH}
        </Typography>
      </div>
      <div className={styles.wrapperForm}>
        <Grid container direction="column" className={styles.condition}>
          <FormControlLabel
            className={styles.termControl}
            onChange={toggleTermApproved}
            control={<Checkbox name="term" color="primary" className={styles.checkbox} />}
            label={
              <Typography style={{color: '#0A0A0A'}}>
                {i18n.t('Login.Options.Text_Terms_1')}&nbsp;
                <Link href="/term-of-use" passHref>
                  <Typography component={'a'} className={styles.term}>
                    {i18n.t('Login.Options.Text_Terms_2')}
                  </Typography>
                </Link>
                &nbsp;{i18n.t('Login.Options.Text_Terms_3')}&nbsp;
                <Link href="/privacy-policy" passHref>
                  <Typography component={'a'} className={styles.term}>
                    {i18n.t('Login.Options.Text_Terms_4')}
                  </Typography>
                </Link>
              </Typography>
            }
          />
        </Grid>
        <div style={{display: 'flex'}}>
          <Button variant="outlined" fullWidth color="secondary" onClick={() => navigate('/email')}>
            Back
          </Button>
          <div style={{width: 8}} />
          <Button variant="contained" fullWidth color="primary" onClick={handleConfirmation}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}
