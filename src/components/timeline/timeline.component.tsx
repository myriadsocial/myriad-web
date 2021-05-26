import React, { createRef, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { User } from 'next-auth';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { LoadingPage } from '../common/loading.component';
import { useExperience } from '../experience/use-experience.hooks';
import ImportPostComponent from './ImportPost.component';
import CreatePostComponent from './create-post/create-post.component';
import FilterTimelineComponent from './filter.component';
import PostComponent from './post/post.component';
import { useTimeline } from './timeline.context';
import { useStyles } from './timeline.style';
import { usePost } from './use-post.hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import ShowIf from 'src/components/common/show-if.component';
import { useUser } from 'src/components/user/user.context';
import { Post, Comment } from 'src/interfaces/post';

type Props = {
  user: WithAdditionalParams<User>;
};

const Timeline = ({ user }: Props) => {
  const style = useStyles();
  const userId = user.address as string;

  const { state: userState } = useUser();
  const { state } = useTimeline();
  const { hasMore, loadUserPost, loadMorePost, reply, loadComments, sortBy, addPost, importPost } = usePost();

  const { experiences } = useExperience(userId);
  const scrollRoot = createRef<HTMLDivElement>();
  const isOwnPost = (post: Post) => {
    if (post.walletAddress === userId) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    loadUserPost(user);
  }, []);

  const handleScroll = useCallback(() => {
    const distance = window.scrollY;

    if (distance <= 0) return;

    window.requestAnimationFrame(() => {
      if (scrollRoot.current) {
        scrollRoot.current.scroll(0, distance);
      }
    });
  }, []);

  const nextPage = () => {
    loadMorePost(user);
  };

  const handleReply = (comment: Comment) => {
    reply(comment.postId, user, comment);
  };

  const submitPost = (text: string, tags: string[], files: File[]) => {
    addPost(text, tags, files, user);
  };

  const submitImportPost = (URL: string) => {
    importPost(URL, userId);
  };

  if (!userState.user) return null;

  console.log('TIMELINE COMPONENT LOAD');

  return (
    <div className={style.root}>
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        {
          //<SearchUserComponent title="Search Myriad" data={options} search={searchUser} onSelected={onSearchUser} />
        }
        <FilterTimelineComponent selected={state.sort} onChange={sortBy} />

        <ShowIf condition={!user.anonymous}>
          <CreatePostComponent onSubmit={submitPost} experiences={experiences} user={userState.user} />

          <ImportPostComponent onSubmit={submitImportPost} experiences={experiences} />
        </ShowIf>

        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          className={style.child}
          dataLength={state.posts.length + 100}
          next={nextPage}
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
    </div>
  );
};

export default Timeline;
