import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import {Badge, Grid} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {CustomAvatar, CustomAvatarSize} from '../atoms/Avatar';
import {NotificationIcon} from '../atoms/Icons';
import {ProfileCardProps} from './ProfileCard.interfaces';
import {useStyles} from './ProfileCard.style';

export const ProfileCard: React.FC<ProfileCardProps> = props => {
  const {
    user,
    alias,
    notificationCount,
    handleSignOut,
    onViewProfile,
    onSwitchAccount,
    onShowNotificationList,
  } = props;
  const classes = useStyles();
  const [expanding, setExpanding] = useState(false);

  const handleMenuProfileHeader = () => {
    setExpanding(!expanding);
  };

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <Grid container justifyContent="space-between" alignItems="center">
          <div className={classes.flex}>
            <div className={classes.avatar}>
              <CustomAvatar
                avatar={user?.profilePictureURL || ''}
                size={CustomAvatarSize.MEDIUM}
                name={user?.name || alias || ''}
                onClick={onViewProfile}
              />
            </div>
            <div className={classes.name}>
              <Typography variant="h5">{user?.name || alias || ''}</Typography>
              <Typography variant="caption" color="textSecondary">
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
      </div>

      <div className={`${classes.content} ${expanding ? classes.open : classes.close}`}>
        {user && (
          <>
            <ListItem
              classes={{gutters: classes.gutters}}
              className={classes.hover}
              onClick={onViewProfile}>
              <ListItemText className={classes.textAlign}>
                <Typography className={classes.text} component="span">
                  View profile
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem
              classes={{gutters: classes.gutters}}
              className={classes.hover}
              onClick={onSwitchAccount}>
              <ListItemText className={classes.textAlign}>
                <Typography className={classes.text} component="span">
                  Switch account
                </Typography>
              </ListItemText>
            </ListItem>
          </>
        )}
        <ListItem
          classes={{gutters: classes.gutters}}
          className={classes.hover}
          onClick={() => handleSignOut()}>
          <ListItemText className={classes.textAlign}>
            <Typography className={classes.text} component="span">
              Log out
            </Typography>
          </ListItemText>
        </ListItem>
      </div>

      <div
        className={classes.downIconButton}
        onClick={handleMenuProfileHeader}
        role="button"
        tabIndex={0}
        aria-hidden="true">
        <SvgIcon
          color="primary"
          component={expanding ? ChevronUpIcon : ChevronDownIcon}
          viewBox="0 0 24 24"
        />
      </div>
    </div>
  );
};

export default ProfileCard;
