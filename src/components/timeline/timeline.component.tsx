import React, { createRef, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { User } from 'next-auth';

import Fab from '@material-ui/core/Fab';
import Grow from '@material-ui/core/Grow';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import { LoadingPage } from '../common/loading.component';
import ImportPostComponent from './ImportPost.component';
import FilterTimelineComponent from './filter.component';
import PostComponent from './post/post.component';
import CreatePostComponent from './submit.component';
import { useTimeline } from './timeline.context';
import { useStyles } from './timeline.style';
import { usePost } from './use-post.hook';

import { WithAdditionalParams } from 'next-auth/_utils';
import { ScrollTop } from 'src/components/common/ScrollToTop.component';
import { Post, Comment } from 'src/interfaces/post';

type Props = {
  user: WithAdditionalParams<User>;
};

const Timeline = ({ user }: Props) => {
  const style = useStyles();

  const { state } = useTimeline();
  const { hasMore, loadPost, loadMorePost, reply, loadComments, sortBy, addPost, importPost } = usePost();
  const scrollRoot = createRef<HTMLDivElement>();

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
    reply(comment.postId, comment);
  };

  const submitPost = (text: string, tags: string[], files: File[]) => {
    addPost(text, tags, files, user);
  };

  const submitImportPost = (URL: string) => {
    importPost(URL);
  };

  console.log('TIMELINE COMPONENT LOAD');

  return (
    <div className={style.root}>
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        <FilterTimelineComponent selected={state.sort} onChange={sortBy} />

        <CreatePostComponent onSubmit={submitPost} />

        <ImportPostComponent onSubmit={submitImportPost} />

        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          className={style.child}
          dataLength={state.posts.length + 100}
          next={loadMorePost}
          hasMore={hasMore}
          loader={<LoadingPage />}>
          {state.posts.map((post: Post, i: number) => (
            <Grow key={i}>
              <PostComponent post={post} open={false} reply={handleReply} loadComments={loadComments} />
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
