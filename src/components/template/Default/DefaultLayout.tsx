import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import dynamic from 'next/dynamic';

import {Container} from '@material-ui/core';

import useStyles from './DefaultLayout.styles';

import {withError, WithErrorProps} from 'src/components/Error';
import {MenuContainer} from 'src/components/Menu';
import {NotificationsContainer} from 'src/components/Notifications';
import {RightMenuBar} from 'src/components/RightMenuBar/RightMenuBar';
import {SocialMediaListContainer} from 'src/components/SocialMediaList';
import {ConfirmProvider} from 'src/components/common/Confirm/Confirm.provider';
import ShowIf from 'src/components/common/show-if.component';
import {useUserHook} from 'src/hooks/use-user.hook';
import {NotificationProps} from 'src/interfaces/notification';
import {firebaseApp, firebaseAnalytics, firebaseCloudMessaging} from 'src/lib/firebase';
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

type DefaultLayoutProps = WithErrorProps & {
  isOnProfilePage: boolean;
  children: React.ReactNode;
};

const Default: React.FC<DefaultLayoutProps> = props => {
  const {children} = props;

  const classes = useStyles();
  const dispatch = useDispatch();

  const {updateUserFcmToken} = useUserHook();

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    initializeFirebase();
  }, []);

  const initializeFirebase = async () => {
    await firebaseApp.init();
    await firebaseAnalytics.init();
    await initializeMessaging();
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

  return (
    <ConfirmProvider>
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
    </ConfirmProvider>
  );
};

export const DefaultLayout = withError(Default);
