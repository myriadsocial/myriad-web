import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

import dynamic from 'next/dynamic';
import Head from 'next/head';

import NoSsr from '@material-ui/core/NoSsr';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { TimelineProvider } from '../../context/timeline.context';
import AlertComponent from '../alert/Alert.component';
import { ConverstionProvider } from '../conversation/conversation.context';
import { ExperienceProvider } from '../experience/experience.context';

import TipAlertComponent from 'src/components/alert/TipAlert.component';
import { LayoutSettingProvider } from 'src/context/layout.context';
import { TransactionProvider } from 'src/context/transaction.context';
import { UserProvider } from 'src/context/user.context';
import { RootState } from 'src/reducers';
import { UserState } from 'src/reducers/user/reducer';
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
      overflow: 'auto'
    }
  })
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const style = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { user, anonymous } = useSelector<RootState, UserState>(state => state.userState);

  if (!user) return null;

  return (
    <div className={style.root}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <LayoutSettingProvider>
        <UserProvider>
          <NoSsr>
            <TourComponent disable={Boolean(anonymous)} userId={user.id} />
          </NoSsr>
          <TransactionProvider>
            <ExperienceProvider>
              <ConverstionProvider>
                <TimelineProvider>
                  {isMobile ? (
                    <MobileLayoutComponent user={user}>{children}</MobileLayoutComponent>
                  ) : (
                    <DektopLayoutComponent user={user}>{children}</DektopLayoutComponent>
                  )}
                </TimelineProvider>
              </ConverstionProvider>
            </ExperienceProvider>
          </TransactionProvider>
        </UserProvider>
      </LayoutSettingProvider>

      <AlertComponent />
      <TipAlertComponent />
    </div>
  );
};

export default Layout;
