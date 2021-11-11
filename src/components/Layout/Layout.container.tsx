import React, {ReactNode, useEffect} from 'react';
import {useSelector} from 'react-redux';

import {signout, useSession} from 'next-auth/client';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import NoSsr from '@material-ui/core/NoSsr';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import {useTheme} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import AlertComponent from '../alert/Alert.component';
import {ExperienceProvider} from '../experience/experience.context';

import TipAlertComponent from 'src/components/alert/TipAlert.component';
import {WelcomeBannerComponent} from 'src/components/welcome-banner/welcomeBanner.component';
import {LayoutSettingProvider} from 'src/context/layout.context';
import {useUserHook} from 'src/hooks/use-user.hook';
import {firebaseCloudMessaging} from 'src/lib/firebase';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';
import TourComponent from 'src/tour/Tour.component';

const DektopLayoutComponent = dynamic(() => import('./desktop-layout.component'));
const MobileLayoutComponent = dynamic(() => import('./mobile-layout.component'));

type LayoutProps = {
  children: ReactNode;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxHeight: '100vh',
      overflow: 'auto',
    },
  }),
);

const Layout: React.FC<LayoutProps> = ({children}) => {
  const style = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [, loading] = useSession();
  const {updateUserFcmToken} = useUserHook();

  const {user, anonymous} = useSelector<RootState, UserState>(state => state.userState);

  useEffect(() => {
    window.addEventListener('load', function () {
      firebaseCloudMessaging.init();
    });

    updateUserFcmToken();
  }, []);

  useEffect(() => {
    // if authenticated & user record not found
    if (!loading && !user && !anonymous) {
      signout({
        callbackUrl: '/',
        redirect: true,
      });
    }
  }, [loading, user, anonymous]);

  if (loading) return null;

  return (
    <div className={style.root}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <LayoutSettingProvider>
        <NoSsr>
          <TourComponent />
          <WelcomeBannerComponent />
        </NoSsr>
        <ExperienceProvider>
          {isMobile ? (
            <MobileLayoutComponent anonymous={anonymous}>{children}</MobileLayoutComponent>
          ) : (
            <DektopLayoutComponent anonymous={anonymous}>{children}</DektopLayoutComponent>
          )}
        </ExperienceProvider>
      </LayoutSettingProvider>

      <AlertComponent />
      <TipAlertComponent />
    </div>
  );
};

export default Layout;
