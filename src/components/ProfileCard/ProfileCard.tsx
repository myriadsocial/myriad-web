import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {NetworkOption} from './NetworkOption/NetworkOption';
import {ProfileCardProps} from './ProfileCard.interfaces';
import {useStyles} from './ProfileCard.style';
import {ProfileContent} from './index';

import ShowIf from 'src/components/common/show-if.component';
import {convertToPolkadotAddress} from 'src/helpers/extension';
import {WalletTypeEnum} from 'src/lib/api/ext-auth';

export const ProfileCard: React.FC<ProfileCardProps> = props => {
  const {
    user,
    anonymous = false,
    wallets,
    alias,
    notificationCount,
    handleSignOut,
    onViewProfile,
    onShowNotificationList,
    currentWallet,
    networks,
    userWalletAddress,
  } = props;
  const classes = useStyles();

  const formatAddress = (address: null | string) => {
    if (address && address.length > 14) {
      let validAddress = '';

      if (currentWallet?.type === WalletTypeEnum.POLKADOT) {
        validAddress = convertToPolkadotAddress(address, currentWallet);
      } else {
        validAddress = address;
      }

      return (
        validAddress.substring(0, 4) +
        '...' +
        validAddress.substring(validAddress.length - 4, validAddress.length)
      );
    }
    return address;
  };

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <ProfileContent
          user={user}
          anonymous={anonymous}
          currentWallet={currentWallet}
          alias={alias}
          networks={networks}
          notificationCount={notificationCount}
          onShowNotificationList={onShowNotificationList}
          onViewProfile={onViewProfile}
          handleSignOut={handleSignOut}
          userWalletAddress={userWalletAddress}
        />
        <div className={classes.wallet}>
          <ShowIf condition={anonymous}>
            <Button variant="contained" color="primary" onClick={handleSignOut}>
              Sign in to connect wallet
            </Button>
          </ShowIf>
          <ShowIf condition={!anonymous}>
            <NetworkOption currentWallet={currentWallet} wallets={wallets} networks={networks} />

            <Typography component="div" className={classes.address}>
              {formatAddress(userWalletAddress)}
            </Typography>
          </ShowIf>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
