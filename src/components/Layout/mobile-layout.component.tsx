import React, {useEffect} from 'react';

import dynamic from 'next/dynamic';

import {useTheme} from '@material-ui/core/styles';

import AppBar from '../app-bar/app-bar.component';
import {TabPanel} from '../common/tab-panel.component';

import {NotifProvider} from 'src/context/notif.context';
import {useLayout} from 'src/hooks/use-layout.hook';
import {SidebarTab} from 'src/interfaces/sidebar';
import {Token} from 'src/interfaces/token';

const FriendComponent = dynamic(() => import('../friends/friend.component'));
const NotificationComponent = dynamic(() => import('../notifications/notif.component'));
const TimelineComponent = dynamic(() => import('../timeline/timeline.component'));
const TopicComponent = dynamic(() => import('../topic/topic.component'));
const WalletComponent = dynamic(() => import('../topic/topic.component'));

type Props = {
  children: React.ReactNode;
  anonymous: boolean;
  userTokens: Token[];
};

const MobileLayoutComponent = ({anonymous, userTokens}: Props) => {
  const theme = useTheme();

  const {selectedSidebar, changeSelectedSidebar} = useLayout();

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (value !== selectedSidebar) {
      setValue(selectedSidebar);
    }
  }, [selectedSidebar]);

  useEffect(() => {
    changeSelectedSidebar(SidebarTab.HOME);

    return undefined;
  }, []);

  return (
    <>
      <NotifProvider>
        <AppBar />
        <TabPanel value={value} index={SidebarTab.HOME} dir={theme.direction}>
          <TimelineComponent isAnonymous={anonymous} availableTokens={userTokens} />
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
    </>
  );
};

export default MobileLayoutComponent;
