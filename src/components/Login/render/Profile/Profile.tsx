import React, {useState} from 'react';
import {useNavigate} from 'react-router';

import {Button, Grid, TextField, Typography} from '@material-ui/core';

import {InjectedAccountWithMeta} from '@polkadot/extension-inject/types';

import {PromptComponent} from '../../../atoms/Prompt/prompt.component';
import {useStyles} from './Profile.style';

type ProfileProps = {
  account: InjectedAccountWithMeta | null;
  checkUsernameAvailabilty: (username: string, callback: (available: boolean) => void) => void;
  onSubmit: (name: string, username: string) => void;
};

const USERNAME_MAX_LENGTH = 16;
const USERNAME_MIN_LENGTH = 3;
const DISPLAY_NAME_MAX_LENGTH = 22;
const DISPLAY_NAME_MIN_LENGTH = 2;
const NAME_HELPER_TEXT = `You can use ${DISPLAY_NAME_MIN_LENGTH} or more characters.`;
const USERNAME_HELPER_TEXT = `You can use ${USERNAME_MIN_LENGTH} or more characters.`;

export const Profile: React.FC<ProfileProps> = props => {
  const styles = useStyles();

  const {onSubmit, checkUsernameAvailabilty} = props;

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
          helper: `Display name must be provided and contain at least ${DISPLAY_NAME_MIN_LENGTH} character`,
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
            helper: 'Display name cannot contain disallowed character.',
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
          helper: `Username must be provided and contain at least ${USERNAME_MIN_LENGTH} character`,
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
            helper: 'Display name cannot contain disallowed character.',
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

  const handleConfirmation = () => {
    const valid = validate();

    if (valid) {
      checkUsernameAvailabilty(profile.username.value, available => {
        if (available) {
          toggleConfirmation();
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

  const handleSubmit = () => {
    onSubmit(profile.name.value, profile.username.value);
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
          ({profile.name.value.length}/{DISPLAY_NAME_MAX_LENGTH})
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
          onClick={handleConfirmation}
          variant="contained"
          color="primary"
          size="small">
          Register
        </Button>
      </Grid>

      <PromptComponent
        title={'Are you sure?'}
        subtitle={<Typography>You can only set your username once.</Typography>}
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
            No, let me rethink
          </Button>
          <Button size="small" variant="contained" color="primary" onClick={handleSubmit}>
            Yes, Let’s go
          </Button>
        </div>
      </PromptComponent>
    </div>
  );
};
