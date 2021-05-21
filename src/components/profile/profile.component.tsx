import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { User } from 'next-auth';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { LoadingPage } from '../common/loading.component';
import Header from './header.component';
import { useStyles } from './profile.style';

import { WithAdditionalParams } from 'next-auth/_utils';
import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import PostComponent from 'src/components/timeline/post/post.component';
import { usePost } from 'src/components/timeline/use-post.hook';
import { Post, Comment } from 'src/interfaces/post';
import { ExtendedUserPost } from 'src/interfaces/user';

type Props = {
  user: WithAdditionalParams<User>;
  profile: ExtendedUserPost | null;
  loading: Boolean;
};

export default function ProfileTimeline({ user, profile, loading }: Props) {
  const style = useStyles();
  const [isGuest, setIsGuest] = useState<Boolean>(false);

  const {
    hasMore,
    // loadPost,
    loadMorePost,
    reply,
    loadComments
    // sortBy,
    // addPost,
    // importPost,
    // importedPost,
    // resetImportedPost,
    // error,
    // resetError
  } = usePost();

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

  const handleReply = (comment: Comment) => {
    reply(comment.postId, user, comment);
  };

  if (loading) return <LoadingPage />;
  // if (profile === null) return (
  //   <div className={style.root}>

  //   </div>
  // )

  return (
    <div className={style.root}>
      <div className={style.scroll}>
        <Header user={user} profile={profile} loading={loading} isGuest={isGuest} />

        {/* <div className="Post">
          <div
            style={{
              padding: 20,
              backgroundColor: '#424242',
              marginBottom: 10
            }}>
            <h2>POST</h2>
            <p>User: {JSON.stringify(user)}</p>
            <p>Data from params: {JSON.stringify(profile)}</p>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis explicabo perferendis ducimus mollitia voluptates ipsa
              officiis iste natus dolorum voluptatum nam, a, sint modi quisquam sed eos! Consequuntur, nesciunt quidem?
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta ipsum quas blanditiis sint magnam dolorem perferendis
              consequuntur itaque. Tenetur vitae perferendis, voluptates ad placeat accusantium, ut nulla hic odit est consectetur sequi.
              Dolore distinctio ullam commodi quos dolorum perspiciatis qui omnis repellendus mollitia magni sed eius, error quibusdam at
              accusamus!
            </p>
          </div>
        </div> */}

        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          className={style.child}
          dataLength={profile?.posts.length || 100}
          next={loadMorePost}
          hasMore={hasMore}
          loader={<LoadingPage />}>
          {profile?.posts.map((post: Post, i: number) => (
            <Grow key={i}>
              <PostComponent post={post} open={false} reply={handleReply} loadComments={loadComments} postOwner={isOwnPost(post)} />
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
