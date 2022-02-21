import React from 'react';

import {Badge, Grid} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import {Avatar, AvatarSize} from '../atoms/Avatar';
import {NotificationIcon} from '../atoms/Icons';
import {ProfileCardProps} from './ProfileCard.interfaces';
import {useStyles} from './ProfileCard.style';

export const ProfileContent: React.FC<ProfileCardProps> = props => {
  const {user, alias, notificationCount, onViewProfile, onShowNotificationList, isMobile} = props;
  const classes = useStyles();

  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems="center"
      className={classes.profileContent}>
      <div className={classes.flex}>
        <div className={classes.avatar}>
          <Avatar
            src={user?.profilePictureURL}
            size={isMobile ? AvatarSize.LARGE : AvatarSize.MEDIUM}
            name={user?.name || alias}
            onClick={onViewProfile}
          />
        </div>
        <div className={classes.identity}>
          <Typography variant="h5" className={classes.name}>
            {user?.name || alias || ''}
          </Typography>
          <Typography variant="caption" color="textSecondary" className={classes.username}>
            @{user?.username || 'anonymous'}
          </Typography>
        </div>
      </div>
      <div className={classes.notification}>
        <IconButton aria-label="avatar" disabled={!!alias} onClick={onShowNotificationList}>
          <Badge variant="dot" invisible={notificationCount === 0}>
            <NotificationIcon />
          </Badge>
        </IconButton>
      </div>
    </Grid>
  );
};

export default ProfileContent;
