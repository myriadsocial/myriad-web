import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import dynamic from 'next/dynamic';

import CircularProgress from '@material-ui/core/CircularProgress';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {makeStyles, withStyles, Theme, createStyles, fade} from '@material-ui/core/styles';
import {useTheme} from '@material-ui/core/styles';

import {TabPanel} from '../common/tab-panel.component';
import Header from './header/header.component';
import {TippingComponent} from './myWallet/tipping/tipping.component';
import {WalletComponent} from './myWallet/wallet/wallet.component';
import {useStyles} from './profile.style';

import {ExtendedUser} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {fetchProfileFriend} from 'src/reducers/profile/actions';
import {ProfileState} from 'src/reducers/profile/reducer';
import {UserState} from 'src/reducers/user/reducer';

const PostList = dynamic(() => import('./post/post-list.component'));
const ImportedPostList = dynamic(() => import('./post/importedPost-list.component'));
const FriendComponent = dynamic(() => import('./friend/user-friends.component'));

type Props = {
  profile: ExtendedUser;
  loading: boolean;
};
// WALLET TAB
interface StyledTabsProps {
  value: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

//TODO: move to common component
const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
})((props: StyledTabsProps) => (
  <Tabs variant="fullWidth" {...props} TabIndicatorProps={{children: <span />}} />
));

interface StyledTabProps {
  label: string;
  ariaLabel?: string;
}

//TODO: move to common component
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
        color: '#8629e9',
      },
    },
  }),
)((props: StyledTabProps) => <Tab aria-label={props.ariaLabel} disableRipple {...props} />);

const useStylesForTabs = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  padding: {
    padding: theme.spacing(3),
  },
  demo2: {
    backgroundColor: 'transparent',
  },
}));

// TODO: move to single component file
function MyWalletTabs() {
  const classes = useStylesForTabs();
  const [value, setValue] = React.useState(0);

  // eslint-disable-next-line @typescript-eslint/ban-types
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ProfileTimeline({profile, loading}: Props) {
  const style = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const {anonymous, user} = useSelector<RootState, UserState>(state => state.userState);
  const {totalFriends} = useSelector<RootState, ProfileState>(state => state.profileState);
  const [isWalletTabActivated, setIsWalletTabActivated] = useState(false);
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    const walletDetailsPointer = JSON.parse(window.localStorage.getItem('walletTabIdx') ?? '0');
    if (walletDetailsPointer === 1) {
      setIsWalletTabActivated(true);
    }
  }, []);

  useEffect(() => {
    if (isWalletTabActivated) {
      setSelectedTab(3);
      window.localStorage.setItem('walletTabIdx', '0');
    } else {
      setSelectedTab(0);
    }
  }, [isWalletTabActivated]);

  useEffect(() => {
    dispatch(fetchProfileFriend(profile.id));

    return undefined;
  }, [profile.id]);

  useEffect(() => {
    if (user) {
      setIsGuest(user.id !== profile.id);
    }
  }, [user]);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleChange = (event: React.ChangeEvent<{}>, tab: number) => {
    setSelectedTab(tab);
  };

  if (loading) {
    return (
      <div className={`${style.root} ${style.flex}`}>
        <CircularProgress color="primary" size={100} />
      </div>
    );
  }

  return (
    <div className={style.root}>
      <div className={style.scroll}>
        {/* HEADER */}
        <Header isAnonymous={anonymous} profile={profile} loading={loading} isGuest={isGuest} />
        {/* TAB */}
        <div className={style.root2}>
          <Tabs
            value={selectedTab}
            className={style.tabHeader}
            variant="fullWidth"
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary">
            <Tab className={style.tabItem} label={isGuest ? 'Post' : 'My Post'} />
            <Tab className={style.tabItem} label={'Imported Post'} />
            <Tab className={style.tabItem} label={`Friends(${totalFriends})`} />
            {isGuest == false && <Tab className={style.tabItem} label={'My Wallet'} />}
          </Tabs>
          <TabPanel value={selectedTab} index={0} dir={theme.direction}>
            <PostList profile={profile} />
          </TabPanel>
          <TabPanel value={selectedTab} index={1} dir={theme.direction}>
            <ImportedPostList profile={profile} />
          </TabPanel>
          <TabPanel value={selectedTab} index={2} dir={theme.direction}>
            <FriendComponent profile={profile} />
          </TabPanel>
          {isGuest == false && (
            <TabPanel value={selectedTab} index={3} dir={theme.direction}>
              <MyWalletTabs />
            </TabPanel>
          )}
        </div>
      </div>
    </div>
  );
}
