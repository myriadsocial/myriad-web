import React, {useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

import dynamic from 'next/dynamic';

import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import {useStyles} from '../profile.style';
import {useProfileTimeline} from '../use-profile-timeline.hook';

import {ScrollTop} from 'src/components/common/ScrollToTop.component';
import {LoadingPage} from 'src/components/common/loading.component';
import PostComponent from 'src/components/post/post.component';
import {isOwnPost} from 'src/helpers/post';
import {useModal} from 'src/hooks/use-modal.hook';
import {useTimelineHook} from 'src/hooks/use-timeline.hook';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

const TipSummaryComponent = dynamic(
  () => import('src/components/tip-summary/tip-summary.component'),
);

const SendTipModal = dynamic(() => import('src/components/common/sendtips/SendTipModal'));

type Props = {
  profile: User;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PostList({profile}: Props) {
  const style = useStyles();

  const {user, currencies: userTokens} = useSelector<RootState, UserState>(
    state => state.userState,
  );
  const {loading, posts, hasMore, nextPage} = useTimelineHook();
  const {filterOriginalPost, clearPosts} = useProfileTimeline(profile);
  const {hide, toggle, isShown} = useModal();

  useEffect(() => {
    filterOriginalPost();

    return () => {
      clearPosts();
    };
  }, []);

  if (posts.length === 0 && !loading) {
    return (
      <div style={{textAlign: 'center', padding: 16, backgroundColor: 'white', borderRadius: 8}}>
        <h2>
          {user?.id === profile.id ? 'You haven’t' : `${profile.name} hasn't`} made any Myriad posts
        </h2>
        <p>
          When {user?.id === profile.id ? 'you create' : `${profile.name} creates`} a post, it will
          show up here.
        </p>
      </div>
    );
  }

  return (
    <>
      <InfiniteScroll
        scrollableTarget="scrollable-timeline"
        className={style.child}
        dataLength={posts.length || 100}
        next={nextPage}
        hasMore={hasMore}
        loader={<LoadingPage />}>
        {posts.map((post: Post, i: number) => (
          <Grow key={i}>
            <PostComponent post={post} postOwner={isOwnPost(post, user)} tippingClicked={toggle} />
          </Grow>
        ))}

        {loading && (
          <Grid container item xs={12} justify="center">
            <CircularProgress color="secondary" />
          </Grid>
        )}

        <ScrollTop>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </InfiniteScroll>

      {user && (
        <SendTipModal
          isShown={isShown}
          hide={hide}
          availableTokens={userTokens}
          userAddress={user.id}
        />
      )}

      <TipSummaryComponent />
    </>
  );
}
