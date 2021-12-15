import React from 'react';

import {InputAdornment} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {useStyles, WelcomeModuleProps} from '.';
import MyriadPurple from '../../images/Myriad-purple-logo.svg';
import {Button, ButtonVariant, ButtonSize} from '../atoms/Button';

import {debounce} from 'lodash';

export const WelcomeModule: React.FC<WelcomeModuleProps> = props => {
  const {displayName, username, onSubmit, onSkip, isAvailable, checkAvailable} = props;

  const classes = useStyles();

  const [newDisplayName, setNewDisplayName] = React.useState(displayName);
  const [newUsername, setNewUsername] = React.useState(username);
  const [isError, setIsError] = React.useState(false);
  const [usernameError, setUsernameError] = React.useState(false);

  React.useEffect(() => {
    nameValidation();
    usernameValidation();
  }, [newDisplayName, newUsername]);

  const handleChangeDisplayName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(event.target.value);
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(newDisplayName, newUsername);
  };

  const handleSkipWelcome = () => {
    onSkip();
  };

  const nameValidation = debounce(() => {
    if (!newDisplayName || newDisplayName.length < 2) {
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, 300);

  const usernameValidation = debounce(() => {
    handleUsernameAvailable();
    const validation = /[^a-z0-9._]/g;
    const isNotValid = validation.test(newUsername);
    setUsernameError(isNotValid);
  }, 300);

  const handleUsernameAvailable = debounce(() => {
    if (username !== newUsername) {
      checkAvailable(newUsername);
    }
  }, 300);

  const handleError = (): boolean => {
    if (usernameError) return true;
    if (!newUsername.length) return true;
    if (newUsername.length > 16) return true;
    if (isAvailable === undefined) return false;
    if (typeof isAvailable === 'boolean') {
      if (isAvailable === true) return false;
      if (isAvailable === false) return true;
    }
    return false;
  };

  return (
    <div className={classes.root}>
      <div className={classes.rootHeader}>
        <div className={classes.myriadLogoWrapper}>
          <MyriadPurple role="img" aria-label="Myriad purple logo" />
        </div>
        <Typography variant="h4">Hi there, welcome to Myriad!</Typography>
      </div>
      <Paper className={classes.rootContainer} component="form">
        <div className={classes.formInfo}>
          <Typography variant="body1">Personal information</Typography>
          <Typography variant="caption" color="textSecondary">
            Introduce yourself to your audience
          </Typography>
        </div>

        <div>
          <TextField
            id="display name field"
            label="Display name"
            defaultValue={displayName}
            variant="outlined"
            onChange={handleChangeDisplayName}
            error={isError}
            inputProps={{maxLength: 22}}
          />

          {isError && (
            <Typography className={`${classes.validation}`}>Required min 2 characters</Typography>
          )}
        </div>

        <div className={classes.secondFormField}>
          <TextField
            id="display name field"
            placeholder="username"
            label="Username"
            defaultValue={username}
            variant="outlined"
            onChange={handleChangeUsername}
            error={handleError()}
            inputProps={{maxLength: 16}}
            InputProps={{
              startAdornment: <InputAdornment position="start">@</InputAdornment>,
            }}
          />
          <Typography
            className={`${classes.available} ${handleError() ? classes.red : classes.green}`}>
            {handleError() ? 'Username is not available' : 'Username is available'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Please be aware that you cannot change username later
          </Typography>
        </div>

        <div className={classes.formActionWrapper}>
          <div className={classes.formAction}>
            <Typography
              component="div"
              style={{cursor: 'pointer'}}
              color="primary"
              variant="body1"
              onClick={handleSkipWelcome}>
              Skip this step &gt;
            </Typography>

            <Button
              onClick={handleSubmit}
              variant={ButtonVariant.CONTAINED}
              size={ButtonSize.SMALL}
              isDisabled={isError || handleError()}>
              Save
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};
