import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { LoadingPage } from '../common/loading.component';
import Header from './header.component';
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
      </div>
    </div>
  );
}
