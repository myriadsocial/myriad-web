import React, { ReactNode, useState, useEffect } from 'react';
import Head from 'next/head';
import Grid from '@material-ui/core/Grid';
import UserDetail from './user/user.component';
import { Wallet } from './wallet/wallet.component';
import { ExperienceComponent } from './experience/experience.component';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import ShowIf from './common/show-if.component';

type Props = {
  children: ReactNode;
  loggedIn: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minHeight: '100vh'
    },
    experience: {
      width: 296
    },
    user: {
      width: 360,
      marginRight: 0
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
        <Grid container item className={style.user} direction="column" justify="space-around" alignItems="stretch" spacing={3}>
          <Grid item>
            <UserDetail loggedIn={isLoggedIn} changeSetting={changeSetting} settings={settings} />
          </Grid>
          <ShowIf condition={isLoggedIn}>
            <Grid item>
              <Wallet />
            </Grid>
          </ShowIf>
        </Grid>

        <Grid item lg={5}>
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
