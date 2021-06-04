import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { useStyles } from '../profile.style';

import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import { LoadingPage } from 'src/components/common/loading.component';
import PostComponent from 'src/components/timeline/post/post.component';
import { usePost } from 'src/hooks/use-post.hook';
import { Post } from 'src/interfaces/post';
import { User, ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: User;
  profile: ExtendedUserPost;
};

export default function PostList({ user, profile }: Props) {
  const style = useStyles();
  const { hasMore, loadMorePost } = usePost(user);

  const isOwnPost = (post: Post) => {
    if (post.walletAddress === user.id) {
      return true;
    }
    return false;
  };

  if (profile.posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 16, backgroundColor: 'white', borderRadius: 8 }}>
        <h2>You haven’t any post yet</h2>
        <p>When you post in them, it will show up here.</p>
      </div>
    );
  }

  return (
    <>
      <InfiniteScroll
        scrollableTarget="scrollable-timeline"
        className={style.child}
        dataLength={profile.posts.length || 100}
        next={loadMorePost}
        hasMore={hasMore}
        loader={<LoadingPage />}>
        {profile.posts.map((post: Post, i: number) => (
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
    </>
  );
}
