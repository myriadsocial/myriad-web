import React, { useState, useEffect } from 'react';

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

import { useProfile } from 'src/components/profile/profile.context';
import { useFriendHook } from 'src/components/profile/use-friend.hook';
import { usePolkadotApi } from 'src/hooks/use-polkadot-api.hook';
import { ExtendedUser, ExtendedUserPost } from 'src/interfaces/user';

const PostList = dynamic(() => import('./post/post-list.component'));
const ImportedPostList = dynamic(() => import('./post/importedPost-list.component'));
const FriendComponent = dynamic(() => import('./user-friends.component'));

type Props = {
  isAnonymous: boolean;
  user: ExtendedUser | null;
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

export default function ProfileTimeline({ isAnonymous, user, profile, loading }: Props) {
  const {
    state: { totalFriends }
  } = useProfile();
  const { getFriends } = useFriendHook(profile);

  const { load, tokens } = usePolkadotApi();

  useEffect(() => {
    if (user) {
      load(user?.id);
    }
  }, []);

  const [value, setValue] = React.useState(0);
  const [isGuest, setIsGuest] = useState<Boolean>(false);
  const style = useStyles();
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (user && user.id === profile?.id) setIsGuest(false);
    else setIsGuest(true);
  }, [profile]);

  useEffect(() => {
    getFriends();
    setValue(0);
  }, [profile?.id]);

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
        <Header isAnonymous={isAnonymous} user={user} profile={null} loading={loading} isGuest={true} />
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
        <Header isAnonymous={isAnonymous} user={user} profile={profile} loading={loading} isGuest={isGuest} />
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
            {isGuest == false && <Tab className={style.tabItem} label={'My Wallet'} />}
          </Tabs>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <PostList profile={profile} user={user} balanceDetails={tokens.length > 0 ? tokens : []} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <ImportedPostList user={user} profile={profile} balanceDetails={tokens.length > 0 ? tokens : []} />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <FriendComponent profile={profile} />
          </TabPanel>
          {isGuest == false && (
            <TabPanel value={value} index={3} dir={theme.direction}>
              <MyWalletTabs />
            </TabPanel>
          )}
        </div>
      </div>
    </div>
  );
}
