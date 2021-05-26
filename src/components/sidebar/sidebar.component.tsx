import React from 'react';
import SwipeableViews from 'react-swipeable-views';

import dynamic from 'next/dynamic';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import { Language, People, Notifications } from '@material-ui/icons';

import { TabPanel } from '../common/tab-panel.component';
import { useStyles } from './sidebar.style';

const TopicComponent = dynamic(() => import('../topic/topic.component'));
const FriendComponent = dynamic(() => import('../friends/friend.component'));

export default function SidebarTabs() {
  const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <Tabs value={value} className={classes.tabHeader} onChange={handleChange} indicatorColor="primary" textColor="primary">
        <Tab className={classes.tabItem} icon={<Language />} label={<Typography>World Wide</Typography>} />
        <Tab className={classes.tabItem} icon={<People />} label={<Typography>Friends</Typography>} />
        <Tab className={classes.tabItem} icon={<Notifications />} label={<Typography>Notifications</Typography>} />
      </Tabs>
      <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
        <TabPanel value={value} index={0} dir={theme.direction}>
          <TopicComponent />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <FriendComponent />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <TopicComponent />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
