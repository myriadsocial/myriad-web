import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {NetworkOption} from './NetworkOption/NetworkOption';
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

  const formatAddress = (address?: string) => {
    if (address && address.length > 14) {
      return (
        address.substring(0, 4) + '...' + address.substring(address.length - 4, address.length)
      );
    }
    return address;
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
          handleSignOut={handleSignOut}
          onSwitchAccount={onSwitchAccount}
        />
        {/* TODO WIRING WALLET ADDRESS */}
        <div className={classes.wallet}>
          <NetworkOption />
          <Button
            size="small"
            variant="contained"
            color="default"
            className={classes.addressButton}>
            <Typography component="span">{formatAddress(user?.id)}</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
