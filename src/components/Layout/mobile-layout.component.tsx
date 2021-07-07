import React, { useEffect } from 'react';

import { User } from 'next-auth';
import { useSession } from 'next-auth/client';
import dynamic from 'next/dynamic';

import { useTheme } from '@material-ui/core/styles';

import AppBar from '../app-bar/app-bar.component';
import { TabPanel } from '../common/tab-panel.component';

import { WithAdditionalParams } from 'next-auth/_utils';
import { FriendsProvider } from 'src/context/friends.context';
import { NotifProvider } from 'src/context/notif.context';
import { useUser } from 'src/context/user.context';
import { useLayout } from 'src/hooks/use-layout.hook';
import { useToken } from 'src/hooks/use-token.hook';
import { useUserHook } from 'src/hooks/use-user.hook';
import { SidebarTab } from 'src/interfaces/sidebar';

const FriendComponent = dynamic(() => import('../friends/friend.component'));
const NotificationComponent = dynamic(() => import('../notifications/notif.component'));
const TimelineComponent = dynamic(() => import('../timeline/timeline.component'));
const TopicComponent = dynamic(() => import('../topic/topic.component'));
const WalletComponent = dynamic(() => import('../topic/topic.component'));

type Props = {
  children: React.ReactNode;
  user: WithAdditionalParams<User>;
};

const MobileLayoutComponent = ({ user }: Props) => {
  const theme = useTheme();

  const { selectedSidebar, changeSelectedSidebar } = useLayout();
  const { state } = useUser();
  const { getUserDetail, loadFcmToken, setAsAnonymous } = useUserHook(user.address as string);
  const [value, setValue] = React.useState(0);
  const isAnonymous = Boolean(user.anonymous);
  const [session, sessionLoading] = useSession();
  let userId = session?.user.userId as string;

  useEffect(() => {
    if (session !== null && !sessionLoading) {
      userId = session?.user.userId as string;
    }
  }, [sessionLoading]);

  const { loadAllUserTokens, userTokens } = useToken(userId);

  useEffect(() => {
    loadAllUserTokens();
  }, []);

  useEffect(() => {
    if (value !== selectedSidebar) {
      setValue(selectedSidebar);
    }
  }, [selectedSidebar]);

  useEffect(() => {
    changeSelectedSidebar(SidebarTab.HOME);

    // TODO: this should be only loaded once on layout container
    if (!isAnonymous) {
      getUserDetail();
      loadFcmToken();
    } else {
      setAsAnonymous();
    }

    return undefined;
  }, [isAnonymous]);

  if (!state.anonymous && !state.user) return null;

  return (
    <>
      <FriendsProvider>
        <NotifProvider>
          <AppBar />
          <TabPanel value={value} index={SidebarTab.HOME} dir={theme.direction}>
            <TimelineComponent isAnonymous={isAnonymous} availableTokens={userTokens} />
          </TabPanel>
          <TabPanel value={value} index={SidebarTab.WALLET} dir={theme.direction}>
            <WalletComponent />
          </TabPanel>
          <TabPanel value={value} index={SidebarTab.TRENDING} dir={theme.direction}>
            <TopicComponent />
          </TabPanel>
          <TabPanel value={value} index={SidebarTab.FRIENDS} dir={theme.direction}>
            <FriendComponent />
          </TabPanel>
          <TabPanel value={value} index={SidebarTab.NOTIFICATION} dir={theme.direction}>
            <NotificationComponent isAnonymous={isAnonymous} />
          </TabPanel>
        </NotifProvider>
      </FriendsProvider>
    </>
  );
};

export default MobileLayoutComponent;
