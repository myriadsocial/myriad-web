import React, {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import {useDispatch, useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import {Container} from '@material-ui/core';

import useStyles from './DefaultLayout.styles';

import {withError, WithErrorProps} from 'src/components/Error';
import {MenuContainer} from 'src/components/Menu';
import {NotificationsContainer} from 'src/components/Notifications';
import {RightMenuBar} from 'src/components/RightMenuBar/RightMenuBar';
import {SocialMediaListContainer} from 'src/components/SocialMediaList';
import {CookieConsent, COOKIE_CONSENT_NAME} from 'src/components/common/CookieConsent';
import {TippingProvider} from 'src/components/common/Tipping/Tipping.provider';
import ShowIf from 'src/components/common/show-if.component';
import {useUserHook} from 'src/hooks/use-user.hook';
import {NotificationProps} from 'src/interfaces/notification';
import {WalletTypeEnum} from 'src/lib/api/ext-auth';
import {firebaseApp, firebaseAnalytics, firebaseCloudMessaging} from 'src/lib/firebase';
import {RootState} from 'src/reducers';
import {BalanceState} from 'src/reducers/balance/reducer';
import {countNewNotification, processNotification} from 'src/reducers/notification/actions';
import {UserState} from 'src/reducers/user/reducer';

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

type DefaultLayoutProps = WithErrorProps & {
  isOnProfilePage: boolean;
  children: React.ReactNode;
};

const Default: React.FC<DefaultLayoutProps> = props => {
  const {children} = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const [cookies] = useCookies([COOKIE_CONSENT_NAME]);
  const {updateUserFcmToken} = useUserHook();

  const {user, anonymous, currentWallet} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {balanceDetails, loading} = useSelector<RootState, BalanceState>(
    state => state.balanceState,
  );

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    initializeFirebase();
  }, []);

  const initializeFirebase = async () => {
    await firebaseApp.init();

    await initializeMessaging();

    if (cookies[COOKIE_CONSENT_NAME]) {
      await firebaseAnalytics.init();
    }
  };

  const initializeMessaging = async () => {
    await firebaseCloudMessaging.init();

    await updateUserFcmToken();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', payload => {
        if (payload?.data?.body) {
          try {
            const notification: NotificationProps = JSON.parse(payload.data.body);

            dispatch(processNotification(notification));
            // eslint-disable-next-line no-empty
          } catch (error) {}
        }

        dispatch(countNewNotification());
      });
    }

    firebaseCloudMessaging.onMessageListener(payload => {
      if (payload?.data?.body) {
        try {
          const notification: NotificationProps = JSON.parse(payload.data.body);

          dispatch(processNotification(notification));
          // eslint-disable-next-line no-empty
        } catch (error) {}
      }

      dispatch(countNewNotification());
    });
  };

  const handleToggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const getWallet = (blockchainPlatform?: string) => {
    switch (blockchainPlatform) {
      case 'substrate':
        return WalletTypeEnum.POLKADOT;

      case 'near':
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
                <MenuContainer />
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
