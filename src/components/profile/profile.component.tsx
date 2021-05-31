import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { makeStyles, withStyles, Theme, createStyles, fade } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { LoadingPage } from '../common/loading.component';
import Header from './header.component';
import { WalletComponent } from './myWallet/wallet.component';
import { useStyles } from './profile.style';

import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import PostComponent from 'src/components/timeline/post/post.component';
import { usePost } from 'src/components/timeline/use-post.hook';
import { Post } from 'src/interfaces/post';
import { User, ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: User;
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

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  ariaLabel?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ariaLabel, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

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
          <StyledTab ariaLabel="wallet-details" label="Wallet" />
          <StyledTab ariaLabel="tipping-details" label="Tipping" />
        </StyledTabs>
        <TabPanel ariaLabel="wallet-details" value={value} index={0}>
          <WalletComponent />
        </TabPanel>
        <TabPanel ariaLabel="tipping-details" value={value} index={1}>
          Item Two
        </TabPanel>
      </div>
    </div>
  );
}

export default function ProfileTimeline({ user, profile, loading }: Props) {
  const style = useStyles();
  const [isGuest, setIsGuest] = useState<Boolean>(false);

  const { hasMore, loadMorePost } = usePost(user);

  const isOwnPost = (post: Post) => {
    if (post.walletAddress === user.id) {
      return true;
    }
    return false;
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

        {/* POST */}
        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          className={style.child}
          dataLength={profile?.posts.length || 100}
          next={loadMorePost}
          hasMore={hasMore}
          loader={<LoadingPage />}>
          {profile?.posts.map((post: Post, i: number) => (
            <Grow key={i}>
              <PostComponent post={post} open={false} postOwner={isOwnPost(post)} />
            </Grow>
          ))}

          <ScrollTop>
            <Fab color="secondary" size="small" aria-label="scroll back to top">
              <KeyboardArrowUpIcon />
            </Fab>
          </ScrollTop>
        </InfiniteScroll>

        <CustomizedTabs />
      </div>
    </div>
  );
}
