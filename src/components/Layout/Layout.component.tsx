import React, { useEffect } from 'react';

import { User } from 'next-auth';

import ShowIf from '../common/show-if.component';
import { FriendsProvider } from '../friends/friends.context';
import { NotifProvider } from '../notifications/notif.context';
import SidebarComponent from '../sidebar/sidebar.component';
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

  const { setting } = useLayout();
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
        <div className={style.contentWrapper}>{children}</div>

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
