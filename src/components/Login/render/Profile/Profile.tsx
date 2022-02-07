import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import {Button, Grid, TextField, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {PromptComponent} from '../../../atoms/Prompt/prompt.component';
import {useStyles} from './Profile.style';

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
  const styles = useStyles();

  const {account, checkUsernameAvailability} = props;

  const {signUpWithExternalAuth} = useAuthHook();

  const navigate = useNavigate();

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
  const [confirmation, setConfirmation] = useState(false);

  const toggleConfirmation = () => {
    setConfirmation(!confirmation);
  };

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

  const handleConfirmation = async () => {
    const valid = validate();

    if (valid && account) {
      checkUsernameAvailability(profile.username.value, available => {
        if (available) {
          toggleConfirmation();
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
  };

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

  return (
    <div className={styles.root}>
      <div className={styles.box}>
        <TextField
          id="name"
          placeholder={i18n.t('Login.Profile.Placeholder_Display_Name')}
          helperText={profile.name.helper}
          error={profile.name.error}
          fullWidth
          variant="outlined"
          onChange={handleChangeName}
          inputProps={{maxLength: DISPLAY_NAME_MAX_LENGTH}}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Typography className={`${styles.count}`} component="span">
          ({profile.name.value.length}/{DISPLAY_NAME_MAX_LENGTH})
        </Typography>
      </div>

      <div className={styles.box}>
        <TextField
          id="username"
          placeholder={i18n.t('Login.Profile.Placeholder_Username')}
          helperText={profile.username.helper}
          error={profile.username.error}
          fullWidth
          variant="outlined"
          onChange={handleChangeUsername}
          InputLabelProps={{
            shrink: true,
          }}
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

      <PromptComponent
        title={i18n.t('Login.Profile.Prompt.Title')}
        subtitle={<Typography>{i18n.t('Login.Profile.Prompt.Subtitle')}.</Typography>}
        open={confirmation}
        icon="warning"
        onCancel={toggleConfirmation}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            style={{marginRight: '12px'}}
            size="small"
            variant="outlined"
            color="secondary"
            onClick={toggleConfirmation}>
            {i18n.t('Login.Profile.Prompt.Btn_No')}
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={handleSubmit}>
            {i18n.t('Login.Profile.Prompt.Btn_Yes')}
          </Button>
        </div>
      </PromptComponent>
    </div>
  );
};
