import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import {Button, Grid, TextField, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useStyles} from './Profile.style';

type ProfileProps = {
  account: InjectedAccountWithMeta | null;
  checkUsernameAvailabilty: (username: string, callback: (available: boolean) => void) => void;
  onSubmit: (name: string, username: string) => void;
};

const DEFAULT_HELPER_TEXT = 'You can use 3 or more characters.';
const USERNAME_MAX_LENGTH = 16;
const DISPLAY_NAME_MAX_LENGTH = 22;

export const Profile: React.FC<ProfileProps> = props => {
  const styles = useStyles();

  const {onSubmit, checkUsernameAvailabilty} = props;

  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: {
      value: '',
      error: false,
      helper: DEFAULT_HELPER_TEXT,
    },
    username: {
      value: '',
      error: false,
      helper: DEFAULT_HELPER_TEXT,
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
    const username = event.target.value;

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

    if (!profile.name.value || profile.name.value.length === 0) {
      error = true;

      setProfile(prevSetting => ({
        ...prevSetting,
        name: {
          ...prevSetting.name,
          error: true,
          helper: 'Display name must be provided and contain at least 3 character',
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
            helper: 'Display name contain disallowed character',
          },
        }));
      } else {
        error = false;

        setProfile(prevSetting => ({
          ...prevSetting,
          name: {
            ...prevSetting.name,
            error: false,
            helper: DEFAULT_HELPER_TEXT,
          },
        }));
      }
    }

    return !error;
  };

  const validateUsername = (): boolean => {
    let error = false;

    if (!profile.username.value || profile.username.value.length < 3) {
      error = true;

      setProfile(prevSetting => ({
        ...prevSetting,
        username: {
          ...prevSetting.username,
          error,
          helper: 'Username must be provided and contain at least 3 character',
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
            helper: 'Display name contain disallowed character',
          },
        }));
      } else {
        error = false;
        setProfile(prevSetting => ({
          ...prevSetting,
          username: {
            ...prevSetting.username,
            error: false,
            helper: DEFAULT_HELPER_TEXT,
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

  const handleSubmit = () => {
    const valid = validate();

    if (valid) {
      checkUsernameAvailabilty(profile.username.value, available => {
        if (available) {
          onSubmit(profile.name.value, profile.username.value);
        } else {
          setProfile(prevProfile => ({
            ...prevProfile,
            username: {
              ...prevProfile.username,
              error: true,
              helper: 'Username already taken',
            },
          }));
        }
      });
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.box}>
        <TextField
          id="name"
          placeholder="Insert display name"
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
          ({profile.username.value.length}/{DISPLAY_NAME_MAX_LENGTH})
        </Typography>
      </div>

      <div className={styles.box}>
        <TextField
          id="username"
          placeholder="username"
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
          Change Wallet
        </Button>

        <Button
          disabled={profile.username.value.length === 0}
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          size="small">
          Register
        </Button>
      </Grid>
    </div>
  );
};
