import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';

import dynamic from 'next/dynamic';

import {Container} from '@material-ui/core';

import {MenuContainer} from '../../Menu/MenuContainer';
import {ProfileHeaderContainer} from '../../ProfileHeader/ProfileHeaderContainer';
import {RightMenuBar} from '../../RightMenuBar/RightMenuBar';
import {SocialMediaListContainer} from '../../SocialMediaList/SocialMediaListContainer';
import useStyles from './DefaultLayout.styles';

import {withError, WithErrorProps} from 'src/components/Error';
import {NotificationsContainer} from 'src/components/Notifications/Notifications.container';
import ShowIf from 'src/components/common/show-if.component';
import {useUserHook} from 'src/hooks/use-user.hook';
import {firebaseApp, firebaseAnalytics, firebaseCloudMessaging} from 'src/lib/firebase';
import {countNewNotification} from 'src/reducers/notification/actions';

const WalletBalancesContainer = dynamic(
  () => import('../../WalletBalance/WalletBalanceContainer'),
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
      navigator.serviceWorker.addEventListener('message', () => {
        console.log('addEventListener');
        dispatch(countNewNotification());
      });
    }

    firebaseCloudMessaging.onMessageListener(payload => {
      console.log('onMessageListener', payload);
      dispatch(countNewNotification());
    });
  };

  const handleToggleNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
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
            <div>
              <ProfileHeaderContainer toggleNotification={handleToggleNotification} />
            </div>
            <div>
              <ShowIf condition={!showNotification}>
                <RightMenuBar />
              </ShowIf>
              <ShowIf condition={showNotification}>
                <NotificationsContainer infinite={false} size="small" />
              </ShowIf>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export const DefaultLayout = withError(Default);
