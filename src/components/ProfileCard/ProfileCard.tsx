import {ChevronDownIcon} from '@heroicons/react/outline';

import React from 'react';

import Button from '@material-ui/core/Button';
import SvgIcon from '@material-ui/core/SvgIcon';
import Typography from '@material-ui/core/Typography';

import {ProfileCardProps} from './ProfileCard.interfaces';
import {useStyles} from './ProfileCard.style';
import {ProfileContent} from './index';

import {NearNetworkIcon24} from 'src/components/atoms/Icons';

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

  const formatAddress = (address: string) => {
    if (address.length > 14) {
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
          <Button
            className={classes.walletButton}
            startIcon={<NearNetworkIcon24 />}
            endIcon={<SvgIcon color="primary" component={ChevronDownIcon} viewBox="0 0 24 24" />}
            size="small"
            variant="contained"
            color="inherit">
            <Typography component="span">NEAR</Typography>
          </Button>
          <Button
            size="small"
            variant="contained"
            color="default"
            className={classes.addressButton}>
            <Typography component="span">{formatAddress('aaronting.near')}</Typography>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
