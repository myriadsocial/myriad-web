import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import { useTheme } from '@material-ui/core/styles';

import AppBar from '../app-bar/app-bar.component';
import { TabPanel } from '../common/tab-panel.component';

import { FriendsProvider } from 'src/context/friends.context';
import { NotifProvider } from 'src/context/notif.context';
import { useLayout } from 'src/hooks/use-layout.hook';
import { useToken } from 'src/hooks/use-token.hook';
import { useUserHook } from 'src/hooks/use-user.hook';
import { SidebarTab } from 'src/interfaces/sidebar';
import { ExtendedUser } from 'src/interfaces/user';

const FriendComponent = dynamic(() => import('../friends/friend.component'));
const NotificationComponent = dynamic(() => import('../notifications/notif.component'));
const TimelineComponent = dynamic(() => import('../timeline/timeline.component'));
const TopicComponent = dynamic(() => import('../topic/topic.component'));
const WalletComponent = dynamic(() => import('../topic/topic.component'));

type Props = {
  children: React.ReactNode;
  user: ExtendedUser;
};

const MobileLayoutComponent = ({ user }: Props) => {
  const theme = useTheme();

  const { selectedSidebar, changeSelectedSidebar } = useLayout();
  const { loadFcmToken } = useUserHook(user.id);
  const { loadAllUserTokens, userTokens } = useToken(user.id);
  const [value, setValue] = React.useState(0);

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
    if (!user.anonymous) {
      loadFcmToken();
    }
    return undefined;
  }, []);

  return (
    <>
      <FriendsProvider>
        <NotifProvider>
          <AppBar />
          <TabPanel value={value} index={SidebarTab.HOME} dir={theme.direction}>
            <TimelineComponent isAnonymous={user.anonymous} availableTokens={userTokens} />
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
            <NotificationComponent isAnonymous={user.anonymous} />
          </TabPanel>
        </NotifProvider>
      </FriendsProvider>
    </>
  );
};

export default MobileLayoutComponent;
