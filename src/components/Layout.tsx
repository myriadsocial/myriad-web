import React, { ReactNode, useState, useEffect } from 'react';

import Head from 'next/head';

import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import ShowIf from './common/show-if.component';
import { ExperienceComponent } from './experience/experience.component';
import UserDetail from './user/user.component';
import { Wallet } from './wallet/wallet.component';

type Props = {
  children: ReactNode;
  loggedIn: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxHeight: '100vh',
      overflow: 'auto'
    },
    experience: {
      width: 296,
      height: '100vh',
      overflowY: 'scroll',
      'scrollbar-color': '#A942E9 #171717 ',
      'scrollbar-width': 'thin !important'
    },
    user: {
      width: 360,
      marginRight: 0,
      height: '100vh',
      overflowY: 'scroll',
      'scrollbar-color': '#A942E9 #171717',
      'scrollbar-width': 'thin !important'
    },
    content: {
      flexGrow: 1
    },
    fullheight: {
      height: '100%'
    }
  })
);

const Layout = ({ children, loggedIn }: Props) => {
  const style = useStyles();

  const [isLoggedIn] = useState(loggedIn);
  const [settings, setSetting] = useState({
    focus: false,
    topic: false,
    people: true
  });

  useEffect(() => {
    if (!isLoggedIn) {
      setSetting({ ...settings, focus: !isLoggedIn });
    }
  }, [isLoggedIn]);

  const changeSetting = (key, value) => {
    setSetting({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className={style.root}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Grid container direction="row" justify="space-between" alignItems="flex-start">
        <Grid item className={style.user}>
          <Grid className={style.fullheight} container direction="row" justify="flex-start" alignItems="stretch">
            <Grid item>
              <UserDetail loggedIn={isLoggedIn} changeSetting={changeSetting} settings={settings} />
            </Grid>
            <Grid item className={style.content}>
              <ShowIf condition={isLoggedIn}>
                <Wallet />
              </ShowIf>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={5} className={style.content}>
          {children}
        </Grid>

        <Grid item className={style.experience}>
          <ShowIf condition={isLoggedIn && !settings.focus}>
            <ExperienceComponent />
          </ShowIf>
        </Grid>
      </Grid>
    </div>
  );
};

export default Layout;
