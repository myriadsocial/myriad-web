import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { LoadingPage } from '../common/loading.component';
import { useStyles } from './profile.style';

import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import PostComponent from 'src/components/timeline/post/post.component';
import { usePost } from 'src/components/timeline/use-post.hook';
import { Post } from 'src/interfaces/post';
import { User, ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: User;
  profile: ExtendedUserPost | null;
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

  return (
    <>
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
    </>
  );
}
