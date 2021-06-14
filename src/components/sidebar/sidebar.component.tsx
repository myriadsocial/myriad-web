import React, { useEffect } from 'react';

import dynamic from 'next/dynamic';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { People, Notifications } from '@material-ui/icons';

import ShowIf from '../common/show-if.component';
import { TabPanel } from '../common/tab-panel.component';
import { useStyles } from './sidebar.style';

import { useLayoutSetting } from 'src/context/layout.context';
import { SidebarTab } from 'src/interfaces/sidebar';

const FriendComponent = dynamic(() => import('../friends/friend.component'));
const NotificationComponent = dynamic(() => import('../notifications/notif.component'));

type SidebarProps = {
  isAnonymous: boolean;
};

export default function SidebarTabs({ isAnonymous }: SidebarProps) {
  const classes = useStyles();
  const theme = useTheme();
  const {
    state: { selectedSidebarMenu }
  } = useLayoutSetting();

  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (value !== selectedSidebarMenu) {
      setValue(selectedSidebarMenu);
    }
  }, [selectedSidebarMenu]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <ShowIf condition={false}>
        <Tabs value={value} className={classes.tabHeader} onChange={handleChange} indicatorColor="primary" textColor="primary">
          <Tab className={classes.tabItem} icon={<People />} label={<Typography>Friends</Typography>} />
          <Tab className={classes.tabItem} icon={<Notifications />} label={<Typography>Notifications</Typography>} />
        </Tabs>
      </ShowIf>
      <TabPanel value={value} index={SidebarTab.FRIENDS} dir={theme.direction}>
        <FriendComponent />
      </TabPanel>
      <TabPanel value={value} index={SidebarTab.NOTIFICATION} dir={theme.direction}>
        <NotificationComponent isAnonymous />
      </TabPanel>
    </div>
  );
}
