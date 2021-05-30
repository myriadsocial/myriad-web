import React, { useEffect } from 'react';

import { User } from 'next-auth';

import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';

import ShowIf from '../common/show-if.component';
import { FriendsProvider } from '../friends/friends.context';
import { NotifProvider } from '../notifications/notif.context';
import SidebarComponent from '../sidebar/sidebar.component';
import UserDetail from '../user/user.component';
import { Wallet } from '../wallet/wallet.component';
import AppBar from './app-bar.component';
import { useStyles } from './layout.style';
import { useLayout } from './use-layout.hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useUserHook } from 'src/components/user/use-user.hook';
import { useUser } from 'src/components/user/user.context';

type Props = {
  children: React.ReactNode;
  user: WithAdditionalParams<User>;
};

const LayoutComponent = ({ children, user }: Props) => {
  const style = useStyles();

  const { setting, changeSetting } = useLayout();
  const { state } = useUser();
  const { getUserDetail, loadFcmToken } = useUserHook(user.address as string);

  useEffect(() => {
    getUserDetail();

    return undefined;
  }, []);

  useEffect(() => {
    loadFcmToken();

    return undefined;
  }, []);

  if (!state.user) return null;

  return (
    <>
      <AppBar />
      <div className={style.appWrapper}>
        <div className={style.contentWrapper}>
          <Grid item className={style.user}>
            <Grid className={style.fullheight} container direction="row" justify="flex-start" alignContent="flex-start">
              <Grid item className={style.profile}>
                <UserDetail user={state.user} changeSetting={changeSetting} settings={setting} />
              </Grid>
              <Grid item className={style.wallet}>
                <FriendsProvider>
                  <ShowIf condition={!setting.focus && !user.anonymous}>
                    <NoSsr>
                      <Wallet />
                    </NoSsr>
                  </ShowIf>
                </FriendsProvider>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={style.content}>
            {children}
          </Grid>
        </div>

        <FriendsProvider>
          <NotifProvider>
            <div className={style.experience}>
              <ShowIf condition={!setting.focus}>
                <SidebarComponent />
              </ShowIf>
            </div>
          </NotifProvider>
        </FriendsProvider>
      </div>
    </>
  );
};

export default LayoutComponent;
