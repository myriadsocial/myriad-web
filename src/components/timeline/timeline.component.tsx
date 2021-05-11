import React, { createRef, useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { User } from 'next-auth';
import { useSession } from 'next-auth/client';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import Snackbar from '@material-ui/core/Snackbar';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

import { LoadingPage } from '../common/loading.component';
import { useExperience } from '../experience/use-experience.hooks';
import ImportPostComponent from './ImportPost.component';
import FilterTimelineComponent from './filter.component';
import PostComponent from './post/post.component';
import CreatePostComponent from './submit.component';
import { useTimeline } from './timeline.context';
import { useStyles } from './timeline.style';
import { usePost } from './use-post.hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import ShowIf from 'src/components/common/show-if.component';
import { Post, Comment } from 'src/interfaces/post';

type Props = {
  user: WithAdditionalParams<User>;
};

const Timeline = ({ user }: Props) => {
  const style = useStyles();

  const { state } = useTimeline();
  const {
    hasMore,
    loadPost,
    loadMorePost,
    reply,
    loadComments,
    sortBy,
    addPost,
    importPost,
    importedPost,
    resetImportedPost,
    error,
    resetError
  } = usePost();

  const [session] = useSession();
  const userId = session?.user.address as string;
  const isOwnPost = (post: Post) => {
    if (post.walletAddress === userId) {
      return true;
    }
    return false;
  };
  const { experiences } = useExperience(userId);

  const scrollRoot = createRef<HTMLDivElement>();
  const [isPosting, setIsPosting] = useState(true);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    if (state.filter.tags.length > 0 || state.filter.people.length > 0) {
      loadPost(user);
    }
  }, [state.filter, state.sort, state.page]);

  const handleScroll = useCallback(() => {
    const distance = window.scrollY;

    if (distance <= 0) return;

    window.requestAnimationFrame(() => {
      if (scrollRoot.current) {
        scrollRoot.current.scroll(0, distance);
      }
    });
  }, []);

  const handleReply = (comment: Comment) => {
    reply(comment.postId, user, comment);
  };

  const submitPost = (text: string, tags: string[], files: File[]) => {
    addPost(text, tags, files, user);
  };

  const submitImportPost = (URL: string, experienceId: string) => {
    setIsPosting(true);
    importPost(URL, experienceId);
  };

  console.log('user', user);
  console.log('TIMELINE COMPONENT LOAD');

  const handleCloseError = () => {
    setIsPosting(false);
    resetError();
  };

  const handleCloseImported = () => {
    setIsPosting(false);
    resetImportedPost();
  };

  return (
    <div className={style.root}>
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        <FilterTimelineComponent selected={state.sort} onChange={sortBy} />

        <ShowIf condition={!user.anonymous}>
          <CreatePostComponent onSubmit={submitPost} experiences={experiences} />

          <ImportPostComponent onSubmit={submitImportPost} experiences={experiences} />
        </ShowIf>

        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          className={style.child}
          dataLength={state.posts.length + 100}
          next={loadMorePost}
          hasMore={hasMore}
          loader={<LoadingPage />}>
          {state.posts.map((post: Post, i: number) => (
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
      <div id="fb-root" />

      <Snackbar open={isPosting && importedPost !== null} autoHideDuration={6000} onClose={handleCloseImported}>
        <Alert severity="success">
          <AlertTitle>Success!</AlertTitle>
          Post successfully imported
        </Alert>
      </Snackbar>

      <Snackbar open={isPosting && error !== null} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert severity="error">
          <AlertTitle>Error!</AlertTitle>
          Post already imported
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Timeline;
