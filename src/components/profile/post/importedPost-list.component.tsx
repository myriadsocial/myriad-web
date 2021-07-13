import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { LoadingPage } from '../../common/loading.component';
import { useStyles } from '../profile.style';

import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import PostComponent from 'src/components/post/post.component';
import { useProfile } from 'src/components/profile/profile.context';
import { useProfileHook } from 'src/components/profile/use-profile.hook';
import { useTimelineHook } from 'src/hooks/use-timeline.hook';
import { BalanceDetail } from 'src/interfaces/balance';
import { Post } from 'src/interfaces/post';
import { Token } from 'src/interfaces/token';
import { User, ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: User | null;
  profile: ExtendedUserPost;
  balanceDetails: BalanceDetail[];
  availableTokens: Token[];
};

export default function ImportedPostList({ user, profile, balanceDetails, availableTokens }: Props) {
  const style = useStyles();
  const { hasMore, nextPosts } = useTimelineHook();
  const { state: profileState } = useProfile();
  const { loadImportedPost, isLoading } = useProfileHook(profile.id);
  const posts = profileState.importedPost;
  const isOwnPost = (post: Post) => {
    if (user && post.walletAddress === user.id) return true;
    return false;
  };

  useEffect(() => {
    loadImportedPost();
  }, []);

  if (isLoading === false && posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 16, backgroundColor: 'white', borderRadius: 8 }}>
        <h2>You haven’t imported any post yet</h2>
        <p>When you import post in them, it will show up here.</p>
      </div>
    );
  }

  return (
    <>
      <InfiniteScroll
        scrollableTarget="scrollable-timeline"
        className={style.child}
        dataLength={posts.length || 100}
        next={nextPosts}
        hasMore={hasMore}
        loader={<LoadingPage />}>
        {posts.map((post: Post, i: number) => (
          <Grow key={i}>
            <PostComponent post={post} postOwner={isOwnPost(post)} balanceDetails={balanceDetails} availableTokens={availableTokens} />
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
