import React, { useEffect } from 'react';

import { User } from 'next-auth';
import dynamic from 'next/dynamic';

import { useTheme } from '@material-ui/core/styles';

import AppBar from '../app-bar/app-bar.component';
import { TabPanel } from '../common/tab-panel.component';
import { FriendsProvider } from '../friends/friends.context';
import { NotifProvider } from '../notifications/notif.context';

import { WithAdditionalParams } from 'next-auth/_utils';
import { useLayoutSetting } from 'src/components/Layout/layout.context';
import { useUserHook } from 'src/components/user/use-user.hook';
import { useUser } from 'src/components/user/user.context';
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
  const {
    state: { selectedSidebarMenu }
  } = useLayoutSetting();
  const { state } = useUser();
  const { getUserDetail, loadFcmToken } = useUserHook(user.address as string);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (value !== selectedSidebarMenu) {
      console.log('CHANGE_SELECTED_SIDEBAR HEH', value);

      setValue(selectedSidebarMenu);
    }
  }, [selectedSidebarMenu]);

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
      <FriendsProvider>
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
          <NotifProvider>
            <NotificationComponent />
          </NotifProvider>
        </TabPanel>
      </FriendsProvider>
    </>
  );
};

export default MobileLayoutComponent;
