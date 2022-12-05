import React from 'react';

import {useSession} from 'next-auth/react';
import dynamic from 'next/dynamic';
import {useRouter} from 'next/router';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Skeleton} from '@material-ui/lab';

import {ProfileCardProps} from './ProfileCard.interfaces';
import {useStyles} from './ProfileCard.style';
import {ProfileContent} from './index';

import {CommonWalletIcon} from 'components/atoms/Icons';
import ShowIf from 'src/components/common/show-if.component';
import {formatAddress} from 'src/helpers/wallet';

const NetworkOption = dynamic(() => import('./NetworkOption/NetworkOption'), {
  ssr: false,
});

export const ProfileCard: React.FC<ProfileCardProps> = props => {
  const {
    user,
    anonymous = false,
    alias,
    notificationCount,
    handleConnectWeb3Wallet,
    handleSignOut,
    handleLoginOrCreateAccount,
    onViewProfile,
    onShowNotificationList,
    networks,
  } = props;

  const router = useRouter();
  const classes = useStyles();
  const nearLoading = router?.query?.loading;
  const loading = nearLoading === 'true';

  const {data: session} = useSession();

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <ProfileContent
          user={user}
          anonymous={anonymous}
          alias={alias}
          notificationCount={notificationCount}
          onShowNotificationList={onShowNotificationList}
          onViewProfile={onViewProfile}
          handleSignOut={handleSignOut}
          networks={networks}
        />
        <div className={classes.wallet}>
          <ShowIf condition={anonymous}>
            <Button variant="contained" color="primary" onClick={handleLoginOrCreateAccount}>
              Sign in or Create an Account
            </Button>
          </ShowIf>
          <ShowIf condition={!anonymous && !user?.fullAccess}>
            <Button variant="contained" color="primary" onClick={handleConnectWeb3Wallet}>
              <CommonWalletIcon viewBox="1 -3.5 20 20" />
              <span style={{paddingLeft: '5px'}}>Connect Web 3.0 wallet</span>
            </Button>
          </ShowIf>
          <ShowIf condition={!anonymous && user?.fullAccess}>
            <NetworkOption networks={networks} />
            <Typography component="div" className={classes.address}>
              <ShowIf condition={loading}>
                <Skeleton variant="text" height={20} />
              </ShowIf>
              <ShowIf condition={!loading}>{formatAddress(session)}</ShowIf>
            </Typography>
          </ShowIf>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
