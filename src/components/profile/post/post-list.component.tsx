import React, {useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {useSelector} from 'react-redux';

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
import {useModal} from 'src/hooks/use-modal.hook';
import {useTimelineHook} from 'src/hooks/use-timeline.hook';
import {Post} from 'src/interfaces/post';
import {ExtendedUser} from 'src/interfaces/user';
import {RootState} from 'src/reducers';
import {UserState} from 'src/reducers/user/reducer';

type Props = {
  profile: ExtendedUser;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PostList({profile}: Props) {
  const style = useStyles();

  const {user} = useSelector<RootState, UserState>(state => state.userState);
  const {loading, posts, hasMore, nextPage} = useTimelineHook();
  const {filterOriginalPost, clearPosts} = useProfileTimeline(profile);
  const {toggle} = useModal();

  useEffect(() => {
    filterOriginalPost();

    return () => {
      clearPosts();
    };
  }, []);

  const isOwnPost = (post: Post) => {
    if (user && post.platformUser?.platform_account_id === user.id) {
      return true;
    }
    return false;
  };

  if (posts.length === 0 && !loading) {
    return (
      <div style={{textAlign: 'center', padding: 16, backgroundColor: 'white', borderRadius: 8}}>
        <h2>{user?.id === profile.id ? 'You' : profile.name} haven’t any post yet</h2>
        <p>
          When {user?.id === profile.id ? 'you' : profile.name} post in them, it will show up here.
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
            <PostComponent post={post} postOwner={isOwnPost(post)} tippingClicked={toggle} />
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
    </>
  );
}
