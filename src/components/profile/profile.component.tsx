import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';

import dynamic from 'next/dynamic';

import CircularProgress from '@material-ui/core/CircularProgress';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles, Theme, createStyles, fade } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import { TabPanel } from '../common/tab-panel.component';
import Header from './header.component';
import { TippingComponent } from './myWallet/tipping.component';
import { WalletComponent } from './myWallet/wallet.component';
import { useStyles } from './profile.style';

import ShowIf from 'src/components/common/show-if.component';
import { useFriends } from 'src/context/friends.context';
import { ExtendedUser, ExtendedUserPost } from 'src/interfaces/user';

const PostList = dynamic(() => import('./post/post-list.component'));
const ImportedPostList = dynamic(() => import('./post/importedPost-list.component'));
const FriendComponent = dynamic(() => import('./user-friends.component'));

type Props = {
  user: ExtendedUser;
  profile: ExtendedUserPost | null;
  loading: Boolean;
};
// WALLET TAB
interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  }
})((props: StyledTabsProps) => <Tabs variant="fullWidth" {...props} TabIndicatorProps={{ children: <span /> }} />);

interface StyledTabProps {
  label: string;
  ariaLabel?: string;
}

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#4b4851',
      fontWeight: 'bold',
      fontSize: 18,
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
      borderRadius: 8,
      '&:focus': {
        opacity: 1,
        backgroundColor: fade('#8629e9', 0.2),
        color: '#8629e9'
      }
    }
  })
)((props: StyledTabProps) => <Tab aria-label={props.ariaLabel} disableRipple {...props} />);

const useStylesForTabs = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1
  },
  padding: {
    padding: theme.spacing(3)
  },
  demo2: {
    backgroundColor: 'transparent'
  }
}));

function MyWalletTabs() {
  const classes = useStylesForTabs();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabs value={value} onChange={handleChange} aria-label="tabs-for-wallet-or-tipping">
          <StyledTab label="Wallet" />
          <StyledTab label="Tipping" />
        </StyledTabs>
        <TabPanel value={value} index={0}>
          <WalletComponent />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TippingComponent />
        </TabPanel>
      </div>
    </div>
  );
}
// WALLET TAB

export default function ProfileTimeline({ user, profile, loading }: Props) {
  const {
    state: { totalFriends }
  } = useFriends();

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

  if (loading) {
    return (
      <div className={`${style.root} ${style.flex}`}>
        <CircularProgress color="primary" size={100} />
      </div>
    );
  }

  if (profile === null) {
    return (
      <div className={style.root}>
        <Header user={user} profile={null} loading={loading} isGuest={true} />
        <div style={{ textAlign: 'center' }}>
          <h1>This account doesn’t exist</h1>
          <Typography>Try searching for another.</Typography>
        </div>
      </div>
    );
  }

  return (
    <div className={style.root}>
      <div className={style.scroll}>
        {/* HEADER */}
        <Header user={user} profile={profile} loading={loading} isGuest={isGuest} />
        {/* TAB */}
        <div className={style.root2}>
          <ShowIf condition={isGuest === false}>
            <Tabs
              value={value}
              className={style.tabHeader}
              variant="fullWidth"
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary">
              <Tab className={style.tabItem} label={'My Post'} />
              <Tab className={style.tabItem} label={'Imported Post'} />
              <Tab className={style.tabItem} label={`Friends(${totalFriends})`} />
              <Tab className={style.tabItem} label={'My Wallet'} />
            </Tabs>
            <SwipeableViews
              className={style.tabContent}
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}>
              <TabPanel value={value} index={0} dir={theme.direction}>
                <PostList profile={profile} user={user} />
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <ImportedPostList user={user} profile={profile} />
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <FriendComponent profile={profile} />
              </TabPanel>
              <TabPanel value={value} index={3} dir={theme.direction}>
                <MyWalletTabs />
              </TabPanel>
            </SwipeableViews>
          </ShowIf>
          <ShowIf condition={isGuest === true}>
            <Tabs
              value={value}
              className={style.tabHeader}
              variant="fullWidth"
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary">
              <Tab className={style.tabItem} label={'My Post'} />
              <Tab className={style.tabItem} label={'Imported Post'} />
              <Tab className={style.tabItem} label={`Friends(${totalFriends})`} />
            </Tabs>
            <SwipeableViews
              className={style.tabContent}
              axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
              index={value}
              onChangeIndex={handleChangeIndex}>
              <TabPanel value={value} index={0} dir={theme.direction}>
                <PostList profile={profile} user={user} />
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <ImportedPostList user={user} profile={profile} />
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <FriendComponent profile={profile} />
              </TabPanel>
            </SwipeableViews>
          </ShowIf>
        </div>
      </div>
    </div>
  );
}
