import React, {useCallback, useState} from 'react';
import {useNavigate} from 'react-router';

import {Button, Grid, TextField, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useStyles} from './Profile.style';

import useConfirm from 'src/components/common/Confirm/use-confirm.hook';
import {useAuthHook} from 'src/hooks/auth.hook';
import {toHexPublicKey} from 'src/lib/crypto';
import i18n from 'src/locale';

type ProfileProps = {
  account: InjectedAccountWithMeta | null;
  checkUsernameAvailability: (username: string, callback: (available: boolean) => void) => void;
};

const USERNAME_MAX_LENGTH = 16;
const USERNAME_MIN_LENGTH = 3;
const DISPLAY_NAME_MAX_LENGTH = 22;
const DISPLAY_NAME_MIN_LENGTH = 2;
const NAME_HELPER_TEXT = i18n.t('Login.Profile.Helper_Text_Name', {
  min_length: DISPLAY_NAME_MIN_LENGTH,
});
const USERNAME_HELPER_TEXT = i18n.t('Login.Profile.Helper_Text_Username', {
  min_length: USERNAME_MIN_LENGTH,
});

export const Profile: React.FC<ProfileProps> = props => {
  const {account, checkUsernameAvailability} = props;

  const styles = useStyles();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const {signUpWithExternalAuth} = useAuthHook();

  const [profile, setProfile] = useState({
    name: {
      value: '',
      error: false,
      helper: NAME_HELPER_TEXT,
    },
    username: {
      value: '',
      error: false,
      helper: USERNAME_HELPER_TEXT,
    },
  });

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;

    setProfile(prevProfile => ({
      ...prevProfile,
      name: {
        ...prevProfile.name,
        value: name.trim().replace(/\s\s+/g, ' '),
      },
    }));
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    let username = event.target.value;

    username = username.toLowerCase();

    setProfile(prevProfile => ({
      ...prevProfile,
      username: {
        ...prevProfile.username,
        value: username.trim(),
      },
    }));
  };

  const validateName = (): boolean => {
    let error = false;

    if (!profile.name.value || profile.name.value.length < DISPLAY_NAME_MIN_LENGTH) {
      error = true;

      setProfile(prevSetting => ({
        ...prevSetting,
        name: {
          ...prevSetting.name,
          error: true,
          helper: i18n.t('Login.Profile.Helper_Validate_Name_Min', {
            min_length: DISPLAY_NAME_MIN_LENGTH,
          }),
        },
      }));
    } else {
      const valid = /^([^"'*\\]*)$/.test(profile.name.value);

      if (!valid) {
        error = true;

        setProfile(prevSetting => ({
          ...prevSetting,
          name: {
            ...prevSetting.name,
            error: true,
            helper: i18n.t('Login.Profile.Helper_Validate_Name_Char'),
          },
        }));
      } else {
        error = false;

        setProfile(prevSetting => ({
          ...prevSetting,
          name: {
            ...prevSetting.name,
            error: false,
            helper: NAME_HELPER_TEXT,
          },
        }));
      }
    }

    return !error;
  };

  const validateUsername = (): boolean => {
    let error = false;

    if (!profile.username.value || profile.username.value.length < USERNAME_MIN_LENGTH) {
      error = true;

      setProfile(prevSetting => ({
        ...prevSetting,
        username: {
          ...prevSetting.username,
          error,
          helper: i18n.t('Login.Profile.Helper_Validate_Username_Char', {
            min_length: USERNAME_MIN_LENGTH,
          }),
        },
      }));
    } else {
      // only allow alphanumeric char
      const valid = /^[a-zA-Z0-9]+$/.test(profile.username.value);

      if (!valid) {
        error = true;

        setProfile(prevSetting => ({
          ...prevSetting,
          username: {
            ...prevSetting.username,
            error: true,
            helper: i18n.t('Login.Profile.Helper_Validate_Username_Char', {
              min_length: USERNAME_MIN_LENGTH,
            }),
          },
        }));
      } else {
        error = false;
        setProfile(prevSetting => ({
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

  const handleChangeWallet = () => {
    navigate('/wallet');
  };

  const validate = (): boolean => {
    const validName = validateName();
    const validUsername = validateUsername();

    return validName && validUsername;
  };

  const handleConfirmation = useCallback(() => {
    const valid = validate();

    if (valid && account) {
      checkUsernameAvailability(profile.username.value, available => {
        if (available) {
          confirmRegisterProfile();
        } else {
          setProfile(prevProfile => ({
            ...prevProfile,
            username: {
              ...prevProfile.username,
              error: true,
              helper: i18n.t('Login.Profile.Helper_Validate_Username_Taken'),
            },
          }));
        }
      });
    }
  }, [account, profile]);

  const handleSubmit = async () => {
    if (account) {
      const registered = await signUpWithExternalAuth(
        toHexPublicKey(account),
        profile.name.value,
        profile.username.value,
        account,
      );

      if (!registered) {
        navigate('/wallet');
      }
    }
  };

  const confirmRegisterProfile = useCallback(() => {
    confirm({
      title: i18n.t('Login.Profile.Prompt.Title'),
      description: i18n.t('Login.Profile.Prompt.Subtitle'),
      confirmationText: i18n.t('Login.Profile.Prompt.Btn_Yes'),
      cancellationText: i18n.t('Login.Profile.Prompt.Btn_No'),
      onConfirm: handleSubmit,
    });
  }, [handleSubmit]);

  return (
    <div className={styles.root}>
      <div className={styles.box}>
        <TextField
          id="name"
          label={i18n.t('Login.Profile.Placeholder_Display_Name')}
          helperText={profile.name.helper}
          error={profile.name.error}
          fullWidth
          variant="outlined"
          onChange={handleChangeName}
          inputProps={{maxLength: DISPLAY_NAME_MAX_LENGTH}}
        />
        <Typography className={`${styles.count}`} component="span">
          ({profile.name.value.length}/{DISPLAY_NAME_MAX_LENGTH})
        </Typography>
      </div>

      <div className={styles.box}>
        <TextField
          id="username"
          label={i18n.t('Login.Profile.Placeholder_Username')}
          helperText={profile.username.helper}
          error={profile.username.error}
          fullWidth
          variant="outlined"
          onChange={handleChangeUsername}
          inputProps={{maxLength: USERNAME_MAX_LENGTH, style: {textTransform: 'lowercase'}}}
        />
        <Typography className={`${styles.count}`} component="span">
          ({profile.username.value.length}/{USERNAME_MAX_LENGTH})
        </Typography>
      </div>

      <Grid container className={styles.action} justifyContent="space-between">
        <Button onClick={handleChangeWallet} variant="outlined" color="secondary" size="small">
          {i18n.t('Login.Profile.Btn_Change_Wallet')}
        </Button>

        <Button
          disabled={profile.username.value.length === 0}
          onClick={handleConfirmation}
          variant="contained"
          color="primary"
          size="small">
          {i18n.t('Login.Profile.Btn_Register')}
        </Button>
      </Grid>
    </div>
  );
};
