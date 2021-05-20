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
import SearchUserComponent from './search-user.component';
import CreatePostComponent from './submit.component';
import { useTimeline } from './timeline.context';
import { useStyles } from './timeline.style';
import { usePost } from './use-post.hook';
import { useMyriadUser } from './use-users.hooks';

import { WithAdditionalParams } from 'next-auth/_utils';
import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import ShowIf from 'src/components/common/show-if.component';
import { Post, Comment } from 'src/interfaces/post';
import { User as MyriadUser } from 'src/interfaces/user';

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

  const { users: options, search } = useMyriadUser();

  console.log('the users are:', options);

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

  const submitImportPost = (URL: string) => {
    setIsPosting(true);
    importPost(URL, userId);
  };

  console.log('TIMELINE COMPONENT LOAD');

  const handleCloseError = () => {
    setIsPosting(false);
    resetError();
  };

  const handleCloseImported = () => {
    setIsPosting(false);
    resetImportedPost();
  };

  const searchUser = (text: string) => {
    search(text);
  };

  const onSearchUser = (users: MyriadUser) => {
    //console.log('the users are: ', users);
  };

  return (
    <div className={style.root}>
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        <SearchUserComponent title="Search Myriad" data={options} search={searchUser} onSelected={onSearchUser} />
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
