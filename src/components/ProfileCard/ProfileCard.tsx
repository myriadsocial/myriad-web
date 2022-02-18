import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/outline';

import React, {useState} from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {ProfileCardProps} from './ProfileCard.interfaces';
import {useStyles} from './ProfileCard.style';
import {ProfileContent} from './index';

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
        <ProfileContent
          user={user}
          alias={alias}
          notificationCount={notificationCount}
          onShowNotificationList={onShowNotificationList}
          onViewProfile={onViewProfile}
        />
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
          onClick={handleSignOut}>
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
