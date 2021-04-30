import React, { createRef, useCallback, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import CircularProgress from '@material-ui/core/CircularProgress';

import FilterTimelineComponent from './filter.component';
import PostComponent from './post/post.component';
import CreatePostComponent from './submit.component';
import { useTimeline } from './timeline.context';
import { useStyles } from './timeline.style';
import { usePost } from './use-post.hook';

import { Post, Comment } from 'src/interfaces/post';

const Timeline = () => {
  const style = useStyles();

  const { state } = useTimeline();
  const { hasMore, loadPost, loadMorePost, reply, loadComments } = usePost();
  const scrollRoot = createRef<HTMLDivElement>();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    if (state.filter.tags.length > 0 || state.filter.people.length > 0) {
      console.log('LOAD POST');
      loadPost();
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

  console.log('TIMELINE COMPONENT LOAD');

  return (
    <div className={style.root}>
      <div className={style.scroll} ref={scrollRoot} id="scrollable-timeline">
        <FilterTimelineComponent />

        <CreatePostComponent />

        <InfiniteScroll
          scrollableTarget="scrollable-timeline"
          className={style.child}
          dataLength={state.posts.length + 100}
          next={loadMorePost}
          hasMore={hasMore}
          loader={<CircularProgress className={style.loading} disableShrink />}>
          {state.posts.map((post: Post, i: number) => (
            <PostComponent post={post} open={false} key={i} reply={handleReply} loadComments={loadComments} />
          ))}
        </InfiniteScroll>
      </div>
      <div id="fb-root" />
    </div>
  );
};

export default Timeline;
