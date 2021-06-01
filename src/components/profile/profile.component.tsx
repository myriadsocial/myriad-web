import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';

import dynamic from 'next/dynamic';

import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles, Theme, createStyles, fade } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import { LoadingPage } from '../common/loading.component';
import { TabPanel } from '../common/tab-panel.component';
import Header from './header.component';
import { WalletComponent } from './myWallet/wallet.component';
import { useStyles } from './profile.style';

import { useFriends } from 'src/components/friends/friends.context';
import { ExtendedUser, ExtendedUserPost } from 'src/interfaces/user';

const PostList = dynamic(() => import('./post-list.component'));
const FriendComponent = dynamic(() => import('./user-friends.component'));

type Props = {
  user: ExtendedUser;
  profile: ExtendedUserPost | null;
  loading: Boolean;
};

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
})((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

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

//interface TabPanelProps {
//children?: React.ReactNode;
//index: any;
//value: any;
//ariaLabel?: string;
//}

//function TabPanel(props: TabPanelProps) {
//const { children, value, index, ariaLabel, ...other } = props;

//return (
//<div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
//{value === index && <div>{children}</div>}
//</div>
//);
//}

function CustomizedTabs() {
  const classes = useStylesForTabs();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className={classes.demo2}>
        <StyledTabs value={value} onChange={handleChange} aria-label="styled tabs example">
          <StyledTab label="Wallet" />
          <StyledTab label="Tipping" />
        </StyledTabs>
        <TabPanel value={value} index={0}>
          <WalletComponent />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
      </div>
    </div>
  );
}

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
            <Tab className={style.tabItem} label={`Friends(${totalFriends})`} />
            <Tab className={style.tabItem} label={'My Wallet'} />
            <Tab className={style.tabItem} label={'My Experience'} />
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
              <h1>imported post</h1>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <FriendComponent />
            </TabPanel>
            <TabPanel value={value} index={3} dir={theme.direction}>
              {
                //<h1>My wallet</h1>
              }
              <CustomizedTabs />
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
