import React from 'react';

import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {useStyles, WelcomeModuleProps} from '.';
import MyriadPurple from '../../images/Myriad-purple-logo.svg';
import {Button, ButtonVariant, ButtonSize} from '../atoms/Button';

export const WelcomeModule: React.FC<WelcomeModuleProps> = props => {
  const {displayName, username, onSubmit, onSkip} = props;

  const classes = useStyles();

  const [newDisplayName, setNewDisplayName] = React.useState(displayName);
  const [newUserName, setNewUsername] = React.useState(username);

  const handleChangeDisplayName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDisplayName(event.target.value);
  };

  const handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(newDisplayName, newUserName);
  };

  const handleSkipWelcome = () => {
    onSkip();
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
        <div>
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
          />
        </div>

        <div className={classes.secondFormField}>
          <TextField
            id="display name field"
            label="Username"
            defaultValue={username}
            variant="outlined"
            onChange={handleChangeUsername}
          />
          <Typography variant="caption" color="textSecondary">
            Please be aware that you cannot change username later
          </Typography>
        </div>

        <div className={classes.formActionWrapper}>
          <div className={classes.formAction}>
            <Typography color="primary">
              <Link component="button" variant="body1" onClick={handleSkipWelcome}>
                Skip this step &gt;
              </Link>
            </Typography>

            <Button
              onClick={handleSubmit}
              variant={ButtonVariant.CONTAINED}
              size={ButtonSize.SMALL}>
              Save
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
};
