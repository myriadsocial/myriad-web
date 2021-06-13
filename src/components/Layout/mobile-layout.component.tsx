import React, { useEffect } from 'react';

import { User } from 'next-auth';
import dynamic from 'next/dynamic';

import { useTheme } from '@material-ui/core/styles';

import AppBar from '../app-bar/app-bar.component';
import { TabPanel } from '../common/tab-panel.component';

import { WithAdditionalParams } from 'next-auth/_utils';
import { FriendsProvider } from 'src/context/friends.context';
import { NotifProvider } from 'src/context/notif.context';
import { useUser } from 'src/context/user.context';
import { useLayout } from 'src/hooks/use-layout.hook';
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

const MobileLayoutComponent = ({ children, user }: Props) => {
  const theme = useTheme();

  const { selectedSidebar, changeSelectedSidebar } = useLayout();
  const { state } = useUser();
  const { getUserDetail, loadFcmToken } = useUserHook(user.address as string);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (value !== selectedSidebar) {
      setValue(selectedSidebar);
    }
  }, [selectedSidebar]);

  useEffect(() => {
    // TODO: this should be only loaded once on layout container
    getUserDetail();
    loadFcmToken();

    changeSelectedSidebar(SidebarTab.HOME);
    return undefined;
  }, []);

  if (!state.user) return null;

  return (
    <>
      <FriendsProvider>
        <NotifProvider>
          <AppBar />
          <TabPanel value={value} index={SidebarTab.HOME} dir={theme.direction}>
            <TimelineComponent user={state.user} />
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
            <NotificationComponent />
          </TabPanel>
        </NotifProvider>
      </FriendsProvider>
    </>
  );
};

export default MobileLayoutComponent;
