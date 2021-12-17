import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import {Button, Grid, TextField} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {useStyles} from './Profile.style';

type ProfileProps = {
  account: InjectedAccountWithMeta | null;
  checkUsernameAvailabilty: (username: string, callback: (available: boolean) => void) => void;
  onSubmit: (name: string, username: string) => void;
};

export const Profile: React.FC<ProfileProps> = props => {
  const styles = useStyles();

  const {account, onSubmit, checkUsernameAvailabilty} = props;

  const navigate = useNavigate();

  const defaultHelperText = 'You can use 3 or more characters.';
  const [profile, setProfile] = useState({
    name: {
      value: account?.meta.name ?? '',
      error: false,
      helper: defaultHelperText,
    },
    username: {
      value: '',
      error: false,
      helper: defaultHelperText,
    },
  });

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;

    setProfile(prevProfile => ({
      ...prevProfile,
      name: {
        ...prevProfile.name,
        value: name,
      },
    }));
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    const username = event.target.value;

    setProfile(prevProfile => ({
      ...prevProfile,
      username: {
        ...prevProfile.username,
        value: username,
      },
    }));
  };

  const validateName = () => {
    if (!profile.name.value || profile.name.value.length === 0) {
      setProfile(prevSetting => ({
        ...prevSetting,
        name: {
          ...prevSetting.name,
          error: true,
          helper: 'Display name must be provided and contain at least 3 character',
        },
      }));
    } else {
      const valid = /^[a-zA-Z ]+$/.test(profile.name.value);

      if (!valid) {
        setProfile(prevSetting => ({
          ...prevSetting,
          name: {
            ...prevSetting.name,
            error: true,
            helper: "Display name can't contain symbol",
          },
        }));
      } else {
        setProfile(prevSetting => ({
          ...prevSetting,
          name: {
            ...prevSetting.name,
            error: false,
            helper: defaultHelperText,
          },
        }));
      }
    }
  };

  const validateUsername = () => {
    if (!profile.username.value || profile.username.value.length < 3) {
      setProfile(prevSetting => ({
        ...prevSetting,
        username: {
          ...prevSetting.username,
          error: true,
          helper: 'Username must be provided and contain at least 3 character',
        },
      }));
    } else {
      const valid = /^[a-zA-Z ]+$/.test(profile.username.value);

      if (!valid) {
        setProfile(prevSetting => ({
          ...prevSetting,
          username: {
            ...prevSetting.username,
            error: true,
            helper: "Username can't contain symbol",
          },
        }));
      } else {
        setProfile(prevSetting => ({
          ...prevSetting,
          username: {
            ...prevSetting.username,
            error: false,
            helper: defaultHelperText,
          },
        }));
      }
    }
  };

  const handleChangeWallet = () => {
    navigate('/wallet');
  };

  const handleSubmit = () => {
    validateName();
    validateUsername();

    const valid = !profile.name.error && !profile.username.error;

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
      <TextField
        id="name"
        placeholder="Insert display name"
        helperText={profile.name.helper}
        error={profile.name.error}
        fullWidth
        defaultValue={account?.meta.name}
        variant="outlined"
        onChange={handleChangeName}
        inputProps={{maxLength: 22}}
        InputLabelProps={{
          shrink: true,
        }}
      />

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
        inputProps={{maxLength: 16, style: {textTransform: 'lowercase'}}}
      />

      <Grid container className={styles.action} justifyContent="space-between">
        <Button onClick={handleChangeWallet} variant="outlined" color="secondary" size="small">
          Change Wallet
        </Button>

        <Button onClick={handleSubmit} variant="contained" color="primary" size="small">
          Register
        </Button>
      </Grid>
    </div>
  );
};
