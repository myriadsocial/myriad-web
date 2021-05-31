import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';

import dynamic from 'next/dynamic';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

import { LoadingPage } from '../common/loading.component';
import { TabPanel } from '../common/tab-panel.component';
import Header from './header.component';
import { useStyles } from './profile.style';

import { User, ExtendedUserPost } from 'src/interfaces/user';

const PostList = dynamic(() => import('./post-list.component'));

type Props = {
  user: User;
  profile: ExtendedUserPost | null;
  loading: Boolean;
};

export default function ProfileTimeline({ user, profile, loading }: Props) {
  const [value, setValue] = React.useState(0);
  const [isGuest, setIsGuest] = useState<Boolean>(false);
  const style = useStyles();
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  useEffect(() => {
    if (user.id === profile?.id) setIsGuest(false);
    else setIsGuest(true);
  }, [profile]);

  if (loading) return <LoadingPage />;

  if (profile === null)
    return (
      <div className={style.root}>
        <Header user={user} profile={null} loading={loading} isGuest={false} />
        <div style={{ textAlign: 'center' }}>
          <h1>This account doesn’t exist</h1>
          <Typography>Try searching for another.</Typography>
        </div>
      </div>
    );

  return (
    <div className={style.root}>
      <div className={style.scroll}>
        {/* HEADER */}
        <Header user={user} profile={profile} loading={loading} isGuest={isGuest} />

        {/* TAB */}
        <div className={style.root2}>
          <Tabs
            value={value}
            className={style.tabHeader}
            variant="fullWidth"
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary">
            <Tab className={style.tabItem} label={'My Post'} />
            <Tab className={style.tabItem} label={'Imported Post'} />
            <Tab className={style.tabItem} label={'Friends(0)'} />
            <Tab className={style.tabItem} label={'My Wallet'} />
            <Tab className={style.tabItem} label={'My Experience'} />
          </Tabs>
          <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
            <TabPanel value={value} index={0} dir={theme.direction}>
              <PostList profile={profile} user={user} />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <h1>imported post</h1>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <h1>Friends</h1>
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
              <h1>My wallet</h1>
            </TabPanel>
            <TabPanel value={value} index={4} dir={theme.direction}>
              <h1>My experience</h1>
            </TabPanel>
          </SwipeableViews>
        </div>
      </div>
    </div>
  );
}
