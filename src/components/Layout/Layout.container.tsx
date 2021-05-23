import React, { ReactNode } from 'react';

import { Session } from 'next-auth';
import Head from 'next/head';

import NoSsr from '@material-ui/core/NoSsr';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import AlertComponent from '../alert/Alert.component';
import { ConverstionProvider } from '../conversation/conversation.context';
import { ExperienceProvider } from '../experience/experience.context';
import { TimelineProvider } from '../timeline/timeline.context';
import { TransactionProvider } from '../tippingJar/transaction.context';
import { UserProvider } from '../user/user.context';
import LayoutComponent from './Layout.component';
import { LayoutSettingProvider } from './layout.context';

import TourComponent from 'src/tour/Tour.component';

type Props = {
  session: Session | null;
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

const Layout = ({ children, session }: Props) => {
  const style = useStyles();

  if (!session) return null;

  return (
    <div className={style.root}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <UserProvider>
        <NoSsr>
          <TourComponent />
        </NoSsr>
        <LayoutSettingProvider>
          <TransactionProvider>
            <ExperienceProvider>
              <ConverstionProvider>
                <TimelineProvider>
                  <LayoutComponent user={session.user}>{children}</LayoutComponent>
                </TimelineProvider>
              </ConverstionProvider>
            </ExperienceProvider>
          </TransactionProvider>
        </LayoutSettingProvider>

        <AlertComponent />
      </UserProvider>
    </div>
  );
};

export default Layout;
