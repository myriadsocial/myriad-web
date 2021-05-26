import React, { useEffect } from 'react';

import { User } from 'next-auth';

import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';

import ShowIf from '../common/show-if.component';
import { FriendsProvider } from '../friends/friends.context';
import SidebarComponent from '../sidebar/sidebar.component';
import UserDetail from '../user/user.component';
import { Wallet } from '../wallet/wallet.component';
import { useStyles } from './layout.style';
import { useLayout } from './use-layout.hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useUserHook } from 'src/components/user/use-user.hook';
import { firebaseCloudMessaging } from 'src/lib/firebase';

type Props = {
  children: React.ReactNode;
  user: WithAdditionalParams<User>;
};

const LayoutComponent = ({ children, user }: Props) => {
  const style = useStyles();

  const { setting, changeSetting } = useLayout();
  const { getUserDetail } = useUserHook(user);

  useEffect(() => {
    getUserDetail();

    return undefined;
  }, []);

  useEffect(() => {
    firebaseCloudMessaging.init();
  }, []);

  return (
    <>
      <Grid container direction="row" justify="space-between" alignItems="flex-start">
        <Grid item className={style.user}>
          <Grid className={style.fullheight} container direction="row" justify="flex-start" alignContent="flex-start">
            <Grid item className={!!user.anonymous ? style.grow : style.normal}>
              <UserDetail changeSetting={changeSetting} settings={setting} />
            </Grid>
            <Grid item className={style.wallet}>
              <ShowIf condition={!setting.focus && !user.anonymous}>
                <NoSsr>
                  <Wallet />
                </NoSsr>
              </ShowIf>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={5} className={style.content}>
          {children}
        </Grid>

        <FriendsProvider>
          <Grid item className={style.experience}>
            <ShowIf condition={!setting.focus}>
              <SidebarComponent />
            </ShowIf>
          </Grid>
        </FriendsProvider>
      </Grid>
    </>
  );
};

export default LayoutComponent;
