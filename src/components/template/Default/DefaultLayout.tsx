import React, {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import {useDispatch, useSelector} from 'react-redux';

import {Session} from 'next-auth';
import dynamic from 'next/dynamic';

import {Container} from '@material-ui/core';

import useStyles from './DefaultLayout.styles';

import {withError, WithErrorProps} from 'src/components/Error';
import {MenuContainer} from 'src/components/Menu';
import {NotificationsContainer} from 'src/components/Notifications';
import {RightMenuBar} from 'src/components/RightMenuBar/RightMenuBar';
import {CookieConsent, COOKIE_CONSENT_NAME} from 'src/components/common/CookieConsent';
import {TippingProvider} from 'src/components/common/Tipping/Tipping.provider';
import ShowIf from 'src/components/common/show-if.component';
import {useUserHook} from 'src/hooks/use-user.hook';
import {NotificationProps} from 'src/interfaces/notification';
import {BlockchainPlatform, WalletTypeEnum} from 'src/interfaces/wallet';
import * as FirebaseAnalytic from 'src/lib/firebase/analytic';
import * as FirebaseMessaging from 'src/lib/firebase/messaging';
import type {RootState} from 'src/reducers';
import type {BalanceState} from 'src/reducers/balance/reducer';
import {countNewNotification, processNotification} from 'src/reducers/notification/actions';

const WalletBalancesContainer = dynamic(
  () => import('../../WalletBalance/WalletBalanceContainer'),
  {
    ssr: false,
  },
);

const ProfileCardContainer = dynamic(
  () => import('src/components/ProfileCard/ProfileCard.container'),
  {
    ssr: false,
  },
);

const SocialMediaListContainer = dynamic(
  () => import('src/components/SocialMediaList/SocialMediaList.container'),
  {
    ssr: false,
  },
);

type DefaultLayoutProps = WithErrorProps & {
  isOnProfilePage: boolean;
  children: React.ReactNode;
  logo: string;
  session: Session;
};

const Default: React.FC<DefaultLayoutProps> = props => {
  const {children, logo} = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const [cookies] = useCookies([COOKIE_CONSENT_NAME]);
  const {user, anonymous, currentWallet, updateUserFcmToken} = useUserHook();

  const {balanceDetails, loading} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (user) {
      initializeFirebase();
    }
  }, [user]);

  const processMessages = (payload?: NotificationProps) => {
    dispatch(countNewNotification());

    if (payload) {
      dispatch(processNotification(payload));
    }
  };

  const initializeFirebase = async () => {
    const token = await FirebaseMessaging.init(processMessages);

    if (!user?.deletedAt) {
      await updateUserFcmToken(token);
    }

    if (cookies[COOKIE_CONSENT_NAME]) {
      await FirebaseAnalytic.init();
    }
  };

  const handleToggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const getWallet = (blockchainPlatform?: BlockchainPlatform) => {
    switch (blockchainPlatform) {
      case BlockchainPlatform.SUBSTRATE:
        return WalletTypeEnum.POLKADOT;

      case BlockchainPlatform.NEAR:
        return WalletTypeEnum.NEAR;

      default:
        return;
    }
  };

  return (
    <TippingProvider
      loading={loading}
      anonymous={anonymous}
      balances={balanceDetails}
      sender={user}
      currentWallet={getWallet(currentWallet?.network?.blockchainPlatform)}
      currentNetwork={currentWallet?.networkId}>
      <Container maxWidth="lg" disableGutters>
        <div className={classes.root}>
          <div className={classes.firstCol}>
            <div className={classes.innerFirstColWrapper}>
              <div>
                <MenuContainer logo={logo} />
              </div>
              <div>
                <SocialMediaListContainer />
              </div>
              <div>
                <WalletBalancesContainer />
              </div>
            </div>
          </div>

          <div className={classes.secondCol}>
            <div className={classes.innerSecondColWrapper}>{children}</div>
          </div>

          <div className={classes.thirdCol}>
            <div className={classes.innerThirdColWrapper}>
              <ProfileCardContainer toggleNotification={handleToggleNotification} />

              <ShowIf condition={!showNotification}>
                <RightMenuBar />
              </ShowIf>

              <ShowIf condition={showNotification}>
                <NotificationsContainer infinite={false} size="small" />
              </ShowIf>
            </div>
          </div>
        </div>
      </Container>

      <CookieConsent />
    </TippingProvider>
  );
};

export const DefaultLayout = withError(Default);
