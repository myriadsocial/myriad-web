import React, {useEffect} from 'react';

import dynamic from 'next/dynamic';

import {useTheme} from '@material-ui/core/styles';

import AppBar from '../app-bar/app-bar.component';
import {TabPanel} from '../common/tab-panel.component';

import {useLayout} from 'src/hooks/use-layout.hook';
import {SidebarTab} from 'src/interfaces/sidebar';

const FriendComponent = dynamic(() => import('../friends/friend.component'));
const NotificationComponent = dynamic(() => import('../notifications/notif.component'));
const TimelineComponent = dynamic(() => import('../timeline/timeline.component'));
const TopicComponent = dynamic(() => import('../topic/topic.component'));
const WalletComponent = dynamic(() => import('../topic/topic.component'));

type Props = {
  children: React.ReactNode;
  anonymous: boolean;
};

const MobileLayoutComponent: React.FC<Props> = ({anonymous}: Props) => {
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
      <AppBar />
      <TabPanel value={value} index={SidebarTab.HOME} dir={theme.direction}>
        <TimelineComponent isAnonymous={anonymous} />
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
    </>
  );
};

export default MobileLayoutComponent;
