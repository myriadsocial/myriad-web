import React from 'react';

import {Typography} from '@material-ui/core';

import {User} from '../../interfaces/user';
import {useStyles} from './UserSettings.styles';

type UserSettingsProps = {
  user: User;
};

export const UserSettings: React.FC<UserSettingsProps> = props => {
  const {user} = props;

  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Typography variant="h5" gutterBottom className={styles.title}>
        Public Key
      </Typography>
      <Typography variant="body1">{user.id}</Typography>
    </div>
  );
};
