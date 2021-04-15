import React, { ReactNode } from 'react';

import { Session } from 'next-auth';
import Head from 'next/head';

import { createStyles, makeStyles } from '@material-ui/core/styles';

import { ExperienceProvider } from '../experience/experience.context';
import { TimelineProvider } from '../timeline/timeline.context';
import { MyriadAccountProvider } from '../wallet/wallet.context';
import LayoutComponent from './Layout.component';
import { LayoutSettingProvider } from './layout.context';

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

      <LayoutSettingProvider>
        <ExperienceProvider>
          <TimelineProvider>
            <LayoutComponent user={session.user}>{children}</LayoutComponent>
          </TimelineProvider>
        </ExperienceProvider>
      </LayoutSettingProvider>
    </div>
  );
};

export default Layout;
